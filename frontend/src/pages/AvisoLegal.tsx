import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function AvisoLegal() {
	return (
		<PageShell>
			<SeoHead
				title="Aviso legal — IA Melilla"
				description="Aviso legal del sitio iamelilla.com. Datos identificativos del titular, condiciones de uso, propiedad intelectual y legislación aplicable."
				path="/aviso-legal"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-4">Información legal</p>
				<h1 className="text-display-md font-bold tracking-tight">Aviso legal</h1>
				<p className="mt-6 text-body-md text-on-surface-variant leading-relaxed">
					En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
					Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa a los usuarios
					de los siguientes datos identificativos del titular del sitio web.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					1. Datos identificativos del titular
				</h2>
				<div className="mt-4 rounded-xl border border-outline-variant bg-surface-container-low px-6 py-5 text-body-md text-on-surface-variant leading-relaxed">
					<p>
						<strong className="text-on-surface">Titular:</strong> Joaquín Gorge Lucianez
					</p>
					<p>
						<strong className="text-on-surface">NIF:</strong> 45281348Y
					</p>
					<p>
						<strong className="text-on-surface">Actividad:</strong> Servicios de inteligencia
						artificial aplicada (consultoría, desarrollo e implantación)
					</p>
					<p>
						<strong className="text-on-surface">Domicilio profesional:</strong>{" "}
						{business.address.street}, {business.address.postalCode} {business.address.city},{" "}
						{business.address.country}
					</p>
					<p>
						<strong className="text-on-surface">Correo electrónico:</strong>{" "}
						<a className="text-primary hover:underline" href={`mailto:${business.email}`}>
							{business.email}
						</a>
					</p>
					<p>
						<strong className="text-on-surface">Teléfono / WhatsApp:</strong>{" "}
						<a className="text-primary hover:underline" href={`tel:+${business.phoneIntl}`}>
							{business.phone}
						</a>
					</p>
					<p>
						<strong className="text-on-surface">Nombre comercial:</strong> IA Melilla
					</p>
					<p>
						<strong className="text-on-surface">Sitio web:</strong> iamelilla.com
					</p>
				</div>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					2. Objeto y aceptación
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El presente aviso legal regula el acceso, navegación y uso del sitio web iamelilla.com
					(en adelante, &quot;el Sitio&quot;), titularidad del responsable arriba identificado. La
					navegación por el Sitio atribuye la condición de Usuario e implica la aceptación plena
					y sin reservas de todas las disposiciones incluidas en este aviso, así como en la
					Política de Privacidad y la Política de Cookies, en la versión publicada en el momento
					del acceso.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Usuario se obliga a hacer un uso correcto del Sitio conforme a las leyes, la buena
					fe, el orden público y las presentes condiciones. El Usuario responderá frente al
					titular o frente a terceros de cualesquiera daños y perjuicios que pudieran causarse
					por incumplimiento de esta obligación.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					3. Condiciones de acceso y uso
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El acceso al Sitio es libre y gratuito, salvo en lo relativo al coste de la conexión
					a la red de telecomunicaciones suministrada por el proveedor de acceso contratado por
					el Usuario. El acceso a determinados servicios podrá requerir el suministro de datos
					personales mediante formularios de contacto o el uso de las herramientas demostrativas
					disponibles en el apartado &quot;Demos&quot;.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Queda expresamente prohibido:
				</p>
				<ul className="mt-3 ml-6 list-disc text-body-md text-on-surface-variant leading-relaxed space-y-2">
					<li>
						Utilizar el Sitio con fines ilícitos, lesivos de derechos o intereses de terceros, o
						que de cualquier forma puedan dañar, inutilizar, sobrecargar o deteriorar el Sitio
						o impedir su normal utilización.
					</li>
					<li>
						Introducir o difundir virus informáticos, código malicioso o cualquier otro sistema
						que pueda provocar alteraciones en los sistemas físicos o lógicos del titular o de
						terceros.
					</li>
					<li>
						Realizar técnicas de ingeniería inversa, scraping masivo o automatizado, inyección
						de prompts maliciosos a las herramientas de inteligencia artificial expuestas o
						cualquier otro acceso no autorizado a los sistemas.
					</li>
					<li>
						Suplantar la identidad de otros usuarios o de terceros, o utilizar los servicios
						con identidades falsas.
					</li>
					<li>
						Introducir datos personales de terceros sin su consentimiento expreso, en
						particular al utilizar herramientas que procesan documentos (clasificador de
						facturas, asistentes fiscales).
					</li>
				</ul>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					4. Propiedad intelectual e industrial
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Todos los contenidos del Sitio (textos, fotografías, gráficos, imágenes, iconos,
					tecnología, software, enlaces y demás contenidos audiovisuales o sonoros), así como su
					diseño gráfico, estructura, selección, presentación y código fuente, son propiedad
					intelectual del titular o de terceros que han autorizado su uso, sin que pueda
					entenderse cedido al Usuario ninguno de los derechos de explotación reconocidos por la
					normativa vigente en materia de propiedad intelectual sobre los mismos.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las marcas, nombres comerciales, signos distintivos, logotipos, denominaciones y
					tipografías que aparecen en el Sitio son titularidad de Joaquín Gorge Lucianez o, en
					su caso, de terceros. Queda prohibida cualquier reproducción, distribución,
					comunicación pública, puesta a disposición o transformación, total o parcial, sin la
					autorización previa, expresa y por escrito del titular o, en su caso, del legítimo
					propietario.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					5. Enlaces a sitios de terceros
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El Sitio puede contener enlaces (links) a otros sitios de terceros que el titular no
					puede controlar. Por tanto, el titular no asume responsabilidad alguna por el
					contenido, las informaciones o servicios que pudieran aparecer en dichos sitios,
					que tendrán exclusivamente carácter informativo y que en ningún caso implican relación
					alguna entre el titular y los responsables de los sitios web a los que se acceda
					mediante los enlaces.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					6. Exclusión de garantías y limitación de responsabilidad
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El titular no garantiza la inexistencia de interrupciones o errores en el acceso al
					Sitio, en su contenido, ni que éste se encuentre actualizado, aunque desarrollará sus
					mejores esfuerzos para, en su caso, evitarlos, subsanarlos o actualizarlos.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las respuestas, simulaciones, cálculos y clasificaciones generadas por las
					herramientas de inteligencia artificial expuestas en la sección &quot;Demos&quot;
					(incluido el asistente IA Fiscal Melilla, calculadoras de IRPF, guía fiscal y
					clasificador de facturas) tienen carácter <strong>meramente informativo y orientativo
					</strong> y <strong>no constituyen asesoramiento fiscal, jurídico, contable ni
					profesional vinculante</strong>. El Usuario debe contrastar la información obtenida con
					un profesional colegiado competente antes de tomar cualquier decisión que pueda tener
					efectos legales o económicos. El titular declina toda responsabilidad por las
					decisiones que el Usuario adopte basándose exclusivamente en la salida de estas
					herramientas.
				</p>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					En cualquier caso, el titular no será responsable de los daños y perjuicios de
					cualquier tipo derivados del acceso, navegación y uso del Sitio, incluyéndose pero no
					limitándose, a los ocasionados a los sistemas informáticos o los provocados por la
					introducción de virus.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					7. Modificaciones
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					El titular se reserva el derecho a efectuar sin previo aviso las modificaciones que
					considere oportunas en el Sitio, pudiendo cambiar, suprimir o añadir tanto los
					contenidos y servicios que se presten a través de la misma como la forma en la que
					éstos aparezcan presentados o localizados.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">
					8. Legislación aplicable y jurisdicción
				</h2>
				<p className="mt-4 text-body-md text-on-surface-variant leading-relaxed">
					Las relaciones establecidas entre el titular y el Usuario se regirán por lo dispuesto
					en la normativa española vigente. Para la resolución de cualquier controversia que
					pudiera derivarse del acceso o uso del Sitio, las partes se someten expresamente a los
					Juzgados y Tribunales de Melilla, salvo cuando el Usuario tenga la condición de
					consumidor, en cuyo caso será competente el fuero correspondiente al domicilio del
					consumidor, conforme a lo previsto en el artículo 90.2 del Real Decreto Legislativo
					1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General
					para la Defensa de los Consumidores y Usuarios.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Última actualización: mayo de 2026.
				</p>
			</article>
		</PageShell>
	);
}
