import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/reactbits/ShinyText";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DemoFlagshipProps {
	eyebrow: string;
	headline: string;
	subheadline: string;
	exchange: { question: string; answer: string; source: string };
	cta: { label: string; href: string };
}

function useTypewriter(text: string, active: boolean, charDelayMs = 18) {
	const [typed, setTyped] = useState("");
	const reduced = useReducedMotion();

	useEffect(() => {
		if (!active) return;
		if (reduced) {
			setTyped(text);
			return;
		}
		setTyped("");
		let i = 0;
		const interval = window.setInterval(() => {
			i += 1;
			setTyped(text.slice(0, i));
			if (i >= text.length) window.clearInterval(interval);
		}, charDelayMs);
		return () => window.clearInterval(interval);
	}, [active, text, reduced, charDelayMs]);

	return typed;
}

export function DemoFlagship({
	eyebrow,
	headline,
	subheadline,
	exchange,
	cta,
}: DemoFlagshipProps) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const inView = useInView(sectionRef, { once: true, amount: 0.3 });
	const reduced = useReducedMotion();
	const typedAnswer = useTypewriter(exchange.answer, inView);
	const showCursor = inView && !reduced && typedAnswer.length < exchange.answer.length;

	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<motion.div
				ref={sectionRef}
				initial={reduced ? false : { opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.2 }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				className="rounded-xl border border-outline-variant bg-surface-container p-8 md:p-12"
			>
				<div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
					<div>
						<span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
							<span
								aria-hidden="true"
								className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
							/>
							<ShinyText
								text={eyebrow}
								color="rgb(0, 94, 196)"
								shineColor="#ffffff"
								speed={3}
								className="text-label-caps font-semibold tracking-[0.12em]"
							/>
						</span>
						<h2 className="mt-4 text-headline-lg font-semibold tracking-tight">{headline}</h2>
						<p className="mt-4 text-body-lg text-on-surface-variant">{subheadline}</p>
						<Button asChild size="lg" className="mt-8">
							<Link to={cta.href}>{cta.label}</Link>
						</Button>
					</div>
					<div className="flex flex-col gap-4">
						<motion.div
							initial={reduced ? false : { opacity: 0, x: 24 }}
							animate={inView ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.5, ease: "easeOut" }}
							className="rounded-md bg-surface-container-high px-5 py-4"
						>
							<p className="font-mono text-body-sm text-on-surface-muted mb-1">USUARIO</p>
							<p className="text-body-md text-on-surface">{exchange.question}</p>
						</motion.div>
						<motion.div
							initial={reduced ? false : { opacity: 0, x: 24 }}
							animate={inView ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
							className="rounded-md bg-surface-container-highest px-5 py-4"
						>
							<p className="font-mono text-body-sm text-primary mb-1">IA FISCAL</p>
							<p
								className="text-body-md text-on-surface whitespace-pre-line"
								aria-live="polite"
							>
								{typedAnswer}
								{showCursor && (
									<span
										aria-hidden="true"
										className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-0.5 animate-pulse bg-primary align-middle"
									/>
								)}
							</p>
							<p className="mt-4 text-body-sm text-on-surface-muted">{exchange.source}</p>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
