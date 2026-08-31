import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorNoticeProps {
	mensaje: string;
	/** Si se pasa, se pinta un botón para volver a intentarlo. */
	onReintentar?: () => void;
	etiquetaReintentar?: string;
	className?: string;
}

/**
 * Caja de error de las herramientas del tutor.
 *
 * El `mensaje` que llega aquí es el `detail` del backend tal cual: viene
 * redactado en castellano y para el usuario ("la consulta no parece estar del
 * temario publicado"). Cambiarlo por un genérico sería tirar la única
 * explicación útil que hay.
 */
export function ErrorNotice({
	mensaje,
	onReintentar,
	etiquetaReintentar = "Reintentar",
	className = "",
}: ErrorNoticeProps) {
	return (
		<div
			role="alert"
			className={`flex flex-col gap-3 rounded-md border border-error bg-error-container p-4 text-on-error-container sm:flex-row sm:items-start ${className}`}
		>
			<AlertCircle className="h-5 w-5 shrink-0 sm:mt-0.5" aria-hidden="true" />
			<p className="flex-1 text-body-md">{mensaje}</p>
			{onReintentar && (
				<Button
					variant="outline"
					size="sm"
					type="button"
					onClick={onReintentar}
					className="shrink-0"
				>
					{etiquetaReintentar}
				</Button>
			)}
		</div>
	);
}
