export const homeContent = {
	hero: {
		eyebrow: "IA APLICADA · DESDE MELILLA",
		headline: "Inteligencia artificial que resuelve. Sin humo.",
		subheadline:
			"Construimos asistentes de IA para empresas y particulares. Empezamos por lo dificil: el regimen fiscal de Melilla. Seguimos por lo que tu necesites.",
		primaryCta: { label: "Probar IA Fiscal Melilla →", href: "/demos/ia-fiscal-melilla" },
		secondaryCta: { label: "Como trabajamos", href: "#como-trabajamos" },
	},
	audienceSplit: {
		eyebrow: "ELIGE TU CAMINO",
		headline: "Dos publicos. Una misma tecnologia.",
		cards: [
			{
				audience: "b2b" as const,
				badge: "EMPRESAS Y AUTONOMOS",
				title: "Para tu negocio",
				description:
					"Automatiza consultas repetidas, da soporte 24/7 sin renunciar a tu equipo, integra IA con el software que ya usas.",
				bullets: [
					"Asesorias fiscales que automatizan consultas IPSI y renta",
					"Atencion al cliente que no descansa",
					"Procesos administrativos sin papeleo manual",
				],
				cta: { label: "Soluciones para empresas →", href: "/empresas" },
			},
			{
				audience: "b2c" as const,
				badge: "PARTICULARES",
				title: "Para tu dia a dia",
				description:
					"Pregunta lo que necesites sobre fiscalidad o tramites. Respuesta clara, con fuentes oficiales. Sin esperar al gestor.",
				bullets: [
					"Renta, IPSI, deducciones explicadas en castellano",
					"Plazos y formularios sin jerga",
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
			"Pregunta lo que quieras sobre fiscalidad en Melilla. Responde en segundos, citando la norma. Es la primera de muchas.",
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
		headline: "Tres pasos. Sin sorpresas.",
		steps: [
			{
				number: "01",
				title: "Identificamos el problema concreto",
				body: "Te escuchamos. Entendemos tu sector, los huecos operativos, lo que ya funciona y lo que estorba. Si la IA no es la respuesta, te lo decimos.",
			},
			{
				number: "02",
				title: "Construimos la solucion a medida",
				body: "Software real. Conectado a tus sistemas. Probado en produccion antes de entregartelo. Cero demos vacios.",
			},
			{
				number: "03",
				title: "Te entregamos y formamos a tu equipo",
				body: "La solucion es tuya. Tu equipo la opera. Documentacion, formacion, soporte cuando lo necesites — pero sin dependencia.",
			},
		],
	},
	aboutMelilla: {
		eyebrow: "POR QUE EMPEZAMOS AQUI",
		headline: "Melilla no encaja en plantillas estandar.",
		body: [
			"Regimen fiscal propio (IPSI en lugar de IVA, REF, especificidades para autonomos y pymes). Una economia con fronteras y oportunidades unicas. Una poblacion que merece tecnologia hecha pensando en ella, no software adaptado a empujones.",
			"Hemos vivido aqui las consultas que se quedan sin respuesta, los formularios que confunden, las gestoras desbordadas en campaña de renta. Por eso empezamos por aqui.",
			"Pero la IA que construimos vale en cualquier mercado. Melilla es el inicio, no el limite.",
		],
	},
	ctaClose: {
		headline: "¿Hablamos?",
		subheadline:
			"Cuentanos que problema tienes. Primera reunion gratis, sin compromiso. Respondemos el mismo dia.",
		primaryCta: { label: "Pedir cita →", href: "/contacto" },
		secondaryCta: { label: "Escribenos por WhatsApp", href: "" },
	},
} as const;
