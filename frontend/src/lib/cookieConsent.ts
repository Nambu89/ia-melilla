export type CookieCategory = "technical" | "preferences" | "analytics" | "marketing";

export type ConsentState = Record<CookieCategory, boolean>;

const STORAGE_KEY = "cookie-consent";
const TIMESTAMP_KEY = "cookie-consent-timestamp";
const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 365 * 2;

export const DEFAULT_CONSENT: ConsentState = {
	technical: true,
	preferences: false,
	analytics: false,
	marketing: false,
};

export const ACCEPT_ALL_CONSENT: ConsentState = {
	technical: true,
	preferences: true,
	analytics: true,
	marketing: true,
};

export function loadConsent(): ConsentState | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const ts = localStorage.getItem(TIMESTAMP_KEY);
		if (!raw || !ts) return null;
		const age = Date.now() - Number(ts);
		if (Number.isNaN(age) || age > CONSENT_MAX_AGE_MS) {
			clearConsent();
			return null;
		}
		const parsed = JSON.parse(raw) as Partial<ConsentState>;
		return { ...DEFAULT_CONSENT, ...parsed, technical: true };
	} catch {
		return null;
	}
}

export function saveConsent(consent: ConsentState): void {
	if (typeof window === "undefined") return;
	const enforced: ConsentState = { ...consent, technical: true };
	localStorage.setItem(STORAGE_KEY, JSON.stringify(enforced));
	localStorage.setItem(TIMESTAMP_KEY, String(Date.now()));
	window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: enforced }));
}

export function clearConsent(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(STORAGE_KEY);
	localStorage.removeItem(TIMESTAMP_KEY);
}

export function hasResponded(): boolean {
	return loadConsent() !== null;
}
