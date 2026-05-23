import RevealOnScroll from "@/components/animations/RevealOnScroll";

interface ProcessStep {
	number: string;
	title: string;
	body: string;
}

interface ProcessStepsProps {
	id?: string;
	eyebrow: string;
	headline: string;
	steps: readonly ProcessStep[];
}

export function ProcessSteps({ id, eyebrow, headline, steps }: ProcessStepsProps) {
	return (
		<section id={id} className="mx-auto max-w-[1200px] px-6 py-24">
			<RevealOnScroll>
				<p className="text-label-caps text-on-surface-muted mb-3">{eyebrow}</p>
				<h2 className="text-headline-lg font-semibold tracking-tight max-w-2xl">
					{headline}
				</h2>
			</RevealOnScroll>
			<div className="mt-12 grid gap-12 md:grid-cols-3">
				{steps.map((step, i) => (
					<RevealOnScroll key={step.number} delay={i * 0.1}>
						<div className="relative flex flex-col gap-4 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low p-8">
							<span
								aria-hidden="true"
								className="pointer-events-none absolute -right-3 -top-6 text-[120px] font-bold leading-none text-primary/15 select-none"
							>
								{step.number}
							</span>
							<div className="relative">
								<p className="text-label-caps text-primary">
									Paso {step.number}
								</p>
								<h3 className="mt-3 text-headline-sm font-semibold tracking-tight">
									{step.title}
								</h3>
								<p className="mt-3 text-body-md text-on-surface-variant">
									{step.body}
								</p>
							</div>
						</div>
					</RevealOnScroll>
				))}
			</div>
		</section>
	);
}
