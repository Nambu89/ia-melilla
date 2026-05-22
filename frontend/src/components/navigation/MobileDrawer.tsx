import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MobileDrawerLink {
	label: string;
	href: string;
}

interface MobileDrawerProps {
	trigger: ReactNode;
	links: MobileDrawerLink[];
	cta?: { label: string; href: string };
	secondary?: { label: string; href: string; external?: boolean };
}

export default function MobileDrawer({
	trigger,
	links,
	cta,
	secondary,
}: MobileDrawerProps) {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay
					className={cn(
						"fixed inset-0 z-40 bg-black/80 backdrop-blur-sm",
						"data-[state=open]:animate-fade-in",
					)}
				/>
				<Dialog.Content
					className={cn(
						"fixed inset-0 z-50 flex flex-col bg-surface p-6",
						"data-[state=open]:animate-slide-in-top",
					)}
				>
					<Dialog.Title className="sr-only">Menú principal</Dialog.Title>
					<Dialog.Description className="sr-only">
						Navegación del sitio IA Melilla
					</Dialog.Description>
					<div className="flex items-center justify-between">
						<span className="text-headline-sm font-bold text-on-surface">
							IA Melilla
						</span>
						<Dialog.Close
							aria-label="Cerrar menú"
							className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<X size={24} />
						</Dialog.Close>
					</div>
					<nav className="mt-12 flex flex-1 flex-col gap-2">
						{links.map((link) => (
							<Dialog.Close key={link.href} asChild>
								<Link
									to={link.href}
									className="block py-3 text-display-md tracking-tight text-on-surface transition-colors hover:text-primary"
								>
									{link.label}
								</Link>
							</Dialog.Close>
						))}
					</nav>
					<div className="mt-auto flex flex-col gap-3 border-t border-outline-variant pt-6">
						{cta && (
							<Dialog.Close asChild>
								<Link
									to={cta.href}
									className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
								>
									{cta.label}
								</Link>
							</Dialog.Close>
						)}
						{secondary &&
							(secondary.external ? (
								<a
									href={secondary.href}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex h-12 items-center justify-center rounded-xl border border-outline-strong px-6 font-semibold text-on-surface transition-colors hover:bg-surface-container"
								>
									{secondary.label}
								</a>
							) : (
								<Dialog.Close asChild>
									<Link
										to={secondary.href}
										className="inline-flex h-12 items-center justify-center rounded-xl border border-outline-strong px-6 font-semibold text-on-surface transition-colors hover:bg-surface-container"
									>
										{secondary.label}
									</Link>
								</Dialog.Close>
							))}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
