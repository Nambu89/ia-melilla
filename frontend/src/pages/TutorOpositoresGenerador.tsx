import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { TutorToolShell } from "@/components/tutor/TutorToolShell";
import { QuestionForge } from "@/components/tutor/QuestionForge";

export default function TutorOpositoresGenerador() {
	return (
		<PageShell>
			<SeoHead
				title="Generador de preguntas · Tutor IA para opositores"
				description="Elige un tema y mira cómo la IA fabrica una pregunta de test nueva a partir del temario, enseñando el fragmento del que sale. Demo abierta de IA Melilla."
				path="/demos/tutor-ia-opositores/generador"
			/>
			<TutorToolShell
				title="Generador de preguntas"
				description="Mira cómo se fabrica una pregunta, con su fragmento del temario al lado."
			>
				<div className="max-w-3xl">
					<QuestionForge />
				</div>
			</TutorToolShell>
		</PageShell>
	);
}
