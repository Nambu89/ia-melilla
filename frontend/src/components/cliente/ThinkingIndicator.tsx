import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ThinkingIndicatorProps {
	/** Frases que se rotan mientras la IA piensa. Cambian cada `intervalMs` ms. */
	messages: readonly string[];
	/** Milisegundos entre cambios de frase. Default 4500. */
	intervalMs?: number;
	/** Label corto opcional (ej. "DEFENSIA"). Aparece arriba en mayúsculas. */
	label?: string;
}

/**
 * Indicador de "pensando" con frases rotatorias para dar sensación de
 * progreso cuando un stream LLM tarda decenas de segundos en empezar a
 * devolver contenido. Se monta solo durante la espera y se desmonta al
 * llegar el primer chunk de respuesta real.
 */
export function ThinkingIndicator({
	messages,
	intervalMs = 4500,
	label = "PENSANDO",
}: ThinkingIndicatorProps) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (messages.length <= 1) return;
		const id = window.setInterval(() => {
			setIndex((i) => (i + 1) % messages.length);
		}, intervalMs);
		return () => window.clearInterval(id);
	}, [messages.length, intervalMs]);

	const current = messages[index] ?? "";

	return (
		<div
			className="mb-4 flex justify-start"
			role="status"
			aria-live="polite"
		>
			<div className="max-w-[80%] rounded-lg bg-surface-container-highest px-5 py-3 text-on-surface">
				<p className="text-label-caps text-on-surface-muted mb-1 font-mono">{label}</p>
				<p className="text-body-md flex items-center gap-3">
					<Loader2
						className="h-4 w-4 shrink-0 animate-spin text-primary"
						aria-hidden="true"
					/>
					<span className="transition-opacity duration-300">{current}</span>
				</p>
			</div>
		</div>
	);
}
