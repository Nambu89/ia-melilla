import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function PoliticaPrivacidad() {
	return (
		<PageShell>
			<SeoHead
				title="Política de privacidad — IA Melilla"
				description="Política de privacidad conforme al RGPD (UE 2016/679) y la LOPDGDD: responsable, finalidades, bases legales, destinatarios, plazos, derechos y reclamaciones."
				path="/politica-de-privacidad"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-4">Protección de datos</p>
				<h1 className="text-display-md font-bold tracking-tight">
					Política de privacidad
				</h1>
				<p className="mt-6 text-body-md text-on-surface-variant leading-relaxed">
					La presente Política de Privacidad describe cómo se tratan los datos personales
					recogidos a través del sitio web iamelilla.com, en cumplimiento del Reglamento (UE)
					2016/679 General de Protección de Datos (RGPD), la Ley Orgánica 3/2018 de Protección
					de Datos Personales y garantía de los derechos digitales (LOPDGDD) y la Ley 34/2002
					de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					1. Responsable del tratamiento
				</h2>
				<div className="mt-4 rounded-xl border border-outline-variant bg-surface-container-low px-6 py-5 text-body-md text-on-surface-variant leading-relaxed">
					<p>
						<strong className="text-on-surface">Responsable:</strong> Joaquín Gorge Lucianez
					</p>
					<p>
						<strong className="text-on-surface">NIF:</strong> 45281348Y
					</p>
					<p>
						<strong className="text-on-surface">Domicilio:</strong>{" "}
						{business.address.street}, {business.address.postalCode} {business.address.city},{" "}
						{business.address.country}
					</p>
					<p>
						<strong className="text-on-surface">Email de contacto:</strong>{" "}
						<a className="text-primary hover:underline" href={`mailto:${business.email}`}>
							{business.email}
						</a>
					</p>
					<p>
						<strong className="text-on-surface">Teléfono:</strong> {business.phone}
					</p>
					<p>
						<strong className="text-on-surface">
							Delegado de Protección de Datos (DPO):
						</strong>{" "}
						No designado por no concurrir los supuestos del artículo 37 del RGPD. Para
						cualquier consulta sobre tratamiento de datos puede dirigirse al email indicado.
					</p>
				</div>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					2. Datos personales tratados
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Se tratan únicamente los datos estrictamente necesarios para las finalidades
					descritas en el apartado siguiente:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						<strong className="text-on-surface">Datos identificativos y de contacto:</strong>{" "}
						nombre, apellidos, correo electrónico, teléfono.
					</li>
					<li>
						<strong className="text-on-surface">Datos comerciales:</strong> sector, tamaño de
						empresa, mensaje y necesidad expuesta en el formulario de contacto.
					</li>
					<li>
						<strong className="text-on-surface">Contenido aportado a las demos:</strong>{" "}
						consultas, prompts y, en su caso, ficheros adjuntos (facturas, documentos) subidos
						a las herramientas demostrativas.
					</li>
					<li>
						<strong className="text-on-surface">Datos técnicos:</strong> dirección IP, tipo de
						navegador, sistema operativo, páginas visitadas, datos derivados de cookies
						técnicas y, en su caso, analíticas previo consentimiento.
					</li>
				</ul>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					3. Finalidades y bases legales del tratamiento
				</h2>
				<div className="mt-4 overflow-x-auto">
					<table className="w-full text-body-sm text-on-surface-variant border-collapse">
						<thead>
							<tr className="border-b border-outline-variant">
								<th className="py-3 text-left font-semibold text-on-surface">Finalidad</th>
								<th className="py-3 text-left font-semibold text-on-surface">Base legal</th>
								<th className="py-3 text-left font-semibold text-on-surface">Plazo</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-outline-variant">
								<td className="py-3 pr-4 align-top">
									Atender consultas y solicitudes de información comercial enviadas a través
									del formulario de contacto o canales (email, WhatsApp).
								</td>
								<td className="py-3 pr-4 align-top">
									Consentimiento del interesado (art. 6.1.a RGPD) y medidas precontractuales
									(art. 6.1.b RGPD).
								</td>
								<td className="py-3 align-top">
									Hasta 1 año desde la última interacción si no se formaliza relación.
								</td>
							</tr>
							<tr className="border-b border-outline-variant">
								<td className="py-3 pr-4 align-top">
									Prestación de servicios contratados y emisión de facturas.
								</td>
								<td className="py-3 pr-4 align-top">
									Ejecución de contrato (art. 6.1.b RGPD) y obligación legal (art. 6.1.c
									RGPD).
								</td>
								<td className="py-3 align-top">
									Durante la relación + 6 años (Código de Comercio art. 30) + plazos
									tributarios.
								</td>
							</tr>
							<tr className="border-b border-outline-variant">
								<td className="py-3 pr-4 align-top">
									Procesar las consultas y archivos enviados a las herramientas de IA
									(demos) para devolver el resultado solicitado.
								</td>
								<td className="py-3 pr-4 align-top">
									Consentimiento del interesado al utilizar la demo (art. 6.1.a RGPD).
								</td>
								<td className="py-3 align-top">
									Eliminación automática tras el procesamiento. Máximo 30 días para fines
									técnicos de calidad y seguridad.
								</td>
							</tr>
							<tr className="border-b border-outline-variant">
								<td className="py-3 pr-4 align-top">
									Envío de comunicaciones comerciales (newsletter, novedades) cuando el
									Usuario lo haya autorizado expresamente.
								</td>
								<td className="py-3 pr-4 align-top">
									Consentimiento expreso y separado (art. 6.1.a RGPD y art. 21 LSSI-CE).
								</td>
								<td className="py-3 align-top">
									Hasta la revocación del consentimiento.
								</td>
							</tr>
							<tr>
								<td className="py-3 pr-4 align-top">
									Seguridad de la información, prevención de fraude y trazabilidad técnica.
								</td>
								<td className="py-3 pr-4 align-top">
									Interés legítimo del responsable (art. 6.1.f RGPD).
								</td>
								<td className="py-3 align-top">12 meses de logs de seguridad.</td>
							</tr>
						</tbody>
					</table>
				</div>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					4. Destinatarios y encargados del tratamiento
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Los datos pueden ser comunicados a los siguientes destinatarios, todos vinculados por
					contratos de encargo del tratamiento conforme al artículo 28 del RGPD:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						<strong className="text-on-surface">OpenAI Ireland Ltd. y OpenAI L.L.C. (EE.UU.):
						</strong>{" "}
						proveedor de los modelos de lenguaje utilizados en las herramientas de IA. Procesa
						las consultas enviadas a las demos. OpenAI confirma contractualmente que no
						utiliza los datos enviados a través de su API para entrenar modelos.
					</li>
					<li>
						<strong className="text-on-surface">Contabo GmbH (Alemania):</strong> proveedor de
						alojamiento (VPS) donde reside la infraestructura del sitio y las bases de datos.
					</li>
					<li>
						<strong className="text-on-surface">Proveedor de correo electrónico</strong>{" "}
						(servicio profesional gestionado para el dominio iamelilla.com).
					</li>
					<li>
						Administraciones públicas, jueces y tribunales en los supuestos previstos en la
						normativa aplicable.
					</li>
				</ul>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					No se cederán datos a terceros con finalidades comerciales sin el consentimiento
					expreso del interesado.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					5. Transferencias internacionales de datos
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Al utilizar las herramientas de inteligencia artificial alojadas en el Sitio, las
					consultas pueden transferirse a servidores de OpenAI L.L.C. ubicados en Estados
					Unidos. Esta transferencia internacional se ampara en:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						La <strong className="text-on-surface">Decisión de Adecuación de la Comisión
						Europea</strong> de 10 de julio de 2023 relativa al Marco de Privacidad de Datos
						UE-EE.UU. (EU-US Data Privacy Framework, Decisión 2023/1795).
					</li>
					<li>
						Subsidiariamente, en las <strong className="text-on-surface">Cláusulas
						Contractuales Tipo (CCT)</strong> adoptadas por la Decisión de Ejecución (UE)
						2021/914 de la Comisión, suscritas con el encargado.
					</li>
				</ul>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Se recomienda al Usuario <strong>no introducir datos personales sensibles, secretos
					comerciales ni información confidencial de terceros</strong> en las herramientas de
					IA. Si fuera estrictamente necesario, pseudonimizar la información antes de su envío.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					6. Subida de documentos al clasificador de facturas
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					La herramienta &quot;Clasificador de Facturas&quot; permite al Usuario subir
					documentos para su procesamiento mediante OCR e IA. Los ficheros se procesan en
					memoria, se devuelven los resultados al Usuario y se eliminan de forma automática
					tras el procesamiento (retención máxima de 48 horas con fines exclusivamente
					técnicos de depuración y calidad). El Usuario es <strong>responsable de obtener el
					consentimiento</strong> de cualquier tercero cuyos datos personales aparezcan en los
					ficheros subidos. Para uso demostrativo se recomienda emplear la factura de ejemplo
					proporcionada o pseudonimizar los documentos.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					7. Decisiones automatizadas y elaboración de perfiles
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las herramientas de IA expuestas en el Sitio generan respuestas mediante procesos
					automatizados. Estos procesos <strong>no producen efectos jurídicos ni afectan
					significativamente al Usuario</strong> en el sentido del artículo 22 del RGPD, dado
					que la salida es meramente informativa y orientativa. El Usuario tiene derecho a
					obtener intervención humana, expresar su punto de vista e impugnar la decisión, lo
					que puede solicitar al responsable a través de los canales de contacto.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					8. Derechos de los interesados
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Usuario podrá ejercer en cualquier momento los siguientes derechos reconocidos por
					el RGPD y la LOPDGDD:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						<strong className="text-on-surface">Acceso</strong> a sus datos personales.
					</li>
					<li>
						<strong className="text-on-surface">Rectificación</strong> de datos inexactos o
						incompletos.
					</li>
					<li>
						<strong className="text-on-surface">Supresión</strong> (&quot;derecho al
						olvido&quot;) cuando concurran las circunstancias del art. 17 RGPD.
					</li>
					<li>
						<strong className="text-on-surface">Limitación</strong> del tratamiento en los
						supuestos del art. 18 RGPD.
					</li>
					<li>
						<strong className="text-on-surface">Oposición</strong> al tratamiento por motivos
						relacionados con su situación particular.
					</li>
					<li>
						<strong className="text-on-surface">Portabilidad</strong> de los datos en formato
						estructurado, de uso común y lectura mecánica.
					</li>
					<li>
						<strong className="text-on-surface">No ser objeto de decisiones automatizadas</strong>{" "}
						con efectos jurídicos o significativamente similares.
					</li>
					<li>
						<strong className="text-on-surface">Revocación del consentimiento</strong>{" "}
						otorgado, sin que ello afecte a la licitud del tratamiento previo.
					</li>
				</ul>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Para ejercer estos derechos, el Usuario podrá dirigirse al responsable enviando una
					solicitud al correo electrónico{" "}
					<a className="text-primary hover:underline" href={`mailto:${business.email}`}>
						{business.email}
					</a>{" "}
					adjuntando copia de un documento identificativo válido. La respuesta se proporcionará
					en el plazo máximo de un mes, prorrogable a dos meses adicionales en casos
					justificados.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Asimismo, el Usuario tiene derecho a presentar una <strong>reclamación ante la
					Agencia Española de Protección de Datos</strong> (
					<a
						href="https://www.aepd.es"
						target="_blank"
						rel="noreferrer"
						className="text-primary hover:underline"
					>
						aepd.es
					</a>
					) cuando considere que el tratamiento de sus datos personales infringe la normativa.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					9. Medidas de seguridad
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El responsable ha adoptado las medidas técnicas y organizativas apropiadas para
					garantizar un nivel de seguridad adecuado al riesgo, incluyendo cifrado en tránsito
					(TLS 1.3), control de acceso, registro de actividad, copias de seguridad periódicas
					y revisión de proveedores. Pese a ello, ningún sistema es completamente impenetrable,
					por lo que el Usuario acepta que la transmisión de información a través de Internet
					conlleva riesgos inherentes.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					10. Menores de edad
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Los servicios y herramientas del Sitio están dirigidos a mayores de 14 años. Si se
					detecta que un menor de esta edad ha facilitado datos sin el consentimiento de sus
					padres o tutores legales, se procederá a su eliminación inmediata.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					11. Modificaciones de la Política de Privacidad
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El responsable se reserva el derecho a modificar la presente Política para adaptarla
					a novedades legislativas o jurisprudenciales, así como a las prácticas profesionales
					del sector. En tales casos, se anunciarán los cambios en el Sitio con razonable
					antelación.
				</p>

				<p className="mt-12 text-body-md text-on-surface-variant leading-relaxed">
					Consulta también nuestra{" "}
					<Link to="/politica-de-cookies" className="text-primary hover:underline">
						Política de Cookies
					</Link>{" "}
					y la página de{" "}
					<Link to="/transparencia-ia" className="text-primary hover:underline">
						Transparencia en IA
					</Link>{" "}
					para conocer más detalles sobre el funcionamiento de las herramientas de inteligencia
					artificial.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Última actualización: mayo de 2026.
				</p>
			</article>
		</PageShell>
	);
}
