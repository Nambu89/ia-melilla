import { Link } from "react-router-dom";
import { MessageSquare, Calculator, FileText, BookOpen, Receipt, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedHeadline from "@/components/animations/AnimatedHeadline";
import AuroraBackground from "@/components/decoration/AuroraBackground";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
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
			"Pregunta lo que necesites sobre fiscalidad en Melilla. IPSI, REF, IRPF, deducciones, plazos. Responde citando normativa.",
		icon: MessageSquare,
		badge: "FLAGSHIP",
		featured: true,
	},
	{
		href: "/demos/ia-fiscal-melilla/calculadora-neto",
		title: "Calculadora Neto Autónomos",
		description:
			"Calcula tu neto mensual y anual. Aplica IPSI 4% y deducción 60% Ceuta/Melilla automáticamente.",
		icon: Calculator,
		badge: "CÁLCULO",
	},
	{
		href: "/demos/ia-fiscal-melilla/calculadora-retenciones",
		title: "Calculadora Retenciones IRPF",
		description:
			"Estima la retención IRPF de tu nómina aplicando reducción 60% Melilla si corresponde.",
		icon: FileText,
		badge: "CÁLCULO",
	},
	{
		href: "/demos/ia-fiscal-melilla/guia-fiscal",
		title: "Guía Fiscal IRPF",
		description:
			"Wizard paso a paso. Estima base, cuota líquida y resultado de tu declaración con cobertura Melilla.",
		icon: BookOpen,
		badge: "WIZARD",
	},
	{
		href: "/demos/ia-fiscal-melilla/clasificador-facturas",
		title: "Clasificador de Facturas",
		description:
			"Sube una factura PDF o foto. OCR + IA extrae proveedor, base, impuestos, clasifica PGC y genera el asiento contable.",
		icon: Receipt,
		badge: "OCR · IA",
	},
];

export default function DemoIaFiscal() {
	return (
		<PageShell>
			<SeoHead
				title="IA Fiscal Melilla — Showroom de herramientas"
				description="Chat IA + calculadoras + wizards fiscales especializados en el régimen fiscal de Melilla. Pruébalo gratis."
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
						lines={["IA Fiscal Melilla.", "Pruébala ya."]}
						as="h1"
						className="text-display-md md:text-display-lg lg:text-display-xl font-bold max-w-5xl text-on-surface"
					/>
					<RevealOnScroll delay={0.2}>
						<p className="mt-8 max-w-2xl text-body-lg text-on-surface-variant">
							Cinco herramientas conectadas a un mismo motor IA entrenado en
							el régimen fiscal de Melilla. Chat conversacional, calculadoras y
							wizards. Pruébalas en este orden o salta directamente a la que te
							interesa.
						</p>
					</RevealOnScroll>
				</div>
			</section>

			<section className="mx-auto max-w-[1200px] px-6 pb-24">
				<RevealOnScroll>
					<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
						HERRAMIENTAS DISPONIBLES
					</p>
					<h2 className="text-headline-lg font-semibold tracking-tight text-on-surface">
						{TOOLS.length} formas de probar el motor.
					</h2>
				</RevealOnScroll>
				<div className="mt-10 grid gap-6 md:grid-cols-2">
					{TOOLS.map((tool) => (
						<ToolCard key={tool.href} tool={tool} />
					))}
				</div>
			</section>

			<section className="mx-auto max-w-[1200px] px-6 pb-24">
				<RevealOnScroll>
					<div className="rounded-xl border border-outline-variant bg-surface-container p-8 md:p-12">
						<div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
							<div>
								<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
									¿NECESITAS ALGO A MEDIDA?
								</p>
								<h2 className="mt-3 text-headline-md font-semibold tracking-tight text-on-surface">
									Construimos asistentes IA para tu sector y tus procesos.
								</h2>
								<p className="mt-4 text-body-md text-on-surface-variant">
									El mismo motor que ves aquí lo adaptamos a otros regímenes,
									a tu CRM, a tus formularios. Cuéntanos qué problema tienes.
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
