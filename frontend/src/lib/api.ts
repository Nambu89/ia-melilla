export interface ContactSubmission {
	nombre: string;
	email: string;
	telefono?: string;
	audience: "empresa" | "particular";
	mensaje: string;
}

export type ContactResult = { ok: true } | { ok: false; error: string };

/**
 * Submits the contact form. Backend not wired in Fase 1 — stub returns
 * success after a short delay so the UI flow can be tested. Replaced
 * with POST /api/leads in Fase 2.
 */
export async function submitContact(data: ContactSubmission): Promise<ContactResult> {
	await new Promise((r) => setTimeout(r, 600));
	if (!data.email.includes("@")) return { ok: false, error: "invalid_email" };
	return { ok: true };
}
