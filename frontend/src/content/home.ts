export const homeContent = {
	hero: {
		eyebrow: "SOLUCIONES IA · DESDE MELILLA",
		headline: "Inteligencia Artificial\nMelilla",
		tagline: "Soluciones IA reales para empresas, autónomos y particulares.",
		subheadline:
			"Diseñamos, construimos y mantenemos soluciones de IA: chatbots, asistentes WhatsApp, agentes verticales, contenido visual, automatizaciones e integraciones a medida.",
		primaryCta: { label: "Cuéntanos tu caso →", href: "/contacto" },
		secondaryCta: { label: "Ver demos en vivo", href: "/demos" },
	},
	seoBlock: {
		eyebrow: "INTELIGENCIA ARTIFICIAL EN MELILLA",
		headline:
			"En Melilla, aplicar soluciones de inteligencia artificial Melilla nunca había sido tan fácil y accesible.",
		paragraphs: [
			"En Melilla, cada vez más negocios están apostando por la inteligencia artificial como una herramienta clave para mejorar sus procesos. Desde la automatización de tareas repetitivas hasta el análisis avanzado de datos, la inteligencia artificial Melilla está marcando un antes y un después para autónomos y pequeñas empresas.",
			"A través de soluciones prácticas y adaptadas, iamelilla.com pone al alcance de todos los beneficios de la tecnología inteligente sin necesidad de conocimientos técnicos. Tanto si gestionas una tienda local como si ofreces servicios profesionales, puedes integrar sistemas de IA que te ayuden a ahorrar tiempo y aumentar la productividad.",
			"Nuestro enfoque de inteligencia artificial en Melilla combina accesibilidad, simplicidad y eficiencia. Apostamos por ofrecer herramientas útiles que realmente aporten valor a negocios y particulares.",
			"Si estás en busca de innovación, es el momento de considerar la inteligencia artificial Melilla como parte de tu estrategia. Automatiza, optimiza y evoluciona con nosotros.",
		],
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
					"Automatizamos tareas repetidas, te montamos atención fuera de horario y conectamos la IA con el software que ya usas (CRM, ERP, WhatsApp, email).",
				bullets: [
					"Chatbots y asistentes que atienden a tus clientes 24/7",
					"Agentes IA verticales adaptados a tu sector y procesos",
					"Automatizaciones que liberan horas de papeleo cada semana",
				],
				cta: { label: "Soluciones para empresas →", href: "/empresas" },
			},
			{
				audience: "b2c" as const,
				badge: "PARTICULARES",
				title: "Para tu día a día",
				description:
					"Te montamos asistentes IA que responden a tus dudas con datos y normativa actualizada. Tutor IA para opositores, asistente fiscal, generadores de contenido y más.",
				bullets: [
					"Tutor IA personalizado para oposiciones (Guardia Civil, Bomberos, Policía…)",
					"Asistentes fiscales y trámites explicados sin jerga",
					"Respuestas claras y rápidas, con la fuente delante",
				],
				cta: { label: "Soluciones para particulares →", href: "/particulares" },
			},
		],
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
	demosShowcase: {
		eyebrow: "DEMOS EN VIVO",
		headline: "Pruébalas antes de contratar.",
		subheadline:
			"Nuestras soluciones se pueden tocar. Vamos publicando demos funcionando para que veas cómo se siente trabajar con IA bien hecha, sin presentaciones de PowerPoint.",
		cta: { label: "Ver catálogo completo →", href: "/demos" },
		items: [
			{
				slug: "ia-fiscal-melilla",
				title: "IA Fiscal Melilla",
				description:
					"Asistente especializado en el régimen fiscal de Melilla. Chat + calculadoras + wizard + clasificador OCR de facturas.",
				badge: "DISPONIBLE",
				status: "live" as const,
				href: "/demos/ia-fiscal-melilla",
			},
			{
				slug: "asistente-whatsapp",
				title: "Asistente WhatsApp 24/7",
				description:
					"Bot conversacional que atiende, califica leads y reserva citas dentro de WhatsApp Business. Demo abierta próximamente.",
				badge: "PRÓXIMAMENTE",
				status: "coming-soon" as const,
				href: "/demos",
			},
			{
				slug: "tutor-opositor",
				title: "Tutor IA Opositor",
				description:
					"Profesor personal IA entrenado en temarios reales (Guardia Civil, Policía, Bomberos…). Tests adaptativos y simulacros.",
				badge: "PRÓXIMAMENTE",
				status: "coming-soon" as const,
				href: "/demos",
			},
			{
				slug: "contenido-visual",
				title: "Catálogo IA con modelos virtuales",
				description:
					"Generación de fotos producto con modelos virtuales coherentes para e-commerce y redes sociales.",
				badge: "PRÓXIMAMENTE",
				status: "coming-soon" as const,
				href: "/demos",
			},
		],
	},
	aboutCompany: {
		eyebrow: "QUIÉNES SOMOS",
		headline: "Un equipo de IA con base en Melilla y mirada global.",
		body: [
			"IA Melilla nace para acercar la inteligencia artificial a empresas y particulares que necesitan resultados, no presentaciones. Trabajamos con tecnologías punteras (GPT-4o, Claude, modelos abiertos) y las traducimos a soluciones concretas que funcionan en producción.",
			"Nuestra base está en Melilla pero damos servicio a clientes en toda España y norte de África. Construimos software, no diapositivas: cada solución se entrega en marcha, con tu equipo formado y la documentación al día.",
			"Si la IA no es la respuesta a tu problema, te lo diremos. Solo proponemos lo que sabemos que va a funcionar.",
		],
		stats: [
			{ value: 6, suffix: "+", label: "Servicios disponibles", hint: "chatbots, agentes, automatización…" },
			{ value: 6, suffix: "+", label: "Sectores cubiertos", hint: "salud, e-commerce, academias…" },
			{ value: 5, label: "Demos públicas", hint: "abiertas en /demos" },
			{ value: 24, suffix: "h", label: "Tiempo respuesta", hint: "primera reunión gratis" },
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
