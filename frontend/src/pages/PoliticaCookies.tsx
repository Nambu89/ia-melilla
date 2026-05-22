import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { business } from "@/content/shared";

export default function PoliticaCookies() {
	return (
		<PageShell>
			<SeoHead
				title="Política de cookies — IA Melilla"
				description="Información sobre el uso de cookies en iamelilla.com: qué son, cuáles usamos y cómo gestionarlas."
				path="/politica-de-cookies"
			/>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<h1 className="text-display-md font-bold tracking-tight">Política de cookies</h1>

				<p className="text-body-md text-on-surface-variant mt-8 leading-relaxed">
					En el sitio web {business.name} utilizamos cookies para garantizar el correcto
					funcionamiento del sitio y, opcionalmente, para analizar el uso agregado de la web.
					Esta política explica qué son las cookies, cuáles usamos y cómo puedes gestionarlas.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">¿Qué son las cookies?</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador
					del usuario para recordar información sobre la visita. Las cookies pueden ser técnicas
					(necesarias para el funcionamiento del sitio) o analíticas (que recopilan información
					estadística).
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Cookies que utilizamos</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Actualmente solo utilizamos cookies técnicas estrictamente necesarias para el
					funcionamiento del sitio. No utilizamos cookies analíticas ni de publicidad de terceros
					sin tu consentimiento explícito.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Cómo gestionar las cookies</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies en cualquier
					momento. Cada navegador tiene sus propias instrucciones. Ten en cuenta que rechazar las
					cookies técnicas puede afectar al funcionamiento del sitio.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Cambios en esta política</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Podemos actualizar esta política de cookies. Cualquier cambio significativo será
					notificado en esta misma página.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Última actualización: mayo 2026.
				</p>
			</article>
		</PageShell>
	);
}
