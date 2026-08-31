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
				description="Elige un tema y el tutor escribe una pregunta de test que no existía. Debajo verás el fragmento del temario del que la ha sacado: esa es la prueba de que no se la inventa."
			>
				<div className="max-w-3xl">
					<QuestionForge />
				</div>
			</TutorToolShell>
		</PageShell>
	);
}
