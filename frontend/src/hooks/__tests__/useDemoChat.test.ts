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
		const makeLogin = () =>
			new Response(
				JSON.stringify({
					user: { id: "u1", email: "x", name: "x" },
					tokens: { access_token: "T", refresh_token: "R", token_type: "bearer" },
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } },
			);

		const mockFetch = vi
			.fn()
			.mockResolvedValueOnce(makeLogin())
			.mockResolvedValueOnce(new Response("boom", { status: 500 }))
			.mockResolvedValueOnce(makeLogin());
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
});
