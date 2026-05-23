import type { BlogPost } from "./types";
import { parseFrontmatter } from "./parseFrontmatter";
import { parseMarkdownBody } from "./parseMarkdown";

/**
 * Posts del blog leídos en build time desde frontend/content/blog/*.md
 * mediante import.meta.glob de Vite. Cada archivo .md tiene frontmatter
 * YAML (slug, title, description, publishedAt, readingMinutes, tags, cover)
 * y body markdown que se parsea a bloques tipados (intro, h2, h3,
 * paragraph, ulist, olist, quote, image).
 *
 * Para añadir un post nuevo, basta con crear otro .md en esa carpeta
 * desde el panel /admin (Sveltia CMS). El build siguiente lo incluirá
 * automáticamente sin tocar este archivo.
 */
const rawFiles = import.meta.glob("../../../content/blog/*.md", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

interface FrontmatterCover {
	alt?: string;
	src?: string;
	placeholder?: string;
}

function asString(v: unknown, fallback = ""): string {
	if (typeof v === "string") return v;
	if (typeof v === "number") return String(v);
	return fallback;
}

function asNumber(v: unknown, fallback = 5): number {
	if (typeof v === "number") return v;
	if (typeof v === "string") {
		const n = Number(v);
		if (!Number.isNaN(n)) return n;
	}
	return fallback;
}

function asStringArray(v: unknown): string[] {
	if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
	return [];
}

function buildPost(path: string, raw: string): BlogPost {
	const { data, body } = parseFrontmatter(raw);
	const cover = (data.cover ?? {}) as FrontmatterCover;
	const filename = path.split("/").pop()?.replace(/\.md$/, "") ?? "";
	const slug = asString(data.slug, filename);
	return {
		slug,
		title: asString(data.title),
		description: asString(data.description),
		publishedAt: asString(data.publishedAt),
		readingMinutes: asNumber(data.readingMinutes),
		tags: asStringArray(data.tags),
		cover: {
			alt: cover.alt ?? "",
			src: cover.src,
			placeholder: cover.placeholder,
		},
		blocks: parseMarkdownBody(body),
	};
}

export const blogPosts: readonly BlogPost[] = Object.entries(rawFiles)
	.map(([path, raw]) => buildPost(path, raw))
	.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}
