import { Link } from "react-router-dom";
import { MessageSquare, Calculator, FileText, BookOpen, Receipt, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedHeadline from "@/components/animations/AnimatedHeadline";
import AuroraBackground from "@/components/decoration/AuroraBackground";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
import { AiDisclaimer } from "@/components/demo/AiDisclaimer";
import { DemoFlagship } from "@/components/sections/DemoFlagship";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { AboutMelilla } from "@/components/sections/AboutMelilla";
import { demoIaFiscalContent } from "@/content/demoIaFiscal";
import type { LucideIcon } from "lucide-react";

interface Tool {
	href: string;
	title: string;
	description: string;
	icon: LucideIcon;
	badge: string;
	featured?: boolean;
}

const TOOLS: Tool[] = [
	{
		href: "/demos/ia-fiscal-melilla/chat",
		title: "Chat IA Fiscal",
		description:
			"Preguntá lo que sea sobre fiscalidad de Melilla. IPSI, REF, IRPF, deducciones, plazos. Te contesta y te cita la norma para que puedas comprobarla.",
		icon: MessageSquare,
		badge: "FLAGSHIP",
		featured: true,
	},
	{
		href: "/demos/ia-fiscal-melilla/calculadora-neto",
		title: "Calculadora Neto Autónomos",
		description:
			"Mira cuánto te queda al mes y al año. Aplica IPSI 4% y la deducción 60% de Ceuta/Melilla por ti.",
		icon: Calculator,
		badge: "CÁLCULO",
	},
	{
		href: "/demos/ia-fiscal-melilla/calculadora-retenciones",
		title: "Calculadora Retenciones IRPF",
		description:
			"Mete tu sueldo bruto y mira qué te retendrán. Si vives aquí, la reducción del 60% ya está dentro.",
		icon: FileText,
		badge: "CÁLCULO",
	},
	{
		href: "/demos/ia-fiscal-melilla/guia-fiscal",
		title: "Guía Fiscal IRPF",
		description:
			"Te llevamos paso a paso por la declaración. Base, cuotas y resultado, con cobertura de Melilla incluida.",
		icon: BookOpen,
		badge: "WIZARD",
	},
	{
		href: "/demos/ia-fiscal-melilla/clasificador-facturas",
		title: "Clasificador de Facturas",
		description:
			"Suelta una factura en PDF o foto. La IA saca proveedor, base, impuestos, te dice la cuenta PGC y te propone el asiento.",
		icon: Receipt,
		badge: "OCR · IA",
	},
];

export default function DemoIaFiscal() {
	const { demoFlagship, aboutFiscal } = demoIaFiscalContent;
	return (
		<PageShell>
			<SeoHead
				title="IA Fiscal Melilla — Demo del régimen fiscal local"
				description="Chat IA + calculadoras + wizards fiscales especializados en el régimen fiscal de Melilla. Esta es la primera demo del showroom de IA Melilla. Pruébala gratis."
				path="/demos/ia-fiscal-melilla"
			/>
			<section className="relative overflow-hidden">
				<AuroraBackground />
				<div className="relative mx-auto max-w-[1200px] px-6 pt-20 pb-16 md:pt-28">
					<RevealOnScroll>
						<Badge variant="primary" className="mb-6">
							DEMO 1 · DISPONIBLE
						</Badge>
					</RevealOnScroll>
					<AnimatedHeadline
						lines={["IA Fiscal Melilla.", "Trastéala."]}
						as="h1"
						className="text-display-md md:text-display-lg lg:text-display-xl font-bold max-w-5xl text-on-surface"
					/>
					<RevealOnScroll delay={0.2}>
						<p className="mt-8 max-w-2xl text-body-lg text-on-surface-variant">
							Esta es la primera demo del showroom de IA Melilla. Cinco
							herramientas tirando del mismo motor IA, entrenado en el régimen
							fiscal específico de Melilla. Chat, calculadoras, wizard y un
							clasificador de facturas. Pruébalas como quieras.
						</p>
						<AiDisclaimer className="mt-8 max-w-3xl" />
					</RevealOnScroll>
				</div>
			</section>

			<DemoFlagship
				eyebrow={demoFlagship.eyebrow}
				headline={demoFlagship.headline}
				subheadline={demoFlagship.subheadline}
				exchange={demoFlagship.exchange}
				cta={demoFlagship.cta}
			/>

			<section className="mx-auto max-w-[1200px] px-6 pb-24">
				<RevealOnScroll>
					<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
						HERRAMIENTAS DISPONIBLES
					</p>
					<h2 className="text-headline-lg font-semibold tracking-tight text-on-surface">
						Cinco formas de meterle mano al motor.
					</h2>
				</RevealOnScroll>
				<div className="mt-10 grid gap-6 md:grid-cols-2">
					{TOOLS.map((tool) => (
						<ToolCard key={tool.href} tool={tool} />
					))}
				</div>
			</section>

			<ComparisonTable />

			<AboutMelilla
				eyebrow={aboutFiscal.eyebrow}
				headline={aboutFiscal.headline}
				body={aboutFiscal.body}
				stats={aboutFiscal.stats}
			/>

			<section className="mx-auto max-w-[1200px] px-6 pb-24">
				<RevealOnScroll>
					<div className="rounded-xl border border-outline-variant bg-surface-container p-8 md:p-12">
						<div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
							<div>
								<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
									¿LO TUYO ES OTRA HISTORIA?
								</p>
								<h2 className="mt-3 text-headline-md font-semibold tracking-tight text-on-surface">
									Te montamos un asistente IA para tu sector y tus procesos.
								</h2>
								<p className="mt-4 text-body-md text-on-surface-variant">
									El motor que ves aquí lo adaptamos a otros regímenes, a tu
									CRM o a tus formularios. Cuéntanos qué te trae de cabeza.
								</p>
							</div>
							<div className="flex flex-col gap-3 md:items-end">
								<Button asChild size="lg">
									<Link to="/contacto">Pedir cita</Link>
								</Button>
								<Button asChild variant="outline" size="lg">
									<Link to="/empresas">Soluciones empresas</Link>
								</Button>
							</div>
						</div>
					</div>
				</RevealOnScroll>
			</section>
		</PageShell>
	);
}

function ToolCard({ tool }: { tool: Tool }) {
	const Icon = tool.icon;
	return (
		<Link
			to={tool.href}
			className={`group relative flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container p-8 transition-all duration-200 hover:border-primary/50 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
				tool.featured ? "md:col-span-2 md:row-auto" : ""
			}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Icon size={22} aria-hidden />
				</div>
				<Badge variant={tool.featured ? "primary" : "b2b"}>{tool.badge}</Badge>
			</div>
			<div>
				<h3 className="text-headline-sm font-semibold text-on-surface">
					{tool.title}
				</h3>
				<p className="mt-2 text-body-md text-on-surface-variant">
					{tool.description}
				</p>
			</div>
			<div className="mt-auto flex items-center gap-1.5 text-label-lg font-medium text-primary transition-transform duration-200 group-hover:translate-x-1">
				Probar
				<ArrowRight size={16} />
			</div>
		</Link>
	);
}
