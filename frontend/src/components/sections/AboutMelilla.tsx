interface AboutMelillaProps {
	eyebrow: string;
	headline: string;
	body: readonly string[];
}

export function AboutMelilla({ eyebrow, headline, body }: AboutMelillaProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
				<div>
					<p className="text-label-caps text-on-surface-muted mb-3">{eyebrow}</p>
					<h2 className="text-headline-lg font-semibold tracking-tight">{headline}</h2>
				</div>
				<div className="flex flex-col gap-6">
					{body.map((paragraph, idx) => (
						<p key={idx} className="text-body-lg text-on-surface-variant">
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</section>
	);
}
