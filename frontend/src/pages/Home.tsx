import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { Hero } from "@/components/sections/Hero";
import { AudienceSplit } from "@/components/sections/AudienceSplit";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Sectores } from "@/components/sections/Sectores";
import { DemoFlagship } from "@/components/sections/DemoFlagship";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { AboutMelilla } from "@/components/sections/AboutMelilla";
import { CtaClose } from "@/components/sections/CtaClose";
import { MarqueeTech } from "@/components/sections/MarqueeTech";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { FAQ } from "@/components/sections/FAQ";
import { homeContent } from "@/content/home";

export default function Home() {
	return (
		<PageShell>
			<SeoHead
				title="IA Melilla — Inteligencia artificial para empresas y particulares"
				description="Construimos asistentes de IA prácticos desde Melilla. Chatbots, asistentes WhatsApp, agentes por sector, contenido visual IA, automatizaciones, IA Fiscal Melilla y más."
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
			<MarqueeTech />
			<ServicesGrid />
			<AudienceSplit
				eyebrow={homeContent.audienceSplit.eyebrow}
				headline={homeContent.audienceSplit.headline}
				cards={homeContent.audienceSplit.cards}
			/>
			<Sectores />
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
			<ComparisonTable />
			<AboutMelilla
				eyebrow={homeContent.aboutMelilla.eyebrow}
				headline={homeContent.aboutMelilla.headline}
				body={homeContent.aboutMelilla.body}
			/>
			<FAQ />
			<CtaClose
				headline={homeContent.ctaClose.headline}
				subheadline={homeContent.ctaClose.subheadline}
				primaryCta={homeContent.ctaClose.primaryCta}
				secondaryCta={homeContent.ctaClose.secondaryCta}
			/>
		</PageShell>
	);
}
