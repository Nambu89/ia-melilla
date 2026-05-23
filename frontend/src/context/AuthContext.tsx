import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import {
	login as loginRequest,
	logout as logoutRequest,
	readSession,
	subscribe as subscribeSession,
	type AuthSession,
} from "@/lib/auth";

interface AuthContextValue {
	session: AuthSession | null;
	isAuthenticated: boolean;
	isInitializing: boolean;
	login: (email: string, password: string) => Promise<AuthSession>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<AuthSession | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		setSession(readSession());
		setIsInitializing(false);
		const unsub = subscribeSession((next) => setSession(next));
		return unsub;
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const newSession = await loginRequest(email, password);
		setSession(newSession);
		return newSession;
	}, []);

	const logout = useCallback(() => {
		logoutRequest();
		setSession(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			session,
			isAuthenticated: session !== null,
			isInitializing,
			login,
			logout,
		}),
		[session, isInitializing, login, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
	}
	return ctx;
}
