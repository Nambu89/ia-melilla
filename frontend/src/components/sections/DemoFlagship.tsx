import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DemoFlagshipProps {
	eyebrow: string;
	headline: string;
	subheadline: string;
	exchange: { question: string; answer: string; source: string };
	cta: { label: string; href: string };
}

export function DemoFlagship({
	eyebrow,
	headline,
	subheadline,
	exchange,
	cta,
}: DemoFlagshipProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<div className="rounded-xl border border-outline-variant bg-surface-container p-8 md:p-12">
				<div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
					<div>
						<Badge variant="primary">{eyebrow}</Badge>
						<h2 className="mt-4 text-headline-lg font-semibold tracking-tight">{headline}</h2>
						<p className="mt-4 text-body-lg text-on-surface-variant">{subheadline}</p>
						<Button asChild size="lg" className="mt-8">
							<Link to={cta.href}>{cta.label}</Link>
						</Button>
					</div>
					<div className="flex flex-col gap-4">
						<div className="rounded-md bg-surface-container-high px-5 py-4">
							<p className="font-mono text-body-sm text-on-surface-muted mb-1">USUARIO</p>
							<p className="text-body-md text-on-surface">{exchange.question}</p>
						</div>
						<div className="rounded-md bg-surface-container-highest px-5 py-4">
							<p className="font-mono text-body-sm text-primary mb-1">IA FISCAL</p>
							<p className="text-body-md text-on-surface whitespace-pre-line">{exchange.answer}</p>
							<p className="mt-4 text-body-sm text-on-surface-muted">{exchange.source}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
