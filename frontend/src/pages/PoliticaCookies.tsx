import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function PoliticaCookies() {
	function openCookieSettings() {
		window.dispatchEvent(new CustomEvent("open-cookie-settings"));
	}

	return (
		<PageShell>
			<SeoHead
				title="Política de cookies — IA Melilla"
				description="Política de cookies conforme a la Guía AEPD 2024 y al artículo 22.2 LSSI-CE: tipos, finalidades, plazos, terceros y mecanismos para gestionar el consentimiento."
				path="/politica-de-cookies"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-4">Información de cookies</p>
				<h1 className="text-display-md font-bold tracking-tight">Política de cookies</h1>
				<p className="mt-6 text-body-md text-on-surface-variant leading-relaxed">
					La presente Política de Cookies se elabora en cumplimiento del artículo 22.2 de la
					Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico
					(LSSI-CE), del Reglamento (UE) 2016/679 (RGPD) y de la Guía sobre el uso de cookies
					de la Agencia Española de Protección de Datos en su versión actualizada de 2024.
				</p>

				<div className="mt-8 flex flex-wrap gap-3">
					<button
						type="button"
						onClick={openCookieSettings}
						className="rounded-md border border-outline bg-surface-container-low px-4 py-2 text-body-sm font-semibold text-on-surface hover:bg-surface-container-high transition"
					>
						Configurar cookies
					</button>
					<Link
						to="/politica-de-privacidad"
						className="rounded-md border border-outline bg-surface-container-low px-4 py-2 text-body-sm font-semibold text-on-surface hover:bg-surface-container-high transition"
					>
						Ver política de privacidad
					</Link>
				</div>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					1. ¿Qué son las cookies?
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las cookies son pequeños ficheros de texto que un sitio web envía al navegador del
					Usuario y que se almacenan en su dispositivo (ordenador, smartphone, tablet) cuando
					accede a una página. Permiten reconocer al Usuario en visitas posteriores, guardar
					preferencias, analizar el comportamiento del Sitio y, en su caso, mostrar publicidad
					personalizada. Bajo esta definición se incluyen también tecnologías similares como
					el local storage, session storage, pixels o fingerprinting, sometidas a las mismas
					obligaciones de información y consentimiento.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					2. Tipología de cookies utilizadas
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					En función de la entidad que las gestiona se distingue entre cookies{" "}
					<strong className="text-on-surface">propias</strong> (gestionadas por el titular del
					Sitio) y de <strong className="text-on-surface">terceros</strong> (gestionadas por
					proveedores externos). Según su duración, pueden ser{" "}
					<strong className="text-on-surface">de sesión</strong> (expiran al cerrar el
					navegador) o <strong className="text-on-surface">persistentes</strong> (permanecen
					durante un plazo determinado).
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Según su finalidad, las cookies pueden ser:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						<strong className="text-on-surface">Técnicas o estrictamente necesarias:</strong>{" "}
						permiten la navegación y el correcto funcionamiento del Sitio. Están exentas del
						deber de consentimiento.
					</li>
					<li>
						<strong className="text-on-surface">De preferencias o personalización:</strong>{" "}
						recuerdan opciones del Usuario (idioma, tema claro/oscuro, etc.).
					</li>
					<li>
						<strong className="text-on-surface">Analíticas o de medición:</strong> recopilan
						información sobre el uso del Sitio con fines estadísticos. Requieren
						consentimiento.
					</li>
					<li>
						<strong className="text-on-surface">De publicidad y publicidad comportamental:
						</strong>{" "}
						gestionan los espacios publicitarios y muestran contenido relevante. Requieren
						consentimiento. <strong>El Sitio no utiliza este tipo de cookies.</strong>
					</li>
				</ul>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					3. Cookies que utiliza este Sitio
				</h2>
				<div className="mt-4 overflow-x-auto">
					<table className="w-full text-body-sm text-on-surface-variant border-collapse">
						<thead>
							<tr className="border-b border-outline-variant">
								<th className="py-3 text-left font-semibold text-on-surface">Nombre</th>
								<th className="py-3 text-left font-semibold text-on-surface">Titular</th>
								<th className="py-3 text-left font-semibold text-on-surface">Finalidad</th>
								<th className="py-3 text-left font-semibold text-on-surface">Tipo</th>
								<th className="py-3 text-left font-semibold text-on-surface">Duración</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-outline-variant">
								<td className="py-3 pr-4 align-top font-mono text-body-sm">
									cookie-consent
								</td>
								<td className="py-3 pr-4 align-top">iamelilla.com</td>
								<td className="py-3 pr-4 align-top">
									Almacena la decisión del Usuario sobre el banner de cookies.
								</td>
								<td className="py-3 pr-4 align-top">Técnica</td>
								<td className="py-3 align-top">12 meses</td>
							</tr>
							<tr className="border-b border-outline-variant">
								<td className="py-3 pr-4 align-top font-mono text-body-sm">theme</td>
								<td className="py-3 pr-4 align-top">iamelilla.com</td>
								<td className="py-3 pr-4 align-top">
									Recuerda la preferencia de tema claro u oscuro del Usuario.
								</td>
								<td className="py-3 pr-4 align-top">Preferencias</td>
								<td className="py-3 align-top">12 meses</td>
							</tr>
							<tr>
								<td className="py-3 pr-4 align-top font-mono text-body-sm">
									impuestify-auth
								</td>
								<td className="py-3 pr-4 align-top">fiscal.iamelilla.com</td>
								<td className="py-3 pr-4 align-top">
									Token de sesión técnica para autenticar al usuario demo en las
									herramientas fiscales (no asociado a identidad personal).
								</td>
								<td className="py-3 pr-4 align-top">Técnica</td>
								<td className="py-3 align-top">Sesión</td>
							</tr>
						</tbody>
					</table>
				</div>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Actualmente este Sitio <strong>no utiliza cookies analíticas de terceros</strong>{" "}
					(como Google Analytics, Meta Pixel u otros) ni cookies de publicidad. Si en el
					futuro se incorporaran, se solicitará el consentimiento previo del Usuario a través
					del banner de cookies y se actualizará la tabla anterior.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					4. Bases legales del tratamiento
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las cookies técnicas y de preferencias se instalan en virtud del interés legítimo
					del titular (art. 6.1.f RGPD) por ser estrictamente necesarias para la prestación
					del servicio expresamente solicitado por el Usuario. El resto de cookies (analíticas,
					publicitarias) requieren el <strong>consentimiento expreso, libre, informado y
					granular</strong> del Usuario, prestado a través del banner que aparece al primer
					acceso al Sitio.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					5. Gestión y revocación del consentimiento
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Usuario puede aceptar, rechazar o configurar el uso de cookies en cualquier
					momento desde el panel de configuración accesible mediante el botón &quot;Configurar
					cookies&quot; situado en el pie de página del Sitio y al inicio de esta misma
					política. La retirada del consentimiento es{" "}
					<strong>tan sencilla como su otorgamiento</strong> y no afectará a la licitud del
					tratamiento realizado previamente.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Asimismo, el Usuario puede gestionar y eliminar cookies desde la configuración de su
					navegador. A continuación se indican enlaces a las instrucciones oficiales de los
					navegadores más comunes:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						<a
							href="https://support.google.com/chrome/answer/95647"
							target="_blank"
							rel="noreferrer"
							className="text-primary hover:underline"
						>
							Google Chrome
						</a>
					</li>
					<li>
						<a
							href="https://support.mozilla.org/es/kb/eliminar-cookies-borrar-otros-datos-sitios-firefox"
							target="_blank"
							rel="noreferrer"
							className="text-primary hover:underline"
						>
							Mozilla Firefox
						</a>
					</li>
					<li>
						<a
							href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
							target="_blank"
							rel="noreferrer"
							className="text-primary hover:underline"
						>
							Safari
						</a>
					</li>
					<li>
						<a
							href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
							target="_blank"
							rel="noreferrer"
							className="text-primary hover:underline"
						>
							Microsoft Edge
						</a>
					</li>
				</ul>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El rechazo de las cookies técnicas o de preferencias puede degradar parte de la
					funcionalidad del Sitio.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					6. Plazo de conservación del consentimiento
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Conforme a las indicaciones de la AEPD, el consentimiento prestado caduca
					automáticamente a los <strong>24 meses</strong> y se volverá a solicitar al Usuario,
					o antes si se modifica significativamente la información sobre cookies tratadas.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					7. Transferencias internacionales
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Actualmente el Sitio no incorpora cookies de terceros que impliquen transferencia de
					datos a países fuera del Espacio Económico Europeo. En el caso de que se incorpore
					algún proveedor con sede en EE.UU. u otros países, dicha transferencia se ampararía
					en el EU-US Data Privacy Framework (Decisión 2023/1795) y/o en las Cláusulas
					Contractuales Tipo aprobadas por la Comisión Europea.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					8. Modificaciones de la política
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El titular se reserva el derecho a modificar esta Política de Cookies para
					adaptarla a novedades legislativas, técnicas o jurisprudenciales. Cualquier cambio
					sustancial se notificará en esta misma página y, cuando proceda, se solicitará un
					nuevo consentimiento al Usuario.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					9. Contacto
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Para cualquier consulta o duda en relación con esta Política de Cookies, el Usuario
					puede dirigirse al responsable a través del correo{" "}
					<a className="text-primary hover:underline" href={`mailto:${business.email}`}>
						{business.email}
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
