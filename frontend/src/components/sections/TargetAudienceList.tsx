import { ArrowRight } from "lucide-react";

interface TargetAudienceListProps {
	headline: string;
	items: readonly string[];
}

export function TargetAudienceList({ headline, items }: TargetAudienceListProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<ul className="mt-10 flex flex-col gap-4">
				{items.map((item) => (
					<li key={item} className="flex items-start gap-4 text-body-lg text-on-surface">
						<ArrowRight className="mt-1.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
						<span>{item}</span>
					</li>
				))}
			</ul>
		</section>
	);
}
