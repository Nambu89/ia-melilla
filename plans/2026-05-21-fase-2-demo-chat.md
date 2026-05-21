# Fase 2 — DemoIaFiscal Live Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir `DemoChatPlaceholder` por widget funcional que se conecta al backend Fiscal IA Melilla (RAG fiscal Melilla, FastAPI white-label separado del frontend) via login silencioso JWT + streaming SSE, con suggested questions, disclaimer permanente y retry UX.

**Architecture:** Cliente fetch wrapper (`apiClient.ts`) maneja JWT bearer + JSON. Hook `useDemoChat` mantiene state machine (idle → logging-in → ready → asking → streaming → done | error) y consume `/auth/login` + `/api/ask/stream` con `ReadableStream` reader (NO EventSource, porque EventSource no soporta POST + Authorization header). Componente `DemoChat` renderiza burbujas user/assistant + input enabled + lista suggested questions + disclaimer fijo + retry button on error. Sesion efimera por visitante (token en useState, recarga = nuevo chat). Cero historial cross-session, cero localStorage.

**Tech Stack:**
- React 19 (existing)
- TypeScript 6 strict
- Tailwind v4 + DESIGN.md tokens charcoal+emerald (existing)
- Vitest + RTL + jsdom (existing)
- anime.js v4 para fade-in burbujas (existing dep)
- Native `fetch` + `ReadableStream` (NO eventsource lib — overkill para nuestro caso)
- Vite env vars: `import.meta.env.VITE_*`

**Backend endpoints reales (verificados via OpenAPI + smoke test 2026-05-21)**:
- `POST /auth/login` body `{email, password}` → 200 `{user:{id,email,name,...}, tokens:{access_token, refresh_token, token_type:"bearer"}}` (token NESTED en `tokens.access_token`, NO top-level)
- `POST /api/ask/stream` headers `Authorization: Bearer <jwt>` + `Content-Type: application/json`, body `{question: string(1-1000 chars), conversation_id?: string|null, workspace_id?: string|null, session_doc_ids?: array|null, k?: int(1-10, default 5)}` → 200 streaming response (SSE-like). 403 si subscription guard activo (resuelto upstream en commit 8ca8556).

**Stream response format (verificado 2026-05-21 — sse_starlette)**:

- Lineas terminan con CRLF (`\r\n`)
- Cada evento es un bloque de lineas separado por linea en blanco `\r\n\r\n`
- Cada bloque tiene una linea `event: <tipo>` + una o mas lineas `data: <texto>`
- Para reconstruir el contenido completo de un evento, las multiples `data:` lines se unen con `\n`
- Tipos de evento: `content` (token streaming, payload = texto), `done` (final, payload = JSON `{conversation_id}`), `error` (4xx/5xx wrapped, payload = JSON `{error|message}`), `thinking`/`tool_call`/`tool_result` (opcionales chain-of-thought, **se ignoran en MVP**)

Ejemplo de estructura real capturado (texto del mensaje no es relevante — backend tiene un bug menor en `warmup_service.py` con strings residuales del fork upstream que se arreglara por separado; el frontend NO debe asumir ningun copy concreto):
```
event: content\r\n
data: <linea 1 del texto streaming>\r\n
data: \r\n
data: <linea 3 del texto streaming>\r\n
\r\n
event: done\r\n
data: {"conversation_id": "<uuid>"}\r\n
\r\n
```

El parser de `consumeStream` esta diseñado especificamente para este formato. **Capturamos solo `event` + `data` lines, no nos importa el texto exacto del payload**.

---

## Scope decisions

**IN scope**:
- Login silencioso al montar pagina
- Input enabled + envio sync (Enter o boton)
- Streaming render token-a-token
- Suggested questions clicables (rellenan + envian)
- Disclaimer literal fijo bajo el chat
- Manejo error: backend 5xx/timeout/network → mensaje + boton "Reintentar"
- Tests Vitest del hook (login + parsing chunks + error flow)

**OUT scope** (deferred):
- Historial conversaciones cross-session (localStorage / DB)
- Subir archivos
- Multi-turn con `conversation_id` persistido (cada pregunta = nueva conversacion en MVP)
- Citas/fuentes destacadas (si vienen en stream, se renderizan tal cual como texto)
- Refresh token automatico (1h TTL es suficiente para sesion demo media de <5 min)
- Otros endpoints backend (workspaces, payslips, etc.)

---

## File Structure

```
frontend/
├── .env.example                                            # NUEVO — documenta vars VITE_*
├── src/
│   ├── lib/
│   │   ├── api.ts                                          # existing (submitContact stub)
│   │   ├── apiClient.ts                                    # NUEVO — fetch wrapper Bearer + JSON + AbortSignal
│   │   └── __tests__/
│   │       └── apiClient.test.ts                           # NUEVO
│   ├── hooks/
│   │   ├── useDemoChat.ts                                  # NUEVO — state machine login + streaming
│   │   └── __tests__/
│   │       └── useDemoChat.test.ts                         # NUEVO
│   ├── components/
│   │   └── demo/
│   │       ├── DemoChat.tsx                                # NUEVO — UI real (sustituye placeholder)
│   │       ├── DemoChatPlaceholder.tsx                     # ELIMINAR (post-merge)
│   │       └── __tests__/
│   │           └── DemoChat.test.tsx                       # NUEVO — disclaimer + suggested questions + click flow
│   └── pages/
│       └── DemoIaFiscal.tsx                                # MODIFY — usar DemoChat
```

---

## Task 1: Env vars + apiClient wrapper

**Files:**
- Create: `frontend/.env.example`
- Create: `frontend/src/lib/apiClient.ts`
- Create: `frontend/src/lib/__tests__/apiClient.test.ts`

- [ ] **Step 1: Crear `.env.example`**

Create `frontend/.env.example`:
```dotenv
# Backend API base URL (Fiscal IA Melilla — FastAPI white-label demo)
VITE_API_BASE_URL=http://g100ae8up9ehmq4w0mn9od97.178.238.227.50.sslip.io

# Credenciales demo publicas (no sensitive — backend es demo abierto)
VITE_DEMO_USER_EMAIL=demo@example.com
VITE_DEMO_USER_PASSWORD=opCV-2Jf8zzq!X_7V1dTRfYZ3LF3
```

- [ ] **Step 2: Crear .env local (gitignored)**

Copy `.env.example` → `.env`:
```bash
cd frontend
cp .env.example .env
```

Verify `.env` is already gitignored (root `.gitignore` line 2-4: `.env`, `.env.*`, `!.env.example`).

- [ ] **Step 3: Escribir test apiClient — caso success**

Create `frontend/src/lib/__tests__/apiClient.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiPost } from "../apiClient";

describe("apiClient.apiPost", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("envia POST JSON con Authorization Bearer si token provided", async () => {
		const mockFetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", mockFetch);
		const res = await apiPost<{ ok: boolean }>("https://api.test", "/x", { a: 1 }, "TOKEN123");
		expect(res).toEqual({ ok: true });
		expect(mockFetch).toHaveBeenCalledOnce();
		const [url, init] = mockFetch.mock.calls[0];
		expect(url).toBe("https://api.test/x");
		expect(init.method).toBe("POST");
		expect(init.headers["Authorization"]).toBe("Bearer TOKEN123");
		expect(init.headers["Content-Type"]).toBe("application/json");
		expect(init.body).toBe(JSON.stringify({ a: 1 }));
	});

	it("omite Authorization si token vacio", async () => {
		const mockFetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), { status: 200 }),
		);
		vi.stubGlobal("fetch", mockFetch);
		await apiPost("https://api.test", "/x", {});
		const [, init] = mockFetch.mock.calls[0];
		expect(init.headers["Authorization"]).toBeUndefined();
	});

	it("lanza ApiError con status y body si response no-ok", async () => {
		const mockFetch = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ error: "bad" }), { status: 403 }),
		);
		vi.stubGlobal("fetch", mockFetch);
		await expect(apiPost("https://api.test", "/x", {})).rejects.toMatchObject({
			status: 403,
			body: { error: "bad" },
		});
	});
});
```

- [ ] **Step 4: Run test, verify it fails**

Run: `cd frontend && npm test -- --run apiClient.test`
Expected: FAIL with "Cannot find module '../apiClient'"

- [ ] **Step 5: Implementar apiClient**

Create `frontend/src/lib/apiClient.ts`:
```ts
export class ApiError extends Error {
	constructor(
		public status: number,
		public body: unknown,
		message?: string,
	) {
		super(message ?? `HTTP ${status}`);
		this.name = "ApiError";
	}
}

export async function apiPost<T>(
	baseUrl: string,
	path: string,
	body: unknown,
	token?: string,
	signal?: AbortSignal,
): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};
	if (token) headers["Authorization"] = `Bearer ${token}`;

	const res = await fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers,
		body: JSON.stringify(body),
		signal,
	});

	if (!res.ok) {
		let parsed: unknown;
		try {
			parsed = await res.json();
		} catch {
			parsed = await res.text();
		}
		throw new ApiError(res.status, parsed);
	}

	return (await res.json()) as T;
}

/**
 * Returns the underlying Response so the caller can consume a stream body.
 * Throws ApiError on non-OK status (after parsing error body).
 * Pass `signal` to abort the request mid-stream from the caller.
 */
export async function apiPostStream(
	baseUrl: string,
	path: string,
	body: unknown,
	token?: string,
	signal?: AbortSignal,
): Promise<Response> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Accept: "text/event-stream, application/x-ndjson, application/json",
	};
	if (token) headers["Authorization"] = `Bearer ${token}`;

	const res = await fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers,
		body: JSON.stringify(body),
		signal,
	});

	if (!res.ok) {
		let parsed: unknown;
		try {
			parsed = await res.json();
		} catch {
			parsed = await res.text();
		}
		throw new ApiError(res.status, parsed);
	}

	return res;
}
```

- [ ] **Step 6: Run test, verify it passes**

Run: `cd frontend && npm test -- --run apiClient.test`
Expected: 3 tests pass.

- [ ] **Step 7: Commit**

```bash
git add frontend/.env.example frontend/src/lib/apiClient.ts frontend/src/lib/__tests__/apiClient.test.ts
git commit -m "feat(frontend): apiClient wrapper + env vars for demo backend"
```

---

## Task 2: useDemoChat hook — login state

**Files:**
- Create: `frontend/src/hooks/useDemoChat.ts`
- Create: `frontend/src/hooks/__tests__/useDemoChat.test.ts`

- [ ] **Step 1: Escribir test login OK**

Create `frontend/src/hooks/__tests__/useDemoChat.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useDemoChat } from "../useDemoChat";

describe("useDemoChat", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
		vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
		vi.stubEnv("VITE_DEMO_USER_EMAIL", "demo@example.com");
		vi.stubEnv("VITE_DEMO_USER_PASSWORD", "secret");
	});

	it("hace login silencioso al montar y queda en estado ready", async () => {
		const mockFetch = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					user: { id: "u1", email: "demo@example.com", name: "Demo" },
					tokens: { access_token: "JWT123", refresh_token: "R", token_type: "bearer" },
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } },
			),
		);
		vi.stubGlobal("fetch", mockFetch);

		const { result } = renderHook(() => useDemoChat());
		expect(result.current.status).toBe("logging_in");

		await waitFor(() => expect(result.current.status).toBe("ready"));
		expect(mockFetch).toHaveBeenCalledOnce();
		const [url, init] = mockFetch.mock.calls[0];
		expect(url).toBe("https://api.test/auth/login");
		expect(JSON.parse(init.body as string)).toEqual({
			email: "demo@example.com",
			password: "secret",
		});
	});

	it("queda en estado error si login falla", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(JSON.stringify({ error: "invalid" }), { status: 401 }),
			),
		);
		const { result } = renderHook(() => useDemoChat());
		await waitFor(() => expect(result.current.status).toBe("error"));
		expect(result.current.errorMessage).toBeTruthy();
	});
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `cd frontend && npm test -- --run useDemoChat.test`
Expected: FAIL with "Cannot find module '../useDemoChat'"

- [ ] **Step 3: Implementar hook con login + state machine inicial**

Create `frontend/src/hooks/useDemoChat.ts`:
```ts
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
				const msg =
					err instanceof ApiError
						? `Error del servidor (HTTP ${err.status}). Intentalo de nuevo.`
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
```

- [ ] **Step 4: Run test, verify it passes**

Run: `cd frontend && npm test -- --run useDemoChat.test`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/hooks/useDemoChat.ts frontend/src/hooks/__tests__/useDemoChat.test.ts
git commit -m "feat(frontend): useDemoChat hook with login state machine + stream consumer"
```

---

## Task 3: useDemoChat — streaming ask + retry

**Files:**
- Modify: `frontend/src/hooks/__tests__/useDemoChat.test.ts`

- [ ] **Step 1: Anadir test streaming ask flow**

Append to `frontend/src/hooks/__tests__/useDemoChat.test.ts` (inside the same `describe` block, before its closing brace):
```ts
	it("ask() dispara streaming, parsea eventos SSE sse_starlette y termina en ready", async () => {
		const loginResponse = new Response(
			JSON.stringify({
				user: { id: "u1", email: "demo@example.com", name: "Demo" },
				tokens: { access_token: "JWT", refresh_token: "R", token_type: "bearer" },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);

		// Real backend format: event/data blocks separated by blank line.
		// Multiple data: lines join with \n. Content event = text payload (not JSON).
		const sseBody =
			"event: content\r\n" +
			"data: Hola mundo\r\n" +
			"\r\n" +
			"event: content\r\n" +
			"data: ¿Como estas?\r\n" +
			"\r\n" +
			"event: done\r\n" +
			'data: {"conversation_id": "abc-123"}\r\n' +
			"\r\n";
		const askResponse = new Response(sseBody, {
			status: 200,
			headers: { "Content-Type": "text/event-stream" },
		});

		const mockFetch = vi
			.fn()
			.mockResolvedValueOnce(loginResponse)
			.mockResolvedValueOnce(askResponse);
		vi.stubGlobal("fetch", mockFetch);

		const { result } = renderHook(() => useDemoChat());
		await waitFor(() => expect(result.current.status).toBe("ready"));

		await act(async () => {
			await result.current.ask("Pregunta?");
		});

		expect(result.current.status).toBe("ready");
		expect(result.current.messages).toHaveLength(2);
		expect(result.current.messages[0]).toEqual({ role: "user", content: "Pregunta?" });
		expect(result.current.messages[1]).toEqual({
			role: "assistant",
			content: "Hola mundo¿Como estas?",
		});

		const askCall = mockFetch.mock.calls[1];
		expect(askCall[0]).toBe("https://api.test/api/ask/stream");
		expect((askCall[1] as RequestInit).headers).toMatchObject({
			Authorization: "Bearer JWT",
		});
	});

	it("ask() concatena multiples 'data:' lines de un mismo evento con \\n", async () => {
		const loginResponse = new Response(
			JSON.stringify({
				user: { id: "u1", email: "demo@example.com", name: "Demo" },
				tokens: { access_token: "JWT", refresh_token: "R", token_type: "bearer" },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);

		// Single content event with 3 data lines (mirrors real backend output)
		const sseBody =
			"event: content\r\n" +
			"data: Linea 1\r\n" +
			"data: \r\n" +
			"data: Linea 3\r\n" +
			"\r\n" +
			"event: done\r\n" +
			'data: {"conversation_id": "x"}\r\n' +
			"\r\n";
		const askResponse = new Response(sseBody, {
			status: 200,
			headers: { "Content-Type": "text/event-stream" },
		});

		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValueOnce(loginResponse).mockResolvedValueOnce(askResponse),
		);

		const { result } = renderHook(() => useDemoChat());
		await waitFor(() => expect(result.current.status).toBe("ready"));
		await act(async () => {
			await result.current.ask("Test?");
		});

		expect(result.current.messages[1].content).toBe("Linea 1\n\nLinea 3");
	});

	it("ask() ignora eventos 'thinking' y 'tool_call'", async () => {
		const loginResponse = new Response(
			JSON.stringify({
				user: { id: "u1", email: "demo@example.com", name: "Demo" },
				tokens: { access_token: "JWT", refresh_token: "R", token_type: "bearer" },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);

		const sseBody =
			"event: thinking\r\n" +
			"data: pensando...\r\n" +
			"\r\n" +
			"event: tool_call\r\n" +
			'data: {"tool":"rag"}\r\n' +
			"\r\n" +
			"event: content\r\n" +
			"data: Respuesta final\r\n" +
			"\r\n" +
			"event: done\r\n" +
			'data: {"conversation_id":"y"}\r\n' +
			"\r\n";
		const askResponse = new Response(sseBody, {
			status: 200,
			headers: { "Content-Type": "text/event-stream" },
		});

		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValueOnce(loginResponse).mockResolvedValueOnce(askResponse),
		);

		const { result } = renderHook(() => useDemoChat());
		await waitFor(() => expect(result.current.status).toBe("ready"));
		await act(async () => {
			await result.current.ask("Hola?");
		});

		expect(result.current.messages[1].content).toBe("Respuesta final");
	});

	it("ask() con backend 5xx deja errorMessage y permite retry()", async () => {
		const loginResponse = new Response(
			JSON.stringify({
				user: { id: "u1", email: "x", name: "x" },
				tokens: { access_token: "T", refresh_token: "R", token_type: "bearer" },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);

		const mockFetch = vi
			.fn()
			.mockResolvedValueOnce(loginResponse)
			.mockResolvedValueOnce(new Response("boom", { status: 500 }))
			.mockResolvedValueOnce(loginResponse);
		vi.stubGlobal("fetch", mockFetch);

		const { result } = renderHook(() => useDemoChat());
		await waitFor(() => expect(result.current.status).toBe("ready"));

		await act(async () => {
			await result.current.ask("Falla?");
		});
		expect(result.current.status).toBe("error");
		expect(result.current.errorMessage).toContain("500");

		act(() => result.current.retry());
		await waitFor(() => expect(result.current.status).toBe("ready"));
		expect(result.current.errorMessage).toBeNull();
	});
```

- [ ] **Step 2: Run tests**

Run: `cd frontend && npm test -- --run useDemoChat.test`
Expected: 4 tests pass (2 nuevos + 2 anteriores).

Si el test "streaming ask flow" falla en parsing, NO inventes fixes. El stream consumer ya soporta SSE `data: {...}\n\n` y NDJSON. Si falla, lee el error literal y ajusta el test fixture, no el production code (es porque el test fixture esta mal formado).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/hooks/__tests__/useDemoChat.test.ts
git commit -m "test(frontend): useDemoChat streaming + retry flows"
```

---

## Task 4: DemoChat component UI

**Files:**
- Create: `frontend/src/components/demo/DemoChat.tsx`
- Modify: `frontend/src/pages/DemoIaFiscal.tsx`
- Delete: `frontend/src/components/demo/DemoChatPlaceholder.tsx`

- [ ] **Step 1: Crear DemoChat component**

Create `frontend/src/components/demo/DemoChat.tsx`:
```tsx
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Send, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDemoChat } from "@/hooks/useDemoChat";
import { useAnimeEntry } from "@/components/animations/useAnimeEntry";

interface DemoChatProps {
	suggestedQuestions: readonly string[];
}

const DISCLAIMER =
	"Demo informativa basada en normativa de Melilla. No constituye asesoramiento fiscal vinculante. Consulta a un profesional para tu caso concreto.";

export function DemoChat({ suggestedQuestions }: DemoChatProps) {
	const { status, messages, errorMessage, ask, retry } = useDemoChat();
	const [draft, setDraft] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	const busy = status === "logging_in" || status === "streaming";

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
	}, [messages]);

	function submit(question: string) {
		if (!question.trim() || busy) return;
		setDraft("");
		void ask(question);
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		submit(draft);
	}

	function handleKey(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit(draft);
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<div
				ref={scrollRef}
				className="rounded-xl border border-outline-variant bg-surface-container max-h-[480px] min-h-[320px] overflow-y-auto p-6"
				aria-live="polite"
				aria-busy={busy}
			>
				{messages.length === 0 && status !== "error" && (
					<EmptyState loading={status === "logging_in"} />
				)}
				{messages.map((m, i) => (
					<ChatBubble key={i} role={m.role} content={m.content} streaming={status === "streaming" && i === messages.length - 1 && m.role === "assistant"} />
				))}
				{status === "error" && errorMessage && (
					<div
						role="alert"
						className="mt-4 flex items-start gap-3 rounded-md border border-error bg-error-container p-4 text-on-error-container"
					>
						<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
						<div className="flex-1 text-body-md">{errorMessage}</div>
						<Button variant="outline" size="sm" onClick={retry} type="button">
							Reintentar
						</Button>
					</div>
				)}
			</div>

			<form className="flex gap-3" onSubmit={handleSubmit}>
				<Input
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onKeyDown={handleKey}
					disabled={busy || status === "error"}
					placeholder="Escribe tu pregunta sobre fiscalidad en Melilla..."
					aria-label="Pregunta"
				/>
				<Button
					type="submit"
					disabled={busy || status === "error" || !draft.trim()}
					aria-label="Enviar"
				>
					{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
				</Button>
			</form>

			{messages.length === 0 && status !== "error" && (
				<div>
					<p className="text-label-caps text-on-surface-muted mb-3">PRUEBA PREGUNTAR</p>
					<ul className="flex flex-col gap-2">
						{suggestedQuestions.map((q) => (
							<li key={q}>
								<button
									type="button"
									onClick={() => submit(q)}
									disabled={busy || status === "error"}
									className="w-full rounded-md border border-outline-variant px-4 py-3 text-left text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors disabled:opacity-50 disabled:pointer-events-none"
								>
									{q}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			<p className="text-body-sm text-on-surface-muted leading-relaxed mt-2">
				{DISCLAIMER}
			</p>
		</div>
	);
}

function EmptyState({ loading }: { loading: boolean }) {
	if (loading) {
		return (
			<div className="flex items-center justify-center gap-3 py-8 text-body-md text-on-surface-muted">
				<Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
				<span>Conectando con IA Fiscal Melilla...</span>
			</div>
		);
	}
	return (
		<p className="text-body-md text-on-surface-muted text-center py-8">
			Escribe una pregunta o elige una de las sugeridas debajo para empezar.
		</p>
	);
}

function ChatBubble({
	role,
	content,
	streaming,
}: {
	role: "user" | "assistant";
	content: string;
	streaming: boolean;
}) {
	const isUser = role === "user";
	// anime.js fade-in al montar (respeta prefers-reduced-motion via el hook)
	const ref = useAnimeEntry<HTMLDivElement>(0);
	return (
		<div ref={ref} className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-[80%] rounded-lg px-5 py-3 ${
					isUser
						? "bg-surface-container-high text-on-surface"
						: "bg-surface-container-highest text-on-surface"
				}`}
			>
				<p className="text-label-caps text-on-surface-muted mb-1 font-mono">
					{isUser ? "TU" : "IA FISCAL"}
				</p>
				<p className="text-body-md whitespace-pre-wrap">
					{content}
					{streaming && <span className="ml-1 inline-block h-3 w-[2px] bg-primary animate-pulse" aria-hidden="true" />}
				</p>
			</div>
		</div>
	);
}
```

- [ ] **Step 2: Actualizar pagina DemoIaFiscal**

Modify `frontend/src/pages/DemoIaFiscal.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { DemoChat } from "@/components/demo/DemoChat";
import { Badge } from "@/components/ui/badge";
import { demoIaFiscalContent } from "@/content/demoIaFiscal";

export default function DemoIaFiscal() {
	return (
		<PageShell>
			<SeoHead
				title="IA Fiscal Melilla — Demo en vivo"
				description="Asistente IA entrenado en normativa fiscal de Melilla. IPSI, REF, IRPF local, deducciones, plazos. Responde con fuente."
				path="/demos/ia-fiscal-melilla"
			/>
			<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<Badge variant="primary" className="mb-6">
					{demoIaFiscalContent.hero.eyebrow}
				</Badge>
				<h1 className="text-display-md font-bold tracking-tight max-w-4xl">
					{demoIaFiscalContent.hero.headline}
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					{demoIaFiscalContent.hero.subheadline}
				</p>
				<div className="mt-12 max-w-3xl">
					<DemoChat suggestedQuestions={demoIaFiscalContent.suggestedQuestions} />
				</div>
			</section>
		</PageShell>
	);
}
```

- [ ] **Step 3: Borrar placeholder antiguo**

Run:
```bash
rm frontend/src/components/demo/DemoChatPlaceholder.tsx
```

- [ ] **Step 4: Verificar typecheck pasa**

Run:
```bash
cd frontend
npm run typecheck
```
Expected: 0 errors.

- [ ] **Step 5: Verificar build pasa**

Run: `cd frontend && npm run build`
Expected: build succeeds. Note new bundle size for the record (CSS, JS gzip).

- [ ] **Step 6: Verificar tests siguen pasando**

Run: `cd frontend && npm test -- --run`
Expected: all tests pass (Button 6 + Nav 3 + AudienceSplit 3 + ContactForm 3 + apiClient 3 + useDemoChat 4 = 22).

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/demo/ frontend/src/pages/DemoIaFiscal.tsx
git commit -m "feat(frontend): DemoChat live widget — login + streaming + suggested questions + disclaimer + retry"
```

---

## Task 4.5: DemoChat component tests

**Files:**
- Create: `frontend/src/components/demo/__tests__/DemoChat.test.tsx`

- [ ] **Step 1: Escribir tests del componente**

Create `frontend/src/components/demo/__tests__/DemoChat.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DemoChat } from "../DemoChat";

const SUGGESTED = [
	"¿Pregunta 1?",
	"¿Pregunta 2?",
	"¿Pregunta 3?",
];

const DISCLAIMER_PREFIX =
	"Demo informativa basada en normativa de Melilla";

describe("DemoChat", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
		vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
		vi.stubEnv("VITE_DEMO_USER_EMAIL", "demo@example.com");
		vi.stubEnv("VITE_DEMO_USER_PASSWORD", "secret");
	});

	function mockLoginOk() {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						user: { id: "u1", email: "x", name: "x" },
						tokens: { access_token: "T", refresh_token: "R", token_type: "bearer" },
					}),
					{ status: 200, headers: { "Content-Type": "application/json" } },
				),
			),
		);
	}

	it("renderiza el disclaimer literal completo", async () => {
		mockLoginOk();
		render(<DemoChat suggestedQuestions={SUGGESTED} />);
		const disclaimer = await screen.findByText((content) =>
			content.startsWith(DISCLAIMER_PREFIX),
		);
		expect(disclaimer).toHaveTextContent(
			"Demo informativa basada en normativa de Melilla. No constituye asesoramiento fiscal vinculante. Consulta a un profesional para tu caso concreto.",
		);
	});

	it("renderiza las suggested questions como botones clicables", async () => {
		mockLoginOk();
		render(<DemoChat suggestedQuestions={SUGGESTED} />);
		await waitFor(() => {
			expect(screen.getByText(SUGGESTED[0])).toBeInTheDocument();
		});
		for (const q of SUGGESTED) {
			const btn = screen.getByText(q).closest("button");
			expect(btn).not.toBeNull();
			expect(btn).not.toBeDisabled();
		}
	});

	it("click en suggested question dispara el flujo y muestra burbuja user", async () => {
		const loginResp = new Response(
			JSON.stringify({
				user: { id: "u1", email: "x", name: "x" },
				tokens: { access_token: "T", refresh_token: "R", token_type: "bearer" },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
		const askResp = new Response(
			'data: {"content":"OK"}\n\ndata: {"done":true}\n\n',
			{ status: 200, headers: { "Content-Type": "text/event-stream" } },
		);
		const mockFetch = vi
			.fn()
			.mockResolvedValueOnce(loginResp)
			.mockResolvedValueOnce(askResp);
		vi.stubGlobal("fetch", mockFetch);

		const user = userEvent.setup();
		render(<DemoChat suggestedQuestions={SUGGESTED} />);
		await waitFor(() => {
			expect(screen.getByText(SUGGESTED[0])).toBeInTheDocument();
		});

		await user.click(screen.getByText(SUGGESTED[0]));

		// Bubble del usuario aparece con el texto exacto
		await waitFor(() => {
			expect(screen.getByText(SUGGESTED[0], { selector: "p" })).toBeInTheDocument();
		});
		// Eventualmente el assistant tiene "OK"
		await waitFor(() => {
			expect(screen.getByText("OK")).toBeInTheDocument();
		});
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it("muestra estado de carga mientras hace login silencioso", () => {
		// fetch que nunca resuelve → estado logging_in persiste
		vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
		render(<DemoChat suggestedQuestions={SUGGESTED} />);
		expect(screen.getByText(/Conectando con IA Fiscal Melilla/i)).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test, verify pass**

Run: `cd frontend && npm test -- --run DemoChat.test`
Expected: 4 tests pass.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/demo/__tests__/DemoChat.test.tsx
git commit -m "test(frontend): DemoChat disclaimer + suggested questions + click flow + loading state"
```

---

## Task 5: Browser smoke test + fix stream parser si difiere

**Files:** (none unless parser needs adjustment)

- [ ] **Step 1: Verificar backend respondio 200 al stream**

Run from repo root (Bash on Windows via Git Bash works for this; `node` always available since frontend has it as devDep):
```bash
LOGIN_BODY='{"email":"demo@example.com","password":"opCV-2Jf8zzq!X_7V1dTRfYZ3LF3"}'
TOKEN=$(curl -s -X POST "http://g100ae8up9ehmq4w0mn9od97.178.238.227.50.sslip.io/auth/login" -H "Content-Type: application/json" -d "$LOGIN_BODY" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(JSON.parse(d).tokens.access_token))")
echo "Token len: ${#TOKEN}"
echo '{"question":"Que es el IPSI?","conversation_id":null}' > /c/tmp/q.json
curl -i --max-time 30 -N -X POST "http://g100ae8up9ehmq4w0mn9od97.178.238.227.50.sslip.io/api/ask/stream" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" --data @/c/tmp/q.json 2>&1 | head -c 2000
```

Expected: HTTP 200 + stream body. Si recibes 403 `subscription_required`, EL BACKEND NO ESTA REDEPLOYADO con commit 8ca8556 — para y avisa al usuario antes de continuar.

- [ ] **Step 2: Anotar formato real del stream**

Mira los primeros bytes del cuerpo. Anota cual de estos casos aplica:

- (A) `data: {"content":"..."}\n\ndata: {"done":true}\n\n` — SSE estandar, parser actual lo cubre.
- (B) `{"content":"..."}\n{"done":true}\n` — NDJSON puro, parser actual lo cubre (cae al branch `JSON.parse` directo).
- (C) Texto raw concatenado sin estructura — parser actual lo cubre via branch fallback.
- (D) Otra estructura no contemplada (ej. `{"chunks":[...]}` array completo, o WebSocket-style) — **AJUSTAR PARSER** en `useDemoChat.ts` funcion `consumeStream`.

- [ ] **Step 3: (Solo si caso D) ajustar parser**

Si los chunks son objetos diferentes (ej. `{"token":"...","type":"chunk"}`), modificar la rama JSON dentro de `consumeStream` para aceptar la forma real. Anadir test en `useDemoChat.test.ts` con un fixture que coincida con el formato real. Re-run tests.

Si NO aplica (caso A/B/C), saltar este paso.

- [ ] **Step 4: Smoke test manual en navegador**

Run:
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173/demos/ia-fiscal-melilla` en navegador. Verifica:

1. Al cargar, ves un spinner "Conectando con IA Fiscal Melilla..."
2. DevTools → Network: ves `POST http://g100ae8up9ehmq4w0mn9od97.178.238.227.50.sslip.io/auth/login` → 200 con `tokens.access_token`
3. Tras login, las 4 suggested questions estan listadas + clicables
4. Click una suggested question → ves burbuja "TU" + burbuja "IA FISCAL" llenandose en tiempo real
5. Network: ves `POST .../api/ask/stream` con Bearer token, tipo `text/event-stream`
6. Al final del stream el cursor parpadeante desaparece
7. Disclaimer literal visible bajo el chat
8. Escribir pregunta custom + Enter → mismo flujo
9. Apaga el backend (o cambia VITE_API_BASE_URL a uno bad) y refresca → ves card de error con boton Reintentar

Tomar nota de cualquier fallo. Captura no necesaria.

- [ ] **Step 5: Detener dev server**

Ctrl+C.

- [ ] **Step 6: Commit (si hubo ajustes en step 3)**

```bash
git add frontend/src/hooks/
git commit -m "fix(frontend): adjust stream parser to match backend response format"
```

Si no hubo cambios, saltar este step.

---

## Task 6: Lint final + branch + PR

**Files:** (none — solo verificacion + push branch)

**Importante (CLAUDE.md raiz):** convencion del repo `claude/<descriptor>` para ramas, NO push directo a `main`.

- [ ] **Step 1: Mover los commits a branch dedicada**

Si arrancaste en `main` (lo habitual al ejecutar el plan), reubica los commits a una rama:
```bash
git branch claude/fase-2-demo-chat
git reset --hard origin/main         # main vuelve al estado pre-tareas
git checkout claude/fase-2-demo-chat  # los commits siguen aqui
git log --oneline -8                  # debe mostrar los commits de Tasks 1-5
```

Si ya empezaste en una branch dedicada, saltar este paso.

- [ ] **Step 2: Run typecheck + tests + theme:lint**

Run:
```bash
cd frontend
npm run typecheck && npm test -- --run && npm run theme:lint
```

Expected:
- typecheck: 0 errors
- tests: TODOS los existentes + 11 nuevos pasan (3 apiClient + 4 useDemoChat + 4 DemoChat)
- theme:lint: 0 errors

- [ ] **Step 3: Build final**

Run: `cd frontend && npm run build`
Expected: build succeeds. Apunta nuevo bundle size (CSS y JS gzip) en mensaje commit final / cuerpo del PR.

- [ ] **Step 4: Limpiar dist**

Run: `cd frontend && rm -r dist`

- [ ] **Step 5: Verificar git status limpio**

Run: `git status`
Expected: working tree clean (todos los commits ya hechos en tasks anteriores).

- [ ] **Step 6: Push branch**

```bash
git push -u origin claude/fase-2-demo-chat
```

Expected: branch creada en remoto con 6-7 commits.

- [ ] **Step 7: Crear PR via gh CLI**

```bash
gh pr create --base main --head claude/fase-2-demo-chat --title "feat(frontend): DemoChat live — login + streaming + retry" --body "$(cat <<'EOF'
## Summary

- Sustituye `DemoChatPlaceholder` por `DemoChat` funcional conectado al backend Fiscal IA Melilla (RAG fiscal Melilla, FastAPI separado).
- Login silencioso JWT al montar la pagina + streaming SSE token-a-token via `fetch` + `ReadableStream` reader.
- Suggested questions clicables, disclaimer literal permanente, error UI con retry.
- `AbortController` propagado a fetch para cancelar streams al unmount o al iniciar nueva pregunta.
- anime.js v4 fade-in burbujas (reusa `useAnimeEntry`).

## Tests added

- `apiClient.test.ts` — 3 tests (Bearer, no-token, ApiError on non-OK)
- `useDemoChat.test.ts` — 4 tests (login OK / login fail / streaming flow / retry)
- `DemoChat.test.tsx` — 4 tests (disclaimer literal / suggested rendering / click flow / loading state)

## Test plan

- [ ] `npm run typecheck` 0 errors
- [ ] `npm test -- --run` all pass
- [ ] `npm run build` succeeds, bundle JS gzip < 200 KB
- [ ] `npm run theme:lint` 0 errors
- [ ] Smoke test manual `/demos/ia-fiscal-melilla`: login OK, suggested question click → streaming render, disclaimer visible, retry on error
EOF
)"
```

Expected: PR URL devuelto. Apuntalo.

- [ ] **Step 8: Actualizar agent-comms.md (en branch principal tras merge, NO en la PR)**

Tras merge de la PR a main, en local:
```bash
git checkout main
git pull origin main
```

Append to `agent-comms.md`:
```markdown

## [YYYY-MM-DD HH:MM] [frontend-dev → PM] Fase 2 — DemoChat DONE

Estado: DONE
PR: <url>
Commits incluidos: <hashes>
Tests: TODOS pasan (+11 nuevos)
Bundle: <new sizes gzip>
Notas: <cualquier ajuste a parser stream si aplico>
```

Reemplazar `YYYY-MM-DD HH:MM`, `<url>`, `<hashes>`, `<new sizes gzip>`, `<cualquier ajuste...>` con valores reales.

- [ ] **Step 9: Commit + push agent-comms update**

```bash
git add agent-comms.md
git commit -m "docs(comms): Fase 2 DemoChat DONE"
git push origin main
```

---

## Acceptance criteria (verifiable)

- [ ] `npm run typecheck` 0 errors
- [ ] `npm test -- --run` pasa con los tests existentes + 11 nuevos (3 apiClient + 4 useDemoChat + 4 DemoChat). El conteo total puede haber crecido por otros commits — verificar 0 fallos, NO el numero absoluto.
- [ ] `npm run build` succeeds, bundle JS gzip < 200 KB
- [ ] `npm run theme:lint` 0 errors
- [ ] Smoke test navegador (Task 5 step 4) los 9 puntos pasan
- [ ] `frontend/src/components/demo/DemoChatPlaceholder.tsx` no existe
- [ ] Disclaimer exacto presente en componente (verificable con `grep -F "Demo informativa basada en normativa de Melilla" frontend/src/components/demo/DemoChat.tsx`)
- [ ] AbortController propagado a `fetch`: verificable buscando `signal:` en `apiClient.ts`
- [ ] git log de `claude/fase-2-demo-chat` muestra los commits con prefijo `feat(frontend):` y `test(frontend):` siguiendo el patron del repo
- [ ] PR abierta contra `main` con tests verdes en CI (si CI existe) o smoke local OK

---

## Out of scope (deferred to later phases)

- Refresh token auto-renewal (TTL 1h cubre demo sesion tipica)
- Persistencia historial cross-session
- Conversation continuity (cada pregunta = `conversation_id: null` por ahora)
- Multi-turn context con backend
- Citas/fuentes destacadas (si vienen en stream, se renderizan como texto plano)
- File uploads
- Other backend endpoints
