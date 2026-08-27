import {
	useEffect,
	useRef,
	useState,
	type FormEvent,
	type KeyboardEvent,
	type RefObject,
} from "react";
import {
	MessageCircle,
	X,
	Send,
	Loader2,
	CalendarCheck,
	Clock,
	AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLeadChat } from "./useLeadChat";
import { useTurnstile } from "./useTurnstile";

const PRIVACY_HREF = "/politica-de-privacidad";

/**
 * Chatbot captador de leads. Quién lo pinta y si convive con el botón de
 * WhatsApp se decide en `components/layout/FloatingCta.tsx`.
 * Cualifica al visitante y, si encaja, agenda una llamada con el equipo.
 */
export function ChatWidget() {
	const [open, setOpen] = useState(false);
	const [consent, setConsent] = useState(false);
	const [honeypot, setHoneypot] = useState("");
	const [draft, setDraft] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const launcherRef = useRef<HTMLButtonElement>(null);
	const wasOpenRef = useRef(false);

	const {
		phase,
		messages,
		slots,
		booking,
		errorMessage,
		begin,
		send,
		pickSlot,
	} = useLeadChat();
	const turnstile = useTurnstile(open && phase === "consent");

	const busy = phase === "sending" || phase === "starting";

	useEffect(() => {
		const el = scrollRef.current;
		if (el && typeof el.scrollTo === "function") {
			el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
		}
	}, [messages, slots, booking]);

	// En móvil el panel tapa la pantalla entera: sin Escape, quien navega con
	// teclado se queda encerrado. Al cerrar, el foco vuelve al botón flotante,
	// que sólo existe en el DOM una vez cerrado — de ahí el efecto y no un
	// `focus()` dentro del manejador.
	useEffect(() => {
		if (open) {
			wasOpenRef.current = true;
			panelRef.current?.focus();
			const onKeyDown = (e: globalThis.KeyboardEvent) => {
				if (e.key === "Escape") setOpen(false);
			};
			document.addEventListener("keydown", onKeyDown);
			return () => document.removeEventListener("keydown", onKeyDown);
		}
		if (wasOpenRef.current) {
			wasOpenRef.current = false;
			launcherRef.current?.focus();
		}
	}, [open]);

	async function handleStart(e: FormEvent) {
		e.preventDefault();
		if (!consent || honeypot || !turnstile.ready || phase === "starting")
			return;
		// El token de Turnstile se gasta en el intento: si falló, pedimos otro
		// para que el reintento no lo reenvíe ya usado.
		if (!(await begin(turnstile.token, honeypot))) turnstile.reset();
	}

	function submit(text: string) {
		if (!text.trim() || busy || phase !== "ready") return;
		setDraft("");
		void send(text);
	}

	function handleKey(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit(draft);
		}
	}

	return (
		<>
			{/* Botón flotante */}
			{!open && (
				<button
					ref={launcherRef}
					type="button"
					onClick={() => setOpen(true)}
					aria-label="Abrir asistente de IA Melilla"
					/* Mismo tope que en WhatsAppFloat, y por el mismo motivo: cuando el
					   banner no deja sitio, el botón se queda en la franja libre justo
					   debajo de la cabecera, que cae sobre el texto del banner y no
					   sobre sus botones de consentimiento. */
					className="fixed bottom-[min(calc(1.25rem+var(--cookie-banner-height,0px)),calc(100dvh-9rem))] right-5 z-[65] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
				>
					<MessageCircle className="h-6 w-6" />
				</button>
			)}

			{/* Panel */}
			{open && (
				<div
					ref={panelRef}
					role="dialog"
					aria-label="Asistente de IA Melilla"
					tabIndex={-1}
					/* z-[65]: por encima del banner de cookies (60) y por debajo del
					   modal de configuración de cookies (70). En móvil ocupa la
					   pantalla entera y lo tapa mientras está abierto, que para eso
					   lo acaba de abrir el visitante.

					   De sm en adelante se aparta del banner, con dos topes: el
					   `min` del `bottom` reserva siempre 18rem de alto útil, y el
					   `max` del `max-height` impide que el panel se quede en nada
					   cuando el banner ocupa media pantalla (un portátil apaisado a
					   740x360 entra por aquí, porque `sm` mira el ancho, no el alto).
					   Con los dos topes el panel nunca se sale por arriba. */
					className="fixed inset-0 z-[65] flex flex-col bg-surface sm:inset-auto sm:bottom-[min(calc(1.25rem+var(--cookie-banner-height,0px)),calc(100dvh-19.25rem))] sm:right-5 sm:h-[600px] sm:max-h-[max(18rem,calc(85vh-var(--cookie-banner-height,0px)))] sm:w-[390px] sm:rounded-2xl sm:border sm:border-outline-variant sm:shadow-2xl overflow-hidden focus:outline-none"
				>
					{/* Header */}
					<header className="flex items-center justify-between bg-primary px-4 py-3 text-on-primary">
						<div className="flex items-center gap-2">
							<MessageCircle className="h-5 w-5" aria-hidden="true" />
							<div>
								<p className="text-body-md font-semibold leading-tight">
									IA Melilla
								</p>
								<p className="text-label-caps opacity-80">Asistente virtual</p>
							</div>
						</div>
						<button
							type="button"
							onClick={() => setOpen(false)}
							aria-label="Cerrar asistente"
							className="rounded-full p-1 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
						>
							<X className="h-5 w-5" />
						</button>
					</header>

					{/* Body */}
					<div
						ref={scrollRef}
						className="flex-1 overflow-y-auto bg-surface-container p-4"
						aria-live="polite"
						aria-busy={busy}
					>
						{phase === "consent" ? (
							<ConsentGate
								consent={consent}
								setConsent={setConsent}
								honeypot={honeypot}
								setHoneypot={setHoneypot}
								turnstileEnabled={turnstile.enabled}
								turnstileRef={turnstile.containerRef}
								onStart={handleStart}
								disabled={!consent || !turnstile.ready}
								error={errorMessage}
							/>
						) : (
							<>
								{messages.map((m, i) => (
									<ChatBubble key={i} role={m.role} content={m.content} />
								))}
								{phase === "starting" && <Thinking />}

								{slots.length > 0 && phase === "ready" && (
									<div className="mb-4">
										<p className="text-label-caps text-on-surface-muted mb-2">
											ELIGE UN HUECO
										</p>
										<div className="flex flex-wrap gap-2">
											{slots.map((s) => (
												<button
													key={s.iso}
													type="button"
													onClick={() => pickSlot(s)}
													className="flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-body-sm text-primary hover:bg-primary hover:text-on-primary transition-colors"
												>
													<Clock className="h-3.5 w-3.5" aria-hidden="true" />
													{s.human}
												</button>
											))}
										</div>
									</div>
								)}

								{booking && <BookingBanner booking={booking} />}

								{errorMessage && <ErrorAlert message={errorMessage} />}
							</>
						)}
					</div>

					{/* Footer / input */}
					{phase !== "consent" && (
						<form
							className="flex items-center gap-2 border-t border-outline-variant bg-surface p-3"
							onSubmit={(e) => {
								e.preventDefault();
								submit(draft);
							}}
						>
							<Input
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								onKeyDown={handleKey}
								disabled={busy || phase !== "ready"}
								placeholder="Escribe tu mensaje…"
								aria-label="Mensaje"
							/>
							<Button
								type="submit"
								disabled={busy || phase !== "ready" || !draft.trim()}
								aria-label="Enviar"
							>
								{busy ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<Send className="h-5 w-5" />
								)}
							</Button>
						</form>
					)}

					<p className="bg-surface px-3 pb-2 text-center text-label-caps text-on-surface-muted">
						Asistente de IA · no es asesoramiento vinculante
					</p>
				</div>
			)}
		</>
	);
}

function ConsentGate({
	consent,
	setConsent,
	honeypot,
	setHoneypot,
	turnstileEnabled,
	turnstileRef,
	onStart,
	disabled,
	error,
}: {
	consent: boolean;
	setConsent: (v: boolean) => void;
	honeypot: string;
	setHoneypot: (v: string) => void;
	turnstileEnabled: boolean;
	turnstileRef: RefObject<HTMLDivElement | null>;
	onStart: (e: FormEvent) => void;
	disabled: boolean;
	error: string | null;
}) {
	return (
		<form onSubmit={onStart} className="flex flex-col gap-4">
			<p className="text-body-md text-on-surface">
				👋 Soy el asistente virtual de <strong>IA Melilla</strong>. Te ayudo a
				resolver dudas y, si quieres, agendamos una llamada con el equipo.
			</p>

			{/* Si el arranque falló, se ve aquí y el botón sigue disponible: el
			    visitante puede reintentar sin recargar la página. */}
			{error && <ErrorAlert message={error} />}

			{/* Honeypot: invisible para humanos, lo rellenan los bots */}
			<input
				type="text"
				name="website"
				value={honeypot}
				onChange={(e) => setHoneypot(e.target.value)}
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
				style={{
					position: "absolute",
					left: "-9999px",
					width: 1,
					height: 1,
					opacity: 0,
				}}
			/>

			<label className="flex items-start gap-2 text-body-sm text-on-surface-variant">
				<input
					type="checkbox"
					checked={consent}
					onChange={(e) => setConsent(e.target.checked)}
					className="mt-0.5 h-4 w-4 shrink-0"
				/>
				<span>
					He leído y acepto la{" "}
					<a
						href={PRIVACY_HREF}
						target="_blank"
						rel="noreferrer"
						className="text-primary underline"
					>
						política de privacidad
					</a>
					. Mis datos se usarán para contactarme sobre mi consulta.
				</span>
			</label>

			{turnstileEnabled && <div ref={turnstileRef} className="min-h-[65px]" />}

			<Button type="submit" disabled={disabled}>
				Empezar
			</Button>
		</form>
	);
}

function ErrorAlert({ message }: { message: string }) {
	return (
		<div
			role="alert"
			className="mt-2 flex items-start gap-2 rounded-md border border-error bg-error-container p-3 text-on-error-container text-body-sm"
		>
			<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
			<span>{message}</span>
		</div>
	);
}

function Thinking() {
	return (
		<div className="mb-4 flex items-center gap-2 text-on-surface-muted text-body-sm">
			<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
			<span>Conectando…</span>
		</div>
	);
}

function BookingBanner({
	booking,
}: {
	booking: { status: string; human?: string; meet_link?: string };
}) {
	if (booking.status === "booked") {
		return (
			<div className="mb-4 flex items-start gap-2 rounded-md border border-primary bg-surface-container-high p-3 text-body-sm text-on-surface">
				<CalendarCheck
					className="mt-0.5 h-4 w-4 shrink-0 text-primary"
					aria-hidden="true"
				/>
				<div>
					<p className="font-semibold">Cita confirmada</p>
					{booking.human && <p>{booking.human}</p>}
					{booking.meet_link && (
						<a
							href={booking.meet_link}
							target="_blank"
							rel="noreferrer"
							className="text-primary underline"
						>
							Enlace de la videollamada
						</a>
					)}
				</div>
			</div>
		);
	}
	const text =
		booking.status === "pending_confirmation"
			? "Te hemos enviado un email para confirmar la cita (revisa tu bandeja)."
			: "Hemos registrado tu solicitud. El equipo te contactará por email.";
	return (
		<div className="mb-4 flex items-start gap-2 rounded-md border border-outline-variant bg-surface-container-high p-3 text-body-sm text-on-surface">
			<Clock
				className="mt-0.5 h-4 w-4 shrink-0 text-primary"
				aria-hidden="true"
			/>
			<span>{text}</span>
		</div>
	);
}

function ChatBubble({
	role,
	content,
}: {
	role: "user" | "assistant";
	content: string;
}) {
	const isUser = role === "user";
	return (
		<div className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-body-md whitespace-pre-wrap ${
					isUser
						? "bg-primary text-on-primary rounded-br-sm"
						: "bg-surface-container-highest text-on-surface rounded-bl-sm"
				}`}
			>
				{content || (
					<span className="inline-flex gap-1" aria-label="escribiendo">
						<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-on-surface-muted" />
						<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-on-surface-muted [animation-delay:120ms]" />
						<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-on-surface-muted [animation-delay:240ms]" />
					</span>
				)}
			</div>
		</div>
	);
}
