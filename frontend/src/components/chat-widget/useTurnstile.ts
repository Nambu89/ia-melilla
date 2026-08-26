import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile opcional.
 *
 * Si no hay ``VITE_TURNSTILE_SITE_KEY`` configurada, el hook es un no-op:
 * ``enabled=false`` y ``token=null`` (el backend del leadbot sólo exige el
 * token cuando hay ``TURNSTILE_SECRET_KEY`` en su lado). Así el widget funciona
 * hoy y el captcha se "enciende" creando la site key (bloqueante #5).
 */

interface TurnstileAPI {
	render: (el: HTMLElement, opts: Record<string, unknown>) => string;
	reset: (id?: string) => void;
	remove: (id?: string) => void;
}

declare global {
	interface Window {
		turnstile?: TurnstileAPI;
	}
}

const SCRIPT_SRC =
	"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Se cachea la promesa en vez de buscar el `<script>` en el DOM: un script que
 * ya falló sigue ahí, y engancharse a su `load`/`error` es esperar a eventos que
 * ya ocurrieron. Al fallar se borra la caché para que el siguiente intento —
 * reabrir el panel, por ejemplo— pueda volver a cargarlo.
 */
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
	if (window.turnstile) return Promise.resolve();
	if (scriptPromise) return scriptPromise;
	scriptPromise = new Promise<void>((resolve, reject) => {
		const s = document.createElement("script");
		s.src = SCRIPT_SRC;
		s.async = true;
		s.defer = true;
		s.onload = () => resolve();
		s.onerror = () => reject(new Error("turnstile load error"));
		document.head.appendChild(s);
	});
	void scriptPromise.catch(() => {
		scriptPromise = null;
	});
	return scriptPromise;
}

export function useTurnstile(active: boolean) {
	const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
	const enabled = Boolean(siteKey);
	const containerRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		if (!enabled || !active) return;
		let cancelled = false;
		loadScript()
			.then(() => {
				if (cancelled || !containerRef.current || !window.turnstile) return;
				widgetIdRef.current = window.turnstile.render(containerRef.current, {
					sitekey: siteKey,
					callback: (t: string) => setToken(t),
					"expired-callback": () => setToken(null),
					"error-callback": () => setToken(null),
				});
			})
			.catch(() => setToken(null));
		return () => {
			cancelled = true;
			// El contenedor se va con el panel al cerrarlo. Si no retiramos el
			// widget, al reabrir Turnstile no vuelve a pintarse en el nodo nuevo y
			// "Empezar" se queda deshabilitado para siempre.
			if (widgetIdRef.current !== null) {
				window.turnstile?.remove(widgetIdRef.current);
				widgetIdRef.current = null;
			}
			setToken(null);
		};
	}, [enabled, active, siteKey]);

	/**
	 * Los tokens de Turnstile son de un solo uso: si el arranque falla y el
	 * visitante reintenta, hay que pedir uno nuevo o el backend rechazará el
	 * reintento por token ya gastado.
	 */
	const reset = useCallback(() => {
		if (!enabled) return;
		setToken(null);
		window.turnstile?.reset(widgetIdRef.current ?? undefined);
	}, [enabled]);

	// ready=true cuando: deshabilitado (no hace falta) o ya tenemos token.
	return {
		enabled,
		token,
		containerRef,
		reset,
		ready: !enabled || Boolean(token),
	};
}
