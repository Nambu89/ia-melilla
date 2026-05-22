export const empresasContent = {
	hero: {
		eyebrow: "IA APLICADA · EMPRESAS Y AUTÓNOMOS",
		headline: "IA aplicada a tu negocio.\nSin promesas vacías.",
		subheadline:
			"Software de inteligencia artificial para asesorías, despachos, pymes y autónomos. Hecho a medida, probado en producción, integrado con lo que ya usas.",
		primaryCta: { label: "Pedir reunión →", href: "/contacto?from=empresas" },
		secondaryCta: { label: "Ver demo IA Fiscal →", href: "/demos/ia-fiscal-melilla" },
	},
	problemSolutions: {
		headline: "Si esto te suena, tenemos solución.",
		cards: [
			{
				problem: "Consultas fiscales que se repiten todo el día",
				solution:
					"Asistente IA entrenado en normativa local que responde a tus clientes en segundos. Tu equipo solo interviene en lo difícil.",
			},
			{
				problem: "Renta y temporadas que desbordan al equipo",
				solution:
					"Pre-procesamiento automático de consultas. Clasificación por urgencia. Tu equipo trabaja sobre lo que aporta valor.",
			},
			{
				problem: "Software fragmentado que no se habla entre sí",
				solution:
					"Capa de IA por encima de tus herramientas existentes. Sin migrar datos. Sin romper procesos.",
			},
			{
				problem: "Demos de IA que no llegan a producción",
				solution:
					'Entregamos código funcionando, integrado y mantenible. Cero "proof of concept" eternos.',
			},
		],
	},
	demoCrosslink: {
		headline: "Mira lo que ya está funcionando.",
		body: "La demo IA Fiscal Melilla resuelve preguntas de régimen fiscal local en segundos. Si construimos eso, podemos construir lo tuyo.",
		cta: { label: "Probar demo →", href: "/demos/ia-fiscal-melilla" },
	},
	targetAudience: {
		headline: "Para quién construimos.",
		items: [
			"Asesorías y despachos fiscales",
			"Pymes con alto volumen de consultas de clientes",
			"Autónomos que necesitan automatizar tareas administrativas",
			"Startups que quieren incorporar IA sin montar equipo propio",
			"Cualquier negocio donde el tiempo de tu equipo valga más que el de un asistente IA",
		],
	},
	ctaClose: {
		headline: "Primera reunión gratis.",
		body: "Cuéntanos tu caso. Si la IA no es la respuesta, te lo decimos. Si lo es, te decimos exactamente cuánto cuesta y cuánto tarda.",
		cta: { label: "Reservar 30 minutos →", href: "/contacto?from=empresas" },
	},
} as const;
