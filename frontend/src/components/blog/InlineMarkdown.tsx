import type { ReactNode } from "react";

const TOKEN_RE = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/;
const BOLD_RE = /^\*\*([^*]+)\*\*$/;

export function InlineMarkdown({ text }: { text: string }): ReactNode {
	const parts = text.split(TOKEN_RE).filter((p) => p !== "");
	return (
		<>
			{parts.map((part, i) => {
				const linkMatch = part.match(LINK_RE);
				if (linkMatch) {
					const [, label, url] = linkMatch;
					const external = /^https?:\/\//.test(url);
					return (
						<a
							key={i}
							href={url}
							target={external ? "_blank" : undefined}
							rel={external ? "noreferrer" : undefined}
							className="text-primary underline underline-offset-2 hover:text-primary-hover"
						>
							{label}
						</a>
					);
				}
				const boldMatch = part.match(BOLD_RE);
				if (boldMatch) {
					return (
						<strong key={i} className="font-semibold text-on-surface">
							{boldMatch[1]}
						</strong>
					);
				}
				return <span key={i}>{part}</span>;
			})}
		</>
	);
}
