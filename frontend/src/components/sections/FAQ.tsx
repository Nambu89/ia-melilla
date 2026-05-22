import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/Accordion";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

const FAQ_ITEMS = [
	{
		q: "¿Cuánto cuesta?",
		a: "Depende del alcance. Una suscripción a IA Fiscal arranca en 199€/mes. Si te montamos algo a medida (chatbot, automatización, integraciones con tu CRM o ERP), lo cotizamos por proyecto después de una primera reunión sin coste.",
	},
	{
		q: "¿Qué pasa con los datos cuando uso el chat?",
		a: "Las conversaciones se procesan para darte la respuesta y se borran cada cierto tiempo. No guardamos nada que te identifique salvo que tú nos escribas por contacto. Cumplimos RGPD. Lo tienes en la Política de privacidad.",
	},
	{
		q: "¿Me sirve si no tengo gestor?",
		a: "Sí. De hecho la IA Fiscal está pensada justo para eso: autónomos y particulares que quieren entender lo que pagan y a qué tienen derecho sin pasar por gestoría. Para casos complejos te diremos que vayas a un profesional, pero el grueso de consultas las cubre.",
	},
	{
		q: "¿Vale para empresas peninsulares que venden en Melilla?",
		a: "Vale. La IA distingue entre operaciones hechas en Melilla (IPSI) y operaciones interterritoriales (no sujetas o sujetas a IVA peninsular). Te orienta sobre cuál aplicar y por qué.",
	},
	{
		q: "¿Y si la IA se equivoca?",
		a: "Cada respuesta lleva la cita normativa que la sustenta, para que puedas comprobarla. Es orientativa, no sustituye al asesor en casos serios. Si pillas algo mal, escribe a hola@iamelilla.com y lo arreglamos.",
	},
	{
		q: "¿Cuánto se tarda en montar algo a medida?",
		a: "Un asistente sencillo (FAQ, atención básica) sale en 2 o 3 semanas. Cuando hay integraciones con CRM, ERP o sistemas internos, calcula entre 1 y 3 meses. Te damos calendario realista cuando hablamos.",
	},
	{
		q: "¿Puedo probar antes de pagar?",
		a: "Sí, justo por eso montamos el showroom. Pruebas el producto real (IA Fiscal Melilla, y los que vayamos sumando) antes de firmar ningún papel.",
	},
	{
		q: "¿Trabajáis solo aquí en Melilla?",
		a: "No. Empezamos aquí porque el régimen fiscal local nos sirve de ancla de credibilidad: si funciona aquí, funciona en cualquier sitio. Ya tenemos clientes en península y norte de África.",
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
