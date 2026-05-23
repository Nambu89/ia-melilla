import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Calculator, FileText, Shield, Settings } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Tool {
	label: string;
	description: string;
	href: string;
	icon: typeof MessageSquare;
	status: "available" | "soon";
}

const tools: Tool[] = [
	{
		label: "Chat fiscal",
		description: "Asistente conversacional con acceso a normativa AEAT y BOE.",
		href: "/cliente/chat",
		icon: MessageSquare,
		status: "available",
	},
	{
		label: "Calculadoras",
		description: "IRPF, retenciones, neto autónomo, IPSI Melilla.",
		href: "/cliente/calculadoras",
		icon: Calculator,
		status: "available",
	},
	{
		label: "Modelos AEAT",
		description: "Pídeselos al chat: 'genera modelo 303 con base 21% de 12.000€'. Soporta 100, 130, 131, 200 IS, 303, 308, 309, 349, 390, 420 IGIC, 720, 721, IPSI.",
		href: "/cliente/chat",
		icon: FileText,
		status: "available",
	},
	{
		label: "DefensIA",
		description: "Asistente de defensa fiscal para requerimientos AEAT, reclamaciones y recursos.",
		href: "/cliente/defensia",
		icon: Shield,
		status: "available",
	},
	{
		label: "Ajustes",
		description: "Perfil, suscripción, sesión activa.",
		href: "/cliente/ajustes",
		icon: Settings,
		status: "available",
	},
];

export default function ClienteDashboard() {
	const { session, logout } = useAuth();

	return (
		<PageShell>
			<SeoHead
				title="Panel — IA Melilla"
				description="Suite completa de herramientas fiscales para clientes de IA Melilla."
				path="/cliente"
			/>
			<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="text-label-caps text-primary mb-3">Panel</p>
						<h1 className="text-display-md font-bold tracking-tight">
							Hola{session?.user.name ? `, ${session.user.name}` : ""}
						</h1>
						<p className="mt-3 text-body-md text-on-surface-variant">
							Sesión iniciada como{" "}
							<span className="text-on-surface">{session?.user.email}</span>.
						</p>
					</div>
					<Button
						variant="secondary"
						size="sm"
						onClick={logout}
						className="self-start md:self-center"
					>
						<LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
						Cerrar sesión
					</Button>
				</div>

				<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{tools.map((tool) => (
						<ToolCard key={tool.href} tool={tool} />
					))}
				</div>

				<aside className="mt-16 rounded-2xl border border-outline-variant bg-surface-container-low px-6 py-5 text-body-sm text-on-surface-variant">
					<strong className="text-on-surface">Acceso de demo</strong> — esta
					suite se entrega bajo acuerdo explícito con el titular. Las salidas
					generadas son orientativas y no sustituyen al asesoramiento de un
					profesional colegiado. Consulta el aviso legal y los términos para
					más detalle.
				</aside>
			</section>
		</PageShell>
	);
}

function ToolCard({ tool }: { tool: Tool }) {
	const Icon = tool.icon;
	const isAvailable = tool.status === "available";

	const inner = (
		<>
			<div className="flex items-center gap-3">
				<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
					<Icon className="h-5 w-5" aria-hidden="true" />
				</span>
				<h3 className="text-headline-sm font-semibold text-on-surface">{tool.label}</h3>
			</div>
			<p className="text-body-sm text-on-surface-variant">{tool.description}</p>
			{!isAvailable && (
				<span className="absolute right-4 top-4 rounded-full border border-outline-variant bg-surface-container px-2 py-0.5 text-label-sm text-on-surface-muted">
					Próximamente
				</span>
			)}
		</>
	);

	const className = `group relative flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface-container-low p-6 transition ${
		isAvailable ? "hover:border-primary hover:bg-surface-container" : "opacity-60"
	}`;

	if (isAvailable) {
		return (
			<Link to={tool.href} className={className}>
				{inner}
			</Link>
		);
	}
	return <div className={className}>{inner}</div>;
}
