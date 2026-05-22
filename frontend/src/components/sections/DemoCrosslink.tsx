import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DemoCrosslinkProps {
	headline: string;
	body: string;
	cta: { label: string; href: string };
}

export function DemoCrosslink({ headline, body, cta }: DemoCrosslinkProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<div className="rounded-xl border border-outline-variant bg-surface-container p-6 sm:p-10 md:p-16">
				<h2 className="text-headline-md md:text-headline-lg font-semibold tracking-tight max-w-3xl break-words">
					{headline}
				</h2>
				<p className="mt-4 text-body-lg text-on-surface-variant max-w-3xl">{body}</p>
				<Button asChild size="lg" className="mt-8">
					<Link to={cta.href}>{cta.label}</Link>
				</Button>
			</div>
		</section>
	);
}
