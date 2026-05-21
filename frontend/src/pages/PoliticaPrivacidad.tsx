import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function PoliticaPrivacidad() {
	return (
		<PageShell>
			<SeoHead
				title="Politica de privacidad — IA Melilla"
				description="Como tratamos y protegemos los datos personales de los usuarios del sitio iamelilla.com."
				path="/politica-de-privacidad"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<h1 className="text-display-md font-bold tracking-tight">Politica de privacidad</h1>

				<p className="text-body-md text-on-surface-variant mt-8 leading-relaxed">
					Joaquin Gorge Lucianez (en adelante, el responsable) informa a los usuarios sobre el
					tratamiento y proteccion de los datos personales recogidos a traves del sitio web{" "}
					{business.name} (iamelilla.com).
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Responsable del tratamiento</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Joaquin Gorge Lucianez.
					<br />
					{business.address.street}, {business.address.postalCode} {business.address.city}.
					<br />
					Email: {business.email}
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Finalidad y legitimacion</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Los datos personales recogidos se utilizan unicamente para atender la consulta o solicitud
					realizada por el usuario, asi como para el envio de comunicaciones relacionadas con los
					servicios solicitados. La base legitima del tratamiento es el consentimiento del
					interesado.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Demo IA Fiscal Melilla</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Las consultas que los usuarios envian a la demo IA Fiscal Melilla no se asocian a su
					identidad personal ni se utilizan para entrenar modelos de inteligencia artificial. Las
					consultas pueden almacenarse de forma anonimizada con fines exclusivos de mejora del
					producto.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Conservacion</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Los datos se conservan durante el tiempo necesario para cumplir con la finalidad para la
					que fueron recogidos y, posteriormente, durante los plazos legales aplicables.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Derechos del usuario</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					El usuario puede ejercer en cualquier momento los derechos de acceso, rectificacion,
					supresion, oposicion, limitacion del tratamiento y portabilidad de sus datos, dirigiendose
					por escrito al responsable en la direccion indicada. Asimismo, puede presentar una
					reclamacion ante la Agencia Española de Proteccion de Datos.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Ultima actualizacion: mayo 2026.
				</p>
			</article>
		</PageShell>
	);
}
