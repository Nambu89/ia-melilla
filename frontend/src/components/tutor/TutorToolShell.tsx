import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { ServiceNotice } from "@/components/tutor/ServiceNotice";

export const RUTA_DEL_TUTOR = "/demos/tutor-ia-opositores";

/**
 * El descargo de IA de esta demo.
 *
 * Lo obligatorio —que es un sistema de IA y que las respuestas son
 * orientativas— se mantiene. Contra qué contrastar cambia: a un opositor,
 * "consúltalo con un profesional colegiado" no le sirve de nada. Lo que sí le
 * sirve es el temario oficial y la convocatoria del BOE, que son los que mandan
 * en su examen.
 */
export const DESCARGO_DEL_TUTOR = (
	<>
		<strong className="text-on-surface">
			Estás interactuando con un sistema de IA.
		</strong>{" "}
		Sus respuestas son orientativas y salen de un temario de muestra:{" "}
		<strong>
			contrástalas siempre con el temario oficial y con la convocatoria del BOE
		</strong>
		, que son los que mandan en tu examen.{" "}
		<Link
			to="/transparencia-ia"
			className="text-primary underline-offset-2 hover:underline"
		>
			Más información
		</Link>
		.
	</>
);

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
			disclaimerContent={DESCARGO_DEL_TUTOR}
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
