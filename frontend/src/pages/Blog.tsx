import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
import { PlaceholderImage } from "@/components/blog/BlogContent";
import { useSpotlight } from "@/hooks/useSpotlight";
import { blogPosts } from "@/content/blog/posts";
import type { BlogPost } from "@/content/blog/types";

function formatDate(iso: string): string {
	const date = new Date(iso);
	return date.toLocaleDateString("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export default function Blog() {
	return (
		<PageShell>
			<SeoHead
				title="Blog — IA Melilla"
				description="Artículos prácticos sobre inteligencia artificial en Melilla, automatización para pymes, casos de uso y guías paso a paso."
				path="/blog"
			/>
			<section className="mx-auto max-w-[1200px] px-6 pt-16 pb-12 md:pt-24">
				<RevealOnScroll>
					<p className="text-label-caps text-primary mb-6">BLOG</p>
					<h1 className="text-display-md md:text-display-lg font-bold tracking-tight max-w-3xl">
						Inteligencia artificial en Melilla, explicada sin humo.
					</h1>
					<p className="mt-6 max-w-2xl text-body-lg text-on-surface-variant">
						Guías prácticas y casos reales para autónomos y pymes que
						quieren aplicar IA en su día a día desde Melilla.
					</p>
				</RevealOnScroll>
			</section>

			<section className="mx-auto max-w-[1200px] px-6 pb-24">
				<div className="grid gap-8 md:grid-cols-2">
					{blogPosts.map((post, i) => (
						<RevealOnScroll key={post.slug} delay={i * 0.08}>
							<PostCard post={post} />
						</RevealOnScroll>
					))}
				</div>
			</section>
		</PageShell>
	);
}

function PostCard({ post }: { post: BlogPost }) {
	const [handlers, pos] = useSpotlight<HTMLAnchorElement>();
	return (
		<Link
			to={`/blog/${post.slug}`}
			ref={handlers.ref}
			onMouseMove={handlers.onMouseMove}
			onMouseEnter={handlers.onMouseEnter}
			onMouseLeave={handlers.onMouseLeave}
			onFocus={handlers.onFocus}
			onBlur={handlers.onBlur}
			className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container transition-all duration-200 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
				style={{
					opacity: pos.opacity,
					background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(0,94,196,0.18), transparent 70%)`,
				}}
			/>
			<PlaceholderImage
				alt={post.cover.alt}
				placeholder={post.cover.placeholder}
				className="!rounded-none !rounded-t-xl !aspect-[16/8]"
			/>
			<div className="relative flex h-full flex-col gap-4 p-7">
				<div className="flex flex-wrap gap-2">
					{post.tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full border border-outline-variant bg-surface-container-low px-2.5 py-0.5 text-label-caps text-on-surface-variant"
						>
							{tag}
						</span>
					))}
				</div>
				<h2 className="text-headline-sm font-semibold tracking-tight text-on-surface">
					{post.title}
				</h2>
				<p className="text-body-md text-on-surface-variant line-clamp-3">
					{post.description}
				</p>
				<div className="mt-auto flex items-center justify-between gap-3 text-label-md text-on-surface-muted">
					<span>{formatDate(post.publishedAt)}</span>
					<span className="inline-flex items-center gap-1.5">
						<Clock className="h-3.5 w-3.5" aria-hidden />
						{post.readingMinutes} min
					</span>
				</div>
				<div className="flex items-center gap-1.5 text-label-lg font-medium text-primary transition-transform duration-200 group-hover:translate-x-1">
					Leer artículo
					<ArrowRight size={14} />
				</div>
			</div>
		</Link>
	);
}
