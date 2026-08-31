import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { TutorToolShell } from "@/components/tutor/TutorToolShell";
import { ExamBoard } from "@/components/tutor/ExamBoard";

export default function TutorOpositoresTest() {
	return (
		<PageShell>
			<SeoHead
				title="Test de diez preguntas · Tutor IA para opositores"
				description="Haz un test de diez preguntas del temario y deja que el tutor IA te corrija explicándote cada pregunta. Sin reloj y sin penalización por fallo."
				path="/demos/tutor-ia-opositores/test"
			/>
			<TutorToolShell
				title="Test de diez preguntas"
				description="Diez preguntas del temario, a tu ritmo. Cuando corrijas, puedes desplegar cada una para que el tutor te explique por qué esa era la respuesta buena."
			>
				<div className="max-w-3xl">
					<ExamBoard />
				</div>
			</TutorToolShell>
		</PageShell>
	);
}
