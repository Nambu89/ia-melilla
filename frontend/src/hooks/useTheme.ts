import { useCallback, useEffect, useState } from "react";

export type ThemeValue = "system" | "dark" | "light";
export type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "theme";
const DEFAULT_THEME: ThemeValue = "dark";

function getStoredTheme(): ThemeValue {
	if (typeof window === "undefined") return DEFAULT_THEME;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === "dark" || stored === "light" || stored === "system") {
		return stored;
	}
	return DEFAULT_THEME;
}

function resolveTheme(theme: ThemeValue): ResolvedTheme {
	if (theme === "dark") return "dark";
	if (theme === "light") return "light";
	// system
	if (typeof window === "undefined") return "dark";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyTheme(resolved: ResolvedTheme) {
	if (typeof document === "undefined") return;
	document.documentElement.setAttribute("data-theme", resolved);
}

/**
 * Hook que gestiona dark/light/system.
 * Lee/escribe localStorage "theme".
 * Aplica data-theme en <html>.
 * SSR-safe: default dark si no hay window.
 */
export function useTheme() {
	const [theme, setThemeState] = useState<ThemeValue>(() => {
		if (typeof window === "undefined") return DEFAULT_THEME;
		return getStoredTheme();
	});

	const resolvedTheme = resolveTheme(theme);

	// Aplicar data-theme al montar y cuando cambia
	useEffect(() => {
		applyTheme(resolveTheme(theme));
	}, [theme]);

	// Escuchar cambios sistema si theme === "system"
	useEffect(() => {
		if (theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => applyTheme(resolveTheme("system"));
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [theme]);

	const setTheme = useCallback((next: ThemeValue) => {
		setThemeState(next);
		if (typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, next);
		}
		applyTheme(resolveTheme(next));
	}, []);

	return { theme, resolvedTheme, setTheme };
}
