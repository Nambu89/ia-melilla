import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { business } from "@/content/shared";

interface DemoLimitGateProps {
	blocked: boolean;
	used: number;
	max: number;
	toolLabel: string;
	children: ReactNode;
}

/**
 * Wraps a public demo tool. While the visitor still has usage budget,
 * renders the children normally. When the localStorage counter has hit
 * the cap (default 2 uses), replaces the tool UI with a lock screen
 * that asks the visitor to contact us by email. Decision: the limit
 * does NOT renew.
 */
export function DemoLimitGate({
	blocked,
	used,
	max,
	toolLabel,
	children,
}: DemoLimitGateProps) {
	if (!blocked) {
		return (
			<>
				{used > 0 && used < max && (
					<div className="mb-4 rounded-md border border-warning/40 bg-warning-container/20 px-4 py-3 text-body-sm text-on-warning-container">
						Te queda <strong>{max - used}</strong>{" "}
						{max - used === 1 ? "uso gratuito" : "usos gratuitos"} de esta
						herramienta en este navegador.
					</div>
				)}
				{children}
			</>
		);
	}

	const mailtoSubject = encodeURIComponent(
		`Quiero seguir usando ${toolLabel}`,
	);
	const mailtoBody = encodeURIComponent(
		`Hola,\n\nHe probado la herramienta "${toolLabel}" en iamelilla.com y me gustaría seguir usándola. ¿Me podéis dar acceso o información sobre los planes?\n\nGracias.`,
	);
	const mailtoHref = `mailto:${business.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

	return (
		<div className="rounded-2xl border border-outline-variant bg-surface-container px-8 py-12 text-center">
			<div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
				<Lock className="h-7 w-7" aria-hidden="true" />
			</div>
			<h2 className="text-headline-md font-semibold text-on-surface">
				Has agotado las pruebas gratuitas de esta demo
			</h2>
			<p className="mx-auto mt-3 max-w-xl text-body-md text-on-surface-variant">
				Esta demo pública te permite usar <strong>{toolLabel}</strong> hasta{" "}
				<strong>{max} veces</strong> sin registrarte. Si quieres seguir
				usándola o que la integremos en tu negocio, escríbenos y te
				contactamos.
			</p>
			<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
				<a
					href={mailtoHref}
					className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-label-lg font-semibold text-on-primary transition-colors hover:bg-primary/90"
				>
					<Mail className="h-5 w-5" aria-hidden="true" />
					Escríbenos a {business.email}
				</a>
				<Link
					to="/contacto"
					className="inline-flex items-center gap-2 rounded-md border border-outline-variant bg-surface px-6 py-3 text-label-lg font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
				>
					Formulario de contacto
				</Link>
			</div>
			<p className="mt-8 text-body-sm text-on-surface-muted">
				¿Eres cliente?{" "}
				<Link to="/cliente/login" className="text-primary hover:underline">
					Accede al panel
				</Link>{" "}
				para uso ilimitado.
			</p>
		</div>
	);
}
