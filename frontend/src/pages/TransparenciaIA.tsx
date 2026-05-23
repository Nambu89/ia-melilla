import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function TransparenciaIA() {
	return (
		<PageShell>
			<SeoHead
				title="Transparencia en IA — IA Melilla"
				description="Información transparente sobre los modelos de inteligencia artificial utilizados en iamelilla.com: proveedores, datos, limitaciones, sesgos y derechos del usuario conforme al Reglamento UE de IA."
				path="/transparencia-ia"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-4">Reglamento UE de IA · Art. 50</p>
				<h1 className="text-display-md font-bold tracking-tight">
					Transparencia en inteligencia artificial
				</h1>
				<p className="mt-6 text-body-md text-on-surface-variant leading-relaxed">
					En IA Melilla creemos que utilizar inteligencia artificial de forma honesta implica
					contar con claridad cómo funcionan las herramientas que ponemos a disposición del
					Usuario, qué datos manejan y qué limitaciones tienen. Esta página recoge esa
					información en cumplimiento del artículo 50 del Reglamento (UE) 2024/1689 sobre
					inteligencia artificial (AI Act), aplicable a partir del 2 de agosto de 2026, así
					como de las recomendaciones de la Agencia Española de Supervisión de la Inteligencia
					Artificial (AESIA).
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					1. Estás interactuando con un sistema de IA
				</h2>
				<div className="mt-4 rounded-xl border border-primary/30 bg-primary-container/30 px-6 py-5 text-body-md text-on-primary-container leading-relaxed">
					<p>
						Todas las herramientas disponibles en el apartado{" "}
						<Link to="/demos" className="text-primary hover:underline">
							/demos
						</Link>{" "}
						son <strong>sistemas de inteligencia artificial</strong>. Las respuestas que
						obtienes <strong>no provienen de un asesor humano</strong>, sino de un modelo de
						lenguaje generativo orquestado con bases documentales y funciones de cálculo.
						Antes de cada interacción se muestra un aviso recordando esta circunstancia, tal
						y como exige la normativa europea.
					</p>
				</div>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					2. Modelos y proveedores utilizados
				</h2>
				<div className="mt-4 overflow-x-auto">
					<table className="w-full text-body-sm text-on-surface-variant border-collapse">
						<thead>
							<tr className="border-b border-outline-variant">
								<th className="py-3 text-left font-semibold text-on-surface">Herramienta</th>
								<th className="py-3 text-left font-semibold text-on-surface">
									Modelo principal
								</th>
								<th className="py-3 text-left font-semibold text-on-surface">Proveedor</th>
								<th className="py-3 text-left font-semibold text-on-surface">Procesamiento</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-outline-variant">
								<td className="py-3 pr-4 align-top">Chat IA Fiscal Melilla</td>
								<td className="py-3 pr-4 align-top">GPT-4o</td>
								<td className="py-3 pr-4 align-top">OpenAI L.L.C. (EE.UU.)</td>
								<td className="py-3 align-top">API REST. No se entrena con los datos.</td>
							</tr>
							<tr className="border-b border-outline-variant">
								<td className="py-3 pr-4 align-top">Guía fiscal y cálculos IRPF</td>
								<td className="py-3 pr-4 align-top">
									Funciones deterministas + GPT-4o-mini para explicaciones
								</td>
								<td className="py-3 pr-4 align-top">OpenAI L.L.C. (EE.UU.)</td>
								<td className="py-3 align-top">API REST. No se entrena con los datos.</td>
							</tr>
							<tr>
								<td className="py-3 pr-4 align-top">Clasificador de facturas (OCR)</td>
								<td className="py-3 pr-4 align-top">GPT-4o con visión</td>
								<td className="py-3 pr-4 align-top">OpenAI L.L.C. (EE.UU.)</td>
								<td className="py-3 align-top">
									Procesamiento efímero en memoria. Eliminación tras devolver el
									resultado.
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					3. Datos utilizados y no entrenamiento
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las herramientas combinan dos fuentes:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						<strong className="text-on-surface">Conocimiento general del modelo:</strong>{" "}
						resultado del entrenamiento original realizado por OpenAI sobre datos públicos
						de internet con corte temporal a la fecha de publicación del modelo. No
						intervenimos en ese entrenamiento.
					</li>
					<li>
						<strong className="text-on-surface">Base documental fiscal propia (RAG):</strong>{" "}
						índice vectorial elaborado a partir de fuentes oficiales (BOE, BOME, Agencia
						Tributaria, normativa autonómica de Melilla, manuales de Hacienda) que se
						consulta en tiempo real para fundamentar las respuestas.
					</li>
				</ul>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					<strong className="text-on-surface">OpenAI confirma contractualmente</strong> que
					los datos enviados a través de su API empresarial <strong>no se utilizan para
					entrenar futuros modelos</strong>. Las consultas pueden conservarse hasta 30 días
					exclusivamente para fines de detección de abuso y seguridad, tras lo cual son
					eliminadas.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					4. Limitaciones conocidas
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Como cualquier sistema de IA generativa, nuestras herramientas presentan
					limitaciones que el Usuario debe conocer:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						<strong className="text-on-surface">Alucinaciones:</strong> el modelo puede
						generar afirmaciones que suenan plausibles pero son incorrectas. Nuestro sistema
						mitiga este riesgo apoyándose en la base documental, pero no lo elimina por
						completo.
					</li>
					<li>
						<strong className="text-on-surface">Desactualización:</strong> el conocimiento
						interno del modelo tiene una fecha de corte de entrenamiento. Para información
						fiscal reciente nos apoyamos en la base documental RAG, que se actualiza
						periódicamente, pero puede haber un desfase respecto a la última normativa
						publicada en BOE/BOME.
					</li>
					<li>
						<strong className="text-on-surface">Cobertura territorial:</strong> las
						herramientas están especializadas en el régimen económico y fiscal de Melilla.
						Las particularidades de otras Comunidades Autónomas, regímenes forales (País
						Vasco, Navarra) o territorios especiales pueden no estar contempladas con la
						misma profundidad.
					</li>
					<li>
						<strong className="text-on-surface">Sesgos:</strong> los modelos de lenguaje
						pueden reflejar sesgos presentes en sus datos de entrenamiento. Nos esforzamos
						en detectarlos y aplicar instrucciones de mitigación, pero ningún sistema es
						neutral por defecto.
					</li>
					<li>
						<strong className="text-on-surface">Aritmética:</strong> los modelos pueden
						cometer errores en cálculos complejos. Por ello, los cálculos críticos
						(salario neto, retenciones, IRPF estimado) están implementados como{" "}
						<strong>funciones deterministas en código</strong> con fórmulas oficiales, no
						delegados al modelo.
					</li>
				</ul>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					5. Categoría de riesgo conforme al AI Act
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Nuestras herramientas se clasifican como sistemas de IA de{" "}
					<strong className="text-on-surface">riesgo limitado</strong> según el Reglamento
					(UE) 2024/1689. No realizan inferencias biométricas, no determinan acceso a
					servicios esenciales ni emiten decisiones automatizadas con efectos jurídicos. Por
					ello están sometidas principalmente a las obligaciones de transparencia del
					artículo 50, que se cumplen mediante:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>Aviso visible de interacción con IA al inicio de cada herramienta.</li>
					<li>
						Disclaimer obligatorio sobre el carácter no vinculante de las respuestas en cada
						página de demo.
					</li>
					<li>
						Esta página de transparencia, accesible desde el pie de página del Sitio.
					</li>
					<li>
						Identificación clara de cualquier contenido sintético (imagen, audio, vídeo)
						generado por IA cuando lo hubiere.
					</li>
				</ul>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					6. Supervisión humana y derecho a impugnar
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las respuestas de las herramientas no constituyen decisiones automatizadas con
					efectos jurídicos en el sentido del artículo 22 del RGPD. No obstante, el Usuario
					puede en cualquier momento:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						Solicitar la intervención humana del Prestador para revisar una respuesta.
					</li>
					<li>Expresar su punto de vista o aportar contexto adicional.</li>
					<li>Impugnar la respuesta y obtener una explicación razonada.</li>
					<li>Reportar errores, sesgos o comportamientos problemáticos.</li>
				</ul>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Estas solicitudes pueden dirigirse al correo{" "}
					<a className="text-primary hover:underline" href={`mailto:${business.email}`}>
						{business.email}
					</a>
					.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					7. Contenido sintético y marcado
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Cuando ofrezcamos servicios o demos que generen <strong>imágenes, vídeos o audios
					sintéticos</strong> (por ejemplo, en futuros casos de modelos virtuales o
					influencers IA), el contenido se identificará claramente como generado por IA
					mediante marcas visuales y, cuando sea técnicamente viable, mediante metadatos
					legibles por máquina (estándar C2PA u otros mecanismos equivalentes), tal y como
					exige el AI Act.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					8. Reporte de incidencias
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Si detectas una respuesta incorrecta, un sesgo problemático, un fallo de seguridad
					o cualquier comportamiento que consideres inapropiado en nuestras herramientas, te
					pedimos que nos lo comuniques por email a{" "}
					<a className="text-primary hover:underline" href={`mailto:${business.email}`}>
						{business.email}
					</a>{" "}
					indicando la herramienta, la consulta realizada y el problema observado. Tu
					feedback nos ayuda a mejorar.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					9. Actualización de esta página
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Esta página se actualiza cuando incorporamos nuevos modelos, cambiamos proveedores o
					modificamos sustancialmente el comportamiento de las herramientas. La fecha de
					última actualización aparece al final del documento.
				</p>

				<p className="mt-12 text-body-md text-on-surface-variant leading-relaxed">
					Más información: consulta nuestra{" "}
					<Link to="/politica-de-privacidad" className="text-primary hover:underline">
						Política de Privacidad
					</Link>{" "}
					y los{" "}
					<Link to="/terminos" className="text-primary hover:underline">
						Términos y Condiciones
					</Link>
					.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Última actualización: mayo de 2026. Responsable: Joaquín Gorge Lucianez ·{" "}
					{business.email}
				</p>
			</article>
		</PageShell>
	);
}
