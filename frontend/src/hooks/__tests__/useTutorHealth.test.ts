import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { olvidarSaludCacheada, useTutorHealth } from "../useTutorHealth";

function saludJson(extra: Record<string, unknown> = {}): Response {
	return new Response(
		JSON.stringify({
			estado: "ok",
			turso: true,
			llm: { embeddings: "ok", chat: "error" },
			llm_desactivado: false,
			version_corpus: "2026-08-27T10:00:00Z",
			...extra,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } },
	);
}

describe("useTutorHealth", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.stubEnv("VITE_API_TUTOR_URL", "https://tutor.test");
		olvidarSaludCacheada();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		olvidarSaludCacheada();
	});

	it("con llm.chat error pero el latch bajo, no apaga nada", async () => {
		// La foto del arranque gasta 5 tokens y los modelos que razonan los
		// queman pensando: "error" ahi es compatible con un tutor perfecto.
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(saludJson()));
		const { result } = renderHook(() => useTutorHealth());
		await waitFor(() => expect(result.current.salud).not.toBeNull());
		expect(result.current.desactivado).toBe(false);
		expect(result.current.inalcanzable).toBe(false);
	});

	it("con el latch vivo, marca desactivado", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(saludJson({ llm_desactivado: true })),
		);
		const { result } = renderHook(() => useTutorHealth());
		await waitFor(() => expect(result.current.desactivado).toBe(true));
		expect(result.current.inalcanzable).toBe(false);
	});

	it("si no se alcanza, marca inalcanzable y NO desactivado", async () => {
		// Son dos cosas distintas: el chequeo caido no prueba que el tutor lo
		// este, asi que esto avisa pero no puede apagar las herramientas.
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
		);
		const { result } = renderHook(() => useTutorHealth());
		await waitFor(() => expect(result.current.inalcanzable).toBe(true));
		expect(result.current.desactivado).toBe(false);
		expect(result.current.salud).toBeNull();
	});

	it("comparte una sola peticion entre los consumidores de la pagina", async () => {
		const mockFetch = vi.fn().mockResolvedValue(saludJson());
		vi.stubGlobal("fetch", mockFetch);
		const a = renderHook(() => useTutorHealth());
		const b = renderHook(() => useTutorHealth());
		await waitFor(() => expect(a.result.current.salud).not.toBeNull());
		await waitFor(() => expect(b.result.current.salud).not.toBeNull());
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it("NO cachea el fallo: el siguiente montaje vuelve a intentarlo", async () => {
		// Un backend reiniciandose se recupera; arrastrar el aviso el resto de
		// la sesion seria mentir a partir del segundo minuto.
		const mockFetch = vi
			.fn()
			.mockRejectedValueOnce(new TypeError("Failed to fetch"))
			.mockResolvedValue(saludJson());
		vi.stubGlobal("fetch", mockFetch);

		const primero = renderHook(() => useTutorHealth());
		await waitFor(() => expect(primero.result.current.inalcanzable).toBe(true));

		const segundo = renderHook(() => useTutorHealth());
		await waitFor(() => expect(segundo.result.current.salud).not.toBeNull());
		expect(segundo.result.current.inalcanzable).toBe(false);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});
});
