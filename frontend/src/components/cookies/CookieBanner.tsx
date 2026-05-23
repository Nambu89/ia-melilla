import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	ACCEPT_ALL_CONSENT,
	DEFAULT_CONSENT,
	type ConsentState,
	hasResponded,
	loadConsent,
	saveConsent,
} from "@/lib/cookieConsent";

type View = "hidden" | "banner" | "settings";

const CATEGORY_META: Array<{
	key: keyof ConsentState;
	label: string;
	description: string;
	required?: boolean;
}> = [
	{
		key: "technical",
		label: "Cookies técnicas",
		description:
			"Necesarias para el funcionamiento básico del Sitio (recordar el consentimiento, mantener la sesión, preferencias de tema). No se pueden desactivar.",
		required: true,
	},
	{
		key: "preferences",
		label: "Cookies de preferencias",
		description:
			"Recuerdan opciones del Usuario como el idioma o el tema visual. No identifican al Usuario.",
	},
	{
		key: "analytics",
		label: "Cookies analíticas",
		description:
			"Permiten medir el uso agregado del Sitio para mejorar contenidos y rendimiento. Actualmente no se utilizan; este apartado queda abierto para futuras integraciones previo aviso.",
	},
	{
		key: "marketing",
		label: "Cookies publicitarias",
		description:
			"Se utilizarían para mostrar publicidad personalizada. Actualmente no se utilizan en este Sitio.",
	},
];

export function CookieBanner() {
	const [view, setView] = useState<View>("hidden");
	const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);

	useEffect(() => {
		if (!hasResponded()) {
			setView("banner");
		}
		function openSettings() {
			const current = loadConsent();
			setDraft(current ?? DEFAULT_CONSENT);
			setView("settings");
		}
		window.addEventListener("open-cookie-settings", openSettings);
		return () => window.removeEventListener("open-cookie-settings", openSettings);
	}, []);

	function acceptAll() {
		saveConsent(ACCEPT_ALL_CONSENT);
		setView("hidden");
	}

	function rejectAll() {
		saveConsent(DEFAULT_CONSENT);
		setView("hidden");
	}

	function openSettingsView() {
		setDraft(loadConsent() ?? DEFAULT_CONSENT);
		setView("settings");
	}

	function savePreferences() {
		saveConsent(draft);
		setView("hidden");
	}

	if (view === "hidden") return null;

	if (view === "banner") {
		return (
			<div
				role="dialog"
				aria-labelledby="cookie-banner-title"
				aria-describedby="cookie-banner-description"
				className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-[720px] rounded-2xl border border-outline bg-surface-container shadow-2xl"
			>
				<div className="flex flex-col gap-4 p-5 md:p-6">
					<div>
						<h2
							id="cookie-banner-title"
							className="text-headline-sm font-semibold tracking-tight text-on-surface"
						>
							Cookies en iamelilla.com
						</h2>
						<p
							id="cookie-banner-description"
							className="mt-2 text-body-sm text-on-surface-variant leading-relaxed"
						>
							Utilizamos cookies técnicas necesarias para el funcionamiento del Sitio. Si lo
							deseas, puedes aceptar también cookies opcionales (preferencias, analíticas o
							publicitarias). Puedes cambiar tu decisión en cualquier momento desde el pie
							de página. Más información en nuestra{" "}
							<Link
								to="/politica-de-cookies"
								className="text-primary underline underline-offset-2"
							>
								Política de Cookies
							</Link>
							.
						</p>
					</div>
					<div className="grid gap-2 md:grid-cols-3">
						<Button
							type="button"
							variant="outline"
							onClick={rejectAll}
							className="w-full"
						>
							Rechazar todas
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={openSettingsView}
							className="w-full"
						>
							Configurar
						</Button>
						<Button type="button" onClick={acceptAll} className="w-full">
							Aceptar todas
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="cookie-settings-title"
			className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
		>
			<div className="relative w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-2xl border border-outline bg-surface-container shadow-2xl">
				<div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
					<h2
						id="cookie-settings-title"
						className="text-headline-sm font-semibold tracking-tight text-on-surface"
					>
						Configuración de cookies
					</h2>
					<button
						type="button"
						onClick={() => setView(hasResponded() ? "hidden" : "banner")}
						aria-label="Cerrar"
						className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container-high"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<div className="space-y-5 px-6 py-5">
					<p className="text-body-sm text-on-surface-variant leading-relaxed">
						Selecciona qué categorías de cookies aceptas. Las cookies técnicas son
						imprescindibles para el funcionamiento del Sitio y no se pueden desactivar.
					</p>
					{CATEGORY_META.map((cat) => {
						const checked = draft[cat.key];
						return (
							<div
								key={cat.key}
								className="rounded-xl border border-outline-variant bg-surface-container-low p-4"
							>
								<label className="flex cursor-pointer items-start gap-3">
									<input
										type="checkbox"
										checked={checked}
										disabled={cat.required}
										onChange={(e) =>
											setDraft((prev) => ({ ...prev, [cat.key]: e.target.checked }))
										}
										className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
									/>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="text-body-md font-semibold text-on-surface">
												{cat.label}
											</span>
											{cat.required && (
												<span className="rounded-full bg-primary/15 px-2 py-0.5 text-label-caps text-primary">
													Obligatorias
												</span>
											)}
										</div>
										<p className="mt-1 text-body-sm text-on-surface-variant leading-relaxed">
											{cat.description}
										</p>
									</div>
								</label>
							</div>
						);
					})}
				</div>
				<div className="flex flex-col gap-2 border-t border-outline-variant px-6 py-4 md:flex-row md:justify-between">
					<Button
						type="button"
						variant="ghost"
						onClick={() => {
							saveConsent(DEFAULT_CONSENT);
							setView("hidden");
						}}
					>
						Rechazar todas
					</Button>
					<div className="flex flex-col gap-2 md:flex-row">
						<Button type="button" variant="outline" onClick={savePreferences}>
							Guardar selección
						</Button>
						<Button
							type="button"
							onClick={() => {
								saveConsent(ACCEPT_ALL_CONSENT);
								setView("hidden");
							}}
						>
							Aceptar todas
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
