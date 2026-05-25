import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { ToolPageShell } from "@/components/demo/ToolPageShell";
import { DemoChat } from "@/components/demo/DemoChat";
import { DemoLimitGate } from "@/components/demo/DemoLimitGate";
import { useDemoUsageLimit } from "@/hooks/useDemoUsageLimit";
import { demoIaFiscalContent } from "@/content/demoIaFiscal";

export default function IaFiscalChat() {
	const limit = useDemoUsageLimit("chat-fiscal");
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
				<DemoLimitGate
					blocked={limit.blocked}
					used={limit.used}
					max={limit.max}
					toolLabel="Chat IA Fiscal"
				>
					<div className="max-w-3xl">
						<DemoChat
							suggestedQuestions={demoIaFiscalContent.suggestedQuestions}
							onUseConsumed={limit.increment}
						/>
					</div>
				</DemoLimitGate>
			</ToolPageShell>
		</PageShell>
	);
}
