import { useCallback, useReducer, useRef } from "react";
import { apiPostStream, ApiError } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

/**
 * Variante del chat para DefensIA. Llama a POST /api/defensia/chat (no a
 * /api/ask/stream). Body distinto: { message, chat_history } en lugar de
 * { question, conversation_id }. Mantiene historial conversacional en el
 * cliente para enviarlo en cada turno.
 */

export type DefensiaMessage = { role: "user" | "assistant"; content: string };

export type DefensiaChatStatus = "ready" | "streaming" | "error";

interface State {
	status: DefensiaChatStatus;
	messages: DefensiaMessage[];
	errorMessage: string | null;
}

type Action =
	| { type: "ASK_START"; question: string }
	| { type: "STREAM_TOKEN"; chunk: string }
	| { type: "STREAM_DONE" }
	| { type: "STREAM_FAIL"; message: string }
	| { type: "RESET" };

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "ASK_START":
			return {
				...state,
				status: "streaming",
				messages: [
					...state.messages,
					{ role: "user", content: action.question },
					{ role: "assistant", content: "" },
				],
				errorMessage: null,
			};
		case "STREAM_TOKEN": {
			const msgs = [...state.messages];
			const last = msgs[msgs.length - 1];
			if (last && last.role === "assistant") {
				msgs[msgs.length - 1] = { ...last, content: last.content + action.chunk };
			}
			return { ...state, messages: msgs };
		}
		case "STREAM_DONE":
			return { ...state, status: "ready" };
		case "STREAM_FAIL":
			return { ...state, status: "error", errorMessage: action.message };
		case "RESET":
			return { ...state, status: "ready", errorMessage: null };
		default:
			return state;
	}
}

const initialState: State = { status: "ready", messages: [], errorMessage: null };

export function useDefensiaChat() {
	const { session } = useAuth();
	const [state, dispatch] = useReducer(reducer, initialState);
	const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
	const abortRef = useRef<AbortController | null>(null);

	const ask = useCallback(
		async (question: string) => {
			const token = session?.tokens.access_token;
			if (!question.trim()) return;
			if (!token) {
				dispatch({ type: "STREAM_FAIL", message: "Sesión expirada." });
				return;
			}
			abortRef.current?.abort();
			// Snapshot del historial ANTES de añadir la nueva pregunta — backend recibe
			// los turnos previos para mantener contexto conversacional
			const chatHistory = state.messages
				.filter((m) => m.content.trim() !== "")
				.map((m) => ({ role: m.role, content: m.content }));
			dispatch({ type: "ASK_START", question: question.trim() });
			const controller = new AbortController();
			abortRef.current = controller;
			try {
				const res = await apiPostStream(
					baseUrl,
					"/api/defensia/chat",
					{ message: question.trim(), chat_history: chatHistory },
					token,
					controller.signal,
				);
				await consumeStream(
					res,
					(chunk) => dispatch({ type: "STREAM_TOKEN", chunk }),
					controller.signal,
				);
				dispatch({ type: "STREAM_DONE" });
			} catch (err) {
				if ((err as Error).name === "AbortError") return;
				const isApiError = err instanceof ApiError;
				const msg = isApiError
					? (err as ApiError).status === 401
						? "Tu sesión ha expirado. Vuelve a iniciar sesión."
						: `Error del servidor (HTTP ${(err as ApiError).status}). Inténtalo de nuevo.`
					: "Conexión perdida. Inténtalo de nuevo.";
				dispatch({ type: "STREAM_FAIL", message: msg });
			}
		},
		[baseUrl, session, state.messages],
	);

	const retry = useCallback(() => dispatch({ type: "RESET" }), []);

	return {
		status: state.status,
		messages: state.messages,
		errorMessage: state.errorMessage,
		ask,
		retry,
	};
}

async function consumeStream(
	res: Response,
	onChunk: (chunk: string) => void,
	signal?: AbortSignal,
): Promise<void> {
	if (!res.body) return;
	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	const processEvent = (eventBlock: string): { stop: boolean } => {
		const lines = eventBlock.split(/\r?\n/);
		let eventType = "message";
		const dataLines: string[] = [];
		for (const line of lines) {
			if (line.startsWith("event:")) {
				eventType = line.slice(6).trim();
			} else if (line.startsWith("data:")) {
				const rest = line.slice(5);
				dataLines.push(rest.startsWith(" ") ? rest.slice(1) : rest);
			}
		}
		const payload = dataLines.join("\n");

		switch (eventType) {
			case "content":
				if (payload) onChunk(payload);
				return { stop: false };
			case "done":
				return { stop: true };
			case "error": {
				let msg = payload || "Stream error";
				try {
					const j = JSON.parse(payload) as { error?: string; message?: string };
					msg = j.error || j.message || payload;
				} catch {}
				throw new Error(msg);
			}
			default:
				return { stop: false };
		}
	};

	while (true) {
		if (signal?.aborted) {
			await reader.cancel();
			return;
		}
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		const blocks = buffer.split(/\r?\n\r?\n/);
		buffer = blocks.pop() ?? "";

		for (const block of blocks) {
			const trimmed = block.replace(/^[\r\n]+|[\r\n]+$/g, "");
			if (!trimmed) continue;
			const { stop } = processEvent(trimmed);
			if (stop) return;
		}
	}

	const tail = buffer.replace(/^[\r\n]+|[\r\n]+$/g, "");
	if (tail) processEvent(tail);
}
