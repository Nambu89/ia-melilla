import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { BlogContent, PlaceholderImage } from "@/components/blog/BlogContent";
import { blogPosts, getPostBySlug } from "@/content/blog/posts";
import NotFound from "./NotFound";

function formatDate(iso: string): string {
	const date = new Date(iso);
	return date.toLocaleDateString("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export default function BlogPostPage() {
	const { slug } = useParams<{ slug: string }>();
	const post = slug ? getPostBySlug(slug) : undefined;

	if (!post) return <NotFound />;

	const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

	return (
		<PageShell>
			<SeoHead
				title={`${post.title} — IA Melilla`}
				description={post.description}
				path={`/blog/${post.slug}`}
			/>
			<article>
				<header className="mx-auto max-w-[800px] px-6 pt-12 pb-8 md:pt-16">
					<Link
						to="/blog"
						className="inline-flex items-center gap-1.5 text-label-lg text-on-surface-variant transition-colors hover:text-on-surface"
					>
						<ChevronLeft size={16} />
						Volver al blog
					</Link>
					<RevealOnScroll>
						<div className="mt-8 flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-caps text-on-surface-variant"
								>
									{tag}
								</span>
							))}
						</div>
						<h1 className="mt-6 text-display-md md:text-display-lg font-bold tracking-tight text-on-surface break-words hyphens-auto">
							{post.title}
						</h1>
						<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
							{post.description}
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-5 text-label-md text-on-surface-muted">
							<span className="inline-flex items-center gap-1.5">
								<Calendar className="h-4 w-4" aria-hidden />
								{formatDate(post.publishedAt)}
							</span>
							<span className="inline-flex items-center gap-1.5">
								<Clock className="h-4 w-4" aria-hidden />
								{post.readingMinutes} min de lectura
							</span>
						</div>
					</RevealOnScroll>
				</header>

				<div className="mx-auto max-w-[800px] px-6">
					<RevealOnScroll delay={0.1}>
						<PlaceholderImage
							alt={post.cover.alt}
							placeholder={post.cover.placeholder}
							className="!aspect-[16/8]"
						/>
					</RevealOnScroll>
				</div>

				<div className="mx-auto max-w-[800px] px-6 pt-12 pb-16">
					<BlogContent blocks={post.blocks} />
				</div>

				<aside className="mx-auto max-w-[800px] px-6 pb-12">
					<RevealOnScroll>
						<div className="rounded-xl border border-primary/30 bg-surface-container p-8 md:p-10">
							<p className="text-label-caps text-primary mb-3">
								¿LISTO PARA EL SIGUIENTE PASO?
							</p>
							<h2 className="text-headline-md font-semibold tracking-tight">
								Te ayudamos a aplicar esto a tu negocio.
							</h2>
							<p className="mt-3 text-body-md text-on-surface-variant max-w-xl">
								Primera reunión sin coste. Te decimos qué procesos automatizar
								primero y con qué tecnología, sin compromiso.
							</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<Button asChild size="lg">
									<Link to="/contacto">Pedir cita</Link>
								</Button>
								<Button asChild variant="outline" size="lg">
									<Link to="/demos">Ver demos en vivo</Link>
								</Button>
							</div>
						</div>
					</RevealOnScroll>
				</aside>

				{related.length > 0 && (
					<section className="mx-auto max-w-[1200px] px-6 pb-24">
						<RevealOnScroll>
							<p className="text-label-caps uppercase tracking-[0.12em] text-on-surface-muted mb-3">
								SIGUE LEYENDO
							</p>
							<h2 className="text-headline-md font-semibold tracking-tight">
								Más artículos del blog
							</h2>
						</RevealOnScroll>
						<div className="mt-10 grid gap-6 md:grid-cols-2">
							{related.map((p, i) => (
								<RevealOnScroll key={p.slug} delay={i * 0.08}>
									<Link
										to={`/blog/${p.slug}`}
										className="group flex h-full flex-col gap-3 rounded-xl border border-outline-variant bg-surface-container p-6 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
									>
										<div className="flex flex-wrap gap-2">
											{p.tags.slice(0, 2).map((tag) => (
												<span
													key={tag}
													className="rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-0.5 text-label-caps text-on-surface-variant"
												>
													{tag}
												</span>
											))}
										</div>
										<h3 className="text-headline-sm font-semibold tracking-tight text-on-surface">
											{p.title}
										</h3>
										<p className="text-body-md text-on-surface-variant line-clamp-2">
											{p.description}
										</p>
										<div className="mt-auto flex items-center gap-1.5 text-label-lg font-medium text-primary transition-transform duration-200 group-hover:translate-x-1">
											Leer
											<ArrowRight size={14} />
										</div>
									</Link>
								</RevealOnScroll>
							))}
						</div>
					</section>
				)}
			</article>
		</PageShell>
	);
}
