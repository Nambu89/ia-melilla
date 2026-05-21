export const portafolioContent = {
	hero: {
		eyebrow: "PORTAFOLIO",
		headline: "Cosas que hemos construido.",
		subheadline:
			"Imagenes, videos y enlaces a proyectos reales. La mayoria con permiso de los clientes; algunos anonimos por confidencialidad.",
	},
	placeholderNote:
		"Galeria en curacion. Mientras tanto, puedes ver evidencias en nuestro Instagram.",
	items: [] as Array<{
		title: string;
		client: string;
		tags: string[];
		mediaUrl: string;
	}>,
} as const;
