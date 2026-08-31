import { PowerOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useTutorHealth } from "@/hooks/useTutorHealth";

/**
 * Avisa solo cuando el tutor está apagado de verdad.
 *
 * Se pinta con `llm_desactivado`, el latch vivo del backend, y con nada más: la
 * foto de arranque (`llm.chat`) puede decir "error" con el tutor respondiendo
 * bien, así que usarla aquí apagaría la demo sin motivo. Mientras el latch esté
 * bajo, este componente no ocupa sitio.
 */
export function ServiceNotice({ className = "" }: { className?: string }) {
	const { desactivado } = useTutorHealth();
	if (!desactivado) return null;

	return (
		<div
			role="status"
			className={`flex items-start gap-3 rounded-lg border border-warning/40 bg-warning-container/20 px-4 py-3 ${className}`}
		>
			<PowerOff
				className="mt-0.5 h-4 w-4 shrink-0 text-warning"
				aria-hidden="true"
			/>
			<p className="text-body-sm text-on-warning-container">
				<strong className="text-on-surface">
					El tutor está temporalmente sin servicio.
				</strong>{" "}
				El modelo que genera las respuestas se ha quedado sin crédito, así que
				las herramientas no van a contestar hasta que lo repongamos. Si querías
				verlo funcionando,{" "}
				<Link to="/contacto" className="text-primary hover:underline">
					escríbenos
				</Link>{" "}
				y te lo enseñamos.
			</p>
		</div>
	);
}
