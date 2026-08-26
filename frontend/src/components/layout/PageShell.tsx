import { type ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { FloatingCta } from "./FloatingCta";
import CursorBlob from "@/components/decoration/CursorBlob";
import PageTransition from "@/components/animations/PageTransition";

export function PageShell({ children }: { children: ReactNode }) {
	return (
		<>
			<CursorBlob />
			<Nav />
			<main className="min-h-screen">
				<PageTransition>{children}</PageTransition>
			</main>
			<Footer />
			<FloatingCta />
		</>
	);
}
