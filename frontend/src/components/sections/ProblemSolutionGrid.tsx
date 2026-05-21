import { Card, CardContent } from "@/components/ui/card";

interface ProblemSolutionCard {
	problem: string;
	solution: string;
}

interface ProblemSolutionGridProps {
	headline: string;
	cards: readonly ProblemSolutionCard[];
}

export function ProblemSolutionGrid({ headline, cards }: ProblemSolutionGridProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<div className="mt-12 grid gap-6 md:grid-cols-2">
				{cards.map((card) => (
					<Card key={card.problem} className="border border-outline-variant">
						<CardContent>
							<p className="text-label-caps text-on-surface-muted mb-2">PROBLEMA</p>
							<p className="text-headline-sm font-semibold mb-4">{card.problem}</p>
							<p className="text-label-caps text-primary mb-2">SOLUCION</p>
							<p className="text-body-md text-on-surface-variant">{card.solution}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
