export const particularesContent = {
	hero: {
		eyebrow: "IA APLICADA · PARTICULARES",
		headline: "Tu asistente de IA personal.\nPara fiscalidad, tramites y mas.",
		subheadline:
			"Pregunta lo que necesites en castellano normal. Recibe respuesta clara, con fuentes oficiales. Sin esperar al gestor, sin pagar consulta.",
		primaryCta: { label: "Probar IA Fiscal gratis →", href: "/demos/ia-fiscal-melilla" },
		secondaryCta: { label: "Como funciona", href: "#como-funciona" },
	},
	helpfulCases: {
		headline: "Casos en los que ya te ayuda.",
		cards: [
			{
				title: "Campaña de renta",
				body: "¿Tengo que declarar X? ¿Que deducciones aplican en Melilla? ¿Como afecta este ingreso a mi renta? Respuestas claras con la norma referenciada.",
			},
			{
				title: "IPSI Melilla",
				body: "Si vendes, compras o trabajas en Melilla, IPSI te afecta de forma distinta al IVA peninsular. Te explicamos cuando se aplica, cuanto y por que.",
			},
			{
				title: "Eres autonomo nuevo",
				body: "Cuota, retenciones, modelos, plazos. Lo que se te escapa en los primeros 12 meses, resuelto sin necesidad de gestor para cada duda.",
			},
			{
				title: "Plazos, modelos, tramites",
				body: "¿Cuando vence X modelo? ¿Que casilla rellenar? ¿Que documentos necesito? Respuestas con el enlace al formulario oficial.",
			},
		],
	},
	howItWorks: {
		headline: "Tres pasos. Sin registro obligatorio.",
		steps: [
			{ title: "Entras a la demo", body: "Sin descargas. Sin registro inicial. Sin tarjeta." },
			{
				title: "Preguntas en tu idioma",
				body: "Castellano natural. No tienes que saber jerga fiscal. Si tu pregunta es ambigua, te pide aclaracion.",
			},
			{
				title: "Recibes la respuesta con fuente",
				body: "Texto claro + referencia a la norma o el formulario oficial. Si necesitas profundizar, te decimos donde.",
			},
		],
	},
	privacy: {
		headline: "Tus consultas no se guardan ni se usan para entrenar modelos.",
		body: "Las preguntas que haces a IA Fiscal Melilla no se almacenan asociadas a tu identidad ni alimentan el entrenamiento de ningun modelo. Politica completa en /politica-de-privacidad/.",
	},
	ctaClose: {
		headline: "Pruebala. Es gratis.",
		body: "Sin compromiso. Si te sirve, vuelves. Si no, has perdido 30 segundos.",
		cta: { label: "Abrir IA Fiscal Melilla →", href: "/demos/ia-fiscal-melilla" },
	},
} as const;
