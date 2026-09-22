import { ApiError } from "@/lib/apiClient";

/**
 * Cliente del backend del Tutor IA para opositores.
 *
 * Backend propio, desplegado aparte: NO comparte nada con el de Impuestify
 * (`fiscalApi.ts`), que es de donde tira la demo fiscal. Por eso la URL sale de
 * `VITE_API_TUTOR_URL` y no de `VITE_API_BASE_URL` — reutilizar aquella
 * volvería a atar esta demo al backend fiscal, que es justo lo que este
 * proyecto quería evitar.
 *
 * Endpoints públicos: no hay login ni token. El servidor identifica al
 * visitante por su IP y le aplica un tope diario propio (30 usos por
 * herramienta), así que el cliente no lleva contadores.
 *
 * CORS del backend: `allow_headers=["Content-Type"]` y métodos GET/POST. No se
 * pueden mandar cabeceras propias; `Accept` pasa por ser de la lista segura.
 */

/**
 * El tutor tarda entre 5 y 30 segundos y el generador puede tardar más
 * (búsqueda + LLM + validación + un reintento). 90 s deja margen al peor caso
 * sin dejar la interfaz colgada para siempre si el backend no contesta.
 */
const TIEMPO_MAXIMO_MS = 90_000;

/** Consultas de solo lectura: si `/temas` o `/salud` no contestan en 15 s, algo va mal. */
const TIEMPO_MAXIMO_CORTO_MS = 15_000;

export function urlDelTutor(): string {
	const url = import.meta.env.VITE_API_TUTOR_URL as string | undefined;
	if (!url) {
		throw new Error(
			"VITE_API_TUTOR_URL no configurado: la demo del tutor no sabe a qué backend llamar.",
		);
	}
	return url.replace(/\/$/, "");
}

/**
 * El servidor no contestó: DNS, conexión rechazada, CORS, cable.
 *
 * Tipo propio y no un `TypeError` a secas porque `fetch` señala los fallos de
 * red con `TypeError`, que es también lo que sale de un error de programación
 * —llamar a algo que no es función, leer de `undefined`—. Tratar los dos igual
 * ofrece "reintentar" ante un bug, que va a fallar exactamente igual todas las
 * veces. Solo se envuelve lo que lanza el `fetch`, así que el resto sigue
 * siendo lo que es.
 */
export class ErrorDeRed extends Error {
	constructor(public readonly causa: unknown) {
		super("no se pudo contactar con el servidor del tutor");
		this.name = "ErrorDeRed";
	}
}

interface OpcionesDePeticion {
	cuerpo?: unknown;
	signal?: AbortSignal;
	tiempoMaximoMs?: number;
}

interface RespuestaCruda<T> {
	status: number;
	datos: T | null;
}

async function pedir<T>(
	metodo: "GET" | "POST",
	ruta: string,
	opciones: OpcionesDePeticion = {},
): Promise<RespuestaCruda<T>> {
	const { cuerpo, signal, tiempoMaximoMs = TIEMPO_MAXIMO_MS } = opciones;
	// La URL se resuelve FUERA del try que envuelve el fetch: si la variable de
	// entorno falta, eso es un fallo de configuración y tiene su propio mensaje,
	// no un `ErrorDeRed` que además invitaría a reintentar.
	const url = `${urlDelTutor()}${ruta}`;
	// Una señal que YA venía abortada no vuelve a disparar su evento, así que
	// suscribirse a `abort` no basta: sin esta comprobación la petición saldría
	// igual después de cancelarla.
	if (signal?.aborted) throw new DOMException("Cancelado", "AbortError");
	const controlador = new AbortController();
	const temporizador = window.setTimeout(
		() => controlador.abort(),
		tiempoMaximoMs,
	);
	const propagarAborto = () => controlador.abort();
	signal?.addEventListener("abort", propagarAborto);

	const cabeceras: Record<string, string> = { Accept: "application/json" };
	if (cuerpo !== undefined) cabeceras["Content-Type"] = "application/json";

	try {
		let res: Response;
		try {
			res = await fetch(url, {
				method: metodo,
				headers: cabeceras,
				body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
				signal: controlador.signal,
			});
		} catch (err) {
			// El aborto viaja tal cual: quien canceló ya sabe por qué.
			if (err instanceof DOMException && err.name === "AbortError") throw err;
			throw new ErrorDeRed(err);
		}

		// 204 (contestar) no trae cuerpo: leerlo como JSON reventaría.
		const sinCuerpo =
			res.status === 204 || res.headers.get("content-length") === "0";
		let datos: unknown = null;
		if (!sinCuerpo) {
			try {
				datos = await res.json();
			} catch {
				datos = null;
			}
		}

		if (!res.ok) throw new ApiError(res.status, datos);
		return { status: res.status, datos: datos as T | null };
	} finally {
		window.clearTimeout(temporizador);
		signal?.removeEventListener("abort", propagarAborto);
	}
}

/**
 * Saca el mensaje que hay que enseñarle al usuario.
 *
 * El backend redacta los `detail` en castellano y pensados para leerse tal
 * cual ("la consulta no parece estar del temario publicado"). Sustituirlos por
 * un genérico tira a la basura la única explicación útil que hay, así que
 * `respaldo` solo entra cuando no viene ninguno.
 */
export function mensajeDeError(err: unknown, respaldo: string): string {
	if (err instanceof ApiError) {
		const cuerpo = err.body;
		if (cuerpo && typeof cuerpo === "object" && "detail" in cuerpo) {
			const detalle = (cuerpo as { detail?: unknown }).detail;
			if (typeof detalle === "string" && detalle.trim()) return detalle;
		}
		if (typeof cuerpo === "string" && cuerpo.trim()) return cuerpo;
		return `${respaldo} (error ${err.status} del servidor).`;
	}
	if (err instanceof DOMException && err.name === "AbortError") {
		return "La petición ha tardado demasiado y se ha cancelado. Vuelve a intentarlo.";
	}
	if (err instanceof Error && err.message.includes("VITE_API_TUTOR_URL")) {
		return err.message;
	}
	return "No hemos podido conectar con el servidor del tutor. Comprueba tu conexión e inténtalo de nuevo.";
}

/**
 * Si tiene sentido ofrecer un "reintentar" con la MISMA petición.
 *
 * Los 4xx del backend son definitivos: el tope diario agotado (429), la sesión
 * que no existe (404), la consulta que no está en el temario (400) o el cuerpo
 * inválido (422) van a fallar exactamente igual la segunda vez. Ofrecer el
 * botón ahí es prometer algo que no va a pasar. Los 5xx y los fallos de red sí
 * son transitorios.
 */
export function esReintentable(err: unknown): boolean {
	if (err instanceof ApiError) return err.status >= 500;
	// La lista es CERRADA a propósito: un `ErrorDeRed` (lo que lanzó el propio
	// fetch) y un `AbortError` (tiempo agotado o cancelación) sí pueden salir
	// bien a la segunda. Todo lo demás —la variable de entorno sin configurar,
	// un fallo de programación— no se arregla repitiendo, y ofrecer el botón
	// ahí es prometer algo que no va a pasar.
	if (err instanceof ErrorDeRed) return true;
	return err instanceof DOMException && err.name === "AbortError";
}

export interface FalloDelTutor {
	mensaje: string;
	/** Si merece la pena pintar el botón de reintentar. */
	reintentable: boolean;
}

/** El mensaje para el usuario y si vale la pena ofrecerle reintentar. */
export function describirFallo(err: unknown, respaldo: string): FalloDelTutor {
	return {
		mensaje: mensajeDeError(err, respaldo),
		reintentable: esReintentable(err),
	};
}

// ===== Tipos =====

export interface SaludDelTutor {
	estado: string;
	turso: boolean;
	llm: { embeddings?: string; chat?: string };
	/**
	 * Latch vivo: `true` significa que el LLM está apagado (sin crédito) y no
	 * va a contestar. Es ESTE campo el que justifica bloquear la interfaz, no
	 * `llm.chat`: la comprobación de arranque gasta un presupuesto de 5 tokens
	 * y los modelos que razonan lo agotan pensando, así que `llm.chat` puede
	 * decir "error" con el tutor funcionando perfectamente.
	 */
	llm_desactivado: boolean;
	version_corpus: string;
}

export interface FuenteDelTutor {
	numero: number;
	tema: string | null;
	contenido: string;
}

export interface RespuestaDelTutor {
	texto: string;
	fuentes: FuenteDelTutor[];
}

/** Una pregunta tal como sale al navegador: sin la respuesta correcta. */
export interface PreguntaServida {
	id: string;
	enunciado: string;
	opciones: Record<string, string>;
	tema: string;
	dificultad: number;
}

export interface TestEmpezado {
	sesion_id: string;
	preguntas: PreguntaServida[];
}

/**
 * Una pregunta tal como se recupera al retomar un test.
 *
 * Trae las opciones —que `/resultado` no da— para poder repintar el test sin
 * haber guardado nada de `/empezar`. `respuesta_correcta` viaja SOLO si la
 * pregunta ya se contestó: si viajara siempre, empezar y recargar sería la
 * puerta trasera del examen.
 */
export interface PreguntaRetomada {
	posicion: number;
	enunciado: string;
	opciones: Record<string, string>;
	tema: string;
	dificultad: number;
	/** `pendiente` | `generando` | `completada`. Fuera de `pendiente` ya no admite cambio de respuesta. */
	estado: string;
	contestada: string | null;
	explicacion: string | null;
	respuesta_correcta?: string;
}

export interface SesionRetomada {
	sesion_id: string;
	version_corpus: string;
	preguntas: PreguntaRetomada[];
}

export interface ResultadoDePregunta {
	posicion: number;
	enunciado: string;
	contestada: string | null;
	/** Solo viaja si la pregunta se contestó: si no, el backend la borra. */
	respuesta_correcta?: string;
	acertada: boolean;
}

export interface ResultadoDelTest {
	aciertos: number;
	preguntas: ResultadoDePregunta[];
}

/**
 * La pregunta del generador: como la del examen MÁS cuál es la correcta.
 *
 * Solo la sirve `POST /generador/pregunta`, y la diferencia es deliberada del
 * backend: el examen se juega —si la correcta viaja, el test se regala— y el
 * generador se demuestra. Sin la respuesta al lado de la evidencia, quien mira
 * ve una pregunta y un párrafo y no puede juzgar si la IA acertó, que es justo
 * a lo que ha venido.
 */
export interface PreguntaConRespuesta extends PreguntaServida {
	/** Letra de la opción correcta: "a" | "b" | "c" | "d". */
	respuesta: string;
}

export interface PreguntaGenerada {
	pregunta: PreguntaConRespuesta;
	/** Fragmento literal del temario que sostiene la respuesta. */
	evidencia: string;
	/** "mismo tema" o "temas hermanos": de dónde salió el estilo de la pregunta. */
	procedencia: string;
	/** El chunk completo del temario del que se generó la pregunta. */
	fragmento: string;
}

// ===== Endpoints =====

export async function consultarSalud(
	signal?: AbortSignal,
): Promise<SaludDelTutor> {
	const { datos } = await pedir<SaludDelTutor>("GET", "/salud", {
		signal,
		tiempoMaximoMs: TIEMPO_MAXIMO_CORTO_MS,
	});
	if (!datos) throw new ApiError(500, null);
	return datos;
}

/**
 * Los temas con temario publicado, para el desplegable del generador.
 *
 * Se sirven EN EL ORDEN QUE VIENEN, sin reordenar. Los hubo que reordenar
 * mientras el backend los daba alfabéticos —"Tema 10" antes que "Tema 2"—, pero
 * desde entonces los ordena él por número, y su criterio es más fino que
 * cualquier comparador de cadenas: manda los temas SIN número al final a
 * propósito (`ORDER BY MIN(numero_tema) IS NULL, MIN(numero_tema), tema`).
 *
 * Reordenar aquí ya no sería inofensivo: un `Intl.Collator` numérico sube
 * "Anexo I" por delante de "Tema 1" y deshace justo esa regla. Comprobado
 * antes de quitarlo, no supuesto.
 */
export async function obtenerTemas(signal?: AbortSignal): Promise<string[]> {
	const { datos } = await pedir<{ temas: string[] }>("GET", "/temas", {
		signal,
		tiempoMaximoMs: TIEMPO_MAXIMO_CORTO_MS,
	});
	return datos?.temas ?? [];
}

export async function preguntarAlTutor(
	consulta: string,
	signal?: AbortSignal,
): Promise<RespuestaDelTutor> {
	const { datos } = await pedir<RespuestaDelTutor>("POST", "/tutor/preguntar", {
		cuerpo: { consulta },
		signal,
	});
	if (!datos) throw new ApiError(500, null);
	return { texto: datos.texto, fuentes: datos.fuentes ?? [] };
}

export async function empezarExamen(
	signal?: AbortSignal,
): Promise<TestEmpezado> {
	const { datos } = await pedir<TestEmpezado>("POST", "/examen/empezar", {
		signal,
	});
	if (!datos) throw new ApiError(500, null);
	return datos;
}

/**
 * Registra una contestación. 204 sin cuerpo.
 *
 * Los campos son `posicion` (entero, base 0) y `letra`: no se manda el id de la
 * pregunta. El backend devuelve 422 si la pregunta ya está en corrección, o sea
 * si ya se pidió su explicación.
 */
export async function contestarPregunta(
	sesionId: string,
	posicion: number,
	letra: string,
	signal?: AbortSignal,
): Promise<void> {
	await pedir<null>("POST", `/examen/${encodeURIComponent(sesionId)}/contestar`, {
		cuerpo: { posicion, letra },
		signal,
	});
}

/**
 * La sesión entera, para repintar el test tras recargar la página.
 *
 * 404 si la sesión ya no existe —caducan a los siete días—, y ese caso lo
 * trata el llamante olvidándola.
 */
export async function retomarExamen(
	sesionId: string,
	signal?: AbortSignal,
): Promise<SesionRetomada> {
	const { datos } = await pedir<SesionRetomada>(
		"GET",
		`/examen/${encodeURIComponent(sesionId)}`,
		{ signal, tiempoMaximoMs: TIEMPO_MAXIMO_CORTO_MS },
	);
	if (!datos) throw new ApiError(500, null);
	return { ...datos, preguntas: datos.preguntas ?? [] };
}

export async function obtenerResultado(
	sesionId: string,
	signal?: AbortSignal,
): Promise<ResultadoDelTest> {
	const { datos } = await pedir<ResultadoDelTest>(
		"GET",
		`/examen/${encodeURIComponent(sesionId)}/resultado`,
		{ signal, tiempoMaximoMs: TIEMPO_MAXIMO_CORTO_MS },
	);
	if (!datos) throw new ApiError(500, null);
	return { aciertos: datos.aciertos ?? 0, preguntas: datos.preguntas ?? [] };
}

const ESPERA_ENTRE_REINTENTOS_MS = 2_000;
/** Plazo TOTAL del baile de reintentos, no de cada petición suelta. */
const PLAZO_DE_EXPLICACION_MS = 60_000;

/**
 * Pide la explicación de una pregunta y espera a que esté.
 *
 * El backend contesta 202 cuando otra petición ya está generando esa misma
 * explicación: la guarda atómica evita pagar dos veces al LLM y el cliente
 * tiene que reintentar, no insistir en paralelo.
 *
 * El límite es un plazo total, no un número de intentos: contar intentos no
 * acota nada cuando cada uno puede tardar lo suyo — veinte intentos de treinta
 * segundos son diez minutos girando. Al agotarse el plazo se rinde con un
 * mensaje honesto.
 */
export async function pedirExplicacion(
	sesionId: string,
	posicion: number,
	signal?: AbortSignal,
): Promise<string> {
	const ruta = `/examen/${encodeURIComponent(sesionId)}/explicar`;
	const limite = Date.now() + PLAZO_DE_EXPLICACION_MS;
	while (true) {
		// Si la espera se reanudó tarde —una pestaña en segundo plano no
		// garantiza cuándo despierta— el plazo puede haberse pasado ya: sin esta
		// salida el suelo del `Math.max` regalaría una petición más.
		if (Date.now() >= limite) break;
		// Lo que QUEDA de plazo, no el plazo entero: darle 60 s a cada reintento
		// convierte el tope total en 60 s por vuelta y el plazo deja de serlo.
		const restante = Math.max(1_000, limite - Date.now());
		const { status, datos } = await pedir<{ posicion: number; texto?: string }>(
			"POST",
			ruta,
			{ cuerpo: { posicion }, signal, tiempoMaximoMs: restante },
		);
		if (status !== 202 && datos && typeof datos.texto === "string") {
			return datos.texto;
		}
		if (signal?.aborted) throw new DOMException("Cancelado", "AbortError");
		// Ni se duerme ni se reintenta si ya no queda plazo: esperar dos
		// segundos para rendirse justo después es tiempo regalado.
		if (Date.now() + ESPERA_ENTRE_REINTENTOS_MS >= limite) break;
		await new Promise((resolver) =>
			window.setTimeout(resolver, ESPERA_ENTRE_REINTENTOS_MS),
		);
		if (signal?.aborted) throw new DOMException("Cancelado", "AbortError");
	}
	throw new ApiError(504, {
		detail:
			"La explicación está tardando más de lo normal. Vuelve a desplegarla en un momento.",
	});
}

export async function generarPregunta(
	tema: string,
	signal?: AbortSignal,
): Promise<PreguntaGenerada> {
	const { datos } = await pedir<PreguntaGenerada>(
		"POST",
		"/generador/pregunta",
		{ cuerpo: { tema }, signal },
	);
	if (!datos) throw new ApiError(500, null);
	return datos;
}

export { ApiError };
