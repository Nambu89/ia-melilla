import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";

export default function Blog() {
	return (
		<PageShell>
			<SeoHead
				title="Blog — IA Melilla"
				description="Artículos sobre inteligencia artificial, fiscalidad y emprendimiento en Melilla y más allá."
				path="/blog"
			/>
			<section className="mx-auto flex min-h-[70vh] max-w-[1200px] flex-col justify-center px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-6">BLOG</p>
				<h1 className="text-display-md md:text-display-lg font-bold tracking-tight break-words max-w-3xl">
					Próximamente.
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					Estamos preparando artículos sobre IA, fiscalidad y emprendimiento en
					Melilla. Mientras tanto, puedes seguirnos en Instagram para no
					perderte nada.
				</p>
			</section>
		</PageShell>
	);
}
