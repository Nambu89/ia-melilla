import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
}

/**
 * IntersectionObserver hook.
 * Devuelve [ref, isInView]. Si once=true deja de observar al entrar.
 */
export function useInView<T extends Element = Element>({
	threshold = 0.2,
	rootMargin = "-50px",
	once = true,
}: UseInViewOptions = {}): [React.RefObject<T | null>, boolean] {
	const ref = useRef<T>(null);
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					setIsInView(true);
					if (once) observer.disconnect();
				} else if (!once) {
					setIsInView(false);
				}
			},
			{ threshold, rootMargin },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold, rootMargin, once]);

	return [ref, isInView];
}
