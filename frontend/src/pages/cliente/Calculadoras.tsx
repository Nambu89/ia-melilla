import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calculator, Banknote, ClipboardCheck } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";

interface CalculadoraItem {
	label: string;
	description: string;
	href: string;
	icon: typeof Calculator;
}

const calculadoras: CalculadoraItem[] = [
	{
		label: "Calculadora de retenciones IRPF",
		description: "Calcula la retención exacta aplicable a una nómina o factura según tu situación personal y CCAA.",
		href: "/demos/ia-fiscal-melilla/calculadora-retenciones",
		icon: Calculator,
	},
	{
		label: "Calculadora de neto autónomo",
		description: "Calcula el neto mensual estimado tras IRPF + cuota autónomos + IVA/IPSI según régimen fiscal.",
		href: "/demos/ia-fiscal-melilla/calculadora-neto",
		icon: Banknote,
	},
	{
		label: "Guía fiscal IRPF (wizard)",
		description: "Estimación rápida del IRPF anual con descubrimiento automático de deducciones aplicables según perfil.",
		href: "/demos/ia-fiscal-melilla/guia-fiscal",
		icon: ClipboardCheck,
	},
];

export default function ClienteCalculadoras() {
	return (
		<PageShell>
			<SeoHead
				title="Calculadoras — Panel cliente — IA Melilla"
				description="Calculadoras fiscales para residentes en Melilla y régimen general."
				path="/cliente/calculadoras"
			/>
			<section className="mx-auto max-w-[1200px] px-6 pt-12 pb-24">
				<Link
					to="/cliente"
					className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-6"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					Volver al panel
				</Link>

				<p className="text-label-caps text-primary mb-3">Calculadoras</p>
				<h1 className="text-display-sm font-bold tracking-tight">
					Herramientas de cálculo fiscal
				</h1>
				<p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
					Calculadoras instantáneas sin necesidad de chat ni cuenta. Para consultas más
					complejas (modelos AEAT, simulaciones detalladas, normativa), usa el{" "}
					<Link to="/cliente/chat" className="text-primary hover:underline">
						chat fiscal
					</Link>
					.
				</p>

				<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{calculadoras.map((c) => {
						const Icon = c.icon;
						return (
							<Link
								key={c.href}
								to={c.href}
								className="group relative flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface-container-low p-6 transition hover:border-primary hover:bg-surface-container"
							>
								<div className="flex items-center gap-3">
									<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
										<Icon className="h-5 w-5" aria-hidden="true" />
									</span>
									<h3 className="text-headline-sm font-semibold text-on-surface">
										{c.label}
									</h3>
								</div>
								<p className="text-body-sm text-on-surface-variant">{c.description}</p>
								<span className="mt-2 inline-flex items-center gap-1 text-label-md text-primary group-hover:gap-2 transition-all">
									Abrir
									<ArrowRight className="h-4 w-4" aria-hidden="true" />
								</span>
							</Link>
						);
					})}
				</div>

				<aside className="mt-16 rounded-2xl border border-outline-variant bg-surface-container-low px-6 py-5 text-body-sm text-on-surface-variant">
					<strong className="text-on-surface">Nota:</strong> estas calculadoras son las
					mismas que se ofrecen como demos públicas. Son instantáneas, no requieren cuenta
					ni autenticación. Los resultados son orientativos.
				</aside>
			</section>
		</PageShell>
	);
}
