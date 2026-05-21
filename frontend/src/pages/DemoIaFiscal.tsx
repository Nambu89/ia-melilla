import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { DemoChatPlaceholder } from "@/components/demo/DemoChatPlaceholder";
import { Badge } from "@/components/ui/badge";
import { demoIaFiscalContent } from "@/content/demoIaFiscal";

export default function DemoIaFiscal() {
	return (
		<PageShell>
			<SeoHead
				title="IA Fiscal Melilla — Demo en vivo"
				description="Asistente IA entrenado en normativa fiscal de Melilla. IPSI, REF, IRPF local, deducciones, plazos. Responde con fuente."
				path="/demos/ia-fiscal-melilla"
			/>
			<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<Badge variant="primary" className="mb-6">
					{demoIaFiscalContent.hero.eyebrow}
				</Badge>
				<h1 className="text-display-md font-bold tracking-tight max-w-4xl">
					{demoIaFiscalContent.hero.headline}
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					{demoIaFiscalContent.hero.subheadline}
				</p>
				<div className="mt-12 max-w-3xl">
					<DemoChatPlaceholder
						suggestedQuestions={demoIaFiscalContent.suggestedQuestions}
						placeholderNote={demoIaFiscalContent.placeholderNote}
					/>
				</div>
			</section>
		</PageShell>
	);
}
