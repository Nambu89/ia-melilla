import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { TutorToolShell } from "@/components/tutor/TutorToolShell";
import { TutorChat } from "@/components/tutor/TutorChat";
import { demoTutorOpositoresContent } from "@/content/demoTutorOpositores";

export default function TutorOpositoresTutor() {
	return (
		<PageShell>
			<SeoHead
				title="Tutor IA para opositores · Resuelve dudas del temario"
				description="Pregunta cualquier duda del temario de la oposición y el tutor IA te contesta citando el fragmento del que sale la respuesta. Demo abierta de IA Melilla."
				path="/demos/tutor-ia-opositores/tutor"
			/>
			<TutorToolShell
				title="Resuelve dudas del temario"
				description="Pregunta y te contesta citando el temario."
			>
				<div className="max-w-3xl">
					<TutorChat
						preguntasSugeridas={demoTutorOpositoresContent.preguntasSugeridas}
					/>
				</div>
			</TutorToolShell>
		</PageShell>
	);
}
