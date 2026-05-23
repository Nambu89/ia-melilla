import { apiPost, ApiError } from "./apiClient";

const STORAGE_KEY = "iamelilla.auth.v1";
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface TokenPair {
	access_token: string;
	refresh_token?: string;
	token_type?: string;
	expires_in?: number;
}

export interface AuthUser {
	id?: string;
	email: string;
	name?: string;
	plan?: string;
	is_owner?: boolean;
}

export interface LoginResponse {
	tokens: TokenPair;
	user?: AuthUser;
}

export interface AuthSession {
	tokens: TokenPair;
	user: AuthUser;
	loggedAt: number; // epoch ms
}

const tokenSubscribers = new Set<(session: AuthSession | null) => void>();

function notify(session: AuthSession | null): void {
	for (const fn of tokenSubscribers) {
		try {
			fn(session);
		} catch {
			// no-op, suscriptor roto no debe romper a los demás
		}
	}
}

export function subscribe(fn: (session: AuthSession | null) => void): () => void {
	tokenSubscribers.add(fn);
	return () => tokenSubscribers.delete(fn);
}

export function readSession(): AuthSession | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as AuthSession;
		if (!parsed?.tokens?.access_token || !parsed?.user?.email) return null;
		return parsed;
	} catch {
		return null;
	}
}

function writeSession(session: AuthSession | null): void {
	try {
		if (session) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
		} else {
			localStorage.removeItem(STORAGE_KEY);
		}
	} catch {
		// localStorage no disponible (modo incógnito estricto, cookies bloqueadas)
	}
	notify(session);
}

export class AuthError extends Error {
	constructor(
		public code: "invalid_credentials" | "rate_limited" | "network" | "unknown",
		message: string,
	) {
		super(message);
		this.name = "AuthError";
	}
}

export async function login(
	email: string,
	password: string,
	signal?: AbortSignal,
): Promise<AuthSession> {
	try {
		const res = await apiPost<LoginResponse>(
			BASE_URL,
			"/auth/login",
			{ email: email.trim().toLowerCase(), password },
			undefined,
			signal,
		);
		const user: AuthUser = res.user ?? { email: email.trim().toLowerCase() };
		const session: AuthSession = {
			tokens: res.tokens,
			user,
			loggedAt: Date.now(),
		};
		writeSession(session);
		return session;
	} catch (err) {
		if (err instanceof ApiError) {
			if (err.status === 401) {
				throw new AuthError("invalid_credentials", "Correo o contraseña incorrectos.");
			}
			if (err.status === 429) {
				throw new AuthError(
					"rate_limited",
					"Has superado el límite de intentos. Espera unos minutos antes de reintentar.",
				);
			}
			throw new AuthError(
				"unknown",
				`No pudimos iniciar sesión (HTTP ${err.status}). Inténtalo más tarde.`,
			);
		}
		throw new AuthError(
			"network",
			"No pudimos conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.",
		);
	}
}

export function logout(): void {
	writeSession(null);
}

export function getAccessToken(): string | null {
	const session = readSession();
	return session?.tokens.access_token ?? null;
}

export function isAuthenticated(): boolean {
	return readSession() !== null;
}
