import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { DemoChat } from "@/components/demo/DemoChat";
import { demoIaFiscalContent } from "@/content/demoIaFiscal";

export default function IaFiscalChat() {
	return (
		<PageShell>
			<SeoHead
				title="Chat IA Fiscal Melilla · Demo en vivo"
				description="Pregunta cualquier duda fiscal sobre el régimen de Melilla. Asistente IA entrenado en IPSI, REF, IRPF local, deducciones y plazos."
				path="/demos/ia-fiscal-melilla/chat"
			/>
			<ToolPageShell
				title="Chat IA Fiscal Melilla"
				description="Pregunta lo que necesites sobre fiscalidad en Melilla. IPSI, REF, IRPF, deducciones, plazos. Responde citando normativa."
			>
				<div className="max-w-3xl">
					<DemoChat suggestedQuestions={demoIaFiscalContent.suggestedQuestions} />
				</div>
			</ToolPageShell>
		</PageShell>
	);
}
