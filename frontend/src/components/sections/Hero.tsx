import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroProps {
	eyebrow: string;
	headline: string;
	subheadline: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

export function Hero({ eyebrow, headline, subheadline, primaryCta, secondaryCta }: HeroProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 pt-24 pb-32 md:pt-32 md:pb-40">
			<p className="text-label-caps text-primary mb-6">{eyebrow}</p>
			<h1 className="text-display-md md:text-display-lg font-bold tracking-tight whitespace-pre-line max-w-4xl">
				{headline}
			</h1>
			<p className="text-body-lg text-on-surface-variant mt-6 max-w-2xl">{subheadline}</p>
			<div className="mt-10 flex flex-col gap-4 sm:flex-row">
				<Button asChild size="lg">
					<Link to={primaryCta.href}>{primaryCta.label}</Link>
				</Button>
				{secondaryCta && (
					<Button asChild variant="outline" size="lg">
						<Link to={secondaryCta.href}>{secondaryCta.label}</Link>
					</Button>
				)}
			</div>
		</section>
	);
}
