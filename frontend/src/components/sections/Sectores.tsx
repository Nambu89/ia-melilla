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
		<section className="border-t border-outline-variant bg-surface-container-low">
			<div className="mx-auto max-w-[1200px] px-6 py-20">
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
	return (
		<div className="flex items-start gap-4 rounded-lg border border-outline-variant bg-surface-container p-5 transition-colors hover:border-primary/30">
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
				<Icon size={18} aria-hidden />
			</div>
			<div>
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
