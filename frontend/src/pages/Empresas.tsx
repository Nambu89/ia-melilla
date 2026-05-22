import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { Hero } from "@/components/sections/Hero";
import { ProblemSolutionGrid } from "@/components/sections/ProblemSolutionGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { DemoCrosslink } from "@/components/sections/DemoCrosslink";
import { TargetAudienceList } from "@/components/sections/TargetAudienceList";
import { CtaClose } from "@/components/sections/CtaClose";
import { empresasContent } from "@/content/empresas";
import { homeContent } from "@/content/home";

export default function Empresas() {
	return (
		<PageShell>
			<SeoHead
				title="IA para empresas y autónomos — IA Melilla"
				description="Software de IA hecho a medida para asesorías, despachos y pymes. Integraciones reales, sin proof of concept eternos."
				path="/empresas"
			/>
			<Hero
				eyebrow={empresasContent.hero.eyebrow}
				headline={empresasContent.hero.headline}
				subheadline={empresasContent.hero.subheadline}
				primaryCta={empresasContent.hero.primaryCta}
				secondaryCta={empresasContent.hero.secondaryCta}
			/>
			<ProblemSolutionGrid
				headline={empresasContent.problemSolutions.headline}
				cards={empresasContent.problemSolutions.cards}
			/>
			<ProcessSteps
				eyebrow={homeContent.processSteps.eyebrow}
				headline={homeContent.processSteps.headline}
				steps={homeContent.processSteps.steps}
			/>
			<DemoCrosslink
				headline={empresasContent.demoCrosslink.headline}
				body={empresasContent.demoCrosslink.body}
				cta={empresasContent.demoCrosslink.cta}
			/>
			<TargetAudienceList
				headline={empresasContent.targetAudience.headline}
				items={empresasContent.targetAudience.items}
			/>
			<CtaClose
				headline={empresasContent.ctaClose.headline}
				subheadline={empresasContent.ctaClose.body}
				primaryCta={empresasContent.ctaClose.cta}
			/>
		</PageShell>
	);
}
