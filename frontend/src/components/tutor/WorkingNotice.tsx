import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Fase {
	/** Segundo a partir del cual se enseña este texto. */
	desdeSegundo: number;
	texto: string;
}

interface WorkingNoticeProps {
	/** Ordenadas por `desdeSegundo` ascendente. La primera debe empezar en 0. */
	fases: readonly Fase[];
	className?: string;
}

/**
 * Aviso de "estoy trabajando" con el tiempo transcurrido a la vista.
 *
 * El backend del tutor tarda entre 5 y 30 segundos y el generador puede tardar
 * más. Un spinner mudo durante medio minuto se lee como una aplicación colgada
 * y el visitante recarga justo cuando faltaba poco, así que el contador y el
 * texto que cambia por fases están para que se vea que sigue vivo y por qué
 * tarda.
 */
export function WorkingNotice({ fases, className = "" }: WorkingNoticeProps) {
	const [segundos, setSegundos] = useState(0);

	useEffect(() => {
		const intervalo = window.setInterval(() => {
			setSegundos((s) => s + 1);
		}, 1000);
		return () => window.clearInterval(intervalo);
	}, []);

	const fase =
		[...fases].reverse().find((f) => segundos >= f.desdeSegundo) ?? fases[0];

	return (
		<div
			role="status"
			aria-live="polite"
			className={`flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 ${className}`}
		>
			<Loader2
				className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-primary"
				aria-hidden="true"
			/>
			<p className="text-body-sm text-on-surface-variant">
				{fase?.texto}{" "}
				<span className="text-on-surface-muted tabular-nums">
					({segundos} s)
				</span>
			</p>
		</div>
	);
}
