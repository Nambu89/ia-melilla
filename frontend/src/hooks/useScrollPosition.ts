import { useEffect, useState } from "react";

export function useScrollPosition() {
	const [y, setY] = useState(typeof window !== "undefined" ? window.scrollY : 0);
	useEffect(() => {
		const handler = () => setY(window.scrollY);
		window.addEventListener("scroll", handler, { passive: true });
		return () => window.removeEventListener("scroll", handler);
	}, []);
	return y;
}
