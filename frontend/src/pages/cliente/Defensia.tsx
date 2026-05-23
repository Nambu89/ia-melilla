import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Send, AlertCircle, Loader2, ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiDisclaimer } from "@/components/demo/AiDisclaimer";
import { useDefensiaChat } from "@/hooks/useDefensiaChat";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ThinkingIndicator } from "@/components/cliente/ThinkingIndicator";

const thinkingMessages = [
	"Analizando tu caso…",
	"Consultando normativa AEAT y procedimiento aplicable…",
	"Comprobando plazos y obligaciones del contribuyente…",
	"Buscando precedentes y casos similares…",
	"Redactando una respuesta estructurada…",
] as const;

const suggestedQuestions = [
	"He recibido un requerimiento de la AEAT por el IRPF 2023. ¿Cómo respondo?",
	"Me han notificado una propuesta de liquidación provisional. ¿Cuál es el plazo de alegaciones?",
	"¿Cómo redacto un recurso de reposición contra una sanción tributaria?",
	"La AEAT me ha abierto un procedimiento de comprobación limitada. ¿Qué documentación pueden pedirme?",
];

export default function ClienteDefensia() {
	const { status, messages, errorMessage, ask, retry } = useDefensiaChat();
	const [draft, setDraft] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	const busy = status === "streaming";
	const hasError = status === "error";
	const showEmptyState = messages.length === 0 && !hasError;

	useEffect(() => {
		const el = scrollRef.current;
		if (el && typeof el.scrollTo === "function") {
			el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
		}
	}, [messages]);

	function submit(question: string) {
		if (!question.trim() || busy) return;
		setDraft("");
		void ask(question);
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		submit(draft);
	}

	function handleKey(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit(draft);
		}
	}

	return (
		<PageShell>
			<SeoHead
				title="DefensIA — Panel cliente — IA Melilla"
				description="Asistente de defensa fiscal para requerimientos AEAT, reclamaciones y recursos."
				path="/cliente/defensia"
			/>
			<section className="mx-auto max-w-[900px] px-6 pt-12 pb-24">
				<Link
					to="/cliente"
					className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-6"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					Volver al panel
				</Link>

				<div className="flex items-center gap-3 mb-3">
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-subtle text-primary">
						<Shield className="h-5 w-5" aria-hidden="true" />
					</span>
					<p className="text-label-caps text-primary">Defensa fiscal asistida</p>
				</div>
				<h1 className="text-display-sm font-bold tracking-tight">DefensIA</h1>
				<p className="mt-3 text-body-md text-on-surface-variant">
					Cuéntame el requerimiento, propuesta de liquidación, sanción o notificación
					AEAT que has recibido. Te ayudo a entenderlo, calcular plazos y redactar
					alegaciones, recursos o reclamaciones.
				</p>

				<div className="mt-8 flex flex-col gap-4">
					<div
						ref={scrollRef}
						className="rounded-xl border border-outline-variant bg-surface-container max-h-[520px] min-h-[360px] overflow-y-auto p-6"
						aria-live="polite"
						aria-busy={busy}
					>
						{showEmptyState && (
							<p className="text-body-md text-on-surface-muted text-center py-8">
								Describe tu situación o elige una pregunta de ejemplo abajo.
							</p>
						)}
						{messages.map((m, i) => {
							const isLast = i === messages.length - 1;
							const isStreaming = busy && isLast && m.role === "assistant";
							// Si el último assistant está vacío, mostramos ThinkingIndicator
							// en su lugar (NO el bubble vacío) hasta que llegue el primer chunk.
							if (isLast && m.role === "assistant" && m.content === "" && busy) {
								return (
									<ThinkingIndicator
										key={i}
										label="DEFENSIA"
										messages={thinkingMessages}
									/>
								);
							}
							return (
								<ChatBubble
									key={i}
									role={m.role}
									content={m.content}
									streaming={isStreaming}
								/>
							);
						})}
						{hasError && errorMessage && (
							<div
								role="alert"
								className="mt-4 flex items-start gap-3 rounded-md border border-error bg-error-container p-4 text-on-error-container"
							>
								<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
								<div className="flex-1 text-body-md">{errorMessage}</div>
								<Button variant="outline" size="sm" onClick={retry} type="button">
									Reintentar
								</Button>
							</div>
						)}
					</div>

					<form className="flex gap-3" onSubmit={handleSubmit}>
						<Input
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onKeyDown={handleKey}
							disabled={busy || hasError}
							placeholder="Describe el requerimiento AEAT o tu duda de defensa fiscal..."
							aria-label="Mensaje"
						/>
						<Button
							type="submit"
							disabled={busy || hasError || !draft.trim()}
							aria-label="Enviar"
						>
							{busy ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								<Send className="h-5 w-5" />
							)}
						</Button>
					</form>

					{showEmptyState && (
						<div className="mt-2">
							<p className="text-label-caps text-on-surface-muted mb-3">
								CASOS DE EJEMPLO
							</p>
							<ul className="flex flex-col gap-2">
								{suggestedQuestions.map((q) => (
									<li key={q}>
										<button
											type="button"
											onClick={() => submit(q)}
											disabled={busy || hasError}
											className="w-full rounded-md border border-outline-variant px-4 py-3 text-left text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors disabled:opacity-50 disabled:pointer-events-none"
										>
											{q}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}

					<AiDisclaimer variant="inline" className="mt-2 leading-relaxed" />

					<aside className="mt-2 rounded-xl border border-outline-variant bg-surface-container-low px-5 py-4 text-body-sm text-on-surface-variant">
						<strong className="text-on-surface">Funcionalidad ampliada disponible:</strong>{" "}
						gestión de expedientes completos con subida de PDFs (requerimientos,
						propuestas, sanciones), generación automática de escritos formales
						descargables y seguimiento de plazos administrativos. Para activarla en tu
						cuenta, contacta con nosotros.
					</aside>
				</div>
			</section>
		</PageShell>
	);
}

function ChatBubble({
	role,
	content,
	streaming,
}: {
	role: "user" | "assistant";
	content: string;
	streaming: boolean;
}) {
	const isUser = role === "user";
	const reduced = useReducedMotion();
	return (
		<motion.div
			initial={reduced ? false : { opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
			className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`max-w-[80%] rounded-lg px-5 py-3 ${
					isUser
						? "bg-surface-container-high text-on-surface"
						: "bg-surface-container-highest text-on-surface"
				}`}
			>
				<p className="text-label-caps text-on-surface-muted mb-1 font-mono">
					{isUser ? "TÚ" : "DEFENSIA"}
				</p>
				<p className="text-body-md whitespace-pre-wrap">
					{content}
					{streaming && (
						<span
							className="ml-1 inline-block h-3 w-[2px] bg-primary animate-pulse"
							aria-hidden="true"
						/>
					)}
				</p>
			</div>
		</motion.div>
	);
}
