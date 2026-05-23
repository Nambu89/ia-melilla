import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Send, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiDisclaimer } from "@/components/demo/AiDisclaimer";
import { useClienteChat } from "@/hooks/useClienteChat";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const suggestedQuestions = [
	"¿Qué deducciones puedo aplicarme si vivo y trabajo en Melilla?",
	"¿Cómo tributa el IPSI un servicio facturado a un cliente peninsular?",
	"¿Necesito presentar el modelo 303 si soy autónomo en Melilla?",
	"Explícame la bonificación del 60% en IRPF para residentes en Melilla.",
];

export default function ClienteChat() {
	const { status, messages, errorMessage, ask, retry } = useClienteChat();
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
				title="Chat fiscal — Panel cliente — IA Melilla"
				description="Asistente fiscal conversacional. Acceso restringido a clientes."
				path="/cliente/chat"
			/>
			<section className="mx-auto max-w-[900px] px-6 pt-12 pb-24">
				<Link
					to="/cliente"
					className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-6"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					Volver al panel
				</Link>

				<p className="text-label-caps text-primary mb-3">Asistente fiscal</p>
				<h1 className="text-display-sm font-bold tracking-tight">Chat fiscal</h1>
				<p className="mt-3 text-body-md text-on-surface-variant">
					Asistente conversacional con acceso a normativa AEAT y BOE. Citas
					oficiales en cada respuesta.
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
								Escribe una pregunta o elige una de las sugeridas debajo para empezar.
							</p>
						)}
						{messages.map((m, i) => {
							const isLast = i === messages.length - 1;
							const isStreaming = busy && isLast && m.role === "assistant";
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
								<AlertCircle
									className="mt-0.5 h-5 w-5 shrink-0"
									aria-hidden="true"
								/>
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
							placeholder="Escribe tu pregunta sobre fiscalidad..."
							aria-label="Pregunta"
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
								PRUEBA PREGUNTAR
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
					{isUser ? "TÚ" : "IA FISCAL"}
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
