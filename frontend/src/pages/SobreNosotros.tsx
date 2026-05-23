import { Link } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";

export default function SobreNosotros() {
	return (
		<PageShell>
			<SeoHead
				title="Sobre nosotros — IA Melilla"
				description="IA Melilla. Inteligencia artificial accesible nacida en Melilla, para Melilla y para el mundo. Página en construcción."
				path="/sobre-nosotros"
			/>
			<section className="mx-auto flex min-h-[70vh] max-w-[1200px] flex-col justify-center px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-6">Sobre nosotros</p>
				<h1 className="text-display-md md:text-display-lg font-bold tracking-tight break-words max-w-3xl">
					Página en construcción.
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					Estamos preparando una página con la historia de IA Melilla: cómo
					empezamos, qué nos mueve y cómo trabajamos. Mientras tanto puedes
					conocernos en{" "}
					<Link to="/contacto" className="text-primary hover:underline">
						contacto
					</Link>
					, ver lo que hacemos en{" "}
					<Link to="/demos" className="text-primary hover:underline">
						demos
					</Link>{" "}
					o escribirnos directamente a hola@iamelilla.com.
				</p>
			</section>
		</PageShell>
	);
}
