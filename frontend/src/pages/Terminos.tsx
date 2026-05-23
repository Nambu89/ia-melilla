import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function Terminos() {
	return (
		<PageShell>
			<SeoHead
				title="Términos y condiciones — IA Melilla"
				description="Condiciones generales de contratación y de uso de los servicios y herramientas de inteligencia artificial de iamelilla.com."
				path="/terminos"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-4">Condiciones de uso</p>
				<h1 className="text-display-md font-bold tracking-tight">
					Términos y condiciones
				</h1>
				<p className="mt-6 text-body-md text-on-surface-variant leading-relaxed">
					Las presentes condiciones generales regulan el acceso al sitio web iamelilla.com, el
					uso de las herramientas demostrativas (en adelante, &quot;Demos&quot;) y, en su caso,
					la contratación de los servicios profesionales ofrecidos por Joaquín Gorge Lucianez
					(&quot;el Prestador&quot;) bajo el nombre comercial IA Melilla. La utilización de
					cualquiera de estos servicios implica la aceptación expresa y sin reservas de las
					presentes condiciones, así como del{" "}
					<Link to="/aviso-legal" className="text-primary hover:underline">
						Aviso Legal
					</Link>{" "}
					y la{" "}
					<Link to="/politica-de-privacidad" className="text-primary hover:underline">
						Política de Privacidad
					</Link>
					.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					1. Objeto y ámbito
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Estas condiciones se aplican a dos relaciones diferenciadas:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						<strong className="text-on-surface">Uso público de las Demos:</strong> acceso
						gratuito a las herramientas de inteligencia artificial expuestas en el apartado{" "}
						<Link to="/demos" className="text-primary hover:underline">
							/demos
						</Link>{" "}
						(asistente IA Fiscal Melilla, calculadoras IRPF, guía fiscal, clasificador de
						facturas), con carácter meramente demostrativo y orientativo.
					</li>
					<li>
						<strong className="text-on-surface">Servicios profesionales contratados:</strong>{" "}
						consultoría, desarrollo, integración y mantenimiento de soluciones de IA para
						empresas, autónomos y particulares. Las condiciones específicas de cada servicio
						se documentarán en una propuesta o contrato individualizado entre las partes,
						prevaleciendo en caso de contradicción con las presentes.
					</li>
				</ul>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					2. Capacidad y registro
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Usuario declara tener al menos 14 años y, en su caso, capacidad legal suficiente
					para obligarse según las presentes condiciones. Las Demos no requieren registro de
					cuenta personal por parte del Usuario. La contratación de servicios profesionales
					requerirá la firma de una propuesta económica o contrato específico.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					3. Disclaimer obligatorio sobre las herramientas de IA
				</h2>
				<div className="mt-4 rounded-xl border border-warning bg-warning-container/30 px-6 py-5 text-body-md text-on-warning-container leading-relaxed">
					<p className="font-semibold text-warning mb-2">
						Información importante sobre el uso de las herramientas de IA
					</p>
					<p>
						Las respuestas, simulaciones, cálculos, clasificaciones y demás contenidos
						generados por las herramientas de inteligencia artificial integradas en este
						Sitio (en particular el asistente IA Fiscal Melilla, la calculadora de salario
						neto, la calculadora de retenciones, la guía fiscal y el clasificador de
						facturas) tienen carácter <strong>meramente informativo y orientativo</strong>{" "}
						y <strong>NO constituyen asesoramiento fiscal, jurídico, contable, financiero ni
						profesional vinculante</strong>.
					</p>
					<p className="mt-3">
						El Usuario es el único responsable de verificar la información obtenida con un
						profesional colegiado competente antes de tomar cualquier decisión que pueda
						tener efectos legales, económicos o personales. El Prestador no responderá por
						las decisiones que el Usuario adopte basándose exclusivamente en la salida de
						estas herramientas.
					</p>
				</div>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					4. Funcionamiento y limitaciones de las Demos
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las Demos están construidas sobre modelos de lenguaje (en concreto, modelos de la
					familia GPT proporcionados por OpenAI) y bases documentales internas. Su
					funcionamiento está sujeto a las siguientes limitaciones que el Usuario reconoce y
					acepta:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						Los modelos pueden generar respuestas <strong>inexactas, desactualizadas o
						incompletas</strong> (&quot;alucinaciones&quot;).
					</li>
					<li>
						El conocimiento del modelo está limitado a su <strong>fecha de corte de
						entrenamiento</strong>. La normativa fiscal puede haber cambiado posteriormente.
					</li>
					<li>
						Los cálculos numéricos están construidos sobre fórmulas oficiales pero{" "}
						<strong>no contemplan la totalidad de casuísticas</strong> (deducciones
						autonómicas, situaciones familiares específicas, regímenes especiales).
					</li>
					<li>
						El Prestador puede <strong>suspender, modificar o discontinuar</strong> las Demos
						sin previo aviso, incluyendo periodos de mantenimiento o sustituciones de
						modelos.
					</li>
					<li>
						Las Demos están sujetas a <strong>límites de uso</strong> (rate limits) por
						sesión y dirección IP para garantizar disponibilidad equitativa.
					</li>
				</ul>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					5. Uso aceptable
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Usuario se compromete a no utilizar las Demos ni los servicios para:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						Realizar actos ilícitos, fraudulentos o contrarios a la buena fe y al orden
						público.
					</li>
					<li>
						Introducir <strong>prompts maliciosos</strong> (prompt injection, jailbreaking)
						que pretendan saltar las restricciones del sistema o extraer información
						confidencial.
					</li>
					<li>
						Realizar <strong>scraping masivo o automatizado</strong> del Sitio o de las
						respuestas de las Demos.
					</li>
					<li>
						Subir <strong>datos personales de terceros</strong> a las herramientas que
						procesan documentos sin haber obtenido previamente su consentimiento expreso e
						informado.
					</li>
					<li>
						Utilizar las salidas de las Demos para <strong>generar contenido difamatorio,
						discriminatorio, violento, sexual no consentido o que infrinja derechos de
						terceros</strong>.
					</li>
					<li>
						Reutilizar las respuestas de las Demos para entrenar modelos de IA propios o
						competidores.
					</li>
				</ul>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Prestador podrá restringir el acceso a cualquier Usuario que incumpla estas
					obligaciones, sin perjuicio del ejercicio de las acciones legales que pudieran
					corresponderle.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					6. Contratación de servicios profesionales
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Los servicios profesionales (consultoría, desarrollo a medida, integraciones,
					mantenimiento) se contratan previa propuesta económica firmada por ambas partes,
					que detallará alcance, hitos, plazos, precio y forma de pago. En tanto no exista
					una propuesta firmada, ninguna comunicación entre las partes generará obligación
					contractual alguna.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					<strong className="text-on-surface">Régimen fiscal:</strong> dado que el Prestador
					tiene su domicilio en la Ciudad Autónoma de Melilla, las facturas se emiten con
					aplicación del{" "}
					<strong className="text-on-surface">
						Impuesto sobre la Producción, los Servicios y la Importación (IPSI)
					</strong>{" "}
					al tipo general del 4 % en lugar del IVA, conforme a la Ley 8/1991, sus tipos
					vigentes y el Régimen Económico y Fiscal de Melilla.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					7. Derecho de desistimiento (consumidores B2C)
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Si el Usuario contrata servicios en condición de consumidor (persona física que
					actúa con un propósito ajeno a su actividad comercial o profesional), dispone de un
					plazo de <strong>14 días naturales</strong> desde la celebración del contrato para
					desistir, sin necesidad de justificación y sin penalización, conforme al artículo
					102 del Real Decreto Legislativo 1/2007.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					No obstante, el Usuario perderá el derecho de desistimiento cuando la prestación del
					servicio haya sido <strong>plenamente ejecutada</strong> con su consentimiento
					previo y expreso, o cuando se trate de contenidos digitales personalizados o
					adaptados a sus especificaciones cuya ejecución haya comenzado, conforme al artículo
					103, letras a) y m), del citado texto refundido.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Para ejercer el desistimiento, el Usuario podrá dirigir una notificación clara al
					correo{" "}
					<a className="text-primary hover:underline" href={`mailto:${business.email}`}>
						{business.email}
					</a>{" "}
					indicando su voluntad de desistir.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					8. Propiedad intelectual y outputs de la IA
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Los contenidos del Sitio (textos, gráficos, código, marca) son titularidad del
					Prestador o de terceros que han autorizado su uso. Respecto a las salidas generadas
					por las Demos, el Usuario es libre de utilizarlas para fines personales o
					profesionales propios, sin que el Prestador asuma garantía alguna sobre su
					exactitud, originalidad o ausencia de infracción de derechos de terceros.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					9. Limitación de responsabilidad
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					En la máxima medida permitida por la legislación aplicable, la responsabilidad del
					Prestador derivada del uso de las Demos quedará limitada a los daños directos y
					ciertos efectivamente acreditados, con exclusión de los daños indirectos, lucro
					cesante, pérdida de oportunidad o reputacionales. Estas limitaciones{" "}
					<strong>no aplican a los supuestos de dolo, culpa grave, daños a la vida o
					integridad física, ni a los derechos imperativos de los consumidores</strong> que la
					normativa declara irrenunciables (en particular, los artículos 86 y 148 y siguientes
					del Real Decreto Legislativo 1/2007).
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					10. Fuerza mayor
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Prestador no será responsable del incumplimiento o retraso causado por hechos
					ajenos a su control razonable, incluyendo caídas de proveedores cloud, modificación
					sobrevenida de modelos de terceros (OpenAI u otros), ciberataques masivos,
					decisiones administrativas o judiciales o cualquier supuesto que la jurisprudencia
					califique como fuerza mayor.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					11. Modificación de las condiciones
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Prestador podrá modificar estas condiciones en cualquier momento, publicando la
					nueva versión en el Sitio. La continuación del uso tras la publicación implicará
					aceptación de la versión actualizada. Para los servicios profesionales contratados
					regirán las condiciones vigentes en el momento de la firma de la propuesta.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					12. Resolución de controversias y ley aplicable
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las presentes condiciones se rigen por la legislación española. Las partes intentarán
					resolver de buena fe cualquier controversia. Cuando ello no fuera posible, se
					someten a los Juzgados y Tribunales de Melilla, salvo que el Usuario tenga la
					condición de consumidor, en cuyo caso el fuero competente será el correspondiente al
					domicilio del consumidor.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Asimismo, conforme al Reglamento (UE) 524/2013, los consumidores tienen a su
					disposición la plataforma europea de Resolución de Litigios en Línea (ODR) en{" "}
					<a
						href="https://ec.europa.eu/consumers/odr"
						target="_blank"
						rel="noreferrer"
						className="text-primary hover:underline"
					>
						ec.europa.eu/consumers/odr
					</a>
					.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Última actualización: mayo de 2026.
				</p>
			</article>
		</PageShell>
	);
}
