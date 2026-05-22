export const homeContent = {
	hero: {
		eyebrow: "IA APLICADA · DESDE MELILLA",
		headline: "Inteligencia artificial\nque te ayuda en tu día a día.",
		subheadline:
			"Construimos asistentes de IA para empresas, autonomos y particulares. Arrancamos con lo mas enredado que hay aqui: el regimen fiscal de Melilla. Y de ahi, lo que necesites.",
		primaryCta: { label: "Probar IA Fiscal Melilla →", href: "/demos/ia-fiscal-melilla" },
		secondaryCta: { label: "Como trabajamos", href: "#como-trabajamos" },
	},
	audienceSplit: {
		eyebrow: "ELIGE TU CAMINO",
		headline: "Tienes negocio. O eres particular. Vamos contigo en los dos sitios.",
		cards: [
			{
				audience: "b2b" as const,
				badge: "EMPRESAS Y AUTONOMOS",
				title: "Para tu negocio",
				description:
					"Automatizamos lo que tu equipo ya hace en bucle, te montamos atencion fuera de horario y conectamos la IA con el software que llevas usando.",
				bullets: [
					"Asesorias fiscales que se encargan de consultas IPSI y renta",
					"Atencion al cliente que no se va de fin de semana",
					"Procesos administrativos que se hacen solos",
				],
				cta: { label: "Soluciones para empresas →", href: "/empresas" },
			},
			{
				audience: "b2c" as const,
				badge: "PARTICULARES",
				title: "Para tu dia a dia",
				description:
					"Pregunta sobre impuestos o tramites cuando lo necesites. Te respondemos claro, citando la norma, sin pillar cita con el gestor.",
				bullets: [
					"Renta, IPSI, deducciones explicadas en castellano normal",
					"Plazos y formularios sin jerga raruna",
					"Respuestas en segundos, no en dias",
				],
				cta: { label: "Soluciones para particulares →", href: "/particulares" },
			},
		],
	},
	demoFlagship: {
		eyebrow: "DEMO 1 · DISPONIBLE",
		headline: "IA Fiscal Melilla",
		subheadline:
			"Preguntale lo que quieras sobre fiscalidad de Melilla. Responde en segundos y te cita la norma. Es la primera demo, vienen mas.",
		exchange: {
			question: "¿Tengo que pagar IPSI si vendo en Melilla a un cliente peninsular?",
			answer:
				"Si la entrega del bien o la prestacion del servicio se realiza fisicamente en Melilla, esta sujeta a IPSI. Si el cliente recoge el producto en Melilla, IPSI. Si lo envias a peninsula, no — la operacion no se considera localizada en Melilla a efectos del impuesto.",
			source: "Ordenanza Fiscal Reguladora del IPSI, Ciudad Autonoma de Melilla, art. 4.",
		},
		cta: { label: "Probar la demo completa →", href: "/demos/ia-fiscal-melilla" },
	},
	processSteps: {
		eyebrow: "PROCESO",
		headline: "Como trabajamos.",
		steps: [
			{
				number: "01",
				title: "Identificamos el problema concreto",
				body: "Te escuchamos. Entendemos tu sector, los huecos operativos, lo que ya funciona y lo que estorba. Si la IA no es la respuesta, te lo decimos.",
			},
			{
				number: "02",
				title: "Construimos la solucion a medida",
				body: "Software real, conectado a tus sistemas, probado en produccion antes de entregartelo. Nada de demos vacios.",
			},
			{
				number: "03",
				title: "Te entregamos y formamos a tu equipo",
				body: "La solucion es tuya, tu equipo la opera. Te dejamos documentacion, formacion y soporte si lo necesitas, pero sin atarte a nosotros.",
			},
		],
	},
	aboutMelilla: {
		eyebrow: "POR QUE EMPEZAMOS AQUI",
		headline: "Melilla no encaja en plantillas estandar.",
		body: [
			"Regimen fiscal propio (IPSI en lugar de IVA, REF, particularidades para autonomos y pymes locales) y una economia pegada a frontera. La gente de aqui lleva años usando software pensado para Madrid o Barcelona y adaptado a empujones.",
			"Hemos vivido aqui las consultas que se quedan sin respuesta, los formularios que confunden, las gestoras desbordadas en campaña de renta. Por eso empezamos por aqui.",
			"La IA que construimos sirve en cualquier mercado. Empezamos aqui porque es lo que conocemos.",
		],
	},
	ctaClose: {
		headline: "¿Hablamos?",
		subheadline:
			"Cuentanos que problema tienes. Primera reunion sin coste, sin compromiso. Solemos contestar el mismo dia.",
		primaryCta: { label: "Pedir cita →", href: "/contacto" },
		secondaryCta: { label: "Escribenos por WhatsApp", href: "" },
	},
} as const;
