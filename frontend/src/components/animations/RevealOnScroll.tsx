import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ReactNode } from "react";

interface RevealOnScrollProps {
	children: ReactNode;
	delay?: number;
	className?: string;
	as?: "div" | "section" | "article" | "header" | "footer";
}

export default function RevealOnScroll({
	children,
	delay = 0,
	className,
	as = "div",
}: RevealOnScrollProps) {
	const reduced = useReducedMotion();

	const variants: Variants = reduced
		? {
				hidden: { opacity: 1, y: 0 },
				visible: { opacity: 1, y: 0 },
			}
		: {
				hidden: { opacity: 0, y: 24 },
				visible: {
					opacity: 1,
					y: 0,
					transition: {
						duration: 0.5,
						delay,
						ease: [0.16, 1, 0.3, 1],
					},
				},
			};

	const MotionTag = motion[as];
	return (
		<MotionTag
			className={className}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.2 }}
			variants={variants}
		>
			{children}
		</MotionTag>
	);
}
