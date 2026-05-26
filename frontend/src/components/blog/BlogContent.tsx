import {
	Sparkles,
	Workflow,
	UtensilsCrossed,
	Building2,
	Briefcase,
	type LucideIcon,
} from "lucide-react";
import { InlineMarkdown } from "./InlineMarkdown";
import type { BlogBlock } from "@/content/blog/types";

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
	automation:
		"radial-gradient(circle at 30% 20%, #2A78D8 0%, transparent 50%), radial-gradient(circle at 80% 80%, #001F4D 0%, transparent 60%), linear-gradient(135deg, #001F4D 0%, #005EC4 50%, #2A78D8 100%)",
	restaurant:
		"radial-gradient(circle at 25% 25%, #5294E8 0%, transparent 55%), radial-gradient(circle at 75% 75%, #003B7F 0%, transparent 55%), linear-gradient(135deg, #003B7F 0%, #2A78D8 60%, #5294E8 100%)",
	skyline:
		"radial-gradient(circle at 50% 100%, #005EC4 0%, transparent 60%), linear-gradient(160deg, #001F4D 0%, #0A0A0A 40%, #005EC4 100%)",
	office:
		"radial-gradient(circle at 70% 30%, #005EC4 0%, transparent 50%), linear-gradient(135deg, #0A0A0A 0%, #003B7F 50%, #005EC4 100%)",
	default:
		"radial-gradient(circle at 30% 30%, #2A78D8 0%, transparent 60%), linear-gradient(135deg, #001F4D 0%, #005EC4 100%)",
};

const PLACEHOLDER_ICONS: Record<string, LucideIcon> = {
	automation: Workflow,
	restaurant: UtensilsCrossed,
	skyline: Building2,
	office: Briefcase,
};

const PLACEHOLDER_TOPICS: Record<string, string> = {
	automation: "Automatizacion",
	restaurant: "Hosteleria",
	skyline: "Pymes Melilla",
	office: "Profesionales",
};

export function PlaceholderImage({
	alt,
	placeholder,
	className,
}: {
	alt: string;
	placeholder?: string;
	className?: string;
}) {
	const gradient =
		(placeholder && PLACEHOLDER_GRADIENTS[placeholder]) ??
		PLACEHOLDER_GRADIENTS.default;
	const Icon: LucideIcon =
		(placeholder ? PLACEHOLDER_ICONS[placeholder] : undefined) ?? Sparkles;
	const topic =
		(placeholder ? PLACEHOLDER_TOPICS[placeholder] : undefined) ??
		"IA Melilla";
	return (
		<div
			role="img"
			aria-label={alt}
			className={`relative flex aspect-[16/9] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-outline-variant ${className ?? ""}`}
			style={{ background: gradient }}
		>
			<Icon
				className="h-16 w-16 text-white/70 drop-shadow-lg md:h-20 md:w-20"
				aria-hidden
				strokeWidth={1.4}
			/>
			<div className="mt-4 flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3.5 py-1.5 text-label-caps text-white/90 backdrop-blur-sm">
				<Sparkles className="h-3 w-3" aria-hidden />
				{topic}
			</div>
		</div>
	);
}

export function BlogContent({ blocks }: { blocks: readonly BlogBlock[] }) {
	return (
		<div className="prose-blog flex flex-col gap-6">
			{blocks.map((block, i) => {
				switch (block.type) {
					case "intro":
						return (
							<p
								key={i}
								className="text-body-lg italic text-on-surface-variant leading-relaxed border-l-2 border-primary pl-5"
							>
								<InlineMarkdown text={block.text} />
							</p>
						);
					case "h2":
						return (
							<h2
								key={i}
								className="mt-8 text-headline-md font-semibold tracking-tight text-on-surface"
							>
								{block.text}
							</h2>
						);
					case "h3":
						return (
							<h3
								key={i}
								className="mt-4 text-headline-sm font-semibold tracking-tight text-on-surface"
							>
								{block.text}
							</h3>
						);
					case "paragraph":
						return (
							<p
								key={i}
								className="text-body-md text-on-surface-variant leading-relaxed"
							>
								<InlineMarkdown text={block.text} />
							</p>
						);
					case "ulist":
						return (
							<ul
								key={i}
								className="ml-6 list-disc space-y-2 text-body-md text-on-surface-variant leading-relaxed marker:text-primary"
							>
								{block.items.map((item, j) => (
									<li key={j}>
										<InlineMarkdown text={item} />
									</li>
								))}
							</ul>
						);
					case "olist":
						return (
							<ol
								key={i}
								className="ml-6 list-decimal space-y-2 text-body-md text-on-surface-variant leading-relaxed marker:font-semibold marker:text-primary"
							>
								{block.items.map((item, j) => (
									<li key={j}>
										<InlineMarkdown text={item} />
									</li>
								))}
							</ol>
						);
					case "quote":
						return (
							<blockquote
								key={i}
								className="rounded-r-lg border-l-4 border-primary bg-surface-container-low px-5 py-4 text-body-md italic text-on-surface-variant"
							>
								<InlineMarkdown text={block.text} />
							</blockquote>
						);
					case "image":
						return block.src ? (
							<img
								key={i}
								src={block.src}
								alt={block.alt}
								loading="lazy"
								className="my-4 w-full rounded-xl border border-outline-variant"
							/>
						) : (
							<PlaceholderImage
								key={i}
								alt={block.alt}
								placeholder={block.placeholder}
								className="my-4"
							/>
						);
					default:
						return null;
				}
			})}
		</div>
	);
}
