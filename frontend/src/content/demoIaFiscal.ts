export const demoIaFiscalContent = {
	hero: {
		eyebrow: "DEMO 1 · IA FISCAL MELILLA",
		headline: "Pregunta lo que quieras sobre fiscalidad en Melilla.",
		subheadline:
			"Asistente IA entrenado en normativa fiscal específica de la Ciudad Autónoma de Melilla. IPSI, REF, IRPF local, deducciones aplicables, plazos, modelos. Responde con fuente.",
	},
	placeholderNote:
		"Demo en preparación. El widget funcional se conecta en Fase 2. Mientras tanto, escríbenos por WhatsApp si quieres una prueba guiada.",
	suggestedQuestions: [
		"¿Cómo tributa el IPSI un servicio facturado a un cliente peninsular?",
		"¿Qué deducciones autonómicas aplican en Melilla en la renta 2025?",
		"¿Plazo de presentación del modelo 100 en Melilla este año?",
		"Soy autónomo nuevo en Melilla — ¿qué pasos administrativos doy?",
	],
	demoFlagship: {
		eyebrow: "PROBAR EN VIVO",
		headline: "Mira cómo responde.",
		subheadline:
			"Una pregunta real con la respuesta tal cual sale de la herramienta. La cita normativa va incluida para que puedas comprobarla.",
		exchange: {
			question: "¿Tengo que pagar IPSI si vendo en Melilla a un cliente peninsular?",
			answer:
				"Si la entrega del bien o la prestación del servicio se realiza físicamente en Melilla, está sujeta a IPSI. Si el cliente recoge el producto en Melilla, IPSI. Si lo envías a península, no — la operación no se considera localizada en Melilla a efectos del impuesto.",
			source: "Ordenanza Fiscal Reguladora del IPSI, Ciudad Autónoma de Melilla, art. 4.",
		},
		cta: { label: "Abrir el chat completo →", href: "/demos/ia-fiscal-melilla/chat" },
	},
	aboutFiscal: {
		eyebrow: "POR QUÉ FISCAL MELILLA ES NUESTRA PRIMERA DEMO",
		headline: "Melilla no encaja en plantillas estándar.",
		body: [
			"Régimen fiscal propio (IPSI en lugar de IVA, REF, particularidades para autónomos y pymes locales) y una economía pegada a frontera. La gente de aquí lleva años usando software pensado para Madrid o Barcelona y adaptado a empujones.",
			"Hemos vivido las consultas que se quedan sin respuesta, los formularios que confunden y las gestorías desbordadas en campaña de renta. Por eso empezamos por aquí.",
			"La IA que construimos sirve en cualquier mercado y para cualquier vertical. Empezamos por Melilla porque es lo que conocemos mejor — el siguiente sector lo eliges tú.",
		],
		stats: [
			{ value: 60, suffix: "%", label: "Deducción IRPF", hint: "residentes Melilla" },
			{ value: 4, suffix: "%", label: "IPSI vs IVA", hint: "tipo general local" },
			{ value: 5, label: "Herramientas IA", hint: "abiertas en esta demo" },
		],
	},
} as const;
