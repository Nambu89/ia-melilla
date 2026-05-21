import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Send, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDemoChat } from "@/hooks/useDemoChat";
import { useAnimeEntry } from "@/components/animations/useAnimeEntry";

interface DemoChatProps {
	suggestedQuestions: readonly string[];
}

const DISCLAIMER =
	"Demo informativa basada en normativa de Melilla. No constituye asesoramiento fiscal vinculante. Consulta a un profesional para tu caso concreto.";

export function DemoChat({ suggestedQuestions }: DemoChatProps) {
	const { status, messages, errorMessage, ask, retry } = useDemoChat();
	const [draft, setDraft] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	const busy = status === "logging_in" || status === "streaming";
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
		<div className="flex flex-col gap-4">
			<div
				ref={scrollRef}
				className="rounded-xl border border-outline-variant bg-surface-container max-h-[480px] min-h-[320px] overflow-y-auto p-6"
				aria-live="polite"
				aria-busy={busy}
			>
				{showEmptyState && (
					<EmptyState loading={status === "logging_in"} />
				)}
				{messages.map((m, i) => {
					const isLast = i === messages.length - 1;
					const isStreaming = status === "streaming" && isLast && m.role === "assistant";
					return (
						<ChatBubble key={i} role={m.role} content={m.content} streaming={isStreaming} />
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
					placeholder="Escribe tu pregunta sobre fiscalidad en Melilla..."
					aria-label="Pregunta"
				/>
				<Button
					type="submit"
					disabled={busy || status === "error" || !draft.trim()}
					aria-label="Enviar"
				>
					{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
				</Button>
			</form>

			{showEmptyState && (
				<div>
					<p className="text-label-caps text-on-surface-muted mb-3">PRUEBA PREGUNTAR</p>
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

			<p className="text-body-sm text-on-surface-muted leading-relaxed mt-2">{DISCLAIMER}</p>
		</div>
	);
}

function EmptyState({ loading }: { loading: boolean }) {
	if (loading) {
		return (
			<div className="flex items-center justify-center gap-3 py-8 text-body-md text-on-surface-muted">
				<Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
				<span>Conectando con IA Fiscal Melilla...</span>
			</div>
		);
	}
	return (
		<p className="text-body-md text-on-surface-muted text-center py-8">
			Escribe una pregunta o elige una de las sugeridas debajo para empezar.
		</p>
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
	const ref = useAnimeEntry<HTMLDivElement>(0);
	return (
		<div ref={ref} className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-[80%] rounded-lg px-5 py-3 ${
					isUser
						? "bg-surface-container-high text-on-surface"
						: "bg-surface-container-highest text-on-surface"
				}`}
			>
				<p className="text-label-caps text-on-surface-muted mb-1 font-mono">
					{isUser ? "TU" : "IA FISCAL"}
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
		</div>
	);
}
