import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function PoliticaPrivacidad() {
	return (
		<PageShell>
			<SeoHead
				title="Política de privacidad — IA Melilla"
				description="Cómo tratamos y protegemos los datos personales de los usuarios del sitio iamelilla.com."
				path="/politica-de-privacidad"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<h1 className="text-display-md font-bold tracking-tight">Política de privacidad</h1>

				<p className="text-body-md text-on-surface-variant mt-8 leading-relaxed">
					Joaquín Gorge Lucianez (en adelante, el responsable) informa a los usuarios sobre el
					tratamiento y la protección de los datos personales recogidos a través del sitio web{" "}
					{business.name} (iamelilla.com).
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Responsable del tratamiento</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Joaquín Gorge Lucianez.
					<br />
					{business.address.street}, {business.address.postalCode} {business.address.city}.
					<br />
					Email: {business.email}
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Finalidad y legitimación</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Los datos personales recogidos se utilizan únicamente para atender la consulta o solicitud
					realizada por el usuario, así como para el envío de comunicaciones relacionadas con los
					servicios solicitados. La base legítima del tratamiento es el consentimiento del
					interesado.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Demo IA Fiscal Melilla</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Las consultas que los usuarios envían a la demo IA Fiscal Melilla no se asocian a su
					identidad personal ni se utilizan para entrenar modelos de inteligencia artificial. Las
					consultas pueden almacenarse de forma anonimizada con fines exclusivos de mejora del
					producto.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Conservación</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Los datos se conservan durante el tiempo necesario para cumplir con la finalidad para la
					que fueron recogidos y, posteriormente, durante los plazos legales aplicables.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Derechos del usuario</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					El usuario puede ejercer en cualquier momento los derechos de acceso, rectificación,
					supresión, oposición, limitación del tratamiento y portabilidad de sus datos,
					dirigiéndose por escrito al responsable en la dirección indicada. Asimismo, puede
					presentar una reclamación ante la Agencia Española de Protección de Datos.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Última actualización: mayo 2026.
				</p>
			</article>
		</PageShell>
	);
}
