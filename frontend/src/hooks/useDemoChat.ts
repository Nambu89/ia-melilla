import { useCallback, useEffect, useReducer, useRef } from "react";
import { apiPost, apiPostStream, ApiError } from "@/lib/apiClient";

export type Message = { role: "user" | "assistant"; content: string };

export type DemoChatStatus =
	| "logging_in"
	| "ready"
	| "asking"
	| "streaming"
	| "error";

interface State {
	status: DemoChatStatus;
	token: string | null;
	messages: Message[];
	errorMessage: string | null;
}

type Action =
	| { type: "LOGIN_OK"; token: string }
	| { type: "LOGIN_FAIL"; message: string }
	| { type: "ASK_START"; question: string }
	| { type: "STREAM_TOKEN"; chunk: string }
	| { type: "STREAM_DONE" }
	| { type: "STREAM_FAIL"; message: string }
	| { type: "RETRY" };

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "LOGIN_OK":
			return { ...state, status: "ready", token: action.token, errorMessage: null };
		case "LOGIN_FAIL":
			return { ...state, status: "error", errorMessage: action.message };
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
		case "RETRY":
			return { ...state, status: "logging_in", errorMessage: null };
		default:
			return state;
	}
}

interface LoginResponse {
	user: { id: string; email: string; name: string };
	tokens: { access_token: string; refresh_token: string; token_type: string };
}

const initialState: State = {
	status: "logging_in",
	token: null,
	messages: [],
	errorMessage: null,
};

export function useDemoChat() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
	const email = import.meta.env.VITE_DEMO_USER_EMAIL as string;
	const password = import.meta.env.VITE_DEMO_USER_PASSWORD as string;
	const abortRef = useRef<AbortController | null>(null);

	const login = useCallback(async () => {
		try {
			const res = await apiPost<LoginResponse>(baseUrl, "/auth/login", { email, password });
			dispatch({ type: "LOGIN_OK", token: res.tokens.access_token });
		} catch (err) {
			const msg =
				err instanceof ApiError
					? `No pudimos conectar con la demo (HTTP ${err.status}).`
					: "No pudimos conectar con la demo. Comprueba tu conexion.";
			dispatch({ type: "LOGIN_FAIL", message: msg });
		}
	}, [baseUrl, email, password]);

	useEffect(() => {
		void login();
		return () => {
			abortRef.current?.abort();
		};
	}, [login]);

	const ask = useCallback(
		async (question: string) => {
			if (!question.trim() || !state.token) return;
			// Abort any in-flight stream before starting a new one
			abortRef.current?.abort();
			dispatch({ type: "ASK_START", question: question.trim() });
			const controller = new AbortController();
			abortRef.current = controller;
			try {
				const res = await apiPostStream(
					baseUrl,
					"/api/ask/stream",
					{ question: question.trim(), conversation_id: null },
					state.token,
					controller.signal,
				);
				await consumeStream(res, (chunk) => dispatch({ type: "STREAM_TOKEN", chunk }), controller.signal);
				dispatch({ type: "STREAM_DONE" });
			} catch (err) {
				if ((err as Error).name === "AbortError") return;
				const isApiError = err instanceof ApiError || (err as Error).name === "ApiError";
				const msg =
					isApiError
						? `Error del servidor (HTTP ${(err as ApiError).status}). Intentalo de nuevo.`
						: "Conexion perdida. Intentalo de nuevo.";
				dispatch({ type: "STREAM_FAIL", message: msg });
			}
		},
		[baseUrl, state.token],
	);

	const retry = useCallback(() => {
		dispatch({ type: "RETRY" });
		void login();
	}, [login]);

	return {
		status: state.status,
		messages: state.messages,
		errorMessage: state.errorMessage,
		ask,
		retry,
	};
}

/**
 * Consume an SSE stream emitted by sse_starlette (Fiscal IA Melilla backend).
 *
 * Event boundary: blank line (`\r\n\r\n` or `\n\n`).
 * Each event block has:
 *   - `event: <type>` line (optional, defaults to "message")
 *   - One or more `data: <text>` lines
 *
 * Multiple `data:` lines within a single event are joined with `\n` to
 * reconstruct the full payload (per SSE spec).
 *
 * Event types handled:
 *   - `content`  → emit payload as text chunk
 *   - `done`     → terminate stream (payload is JSON {conversation_id} — ignored in MVP)
 *   - `error`    → throw with payload.error / payload.message / raw text
 *   - others (thinking/tool_call/tool_result/message) → ignored (chain-of-thought)
 */
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
				// Strip one leading space if present (per SSE spec)
				const rest = line.slice(5);
				dataLines.push(rest.startsWith(" ") ? rest.slice(1) : rest);
			}
			// Comments (lines starting with ":") and unknown fields are ignored
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
				} catch {
					// payload not JSON — keep raw text
				}
				throw new Error(msg);
			}
			default:
				// thinking / tool_call / tool_result / message — ignored in MVP
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

		// Split on event boundary (blank line, with optional CR)
		const blocks = buffer.split(/\r?\n\r?\n/);
		buffer = blocks.pop() ?? "";

		for (const block of blocks) {
			const trimmed = block.replace(/^[\r\n]+|[\r\n]+$/g, "");
			if (!trimmed) continue;
			const { stop } = processEvent(trimmed);
			if (stop) return;
		}
	}

	// Flush trailing event if any (no terminating blank line)
	const tail = buffer.replace(/^[\r\n]+|[\r\n]+$/g, "");
	if (tail) {
		processEvent(tail);
	}
}
