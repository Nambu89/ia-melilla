interface HowItWorksStep {
	title: string;
	body: string;
}

interface HowItWorksListProps {
	id?: string;
	headline: string;
	steps: readonly HowItWorksStep[];
}

export function HowItWorksList({ id, headline, steps }: HowItWorksListProps) {
	return (
		<section id={id} className="mx-auto max-w-[1200px] px-6 py-24">
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<ol className="mt-12 flex flex-col gap-8">
				{steps.map((step, idx) => (
					<li key={step.title} className="flex gap-6 items-start">
						<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-bold">
							{idx + 1}
						</span>
						<div>
							<h3 className="text-headline-sm font-semibold tracking-tight">{step.title}</h3>
							<p className="mt-2 text-body-md text-on-surface-variant">{step.body}</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
