import { useCallback, useEffect, useReducer, useRef } from "react";
import {
	ApiError,
	startConversation,
	sendMessage,
	type Booking,
	type LeadMeta,
	type Slot,
} from "./leadChatApi";

export type Message = { role: "user" | "assistant"; content: string };
export type LeadChatPhase = "consent" | "starting" | "ready" | "sending";

interface State {
	phase: LeadChatPhase;
	conversationId: string | null;
	messages: Message[];
	slots: Slot[];
	booking: Booking | null;
	errorMessage: string | null;
}

type Action =
	| { type: "START" }
	| { type: "STARTED"; conversationId: string; greeting: string }
	| { type: "START_FAIL"; message: string }
	| { type: "SEND"; message: string }
	| { type: "CHUNK"; chunk: string }
	| { type: "META"; meta: LeadMeta }
	| { type: "SEND_DONE" }
	| { type: "SEND_FAIL"; message: string }
	| { type: "RESET" };

const initialState: State = {
	phase: "consent",
	conversationId: null,
	messages: [],
	slots: [],
	booking: null,
	errorMessage: null,
};

/** Quita la burbuja del asistente si el turno terminó sin una sola letra. */
function sinBurbujaVacia(messages: Message[]): Message[] {
	const last = messages[messages.length - 1];
	if (last && last.role === "assistant" && last.content === "") {
		return messages.slice(0, -1);
	}
	return messages;
}

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "START":
			return { ...state, phase: "starting", errorMessage: null };
		case "STARTED":
			return {
				...state,
				phase: "ready",
				conversationId: action.conversationId,
				// Un saludo vacío no pinta burbuja: la burbuja sin texto son los
				// puntitos de "escribiendo", y ahí no hay nadie escribiendo.
				messages: action.greeting
					? [{ role: "assistant", content: action.greeting }]
					: [],
			};
		// Volvemos al consentimiento, no a una fase "error" sin salida: si el
		// backend está caído o el módulo apagado, el visitante tiene que poder
		// reintentar sin recargar la página.
		case "START_FAIL":
			return { ...state, phase: "consent", errorMessage: action.message };
		case "SEND":
			return {
				...state,
				phase: "sending",
				slots: [],
				errorMessage: null,
				messages: [
					...state.messages,
					{ role: "user", content: action.message },
					{ role: "assistant", content: "" },
				],
			};
		case "CHUNK": {
			const msgs = [...state.messages];
			const last = msgs[msgs.length - 1];
			if (last && last.role === "assistant") {
				msgs[msgs.length - 1] = {
					...last,
					content: last.content + action.chunk,
				};
			}
			return { ...state, messages: msgs };
		}
		case "META":
			if (action.meta.type === "slots")
				return { ...state, slots: action.meta.slots };
			if (action.meta.type === "booking")
				return { ...state, booking: action.meta.booking };
			return state;
		// Un turno que acaba sin texto —sólo `meta`, por ejemplo— dejaría la
		// burbuja vacía de "SEND" con los puntitos puestos para siempre.
		case "SEND_DONE":
			return {
				...state,
				phase: "ready",
				messages: sinBurbujaVacia(state.messages),
			};
		// Igual que arriba: se vuelve a "ready" para poder reintentar, y se retira
		// la burbuja vacía que "SEND" dejó preparada.
		case "SEND_FAIL":
			return {
				...state,
				phase: "ready",
				messages: sinBurbujaVacia(state.messages),
				errorMessage: action.message,
			};
		case "RESET":
			return initialState;
		default:
			return state;
	}
}

/**
 * Un 404 o un 5xx al arrancar casi siempre significa que el módulo del leadbot
 * no está montado en el backend (`LEADBOT_ENABLED` apagado). Al visitante no le
 * dice nada el código HTTP, así que sólo lo enseñamos cuando puede ayudar a
 * soporte a distinguir el caso.
 */
function startErrorMessage(err: unknown): string {
	if (!(err instanceof ApiError)) {
		return "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.";
	}
	if (err.status === 404 || err.status >= 500) {
		return "El asistente no está disponible ahora mismo. Inténtalo más tarde.";
	}
	if (err.status === 429) {
		return "Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.";
	}
	return `No pudimos iniciar el chat (HTTP ${err.status}).`;
}

export function useLeadChat() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
	const abortRef = useRef<AbortController | null>(null);
	const startAbortRef = useRef<AbortController | null>(null);

	// Al desmontar, corta lo que quedara en vuelo —arranque y stream— en vez de
	// dejar la petición y sus callbacks vivos.
	useEffect(
		() => () => {
			startAbortRef.current?.abort();
			abortRef.current?.abort();
		},
		[],
	);

	/** Devuelve `false` si el arranque falló, para que el llamante pueda reaccionar. */
	const begin = useCallback(
		async (turnstileToken: string | null, website = ""): Promise<boolean> => {
			startAbortRef.current?.abort();
			const controller = new AbortController();
			startAbortRef.current = controller;
			dispatch({ type: "START" });
			try {
				const res = await startConversation(
					baseUrl,
					true,
					turnstileToken,
					website,
					controller.signal,
				);
				dispatch({
					type: "STARTED",
					conversationId: res.conversation_id,
					greeting: res.greeting,
				});
				return true;
			} catch (err) {
				if ((err as Error).name === "AbortError") return false;
				dispatch({ type: "START_FAIL", message: startErrorMessage(err) });
				return false;
			}
		},
		[baseUrl],
	);

	const send = useCallback(
		async (message: string, selectedSlotIso?: string | null) => {
			const text = message.trim();
			if (!text || !state.conversationId || state.phase === "sending") return;
			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;
			dispatch({ type: "SEND", message: text });
			try {
				await sendMessage(
					baseUrl,
					{
						conversationId: state.conversationId,
						message: text,
						selectedSlotIso,
					},
					(chunk) => dispatch({ type: "CHUNK", chunk }),
					(meta) => dispatch({ type: "META", meta }),
					controller.signal,
				);
				dispatch({ type: "SEND_DONE" });
			} catch (err) {
				if ((err as Error).name === "AbortError") return;
				const msg =
					err instanceof ApiError
						? `Error del servidor (HTTP ${err.status}). Inténtalo de nuevo.`
						: "Conexión perdida. Inténtalo de nuevo.";
				dispatch({ type: "SEND_FAIL", message: msg });
			}
		},
		[baseUrl, state.conversationId, state.phase],
	);

	const pickSlot = useCallback(
		(slot: Slot) => {
			void send(`Me viene bien el ${slot.human}.`, slot.iso);
		},
		[send],
	);

	return {
		phase: state.phase,
		messages: state.messages,
		slots: state.slots,
		booking: state.booking,
		errorMessage: state.errorMessage,
		begin,
		send,
		pickSlot,
	};
}
