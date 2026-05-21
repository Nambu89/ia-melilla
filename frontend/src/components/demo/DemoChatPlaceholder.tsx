import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DemoChatPlaceholderProps {
	suggestedQuestions: readonly string[];
	placeholderNote: string;
}

export function DemoChatPlaceholder({
	suggestedQuestions,
	placeholderNote,
}: DemoChatPlaceholderProps) {
	return (
		<div className="rounded-xl border border-outline-variant bg-surface-container p-8">
			<div className="rounded-md border border-outline-variant bg-surface-container-low p-6 mb-6">
				<p className="text-body-sm text-on-surface-muted text-center">{placeholderNote}</p>
			</div>
			<form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
				<Input
					disabled
					placeholder="Escribe tu pregunta sobre fiscalidad en Melilla..."
					aria-label="Pregunta"
				/>
				<Button type="submit" disabled aria-label="Enviar">
					<Send className="h-5 w-5" />
				</Button>
			</form>
			<div className="mt-8">
				<p className="text-label-caps text-on-surface-muted mb-4">PRUEBA PREGUNTAR</p>
				<ul className="flex flex-col gap-2">
					{suggestedQuestions.map((q) => (
						<li
							key={q}
							className="rounded-md border border-outline-variant px-4 py-3 text-body-md text-on-surface-variant"
						>
							{q}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
