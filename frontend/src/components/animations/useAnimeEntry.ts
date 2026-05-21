import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function useAnimeEntry<T extends HTMLElement>(delay = 0) {
	const ref = useRef<T>(null);
	const reduced = useReducedMotion();
	useEffect(() => {
		if (!ref.current || reduced) return;
		const el = ref.current;
		el.style.opacity = "0";
		const instance = animate(el, {
			opacity: [0, 1],
			translateY: [24, 0],
			duration: 700,
			delay,
			ease: "out(3)",
		});
		return () => {
			instance.pause();
		};
	}, [delay, reduced]);
	return ref;
}
