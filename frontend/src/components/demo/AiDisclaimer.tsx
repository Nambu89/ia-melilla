import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface AiDisclaimerProps {
	variant?: "banner" | "inline";
	className?: string;
}

export function AiDisclaimer({ variant = "banner", className = "" }: AiDisclaimerProps) {
	if (variant === "inline") {
		return (
			<p className={`text-body-sm text-on-surface-muted ${className}`}>
				<Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-primary" aria-hidden="true" />
				Estás interactuando con un sistema de IA. Las respuestas son orientativas y no
				constituyen asesoramiento profesional vinculante.{" "}
				<Link to="/transparencia-ia" className="text-primary hover:underline">
					Saber más
				</Link>
				.
			</p>
		);
	}

	return (
		<div
			role="note"
			className={`flex items-start gap-3 rounded-lg border border-primary/30 bg-primary-container/20 px-4 py-3 ${className}`}
		>
			<Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
			<p className="text-body-sm text-on-primary-container leading-relaxed">
				<strong className="text-on-surface">Estás interactuando con un sistema de IA.</strong>{" "}
				Las respuestas son meramente orientativas y{" "}
				<strong>no constituyen asesoramiento fiscal, jurídico ni profesional vinculante</strong>.
				Contrasta siempre la información con un profesional colegiado.{" "}
				<Link to="/transparencia-ia" className="text-primary underline-offset-2 hover:underline">
					Más información
				</Link>
				.
			</p>
		</div>
	);
}
