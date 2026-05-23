import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitContact, type ContactSubmission } from "@/lib/api";
import { contactoContent } from "@/content/contacto";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
	const [status, setStatus] = useState<Status>("idle");
	const [consent, setConsent] = useState(false);
	const [marketing, setMarketing] = useState(false);
	const fields = contactoContent.form.fields;
	const legal = contactoContent.form.legalInfo;

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!consent) return;
		const formData = new FormData(e.currentTarget);
		const data: ContactSubmission = {
			nombre: String(formData.get("nombre") || ""),
			email: String(formData.get("email") || ""),
			telefono: String(formData.get("telefono") || "") || undefined,
			audience: formData.get("audience") as "empresa" | "particular",
			mensaje: String(formData.get("mensaje") || ""),
		};
		setStatus("submitting");
		const result = await submitContact(data);
		setStatus(result.ok ? "success" : "error");
	}

	if (status === "success") {
		return (
			<div
				role="status"
				className="rounded-xl border border-primary bg-primary-container px-8 py-12 text-center"
			>
				<p className="text-headline-sm font-semibold text-on-primary-container">
					{contactoContent.form.successMessage}
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
			<div>
				<Label htmlFor="nombre">{fields.nombre.label}</Label>
				<Input id="nombre" name="nombre" required className="mt-2" />
			</div>
			<div>
				<Label htmlFor="email">{fields.email.label}</Label>
				<Input id="email" name="email" type="email" required className="mt-2" />
			</div>
			<div>
				<Label htmlFor="telefono">{fields.telefono.label}</Label>
				<Input id="telefono" name="telefono" type="tel" className="mt-2" />
			</div>
			<fieldset>
				<legend className="text-label-md text-on-surface-variant mb-3">
					{fields.audience.label}
				</legend>
				<div className="flex flex-col gap-3 md:flex-row md:gap-6">
					{fields.audience.options.map((opt) => (
						<label
							key={opt.value}
							className="flex items-center gap-2 text-body-md cursor-pointer"
						>
							<input type="radio" name="audience" value={opt.value} required />
							{opt.label}
						</label>
					))}
				</div>
			</fieldset>
			<div>
				<Label htmlFor="mensaje">{fields.mensaje.label}</Label>
				<Textarea
					id="mensaje"
					name="mensaje"
					required
					className="mt-2"
					placeholder={fields.mensaje.placeholder}
				/>
			</div>

			<div className="rounded-lg border border-outline-variant bg-surface-container-low p-4 text-body-sm text-on-surface-variant leading-relaxed">
				<p className="mb-3 text-label-caps text-on-surface-muted">
					Información básica sobre protección de datos
				</p>
				<dl className="grid gap-1 md:grid-cols-[140px_1fr]">
					<dt className="font-semibold text-on-surface">Responsable</dt>
					<dd>{legal.responsable}</dd>
					<dt className="font-semibold text-on-surface">Finalidad</dt>
					<dd>{legal.finalidad}</dd>
					<dt className="font-semibold text-on-surface">Legitimación</dt>
					<dd>{legal.legitimacion}</dd>
					<dt className="font-semibold text-on-surface">Destinatarios</dt>
					<dd>{legal.destinatarios}</dd>
					<dt className="font-semibold text-on-surface">Derechos</dt>
					<dd>{legal.derechos}</dd>
				</dl>
				<p className="mt-3">
					Más información en nuestra{" "}
					<Link
						to="/politica-de-privacidad"
						className="text-primary underline underline-offset-2"
					>
						Política de Privacidad
					</Link>
					.
				</p>
			</div>

			<label className="flex items-start gap-3 text-body-sm text-on-surface-variant cursor-pointer">
				<input
					type="checkbox"
					required
					checked={consent}
					onChange={(e) => setConsent(e.target.checked)}
					className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
				/>
				<span>
					{fields.consent.label}{" "}
					<span className="text-error" aria-hidden="true">
						*
					</span>
				</span>
			</label>

			<label className="flex items-start gap-3 text-body-sm text-on-surface-variant cursor-pointer">
				<input
					type="checkbox"
					checked={marketing}
					onChange={(e) => setMarketing(e.target.checked)}
					className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
				/>
				<span>{fields.marketing.label}</span>
			</label>

			{status === "error" && (
				<p role="alert" className="text-body-sm text-error">
					{contactoContent.form.errorMessage}
				</p>
			)}
			<Button
				type="submit"
				size="lg"
				disabled={status === "submitting" || !consent}
			>
				{status === "submitting" ? "Enviando..." : contactoContent.form.submitLabel}
			</Button>
		</form>
	);
}
