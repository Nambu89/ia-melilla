import { PageShell } from "@/components/layout/PageShell";
import { business } from "@/content/shared";

export default function AvisoLegal() {
	return (
		<PageShell>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<h1 className="text-display-md font-bold tracking-tight">Aviso legal</h1>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Datos identificativos</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Titular del sitio web: Joaquin Gorge Lucianez.
					<br />
					Direccion: {business.address.street}, {business.address.postalCode}{" "}
					{business.address.city}.
					<br />
					Email: {business.email}
					<br />
					Telefono: {business.phone}
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Objeto</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					El presente aviso legal regula el uso del sitio web {business.name} (iamelilla.com),
					propiedad del titular indicado. La navegacion y uso del sitio atribuye la condicion de
					usuario, lo que implica la aceptacion plena de todas las condiciones aqui descritas.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Propiedad intelectual</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Todos los contenidos, textos, graficos, codigo fuente y resto de elementos del sitio
					estan protegidos por la legislacion vigente en materia de propiedad intelectual e
					industrial.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Limitacion de responsabilidad</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					El titular no se responsabiliza de los daños y perjuicios que puedan derivarse del uso de
					la informacion contenida en el sitio. El usuario es responsable de las consecuencias que
					deriven de la utilizacion de los servicios.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Legislacion aplicable</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Las presentes condiciones se rigen por la legislacion española. Cualquier controversia
					sera sometida a los Juzgados y Tribunales de Melilla.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Ultima actualizacion: mayo 2026.
				</p>
			</article>
		</PageShell>
	);
}
