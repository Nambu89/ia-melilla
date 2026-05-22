import { useEffect, useRef, DependencyList } from "react";
import { animate, type AnimationParams } from "animejs";

/**
 * Wrapper para anime.js v4 con cleanup automático.
 * Acepta un ref, params de anime y deps opcionales.
 * Respeta prefers-reduced-motion internamente — el caller puede pasar
 * `reducedMotion` como dep para re-ejecutar si cambia.
 */
export function useAnime<T extends Element>(
	ref: React.RefObject<T | null>,
	params: AnimationParams,
	deps: DependencyList = [],
) {
	const instanceRef = useRef<ReturnType<typeof animate> | null>(null);

	useEffect(() => {
		if (!ref.current) return;

		// Respeta reduced motion del sistema
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (mq.matches) return;

		instanceRef.current = animate(ref.current, params);

		return () => {
			instanceRef.current?.pause();
			instanceRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return instanceRef;
}
