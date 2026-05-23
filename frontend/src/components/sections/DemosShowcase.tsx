import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Lock } from "lucide-react";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
import { useSpotlight } from "@/hooks/useSpotlight";

interface DemoItem {
	slug: string;
	title: string;
	description: string;
	badge: string;
	status: "live" | "coming-soon";
	href: string;
}

interface DemosShowcaseProps {
	eyebrow: string;
	headline: string;
	subheadline: string;
	cta: { label: string; href: string };
	items: readonly DemoItem[];
}

export function DemosShowcase({
	eyebrow,
	headline,
	subheadline,
	cta,
	items,
}: DemosShowcaseProps) {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<RevealOnScroll>
				<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
					{eyebrow}
				</p>
				<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl text-on-surface">
					{headline}
				</h2>
				<p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
					{subheadline}
				</p>
			</RevealOnScroll>

			<div className="mt-12 grid gap-6 md:grid-cols-2">
				{items.map((demo, i) => (
					<RevealOnScroll key={demo.slug} delay={i * 0.08}>
						<DemoCard demo={demo} />
					</RevealOnScroll>
				))}
			</div>

			<RevealOnScroll delay={0.2}>
				<div className="mt-12 flex justify-center">
					<Link
						to={cta.href}
						className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-primary transition-colors hover:text-primary-hover"
					>
						{cta.label}
						<ArrowRight size={16} />
					</Link>
				</div>
			</RevealOnScroll>
		</section>
	);
}

function DemoCard({ demo }: { demo: DemoItem }) {
	const isLive = demo.status === "live";
	const [handlers, pos] = useSpotlight<HTMLAnchorElement>();
	return (
		<Link
			to={demo.href}
			ref={handlers.ref}
			onMouseMove={handlers.onMouseMove}
			onMouseEnter={handlers.onMouseEnter}
			onMouseLeave={handlers.onMouseLeave}
			onFocus={handlers.onFocus}
			onBlur={handlers.onBlur}
			className={`group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border p-8 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
				isLive
					? "border-primary/30 bg-surface-container hover:border-primary/60"
					: "border-outline-variant bg-surface-container-low hover:border-outline"
			}`}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 transition-opacity duration-500"
				style={{
					opacity: pos.opacity,
					background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(0,94,196,0.16), transparent 70%)`,
				}}
			/>
			<div className="relative flex h-full flex-col gap-4">
				<div className="flex items-start justify-between gap-4">
					<div
						className={`flex h-11 w-11 items-center justify-center rounded-lg ${
							isLive
								? "bg-primary/15 text-primary"
								: "bg-surface-container-high text-on-surface-muted"
						}`}
					>
						{isLive ? <Sparkles size={20} /> : <Lock size={18} />}
					</div>
					<span
						className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-label-caps font-semibold tracking-[0.12em] ${
							isLive
								? "border-primary/40 bg-primary/10 text-primary"
								: "border-outline-variant bg-surface-container-low text-on-surface-muted"
						}`}
					>
						{isLive && (
							<span
								aria-hidden="true"
								className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
							/>
						)}
						{demo.badge}
					</span>
				</div>
				<div className="flex-1">
					<h3 className="text-headline-sm font-semibold text-on-surface">
						{demo.title}
					</h3>
					<p className="mt-2 text-body-md text-on-surface-variant">
						{demo.description}
					</p>
				</div>
				<div
					className={`flex items-center gap-1.5 text-label-lg font-medium transition-all duration-200 group-hover:translate-x-1 ${
						isLive ? "text-primary" : "text-on-surface-muted"
					}`}
				>
					{isLive ? "Probar ahora" : "Más info"}
					<ArrowRight size={14} />
				</div>
			</div>
		</Link>
	);
}
