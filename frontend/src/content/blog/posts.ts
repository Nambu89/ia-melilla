import type { BlogPost } from "./types";
import { parseFrontmatter } from "./parseFrontmatter";
import { parseMarkdownBody } from "./parseMarkdown";

const rawFiles = import.meta.glob("/content/blog/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

function buildPost(filePath: string, raw: string): BlogPost {
	const { data, body } = parseFrontmatter(raw);
	const slug =
		(typeof data.slug === "string" && data.slug) ||
		filePath.split("/").pop()!.replace(/\.md$/, "");
	const cover = (data.cover ?? {}) as {
		alt?: string;
		src?: string;
		placeholder?: string;
	};
	const publishedAt =
		typeof data.publishedAt === "string"
			? data.publishedAt
			: typeof data.publishedAt === "number"
				? String(data.publishedAt)
				: "";
	return {
		slug,
		title: typeof data.title === "string" ? data.title : "",
		description: typeof data.description === "string" ? data.description : "",
		publishedAt,
		readingMinutes:
			typeof data.readingMinutes === "number" ? data.readingMinutes : 5,
		tags: Array.isArray(data.tags) ? data.tags : [],
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
