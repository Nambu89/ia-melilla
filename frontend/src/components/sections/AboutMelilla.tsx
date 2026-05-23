import RevealOnScroll from "@/components/animations/RevealOnScroll";
import CountUp from "@/components/animations/CountUp";

interface AboutMelillaProps {
	eyebrow: string;
	headline: string;
	body: readonly string[];
}

const STATS: Array<{
	value: number;
	suffix?: string;
	label: string;
	hint?: string;
}> = [
	{ value: 60, suffix: "%", label: "Deducción IRPF", hint: "residentes Melilla" },
	{ value: 4, suffix: "%", label: "IPSI vs IVA", hint: "tipo general local" },
	{ value: 5, label: "Herramientas IA", hint: "abiertas en /demos" },
];

export function AboutMelilla({ eyebrow, headline, body }: AboutMelillaProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
				<div className="flex flex-col gap-8">
					<RevealOnScroll>
						<p className="text-label-caps text-on-surface-muted mb-3">{eyebrow}</p>
						<h2 className="text-headline-lg font-semibold tracking-tight">{headline}</h2>
					</RevealOnScroll>
					<RevealOnScroll delay={0.15}>
						<dl className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-6">
							{STATS.map((stat) => (
								<div
									key={stat.label}
									className="flex items-baseline justify-between gap-4 border-b border-outline-variant pb-3 last:border-b-0 last:pb-0"
								>
									<dt className="text-body-sm text-on-surface-variant">
										{stat.label}
										{stat.hint && (
											<span className="block text-label-caps text-on-surface-muted">
												{stat.hint}
											</span>
										)}
									</dt>
									<dd className="text-headline-md font-bold text-primary tabular-nums">
										<CountUp to={stat.value} suffix={stat.suffix ?? ""} />
									</dd>
								</div>
							))}
						</dl>
					</RevealOnScroll>
				</div>
				<div className="flex flex-col gap-6">
					{body.map((paragraph, idx) => (
						<RevealOnScroll key={idx} delay={idx * 0.08}>
							<p className="text-body-lg text-on-surface-variant">{paragraph}</p>
						</RevealOnScroll>
					))}
				</div>
			</div>
		</section>
	);
}
