import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/Accordion";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

const FAQ_ITEMS = [
	{
		q: "¿Qué tipo de soluciones IA construís?",
		a: "Chatbots y asistentes conversacionales, agentes IA especializados por sector, automatizaciones de procesos (CRM, ERP, email, hojas), generación de contenido visual con modelos virtuales, integraciones con WhatsApp Business y herramientas a medida. Si lo puede hacer una IA hoy, lo montamos.",
	},
	{
		q: "¿Cuánto cuesta un proyecto?",
		a: "Depende del alcance. Suscripciones a herramientas listas (como IA Fiscal Melilla) arrancan en 199€/mes. Proyectos a medida los cotizamos por hitos después de una primera reunión sin coste. Sin tarifas opacas: el presupuesto lo sabes antes de firmar.",
	},
	{
		q: "¿Cuánto se tarda en montar algo a medida?",
		a: "Un asistente sencillo (FAQ, atención básica, integración WhatsApp) sale en 2 o 3 semanas. Cuando hay integraciones con CRM, ERP o sistemas internos, calcula entre 1 y 3 meses. Te damos calendario realista cuando hablamos.",
	},
	{
		q: "¿Puedo probar antes de pagar?",
		a: "Sí, justo por eso montamos el showroom de demos. Pruebas el producto real (empezando por IA Fiscal Melilla y los que vamos sumando) antes de firmar ningún papel.",
	},
	{
		q: "¿Trabajáis solo en Melilla?",
		a: "No. Nuestra base está aquí pero damos servicio a empresas en toda España y norte de África. Trabajamos en remoto con reuniones presenciales puntuales cuando aporta valor.",
	},
	{
		q: "¿Qué modelos de IA utilizáis?",
		a: "Mezclamos proveedores según el caso: OpenAI y Anthropic para conversación y razonamiento, modelos abiertos cuando los datos no pueden salir de tu infraestructura. Lo elegimos por resultado, no por marca.",
	},
	{
		q: "¿Qué pasa con mis datos y los de mis clientes?",
		a: "Cumplimos RGPD estrictamente. Firmamos contrato de encargo del tratamiento (art. 28 RGPD) para soluciones que tocan datos personales. Si necesitas que nada salga a la nube de un tercero, montamos modelos on-premise o en infraestructura europea. Más detalles en nuestra Política de Privacidad y la página de Transparencia en IA.",
	},
	{
		q: "¿Y si la IA se equivoca?",
		a: "Toda solución que entregamos lleva mecanismos de control: citación de fuentes, intervención humana cuando hace falta, logs auditables. Las respuestas son orientativas y nunca sustituyen al profesional en decisiones críticas. Si pillas algo mal, lo arreglamos.",
	},
	{
		q: "¿Os ocupáis del mantenimiento después de entregar?",
		a: "Sí, con un plan de mantenimiento mensual. La IA cambia rápido: modelos nuevos, mejores prompts, normativa que se actualiza. Mantenemos la solución viva. Si prefieres opciones de auto-gestión, te dejamos la documentación y formación para que tu equipo se encargue.",
	},
];

export function FAQ() {
	return (
		<section className="mx-auto max-w-[1200px] px-6 py-24">
			<RevealOnScroll>
				<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
					PREGUNTAS FRECUENTES
				</p>
				<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl text-on-surface">
					Lo que más nos preguntáis antes de dar el paso.
				</h2>
			</RevealOnScroll>
			<RevealOnScroll delay={0.1}>
				<div className="mt-12 max-w-3xl">
					<Accordion type="single" collapsible className="w-full">
						{FAQ_ITEMS.map((item, i) => (
							<AccordionItem key={i} value={`item-${i}`}>
								<AccordionTrigger>{item.q}</AccordionTrigger>
								<AccordionContent>{item.a}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</RevealOnScroll>
		</section>
	);
}
