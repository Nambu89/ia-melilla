import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PageTransitionProps {
	children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
	const location = useLocation();
	const reduced = useReducedMotion();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
	}, [location.pathname]);

	if (reduced) return <>{children}</>;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={location.pathname}
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -12 }}
				transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
