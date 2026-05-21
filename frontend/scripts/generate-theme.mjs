/**
 * Generates src/styles/theme.css from DESIGN.md tokens via @google/design.md CLI.
 *
 * Run with: npm run theme:gen
 *
 * The CLI's `tailwind` export gives a v3-style theme.extend JSON. We convert it
 * to Tailwind v4 CSS-variable form inside a `@theme` block so v4 picks it up
 * natively without a tailwind.config.ts.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const designPath = join(projectRoot, "DESIGN.md");
const themePath = join(projectRoot, "src", "styles", "theme.css");
const cliPath = join(projectRoot, "node_modules", "@google", "design.md", "dist", "index.js");

const stdout = execFileSync("node", [cliPath, "export", "--format", "tailwind", designPath], {
	encoding: "utf-8",
});
const theme = JSON.parse(stdout);

const lines = [
	"/* AUTO-GENERATED from DESIGN.md by scripts/generate-theme.mjs. Do not edit by hand. */",
	"@theme {",
];

const colors = theme.theme?.extend?.colors ?? {};
for (const [name, value] of Object.entries(colors)) {
	lines.push(`\t--color-${name}: ${value};`);
}

const fontFamilies = theme.theme?.extend?.fontFamily ?? {};
for (const [name, value] of Object.entries(fontFamilies)) {
	const families = Array.isArray(value) ? value : [value];
	const fallback =
		name === "code-md"
			? "ui-monospace, monospace"
			: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
	lines.push(`\t--font-${name}: ${families.join(", ")}, ${fallback};`);
}

const fontSizes = theme.theme?.extend?.fontSize ?? {};
for (const [name, entry] of Object.entries(fontSizes)) {
	const [size, props = {}] = Array.isArray(entry) ? entry : [entry, {}];
	lines.push(`\t--text-${name}: ${size};`);
	if (props.lineHeight !== undefined) lines.push(`\t--leading-${name}: ${props.lineHeight};`);
	if (props.letterSpacing !== undefined)
		lines.push(`\t--tracking-${name}: ${props.letterSpacing};`);
	if (props.fontWeight !== undefined)
		lines.push(`\t--font-weight-${name}: ${props.fontWeight};`);
}

const spacing = theme.theme?.extend?.spacing ?? {};
for (const [name, value] of Object.entries(spacing)) {
	lines.push(`\t--spacing-${name}: ${value};`);
}

const rounded = theme.theme?.extend?.borderRadius ?? {};
for (const [name, value] of Object.entries(rounded)) {
	lines.push(`\t--radius-${name}: ${value};`);
}

lines.push("}", "");

writeFileSync(themePath, lines.join("\n"), "utf-8");
console.log(`Theme written → ${themePath}`);
console.log(
	`Tokens: ${Object.keys(colors).length} colors, ${Object.keys(fontFamilies).length} fonts, ${Object.keys(fontSizes).length} sizes, ${Object.keys(spacing).length} spacing, ${Object.keys(rounded).length} radii.`,
);
