import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, Loader2, GraduationCap, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CitedAnswer } from "@/components/tutor/CitedAnswer";
import { ErrorNotice } from "@/components/tutor/ErrorNotice";
import { WorkingNotice } from "@/components/tutor/WorkingNotice";
import { useAbortables } from "@/hooks/useAbortables";
import { useTutorHealth } from "@/hooks/useTutorHealth";
import {
	describirFallo,
	preguntarAlTutor,
	type FalloDelTutor,
	type RespuestaDelTutor,
} from "@/lib/tutorApi";

/** Tope del backend (`ConsultaDelTutor.consulta`): pasarse de aquí es un 422. */
const LONGITUD_MAXIMA = 2000;

const FASES_DE_CARGA = [
	{ desdeSegundo: 0, texto: "Buscando en el temario los fragmentos que valen…" },
	{ desdeSegundo: 5, texto: "Redactando la respuesta con lo que ha encontrado…" },
	{
		desdeSegundo: 18,
		texto:
			"Sigue trabajando. Las respuestas con varias fuentes pueden tardar cerca de medio minuto.",
	},
] as const;

interface Intercambio {
	/**
	 * Identificador propio, no la posición en la lista: al reintentar se quita
	 * el intercambio fallido y se añade otro, así que un índice capturado antes
	 * de la llamada acabaría señalando a la pregunta equivocada.
	 */
	id: number;
	pregunta: string;
	respuesta: RespuestaDelTutor | null;
	error: FalloDelTutor | null;
}

interface TutorChatProps {
	preguntasSugeridas: readonly string[];
}

export function TutorChat({ preguntasSugeridas }: TutorChatProps) {
	const [intercambios, setIntercambios] = useState<Intercambio[]>([]);
	const [borrador, setBorrador] = useState("");
	const [ocupado, setOcupado] = useState(false);
	const finalRef = useRef<HTMLDivElement>(null);
	const siguienteIdRef = useRef(1);
	const { nuevo, soltar, montado } = useAbortables();
	// Con el modelo apagado ninguna consulta va a contestar: no se manda.
	const { desactivado } = useTutorHealth();

	useEffect(() => {
		if (intercambios.length === 0) return;
		finalRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}, [intercambios]);

	async function preguntar(consulta: string) {
		const limpia = consulta.trim();
		if (!limpia || ocupado || desactivado) return;

		const id = siguienteIdRef.current;
		siguienteIdRef.current += 1;
		setIntercambios((previos) => [
			...previos,
			{ id, pregunta: limpia, respuesta: null, error: null },
		]);
		setBorrador("");
		setOcupado(true);

		const controlador = nuevo();
		try {
			const respuesta = await preguntarAlTutor(limpia, controlador.signal);
			if (!montado.current) return;
			setIntercambios((previos) =>
				previos.map((item) =>
					item.id === id ? { ...item, respuesta, error: null } : item,
				),
			);
		} catch (err) {
			if (!montado.current) return;
			const fallo = describirFallo(err, "El tutor no ha podido contestar");
			setIntercambios((previos) =>
				previos.map((item) =>
					item.id === id ? { ...item, error: fallo } : item,
				),
			);
		} finally {
			soltar(controlador);
			if (montado.current) setOcupado(false);
		}
	}

	function reintentar(intercambio: Intercambio) {
		if (ocupado) return;
		setIntercambios((previos) =>
			previos.filter((item) => item.id !== intercambio.id),
		);
		void preguntar(intercambio.pregunta);
	}

	function alEnviar(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		void preguntar(borrador);
	}

	const vacio = intercambios.length === 0;

	return (
		<div className="flex flex-col gap-5">
			{vacio ? (
				<EstadoVacio />
			) : (
				<div className="flex flex-col gap-6">
					{intercambios.map((intercambio) => (
						<article
							key={intercambio.id}
							className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container p-4 sm:p-6"
						>
							<div className="flex items-start gap-3">
								<span
									className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant"
									aria-hidden="true"
								>
									<User size={16} />
								</span>
								<p className="text-body-md font-medium text-on-surface">
									{intercambio.pregunta}
								</p>
							</div>

							<div className="flex items-start gap-3 border-t border-outline-variant pt-4">
								<span
									className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
									aria-hidden="true"
								>
									<GraduationCap size={16} />
								</span>
								<div className="min-w-0 flex-1">
									{intercambio.respuesta && (
										<CitedAnswer
											texto={intercambio.respuesta.texto}
											fuentes={intercambio.respuesta.fuentes}
										/>
									)}
									{intercambio.error && (
										<ErrorNotice
											mensaje={intercambio.error.mensaje}
											onReintentar={
												ocupado ||
												desactivado ||
												!intercambio.error.reintentable
													? undefined
													: () => reintentar(intercambio)
											}
										/>
									)}
									{!intercambio.respuesta && !intercambio.error && (
										<WorkingNotice fases={FASES_DE_CARGA} />
									)}
								</div>
							</div>
						</article>
					))}
					<div ref={finalRef} />
				</div>
			)}

			<form className="flex gap-3" onSubmit={alEnviar}>
				<Input
					value={borrador}
					onChange={(e) => setBorrador(e.target.value)}
					disabled={ocupado || desactivado}
					maxLength={LONGITUD_MAXIMA}
					placeholder="Escribe tu duda sobre el temario…"
					aria-label="Tu pregunta sobre el temario"
				/>
				<Button
					type="submit"
					disabled={ocupado || desactivado || !borrador.trim()}
					aria-label="Enviar la pregunta"
					className="shrink-0 px-4"
				>
					{ocupado ? (
						<Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
					) : (
						<Send className="h-5 w-5" aria-hidden="true" />
					)}
				</Button>
			</form>

			{vacio && (
				<div>
					<p className="mb-3 text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
						PRUEBA A PREGUNTAR
					</p>
					<ul className="flex flex-col gap-2">
						{preguntasSugeridas.map((pregunta) => (
							<li key={pregunta}>
								<button
									type="button"
									onClick={() => void preguntar(pregunta)}
									disabled={ocupado || desactivado}
									className="w-full rounded-md border border-outline-variant px-4 py-3 text-left text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
								>
									{pregunta}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

		</div>
	);
}

function EstadoVacio() {
	return (
		<div className="rounded-xl border border-outline-variant bg-surface-container px-6 py-12 text-center">
			<span
				className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
				aria-hidden="true"
			>
				<GraduationCap className="h-6 w-6" />
			</span>
			<p className="text-headline-sm font-semibold text-on-surface">
				Pregúntale lo que quieras del temario
			</p>
			<p className="mx-auto mt-2 max-w-md text-body-md text-on-surface-variant">
				Contesta con los fragmentos del temario que ha usado, numerados al lado
				de cada afirmación. Si la duda no está en el temario publicado, te lo
				dice en vez de inventarse la respuesta.
			</p>
		</div>
	);
}
