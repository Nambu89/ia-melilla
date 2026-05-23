import { useRef, useState, type MouseEvent, type RefObject } from "react";

export interface SpotlightHandlers<T extends HTMLElement> {
	ref: RefObject<T | null>;
	onMouseMove: (e: MouseEvent<T>) => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onFocus: () => void;
	onBlur: () => void;
}

export interface SpotlightState {
	x: number;
	y: number;
	opacity: number;
}

export function useSpotlight<T extends HTMLElement>(
	activeOpacity = 0.55,
): [SpotlightHandlers<T>, SpotlightState] {
	const ref = useRef<T>(null);
	const [pos, setPos] = useState<SpotlightState>({ x: 0, y: 0, opacity: 0 });
	const focusedRef = useRef(false);

	function onMouseMove(e: MouseEvent<T>) {
		if (!ref.current || focusedRef.current) return;
		const rect = ref.current.getBoundingClientRect();
		setPos((p) => ({ ...p, x: e.clientX - rect.left, y: e.clientY - rect.top }));
	}

	return [
		{
			ref,
			onMouseMove,
			onMouseEnter: () => setPos((p) => ({ ...p, opacity: activeOpacity })),
			onMouseLeave: () => setPos((p) => ({ ...p, opacity: 0 })),
			onFocus: () => {
				focusedRef.current = true;
				setPos((p) => ({ ...p, opacity: activeOpacity }));
			},
			onBlur: () => {
				focusedRef.current = false;
				setPos((p) => ({ ...p, opacity: 0 }));
			},
		},
		pos,
	];
}
