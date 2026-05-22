import { useEffect, useRef } from "react";

interface UseMagneticOptions {
	strength?: number;
	radius?: number;
}

/**
 * Mouse follower hook para CTAs (desktop only, pointer fine).
 * Aplica translate proporcional cuando el cursor está dentro del radius.
 * Skip si reduced motion o no hay pointer fino (touch).
 */
export function useMagnetic<T extends HTMLElement>(
	ref: React.RefObject<T | null>,
	{ strength = 0.3, radius = 120 }: UseMagneticOptions = {},
) {
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		// Skip en touch devices
		if (!window.matchMedia("(pointer: fine)").matches) return;
		// Skip si reduced motion
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const el = ref.current;
		if (!el) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);

			rafRef.current = requestAnimationFrame(() => {
				const rect = el.getBoundingClientRect();
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				const dx = e.clientX - cx;
				const dy = e.clientY - cy;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < radius) {
					const tx = dx * strength;
					const ty = dy * strength;
					el.style.transform = `translate(${tx}px, ${ty}px)`;
					el.style.transition = "transform 0.1s ease-out";
				} else {
					el.style.transform = "translate(0px, 0px)";
					el.style.transition = "transform 0.4s ease-out";
				}
			});
		};

		const handleMouseLeave = () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			el.style.transform = "translate(0px, 0px)";
			el.style.transition = "transform 0.4s ease-out";
		};

		document.addEventListener("mousemove", handleMouseMove);
		el.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			el.removeEventListener("mouseleave", handleMouseLeave);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [ref, strength, radius]);
}
