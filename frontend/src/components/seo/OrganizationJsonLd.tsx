import { Helmet } from "react-helmet-async";
import { business } from "@/content/shared";

export function OrganizationJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": "https://iamelilla.com/#organization",
				name: business.name,
				url: "https://iamelilla.com",
				email: business.email,
				telephone: business.phone,
				sameAs: [business.instagram, business.linkedin, business.facebook],
				address: {
					"@type": "PostalAddress",
					streetAddress: business.address.street,
					postalCode: business.address.postalCode,
					addressLocality: business.address.city,
					addressCountry: business.address.country,
				},
				description:
					"IA Melilla construye soluciones de inteligencia artificial para empresas, autonomos y particulares.",
			},
			{
				"@type": "WebSite",
				"@id": "https://iamelilla.com/#website",
				url: "https://iamelilla.com",
				name: business.name,
				inLanguage: "es",
			},
			{
				"@type": "Place",
				"@id": "https://iamelilla.com/#place",
				address: {
					"@type": "PostalAddress",
					streetAddress: business.address.street,
					postalCode: business.address.postalCode,
					addressLocality: business.address.city,
					addressRegion: business.address.city,
					addressCountry: business.address.country,
				},
			},
		],
	};
	return (
		<Helmet>
			<script type="application/ld+json">{JSON.stringify(data)}</script>
		</Helmet>
	);
}
