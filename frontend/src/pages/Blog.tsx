import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";

export default function Blog() {
	return (
		<PageShell>
			<SeoHead
				title="Blog — IA Melilla"
				description="Articulos sobre inteligencia artificial, fiscalidad y emprendimiento en Melilla y mas alla."
				path="/blog"
			/>
			<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-6">BLOG</p>
				<h1 className="text-display-md font-bold tracking-tight max-w-3xl">Proximamente.</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					Estamos preparando articulos sobre IA, fiscalidad y emprendimiento en Melilla. Mientras
					tanto, puedes seguirnos en Instagram para no perderte nada.
				</p>
			</section>
		</PageShell>
	);
}
