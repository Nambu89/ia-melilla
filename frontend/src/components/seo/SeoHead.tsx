import { Helmet } from "react-helmet-async";
import { business } from "@/content/shared";

interface SeoHeadProps {
	title: string;
	description: string;
	path: string;
	ogImage?: string;
}

const SITE_URL = "https://iamelilla.com";

export function SeoHead({ title, description, path, ogImage }: SeoHeadProps) {
	const canonical = `${SITE_URL}${path}`;
	const image = ogImage || `${SITE_URL}/og-default.png`;
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={canonical} />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={canonical} />
			<meta property="og:image" content={image} />
			<meta property="og:locale" content="es_ES" />
			<meta property="og:site_name" content={business.name} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />
		</Helmet>
	);
}
