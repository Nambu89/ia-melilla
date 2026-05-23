import RevealOnScroll from "@/components/animations/RevealOnScroll";

interface SeoBlockProps {
	eyebrow: string;
	headline: string;
	paragraphs: readonly string[];
}

const KEYWORDS = [
	"inteligencia artificial Melilla",
	"inteligencia artificial",
	"inteligencia artificial en Melilla",
	"tecnología inteligente",
];

function highlightKeywords(text: string): React.ReactNode {
	const pattern = new RegExp(
		`(${KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
		"gi",
	);
	const parts = text.split(pattern);
	return parts.map((part, i) => {
		const isKeyword = KEYWORDS.some(
			(k) => k.toLowerCase() === part.toLowerCase(),
		);
		return isKeyword ? (
			<strong key={i} className="font-semibold text-on-surface">
				{part}
			</strong>
		) : (
			<span key={i}>{part}</span>
		);
	});
}

export function SeoBlock({ eyebrow, headline, paragraphs }: SeoBlockProps) {
	return (
		<section className="border-t border-outline-variant bg-surface-container-low">
			<div className="mx-auto max-w-[900px] px-6 py-20">
				<RevealOnScroll>
					<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
						{eyebrow}
					</p>
					<h3 className="text-headline-md md:text-headline-lg font-semibold tracking-tight text-on-surface">
						{headline}
					</h3>
				</RevealOnScroll>
				<RevealOnScroll delay={0.1}>
					<div className="mt-8 flex flex-col gap-5 text-body-md text-on-surface-variant leading-relaxed">
						{paragraphs.map((p, i) => (
							<p key={i}>{highlightKeywords(p)}</p>
						))}
					</div>
				</RevealOnScroll>
			</div>
		</section>
	);
}
