import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AiDisclaimerProps {
	variant?: "banner" | "inline";
	className?: string;
	/**
	 * El cuerpo del descargo. Por defecto es el fiscal, que es de donde salió
	 * este componente.
	 *
	 * Lo que hay que decir siempre —que es un sistema de IA y que las respuestas
	 * son orientativas— vale para todas las demos. A quién contrastar, no: a un
	 * opositor, "consulta con un profesional colegiado" no le dice nada, y
	 * "asesoramiento fiscal" es de otro producto. Cada demo pone contra qué se
	 * contrasta lo suyo.
	 */
	contenido?: ReactNode;
}

const ENLACE_TRANSPARENCIA = (
	<Link
		to="/transparencia-ia"
		className="text-primary underline-offset-2 hover:underline"
	>
		Más información
	</Link>
);

const CONTENIDO_FISCAL_POR_DEFECTO = (
	<>
		<strong className="text-on-surface">
			Estás interactuando con un sistema de IA.
		</strong>{" "}
		Las respuestas son meramente orientativas y{" "}
		<strong>
			no constituyen asesoramiento fiscal, jurídico ni profesional vinculante
		</strong>
		. Contrasta siempre la información con un profesional colegiado.{" "}
		{ENLACE_TRANSPARENCIA}.
	</>
);

export function AiDisclaimer({
	variant = "banner",
	className = "",
	contenido,
}: AiDisclaimerProps) {
	if (variant === "inline") {
		return (
			<p className={`text-body-sm text-on-surface-muted ${className}`}>
				<Sparkles
					className="mr-1.5 inline h-3.5 w-3.5 text-primary"
					aria-hidden="true"
				/>
				{contenido ?? (
					<>
						Estás interactuando con un sistema de IA. Las respuestas son
						orientativas y no constituyen asesoramiento profesional
						vinculante.{" "}
						<Link
							to="/transparencia-ia"
							className="text-primary hover:underline"
						>
							Saber más
						</Link>
						.
					</>
				)}
			</p>
		);
	}

	return (
		<div
			role="note"
			className={`flex items-start gap-3 rounded-lg border border-primary/30 bg-primary-container/20 px-4 py-3 ${className}`}
		>
			<Sparkles
				className="mt-0.5 h-4 w-4 shrink-0 text-primary"
				aria-hidden="true"
			/>
			<p className="text-body-sm text-on-primary-container leading-relaxed">
				{contenido ?? CONTENIDO_FISCAL_POR_DEFECTO}
			</p>
		</div>
	);
}
