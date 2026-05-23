import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { navContent } from "@/content/nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import MobileDrawer from "@/components/navigation/MobileDrawer";
import ThemeToggle from "@/components/ui/ThemeToggle";

function isLinkActive(pathname: string, href: string): boolean {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
	const y = useScrollPosition();
	const shrunk = y > 24;
	const { pathname } = useLocation();
	const reduced = useReducedMotion();

	return (
		<header
			className={cn(
				"sticky top-0 z-40 w-full border-b border-outline-variant bg-surface/90 backdrop-blur-md transition-all duration-200",
				shrunk ? "h-14" : "h-20",
			)}
			aria-label="Navegacion principal"
		>
			<div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
				<Link
					to="/"
					className="text-headline-sm font-bold text-on-surface transition-colors hover:text-primary"
				>
					{navContent.logoAlt}
				</Link>

				<nav
					className="hidden md:flex items-center"
					aria-label="Secciones"
				>
					<div className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-low p-1 shadow-sm">
						{navContent.links.map((link) => {
							const active = isLinkActive(pathname, link.href);
							return (
								<NavLink
									key={link.href}
									to={link.href}
									className={cn(
										"relative inline-flex items-center justify-center rounded-full px-4 py-1.5 text-label-md transition-colors",
										active
											? "text-on-primary"
											: "text-on-surface-variant hover:text-on-surface",
									)}
								>
									{active && (
										<motion.span
											layoutId="nav-pill-indicator"
											className="absolute inset-0 rounded-full bg-primary"
											transition={
												reduced
													? { duration: 0 }
													: { type: "spring", stiffness: 380, damping: 30 }
											}
											aria-hidden="true"
										/>
									)}
									<span className="relative z-10">{link.label}</span>
								</NavLink>
							);
						})}
					</div>
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					<Button asChild size="sm" className="hidden md:inline-flex">
						<Link to={navContent.ctaHref}>{navContent.ctaLabel}</Link>
					</Button>
					<div className="md:hidden">
						<MobileDrawer
							trigger={
								<button
									type="button"
									aria-label="Abrir menú"
									className="inline-flex h-10 w-10 items-center justify-center rounded-md text-on-surface transition-colors hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								>
									<Menu size={22} />
								</button>
							}
							links={navContent.links as unknown as { label: string; href: string }[]}
							cta={{ label: navContent.ctaLabel, href: navContent.ctaHref }}
							secondary={{
								label: "WhatsApp",
								href: "https://wa.me/34654186173?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20de%20IA%20Melilla",
								external: true,
							}}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
