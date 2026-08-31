import type { ReactNode } from "react";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { ServiceNotice } from "@/components/tutor/ServiceNotice";

export const RUTA_DEL_TUTOR = "/demos/tutor-ia-opositores";

interface TutorToolShellProps {
	title: string;
	description: string;
	children: ReactNode;
}

/**
 * La cáscara de las tres herramientas del tutor.
 *
 * Es `ToolPageShell` con lo del tutor ya puesto —el enlace de vuelta, la
 * coletilla del pie y el aviso de servicio— para que las tres páginas no
 * repitan esos cuatro datos y no puedan desincronizarse entre ellas.
 */
export function TutorToolShell({
	title,
	description,
	children,
}: TutorToolShellProps) {
	return (
		<ToolPageShell
			eyebrow="TUTOR IA PARA OPOSITORES"
			title={title}
			description={description}
			backHref={RUTA_DEL_TUTOR}
			backLabel="Volver al Tutor IA para opositores"
			footerNote={
				<>
					<strong className="text-on-surface-variant">Por si acaso:</strong>{" "}
					esto es una demo con un temario de muestra. Estudia siempre con el
					material oficial de tu convocatoria: el tutor te ayuda a entenderlo,
					no lo sustituye.
				</>
			}
		>
			<ServiceNotice className="mb-6" />
			{children}
		</ToolPageShell>
	);
}
