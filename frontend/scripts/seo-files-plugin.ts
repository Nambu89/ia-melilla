import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import { parseFrontmatter } from "../src/content/blog/parseFrontmatter";

/**
 * Genera sitemap.xml y llms.txt en tiempo de build.
 *
 * Los dos ficheros listan URLs del sitio y los dos se quedaban obsoletos en
 * cuanto alguien publicaba un post desde /admin: el sitemap de producción
 * llegó a anunciar /particulares y /portafolio, rutas que no existen y que en
 * una SPA devuelven HTTP 200 con la página de 404 (soft 404 para Google).
 *
 * Por eso no se escriben a mano en public/: las páginas fijas se declaran aquí
 * en PAGES —una sola lista que alimenta a los dos ficheros— y los posts se leen
 * de content/blog/*.md con el mismo parser de frontmatter que usa el router,
 * para que el slug del sitemap no pueda separarse del slug de la ruta real.
 *
 * Para añadir una página nueva: añadirla a PAGES. Los posts no requieren tocar
 * nada, entran solos en el build siguiente.
 */

const SITE_URL = "https://iamelilla.com";

type Section = "principal" | "demos" | "legal";

interface StaticPage {
	/** Ruta declarada en src/routes.tsx, con barra inicial. */
	path: string;
	/** Etiqueta del enlace en llms.txt. */
	label: string;
	/** Una línea sobre qué hay en la página, para llms.txt. */
	summary: string;
	section: Section;
	changefreq: "weekly" | "monthly" | "yearly";
	priority: string;
}

/**
 * Páginas públicas indexables. Fuera quedan a propósito:
 *
 * - /cliente/*  → área privada tras login, no tiene sentido indexarla.
 * - /demos/ia-fiscal-melilla/{chat,calculadora-neto,calculadora-retenciones,
 *   guia-fiscal,clasificador-facturas} → herramientas interactivas de la demo.
 *   Su contenido depende de lo que teclee el usuario, así que no hay nada
 *   estable que indexar; la portada /demos/ia-fiscal-melilla sí entra porque
 *   es una landing de verdad (propuesta, comparativa, secciones de contenido).
 * - /sobre-nosotros → hoy es un "Página en construcción". Está enlazada desde
 *   el footer, así que sacarla del sitemap no basta para que no se indexe:
 *   lleva además noindex en su SeoHead. Quitar ese noindex y añadirla aquí en
 *   cuanto se escriba el contenido.
 * - "*" (NotFound) → no es una ruta.
 */
const PAGES: readonly StaticPage[] = [
	{
		path: "/",
		label: "Inicio",
		summary:
			"Qué hace IA Melilla: chatbots, asistentes de WhatsApp, agentes verticales, contenido visual, automatizaciones e integraciones a medida.",
		section: "principal",
		changefreq: "weekly",
		priority: "1.0",
	},
	{
		path: "/empresas",
		label: "IA para empresas y autónomos",
		summary:
			"Software de IA a medida para asesorías, despachos y pymes: problemas que resuelve, proceso de trabajo y a quién va dirigido.",
		section: "principal",
		changefreq: "weekly",
		priority: "0.9",
	},
	{
		path: "/blog",
		label: "Blog",
		summary:
			"Artículos prácticos sobre inteligencia artificial en Melilla, automatización para pymes, casos de uso y guías paso a paso.",
		section: "principal",
		changefreq: "weekly",
		priority: "0.8",
	},
	{
		path: "/contacto",
		label: "Contacto",
		summary:
			"Formulario, correo (hola@iamelilla.com) y WhatsApp para hablar con el equipo.",
		section: "principal",
		changefreq: "monthly",
		priority: "0.7",
	},
	{
		path: "/demos",
		label: "Showroom de demos",
		summary:
			"Demos que se pueden probar antes de contratar nada. IA Fiscal Melilla ya está disponible.",
		section: "demos",
		changefreq: "weekly",
		priority: "0.9",
	},
	{
		path: "/demos/ia-fiscal-melilla",
		label: "IA Fiscal Melilla",
		summary:
			"Demo del régimen fiscal de Melilla: chat con citas a la norma, calculadora de neto para autónomos, calculadora de retenciones, guía fiscal y clasificador de facturas.",
		section: "demos",
		changefreq: "monthly",
		priority: "0.8",
	},
	{
		path: "/transparencia-ia",
		label: "Transparencia en IA",
		summary:
			"Modelos de IA que usa el sitio, proveedores, datos, limitaciones, sesgos y derechos del usuario conforme al Reglamento UE de IA.",
		section: "legal",
		changefreq: "monthly",
		priority: "0.6",
	},
	{
		path: "/aviso-legal",
		label: "Aviso legal",
		summary: "Titular del sitio, condiciones de uso y legislación aplicable.",
		section: "legal",
		changefreq: "yearly",
		priority: "0.3",
	},
	{
		path: "/politica-de-privacidad",
		label: "Política de privacidad",
		summary:
			"Tratamiento de datos conforme al RGPD y la LOPDGDD: finalidades, bases legales, plazos y derechos.",
		section: "legal",
		changefreq: "yearly",
		priority: "0.3",
	},
	{
		path: "/politica-de-cookies",
		label: "Política de cookies",
		summary:
			"Cookies que usa el sitio, finalidades, plazos y cómo gestionar el consentimiento.",
		section: "legal",
		changefreq: "yearly",
		priority: "0.3",
	},
	{
		path: "/terminos",
		label: "Términos y condiciones",
		summary:
			"Condiciones generales de contratación y de uso de los servicios y herramientas de IA.",
		section: "legal",
		changefreq: "yearly",
		priority: "0.3",
	},
];

export interface BlogEntry {
	slug: string;
	title: string;
	description: string;
	/** Fecha YYYY-MM-DD, o cadena vacía si el frontmatter no trae una válida. */
	publishedAt: string;
}

const SLUG_RE = /^[a-z0-9-]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/;

function asText(value: unknown): string {
	if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
	if (typeof value === "number") return String(value);
	return "";
}

/**
 * Lee los posts publicados. Mismo criterio de slug que src/content/blog/posts.ts:
 * el del frontmatter y, si falta, el nombre del fichero.
 */
function readBlogEntries(dir: string): BlogEntry[] {
	let files: string[];
	try {
		files = readdirSync(dir).filter((f) => f.endsWith(".md"));
	} catch (error) {
		// Sin posts no hay build válido: mejor romper aquí que publicar un
		// sitemap silenciosamente incompleto.
		throw new Error(
			`[seo-files] no se pudo leer ${dir}: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	const entries: BlogEntry[] = [];
	for (const file of files.sort()) {
		const raw = readFileSync(join(dir, file), "utf8");
		const { data } = parseFrontmatter(raw);
		const slug = asText(data.slug) || file.replace(/\.md$/, "");
		if (!SLUG_RE.test(slug)) {
			throw new Error(
				`[seo-files] slug no válido en content/blog/${file}: "${slug}". Solo minúsculas, números y guiones.`,
			);
		}
		const publishedAt = asText(data.publishedAt);
		entries.push({
			slug,
			title: asText(data.title) || slug,
			description: asText(data.description),
			publishedAt: ISO_DATE_RE.test(publishedAt) ? publishedAt.slice(0, 10) : "",
		});
	}
	// Más recientes primero, igual que el listado del blog.
	return entries.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function urlNode(
	path: string,
	changefreq: string,
	priority: string,
	lastmod?: string,
): string {
	const lines = [
		"\t<url>",
		`\t\t<loc>${escapeXml(SITE_URL + path)}</loc>`,
		lastmod ? `\t\t<lastmod>${lastmod}</lastmod>` : "",
		`\t\t<changefreq>${changefreq}</changefreq>`,
		`\t\t<priority>${priority}</priority>`,
		"\t</url>",
	];
	return lines.filter(Boolean).join("\n");
}

export function buildSitemap(posts: readonly BlogEntry[]): string {
	const nodes = [
		...PAGES.map((p) => urlNode(p.path, p.changefreq, p.priority)),
		// lastmod solo en los posts: es el único sitio donde hay una fecha real
		// (publishedAt del frontmatter). Usar la mtime del fichero daría la del
		// checkout de Docker, o sea la del despliegue, y un lastmod que cambia
		// en cada deploy es un lastmod que los buscadores acaban ignorando.
		...posts.map((post) =>
			urlNode(`/blog/${post.slug}`, "monthly", "0.7", post.publishedAt || undefined),
		),
	];
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...nodes,
		"</urlset>",
		"",
	].join("\n");
}

/** Escapa los corchetes para que un título no rompa el enlace markdown. */
function escapeMdLabel(value: string): string {
	return value.replace(/([[\]])/g, "\\$1");
}

function mdLink(label: string, path: string, summary: string): string {
	const suffix = summary ? `: ${summary}` : "";
	return `- [${escapeMdLabel(label)}](${SITE_URL}${path})${suffix}`;
}

function pagesOf(section: Section): string[] {
	return PAGES.filter((p) => p.section === section).map((p) =>
		mdLink(p.label, p.path, p.summary),
	);
}

export function buildLlmsTxt(posts: readonly BlogEntry[]): string {
	return [
		"# IA Melilla",
		"",
		"> IA Melilla diseña, construye y mantiene soluciones de inteligencia artificial para empresas y autónomos: chatbots, asistentes de WhatsApp, agentes verticales, contenido visual, automatizaciones e integraciones a medida. Hecho en Melilla (España), útil en cualquier sitio.",
		"",
		"Sitio en español. Contacto: hola@iamelilla.com",
		"",
		"## Páginas principales",
		"",
		...pagesOf("principal"),
		"",
		"## Demos",
		"",
		...pagesOf("demos"),
		"",
		"## Blog",
		"",
		...posts.map((post) =>
			mdLink(post.title, `/blog/${post.slug}`, post.description),
		),
		"",
		"## Información legal",
		"",
		...pagesOf("legal"),
		"",
	].join("\n");
}

export function seoFilesPlugin(): Plugin {
	let root = process.cwd();
	return {
		name: "ia-melilla-seo-files",
		apply: "build",
		configResolved(config) {
			root = config.root;
		},
		generateBundle() {
			const posts = readBlogEntries(join(root, "content", "blog"));
			this.emitFile({
				type: "asset",
				fileName: "sitemap.xml",
				source: buildSitemap(posts),
			});
			this.emitFile({
				type: "asset",
				fileName: "llms.txt",
				source: buildLlmsTxt(posts),
			});
		},
	};
}
