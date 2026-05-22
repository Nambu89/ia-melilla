import { Link } from "react-router-dom";
import {
	MessageCircle,
	Bot,
	ShoppingBag,
	Sparkles,
	Image,
	Workflow,
	ArrowRight,
	type LucideIcon,
} from "lucide-react";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

interface Service {
	icon: LucideIcon;
	title: string;
	description: string;
	tags: string[];
	href: string;
}

const SERVICES: Service[] = [
	{
		icon: Bot,
		title: "Chatbots IA personalizados",
		description:
			"Asistentes conversacionales entrenados con tu base de conocimiento. Web, app, intranet o canal interno.",
		tags: ["Atención cliente", "Soporte interno"],
		href: "/contacto?servicio=chatbot",
	},
	{
		icon: MessageCircle,
		title: "Asistentes WhatsApp 24/7",
		description:
			"Automatiza consultas, reservas y captación por WhatsApp. Sin perder llamadas ni clientes los fines de semana.",
		tags: ["Reservas", "Captación"],
		href: "/contacto?servicio=whatsapp",
	},
	{
		icon: ShoppingBag,
		title: "Modelos virtuales para ropa",
		description:
			"Try-on virtual con IA para tu e-commerce. Genera fotos de producto sobre modelos diversos sin sesión fotográfica.",
		tags: ["E-commerce", "Moda"],
		href: "/contacto?servicio=modelos-virtuales",
	},
	{
		icon: Sparkles,
		title: "Influencer IA / Avatar",
		description:
			"Persona digital propia que habla por tu marca. Vídeos, posts, anuncios — generados en horas, no semanas.",
		tags: ["Marketing", "Branding"],
		href: "/contacto?servicio=influencer-ia",
	},
	{
		icon: Image,
		title: "Contenido visual con IA",
		description:
			"Imágenes y vídeos a medida para campañas, redes y catálogos. Coherencia de marca sin diseñador a tiempo completo.",
		tags: ["Redes sociales", "Ads"],
		href: "/contacto?servicio=contenido-visual",
	},
	{
		icon: Workflow,
		title: "Automatizaciones inteligentes",
		description:
			"Conectamos tu CRM, hojas, ERP, email y formularios para que el papeleo se haga solo. Tu equipo en lo importante.",
		tags: ["Procesos", "Productividad"],
		href: "/contacto?servicio=automatizacion",
	},
];

export function ServicesGrid() {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<RevealOnScroll>
				<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
					QUÉ HACEMOS
				</p>
				<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl text-on-surface">
					IA aplicada a problemas concretos. Sin humo.
				</h2>
				<p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
					Seis líneas de trabajo. Todo lo entregamos con el producto
					funcionando y con tu equipo formado para operarlo.
				</p>
			</RevealOnScroll>

			<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{SERVICES.map((s) => (
					<ServiceCard key={s.title} service={s} />
				))}
			</div>

			<RevealOnScroll delay={0.2}>
				<div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-body-md text-on-surface-variant max-w-xl">
						¿Tu caso no encaja exacto en estas categorías? Te lo construimos
						a medida.
					</p>
					<Link
						to="/contacto"
						className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary transition-colors hover:text-primary-hover"
					>
						Cuéntanos tu caso
						<ArrowRight size={16} />
					</Link>
				</div>
			</RevealOnScroll>
		</section>
	);
}

function ServiceCard({ service }: { service: Service }) {
	const Icon = service.icon;
	return (
		<Link
			to={service.href}
			className="group flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container p-6 transition-all duration-200 hover:border-primary/50 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
		>
			<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
				<Icon size={20} aria-hidden />
			</div>
			<div className="flex-1">
				<h3 className="text-headline-sm font-semibold text-on-surface">
					{service.title}
				</h3>
				<p className="mt-2 text-body-md text-on-surface-variant">
					{service.description}
				</p>
			</div>
			<div className="flex flex-wrap gap-2 pt-2">
				{service.tags.map((tag) => (
					<span
						key={tag}
						className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-md text-on-surface-variant"
					>
						{tag}
					</span>
				))}
			</div>
			<div className="mt-2 flex items-center gap-1.5 text-label-lg font-medium text-primary opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
				Pedir información
				<ArrowRight size={14} />
			</div>
		</Link>
	);
}
