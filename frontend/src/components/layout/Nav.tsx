import { Link, NavLink } from "react-router-dom";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { navContent } from "@/content/nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Nav() {
	const y = useScrollPosition();
	const shrunk = y > 24;
	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/90 backdrop-blur-md transition-all duration-200",
				shrunk ? "h-14" : "h-20",
			)}
			aria-label="Navegacion principal"
		>
			<div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
				<Link to="/" className="text-headline-sm font-bold text-on-surface">
					{navContent.logoAlt}
				</Link>
				<nav className="hidden md:flex items-center gap-1" aria-label="Secciones">
					{navContent.links.map((link) => (
						<NavLink
							key={link.href}
							to={link.href}
							className={({ isActive }) =>
								cn(
									"px-3 py-2 text-label-lg transition-colors",
									isActive ? "text-on-surface" : "text-on-surface-variant hover:text-on-surface",
								)
							}
						>
							{link.label}
						</NavLink>
					))}
				</nav>
				<Button asChild size="sm">
					<Link to={navContent.ctaHref}>{navContent.ctaLabel}</Link>
				</Button>
			</div>
		</header>
	);
}
