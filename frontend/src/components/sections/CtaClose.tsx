import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { business } from "@/content/shared";

interface CtaCloseProps {
	headline: string;
	subheadline: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

export function CtaClose({ headline, subheadline, primaryCta, secondaryCta }: CtaCloseProps) {
	const secondaryHref = secondaryCta?.href || business.whatsappUrl;
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<div className="rounded-xl border border-outline-variant bg-surface-container-low p-12 md:p-16 text-center">
				<h2 className="text-headline-lg md:text-display-md font-semibold tracking-tight">
					{headline}
				</h2>
				<p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl mx-auto">{subheadline}</p>
				<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
					<Button asChild size="lg">
						<Link to={primaryCta.href}>{primaryCta.label}</Link>
					</Button>
					{secondaryCta && (
						<Button asChild variant="outline" size="lg">
							<a href={secondaryHref} target="_blank" rel="noreferrer">
								{secondaryCta.label}
							</a>
						</Button>
					)}
				</div>
			</div>
		</section>
	);
}
