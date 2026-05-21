export const empresasContent = {
	hero: {
		eyebrow: "IA APLICADA · EMPRESAS Y AUTONOMOS",
		headline: "IA aplicada a tu negocio.\nSin promesas vacias.",
		subheadline:
			"Software de inteligencia artificial para asesorias, despachos, pymes y autonomos. Hecho a medida, probado en produccion, integrado con lo que ya usas.",
		primaryCta: { label: "Pedir reunion →", href: "/contacto?from=empresas" },
		secondaryCta: { label: "Ver demo IA Fiscal →", href: "/demos/ia-fiscal-melilla" },
	},
	problemSolutions: {
		headline: "Si esto te suena, tenemos solucion.",
		cards: [
			{
				problem: "Consultas fiscales que se repiten todo el dia",
				solution:
					"Asistente IA entrenado en normativa local que responde a tus clientes en segundos. Tu equipo solo interviene en lo dificil.",
			},
			{
				problem: "Renta y temporadas que desbordan al equipo",
				solution:
					"Pre-procesamiento automatico de consultas. Clasificacion por urgencia. Tu staff trabaja sobre lo que aporta valor.",
			},
			{
				problem: "Software fragmentado que no se habla entre si",
				solution:
					"Capa de IA por encima de tus herramientas existentes. Sin migrar datos. Sin romper procesos.",
			},
			{
				problem: "Demos de IA que no llegan a produccion",
				solution:
					'Entregamos codigo funcionando, integrado y mantenible. Cero "proof of concept" eternos.',
			},
		],
	},
	demoCrosslink: {
		headline: "Mira lo que ya esta funcionando.",
		body: "La demo IA Fiscal Melilla resuelve preguntas de regimen fiscal local en segundos. Si construimos eso, podemos construir lo tuyo.",
		cta: { label: "Probar demo →", href: "/demos/ia-fiscal-melilla" },
	},
	targetAudience: {
		headline: "Para quien construimos.",
		items: [
			"Asesorias y despachos fiscales",
			"Pymes con alto volumen de consultas de clientes",
			"Autonomos que necesitan automatizar tareas administrativas",
			"Startups que quieren incorporar IA sin montar equipo propio",
			"Cualquier negocio donde el tiempo de tu equipo valga mas que el de un asistente IA",
		],
	},
	ctaClose: {
		headline: "Primera reunion gratis.",
		body: "Cuentanos tu caso. Si la IA no es la respuesta, te lo decimos. Si lo es, te decimos exactamente cuanto cuesta y cuanto tarda.",
		cta: { label: "Reservar 30 minutos →", href: "/contacto?from=empresas" },
	},
} as const;
