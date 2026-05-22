import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MarqueeRowProps {
	items: ReactNode[];
	speed?: number;
	className?: string;
	itemClassName?: string;
}

export default function MarqueeRow({
	items,
	speed = 30,
	className,
	itemClassName,
}: MarqueeRowProps) {
	const doubled = [...items, ...items];
	return (
		<div
			className={cn(
				"group relative w-full overflow-hidden",
				"[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
				className,
			)}
		>
			<div
				className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
				style={{ animationDuration: `${speed}s` }}
			>
				{doubled.map((item, i) => (
					<div
						key={i}
						className={cn(
							"mx-8 shrink-0 text-on-surface-variant",
							itemClassName,
						)}
					>
						{item}
					</div>
				))}
			</div>
		</div>
	);
}
