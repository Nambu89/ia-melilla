import { chromium } from "@playwright/test";
import { writeFileSync } from "fs";
import { mkdirSync } from "fs";

const BASE_URL = "http://localhost:5173";
const SCREENSHOTS_DIR = "qa-screenshots";

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const ROUTES = [
	{ path: "/", name: "home" },
	{ path: "/empresas", name: "empresas" },
	{ path: "/particulares", name: "particulares" },
	{ path: "/demos", name: "demos-listing" },
	{ path: "/demos/ia-fiscal-melilla", name: "demo-fiscal-landing" },
	{ path: "/demos/ia-fiscal-melilla/chat", name: "demo-chat" },
	{ path: "/demos/ia-fiscal-melilla/calculadora-neto", name: "demo-calc-neto" },
	{ path: "/demos/ia-fiscal-melilla/calculadora-retenciones", name: "demo-calc-ret" },
	{ path: "/demos/ia-fiscal-melilla/guia-fiscal", name: "demo-guia" },
	{ path: "/demos/ia-fiscal-melilla/clasificador-facturas", name: "demo-facturas" },
	{ path: "/contacto", name: "contacto" },
	{ path: "/blog", name: "blog" },
	{ path: "/aviso-legal", name: "aviso-legal" },
	{ path: "/politica-de-privacidad", name: "politica-privacidad" },
	{ path: "/politica-de-cookies", name: "politica-cookies" },
];

const VIEWPORTS = [
	{ w: 1440, h: 900, name: "desktop" },
	{ w: 375, h: 812, name: "mobile" },
];

const THEMES = ["dark", "light"];

async function scrollFull(page) {
	await page.evaluate(async () => {
		const h = document.body.scrollHeight;
		const step = window.innerHeight * 0.8;
		for (let y = 0; y < h; y += step) {
			window.scrollTo({ top: y, behavior: "instant" });
			await new Promise((r) => setTimeout(r, 150));
		}
		window.scrollTo({ top: 0, behavior: "instant" });
		await new Promise((r) => setTimeout(r, 200));
	});
}

async function domChecks(page, route, vpName, theme) {
	return await page.evaluate(({ route, vpName, theme }) => {
		const issues = [];

		// Check headings with width 0 or very small
		const headings = [...document.querySelectorAll("h1,h2,h3")].map((h) => ({
			tag: h.tagName,
			text: h.textContent?.slice(0, 80).trim(),
			w: Math.round(h.getBoundingClientRect().width),
			h: Math.round(h.getBoundingClientRect().height),
			visible: h.getBoundingClientRect().width > 0,
		}));
		const zeroWidthHeadings = headings.filter((h) => h.w < 50 && h.text && h.text.length > 0);
		if (zeroWidthHeadings.length > 0) {
			issues.push({
				type: "zero-width-heading",
				detail: zeroWidthHeadings,
			});
		}

		// Check text overflow (clip/hidden)
		const overflowing = [...document.querySelectorAll("p, h1, h2, h3, span, li")].filter((el) => {
			const s = getComputedStyle(el);
			return (
				el.scrollWidth > el.clientWidth + 2 &&
				(s.overflow === "hidden" || s.textOverflow === "clip" || s.overflowX === "hidden")
			);
		});
		if (overflowing.length > 0) {
			issues.push({
				type: "text-overflow",
				count: overflowing.length,
				examples: overflowing.slice(0, 3).map((el) => ({
					tag: el.tagName,
					text: el.textContent?.slice(0, 60),
					scrollW: el.scrollWidth,
					clientW: el.clientWidth,
				})),
			});
		}

		// Body bg + color
		const bg = getComputedStyle(document.body).backgroundColor;
		const color = getComputedStyle(document.body).color;

		// Check for images that failed to load
		const brokenImages = [...document.querySelectorAll("img")].filter(
			(img) => !img.complete || img.naturalWidth === 0
		);
		if (brokenImages.length > 0) {
			issues.push({
				type: "broken-images",
				count: brokenImages.length,
				srcs: brokenImages.slice(0, 3).map((i) => i.src),
			});
		}

		// Buttons with no visible text or aria-label
		const badButtons = [...document.querySelectorAll("button")].filter((b) => {
			const text = (b.textContent || "").trim();
			const label = b.getAttribute("aria-label") || "";
			const hasIcon = b.querySelector("svg") !== null;
			return text.length === 0 && label.length === 0 && !hasIcon;
		});
		if (badButtons.length > 0) {
			issues.push({
				type: "buttons-no-label",
				count: badButtons.length,
			});
		}

		// h1 count
		const h1s = document.querySelectorAll("h1");
		if (h1s.length === 0) {
			issues.push({ type: "no-h1" });
		} else if (h1s.length > 1) {
			issues.push({
				type: "multiple-h1",
				count: h1s.length,
				texts: [...h1s].map((h) => h.textContent?.slice(0, 60)),
			});
		}

		// meta title check
		const title = document.title;
		if (!title || title.length < 5) {
			issues.push({ type: "missing-title", title });
		}

		// Check for empty sections/containers
		const emptySections = [...document.querySelectorAll("section, main")].filter((el) => {
			return el.textContent?.trim().length === 0;
		});
		if (emptySections.length > 0) {
			issues.push({
				type: "empty-sections",
				count: emptySections.length,
			});
		}

		return { bg, color, issues, headingCount: headings.length, titleTag: title };
	}, { route, vpName, theme });
}

(async () => {
	const browser = await chromium.launch({ headless: true });
	const allResults = [];
	const allConsoleErrors = [];

	for (const vp of VIEWPORTS) {
		for (const theme of THEMES) {
			const context = await browser.newContext({
				viewport: { width: vp.w, height: vp.h },
			});
			const page = await context.newPage();

			// Capture console errors per context
			const contextErrors = [];
			page.on("console", (msg) => {
				if (msg.type() === "error") {
					contextErrors.push({
						text: msg.text(),
						url: page.url(),
					});
				}
			});

			// Capture failed network requests
			const failedRequests = [];
			page.on("requestfailed", (req) => {
				failedRequests.push({
					url: req.url(),
					failure: req.failure()?.errorText,
				});
			});

			for (const route of ROUTES) {
				console.log(`[${vp.name}/${theme}] ${route.path}`);
				const routeResult = {
					route: route.path,
					name: route.name,
					viewport: vp.name,
					theme,
					issues: [],
					pageTitle: "",
					bg: "",
					consoleErrorsOnRoute: [],
				};

				try {
					// First nav to set theme
					await page.goto(`${BASE_URL}${route.path}`, {
						waitUntil: "domcontentloaded",
						timeout: 15000,
					});

					// Set theme via localStorage and reload
					await page.evaluate((t) => {
						localStorage.setItem("theme", t);
					}, theme);

					await page.reload({ waitUntil: "networkidle", timeout: 15000 });

					// Scroll to trigger lazy elements
					await scrollFull(page);

					// Screenshot
					const fname = `qa-${vp.name}-${theme}-${route.name}.jpg`;
					await page.screenshot({
						path: `${SCREENSHOTS_DIR}/${fname}`,
						fullPage: true,
						type: "jpeg",
						quality: 80,
					});
					routeResult.screenshot = fname;

					// DOM checks
					const checks = await domChecks(page, route.path, vp.name, theme);
					routeResult.issues = checks.issues;
					routeResult.pageTitle = checks.titleTag;
					routeResult.bg = checks.bg;
					routeResult.color = checks.color;
					routeResult.headingCount = checks.headingCount;

					// Capture any console errors that happened specifically on this route
					routeResult.consoleErrorsOnRoute = [...contextErrors].filter(
						(e) => e.url.includes(route.path) || e.url === `${BASE_URL}${route.path}`
					);
				} catch (err) {
					routeResult.issues.push({
						type: "navigation-error",
						error: err.message,
					});
				}

				allResults.push(routeResult);
			}

			// All errors from this context
			if (contextErrors.length > 0) {
				allConsoleErrors.push({
					viewport: vp.name,
					theme,
					errors: contextErrors,
				});
			}

			await context.close();
		}
	}

	// Theme toggle test — desktop dark -> click -> check change
	let themeToggleResult = { test: "theme-toggle", status: "NOT_RUN" };
	{
		const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
		const page = await context.newPage();
		await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle", timeout: 15000 });
		await page.evaluate(() => localStorage.setItem("theme", "dark"));
		await page.reload({ waitUntil: "networkidle", timeout: 15000 });

		const bgBefore = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
		const htmlClassBefore = await page.evaluate(() => document.documentElement.className);

		// ThemeToggle aria-label includes "Tema actual:"
		const toggleSelector = 'button[aria-label*="Tema actual"]';
		const btnExists = await page.locator(toggleSelector).count();

		let clicked = false;
		if (btnExists > 0) {
			await page.locator(toggleSelector).first().click();
			await page.waitForTimeout(600);
			clicked = true;
		}

		const bgAfter = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
		const htmlClassAfter = await page.evaluate(() => document.documentElement.className);

		themeToggleResult = {
			test: "theme-toggle",
			btnFound: btnExists > 0,
			clicked,
			bgBefore,
			bgAfter,
			htmlClassBefore,
			htmlClassAfter,
			bgChanged: bgBefore !== bgAfter,
			classChanged: htmlClassBefore !== htmlClassAfter,
		};

		// Screenshot after toggle
		await page.screenshot({
			path: `${SCREENSHOTS_DIR}/qa-theme-toggle-after.jpg`,
			fullPage: false,
			type: "jpeg",
			quality: 80,
		});

		await context.close();
	}

	await browser.close();

	// Compile final report
	const report = {
		meta: {
			date: new Date().toISOString(),
			totalRoutes: ROUTES.length,
			viewports: VIEWPORTS.map((v) => v.name),
			themes: THEMES,
			screenshotsGenerated:
				allResults.filter((r) => r.screenshot).length +
				(themeToggleResult.clicked ? 1 : 0),
		},
		themeToggle: themeToggleResult,
		consoleErrors: allConsoleErrors,
		routeResults: allResults,
		// Summary of issues
		issuesSummary: allResults
			.filter((r) => r.issues.length > 0)
			.map((r) => ({
				route: r.route,
				viewport: r.viewport,
				theme: r.theme,
				issueTypes: r.issues.map((i) => i.type),
				issues: r.issues,
			})),
	};

	writeFileSync("qa-report.json", JSON.stringify(report, null, 2));
	console.log("\n=== QA REPORT SUMMARY ===");
	console.log(`Routes tested: ${allResults.length}`);
	console.log(`Routes with issues: ${report.issuesSummary.length}`);
	console.log(`Console error contexts: ${allConsoleErrors.length}`);
	console.log(
		`Theme toggle: btn found=${themeToggleResult.btnFound}, clicked=${themeToggleResult.clicked}, bgChanged=${themeToggleResult.bgChanged}, classChanged=${themeToggleResult.classChanged}`
	);
	console.log(`Screenshots dir: ${SCREENSHOTS_DIR}/`);
	console.log("Full report: qa-report.json");
})();
