import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AuthError } from "@/lib/auth";

export default function ClienteLogin() {
	const { login, isAuthenticated, isInitializing } = useAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const next = searchParams.get("next") || "/cliente";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	// Si ya está autenticado, redirigir directamente
	useEffect(() => {
		if (!isInitializing && isAuthenticated) {
			navigate(next, { replace: true });
		}
	}, [isAuthenticated, isInitializing, navigate, next]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		if (submitting) return;
		setErrorMsg(null);
		setSubmitting(true);
		try {
			await login(email, password);
			navigate(next, { replace: true });
		} catch (err) {
			if (err instanceof AuthError) {
				setErrorMsg(err.message);
			} else {
				setErrorMsg("Ocurrió un error inesperado. Vuelve a intentarlo.");
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<PageShell>
			<SeoHead
				title="Acceso clientes — IA Melilla"
				description="Inicia sesión en la suite completa de herramientas fiscales de IA Melilla."
				path="/cliente/login"
			/>
			<section className="mx-auto flex min-h-[70vh] max-w-[480px] flex-col justify-center px-6 py-16">
				<div className="text-center">
					<p className="text-label-caps text-primary mb-3">Acceso clientes</p>
					<h1 className="text-display-sm font-bold tracking-tight">
						Inicia sesión
					</h1>
					<p className="mt-4 text-body-md text-on-surface-variant">
						Accede a la suite completa de herramientas fiscales. Si aún no
						tienes credenciales,{" "}
						<Link to="/contacto" className="text-primary hover:underline">
							contacta con nosotros
						</Link>
						.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="mt-10 flex flex-col gap-5"
					noValidate
				>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="login-email"
							className="text-label-md font-medium text-on-surface"
						>
							Correo electrónico
						</label>
						<input
							id="login-email"
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={submitting}
							className="h-12 w-full rounded-xl border border-outline bg-surface-container-low px-4 text-body-md text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
							placeholder="tu@empresa.com"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="login-password"
							className="text-label-md font-medium text-on-surface"
						>
							Contraseña
						</label>
						<input
							id="login-password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={submitting}
							className="h-12 w-full rounded-xl border border-outline bg-surface-container-low px-4 text-body-md text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
							placeholder="••••••••"
						/>
					</div>

					{errorMsg && (
						<div
							role="alert"
							className="rounded-xl border border-error/40 bg-error-container/30 px-4 py-3 text-body-sm text-on-error-container"
						>
							{errorMsg}
						</div>
					)}

					<Button
						type="submit"
						variant="primary"
						size="md"
						disabled={submitting || !email || !password}
						className="mt-2 w-full"
					>
						{submitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
								Iniciando sesión…
							</>
						) : (
							"Entrar"
						)}
					</Button>
				</form>

				<p className="mt-8 text-center text-body-sm text-on-surface-muted">
					Demo restringida — uso bajo autorización explícita del titular.
				</p>
			</section>
		</PageShell>
	);
}
