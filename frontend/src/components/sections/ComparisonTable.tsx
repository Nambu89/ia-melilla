import { Check, X } from "lucide-react";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

const ROWS = [
	{
		without: "2 horas medias por consulta sobre IPSI",
		with: "8 segundos por respuesta con cita normativa",
	},
	{
		without: "Gestor saturado en campaña de renta",
		with: "Disponibilidad 24/7, sin esperar al lunes",
	},
	{
		without: "Errores por mezclar régimen peninsular y de Melilla",
		with: "Respuestas localizadas al régimen fiscal real",
	},
	{
		without: "Llamadas que se pierden y consultas sin respuesta",
		with: "Cada pregunta queda registrada y respondida",
	},
	{
		without: "Tarifas por hora opacas e impredecibles",
		with: "Coste fijo y conocido por adelantado",
	},
];

export function ComparisonTable() {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<RevealOnScroll>
				<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
					EL CAMBIO
				</p>
				<h2 className="text-headline-lg md:text-headline-lg font-semibold tracking-tight max-w-3xl text-on-surface">
					Antes y después de integrar IA Melilla.
				</h2>
			</RevealOnScroll>
			<RevealOnScroll delay={0.15}>
				<div className="mt-12 grid gap-6 md:grid-cols-2">
					<div className="rounded-xl border border-outline-variant bg-surface-container-low p-8">
						<div className="flex items-center gap-3 mb-6">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-error/10 text-error">
								<X size={18} />
							</div>
							<h3 className="text-headline-sm font-semibold text-on-surface">
								Sin IA Melilla
							</h3>
						</div>
						<ul className="flex flex-col gap-4">
							{ROWS.map((row, i) => (
								<li
									key={i}
									className="flex items-start gap-3 text-body-md text-on-surface-variant"
								>
									<span
										aria-hidden
										className="mt-2 h-1 w-1 shrink-0 rounded-full bg-on-surface-muted"
									/>
									{row.without}
								</li>
							))}
						</ul>
					</div>
					<div className="rounded-xl border border-primary/30 bg-surface-container p-8 shadow-[0_0_32px_-12px_rgba(16,185,129,0.4)]">
						<div className="flex items-center gap-3 mb-6">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
								<Check size={18} />
							</div>
							<h3 className="text-headline-sm font-semibold text-on-surface">
								Con IA Melilla
							</h3>
						</div>
						<ul className="flex flex-col gap-4">
							{ROWS.map((row, i) => (
								<li
									key={i}
									className="flex items-start gap-3 text-body-md text-on-surface"
								>
									<Check
										size={16}
										className="mt-1 shrink-0 text-primary"
										aria-hidden
									/>
									{row.with}
								</li>
							))}
						</ul>
					</div>
				</div>
			</RevealOnScroll>
		</section>
	);
}
