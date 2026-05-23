export const navContent = {
	logoAlt: "IA Melilla",
	links: [
		{ label: "Empresas", href: "/empresas" },
		{ label: "Particulares", href: "/particulares" },
		{ label: "Demos", href: "/demos" },
		{ label: "Blog", href: "/blog" },
		{ label: "Contacto", href: "/contacto" },
	],
	ctaLabel: "Probar IA Fiscal",
	ctaHref: "/demos/ia-fiscal-melilla",
	// Acceso clientes (suite SaaS authenticated, solo para usuarios con credencial)
	clienteLabel: "Acceso clientes",
	clienteHref: "/cliente/login",
} as const;
