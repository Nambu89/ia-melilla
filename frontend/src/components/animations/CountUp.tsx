import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CountUpProps {
	to: number;
	duration?: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	className?: string;
}

function easeOutCubic(t: number): number {
	return 1 - Math.pow(1 - t, 3);
}

export default function CountUp({
	to,
	duration = 1200,
	prefix = "",
	suffix = "",
	decimals = 0,
	className,
}: CountUpProps) {
	const reduced = useReducedMotion();
	const [ref, isInView] = useInView<HTMLSpanElement>({
		threshold: 0.4,
		once: true,
	});
	const [value, setValue] = useState(reduced ? to : 0);
	const startedRef = useRef(false);

	useEffect(() => {
		if (!isInView || startedRef.current) return;
		startedRef.current = true;
		if (reduced) {
			setValue(to);
			return;
		}
		const start = performance.now();
		let raf = 0;
		const tick = (now: number) => {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeOutCubic(progress);
			setValue(to * eased);
			if (progress < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [isInView, to, duration, reduced]);

	const formatted = value.toFixed(decimals);

	return (
		<span ref={ref} className={className}>
			{prefix}
			{formatted}
			{suffix}
		</span>
	);
}
