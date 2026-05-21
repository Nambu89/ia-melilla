import { Link } from "react-router-dom";
import { footerContent } from "@/content/footer";
import { business } from "@/content/shared";
import { Separator } from "@/components/ui/separator";
import { InstagramIcon, LinkedinIcon, FacebookIcon } from "./BrandIcons";

export function Footer() {
	return (
		<footer className="border-t border-outline-variant bg-surface-container-low mt-32">
			<div className="mx-auto max-w-[1200px] px-6 py-16">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-4">
					<div>
						<h2 className="text-headline-sm font-bold mb-4">{business.name}</h2>
						<p className="text-body-md text-on-surface-variant max-w-xs">
							{footerContent.tagline}
						</p>
					</div>
					{footerContent.columns.map((col) => (
						<div key={col.title}>
							<h3 className="text-label-caps text-on-surface-muted mb-4">{col.title}</h3>
							<ul className="flex flex-col gap-2">
								{col.links.map((link) => (
									<li key={link.href}>
										<Link
											to={link.href}
											className="text-body-md text-on-surface-variant hover:text-on-surface"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<Separator className="my-12" />
				<div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
					<div className="text-body-sm text-on-surface-muted">
						© {footerContent.copyrightYear} {business.name}. {business.address.street},{" "}
						{business.address.postalCode} {business.address.city}.
					</div>
					<div className="flex gap-4">
						<a href={business.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
							<InstagramIcon className="h-5 w-5 text-on-surface-variant hover:text-on-surface" />
						</a>
						<a href={business.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
							<LinkedinIcon className="h-5 w-5 text-on-surface-variant hover:text-on-surface" />
						</a>
						<a href={business.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
							<FacebookIcon className="h-5 w-5 text-on-surface-variant hover:text-on-surface" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
