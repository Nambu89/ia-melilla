import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function AvisoLegal() {
	return (
		<PageShell>
			<SeoHead
				title="Aviso legal — IA Melilla"
				description="Aviso legal del sitio iamelilla.com, propiedad de Joaquín Gorge Lucianez. Datos identificativos y condiciones de uso."
				path="/aviso-legal"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<h1 className="text-display-md font-bold tracking-tight">Aviso legal</h1>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Datos identificativos</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Titular del sitio web: Joaquín Gorge Lucianez.
					<br />
					Dirección: {business.address.street}, {business.address.postalCode}{" "}
					{business.address.city}.
					<br />
					Email: {business.email}
					<br />
					Teléfono: {business.phone}
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Objeto</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					El presente aviso legal regula el uso del sitio web {business.name} (iamelilla.com),
					propiedad del titular indicado. La navegación y uso del sitio atribuye la condición de
					usuario, lo que implica la aceptación plena de todas las condiciones aquí descritas.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Propiedad intelectual</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Todos los contenidos, textos, gráficos, código fuente y resto de elementos del sitio
					están protegidos por la legislación vigente en materia de propiedad intelectual e
					industrial.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Limitación de responsabilidad</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					El titular no se responsabiliza de los daños y perjuicios que puedan derivarse del uso de
					la información contenida en el sitio. El usuario es responsable de las consecuencias que
					deriven de la utilización de los servicios.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Legislación aplicable</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Las presentes condiciones se rigen por la legislación española. Cualquier controversia
					será sometida a los Juzgados y Tribunales de Melilla.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Última actualización: mayo 2026.
				</p>
			</article>
		</PageShell>
	);
}
