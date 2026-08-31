import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	contestarPregunta,
	describirFallo,
	esReintentable,
	mensajeDeError,
	obtenerTemas,
	pedirExplicacion,
	preguntarAlTutor,
	ApiError,
	ErrorDeRed,
} from "../tutorApi";

function respuestaJson(cuerpo: unknown, status = 200): Response {
	return new Response(JSON.stringify(cuerpo), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

describe("tutorApi", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		vi.stubEnv("VITE_API_TUTOR_URL", "https://tutor.test/");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("quita la barra final de la URL base", async () => {
		const mockFetch = vi.fn().mockResolvedValue(respuestaJson({ temas: [] }));
		vi.stubGlobal("fetch", mockFetch);
		await obtenerTemas();
		expect(mockFetch.mock.calls[0][0]).toBe("https://tutor.test/temas");
	});

	it("ordena los temas por numero, no alfabeticamente", async () => {
		// El backend los sirve con SELECT DISTINCT: "Tema 10" antes que "Tema 2".
		const mockFetch = vi.fn().mockResolvedValue(
			respuestaJson({ temas: ["Tema 1", "Tema 10", "Tema 2", "Tema 21"] }),
		);
		vi.stubGlobal("fetch", mockFetch);
		expect(await obtenerTemas()).toEqual([
			"Tema 1",
			"Tema 2",
			"Tema 10",
			"Tema 21",
		]);
	});

	it("acepta el 204 sin cuerpo de contestar sin intentar leer JSON", async () => {
		const mockFetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
		vi.stubGlobal("fetch", mockFetch);
		await expect(contestarPregunta("s1", 3, "b")).resolves.toBeUndefined();
		const [url, init] = mockFetch.mock.calls[0];
		expect(url).toBe("https://tutor.test/examen/s1/contestar");
		// posicion + letra, NO el id de la pregunta: mandarlo da un 422.
		expect(init.body).toBe(JSON.stringify({ posicion: 3, letra: "b" }));
	});

	it("no lanza la peticion si la señal ya venia abortada", async () => {
		const mockFetch = vi.fn();
		vi.stubGlobal("fetch", mockFetch);
		const controlador = new AbortController();
		controlador.abort();
		await expect(
			preguntarAlTutor("lo que sea", controlador.signal),
		).rejects.toMatchObject({ name: "AbortError" });
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it("reintenta tras el 202 de explicar y devuelve el texto del segundo intento", async () => {
		vi.useFakeTimers();
		try {
			const mockFetch = vi
				.fn()
				.mockResolvedValueOnce(respuestaJson({ posicion: 0 }, 202))
				.mockResolvedValueOnce(respuestaJson({ posicion: 0, texto: "porque si" }));
			vi.stubGlobal("fetch", mockFetch);

			const promesa = pedirExplicacion("s1", 0);
			// Deja resolver el primer fetch, correr la espera y disparar el segundo.
			await vi.advanceTimersByTimeAsync(2500);
			await expect(promesa).resolves.toBe("porque si");
			expect(mockFetch).toHaveBeenCalledTimes(2);
		} finally {
			vi.useRealTimers();
		}
	});

	it("se rinde con un mensaje propio si el 202 no se acaba nunca", async () => {
		vi.useFakeTimers();
		try {
			const mockFetch = vi
				.fn()
				.mockResolvedValue(respuestaJson({ posicion: 0 }, 202));
			vi.stubGlobal("fetch", mockFetch);

			const promesa = pedirExplicacion("s1", 0);
			const capturada = promesa.catch((e) => e);
			// El plazo total son 60 s: pasado eso para, en vez de girar por
			// numero de intentos (que no acota nada si cada uno tarda).
			await vi.advanceTimersByTimeAsync(70_000);
			const err = await capturada;
			expect(err).toBeInstanceOf(ApiError);
			expect(mensajeDeError(err, "x")).toMatch(/tardando más de lo normal/);
		} finally {
			vi.useRealTimers();
		}
	});

	it("enseña el detail del backend tal cual, sin sustituirlo", async () => {
		const mockFetch = vi.fn().mockResolvedValue(
			respuestaJson(
				{ detail: "la consulta no parece estar del temario publicado" },
				400,
			),
		);
		vi.stubGlobal("fetch", mockFetch);
		const err = await preguntarAlTutor("receta de bizcocho").catch((e) => e);
		expect(mensajeDeError(err, "generico")).toBe(
			"la consulta no parece estar del temario publicado",
		);
	});

	it("solo ofrece reintentar cuando reintentar puede servir de algo", () => {
		// 429 tope agotado, 404 sesion inexistente, 400 fuera del temario: los
		// tres fallan igual la segunda vez.
		expect(esReintentable(new ApiError(429, { detail: "tope" }))).toBe(false);
		expect(esReintentable(new ApiError(404, { detail: "no existe" }))).toBe(false);
		expect(esReintentable(new ApiError(400, { detail: "fuera" }))).toBe(false);
		expect(esReintentable(new ApiError(503, { detail: "sin credito" }))).toBe(true);
		expect(esReintentable(new ErrorDeRed(new TypeError("Failed to fetch")))).toBe(
			true,
		);
		// Un TypeError suelto es un fallo de programación, no la red: repetirlo
		// falla igual. Solo cuenta como red lo que lanzó el propio fetch.
		expect(esReintentable(new TypeError("x is not a function"))).toBe(false);
	});

	it("envuelve como ErrorDeRed lo que lanza fetch, y solo eso", async () => {
		const mockFetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
		vi.stubGlobal("fetch", mockFetch);
		const err = await obtenerTemas().catch((e) => e);
		expect(err).toBeInstanceOf(ErrorDeRed);
		expect(esReintentable(err)).toBe(true);
	});

	it("un aborto sigue siendo un aborto, no un fallo de red", async () => {
		const mockFetch = vi
			.fn()
			.mockRejectedValue(new DOMException("Abortado", "AbortError"));
		vi.stubGlobal("fetch", mockFetch);
		const err = await obtenerTemas().catch((e) => e);
		expect(err).not.toBeInstanceOf(ErrorDeRed);
		expect(err).toMatchObject({ name: "AbortError" });
	});

	it("describirFallo junta mensaje y si merece la pena reintentar", () => {
		const fallo = describirFallo(new ApiError(429, { detail: "tope agotado" }), "x");
		expect(fallo).toEqual({ mensaje: "tope agotado", reintentable: false });
	});

	it("usa el respaldo cuando el error no trae detail", () => {
		expect(mensajeDeError(new ApiError(500, null), "No se pudo")).toBe(
			"No se pudo (error 500 del servidor).",
		);
	});

	it("avisa si falta VITE_API_TUTOR_URL en vez de llamar a undefined", async () => {
		vi.stubEnv("VITE_API_TUTOR_URL", "");
		const mockFetch = vi.fn();
		vi.stubGlobal("fetch", mockFetch);
		const err = await obtenerTemas().catch((e) => e);
		expect(mensajeDeError(err, "x")).toMatch(/VITE_API_TUTOR_URL/);
		expect(mockFetch).not.toHaveBeenCalled();
		// Una variable de entorno que falta no se arregla repitiendo la
		// peticion: el boton de reintentar no debe salir.
		expect(esReintentable(err)).toBe(false);
	});

	it("el plazo de la explicacion es TOTAL, no uno nuevo por intento", async () => {
		vi.useFakeTimers();
		try {
			// Primer intento: 202 despues de quemar 50 de los 60 segundos.
			// Segundo: se cuelga. Si a cada intento se le diera el plazo entero,
			// el segundo tendria 60 s propios y esto seguiria en vuelo a los 65;
			// con el plazo compartido le quedan 8 y se rinde antes.
			const mockFetch = vi
				.fn()
				.mockImplementationOnce(
					() =>
						new Promise((resolver) => {
							setTimeout(
								() => resolver(respuestaJson({ posicion: 0 }, 202)),
								50_000,
							);
						}),
				)
				.mockImplementation(
					(_url: string, init: RequestInit) =>
						new Promise((_resolver, rechazar) => {
							init.signal?.addEventListener("abort", () =>
								rechazar(new DOMException("Abortado", "AbortError")),
							);
						}),
				);
			vi.stubGlobal("fetch", mockFetch);

			let terminado = false;
			const capturada = pedirExplicacion("s1", 0).catch((e) => {
				terminado = true;
				return e;
			});
			await vi.advanceTimersByTimeAsync(65_000);
			expect(terminado).toBe(true);
			expect(await capturada).toMatchObject({ name: "AbortError" });
			expect(mockFetch).toHaveBeenCalledTimes(2);
		} finally {
			vi.useRealTimers();
		}
	});
});
