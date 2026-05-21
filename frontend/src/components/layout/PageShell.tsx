import { type ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function PageShell({ children }: { children: ReactNode }) {
	return (
		<>
			<Nav />
			<main className="min-h-screen">{children}</main>
			<Footer />
			<WhatsAppFloat />
		</>
	);
}
