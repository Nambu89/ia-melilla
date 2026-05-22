import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CursorBlob() {
	const reduced = useReducedMotion();
	const [enabled, setEnabled] = useState(false);

	const x = useMotionValue(-200);
	const y = useMotionValue(-200);
	const sx = useSpring(x, { stiffness: 200, damping: 30, mass: 0.6 });
	const sy = useSpring(y, { stiffness: 200, damping: 30, mass: 0.6 });

	useEffect(() => {
		if (reduced) return;
		const mq = window.matchMedia("(pointer: fine)");
		if (!mq.matches) return;
		setEnabled(true);
		const handle = (e: MouseEvent) => {
			x.set(e.clientX - 64);
			y.set(e.clientY - 64);
		};
		window.addEventListener("mousemove", handle, { passive: true });
		return () => window.removeEventListener("mousemove", handle);
	}, [reduced, x, y]);

	if (!enabled) return null;

	return (
		<motion.div
			aria-hidden
			className="pointer-events-none fixed top-0 left-0 z-50 h-32 w-32 rounded-full bg-primary/15 blur-3xl"
			style={{
				x: sx,
				y: sy,
				mixBlendMode: "difference",
			}}
		/>
	);
}
