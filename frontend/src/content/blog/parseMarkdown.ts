import type { BlogBlock } from "./types";

const IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/;
const PLACEHOLDER_RE = /^placeholder:(.+)$/;
const H2_RE = /^##\s+(.+)$/;
const H3_RE = /^###\s+(.+)$/;
const ULIST_RE = /^[-*]\s+(.+)$/;
const OLIST_RE = /^\d+\.\s+(.+)$/;
const QUOTE_RE = /^>\s+(.+)$/;

export function parseMarkdownBody(body: string): BlogBlock[] {
	const lines = body.replace(/\r\n/g, "\n").split("\n");
	const blocks: BlogBlock[] = [];
	let i = 0;
	let introUsed = false;

	while (i < lines.length) {
		const raw = lines[i];
		const line = raw.trimEnd();

		if (line.trim() === "") {
			i++;
			continue;
		}

		const img = line.match(IMAGE_RE);
		if (img) {
			const [, alt, src] = img;
			const placeholderMatch = src.match(PLACEHOLDER_RE);
			if (placeholderMatch) {
				blocks.push({ type: "image", alt, placeholder: placeholderMatch[1] });
			} else {
				blocks.push({ type: "image", alt, src });
			}
			i++;
			continue;
		}

		const h2 = line.match(H2_RE);
		if (h2) {
			blocks.push({ type: "h2", text: h2[1].trim() });
			i++;
			continue;
		}

		const h3 = line.match(H3_RE);
		if (h3) {
			blocks.push({ type: "h3", text: h3[1].trim() });
			i++;
			continue;
		}

		if (ULIST_RE.test(line)) {
			const items: string[] = [];
			while (i < lines.length) {
				const m = lines[i].trimEnd().match(ULIST_RE);
				if (!m) break;
				items.push(m[1].trim());
				i++;
			}
			blocks.push({ type: "ulist", items });
			continue;
		}

		if (OLIST_RE.test(line)) {
			const items: string[] = [];
			while (i < lines.length) {
				const m = lines[i].trimEnd().match(OLIST_RE);
				if (!m) break;
				items.push(m[1].trim());
				i++;
			}
			blocks.push({ type: "olist", items });
			continue;
		}

		const quote = line.match(QUOTE_RE);
		if (quote) {
			const text = quote[1].trim();
			if (!introUsed && blocks.length === 0) {
				blocks.push({ type: "intro", text });
				introUsed = true;
			} else {
				blocks.push({ type: "quote", text });
			}
			i++;
			continue;
		}

		const paragraphLines = [line];
		i++;
		while (
			i < lines.length &&
			lines[i].trim() !== "" &&
			!H2_RE.test(lines[i]) &&
			!H3_RE.test(lines[i]) &&
			!ULIST_RE.test(lines[i]) &&
			!OLIST_RE.test(lines[i]) &&
			!QUOTE_RE.test(lines[i]) &&
			!IMAGE_RE.test(lines[i])
		) {
			paragraphLines.push(lines[i].trimEnd());
			i++;
		}
		blocks.push({ type: "paragraph", text: paragraphLines.join(" ").trim() });
	}

	return blocks;
}
