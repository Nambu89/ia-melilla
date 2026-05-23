import type { BlogPost } from "./types";
import { parseFrontmatter } from "./parseFrontmatter";
import { parseMarkdownBody } from "./parseMarkdown";

export const blogPosts: readonly BlogPost[] = [
	{
		slug: "automatizacion-ia-melilla",
		title:
			"Automatización IA Melilla: cómo implementar la IA en tu pyme en 6 pasos sin complicaciones",
		description:
			"La Automatización IA Melilla ya no es cosa de grandes corporaciones: cada vez más pymes melillenses la aplican para ahorrar tiempo, reducir errores y mejorar la atención al cliente.",
		publishedAt: "2025-09-16",
		readingMinutes: 9,
		tags: ["Automatización", "Pymes", "Implementación"],
		cover: {
			alt: "Automatización IA Melilla aplicada a una pyme local",
			placeholder: "automation",
		},
		blocks: [
			{
				type: "intro",
				text: "La **Automatización IA Melilla** ya no es cosa de grandes corporaciones: cada vez más pymes melillenses la aplican para ahorrar tiempo, reducir errores y mejorar la atención al cliente.",
			},
			{ type: "h2", text: "Automación con IA: qué es y por qué te interesa" },
			{
				type: "paragraph",
				text: "La automatización con IA combina **reglas** (si ocurre A, haz B) con **modelos inteligentes** capaces de entender texto, clasificar solicitudes o extraer datos. ¿El resultado? Procesos más rápidos y consistentes, menos errores manuales y mejor experiencia de cliente.",
			},
			{
				type: "paragraph",
				text: "Para una pyme en Melilla, esto puede traducirse en: confirmaciones de reserva automáticas, respuestas a preguntas frecuentes 24/7, actualización de stock al cerrar un pedido, o un resumen diario de lo más importante en tu bandeja de entrada.",
			},
			{
				type: "image",
				alt: "Automatización IA Melilla en restaurante local con dueño usando tablet para pedidos inteligentes",
				placeholder: "restaurant",
			},
			{ type: "h2", text: "Aplicaciones prácticas de la IA en Melilla" },
			{
				type: "ulist",
				items: [
					"**Chatbots personalizados:** muy útiles para clínicas, tiendas, peluquerías y restaurantes que quieren automatizar su atención al cliente sin perder el trato personalizado.",
					"**Sistemas automáticos de reservas:** perfectos para ahorrar tiempo, evitar errores en las citas y permitir que el cliente reserve online las 24 horas.",
					"**Generación de contenidos para redes sociales:** crear publicaciones atractivas para Instagram, Facebook o TikTok nunca fue tan fácil.",
					"**Diseño gráfico por IA:** desde logotipos hasta banners promocionales, la inteligencia artificial acelera el diseño profesional sin necesidad de contratar a un diseñador.",
				],
			},
			{ type: "h2", text: "Automatización IA Melilla: ventajas clave para pymes" },
			{
				type: "ulist",
				items: [
					"**Ahorro real de tiempo:** menos tareas repetitivas; más foco en ventas y servicio.",
					"**Menos errores:** la IA trabaja con procedimientos claros y reduce olvidos.",
					"**Atención 24/7:** respuestas inmediatas en web, WhatsApp o email.",
					"**Escalabilidad:** puedes atender más sin aumentar costes fijos.",
					"**Datos útiles:** medir lo que ocurre y mejorar decisiones con información.",
				],
			},
			{ type: "h2", text: "Ejemplo local (caso inspirador)" },
			{
				type: "paragraph",
				text: "Un restaurante de barrio con alto volumen de mensajes integró un **asistente virtual** conectado a su formulario de pedidos:",
			},
			{
				type: "olist",
				items: [
					"El cliente escribe su pedido por la web o WhatsApp.",
					"La IA confirma disponibilidad y hora estimada.",
					"El sistema descuenta ingredientes del inventario y genera el ticket.",
					"El gerente recibe un **resumen diario** con ventas, roturas de stock y preguntas frecuentes.",
				],
			},
			{
				type: "paragraph",
				text: "Resultado: **ahorro de 2–3 horas diarias**, menos errores de transcripción y clientes informados en segundos.",
			},
			{
				type: "quote",
				text: "Tip: este mismo patrón se adapta a peluquerías (citas), talleres (revisiones), academias (matrículas) o comercios (consultas de stock).",
			},
			{ type: "h2", text: "Guía paso a paso (empieza pequeño)" },
			{ type: "h3", text: "Paso 1. Definir el proceso objetivo" },
			{
				type: "paragraph",
				text: "Elige una tarea repetitiva (ej.: responder presupuestos o confirmar citas). Escribe el resultado esperado y el tiempo que quieres ahorrar.",
			},
			{ type: "h3", text: "Paso 2. Mapear entradas y salidas" },
			{
				type: "paragraph",
				text: "¿Desde dónde llega la info (web, email, WhatsApp)? ¿A dónde debe ir (hoja de datos, CRM, correo de confirmación)?",
			},
			{ type: "h3", text: "Paso 3. Crear plantillas" },
			{
				type: "paragraph",
				text: "Redacta respuestas con variables: nombre, fecha, producto, precio. **Automatización IA Melilla** funciona mejor con plantillas claras.",
			},
			{ type: "h3", text: "Paso 4. Conectar" },
			{
				type: "paragraph",
				text: "Enlaza formularios o bandejas de entrada con tu hoja maestra/CRM para no teclear dos veces. Mantén un repositorio único de datos.",
			},
			{ type: "h3", text: "Paso 5. Pilotar 7–14 días" },
			{
				type: "paragraph",
				text: "Mide tiempo ahorrado, errores y satisfacción del cliente. Ajusta plantillas y reglas según los casos raros.",
			},
			{ type: "h3", text: "Paso 6. Escalar y documentar" },
			{
				type: "paragraph",
				text: "Añade un segundo proceso y deja un mini manual (qué hace la IA, excepciones y contacto de soporte interno).",
			},
			{ type: "h2", text: "Automatización IA Melilla paso a paso (método sencillo)" },
			{ type: "h3", text: "Paso 1. Identifica tareas repetitivas" },
			{
				type: "paragraph",
				text: "Haz una lista de procesos que te roban tiempo (responder emails, pasar pedidos a Excel, recordar cobros, confirmar citas). Ordénalos por impacto y facilidad.",
			},
			{ type: "h3", text: "Paso 2. Define el “gatillo” y el resultado" },
			{
				type: "paragraph",
				text: "Ej.: “Cuando llegue un email con ‘presupuesto’ en el asunto ➜ crear borrador de respuesta + mover a carpeta ‘A cotizar’”.",
			},
			{ type: "h3", text: "Paso 3. Prepara las plantillas" },
			{
				type: "paragraph",
				text: "Crea respuestas base (presupuesto, confirmación de cita, pedido listo) con variables: nombre, fecha, producto, precio. Ganarás coherencia y rapidez.",
			},
			{ type: "h3", text: "Paso 4. Conecta canales" },
			{
				type: "paragraph",
				text: "Integra formulario web/WhatsApp/email con tu hoja de cálculo o herramienta de gestión para que los datos fluyan sin teclear dos veces.",
			},
			{ type: "h3", text: "Paso 5. Arranca en pequeño y mide" },
			{
				type: "paragraph",
				text: "Prueba con **un único proceso** durante 7–14 días. Mide tiempo ahorrado, % de errores y satisfacción del cliente.",
			},
			{ type: "h3", text: "Paso 6. Escala y documenta" },
			{
				type: "paragraph",
				text: "Cuando funcione, añade otros procesos y escribe un mini manual interno (quién hace qué, excepciones, KPIs).",
			},
			{
				type: "paragraph",
				text: "De hecho, organismos internacionales como la [OCDE](https://www.oecd.org/en/topics/digital.html) destacan cómo la digitalización ayuda a las pymes a ser más competitivas y eficientes.",
			},
			{ type: "h2", text: "Checklist de implementación (cópiame y úsame)" },
			{
				type: "ulist",
				items: [
					"Proceso elegido y objetivo claro (por ejemplo: “ahorrar 5 h/semana en emails”)",
					"Plantillas redactadas con variables (nombre, fecha, producto, precio)",
					"Conexión entre la entrada (web/WhatsApp/email) y tu sistema de datos (hoja, CRM)",
					"Reglas definidas (si pasa A, haz B) y manejo de excepciones",
					"Prueba piloto de 7–14 días con métricas (tiempo, errores, satisfacción)",
					"Revisión y mejora de plantillas, tiempos y excepciones",
					"Formación al equipo en 30 minutos (qué hacer y plan B si algo falla)",
				],
			},
			{ type: "h2", text: "Errores comunes y cómo evitarlos" },
			{
				type: "ulist",
				items: [
					"**Querer automatizarlo todo a la vez:** empieza por 1–2 procesos de alto impacto.",
					"**No medir resultados:** fija objetivos (tiempo, errores, NPS) y revísalos.",
					"**Plantillas demasiado genéricas:** personaliza con variables (nombre, historial del cliente).",
					"**Falta de plan B:** define qué hacer si la IA no entiende un caso (derivar a una persona).",
				],
			},
			{ type: "h2", text: "Métricas para demostrar el ROI" },
			{
				type: "ulist",
				items: [
					"**Tiempo ahorrado/semana** por persona.",
					"**Tasa de respuesta en < 2 minutos** (antes vs. después).",
					"**Errores de inventario o cita** (reducción %).",
					"**Conversión** (solicitudes ➜ ventas/reservas).",
					"**Satisfacción** (reseñas, NPS, emojis/feedback en chats).",
				],
			},
			{ type: "h2", text: "¿Qué procesos priorizar en una pyme?" },
			{
				type: "ulist",
				items: [
					"**Atención al cliente:** respuestas a FAQs, confirmaciones, recordatorios.",
					"**Ventas y marketing:** lead scoring básico, emails de seguimiento, carritos abandonados.",
					"**Operaciones:** actualización de inventario tras cada pedido, avisos de rotura de stock.",
					"**Administración:** extracción de datos de facturas, conciliaciones sencillas, alertas de cobro.",
				],
			},
			{ type: "h2", text: "Integración con tu web y herramientas actuales" },
			{
				type: "paragraph",
				text: "No necesitas cambiarlo todo. La clave es **conectar** lo que ya usas: tu WordPress, tu WhatsApp Business, tu hoja de cálculo, tu CRM o tu software de facturación. Así, los datos pasan de un paso a otro sin duplicados.",
			},
			{
				type: "paragraph",
				text: "Suele bastar con: formularios bien configurados, bandejas de entrada ordenadas, una hoja maestra de datos y reglas claras.",
			},
			{ type: "h2", text: "Seguridad y privacidad sin dolores de cabeza" },
			{
				type: "ulist",
				items: [
					"**Mínimos datos necesarios:** pide lo justo para el servicio.",
					"**Roles y permisos:** quién ve qué.",
					"**Registros de actividad:** para auditar si algo falla.",
					"**Copia de seguridad:** programada y probada.",
				],
			},
			{ type: "h2", text: "Conclusión final" },
			{
				type: "paragraph",
				text: "La **Automatización IA Melilla** no es cosa del futuro: ya está al alcance de cualquier pyme que quiera trabajar de forma más eficiente. El primer paso es pequeño, pero el impacto puede ser enorme.",
			},
			{
				type: "paragraph",
				text: "La **Automatización IA Melilla** se ha convertido en un recurso clave para quienes buscan competir con mayor eficiencia, ofreciendo a las empresas locales la posibilidad de crecer sin complicaciones técnicas y con resultados medibles desde el primer momento.",
			},
		],
	},
	{
		slug: "la-inteligencia-artificial-en-melilla",
		title: "La inteligencia artificial en Melilla",
		description:
			"La inteligencia artificial en Melilla ya no es un concepto futurista reservado para grandes empresas tecnológicas. Guía práctica para pymes y autónomos locales.",
		publishedAt: "2025-06-10",
		readingMinutes: 6,
		tags: ["Inteligencia Artificial", "Melilla", "Pymes"],
		cover: {
			alt: cover.alt ?? "",
			src: cover.src,
			placeholder: cover.placeholder,
		},
		blocks: parseMarkdownBody(body),
	};
}

export const blogPosts: readonly BlogPost[] = Object.entries(rawFiles)
	.map(([path, raw]) => buildPost(path, raw))
	.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}
