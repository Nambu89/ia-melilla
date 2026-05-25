import { type ReactNode } from "react";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { ContactForm } from "@/components/contact/ContactForm";
import { contactoContent } from "@/content/contacto";
import { business } from "@/content/shared";

export default function Contacto() {
	return (
		<PageShell>
			<SeoHead
				title="Contacto — IA Melilla"
				description="Cuentanos tu caso. Respondemos el mismo dia. Email, WhatsApp y formulario directos al equipo de IA Melilla."
				path="/contacto"
			/>
			<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-6">{contactoContent.hero.eyebrow}</p>
				<h1 className="text-display-md font-bold tracking-tight max-w-3xl">
					{contactoContent.hero.headline}
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					{contactoContent.hero.subheadline}
				</p>
				<div className="mt-16 grid gap-16 md:grid-cols-[1.5fr_1fr]">
					<div>
						<ContactForm />
					</div>
					<div className="flex flex-col gap-6">
						<h2 className="text-headline-sm font-semibold tracking-tight">Tambien puedes</h2>
						<ContactChannel
							icon={<MessageCircle className="h-5 w-5" />}
							label="WhatsApp"
							value={business.phone}
							href={business.whatsappUrl}
						/>
						<ContactChannel
							icon={<Mail className="h-5 w-5" />}
							label="Email"
							value={business.email}
							href={`mailto:${business.email}`}
						/>
						<ContactChannel
							icon={<Phone className="h-5 w-5" />}
							label="Telefono"
							value={business.phone}
							href={`tel:+${business.phoneIntl}`}
						/>
						<div className="flex items-start gap-3 text-body-md text-on-surface-variant">
							<MapPin className="mt-1 h-5 w-5 text-on-surface-muted" aria-hidden="true" />
							<div>
								{business.address.city}, {business.address.country}
							</div>
						</div>
					</div>
				</div>
			</section>
		</PageShell>
	);
}

function ContactChannel({
	icon,
	label,
	value,
	href,
}: {
	icon: ReactNode;
	label: string;
	value: string;
	href: string;
}) {
	return (
		<a
			href={href}
			target={href.startsWith("http") ? "_blank" : undefined}
			rel="noreferrer"
			className="flex items-center gap-3 text-body-md text-on-surface hover:text-primary"
		>
			<span className="text-on-surface-muted">{icon}</span>
			<span>
				<span className="text-label-caps text-on-surface-muted block">{label}</span>
				<span className="block">{value}</span>
			</span>
		</a>
	);
}
