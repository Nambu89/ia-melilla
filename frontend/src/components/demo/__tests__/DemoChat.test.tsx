import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DemoChat } from "../DemoChat";

const SUGGESTED = ["¿Pregunta 1?", "¿Pregunta 2?", "¿Pregunta 3?"];

const DISCLAIMER_PREFIX = "Demo informativa basada en normativa de Melilla";

describe("DemoChat", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
		vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
		vi.stubEnv("VITE_DEMO_USER_EMAIL", "demo@example.com");
		vi.stubEnv("VITE_DEMO_USER_PASSWORD", "secret");
	});

	function makeLoginResponse() {
		return new Response(
			JSON.stringify({
				user: { id: "u1", email: "demo@example.com", name: "Demo" },
				tokens: { access_token: "T", refresh_token: "R", token_type: "bearer" },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	function mockLoginOk() {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(makeLoginResponse()));
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

	it("renderiza las suggested questions como botones clicables tras login", async () => {
		mockLoginOk();
		render(<DemoChat suggestedQuestions={SUGGESTED} />);
		for (const q of SUGGESTED) {
			await waitFor(() => {
				expect(screen.getByText(q)).toBeInTheDocument();
			});
			const btn = screen.getByText(q).closest("button");
			expect(btn).not.toBeNull();
			await waitFor(() => expect(btn).not.toBeDisabled());
		}
	});

	it("click en suggested question dispara flow y muestra respuesta", async () => {
		const askResp = new Response(
			"event: content\r\ndata: OK\r\n\r\nevent: done\r\ndata: {\"conversation_id\":\"x\"}\r\n\r\n",
			{ status: 200, headers: { "Content-Type": "text/event-stream" } },
		);
		const mockFetch = vi
			.fn()
			.mockResolvedValueOnce(makeLoginResponse())
			.mockResolvedValueOnce(askResp);
		vi.stubGlobal("fetch", mockFetch);

		const user = userEvent.setup();
		render(<DemoChat suggestedQuestions={SUGGESTED} />);

		const firstQ = await screen.findByText(SUGGESTED[0]);
		await waitFor(() => expect(firstQ.closest("button")).not.toBeDisabled());

		await user.click(firstQ);

		await waitFor(() => {
			expect(screen.getByText("OK")).toBeInTheDocument();
		});
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it("muestra estado de carga mientras hace login silencioso", () => {
		vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
		render(<DemoChat suggestedQuestions={SUGGESTED} />);
		expect(screen.getByText(/Conectando con IA Fiscal Melilla/i)).toBeInTheDocument();
	});
});
