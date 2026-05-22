import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

interface ToolPageShellProps {
	eyebrow?: string;
	title: string;
	description?: string;
	backHref?: string;
	backLabel?: string;
	children: ReactNode;
}

export function ToolPageShell({
	eyebrow = "IA FISCAL MELILLA",
	title,
	description,
	backHref = "/demos/ia-fiscal-melilla",
	backLabel = "Volver a IA Fiscal Melilla",
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
			</RevealOnScroll>
			<div className="mt-12">{children}</div>
			<div className="mt-16 rounded-lg border border-outline-variant bg-surface-container-low p-5">
				<p className="text-body-sm text-on-surface-muted">
					<strong className="text-on-surface-variant">Por si acaso:</strong>{" "}
					esto es una estimación, no un papel firmado. Para casos serios,
					mejor llévalo a un asesor fiscal.
				</p>
			</div>
		</section>
	);
}
