type FrontmatterValue = string | number | string[] | Record<string, unknown>;

export interface ParsedDocument {
	data: Record<string, FrontmatterValue>;
	body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function unquote(s: string): string {
	const trimmed = s.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function parseScalar(raw: string): string | number {
	const trimmed = raw.trim();
	const unq = unquote(trimmed);
	if (unq !== trimmed) return unq;
	const num = Number(trimmed);
	if (!Number.isNaN(num) && /^-?\d+(\.\d+)?$/.test(trimmed)) return num;
	return trimmed;
}

export function parseFrontmatter(raw: string): ParsedDocument {
	const match = raw.match(FRONTMATTER_RE);
	if (!match) return { data: {}, body: raw };
	const [, yaml, body] = match;
	const data: Record<string, FrontmatterValue> = {};
	const lines = yaml.split(/\r?\n/);
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim() || line.trim().startsWith("#")) {
			i++;
			continue;
		}
		const topLevel = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
		if (!topLevel) {
			i++;
			continue;
		}
		const [, key, rest] = topLevel;
		const restTrim = rest.trim();
		if (restTrim === "") {
			const items: string[] = [];
			const obj: Record<string, string | number> = {};
			let j = i + 1;
			while (j < lines.length) {
				const next = lines[j];
				if (/^[A-Za-z_]/.test(next)) break;
				const itemMatch = next.match(/^\s+-\s+(.+)$/);
				const objMatch = next.match(/^\s+([A-Za-z_][A-Za-z0-9_]*):\s*(.+)$/);
				if (itemMatch) {
					items.push(unquote(itemMatch[1].trim()));
				} else if (objMatch) {
					obj[objMatch[1]] = parseScalar(objMatch[2]);
				}
				j++;
			}
			data[key] = items.length > 0 ? items : obj;
			i = j;
		} else {
			data[key] = parseScalar(restTrim);
			i++;
		}
	}
	return { data, body };
}
