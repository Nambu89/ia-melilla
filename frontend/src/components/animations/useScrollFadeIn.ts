import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function useScrollFadeIn<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const reduced = useReducedMotion();
	useEffect(() => {
		if (!ref.current || reduced) return;
		const el = ref.current;
		el.style.opacity = "0";
		el.style.transform = "translateY(24px)";
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animate(el, {
							opacity: [0, 1],
							translateY: [24, 0],
							duration: 600,
							ease: "out(3)",
						});
						observer.unobserve(el);
					}
				});
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [reduced]);
	return ref;
}
