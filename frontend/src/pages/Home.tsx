import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { Hero } from "@/components/sections/Hero";
import { AudienceSplit } from "@/components/sections/AudienceSplit";
import { DemoFlagship } from "@/components/sections/DemoFlagship";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { AboutMelilla } from "@/components/sections/AboutMelilla";
import { CtaClose } from "@/components/sections/CtaClose";
import { homeContent } from "@/content/home";

export default function Home() {
	return (
		<PageShell>
			<SeoHead
				title="IA Melilla — Inteligencia artificial para empresas y particulares"
				description="Construimos asistentes de IA practicos desde Melilla. Demo: IA Fiscal Melilla, especialista en regimen local."
				path="/"
			/>
			<OrganizationJsonLd />
			<Hero
				eyebrow={homeContent.hero.eyebrow}
				headline={homeContent.hero.headline}
				subheadline={homeContent.hero.subheadline}
				primaryCta={homeContent.hero.primaryCta}
				secondaryCta={homeContent.hero.secondaryCta}
			/>
			<AudienceSplit
				eyebrow={homeContent.audienceSplit.eyebrow}
				headline={homeContent.audienceSplit.headline}
				cards={homeContent.audienceSplit.cards}
			/>
			<DemoFlagship
				eyebrow={homeContent.demoFlagship.eyebrow}
				headline={homeContent.demoFlagship.headline}
				subheadline={homeContent.demoFlagship.subheadline}
				exchange={homeContent.demoFlagship.exchange}
				cta={homeContent.demoFlagship.cta}
			/>
			<ProcessSteps
				id="como-trabajamos"
				eyebrow={homeContent.processSteps.eyebrow}
				headline={homeContent.processSteps.headline}
				steps={homeContent.processSteps.steps}
			/>
			<AboutMelilla
				eyebrow={homeContent.aboutMelilla.eyebrow}
				headline={homeContent.aboutMelilla.headline}
				body={homeContent.aboutMelilla.body}
			/>
			<CtaClose
				headline={homeContent.ctaClose.headline}
				subheadline={homeContent.ctaClose.subheadline}
				primaryCta={homeContent.ctaClose.primaryCta}
				secondaryCta={homeContent.ctaClose.secondaryCta}
			/>
		</PageShell>
	);
}
