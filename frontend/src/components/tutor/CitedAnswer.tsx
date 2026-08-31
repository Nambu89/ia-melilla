import { useCallback, useId, useState, type ReactNode } from "react";
import { BookOpen } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/Accordion";
import type { FuenteDelTutor } from "@/lib/tutorApi";

interface CitedAnswerProps {
	texto: string;
	fuentes: readonly FuenteDelTutor[];
}

const MARCADOR_DE_CITA = /(\[\d+\])/g;

/**
 * La respuesta del tutor con sus fuentes del temario.
 *
 * Las fuentes son la mitad del valor de la herramienta: sin ellas esto parece
 * un chat genérico, y con ellas se ve que cada frase sale de un fragmento
 * concreto del temario que el visitante puede leer. Por eso los marcadores
 * `[1]`, `[2]` del texto son pulsables y despliegan su fuente, en vez de
 * quedarse como ruido tipográfico.
 */
export function CitedAnswer({ texto, fuentes }: CitedAnswerProps) {
	const prefijo = useId().replace(/:/g, "");
	const [abiertas, setAbiertas] = useState<string[]>([]);

	const idDeFuente = useCallback(
		(numero: number) => `${prefijo}-fuente-${numero}`,
		[prefijo],
	);

	const numerosDisponibles = new Set(fuentes.map((f) => f.numero));

	const abrirFuente = useCallback(
		(numero: number) => {
			const valor = String(numero);
			setAbiertas((previas) =>
				previas.includes(valor) ? previas : [...previas, valor],
			);
			// El acordeón anima al abrirse; sin el respiro el scroll apunta a la
			// posición que el elemento tenía antes de crecer.
			//
			// `start` y no `center`: centrar deja el fragmento a media pantalla,
			// que en móvil es justo donde cae el banner de cookies mientras no se
			// ha contestado. Arriba se lee además desde el principio, que es como
			// se quiere leer una cita.
			window.setTimeout(() => {
				document.getElementById(idDeFuente(numero))?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 120);
		},
		[idDeFuente],
	);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 text-body-md leading-relaxed text-on-surface">
				{partirEnParrafos(texto).map((parrafo, i) => (
					<p key={i}>
						{pintarConCitas(parrafo, numerosDisponibles, abrirFuente)}
					</p>
				))}
			</div>

			{fuentes.length > 0 && (
				<div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
					<p className="mb-2 flex items-center gap-2 text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
						<BookOpen size={14} aria-hidden="true" />
						{fuentes.length === 1
							? "1 fragmento del temario"
							: `${fuentes.length} fragmentos del temario`}
					</p>
					<p className="mb-3 text-body-sm text-on-surface-muted">
						Esto es lo que el tutor ha leído para contestar. Despliega para
						comprobarlo.
					</p>
					<Accordion
						type="multiple"
						value={abiertas}
						onValueChange={setAbiertas}
					>
						{fuentes.map((fuente) => (
							<AccordionItem
								key={fuente.numero}
								value={String(fuente.numero)}
								className="border-outline-variant"
							>
								<div id={idDeFuente(fuente.numero)}>
									<AccordionTrigger className="py-3 text-body-md font-medium">
										<span className="flex items-center gap-2 text-left">
											<span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/15 px-1.5 text-label-caps font-semibold text-primary">
												{fuente.numero}
											</span>
											{fuente.tema ?? "Temario"}
										</span>
									</AccordionTrigger>
									<AccordionContent>
										<p className="whitespace-pre-wrap border-l-2 border-primary/40 pl-4 text-body-sm leading-relaxed text-on-surface-variant">
											{fuente.contenido}
										</p>
									</AccordionContent>
								</div>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			)}
		</div>
	);
}

function partirEnParrafos(texto: string): string[] {
	const parrafos = texto
		.split(/\n{2,}/)
		.map((p) => p.trim())
		.filter(Boolean);
	return parrafos.length > 0 ? parrafos : [texto];
}

/**
 * Convierte los `[N]` del texto en botones que despliegan su fuente.
 *
 * Un marcador que apunte a un número que no está en `fuentes` se deja como
 * texto plano: es preferible enseñarlo tal cual a pintar un botón que no lleva
 * a ninguna parte.
 */
function pintarConCitas(
	parrafo: string,
	numerosDisponibles: ReadonlySet<number>,
	alPulsar: (numero: number) => void,
): ReactNode[] {
	return parrafo.split(MARCADOR_DE_CITA).map((trozo, i) => {
		const coincidencia = /^\[(\d+)\]$/.exec(trozo);
		if (!coincidencia) return <span key={i}>{trozo}</span>;
		const numero = Number(coincidencia[1]);
		if (!numerosDisponibles.has(numero)) return <span key={i}>{trozo}</span>;
		return (
			<button
				key={i}
				type="button"
				onClick={() => alPulsar(numero)}
				aria-label={`Ver el fragmento del temario número ${numero}`}
				className="mx-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 align-baseline text-label-caps font-semibold text-primary transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			>
				{numero}
			</button>
		);
	});
}
