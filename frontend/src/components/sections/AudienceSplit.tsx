import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

interface AudienceCard {
	audience: "b2b" | "b2c";
	badge: string;
	title: string;
	description: string;
	bullets: readonly string[];
	cta: { label: string; href: string };
}

interface AudienceSplitProps {
	eyebrow: string;
	headline: string;
	cards: readonly AudienceCard[];
}

function AudienceCardWrapper({ card }: { card: AudienceCard }) {
	return (
		<RevealOnScroll>
			<Card className="border border-outline-variant p-8">
				<CardHeader>
					<Badge variant={card.audience} className="self-start">
						{card.badge}
					</Badge>
					<CardTitle className="mt-3 text-headline-md">{card.title}</CardTitle>
				</CardHeader>
				<CardContent className="mt-4">
					<p>{card.description}</p>
					<ul className="mt-6 flex flex-col gap-3">
						{card.bullets.map((bullet) => (
							<li key={bullet} className="flex items-start gap-3 text-body-md text-on-surface">
								<Check className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
								<span>{bullet}</span>
							</li>
						))}
					</ul>
					<Button
						asChild
						variant={card.audience}
						className="mt-8 w-full sm:w-auto"
						size="lg"
					>
						<Link to={card.cta.href}>{card.cta.label}</Link>
					</Button>
				</CardContent>
			</Card>
		</RevealOnScroll>
	);
}

export function AudienceSplit({ eyebrow, headline, cards }: AudienceSplitProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<p className="text-label-caps text-on-surface-muted mb-3">{eyebrow}</p>
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<div className="mt-12 grid gap-6 md:grid-cols-2">
				{cards.map((card) => (
					<AudienceCardWrapper key={card.audience} card={card} />
				))}
			</div>
		</section>
	);
}
