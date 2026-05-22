export const homeContent = {
	hero: {
		eyebrow: "IA APLICADA · DESDE MELILLA",
		headline: "Inteligencia artificial\nque te ayuda en tu día a día.",
		subheadline:
			"Construimos asistentes de IA para empresas, autónomos y particulares. Arrancamos con lo más enredado que hay aquí: el régimen fiscal de Melilla. Y de ahí, lo que necesites.",
		primaryCta: { label: "Probar IA Fiscal Melilla →", href: "/demos/ia-fiscal-melilla" },
		secondaryCta: { label: "Cómo trabajamos", href: "#como-trabajamos" },
	},
	audienceSplit: {
		eyebrow: "ELIGE TU CAMINO",
		headline: "Tienes negocio. O eres particular. Vamos contigo en los dos sitios.",
		cards: [
			{
				audience: "b2b" as const,
				badge: "EMPRESAS Y AUTÓNOMOS",
				title: "Para tu negocio",
				description:
					"Automatizamos lo que tu equipo ya hace en bucle, te montamos atención fuera de horario y conectamos la IA con el software que llevas usando.",
				bullets: [
					"Asesorías fiscales que se encargan de consultas de IPSI y renta",
					"Atención al cliente que no se va de fin de semana",
					"Procesos administrativos que se hacen solos",
				],
				cta: { label: "Soluciones para empresas →", href: "/empresas" },
			},
			{
				audience: "b2c" as const,
				badge: "PARTICULARES",
				title: "Para tu día a día",
				description:
					"Pregunta sobre impuestos o trámites cuando lo necesites. Te respondemos claro, citando la norma, sin tener que pillar cita con el gestor.",
				bullets: [
					"Renta, IPSI y deducciones explicadas en castellano normal",
					"Plazos y formularios sin jerga rara",
					"Respuestas en segundos, no en días",
				],
				cta: { label: "Soluciones para particulares →", href: "/particulares" },
			},
		],
	},
	demoFlagship: {
		eyebrow: "DEMO 1 · DISPONIBLE",
		headline: "IA Fiscal Melilla",
		subheadline:
			"Pregúntale lo que quieras sobre fiscalidad de Melilla. Responde en segundos y te cita la norma. Es la primera demo, vienen más.",
		exchange: {
			question: "¿Tengo que pagar IPSI si vendo en Melilla a un cliente peninsular?",
			answer:
				"Si la entrega del bien o la prestación del servicio se realiza físicamente en Melilla, está sujeta a IPSI. Si el cliente recoge el producto en Melilla, IPSI. Si lo envías a península, no — la operación no se considera localizada en Melilla a efectos del impuesto.",
			source: "Ordenanza Fiscal Reguladora del IPSI, Ciudad Autónoma de Melilla, art. 4.",
		},
		cta: { label: "Probar la demo completa →", href: "/demos/ia-fiscal-melilla" },
	},
	processSteps: {
		eyebrow: "PROCESO",
		headline: "Cómo trabajamos.",
		steps: [
			{
				number: "01",
				title: "Identificamos el problema concreto",
				body: "Te escuchamos. Entendemos tu sector, los huecos operativos, lo que ya funciona y lo que estorba. Si la IA no es la respuesta, te lo decimos.",
			},
			{
				number: "02",
				title: "Construimos la solución a medida",
				body: "Software real, conectado a tus sistemas, probado en producción antes de entregártelo. Nada de demos vacías.",
			},
			{
				number: "03",
				title: "Te entregamos y formamos a tu equipo",
				body: "La solución es tuya, tu equipo la opera. Te dejamos documentación, formación y soporte si lo necesitas, pero sin atarte a nosotros.",
			},
		],
	},
	aboutMelilla: {
		eyebrow: "POR QUÉ EMPEZAMOS AQUÍ",
		headline: "Melilla no encaja en plantillas estándar.",
		body: [
			"Régimen fiscal propio (IPSI en lugar de IVA, REF, particularidades para autónomos y pymes locales) y una economía pegada a frontera. La gente de aquí lleva años usando software pensado para Madrid o Barcelona y adaptado a empujones.",
			"Hemos vivido aquí las consultas que se quedan sin respuesta, los formularios que confunden y las gestorías desbordadas en campaña de renta. Por eso empezamos por aquí.",
			"La IA que construimos sirve en cualquier mercado. Empezamos aquí porque es lo que conocemos.",
		],
	},
	ctaClose: {
		headline: "¿Hablamos?",
		subheadline:
			"Cuéntanos qué problema tienes. Primera reunión sin coste, sin compromiso. Solemos contestar el mismo día.",
		primaryCta: { label: "Pedir cita →", href: "/contacto" },
		secondaryCta: { label: "Escríbenos por WhatsApp", href: "" },
	},
} as const;
