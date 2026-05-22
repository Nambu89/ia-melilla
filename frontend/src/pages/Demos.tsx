import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Badge } from "@/components/ui/badge";
import AnimatedHeadline from "@/components/animations/AnimatedHeadline";
import AuroraBackground from "@/components/decoration/AuroraBackground";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

interface Demo {
	slug: string;
	name: string;
	tagline: string;
	status: "live" | "coming-soon";
	toolsCount?: number;
	category: string;
}

const DEMOS: Demo[] = [
	{
		slug: "ia-fiscal-melilla",
		name: "IA Fiscal Melilla",
		tagline:
			"Asistente IA + 4 herramientas especializadas en el régimen fiscal de Melilla. IPSI, IRPF con deducción 60%, autónomos, deducciones.",
		status: "live",
		toolsCount: 5,
		category: "FISCAL",
	},
	{
		slug: "atencion-cliente",
		name: "IA Atención al Cliente",
		tagline:
			"Bot conversacional 24/7 entrenado con tu base de conocimiento. Integración WhatsApp, web, email.",
		status: "coming-soon",
		category: "COMERCIAL",
	},
	{
		slug: "captador-leads",
		name: "Captador de Leads IA",
		tagline:
			"Califica leads automáticamente conversando con visitantes web. Sincroniza con tu CRM.",
		status: "coming-soon",
		category: "COMERCIAL",
	},
	{
		slug: "reservas",
		name: "Reservas con Google Calendar",
		tagline:
			"Agenda citas por conversación natural. Consulta disponibilidad y reserva en tiempo real.",
		status: "coming-soon",
		category: "OPERACIONES",
	},
];

export default function Demos() {
	const liveDemos = DEMOS.filter((d) => d.status === "live");
	const upcoming = DEMOS.filter((d) => d.status === "coming-soon");

	return (
		<PageShell>
			<SeoHead
				title="Showroom de Demos · IA Melilla"
				description="Prueba nuestras demos de IA antes de contratar. IA Fiscal Melilla disponible. Más herramientas próximamente."
				path="/demos"
			/>
			<section className="relative overflow-hidden">
				<AuroraBackground />
				<div className="relative mx-auto max-w-[1200px] px-6 pt-20 pb-16 md:pt-28">
					<RevealOnScroll>
						<p className="text-label-caps uppercase tracking-[0.12em] text-primary mb-6">
							SHOWROOM · {liveDemos.length} DEMO{liveDemos.length !== 1 ? "S" : ""} ACTIVA
						</p>
					</RevealOnScroll>
					<AnimatedHeadline
						lines={["Pruébalo tú mismo.", "Sin compromiso."]}
						as="h1"
						className="text-display-md md:text-display-lg lg:text-display-xl font-bold max-w-5xl text-on-surface"
					/>
					<RevealOnScroll delay={0.2}>
						<p className="mt-8 max-w-2xl text-body-lg text-on-surface-variant">
							Cada demo es producto real conectado a backend de verdad, no
							maqueta. Lo que ves aquí es lo que entregamos a clientes,
							adaptado a tu caso.
						</p>
					</RevealOnScroll>
				</div>
			</section>

			<section className="mx-auto max-w-[1200px] px-6 pb-16">
				<RevealOnScroll>
					<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
						DISPONIBLES AHORA
					</p>
					<h2 className="text-headline-lg font-semibold tracking-tight text-on-surface">
						Demos activas.
					</h2>
				</RevealOnScroll>
				<div className="mt-10 grid gap-6">
					{liveDemos.map((demo) => (
						<DemoCardLive key={demo.slug} demo={demo} />
					))}
				</div>
			</section>

			<section className="mx-auto max-w-[1200px] px-6 pb-24">
				<RevealOnScroll>
					<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
						EN CONSTRUCCIÓN
					</p>
					<h2 className="text-headline-lg font-semibold tracking-tight text-on-surface">
						Próximas demos.
					</h2>
				</RevealOnScroll>
				<div className="mt-10 grid gap-6 md:grid-cols-3">
					{upcoming.map((demo) => (
						<DemoCardSoon key={demo.slug} demo={demo} />
					))}
				</div>
			</section>
		</PageShell>
	);
}

function DemoCardLive({ demo }: { demo: Demo }) {
	return (
		<Link
			to={`/demos/${demo.slug}`}
			className="group relative grid gap-6 rounded-xl border border-outline-variant bg-surface-container p-8 transition-all duration-200 hover:border-primary/50 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:grid-cols-[1fr_auto] md:items-center md:p-10"
		>
			<div>
				<div className="flex items-center gap-3">
					<Badge variant="primary">LIVE</Badge>
					<span className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
						{demo.category}
					</span>
					{demo.toolsCount && (
						<span className="text-label-lg text-on-surface-variant">
							· {demo.toolsCount} herramienta
							{demo.toolsCount !== 1 ? "s" : ""}
						</span>
					)}
				</div>
				<h3 className="mt-3 text-headline-md font-semibold tracking-tight text-on-surface md:text-headline-lg">
					{demo.name}
				</h3>
				<p className="mt-3 max-w-2xl text-body-md text-on-surface-variant">
					{demo.tagline}
				</p>
			</div>
			<div className="flex items-center gap-1.5 text-label-lg font-medium text-primary transition-transform duration-200 group-hover:translate-x-1">
				Entrar
				<ArrowRight size={16} />
			</div>
		</Link>
	);
}

function DemoCardSoon({ demo }: { demo: Demo }) {
	return (
		<div className="relative flex flex-col gap-4 rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-6 opacity-70">
			<div className="flex items-center gap-3">
				<Lock size={14} className="text-on-surface-muted" aria-hidden />
				<span className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted">
					{demo.category}
				</span>
			</div>
			<h3 className="text-headline-sm font-semibold text-on-surface-variant">
				{demo.name}
			</h3>
			<p className="text-body-md text-on-surface-muted">{demo.tagline}</p>
			<p className="mt-auto text-label-lg text-on-surface-muted">Próximamente</p>
		</div>
	);
}
