import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { business } from "@/content/shared";

interface CtaCloseProps {
	headline: string;
	subheadline: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

export function CtaClose({ headline, subheadline, primaryCta, secondaryCta }: CtaCloseProps) {
	const reduced = useReducedMotion();
	const secondaryHref = secondaryCta?.href || business.whatsappUrl;

	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<motion.div
				initial={reduced ? false : { opacity: 0, scale: 0.97 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				className="relative overflow-hidden rounded-2xl border border-primary/30 bg-surface-container p-12 md:p-16 text-center shadow-[0_0_80px_-20px_rgba(0,94,196,0.35)]"
			>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 opacity-60"
					style={{
						background:
							"radial-gradient(ellipse at 50% -20%, rgba(0,94,196,0.18), transparent 60%)",
					}}
				/>
				<div className="relative">
					<h2 className="text-headline-lg md:text-display-md font-semibold tracking-tight">
						{headline}
					</h2>
					<p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl mx-auto">
						{subheadline}
					</p>
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
			</motion.div>
		</section>
	);
}
