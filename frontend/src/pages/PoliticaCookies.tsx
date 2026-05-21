import { PageShell } from "@/components/layout/PageShell";
import { business } from "@/content/shared";

export default function PoliticaCookies() {
	return (
		<PageShell>
			<article className="mx-auto max-w-[800px] px-6 pt-16 pb-24">
				<h1 className="text-display-md font-bold tracking-tight">Politica de cookies</h1>

				<p className="text-body-md text-on-surface-variant mt-8 leading-relaxed">
					En el sitio web {business.name} utilizamos cookies para garantizar el correcto
					funcionamiento del sitio y, opcionalmente, para analizar el uso agregado de la web. Esta
					politica explica que son las cookies, cuales usamos y como puedes gestionarlas.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">¿Que son las cookies?</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador
					del usuario para recordar informacion sobre la visita. Las cookies pueden ser tecnicas
					(necesarias para el funcionamiento del sitio) o analiticas (que recopilan informacion
					estadistica).
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Cookies que utilizamos</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Actualmente solo utilizamos cookies tecnicas estrictamente necesarias para el
					funcionamiento del sitio. No utilizamos cookies analiticas ni de publicidad de terceros
					sin tu consentimiento explicito.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Como gestionar las cookies</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies en cualquier
					momento. Cada navegador tiene sus propias instrucciones. Ten en cuenta que rechazar las
					cookies tecnicas puede afectar al funcionamiento del sitio.
				</p>

				<h2 className="mt-12 text-headline-md font-semibold tracking-tight">Cambios en esta politica</h2>
				<p className="text-body-md text-on-surface-variant mt-4 leading-relaxed">
					Podemos actualizar esta politica de cookies. Cualquier cambio significativo sera notificado
					en esta misma pagina.
				</p>

				<p className="text-body-sm text-on-surface-muted mt-16">
					Ultima actualizacion: mayo 2026.
				</p>
			</article>
		</PageShell>
	);
}
