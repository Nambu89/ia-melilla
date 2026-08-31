import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Loader2, Quote, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { ErrorNotice } from "@/components/tutor/ErrorNotice";
import { WorkingNotice } from "@/components/tutor/WorkingNotice";
import { useAbortables } from "@/hooks/useAbortables";
import { useTutorHealth } from "@/hooks/useTutorHealth";
import {
	describirFallo,
	generarPregunta,
	obtenerTemas,
	type FalloDelTutor,
	type PreguntaGenerada,
} from "@/lib/tutorApi";

const LETRAS = ["a", "b", "c", "d"] as const;

const FASES_DE_GENERACION = [
	{ desdeSegundo: 0, texto: "Buscando en el tema un fragmento del que sacar la pregunta…" },
	{
		desdeSegundo: 6,
		texto: "Escribiendo la pregunta y comprobando que la respuesta está en ese fragmento…",
	},
	{
		desdeSegundo: 20,
		texto:
			"Sigue trabajando. Si la primera pregunta no cuadra con el temario, el tutor la descarta y lo vuelve a intentar.",
	},
] as const;

/**
 * El generador de preguntas: elige un tema y el tutor escribe una pregunta
 * nueva a partir del temario.
 *
 * La gracia no es la pregunta, es la prueba que va al lado. Se enseña el
 * fragmento del temario del que sale y, dentro de él, resaltada, la frase
 * concreta que sostiene la respuesta — que el backend comprueba carácter a
 * carácter contra el fragmento antes de darla por válida.
 */
export function QuestionForge() {
	const [temas, setTemas] = useState<string[]>([]);
	const [tema, setTema] = useState("");
	const [cargandoTemas, setCargandoTemas] = useState(true);
	const [errorTemas, setErrorTemas] = useState<FalloDelTutor | null>(null);
	const [generando, setGenerando] = useState(false);
	const [generada, setGenerada] = useState<PreguntaGenerada | null>(null);
	const [error, setError] = useState<FalloDelTutor | null>(null);

	const { nuevo, soltar, montado } = useAbortables();
	// Con el modelo apagado el generador solo puede devolver un 503.
	const { desactivado } = useTutorHealth();

	const cargarTemas = useCallback(async () => {
		setCargandoTemas(true);
		setErrorTemas(null);
		const controlador = nuevo();
		try {
			const lista = await obtenerTemas(controlador.signal);
			if (!montado.current) return;
			setTemas(lista);
			setTema((actual) => (actual !== "" ? actual : (lista[0] ?? "")));
		} catch (err) {
			if (!montado.current) return;
			setErrorTemas(
				describirFallo(err, "No hemos podido cargar la lista de temas"),
			);
		} finally {
			soltar(controlador);
			if (montado.current) setCargandoTemas(false);
		}
	}, [nuevo, soltar, montado]);

	useEffect(() => {
		void cargarTemas();
	}, [cargarTemas]);

	async function generar() {
		if (!tema || generando || desactivado) return;
		setGenerando(true);
		setError(null);
		setGenerada(null);
		const controlador = nuevo();
		try {
			const resultado = await generarPregunta(tema, controlador.signal);
			if (!montado.current) return;
			setGenerada(resultado);
		} catch (err) {
			if (!montado.current) return;
			setError(describirFallo(err, "No hemos podido generar la pregunta"));
		} finally {
			soltar(controlador);
			if (montado.current) setGenerando(false);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="rounded-xl border border-outline-variant bg-surface-container p-3 sm:p-6">
				<FormField
					label="Tema del temario"
					htmlFor="tema-del-generador"
					hint={
						cargandoTemas
							? "Cargando los temas publicados…"
							: "Solo salen los temas que tienen temario indexado."
					}
				>
					<select
						id="tema-del-generador"
						className="h-11 w-full rounded-md bg-surface-container-low px-4 py-3 text-body-md text-on-surface focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
						value={tema}
						onChange={(e) => setTema(e.target.value)}
						disabled={cargandoTemas || generando || temas.length === 0}
					>
						{temas.length === 0 && (
							<option value="">
								{cargandoTemas ? "Cargando…" : "Sin temas disponibles"}
							</option>
						)}
						{temas.map((nombre) => (
							<option key={nombre} value={nombre}>
								{nombre}
							</option>
						))}
					</select>
				</FormField>

				{errorTemas && (
					<ErrorNotice
						className="mt-4"
						mensaje={errorTemas.mensaje}
						onReintentar={
							errorTemas.reintentable ? () => void cargarTemas() : undefined
						}
					/>
				)}

				<Button
					type="button"
					size="lg"
					onClick={() => void generar()}
					disabled={generando || cargandoTemas || !tema || desactivado}
					className="mt-6 w-full sm:w-auto"
				>
					{generando ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
							Generando…
						</>
					) : (
						<>
							<Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
							Generar una pregunta
						</>
					)}
				</Button>
			</div>

			{generando && <WorkingNotice fases={FASES_DE_GENERACION} />}

			{error && (
				<ErrorNotice
					mensaje={error.mensaje}
					onReintentar={
						error.reintentable && !desactivado
							? () => void generar()
							: undefined
					}
				/>
			)}

			{!generando && !generada && !error && (
				<div className="rounded-xl border border-outline-variant bg-surface-container-low px-6 py-10 text-center">
					<span
						className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
						aria-hidden="true"
					>
						<Sparkles className="h-6 w-6" />
					</span>
					<p className="text-headline-sm font-semibold text-on-surface">
						Elige un tema y mira cómo se fabrica una pregunta
					</p>
					<p className="mx-auto mt-2 max-w-md text-body-md text-on-surface-variant">
						Verás la pregunta y, debajo, el fragmento del temario del que
						sale. Si el tutor no encuentra en qué apoyarse, no genera nada y
						te dice por qué.
					</p>
				</div>
			)}

			{generada && <PreguntaGeneradaVista datos={generada} />}

		</div>
	);
}

function PreguntaGeneradaVista({ datos }: { datos: PreguntaGenerada }) {
	const { pregunta, evidencia, procedencia, fragmento } = datos;
	return (
		<div className="flex flex-col gap-5">
			<article className="rounded-xl border border-primary/30 bg-surface-container p-4 sm:p-6">
				<div className="mb-4 flex flex-wrap items-center gap-2">
					<span className="text-label-caps uppercase tracking-[0.12em] text-primary">
						PREGUNTA GENERADA
					</span>
					{pregunta.tema && (
						<span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-caps text-on-surface-variant">
							{pregunta.tema}
						</span>
					)}
					<span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-caps text-on-surface-variant">
						Dificultad {pregunta.dificultad}
					</span>
					{procedencia && (
						<span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-caps text-on-surface-variant">
							Estilo tomado de: {procedencia}
						</span>
					)}
				</div>

				<p className="text-body-lg font-medium text-on-surface">
					{pregunta.enunciado}
				</p>

				<ul className="mt-4 flex flex-col gap-2">
					{LETRAS.filter(
						(letra) => pregunta.opciones[letra] !== undefined,
					).map((letra) => (
						<li
							key={letra}
							className="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3"
						>
							<span
								className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-label-caps font-semibold uppercase text-on-surface-variant"
								aria-hidden="true"
							>
								{letra}
							</span>
							<span className="text-body-md text-on-surface">
								{pregunta.opciones[letra]}
							</span>
						</li>
					))}
				</ul>

				<p className="mt-4 text-body-sm text-on-surface-muted">
					La respuesta correcta no viaja al navegador: la pregunta sale igual
					que saldría en un test de verdad.
				</p>
			</article>

			<section className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-6">
				<p className="mb-2 flex items-center gap-2 text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
					<Quote size={14} aria-hidden="true" />
					DE DÓNDE SALE
				</p>
				<p className="mb-4 text-body-sm text-on-surface-muted">
					Este es el fragmento del temario que el tutor tenía delante. Lo
					resaltado es la frase que sostiene la respuesta correcta, comprobada
					carácter a carácter contra el fragmento.
				</p>
				<p className="whitespace-pre-wrap border-l-2 border-primary/40 pl-4 text-body-sm leading-relaxed text-on-surface-variant">
					{resaltarEvidencia(fragmento, evidencia)}
				</p>
			</section>
		</div>
	);
}

/**
 * Resalta la evidencia dentro del fragmento del temario.
 *
 * Si no aparece literalmente —el backend lo comprueba, pero un cambio suyo no
 * puede romper esta pantalla— se enseñan los dos por separado en vez de
 * quedarse sin resaltado y sin evidencia.
 */
function resaltarEvidencia(fragmento: string, evidencia: string): ReactNode {
	if (!evidencia) return fragmento;
	const inicio = fragmento.indexOf(evidencia);
	if (inicio === -1) {
		return (
			<>
				{fragmento}
				{"\n\n"}
				<span className="rounded bg-primary/15 px-1 py-0.5 text-on-surface">
					{evidencia}
				</span>
			</>
		);
	}
	const fin = inicio + evidencia.length;
	return (
		<>
			{fragmento.slice(0, inicio)}
			<mark className="rounded bg-primary/20 px-1 py-0.5 text-on-surface">
				{evidencia}
			</mark>
			{fragmento.slice(fin)}
		</>
	);
}
