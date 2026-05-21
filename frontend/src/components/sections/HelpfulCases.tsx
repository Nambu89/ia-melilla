import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface HelpfulCase {
	title: string;
	body: string;
}

interface HelpfulCasesProps {
	headline: string;
	cards: readonly HelpfulCase[];
}

export function HelpfulCases({ headline, cards }: HelpfulCasesProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<div className="mt-12 grid gap-6 md:grid-cols-2">
				{cards.map((card) => (
					<Card key={card.title} className="border border-outline-variant">
						<CardHeader>
							<CardTitle>{card.title}</CardTitle>
						</CardHeader>
						<CardContent className="mt-3">{card.body}</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
