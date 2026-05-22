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

// Spacing tokens — SKIP tokens that collide with Tailwind v4 --container-* scale.
// Tailwind v4 resolves max-w-* against --spacing-* before --container-* when both exist,
// so --spacing-xs/2xl/3xl/4xl/5xl would override container breakpoints and break max-w-*.
// These tokens are re-emitted as --space-* (no collision) further below.
const SPACING_CONTAINER_COLLISION = new Set(["xs", "2xl", "3xl", "4xl", "5xl"]);

const spacing = theme.theme?.extend?.spacing ?? {};
lines.push(
	"\t/* Spacing base tokens — named to avoid collision with Tailwind v4 --container-* scale.",
	"\t   REMOVED: --spacing-xs/2xl/3xl/4xl/5xl — these override --container-* and break max-w-* utilities.",
	"\t   Use numeric Tailwind utilities (p-4, gap-8, etc.) or --space-* custom vars for semantic sizes. */",
);
for (const [name, value] of Object.entries(spacing)) {
	if (SPACING_CONTAINER_COLLISION.has(name)) {
		// Emit as --space-* alias instead to preserve value without collision
		lines.push(`\t--space-${name}: ${value};`);
	} else {
		lines.push(`\t--spacing-${name}: ${value};`);
	}
}

// Container tokens — Tailwind v4 default scale.
// CRITICAL: These must exist so max-w-* utilities resolve against --container-*
// NOT against --spacing-*. Without these, max-w-4xl → 96px (--spacing-4xl)
// instead of 56rem (--container-4xl), causing layout collapse.
// Added 2026-05-22 to fix Tailwind v4 token collision.
lines.push("\t/* Container scale (max-w-* utilities) — Tailwind v4 default */");
const containerScale = {
	"3xs": "16rem",
	"2xs": "18rem",
	xs: "20rem",
	sm: "24rem",
	md: "28rem",
	lg: "32rem",
	xl: "36rem",
	"2xl": "42rem",
	"3xl": "48rem",
	"4xl": "56rem",
	"5xl": "64rem",
	"6xl": "72rem",
	"7xl": "80rem",
};
for (const [name, value] of Object.entries(containerScale)) {
	lines.push(`\t--container-${name}: ${value};`);
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
