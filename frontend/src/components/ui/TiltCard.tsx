import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

interface TiltCardProps {
	children: ReactNode;
	className?: string;
	maxTilt?: number;
}

/**
 * Card con efecto tilt (rotateX/Y) al hover usando framer-motion.
 * Max 6 grados de rotación. Glow border emerald al hover.
 * Reduced motion: solo border + glow, sin tilt.
 */
export default function TiltCard({
	children,
	className,
	maxTilt = 6,
}: TiltCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();

	const rotateX = useMotionValue(0);
	const rotateY = useMotionValue(0);

	const springConfig = { stiffness: 200, damping: 25 };
	const springX = useSpring(rotateX, springConfig);
	const springY = useSpring(rotateY, springConfig);

	// Glow opacity animado
	const glowOpacity = useMotionValue(0);
	const glowSpring = useSpring(glowOpacity, springConfig);
	const glowShadow = useTransform(
		glowSpring,
		[0, 1],
		["0 0 0px rgba(16,185,129,0)", "0 0 32px rgba(16,185,129,0.25)"],
	);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (reducedMotion || !ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		const dx = (e.clientX - cx) / (rect.width / 2);
		const dy = (e.clientY - cy) / (rect.height / 2);
		rotateY.set(dx * maxTilt);
		rotateX.set(-dy * maxTilt);
		glowOpacity.set(1);
	};

	const handleMouseLeave = () => {
		rotateX.set(0);
		rotateY.set(0);
		glowOpacity.set(0);
	};

	return (
		<motion.div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{
				perspective: 1000,
				rotateX: reducedMotion ? 0 : springX,
				rotateY: reducedMotion ? 0 : springY,
				boxShadow: glowShadow,
			}}
			className={cn(
				"rounded-2xl border border-outline transition-[border-color] duration-250 hover:border-primary/50",
				className,
			)}
		>
			{children}
		</motion.div>
	);
}
