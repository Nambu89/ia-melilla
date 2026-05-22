import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedHeadline from "@/components/animations/AnimatedHeadline";
import AuroraBackground from "@/components/decoration/AuroraBackground";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

interface HeroProps {
	eyebrow: string;
	headline: string;
	subheadline: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

export function Hero({
	eyebrow,
	headline,
	subheadline,
	primaryCta,
	secondaryCta,
}: HeroProps) {
	const lines = headline.split("\n").filter(Boolean);
	return (
		<section className="relative overflow-hidden">
			<AuroraBackground />
			<div className="relative mx-auto max-w-[1200px] px-6 pt-24 pb-32 md:pt-40 md:pb-48">
				<RevealOnScroll>
					<p className="text-label-caps text-primary mb-6 uppercase">
						{eyebrow}
					</p>
				</RevealOnScroll>
				<AnimatedHeadline
					lines={lines}
					as="h1"
					className="text-display-md md:text-display-lg lg:text-display-xl font-bold max-w-5xl text-on-surface"
				/>
				<RevealOnScroll delay={0.2}>
					<p className="text-body-lg text-on-surface-variant mt-8 max-w-2xl">
						{subheadline}
					</p>
				</RevealOnScroll>
				<RevealOnScroll delay={0.3}>
					<div className="mt-12 flex flex-col gap-4 sm:flex-row">
						<Button asChild size="lg">
							<Link to={primaryCta.href}>{primaryCta.label}</Link>
						</Button>
						{secondaryCta && (
							<Button asChild variant="outline" size="lg">
								<Link to={secondaryCta.href}>{secondaryCta.label}</Link>
							</Button>
						)}
					</div>
				</RevealOnScroll>
			</div>
		</section>
	);
}
