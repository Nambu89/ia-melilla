import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RequireAuthProps {
	children: ReactNode;
	/**
	 * Ruta a la que redirigir cuando NO hay sesión activa.
	 * Por defecto `/cliente/login`. La página de destino tras login se guarda
	 * en query string `?next=...` para volver tras autenticar.
	 */
	loginPath?: string;
}

export function RequireAuth({ children, loginPath = "/cliente/login" }: RequireAuthProps) {
	const { isAuthenticated, isInitializing } = useAuth();
	const location = useLocation();

	// Evita flash de redirect mientras se hidrata sesión desde localStorage
	useEffect(() => {
		// no-op: el render condicional ya lo maneja
	}, [isInitializing]);

	if (isInitializing) {
		return (
			<div
				className="flex min-h-[60vh] items-center justify-center"
				role="status"
				aria-live="polite"
			>
				<span className="text-body-md text-on-surface-variant">Cargando…</span>
			</div>
		);
	}

	if (!isAuthenticated) {
		const next = encodeURIComponent(location.pathname + location.search);
		return <Navigate to={`${loginPath}?next=${next}`} replace />;
	}

	return <>{children}</>;
}
