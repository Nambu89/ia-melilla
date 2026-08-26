import { apiPost, apiPostStream, ApiError } from "@/lib/apiClient";

export interface Slot {
	iso: string;
	human: string;
}

export interface Booking {
	status: string; // booked | pending_confirmation | pending_human
	slot_iso?: string;
	human?: string;
	meet_link?: string;
}

export interface StartResponse {
	conversation_id: string;
	lead_id: string;
	greeting: string;
}

export type LeadMeta =
	| { type: "slots"; slots: Slot[] }
	| { type: "booking"; booking: Booking };

/** Arranca una conversación: valida RGPD + Turnstile + honeypot en el backend. */
export async function startConversation(
	baseUrl: string,
	gdprConsent: boolean,
	turnstileToken: string | null,
	website: string,
	signal?: AbortSignal,
): Promise<StartResponse> {
	const res = await apiPost<StartResponse>(
		baseUrl,
		"/api/lead-chat/start",
		{ gdpr_consent: gdprConsent, turnstile_token: turnstileToken, website },
		undefined,
		signal,
	);
	// Sin `conversation_id` no hay nada que hacer con el resto: mejor fallar aquí
	// que arrancar el chat y romperse en el primer envío.
	if (
		!res ||
		typeof res.conversation_id !== "string" ||
		!res.conversation_id.trim()
	) {
		throw new Error("Respuesta de arranque sin conversation_id");
	}
	// `greeting` acaba dentro de un nodo de React: si no es texto, tumbaría el
	// render entero. Preferimos un saludo vacío a un widget caído.
	return {
		...res,
		conversation_id: res.conversation_id.trim(),
		greeting: typeof res.greeting === "string" ? res.greeting : "",
	};
}

interface SendArgs {
	conversationId: string;
	message: string;
	selectedSlotIso?: string | null;
}

/**
 * Envía un turno y consume el SSE.
 * Eventos: `content` (texto), `meta` (slots/booking), `done`, `error`.
 */
export async function sendMessage(
	baseUrl: string,
	{ conversationId, message, selectedSlotIso }: SendArgs,
	onChunk: (chunk: string) => void,
	onMeta: (meta: LeadMeta) => void,
	signal?: AbortSignal,
): Promise<void> {
	const res = await apiPostStream(
		baseUrl,
		"/api/lead-chat/message",
		{
			conversation_id: conversationId,
			message,
			selected_slot_iso: selectedSlotIso ?? null,
		},
		undefined,
		signal,
	);
	await consumeStream(res, onChunk, onMeta, signal);
}

export { ApiError };

async function consumeStream(
	res: Response,
	onChunk: (chunk: string) => void,
	onMeta: (meta: LeadMeta) => void,
	signal?: AbortSignal,
): Promise<void> {
	// Un cuerpo vacío no es un turno correcto: sin él nunca llegaría el `done` y
	// el llamante daría el envío por bueno con la burbuja vacía puesta.
	if (!res.body) throw new Error("Respuesta sin cuerpo");
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	const process = (block: string): { stop: boolean } => {
		const lines = block.split(/\r?\n/);
		let eventType = "message";
		const dataLines: string[] = [];
		for (const line of lines) {
			if (line.startsWith("event:")) eventType = line.slice(6).trim();
			else if (line.startsWith("data:")) {
				const rest = line.slice(5);
				dataLines.push(rest.startsWith(" ") ? rest.slice(1) : rest);
			}
		}
		const payload = dataLines.join("\n");
		switch (eventType) {
			case "content":
				if (payload) onChunk(payload);
				return { stop: false };
			case "meta": {
				const meta = parseMeta(payload);
				if (meta) onMeta(meta);
				return { stop: false };
			}
			case "done":
				return { stop: true };
			case "error": {
				let msg = payload || "Stream error";
				try {
					const j = JSON.parse(payload) as { error?: string; message?: string };
					msg = j.error || j.message || payload;
				} catch {
					/* keep raw */
				}
				throw new Error(msg);
			}
			default:
				return { stop: false }; // thinking / message → ignorar
		}
	};

	try {
		while (true) {
			if (signal?.aborted) {
				// Abortar NO es terminar bien: si saliéramos por las buenas, el
				// llamante marcaría el turno como completado y la fase volvería a
				// "ready" con otra petición todavía en vuelo.
				throw new DOMException("Stream abortado", "AbortError");
			}
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			const blocks = buffer.split(/\r?\n\r?\n/);
			buffer = blocks.pop() ?? "";
			for (const block of blocks) {
				const trimmed = block.replace(/^[\r\n]+|[\r\n]+$/g, "");
				if (!trimmed) continue;
				if (process(trimmed).stop) return;
			}
		}
		const tail = buffer.replace(/^[\r\n]+|[\r\n]+$/g, "");
		if (tail && process(tail).stop) return;
		// El backend cierra SIEMPRE con `done`, en todas sus ramas. Llegar aquí es
		// una conexión cortada a media respuesta, no un turno completo.
		throw new Error("La respuesta se cortó antes de terminar");
	} finally {
		// Libera el lock del lector: al salir por `done` el cuerpo sigue abierto.
		void reader.cancel().catch(() => undefined);
	}
}

/**
 * El `meta` viene de la red: comprobamos la forma antes de creérnosla. Un
 * `{"type":"slots"}` sin `slots` dejaría el estado con `undefined` y la primera
 * lectura de `.length` tiraría el widget entero.
 */
function parseMeta(payload: string): LeadMeta | null {
	let raw: unknown;
	try {
		raw = JSON.parse(payload);
	} catch {
		return null;
	}
	if (typeof raw !== "object" || raw === null) return null;
	const meta = raw as Record<string, unknown>;
	if (meta.type === "slots" && Array.isArray(meta.slots)) {
		const slots = meta.slots.filter(
			(s): s is Slot =>
				typeof s === "object" &&
				s !== null &&
				typeof (s as Slot).iso === "string" &&
				typeof (s as Slot).human === "string",
		);
		return { type: "slots", slots };
	}
	if (
		meta.type === "booking" &&
		typeof meta.booking === "object" &&
		meta.booking !== null
	) {
		const b = meta.booking as Record<string, unknown>;
		if (typeof b.status !== "string") return null;
		// `human` y `meet_link` se pintan tal cual; si no son texto, se descartan
		// en vez de dejar que React reviente al encontrarse un objeto dentro.
		return {
			type: "booking",
			booking: {
				status: b.status,
				slot_iso: typeof b.slot_iso === "string" ? b.slot_iso : undefined,
				human: typeof b.human === "string" ? b.human : undefined,
				meet_link: typeof b.meet_link === "string" ? b.meet_link : undefined,
			},
		};
	}
	return null;
}
