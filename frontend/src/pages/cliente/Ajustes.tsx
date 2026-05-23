import { Link } from "react-router-dom";
import { ArrowLeft, LogOut, Mail, Calendar, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ClienteAjustes() {
	const { session, logout } = useAuth();

	const loggedAt = session?.loggedAt
		? new Date(session.loggedAt).toLocaleString("es-ES", {
				dateStyle: "medium",
				timeStyle: "short",
		  })
		: "—";

	return (
		<PageShell>
			<SeoHead
				title="Ajustes — Panel cliente — IA Melilla"
				description="Perfil, sesión y configuración de la cuenta."
				path="/cliente/ajustes"
			/>
			<section className="mx-auto max-w-[800px] px-6 pt-12 pb-24">
				<Link
					to="/cliente"
					className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-6"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					Volver al panel
				</Link>

				<p className="text-label-caps text-primary mb-3">Ajustes</p>
				<h1 className="text-display-sm font-bold tracking-tight">Mi cuenta</h1>

				<div className="mt-10 flex flex-col gap-4">
					<Card
						icon={<Mail className="h-5 w-5" />}
						label="Correo electrónico"
						value={session?.user.email ?? "—"}
					/>
					<Card
						icon={<ShieldCheck className="h-5 w-5" />}
						label="Plan"
						value={session?.user.plan ?? "autonomo (demo)"}
					/>
					<Card
						icon={<Calendar className="h-5 w-5" />}
						label="Sesión iniciada"
						value={loggedAt}
					/>
				</div>

				<div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-outline-variant bg-surface-container-low px-6 py-5">
					<h2 className="text-headline-sm font-semibold text-on-surface">Cerrar sesión</h2>
					<p className="text-body-sm text-on-surface-variant">
						Cierra la sesión en este dispositivo. Tu token JWT se eliminará del
						almacenamiento local.
					</p>
					<Button variant="secondary" size="sm" onClick={logout}>
						<LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
						Cerrar sesión
					</Button>
				</div>

				<aside className="mt-10 rounded-2xl border border-outline-variant bg-surface-container-low px-6 py-5 text-body-sm text-on-surface-variant">
					<strong className="text-on-surface">Soporte:</strong> si necesitas cambiar tu
					contraseña, ampliar tu cuenta o reportar una incidencia, escribe a{" "}
					<a className="text-primary hover:underline" href="mailto:hola@iamelilla.com">
						hola@iamelilla.com
					</a>{" "}
					o usa el formulario de{" "}
					<Link className="text-primary hover:underline" to="/contacto">
						contacto
					</Link>
					.
				</aside>
			</section>
		</PageShell>
	);
}

function Card({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-4 rounded-2xl border border-outline-variant bg-surface-container-low px-6 py-5">
			<span className="mt-1 text-primary">{icon}</span>
			<div>
				<p className="text-label-caps text-on-surface-muted">{label}</p>
				<p className="text-body-md text-on-surface">{value}</p>
			</div>
		</div>
	);
}
