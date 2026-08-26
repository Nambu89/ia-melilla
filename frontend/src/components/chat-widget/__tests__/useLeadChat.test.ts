import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useLeadChat } from "../useLeadChat";

/** Construye una respuesta SSE a partir de bloques ya formados. */
function sse(bloques: string[], status = 200): Response {
	const cuerpo = bloques.join("\n\n") + "\n\n";
	return new Response(cuerpo, {
		status,
		headers: { "Content-Type": "text/event-stream" },
	});
}

function arranqueOk() {
	return new Response(
		JSON.stringify({
			conversation_id: "c-123",
			lead_id: "l-1",
			greeting: "Hola",
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
}

describe("useLeadChat", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
		vi.stubEnv("VITE_API_BASE_URL", "https://api.test");
	});

	it("un 404 al arrancar deja el chat en consentimiento y reintentable", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(JSON.stringify({ detail: "Not Found" }), { status: 404 }),
			),
		);

		const { result } = renderHook(() => useLeadChat());
		let ok: boolean | undefined;
		await act(async () => {
			ok = await result.current.begin(null, "");
		});

		expect(ok).toBe(false);
		// Sin fase "error" sin salida: se vuelve al consentimiento con el aviso.
		expect(result.current.phase).toBe("consent");
		expect(result.current.errorMessage).toBe(
			"El asistente no está disponible ahora mismo. Inténtalo más tarde.",
		);
	});

	it("distingue el límite de peticiones del resto de errores", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("{}", { status: 429 })),
		);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});

		expect(result.current.errorMessage).toBe(
			"Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.",
		);
	});

	it("un arranque sin conversation_id se trata como fallo", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue(
					new Response(JSON.stringify({ greeting: "Hola" }), { status: 200 }),
				),
		);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});

		expect(result.current.phase).toBe("consent");
		expect(result.current.errorMessage).not.toBeNull();
	});

	it("arranca bien y consume un turno completo con slots", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(arranqueOk())
			.mockResolvedValueOnce(
				sse([
					"event: thinking\ndata: …",
					"event: content\ndata: Te propongo estos huecos",
					'event: meta\ndata: {"type":"slots","slots":[{"iso":"2026-09-01T10:00:00","human":"lunes 1 a las 10:00"}]}',
					'event: done\ndata: {"conversation_id":"c-123"}',
				]),
			);
		vi.stubGlobal("fetch", fetchMock);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});
		expect(result.current.phase).toBe("ready");

		await act(async () => {
			await result.current.send("quiero una llamada");
		});

		await waitFor(() => expect(result.current.phase).toBe("ready"));
		expect(result.current.messages.at(-1)?.content).toBe(
			"Te propongo estos huecos",
		);
		expect(result.current.slots).toHaveLength(1);
		expect(result.current.errorMessage).toBeNull();
	});

	it("un stream cortado antes del done no se da por bueno", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(arranqueOk())
			// Se corta sin `done`: no es un turno completo.
			.mockResolvedValueOnce(sse(["event: content\ndata: Empiezo a respon"]));
		vi.stubGlobal("fetch", fetchMock);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});
		await act(async () => {
			await result.current.send("hola");
		});

		await waitFor(() => expect(result.current.errorMessage).not.toBeNull());
		// Reintentable, no bloqueado en "sending".
		expect(result.current.phase).toBe("ready");
		// Lo que llegó se conserva; el aviso de error es lo que lo marca como
		// incompleto, en vez de borrar texto que el visitante ya había leído.
		expect(result.current.messages.at(-1)?.content).toBe("Empiezo a respon");
	});

	it("un turno que acaba sin texto no deja los puntitos de escribiendo", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(arranqueOk())
			// Sólo `meta` y `done`: ni un carácter de respuesta.
			.mockResolvedValueOnce(
				sse([
					'event: meta\ndata: {"type":"slots","slots":[]}',
					"event: done\ndata: {}",
				]),
			);
		vi.stubGlobal("fetch", fetchMock);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});
		await act(async () => {
			await result.current.send("hola");
		});

		await waitFor(() => expect(result.current.phase).toBe("ready"));
		expect(result.current.messages.map((m) => m.role)).toEqual([
			"assistant",
			"user",
		]);
	});

	it("reensambla un SSE partido entre dos lecturas", async () => {
		const trozos = [
			"event: content\ndata: Primera par",
			"te y segunda\n\nevent: done\ndata: {}\n\n",
		];
		const stream = new ReadableStream<Uint8Array>({
			start(controller) {
				const enc = new TextEncoder();
				controller.enqueue(enc.encode(trozos[0]));
				controller.enqueue(enc.encode(trozos[1]));
				controller.close();
			},
		});

		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(arranqueOk())
			.mockResolvedValueOnce(
				new Response(stream, {
					status: 200,
					headers: { "Content-Type": "text/event-stream" },
				}),
			);
		vi.stubGlobal("fetch", fetchMock);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});
		await act(async () => {
			await result.current.send("hola");
		});

		await waitFor(() => expect(result.current.phase).toBe("ready"));
		expect(result.current.messages.at(-1)?.content).toBe(
			"Primera parte y segunda",
		);
		expect(result.current.errorMessage).toBeNull();
	});

	it("un greeting que no es texto no deja una burbuja fantasma", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						conversation_id: "c-1",
						lead_id: "l-1",
						greeting: { texto: "esto no es una cadena" },
					}),
					{ status: 200, headers: { "Content-Type": "application/json" } },
				),
			),
		);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});

		expect(result.current.phase).toBe("ready");
		expect(result.current.messages).toEqual([]);
	});

	it("descarta un booking con campos que no son texto", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(arranqueOk())
			.mockResolvedValueOnce(
				sse([
					"event: content\ndata: Hecho",
					'event: meta\ndata: {"type":"booking","booking":{"status":"booked","human":{"x":1},"meet_link":"https://meet.test/a"}}',
					"event: done\ndata: {}",
				]),
			);
		vi.stubGlobal("fetch", fetchMock);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});
		await act(async () => {
			await result.current.send("resérvame");
		});

		await waitFor(() => expect(result.current.phase).toBe("ready"));
		expect(result.current.booking).toEqual({
			status: "booked",
			slot_iso: undefined,
			human: undefined,
			meet_link: "https://meet.test/a",
		});
	});

	it("un fallo de envío retira la burbuja vacía de escribiendo", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(arranqueOk())
			.mockRejectedValueOnce(new TypeError("Failed to fetch"));
		vi.stubGlobal("fetch", fetchMock);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});
		await act(async () => {
			await result.current.send("hola");
		});

		await waitFor(() => expect(result.current.phase).toBe("ready"));
		expect(result.current.errorMessage).toBe(
			"Conexión perdida. Inténtalo de nuevo.",
		);
		// Quedan el saludo y el mensaje del usuario, sin burbuja vacía colgando.
		expect(result.current.messages.map((m) => m.role)).toEqual([
			"assistant",
			"user",
		]);
	});

	it("ignora un meta con forma incorrecta en vez de romperse", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(arranqueOk())
			.mockResolvedValueOnce(
				sse([
					"event: content\ndata: Vale",
					// Sin `slots`: antes dejaba el estado en undefined y tiraba el widget.
					'event: meta\ndata: {"type":"slots"}',
					'event: done\ndata: {}',
				]),
			);
		vi.stubGlobal("fetch", fetchMock);

		const { result } = renderHook(() => useLeadChat());
		await act(async () => {
			await result.current.begin(null, "");
		});
		await act(async () => {
			await result.current.send("hola");
		});

		await waitFor(() => expect(result.current.phase).toBe("ready"));
		expect(result.current.slots).toEqual([]);
	});
});
