import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

interface AnimatedHeadlineProps {
	lines: string[];
	as?: "h1" | "h2" | "h3";
	className?: string;
}

export default function AnimatedHeadline({
	lines,
	as: Tag = "h1",
	className,
}: AnimatedHeadlineProps) {
	const reduced = useReducedMotion();
	const [inViewRef, isInView] = useInView<HTMLElement>({
		threshold: 0.2,
		once: true,
	});
	const containerRef = useRef<HTMLElement | null>(null);

	const setRefs = (el: HTMLElement | null) => {
		containerRef.current = el;
		(inViewRef as React.MutableRefObject<HTMLElement | null>).current = el;
	};

	useEffect(() => {
		if (!isInView || reduced || !containerRef.current) return;
		const words = containerRef.current.querySelectorAll<HTMLSpanElement>(
			"[data-word]",
		);
		if (words.length === 0) return;
		const instance = animate(words, {
			translateY: [40, 0],
			opacity: [0, 1],
			duration: 800,
			delay: stagger(60),
			ease: "out(4)",
		});
		return () => {
			instance.pause();
		};
	}, [isInView, reduced]);

	const initialOpacity = reduced ? 1 : 0;

	return (
		<Tag
			ref={setRefs as React.Ref<HTMLHeadingElement>}
			className={cn("tracking-tight", className)}
		>
			{lines.map((line, lineIdx) => (
				<span key={lineIdx} className="block">
					{line.split(" ").map((word, i) => (
						<span
							key={`${lineIdx}-${i}`}
							data-word
							className="inline-block"
							style={{ opacity: initialOpacity }}
						>
							{word}
							{i < line.split(" ").length - 1 ? " " : ""}
						</span>
					))}
				</span>
			))}
		</Tag>
	);
}
