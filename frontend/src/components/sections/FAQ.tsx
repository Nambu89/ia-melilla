import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/Accordion";
import RevealOnScroll from "@/components/animations/RevealOnScroll";

const FAQ_ITEMS = [
	{
		q: "¿Cuánto cuesta integrar IA en mi negocio?",
		a: "Depende del alcance. Una asesoría IA Fiscal arranca desde 199€/mes. Una solución a medida (chatbot, automatización procesos, integraciones) se cotiza por proyecto tras una reunión gratuita. Primera reunión sin compromiso.",
	},
	{
		q: "¿Qué datos guardáis cuando uso el chat?",
		a: "Las conversaciones se procesan para generar la respuesta y se eliminan periodicamente. No almacenamos datos identificables salvo que tú nos los facilites por contacto. Cumplimos RGPD. Ver Política de privacidad.",
	},
	{
		q: "¿Funciona si no tengo gestor o asesor fiscal?",
		a: "Sí. La IA Fiscal Melilla está pensada precisamente para particulares y autónomos que quieren entender sus obligaciones sin pasar por una gestoría. Para casos complejos seguimos recomendando un profesional, pero para el 80% de consultas habituales la IA basta.",
	},
	{
		q: "¿Soportáis empresas con sede en península que vendan en Melilla?",
		a: "Sí. La IA distingue entre operaciones realizadas en Melilla (IPSI) y operaciones interterritoriales (no sujetas o sujetas a IVA peninsular). Te orientamos sobre qué aplicar.",
	},
	{
		q: "¿Qué pasa si la IA se equivoca?",
		a: "Toda respuesta cita la fuente normativa que la sustenta para que puedas verificarla. La información es orientativa y no sustituye asesoramiento profesional para casos críticos. Si detectas un error: contacta@iamelilla.com — lo arreglamos rápido.",
	},
	{
		q: "¿Plazos de entrega para una solución a medida?",
		a: "Un asistente sencillo (FAQ, atención cliente) en 2-3 semanas. Una automatización con integraciones complejas (CRM, ERP) entre 1 y 3 meses. Te damos un calendario realista tras entender tu caso.",
	},
	{
		q: "¿Puedo probar antes de contratar?",
		a: "Sí. Por eso construimos el showroom de demos. Pruebas el producto real (IA Fiscal Melilla y los que vayamos sumando) antes de firmar nada.",
	},
	{
		q: "¿Trabajáis solo en Melilla?",
		a: "No. Empezamos en Melilla porque el régimen fiscal local es nuestro ancla de credibilidad. Pero la tecnología vale para cualquier mercado de habla hispana. Tenemos clientes en península y norte de África.",
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
					Lo que más nos preguntan antes de contratar.
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
