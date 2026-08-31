import { useCallback, useRef, useState } from "react";
import {
	CheckCircle2,
	ClipboardCheck,
	Loader2,
	MinusCircle,
	Play,
	RotateCcw,
	XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorNotice } from "@/components/tutor/ErrorNotice";
import { WorkingNotice } from "@/components/tutor/WorkingNotice";
import { useAbortables } from "@/hooks/useAbortables";
import { useTutorHealth } from "@/hooks/useTutorHealth";
import {
	contestarPregunta,
	describirFallo,
	empezarExamen,
	obtenerResultado,
	pedirExplicacion,
	type FalloDelTutor,
	type PreguntaServida,
	type ResultadoDePregunta,
	type ResultadoDelTest,
} from "@/lib/tutorApi";

const LETRAS = ["a", "b", "c", "d"] as const;

const FASES_EMPEZAR = [
	{ desdeSegundo: 0, texto: "Preparando tu test de diez preguntas…" },
] as const;

const FASES_EXPLICACION = [
	{ desdeSegundo: 0, texto: "El tutor está redactando la corrección…" },
	{
		desdeSegundo: 12,
		texto:
			"Sigue trabajando. La explicación se genera para tu respuesta concreta, no está escrita de antemano.",
	},
] as const;

interface EstadoDeExplicacion {
	texto: string | null;
	cargando: boolean;
	error: FalloDelTutor | null;
}

/**
 * El test de diez preguntas: empezar, contestar y corregir con explicación.
 *
 * Dos fases a propósito. Mientras se contesta no se pide ninguna explicación, y
 * solo al corregir se puede desplegar la de cada pregunta. El motivo es del
 * backend: pedir la explicación de una pregunta la deja "en corrección" y a
 * partir de ahí cambiar su respuesta devuelve un 422, así que mezclar las dos
 * cosas dejaría respuestas bloqueadas sin que se entienda por qué.
 *
 * Ni reloj ni penalización por fallo: decisión de producto, no un olvido.
 */
export function ExamBoard() {
	const [sesionId, setSesionId] = useState<string | null>(null);
	const [preguntas, setPreguntas] = useState<PreguntaServida[]>([]);
	const [respuestas, setRespuestas] = useState<Record<number, string>>({});
	const [erroresAlContestar, setErroresAlContestar] = useState<
		Record<number, string>
	>({});
	const [resultado, setResultado] = useState<ResultadoDelTest | null>(null);
	const [explicaciones, setExplicaciones] = useState<
		Record<number, EstadoDeExplicacion>
	>({});
	const [desplegadas, setDesplegadas] = useState<Record<number, boolean>>({});
	const [empezando, setEmpezando] = useState(false);
	const [corrigiendo, setCorrigiendo] = useState(false);
	const [guardando, setGuardando] = useState(0);
	const [errorGeneral, setErrorGeneral] = useState<FalloDelTutor | null>(null);

	const { nuevo, soltar, montado } = useAbortables();
	const { desactivado } = useTutorHealth();
	const resultadoRef = useRef<HTMLDivElement>(null);

	/**
	 * Una cadena de promesas POR PREGUNTA. Cambiar de opción deprisa lanza dos
	 * POST y, si llegan desordenados, el servidor se queda con la primera: la
	 * pantalla diría una cosa y la corrección otra. Encadenarlas por posición
	 * mantiene el orden sin serializar preguntas distintas, que sí son
	 * independientes.
	 */
	const cadenasRef = useRef(new Map<number, Promise<void>>());
	/** La última letra que el servidor confirmó, para revertir sin adivinar. */
	const confirmadasRef = useRef<Record<number, string>>({});

	const empezar = useCallback(async () => {
		if (desactivado) return;
		setEmpezando(true);
		setErrorGeneral(null);
		// Se vuelve a la pantalla de inicio mientras llega el test nuevo: dejar
		// las preguntas viejas en pantalla sin sus respuestas parece que se han
		// borrado solas.
		setSesionId(null);
		setPreguntas([]);
		setResultado(null);
		setRespuestas({});
		setErroresAlContestar({});
		setExplicaciones({});
		setDesplegadas({});
		cadenasRef.current.clear();
		confirmadasRef.current = {};
		const controlador = nuevo();
		try {
			const test = await empezarExamen(controlador.signal);
			if (!montado.current) return;
			setSesionId(test.sesion_id);
			setPreguntas(test.preguntas);
		} catch (err) {
			if (!montado.current) return;
			setErrorGeneral(describirFallo(err, "No hemos podido montar el test"));
		} finally {
			soltar(controlador);
			if (montado.current) setEmpezando(false);
		}
	}, [desactivado, nuevo, soltar, montado]);

	async function enviarRespuesta(posicion: number, letra: string) {
		if (!sesionId) return;
		const controlador = nuevo();
		try {
			await contestarPregunta(sesionId, posicion, letra, controlador.signal);
			confirmadasRef.current[posicion] = letra;
			// Un intento anterior pudo dejar un error a la vista: si este
			// guardado fue bien, ese aviso ya no describe nada.
			if (montado.current) {
				setErroresAlContestar((previos) => {
					if (previos[posicion] === undefined) return previos;
					const copia = { ...previos };
					delete copia[posicion];
					return copia;
				});
			}
		} catch (err) {
			if (!montado.current) return;
			// El backend es la fuente de la verdad: si no registró la respuesta,
			// dejarla marcada en pantalla haría creer que sí y la corrección
			// diría otra cosa.
			//
			// Pero solo se revierte si lo que hay en pantalla SIGUE siendo la
			// letra que falló: si el visitante ya eligió otra y está en la cola,
			// deshacer aquí le borraría una elección más nueva que la que
			// fracasó.
			const confirmada = confirmadasRef.current[posicion];
			setRespuestas((previas) => {
				if (previas[posicion] !== letra) return previas;
				const copia = { ...previas };
				if (confirmada === undefined) delete copia[posicion];
				else copia[posicion] = confirmada;
				return copia;
			});
			setErroresAlContestar((previos) => ({
				...previos,
				[posicion]: describirFallo(
					err,
					"No hemos podido guardar esta respuesta",
				).mensaje,
			}));
		} finally {
			soltar(controlador);
		}
	}

	function contestar(posicion: number, letra: string) {
		// En cuanto empieza la corrección deja de admitirse nada: `corregir()`
		// espera a las contestaciones que había en ese momento, y una que
		// llegue después no entraría en el resultado que se acaba de pedir.
		if (!sesionId || resultado || corrigiendo) return;
		setRespuestas((previas) => ({ ...previas, [posicion]: letra }));
		setErroresAlContestar((previos) => {
			const copia = { ...previos };
			delete copia[posicion];
			return copia;
		});
		setGuardando((n) => n + 1);
		const anterior = cadenasRef.current.get(posicion) ?? Promise.resolve();
		const siguiente = anterior
			.then(() => enviarRespuesta(posicion, letra))
			.catch(() => undefined)
			.finally(() => {
				if (montado.current) setGuardando((n) => n - 1);
			});
		cadenasRef.current.set(posicion, siguiente);
	}

	async function corregir() {
		if (!sesionId || corrigiendo) return;
		setCorrigiendo(true);
		setErrorGeneral(null);
		const controlador = nuevo();
		try {
			// Primero que terminen las contestaciones en vuelo: pedir el
			// resultado antes deja fuera la última respuesta y el marcador sale
			// mal, que en una demo es justo lo que se nota.
			await Promise.allSettled([...cadenasRef.current.values()]);
			if (!montado.current) return;
			const res = await obtenerResultado(sesionId, controlador.signal);
			if (!montado.current) return;
			setResultado(res);
			window.setTimeout(() => {
				resultadoRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 80);
		} catch (err) {
			if (!montado.current) return;
			setErrorGeneral(describirFallo(err, "No hemos podido corregir el test"));
		} finally {
			soltar(controlador);
			if (montado.current) setCorrigiendo(false);
		}
	}

	async function cargarExplicacion(posicion: number) {
		if (!sesionId) return;
		setExplicaciones((previas) => ({
			...previas,
			[posicion]: { texto: null, cargando: true, error: null },
		}));
		const controlador = nuevo();
		try {
			const texto = await pedirExplicacion(
				sesionId,
				posicion,
				controlador.signal,
			);
			if (!montado.current) return;
			setExplicaciones((previas) => ({
				...previas,
				[posicion]: { texto, cargando: false, error: null },
			}));
		} catch (err) {
			if (!montado.current) return;
			setExplicaciones((previas) => ({
				...previas,
				[posicion]: {
					texto: null,
					cargando: false,
					error: describirFallo(err, "No hemos podido generar la explicación"),
				},
			}));
		} finally {
			soltar(controlador);
		}
	}

	function alternarExplicacion(posicion: number) {
		const abierta = desplegadas[posicion] === true;
		setDesplegadas((previas) => ({ ...previas, [posicion]: !abierta }));
		// Cada explicación cuesta una llamada al modelo, así que solo se pide
		// la primera vez que se despliega esa pregunta concreta.
		if (!abierta && !explicaciones[posicion]) void cargarExplicacion(posicion);
	}

	if (!sesionId) {
		return (
			<div className="flex flex-col gap-5">
				<div className="rounded-xl border border-outline-variant bg-surface-container px-6 py-12 text-center">
					<span
						className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
						aria-hidden="true"
					>
						<ClipboardCheck className="h-6 w-6" />
					</span>
					<p className="text-headline-sm font-semibold text-on-surface">
						Diez preguntas del temario, a tu ritmo
					</p>
					<p className="mx-auto mt-2 max-w-md text-body-md text-on-surface-variant">
						Sin reloj y sin penalización por fallo. Al corregir puedes
						desplegar la explicación de cada pregunta, y el tutor te la
						redacta en ese momento para la respuesta que hayas dado.
					</p>
					<Button
						type="button"
						size="lg"
						onClick={() => void empezar()}
						disabled={empezando || desactivado}
						className="mt-8"
					>
						{empezando ? (
							<>
								<Loader2
									className="mr-2 h-4 w-4 animate-spin"
									aria-hidden="true"
								/>
								Preparando el test…
							</>
						) : (
							<>
								<Play className="mr-2 h-4 w-4" aria-hidden="true" />
								Empezar el test
							</>
						)}
					</Button>
				</div>
				{empezando && <WorkingNotice fases={FASES_EMPEZAR} />}
				{errorGeneral && (
					<ErrorNotice
						mensaje={errorGeneral.mensaje}
						onReintentar={
							errorGeneral.reintentable && !desactivado
								? () => void empezar()
								: undefined
						}
					/>
				)}
			</div>
		);
	}

	const contestadas = Object.keys(respuestas).length;
	const porResultado = new Map(
		(resultado?.preguntas ?? []).map((p) => [p.posicion, p]),
	);

	return (
		<div className="flex flex-col gap-6">
			{!resultado && (
				// top-16 y no top-2: la navegación es sticky top-0 y mide 56 px
				// cuando encoge, así que más arriba esta barra se le mete debajo.
				<div className="sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container/95 px-4 py-3 backdrop-blur">
					<div>
						<p className="text-body-md font-semibold text-on-surface">
							{contestadas} de {preguntas.length} contestadas
						</p>
						<p className="text-body-sm text-on-surface-muted">
							{guardando > 0
								? "Guardando tus respuestas…"
								: "Sin reloj y sin penalización por fallo."}
						</p>
					</div>
					<Button
						type="button"
						onClick={() => void corregir()}
						disabled={corrigiendo}
					>
						{corrigiendo ? (
							<>
								<Loader2
									className="mr-2 h-4 w-4 animate-spin"
									aria-hidden="true"
								/>
								Corrigiendo…
							</>
						) : (
							"Corregir el test"
						)}
					</Button>
				</div>
			)}

			{!resultado && contestadas < preguntas.length && (
				<p className="text-body-sm text-on-surface-muted">
					Puedes corregir cuando quieras. Las que dejes en blanco cuentan como
					fallo.
				</p>
			)}

			{resultado && (
				<div ref={resultadoRef}>
					<TarjetaDeResultado
						aciertos={resultado.aciertos}
						total={preguntas.length}
						onRepetir={() => void empezar()}
						repitiendo={empezando}
						bloqueado={desactivado}
					/>
				</div>
			)}

			{errorGeneral && (
				<ErrorNotice
					mensaje={errorGeneral.mensaje}
					onReintentar={
						errorGeneral.reintentable ? () => void corregir() : undefined
					}
				/>
			)}

			<ol className="flex flex-col gap-5">
				{preguntas.map((pregunta, posicion) => (
					<li key={pregunta.id}>
						<TarjetaDePregunta
							pregunta={pregunta}
							posicion={posicion}
							total={preguntas.length}
							elegida={respuestas[posicion]}
							errorAlContestar={erroresAlContestar[posicion]}
							resultado={porResultado.get(posicion)}
							corregido={resultado !== null}
							bloqueado={resultado !== null || corrigiendo}
							explicacion={explicaciones[posicion]}
							desplegada={desplegadas[posicion] === true}
							onElegir={(letra) => contestar(posicion, letra)}
							onAlternarExplicacion={() => alternarExplicacion(posicion)}
							onReintentarExplicacion={() => void cargarExplicacion(posicion)}
						/>
					</li>
				))}
			</ol>

			{resultado && (
				<div className="flex justify-center">
					<Button
						type="button"
						variant="outline"
						size="lg"
						onClick={() => void empezar()}
						disabled={empezando || desactivado}
					>
						<RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
						{empezando ? "Preparando otro test…" : "Hacer otro test"}
					</Button>
				</div>
			)}

		</div>
	);
}

function TarjetaDeResultado({
	aciertos,
	total,
	onRepetir,
	repitiendo,
	bloqueado,
}: {
	aciertos: number;
	total: number;
	onRepetir: () => void;
	repitiendo: boolean;
	bloqueado: boolean;
}) {
	return (
		<div className="rounded-xl border border-primary/30 bg-surface-container p-6 sm:p-8">
			<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
				RESULTADO DEL TEST
			</p>
			<p className="mt-2 text-display-md font-bold text-primary">
				{aciertos}
				<span className="text-headline-sm text-on-surface-variant">
					{" "}
					de {total} aciertos
				</span>
			</p>
			<p className="mt-3 max-w-xl text-body-md text-on-surface-variant">
				Despliega cualquier pregunta que hayas contestado para que el tutor te
				explique por qué esa es la respuesta correcta. La explicación se genera
				en ese momento, así que tarda unos segundos.
			</p>
			<Button
				type="button"
				variant="outline"
				onClick={onRepetir}
				disabled={repitiendo || bloqueado}
				className="mt-6"
			>
				<RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
				{repitiendo ? "Preparando otro test…" : "Hacer otro test"}
			</Button>
		</div>
	);
}

interface TarjetaDePreguntaProps {
	pregunta: PreguntaServida;
	posicion: number;
	total: number;
	elegida: string | undefined;
	errorAlContestar: string | undefined;
	resultado: ResultadoDePregunta | undefined;
	corregido: boolean;
	/** Radios cerrados. Se adelanta a `corregido`: en cuanto se pulsa corregir. */
	bloqueado: boolean;
	explicacion: EstadoDeExplicacion | undefined;
	desplegada: boolean;
	onElegir: (letra: string) => void;
	onAlternarExplicacion: () => void;
	onReintentarExplicacion: () => void;
}

function TarjetaDePregunta({
	pregunta,
	posicion,
	total,
	elegida,
	errorAlContestar,
	resultado,
	corregido,
	bloqueado,
	explicacion,
	desplegada,
	onElegir,
	onAlternarExplicacion,
	onReintentarExplicacion,
}: TarjetaDePreguntaProps) {
	const correcta = resultado?.respuesta_correcta;
	const contestada = resultado?.contestada ?? null;
	const idExplicacion = `explicacion-${posicion}`;

	return (
		<article className="rounded-xl border border-outline-variant bg-surface-container p-4 sm:p-6">
			<div className="mb-3 flex flex-wrap items-center gap-2">
				<span className="text-label-caps uppercase tracking-[0.12em] text-primary">
					PREGUNTA {posicion + 1} DE {total}
				</span>
				{pregunta.tema && (
					<span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-caps text-on-surface-variant">
						{pregunta.tema}
					</span>
				)}
				{corregido && <MarcaDeAcierto acertada={resultado?.acertada === true} />}
			</div>

			<fieldset disabled={bloqueado} className="min-w-0">
				<legend className="mb-4 text-body-lg font-medium text-on-surface">
					{pregunta.enunciado}
				</legend>
				<div className="flex flex-col gap-2">
					{LETRAS.filter((letra) => pregunta.opciones[letra] !== undefined).map(
						(letra) => (
							<OpcionDeRespuesta
								key={letra}
								nombre={`pregunta-${posicion}`}
								letra={letra}
								texto={pregunta.opciones[letra]}
								seleccionada={elegida === letra}
								bloqueado={bloqueado}
								esCorrecta={corregido && correcta === letra}
								esFalloElegido={
									corregido && elegida === letra && correcta !== letra
								}
								onElegir={() => onElegir(letra)}
							/>
						),
					)}
				</div>
			</fieldset>

			{errorAlContestar && (
				<ErrorNotice className="mt-4" mensaje={errorAlContestar} />
			)}

			{corregido && !contestada && (
				<p className="mt-4 flex items-center gap-2 text-body-sm text-on-surface-muted">
					<MinusCircle size={14} aria-hidden="true" />
					No la contestaste, así que cuenta como fallo. El tutor solo explica
					las que se han contestado.
				</p>
			)}

			{/* El backend devuelve 422 al explicar una pregunta sin contestar, así
			    que ofrecer el botón ahí es ofrecer un error seguro. */}
			{corregido && contestada && (
				<div className="mt-5 border-t border-outline-variant pt-4">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onAlternarExplicacion}
						aria-expanded={desplegada}
						aria-controls={idExplicacion}
						className="px-0"
					>
						{desplegada
							? "Ocultar la explicación"
							: "Ver por qué, explicado por el tutor"}
					</Button>
					{desplegada && (
						<div id={idExplicacion} className="mt-3">
							{explicacion?.cargando && (
								<WorkingNotice fases={FASES_EXPLICACION} />
							)}
							{explicacion?.error && (
								<ErrorNotice
									mensaje={explicacion.error.mensaje}
									onReintentar={
										explicacion.error.reintentable
											? onReintentarExplicacion
											: undefined
									}
								/>
							)}
							{explicacion?.texto && (
								<p className="whitespace-pre-wrap border-l-2 border-primary/40 pl-4 text-body-md leading-relaxed text-on-surface-variant">
									{explicacion.texto}
								</p>
							)}
						</div>
					)}
				</div>
			)}
		</article>
	);
}

function MarcaDeAcierto({ acertada }: { acertada: boolean }) {
	if (acertada) {
		return (
			<span className="inline-flex items-center gap-1.5 rounded-full bg-success-container px-2.5 py-0.5 text-label-caps font-semibold text-on-success-container">
				<CheckCircle2 size={13} aria-hidden="true" />
				Acertada
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-error-container px-2.5 py-0.5 text-label-caps font-semibold text-on-error-container">
			<XCircle size={13} aria-hidden="true" />
			Fallada
		</span>
	);
}

function OpcionDeRespuesta({
	nombre,
	letra,
	texto,
	seleccionada,
	bloqueado,
	esCorrecta,
	esFalloElegido,
	onElegir,
}: {
	nombre: string;
	letra: string;
	texto: string;
	seleccionada: boolean;
	bloqueado: boolean;
	esCorrecta: boolean;
	esFalloElegido: boolean;
	onElegir: () => void;
}) {
	let borde = "border-outline-variant";
	let fondo = "bg-surface-container-low";
	let insignia = "bg-surface-container-high text-on-surface-variant";

	if (esCorrecta) {
		borde = "border-success";
		fondo = "bg-success-container/40";
		insignia = "bg-success text-on-success";
	} else if (esFalloElegido) {
		borde = "border-error";
		fondo = "bg-error-container/40";
		insignia = "bg-error text-on-error";
	} else if (seleccionada) {
		borde = "border-primary";
		fondo = "bg-primary/10";
		insignia = "bg-primary text-on-primary";
	}

	// El color no puede ser el único que diga cuál era la correcta: quien no lo
	// distinga, o lea con lector de pantalla, se queda sin la corrección. La
	// etiqueta va dentro del label, así que entra en el nombre accesible del
	// radio.
	let etiqueta: string | null = null;
	if (esCorrecta) etiqueta = seleccionada ? "Correcta · tu respuesta" : "Correcta";
	else if (esFalloElegido) etiqueta = "Tu respuesta";

	return (
		<label className={`block ${bloqueado ? "cursor-default" : "cursor-pointer"}`}>
			<input
				type="radio"
				name={nombre}
				value={letra}
				checked={seleccionada}
				onChange={onElegir}
				disabled={bloqueado}
				className="peer sr-only"
			/>
			<span
				className={`flex items-start gap-3 rounded-lg border ${borde} ${fondo} px-4 py-3 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface ${
					bloqueado ? "" : "hover:border-outline-strong"
				}`}
			>
				<span
					className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-label-caps font-semibold uppercase ${insignia}`}
					aria-hidden="true"
				>
					{letra}
				</span>
				<span className="min-w-0 flex-1 text-body-md text-on-surface">
					{texto}
				</span>
				{etiqueta && (
					<span
						className={`shrink-0 self-center rounded-full px-2 py-0.5 text-label-caps font-semibold ${
							esCorrecta
								? "bg-success-container text-on-success-container"
								: "bg-error-container text-on-error-container"
						}`}
					>
						{etiqueta}
					</span>
				)}
			</span>
		</label>
	);
}
