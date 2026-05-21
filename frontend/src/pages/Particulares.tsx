import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/sections/Hero";
import { HelpfulCases } from "@/components/sections/HelpfulCases";
import { HowItWorksList } from "@/components/sections/HowItWorksList";
import { PrivacyNote } from "@/components/sections/PrivacyNote";
import { CtaClose } from "@/components/sections/CtaClose";
import { particularesContent } from "@/content/particulares";

export default function Particulares() {
	return (
		<PageShell>
			<Hero
				eyebrow={particularesContent.hero.eyebrow}
				headline={particularesContent.hero.headline}
				subheadline={particularesContent.hero.subheadline}
				primaryCta={particularesContent.hero.primaryCta}
				secondaryCta={particularesContent.hero.secondaryCta}
			/>
			<HelpfulCases
				headline={particularesContent.helpfulCases.headline}
				cards={particularesContent.helpfulCases.cards}
			/>
			<HowItWorksList
				id="como-funciona"
				headline={particularesContent.howItWorks.headline}
				steps={particularesContent.howItWorks.steps}
			/>
			<PrivacyNote
				headline={particularesContent.privacy.headline}
				body={particularesContent.privacy.body}
			/>
			<CtaClose
				headline={particularesContent.ctaClose.headline}
				subheadline={particularesContent.ctaClose.body}
				primaryCta={particularesContent.ctaClose.cta}
			/>
		</PageShell>
	);
}
