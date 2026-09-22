import { PlugZap } from "lucide-react";
import { useTutorHealth } from "@/hooks/useTutorHealth";
import { urlDelTutor } from "@/lib/tutorApi";

/**
 * Aviso discreto de que no se ha podido contactar con el servicio del tutor.
 *
 * No apaga nada: `/salud` puede no llegar y las herramientas funcionar. Está
 * aquí porque, si no, la única pista de un CORS mal puesto vive en la consola
 * del navegador, y en esta casa no se le pide a nadie que la abra. Quien
 * despliegue lo ve en la propia página y sabe dónde mirar.
 *
 * El caso de `llm.chat: "error"` NO se avisa: esa comprobación se hace con un
 * presupuesto de cinco tokens y los modelos que razonan lo agotan pensando, así
 * que dice "error" con el tutor respondiendo bien. De eso se ocupa
 * [ServiceNotice] con `llm_desactivado`, que sí es el latch vivo.
 */
export function ConnectionNotice({ className = "" }: { className?: string }) {
	const { inalcanzable } = useTutorHealth();
	if (!inalcanzable) return null;

	let destino: string;
	try {
		destino = urlDelTutor();
	} catch {
		destino = "sin configurar";
	}

	return (
		<div
			role="status"
			className={`flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 ${className}`}
		>
			<PlugZap
				className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-muted"
				aria-hidden="true"
			/>
			<div className="text-body-sm text-on-surface-muted">
				<p>
					<strong className="text-on-surface-variant">
						No hemos podido contactar con el servicio del tutor.
					</strong>{" "}
					Las herramientas siguen abiertas por si se recupera, pero es probable
					que no contesten.
				</p>
				<p className="mt-1.5">
					Si acabas de desplegar: el frontend está llamando a{" "}
					<code className="rounded bg-surface-container px-1 py-0.5 font-mono text-[0.95em] text-on-surface-variant">
						{destino}
					</code>
					. Comprueba esa dirección en{" "}
					<code className="font-mono text-[0.95em]">VITE_API_TUTOR_URL</code> y
					que el dominio de esta web esté en{" "}
					<code className="font-mono text-[0.95em]">CORS_ORIGENES</code> del
					backend.
				</p>
			</div>
		</div>
	);
}
