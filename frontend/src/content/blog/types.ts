export type BlogBlock =
	| { type: "intro"; text: string }
	| { type: "h2"; text: string }
	| { type: "h3"; text: string }
	| { type: "paragraph"; text: string }
	| { type: "ulist"; items: string[] }
	| { type: "olist"; items: string[] }
	| { type: "quote"; text: string }
	| { type: "image"; src?: string; alt: string; placeholder?: string };

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	readingMinutes: number;
	tags: readonly string[];
	cover: { src?: string; alt: string; placeholder?: string };
	blocks: readonly BlogBlock[];
}
