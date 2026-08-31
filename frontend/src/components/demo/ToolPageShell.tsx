import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
import { AiDisclaimer } from "@/components/demo/AiDisclaimer";

interface ToolPageShellProps {
	eyebrow?: string;
	title: string;
	description?: string;
	backHref?: string;
	backLabel?: string;
	/**
	 * La coletilla del pie. Por defecto es la fiscal, que es de donde salió
	 * este componente; las demos que no van de impuestos pasan la suya, porque
	 * mandar a un opositor "a un asesor fiscal" no significa nada.
	 */
	footerNote?: ReactNode;
	/** Cuerpo del descargo de IA. Por defecto, el fiscal. */
	disclaimerContent?: ReactNode;
	children: ReactNode;
}

const NOTA_FISCAL_POR_DEFECTO = (
	<>
		<strong className="text-on-surface-variant">Por si acaso:</strong> esto es
		una estimación, no un papel firmado. Para casos serios, mejor llévalo a un
		asesor fiscal.
	</>
);

export function ToolPageShell({
	eyebrow = "IA FISCAL MELILLA",
	title,
	description,
	backHref = "/demos/ia-fiscal-melilla",
	backLabel = "Volver a IA Fiscal Melilla",
	footerNote = NOTA_FISCAL_POR_DEFECTO,
	disclaimerContent,
	children,
}: ToolPageShellProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24 md:pt-20">
			<Link
				to={backHref}
				className="inline-flex items-center gap-1.5 text-label-lg text-on-surface-variant transition-colors hover:text-on-surface"
			>
				<ChevronLeft size={16} />
				{backLabel}
			</Link>
			<RevealOnScroll>
				<p className="mt-8 text-label-caps uppercase tracking-[0.12em] text-primary">
					{eyebrow}
				</p>
				<h1 className="mt-3 text-display-md md:text-display-lg font-bold tracking-tight text-on-surface max-w-4xl">
					{title}
				</h1>
				{description && (
					<p className="mt-6 max-w-2xl text-body-lg text-on-surface-variant">
						{description}
					</p>
				)}
				<AiDisclaimer className="mt-8 max-w-3xl" contenido={disclaimerContent} />
			</RevealOnScroll>
			<div className="mt-12">{children}</div>
			<div className="mt-16 rounded-lg border border-outline-variant bg-surface-container-low p-5">
				<p className="text-body-sm text-on-surface-muted">{footerNote}</p>
			</div>
		</section>
	);
}
