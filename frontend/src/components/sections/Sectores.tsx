import {
	HeartPulse,
	ShoppingCart,
	Megaphone,
	Rocket,
	Truck,
	GraduationCap,
	type LucideIcon,
} from "lucide-react";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
import DotGrid from "@/components/decoration/DotGrid";
import { useSpotlight } from "@/hooks/useSpotlight";

interface Sector {
	icon: LucideIcon;
	name: string;
	example: string;
}

const SECTORES: Sector[] = [
	{
		icon: HeartPulse,
		name: "Salud y bienestar",
		example: "Asistente virtual de citas y respuesta a pacientes",
	},
	{
		icon: ShoppingCart,
		name: "E-commerce",
		example: "Catálogos automáticos, modelos virtuales, atención 24/7",
	},
	{
		icon: Megaphone,
		name: "Marketing y redes",
		example: "Contenido a escala, influencer IA, gestión social",
	},
	{
		icon: Rocket,
		name: "Emprendedores y autónomos",
		example: "Asistentes fiscales, automatización de tareas repetidas",
	},
	{
		icon: Truck,
		name: "Logística y operaciones",
		example: "Optimización rutas, predicción demanda, mantenimiento",
	},
	{
		icon: GraduationCap,
		name: "Academias y formación",
		example: "Tutor IA personalizado, generador de exámenes",
	},
];

export function Sectores() {
	return (
		<section className="relative border-t border-outline-variant bg-surface-container-low">
			<DotGrid fadeRadius="70%" />
			<div className="relative mx-auto max-w-[1200px] px-6 py-20">
				<RevealOnScroll>
					<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
						SECTORES
					</p>
					<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl text-on-surface">
						Donde ya hemos visto que funciona.
					</h2>
					<p className="mt-4 max-w-2xl text-body-md text-on-surface-variant">
						Aplicaciones reales que hemos montado, organizadas por sector.
						Si el tuyo no está, escríbenos igual — la mayoría de problemas
						se parecen entre sí.
					</p>
				</RevealOnScroll>

				<div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{SECTORES.map((s, i) => (
						<RevealOnScroll key={s.name} delay={i * 0.06}>
							<SectorCard sector={s} />
						</RevealOnScroll>
					))}
				</div>
			</div>
		</section>
	);
}

function SectorCard({ sector }: { sector: Sector }) {
	const Icon = sector.icon;
	const [handlers, pos] = useSpotlight<HTMLDivElement>();
	return (
		<div
			ref={handlers.ref}
			onMouseMove={handlers.onMouseMove}
			onMouseEnter={handlers.onMouseEnter}
			onMouseLeave={handlers.onMouseLeave}
			className="relative flex items-start gap-4 overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-5 transition-colors hover:border-primary/30"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 transition-opacity duration-500"
				style={{
					opacity: pos.opacity,
					background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(0,94,196,0.16), transparent 70%)`,
				}}
			/>
			<div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
				<Icon size={18} aria-hidden />
			</div>
			<div className="relative">
				<h3 className="text-label-lg font-semibold text-on-surface">
					{sector.name}
				</h3>
				<p className="mt-1 text-body-sm text-on-surface-variant">
					{sector.example}
				</p>
			</div>
		</div>
	);
}
