import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { navContent } from "@/content/nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import MobileDrawer from "@/components/navigation/MobileDrawer";
import ThemeToggle from "@/components/ui/ThemeToggle";

export function Nav() {
	const y = useScrollPosition();
	const shrunk = y > 24;
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
					className="hidden md:flex items-center gap-1"
					aria-label="Secciones"
				>
					{navContent.links.map((link) => (
						<NavLink
							key={link.href}
							to={link.href}
							className={({ isActive }) =>
								cn(
									"px-3 py-2 text-label-lg transition-colors rounded-md",
									isActive
										? "text-on-surface"
										: "text-on-surface-variant hover:text-on-surface",
								)
							}
						>
							{link.label}
						</NavLink>
					))}
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
