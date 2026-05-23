import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

interface AnimatedHeadlineProps {
	lines: string[];
	as?: "h1" | "h2" | "h3";
	className?: string;
}

const containerVariants: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const wordVariants: Variants = {
	hidden: { opacity: 0, y: 40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
	},
};

export default function AnimatedHeadline({
	lines,
	as: Tag = "h1",
	className,
}: AnimatedHeadlineProps) {
	const reduced = useReducedMotion();
	const MotionTag = motion[Tag];

	if (reduced) {
		return (
			<Tag className={cn("tracking-tight", className)}>
				{lines.map((line, lineIdx) => (
					<span key={lineIdx} className="block">
						{line}
					</span>
				))}
			</Tag>
		);
	}

	return (
		<MotionTag
			className={cn("tracking-tight", className)}
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.2 }}
		>
			{lines.map((line, lineIdx) => {
				const words = line.split(" ");
				return (
					<span key={lineIdx} className="block">
						{words.map((word, i) => (
							<motion.span
								key={`${lineIdx}-${i}`}
								variants={wordVariants}
								className="inline-block"
							>
								{word}
								{i < words.length - 1 ? " " : ""}
							</motion.span>
						))}
					</span>
				);
			})}
		</MotionTag>
	);
}
