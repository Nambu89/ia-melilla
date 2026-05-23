import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { Hero } from "@/components/sections/Hero";
import { AudienceSplit } from "@/components/sections/AudienceSplit";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Sectores } from "@/components/sections/Sectores";
import { DemosShowcase } from "@/components/sections/DemosShowcase";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { AboutCompany } from "@/components/sections/AboutCompany";
import { CtaClose } from "@/components/sections/CtaClose";
import { MarqueeTech } from "@/components/sections/MarqueeTech";
import { FAQ } from "@/components/sections/FAQ";
import { SeoBlock } from "@/components/sections/SeoBlock";
import { homeContent } from "@/content/home";

export default function Home() {
	return (
		<PageShell>
			<SeoHead
				title="IA Melilla — Soluciones de inteligencia artificial para empresas y particulares"
				description="Diseñamos, construimos y mantenemos soluciones IA: chatbots, asistentes WhatsApp, agentes verticales, contenido visual, automatizaciones e integraciones a medida. Demos en vivo disponibles."
				path="/"
			/>
			<OrganizationJsonLd />
			<Hero
				eyebrow={homeContent.hero.eyebrow}
				headline={homeContent.hero.headline}
				tagline={homeContent.hero.tagline}
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
			<DemosShowcase
				eyebrow={homeContent.demosShowcase.eyebrow}
				headline={homeContent.demosShowcase.headline}
				subheadline={homeContent.demosShowcase.subheadline}
				cta={homeContent.demosShowcase.cta}
				items={homeContent.demosShowcase.items}
			/>
			<ProcessSteps
				id="como-trabajamos"
				eyebrow={homeContent.processSteps.eyebrow}
				headline={homeContent.processSteps.headline}
				steps={homeContent.processSteps.steps}
			/>
			<AboutCompany
				eyebrow={homeContent.aboutCompany.eyebrow}
				headline={homeContent.aboutCompany.headline}
				body={homeContent.aboutCompany.body}
				stats={homeContent.aboutCompany.stats}
			/>
			<FAQ />
			<SeoBlock
				eyebrow={homeContent.seoBlock.eyebrow}
				headline={homeContent.seoBlock.headline}
				paragraphs={homeContent.seoBlock.paragraphs}
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
