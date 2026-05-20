# Frontend Fase 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static marketing website + audience-routing landings + placeholder demo page for IA Melilla v2, deployable to Coolify.

**Architecture:** Vite + React 18 + TypeScript SPA. Routing client-side via React Router v6. Tokens from `frontend/DESIGN.md` exported to Tailwind v4 theme via `@google/design.md` CLI. Content lives in typed TypeScript constants (`src/content/`), not hardcoded in components. No backend in this phase — the contact form posts to a stub endpoint that will be wired up in Fase 2. The demo page `/demos/ia-fiscal-melilla/` ships as a non-functional UI placeholder; functional integration is Fase 2+.

**Tech Stack:**
- Build: Vite 5.x
- Framework: React 18 + TypeScript 5.x (strict mode)
- Routing: React Router v6
- Styling: Tailwind CSS v4 + tokens from DESIGN.md
- UI primitives: shadcn/ui (Button, Card, Input, Textarea, Label, Separator, Badge)
- Icons: Lucide React
- Animation: anime.js v4
- Testing: Vitest + React Testing Library + @testing-library/jest-dom
- Linting: ESLint + Prettier
- Deploy: Docker + Coolify (nginx static serve)

**Scope OUT (Fase 2+):**
- Backend integration (form submission, demo IA Fiscal functional)
- Real blog posts (placeholder index only)
- Real portfolio media (curated migration deferred)
- i18n (`/en/` route)
- E2E Playwright tests (manual smoke testing only this phase)

---

## File Structure

```
frontend/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── Dockerfile
├── nginx.conf                          # static serve config for Coolify
├── .eslintrc.cjs
├── .prettierrc
├── public/
│   ├── favicon.svg
│   ├── robots.txt                      # carries over from current site, sitemap pointer updated
│   └── sitemap.xml                     # generated build-time
├── scripts/
│   └── generate-theme.mjs              # runs @google/design.md export, writes src/styles/theme.css
└── src/
    ├── main.tsx                        # entry
    ├── App.tsx                         # Router root
    ├── routes.tsx                      # route definitions
    ├── content/
    │   ├── home.ts                     # all home copy as typed consts
    │   ├── empresas.ts
    │   ├── particulares.ts
    │   ├── demoIaFiscal.ts
    │   ├── contacto.ts
    │   ├── portafolio.ts
    │   ├── footer.ts
    │   ├── nav.ts
    │   └── shared.ts                   # business data (email, phone, address)
    ├── components/
    │   ├── ui/                         # shadcn primitives
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   ├── textarea.tsx
    │   │   ├── label.tsx
    │   │   ├── badge.tsx
    │   │   └── separator.tsx
    │   ├── layout/
    │   │   ├── Nav.tsx
    │   │   ├── Footer.tsx
    │   │   ├── WhatsAppFloat.tsx
    │   │   └── PageShell.tsx           # wraps Nav + main + Footer + WhatsAppFloat
    │   ├── sections/
    │   │   ├── Hero.tsx
    │   │   ├── AudienceSplit.tsx
    │   │   ├── DemoFlagship.tsx
    │   │   ├── ProcessSteps.tsx
    │   │   ├── AboutMelilla.tsx
    │   │   ├── CtaClose.tsx
    │   │   ├── ProblemSolutionGrid.tsx # used in /empresas/
    │   │   └── HelpfulCases.tsx        # used in /particulares/
    │   ├── demo/
    │   │   └── DemoChatPlaceholder.tsx # static mockup of IA Fiscal chat
    │   ├── contact/
    │   │   └── ContactForm.tsx
    │   ├── seo/
    │   │   └── SeoHead.tsx             # sets meta tags per route
    │   └── animations/
    │       ├── useAnimeEntry.ts        # hook for hero entry animation
    │       └── useScrollFadeIn.ts      # IntersectionObserver fade-in hook
    ├── pages/
    │   ├── Home.tsx
    │   ├── Empresas.tsx
    │   ├── Particulares.tsx
    │   ├── DemoIaFiscal.tsx
    │   ├── Contacto.tsx
    │   ├── Portafolio.tsx
    │   ├── Blog.tsx                    # placeholder listing
    │   ├── AvisoLegal.tsx
    │   ├── PoliticaPrivacidad.tsx
    │   ├── PoliticaCookies.tsx
    │   └── NotFound.tsx
    ├── lib/
    │   ├── cn.ts                       # shadcn utility (clsx + twMerge)
    │   ├── analytics.ts                # Plausible stub (optional Fase 2)
    │   └── api.ts                      # fetch wrapper + form submit stub
    ├── hooks/
    │   ├── useReducedMotion.ts
    │   └── useScrollPosition.ts        # for nav shrink
    └── styles/
        ├── globals.css                 # Tailwind imports + base
        ├── theme.css                   # generated from DESIGN.md
        └── fonts.css                   # Inter Display + JetBrains Mono @font-face
```

---

## Task 1: Initialize Vite + React + TS project

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.node.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`

- [ ] **Step 1: Scaffold via Vite CLI**

Run from repo root:
```bash
npm create vite@latest frontend -- --template react-ts
```

Expected: directory `frontend/` created with React + TS template.

- [ ] **Step 2: Install base dependencies**

```bash
cd frontend
npm install react react-dom react-router-dom
npm install -D typescript @types/react @types/react-dom @types/node vite @vitejs/plugin-react
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
npm install -D prettier
```

Expected: `package.json` lists deps, `node_modules/` created.

- [ ] **Step 3: Configure `tsconfig.json` strict mode**

Overwrite `frontend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Configure `vite.config.ts` with alias**

Overwrite `frontend/vite.config.ts`:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: { "@": path.resolve(__dirname, "src") },
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/test/setup.ts",
	},
});
```

- [ ] **Step 5: Create test setup file**

Create `frontend/src/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 6: Verify dev server boots**

```bash
cd frontend
npm run dev
```

Expected: server starts on http://localhost:5173, default Vite + React page renders. Stop server (Ctrl+C).

- [ ] **Step 7: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): init Vite + React 18 + TS scaffold"
```

---

## Task 2: Install Tailwind v4 + generate theme from DESIGN.md

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/styles/globals.css`
- Create: `frontend/src/styles/theme.css` (generated)
- Create: `frontend/scripts/generate-theme.mjs`
- Modify: `frontend/src/main.tsx`

- [ ] **Step 1: Install Tailwind v4**

```bash
cd frontend
npm install tailwindcss@next @tailwindcss/vite@next
```

Expected: deps added.

- [ ] **Step 2: Add Tailwind v4 Vite plugin**

Modify `frontend/vite.config.ts` to add the plugin:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: { "@": path.resolve(__dirname, "src") },
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/test/setup.ts",
	},
});
```

- [ ] **Step 3: Write generate-theme script**

Create `frontend/scripts/generate-theme.mjs`:
```js
import { execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const designPath = join(__dirname, "..", "..", "frontend", "DESIGN.md");
const themePath = join(__dirname, "..", "src", "styles", "theme.css");

// Run the @google/design.md CLI from the repo root node_modules
const cliPath = join(__dirname, "..", "..", "node_modules", "@google", "design.md", "dist", "index.js");
const tailwindJson = execSync(`node "${cliPath}" export --format tailwind "${designPath}"`).toString();
const theme = JSON.parse(tailwindJson);

const colors = theme.theme.extend.colors;
const cssLines = ["@theme {"];
for (const [name, value] of Object.entries(colors)) {
	cssLines.push(`  --color-${name}: ${value};`);
}

const fontFamilies = theme.theme.extend.fontFamily;
for (const [name, value] of Object.entries(fontFamilies)) {
	cssLines.push(`  --font-${name}: ${value.join(", ")};`);
}

const fontSizes = theme.theme.extend.fontSize;
for (const [name, entry] of Object.entries(fontSizes)) {
	const [size, props] = entry;
	cssLines.push(`  --text-${name}: ${size};`);
	if (props.lineHeight) cssLines.push(`  --leading-${name}: ${props.lineHeight};`);
	if (props.letterSpacing) cssLines.push(`  --tracking-${name}: ${props.letterSpacing};`);
	if (props.fontWeight) cssLines.push(`  --font-weight-${name}: ${props.fontWeight};`);
}

const spacing = theme.theme.extend.spacing || {};
for (const [name, value] of Object.entries(spacing)) {
	cssLines.push(`  --spacing-${name}: ${value};`);
}

const rounded = theme.theme.extend.borderRadius || {};
for (const [name, value] of Object.entries(rounded)) {
	cssLines.push(`  --radius-${name}: ${value};`);
}

cssLines.push("}");

writeFileSync(themePath, cssLines.join("\n") + "\n", "utf-8");
console.log(`Theme written to ${themePath}`);
```

- [ ] **Step 4: Add npm scripts**

Modify `frontend/package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write src",
    "theme:gen": "node scripts/generate-theme.mjs",
    "theme:lint": "node ../node_modules/@google/design.md/dist/index.js lint DESIGN.md"
  }
}
```

- [ ] **Step 5: Generate theme.css**

```bash
cd frontend
npm run theme:gen
```

Expected: `src/styles/theme.css` created with `@theme { ... }` block containing all DESIGN.md tokens.

- [ ] **Step 6: Write globals.css**

Create `frontend/src/styles/globals.css`:
```css
@import "tailwindcss";
@import "./theme.css";
@import "./fonts.css";

:root {
	color-scheme: dark;
}

html, body {
	background: var(--color-surface);
	color: var(--color-on-surface);
	font-family: var(--font-body-md), system-ui, sans-serif;
	font-size: var(--text-body-md);
	line-height: var(--leading-body-md);
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

body {
	margin: 0;
}

* {
	box-sizing: border-box;
}

@media (prefers-reduced-motion: reduce) {
	*, *::before, *::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}
```

- [ ] **Step 7: Write fonts.css**

Create `frontend/src/styles/fonts.css`:
```css
@font-face {
	font-family: "Inter Display";
	src: url("https://rsms.me/inter/font-files/InterDisplay-Variable.woff2") format("woff2");
	font-weight: 100 900;
	font-display: swap;
}

@font-face {
	font-family: "Inter";
	src: url("https://rsms.me/inter/font-files/Inter-Variable.woff2") format("woff2");
	font-weight: 100 900;
	font-display: swap;
}

@font-face {
	font-family: "JetBrains Mono";
	src: url("https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4xD7OwA.woff2") format("woff2");
	font-weight: 100 800;
	font-display: swap;
}
```

- [ ] **Step 8: Import globals in main.tsx**

Modify `frontend/src/main.tsx`:
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
```

- [ ] **Step 9: Verify Tailwind v4 token resolves**

Modify `frontend/src/App.tsx` to a smoke test:
```tsx
export default function App() {
	return (
		<div className="min-h-screen bg-surface text-on-surface p-8">
			<h1 className="text-display-lg font-bold">Tailwind v4 + DESIGN.md tokens OK</h1>
			<p className="text-body-md text-on-surface-variant mt-4">
				If you see emerald on a dark background, tokens resolve.
			</p>
			<button className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-md font-semibold">
				Primary CTA
			</button>
		</div>
	);
}
```

Run `npm run dev` → http://localhost:5173. Expected: charcoal background, white text, emerald button. Stop server.

- [ ] **Step 10: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): Tailwind v4 + DESIGN.md token pipeline"
```

---

## Task 3: Add shadcn/ui primitives

**Files:**
- Create: `frontend/src/lib/cn.ts`
- Create: `frontend/src/components/ui/button.tsx`
- Create: `frontend/src/components/ui/card.tsx`
- Create: `frontend/src/components/ui/input.tsx`
- Create: `frontend/src/components/ui/textarea.tsx`
- Create: `frontend/src/components/ui/label.tsx`
- Create: `frontend/src/components/ui/badge.tsx`
- Create: `frontend/src/components/ui/separator.tsx`
- Create: `frontend/src/components/ui/__tests__/button.test.tsx`

- [ ] **Step 1: Install shadcn dependencies**

```bash
cd frontend
npm install class-variance-authority clsx tailwind-merge lucide-react
```

- [ ] **Step 2: Write cn utility**

Create `frontend/src/lib/cn.ts`:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Write Button component**

Create `frontend/src/components/ui/button.tsx`:
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
	"inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none rounded-md",
	{
		variants: {
			variant: {
				primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active",
				secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
				ghost: "bg-transparent text-on-surface hover:bg-surface-container-low",
				outline:
					"bg-transparent text-on-surface border border-outline hover:bg-surface-container-low",
				b2b: "bg-tertiary-container text-on-tertiary-container hover:opacity-90",
				b2c: "bg-secondary-container text-on-secondary-container hover:opacity-90",
			},
			size: {
				sm: "h-9 px-4 text-label-md",
				md: "h-11 px-6 text-label-lg",
				lg: "h-14 px-8 text-label-lg",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => (
		<button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
	),
);
Button.displayName = "Button";
```

- [ ] **Step 4: Write Button test**

Create `frontend/src/components/ui/__tests__/button.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
	it("renders children", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
	});

	it("applies primary variant by default", () => {
		render(<Button>Primary</Button>);
		expect(screen.getByRole("button")).toHaveClass("bg-primary");
	});

	it("applies b2b variant when requested", () => {
		render(<Button variant="b2b">B2B</Button>);
		expect(screen.getByRole("button")).toHaveClass("bg-tertiary-container");
	});

	it("respects disabled state", () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});
});
```

- [ ] **Step 5: Run test, verify pass**

```bash
cd frontend
npm test -- --run button.test
```

Expected: 4 tests pass.

- [ ] **Step 6: Write Card component**

Create `frontend/src/components/ui/card.tsx`:
```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("bg-surface-container text-on-surface rounded-lg p-6", className)}
			{...props}
		/>
	),
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
	),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h3
			ref={ref}
			className={cn("text-headline-sm font-semibold tracking-tight", className)}
			{...props}
		/>
	),
);
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("text-body-md text-on-surface-variant", className)} {...props} />
	),
);
CardContent.displayName = "CardContent";
```

- [ ] **Step 7: Write Input component**

Create `frontend/src/components/ui/input.tsx`:
```tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	({ className, ...props }, ref) => (
		<input
			ref={ref}
			className={cn(
				"h-11 w-full bg-surface-container-low text-on-surface text-body-md rounded-md px-4 py-3 placeholder:text-on-surface-muted focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
				className,
			)}
			{...props}
		/>
	),
);
Input.displayName = "Input";
```

- [ ] **Step 8: Write Textarea component**

Create `frontend/src/components/ui/textarea.tsx`:
```tsx
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
	({ className, ...props }, ref) => (
		<textarea
			ref={ref}
			className={cn(
				"min-h-32 w-full bg-surface-container-low text-on-surface text-body-md rounded-md px-4 py-3 placeholder:text-on-surface-muted focus:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
				className,
			)}
			{...props}
		/>
	),
);
Textarea.displayName = "Textarea";
```

- [ ] **Step 9: Write Label, Badge, Separator**

Create `frontend/src/components/ui/label.tsx`:
```tsx
import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
	({ className, ...props }, ref) => (
		<label
			ref={ref}
			className={cn("text-label-md text-on-surface-variant", className)}
			{...props}
		/>
	),
);
Label.displayName = "Label";
```

Create `frontend/src/components/ui/badge.tsx`:
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
	"inline-flex items-center text-label-caps rounded-full px-3 py-1",
	{
		variants: {
			variant: {
				default: "bg-surface-container-high text-on-surface",
				primary: "bg-primary-container text-on-primary-container",
				b2b: "bg-tertiary-container text-on-tertiary-container",
				b2c: "bg-secondary-container text-on-secondary-container",
				success: "bg-success-container text-on-success-container",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

export interface BadgeProps
	extends HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
```

Create `frontend/src/components/ui/separator.tsx`:
```tsx
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("h-px w-full bg-outline-variant", className)} {...props} />;
}
```

- [ ] **Step 10: Run full test suite to verify nothing broke**

```bash
cd frontend
npm test -- --run
```

Expected: button test still passes (4/4).

- [ ] **Step 11: Commit**

```bash
git add frontend/src/components/ui/ frontend/src/lib/cn.ts
git commit -m "feat(frontend): shadcn primitives — Button Card Input Textarea Label Badge Separator"
```

---

## Task 4: Routes + page placeholders

**Files:**
- Create: `frontend/src/routes.tsx`
- Modify: `frontend/src/App.tsx`
- Create: `frontend/src/pages/Home.tsx`
- Create: `frontend/src/pages/Empresas.tsx`
- Create: `frontend/src/pages/Particulares.tsx`
- Create: `frontend/src/pages/DemoIaFiscal.tsx`
- Create: `frontend/src/pages/Contacto.tsx`
- Create: `frontend/src/pages/Portafolio.tsx`
- Create: `frontend/src/pages/Blog.tsx`
- Create: `frontend/src/pages/AvisoLegal.tsx`
- Create: `frontend/src/pages/PoliticaPrivacidad.tsx`
- Create: `frontend/src/pages/PoliticaCookies.tsx`
- Create: `frontend/src/pages/NotFound.tsx`

- [ ] **Step 1: Define routes**

Create `frontend/src/routes.tsx`:
```tsx
import { type RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Empresas from "@/pages/Empresas";
import Particulares from "@/pages/Particulares";
import DemoIaFiscal from "@/pages/DemoIaFiscal";
import Contacto from "@/pages/Contacto";
import Portafolio from "@/pages/Portafolio";
import Blog from "@/pages/Blog";
import AvisoLegal from "@/pages/AvisoLegal";
import PoliticaPrivacidad from "@/pages/PoliticaPrivacidad";
import PoliticaCookies from "@/pages/PoliticaCookies";
import NotFound from "@/pages/NotFound";

export const routes: RouteObject[] = [
	{ path: "/", element: <Home /> },
	{ path: "/empresas", element: <Empresas /> },
	{ path: "/particulares", element: <Particulares /> },
	{ path: "/demos/ia-fiscal-melilla", element: <DemoIaFiscal /> },
	{ path: "/contacto", element: <Contacto /> },
	{ path: "/portafolio", element: <Portafolio /> },
	{ path: "/blog", element: <Blog /> },
	{ path: "/aviso-legal", element: <AvisoLegal /> },
	{ path: "/politica-de-privacidad", element: <PoliticaPrivacidad /> },
	{ path: "/politica-de-cookies", element: <PoliticaCookies /> },
	{ path: "*", element: <NotFound /> },
];
```

- [ ] **Step 2: Wire BrowserRouter in App.tsx**

Overwrite `frontend/src/App.tsx`:
```tsx
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";

function AppRoutes() {
	return useRoutes(routes);
}

export default function App() {
	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	);
}
```

- [ ] **Step 3: Create placeholder pages**

For each page file, use this template (replace `<Name>` and `<Path>`):

Create `frontend/src/pages/Home.tsx`:
```tsx
export default function Home() {
	return (
		<main className="min-h-screen p-8">
			<h1 className="text-display-md font-bold">Home</h1>
			<p className="text-body-md text-on-surface-variant mt-4">Placeholder</p>
		</main>
	);
}
```

Repeat for: `Empresas.tsx`, `Particulares.tsx`, `DemoIaFiscal.tsx`, `Contacto.tsx`, `Portafolio.tsx`, `Blog.tsx`, `AvisoLegal.tsx`, `PoliticaPrivacidad.tsx`, `PoliticaCookies.tsx` — same body, swap H1 label.

Create `frontend/src/pages/NotFound.tsx`:
```tsx
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-8 gap-4">
			<h1 className="text-display-md font-bold">404</h1>
			<p className="text-body-lg text-on-surface-variant">Pagina no encontrada.</p>
			<Link to="/" className="text-primary underline">
				Volver al inicio
			</Link>
		</main>
	);
}
```

- [ ] **Step 4: Run dev server, smoke test routes**

```bash
cd frontend
npm run dev
```

Manually check in browser:
- `http://localhost:5173/` → Home
- `http://localhost:5173/empresas` → Empresas
- `http://localhost:5173/particulares` → Particulares
- `http://localhost:5173/demos/ia-fiscal-melilla` → DemoIaFiscal
- `http://localhost:5173/contacto` → Contacto
- `http://localhost:5173/portafolio` → Portafolio
- `http://localhost:5173/blog` → Blog
- `http://localhost:5173/aviso-legal` → AvisoLegal
- `http://localhost:5173/politica-de-privacidad` → PoliticaPrivacidad
- `http://localhost:5173/politica-de-cookies` → PoliticaCookies
- `http://localhost:5173/garbage` → NotFound

Stop server.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): React Router v6 + 11 page placeholders"
```

---

## Task 5: Content constants (typed)

**Files:**
- Create: `frontend/src/content/shared.ts`
- Create: `frontend/src/content/nav.ts`
- Create: `frontend/src/content/footer.ts`
- Create: `frontend/src/content/home.ts`
- Create: `frontend/src/content/empresas.ts`
- Create: `frontend/src/content/particulares.ts`
- Create: `frontend/src/content/demoIaFiscal.ts`
- Create: `frontend/src/content/contacto.ts`
- Create: `frontend/src/content/portafolio.ts`

- [ ] **Step 1: Shared business data**

Create `frontend/src/content/shared.ts`:
```ts
export const business = {
	name: "IA Melilla",
	email: "hola@iamelilla.com",
	phone: "+34 654 186 173",
	phoneIntl: "34654186173",
	whatsappUrl:
		"https://wa.me/34654186173?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20de%20IA%20Melilla",
	instagram: "https://www.instagram.com/iamelilla/",
	linkedin: "https://www.linkedin.com/company/iamelilla/",
	facebook: "https://www.facebook.com/iamelilla/",
	address: {
		street: "C/ Doctor Juan Rios Garcia, 7 2ºA",
		postalCode: "52003",
		city: "Melilla",
		country: "España",
	},
} as const;
```

- [ ] **Step 2: Nav content**

Create `frontend/src/content/nav.ts`:
```ts
export const navContent = {
	logoAlt: "IA Melilla",
	links: [
		{ label: "Empresas", href: "/empresas" },
		{ label: "Particulares", href: "/particulares" },
		{ label: "Demos", href: "/demos/ia-fiscal-melilla" },
		{ label: "Portafolio", href: "/portafolio" },
		{ label: "Blog", href: "/blog" },
		{ label: "Contacto", href: "/contacto" },
	],
	ctaLabel: "Probar IA Fiscal",
	ctaHref: "/demos/ia-fiscal-melilla",
} as const;
```

- [ ] **Step 3: Footer content**

Create `frontend/src/content/footer.ts`:
```ts
export const footerContent = {
	tagline:
		"Inteligencia artificial practica para empresas, autonomos y particulares. Hecho en Melilla, util en cualquier sitio.",
	columns: [
		{
			title: "Producto",
			links: [
				{ label: "Demos", href: "/demos/ia-fiscal-melilla" },
				{ label: "Empresas", href: "/empresas" },
				{ label: "Particulares", href: "/particulares" },
				{ label: "Portafolio", href: "/portafolio" },
			],
		},
		{
			title: "Recursos",
			links: [
				{ label: "Blog", href: "/blog" },
			],
		},
		{
			title: "Legal",
			links: [
				{ label: "Aviso legal", href: "/aviso-legal" },
				{ label: "Politica de privacidad", href: "/politica-de-privacidad" },
				{ label: "Politica de cookies", href: "/politica-de-cookies" },
			],
		},
	],
	copyrightYear: 2026,
} as const;
```

- [ ] **Step 4: Home content**

Create `frontend/src/content/home.ts`. Copy verbatim from `plans/copy-v2-2026-05-21.md` section Home, structured as TS constants:

```ts
export const homeContent = {
	hero: {
		eyebrow: "IA APLICADA · DESDE MELILLA",
		headline: "Inteligencia artificial que resuelve. Sin humo.",
		subheadline:
			"Construimos asistentes de IA para empresas y particulares. Empezamos por lo dificil: el regimen fiscal de Melilla. Seguimos por lo que tu necesites.",
		primaryCta: { label: "Probar IA Fiscal Melilla →", href: "/demos/ia-fiscal-melilla" },
		secondaryCta: { label: "Como trabajamos", href: "#como-trabajamos" },
	},
	audienceSplit: {
		eyebrow: "ELIGE TU CAMINO",
		headline: "Dos publicos. Una misma tecnologia.",
		cards: [
			{
				audience: "b2b" as const,
				badge: "EMPRESAS Y AUTONOMOS",
				title: "Para tu negocio",
				description:
					"Automatiza consultas repetidas, da soporte 24/7 sin renunciar a tu equipo, integra IA con el software que ya usas.",
				bullets: [
					"Asesorias fiscales que automatizan consultas IPSI y renta",
					"Atencion al cliente que no descansa",
					"Procesos administrativos sin papeleo manual",
				],
				cta: { label: "Soluciones para empresas →", href: "/empresas" },
			},
			{
				audience: "b2c" as const,
				badge: "PARTICULARES",
				title: "Para tu dia a dia",
				description:
					"Pregunta lo que necesites sobre fiscalidad o tramites. Respuesta clara, con fuentes oficiales. Sin esperar al gestor.",
				bullets: [
					"Renta, IPSI, deducciones explicadas en castellano",
					"Plazos y formularios sin jerga",
					"Respuestas en segundos, no en dias",
				],
				cta: { label: "Soluciones para particulares →", href: "/particulares" },
			},
		],
	},
	demoFlagship: {
		eyebrow: "DEMO 1 · DISPONIBLE",
		headline: "IA Fiscal Melilla",
		subheadline:
			"Pregunta lo que quieras sobre fiscalidad en Melilla. Responde en segundos, citando la norma. Es la primera de muchas.",
		exchange: {
			question: "¿Tengo que pagar IPSI si vendo en Melilla a un cliente peninsular?",
			answer:
				"Si la entrega del bien o la prestacion del servicio se realiza fisicamente en Melilla, esta sujeta a IPSI. Si el cliente recoge el producto en Melilla, IPSI. Si lo envias a peninsula, no — la operacion no se considera localizada en Melilla a efectos del impuesto.",
			source: "Ordenanza Fiscal Reguladora del IPSI, Ciudad Autonoma de Melilla, art. 4.",
		},
		cta: { label: "Probar la demo completa →", href: "/demos/ia-fiscal-melilla" },
	},
	processSteps: {
		eyebrow: "PROCESO",
		headline: "Tres pasos. Sin sorpresas.",
		steps: [
			{
				number: "01",
				title: "Identificamos el problema concreto",
				body: "Te escuchamos. Entendemos tu sector, los huecos operativos, lo que ya funciona y lo que estorba. Si la IA no es la respuesta, te lo decimos.",
			},
			{
				number: "02",
				title: "Construimos la solucion a medida",
				body: "Software real. Conectado a tus sistemas. Probado en produccion antes de entregartelo. Cero demos vacios.",
			},
			{
				number: "03",
				title: "Te entregamos y formamos a tu equipo",
				body: "La solucion es tuya. Tu equipo la opera. Documentacion, formacion, soporte cuando lo necesites — pero sin dependencia.",
			},
		],
	},
	aboutMelilla: {
		eyebrow: "POR QUE EMPEZAMOS AQUI",
		headline: "Melilla no encaja en plantillas estandar.",
		body: [
			"Regimen fiscal propio (IPSI en lugar de IVA, REF, especificidades para autonomos y pymes). Una economia con fronteras y oportunidades unicas. Una poblacion que merece tecnologia hecha pensando en ella, no software adaptado a empujones.",
			"Hemos vivido aqui las consultas que se quedan sin respuesta, los formularios que confunden, las gestoras desbordadas en campaña de renta. Por eso empezamos por aqui.",
			"Pero la IA que construimos vale en cualquier mercado. Melilla es el inicio, no el limite.",
		],
	},
	ctaClose: {
		headline: "¿Hablamos?",
		subheadline:
			"Cuentanos que problema tienes. Primera reunion gratis, sin compromiso. Respondemos el mismo dia.",
		primaryCta: { label: "Pedir cita →", href: "/contacto" },
		secondaryCta: { label: "Escribenos por WhatsApp", href: "" }, // resolved at render time from business.whatsappUrl
	},
} as const;
```

- [ ] **Step 5: Empresas content**

Create `frontend/src/content/empresas.ts`. Use copy from `plans/copy-v2-2026-05-21.md` Landing `/empresas/` section — same structure: `hero`, `problemSolutions`, `processSteps` (reuse), `demoCrosslink`, `targetAudience`, `ctaClose`.

```ts
export const empresasContent = {
	hero: {
		eyebrow: "IA APLICADA · EMPRESAS Y AUTONOMOS",
		headline: "IA aplicada a tu negocio.\nSin promesas vacias.",
		subheadline:
			"Software de inteligencia artificial para asesorias, despachos, pymes y autonomos. Hecho a medida, probado en produccion, integrado con lo que ya usas.",
		primaryCta: { label: "Pedir reunion →", href: "/contacto?from=empresas" },
		secondaryCta: { label: "Ver demo IA Fiscal →", href: "/demos/ia-fiscal-melilla" },
	},
	problemSolutions: {
		headline: "Si esto te suena, tenemos solucion.",
		cards: [
			{
				problem: "Consultas fiscales que se repiten todo el dia",
				solution:
					"Asistente IA entrenado en normativa local que responde a tus clientes en segundos. Tu equipo solo interviene en lo dificil.",
			},
			{
				problem: "Renta y temporadas que desbordan al equipo",
				solution:
					"Pre-procesamiento automatico de consultas. Clasificacion por urgencia. Tu staff trabaja sobre lo que aporta valor.",
			},
			{
				problem: "Software fragmentado que no se habla entre si",
				solution:
					"Capa de IA por encima de tus herramientas existentes. Sin migrar datos. Sin romper procesos.",
			},
			{
				problem: "Demos de IA que no llegan a produccion",
				solution:
					"Entregamos codigo funcionando, integrado y mantenible. Cero \"proof of concept\" eternos.",
			},
		],
	},
	demoCrosslink: {
		headline: "Mira lo que ya esta funcionando.",
		body:
			"La demo IA Fiscal Melilla resuelve preguntas de regimen fiscal local en segundos. Si construimos eso, podemos construir lo tuyo.",
		cta: { label: "Probar demo →", href: "/demos/ia-fiscal-melilla" },
	},
	targetAudience: {
		headline: "Para quien construimos.",
		items: [
			"Asesorias y despachos fiscales",
			"Pymes con alto volumen de consultas de clientes",
			"Autonomos que necesitan automatizar tareas administrativas",
			"Startups que quieren incorporar IA sin montar equipo propio",
			"Cualquier negocio donde el tiempo de tu equipo valga mas que el de un asistente IA",
		],
	},
	ctaClose: {
		headline: "Primera reunion gratis.",
		body:
			"Cuentanos tu caso. Si la IA no es la respuesta, te lo decimos. Si lo es, te decimos exactamente cuanto cuesta y cuanto tarda.",
		cta: { label: "Reservar 30 minutos →", href: "/contacto?from=empresas" },
	},
} as const;
```

- [ ] **Step 6: Particulares content**

Create `frontend/src/content/particulares.ts`. Same approach, copy from plan's Landing `/particulares/` section.

```ts
export const particularesContent = {
	hero: {
		eyebrow: "IA APLICADA · PARTICULARES",
		headline: "Tu asistente de IA personal.\nPara fiscalidad, tramites y mas.",
		subheadline:
			"Pregunta lo que necesites en castellano normal. Recibe respuesta clara, con fuentes oficiales. Sin esperar al gestor, sin pagar consulta.",
		primaryCta: { label: "Probar IA Fiscal gratis →", href: "/demos/ia-fiscal-melilla" },
		secondaryCta: { label: "Como funciona", href: "#como-funciona" },
	},
	helpfulCases: {
		headline: "Casos en los que ya te ayuda.",
		cards: [
			{
				title: "Campaña de renta",
				body:
					"¿Tengo que declarar X? ¿Que deducciones aplican en Melilla? ¿Como afecta este ingreso a mi renta? Respuestas claras con la norma referenciada.",
			},
			{
				title: "IPSI Melilla",
				body:
					"Si vendes, compras o trabajas en Melilla, IPSI te afecta de forma distinta al IVA peninsular. Te explicamos cuando se aplica, cuanto y por que.",
			},
			{
				title: "Eres autonomo nuevo",
				body:
					"Cuota, retenciones, modelos, plazos. Lo que se te escapa en los primeros 12 meses, resuelto sin necesidad de gestor para cada duda.",
			},
			{
				title: "Plazos, modelos, tramites",
				body:
					"¿Cuando vence X modelo? ¿Que casilla rellenar? ¿Que documentos necesito? Respuestas con el enlace al formulario oficial.",
			},
		],
	},
	howItWorks: {
		headline: "Tres pasos. Sin registro obligatorio.",
		steps: [
			{ title: "Entras a la demo", body: "Sin descargas. Sin registro inicial. Sin tarjeta." },
			{
				title: "Preguntas en tu idioma",
				body: "Castellano natural. No tienes que saber jerga fiscal. Si tu pregunta es ambigua, te pide aclaracion.",
			},
			{
				title: "Recibes la respuesta con fuente",
				body:
					"Texto claro + referencia a la norma o el formulario oficial. Si necesitas profundizar, te decimos donde.",
			},
		],
	},
	privacy: {
		headline: "Tus consultas no se guardan ni se usan para entrenar modelos.",
		body:
			"Las preguntas que haces a IA Fiscal Melilla no se almacenan asociadas a tu identidad ni alimentan el entrenamiento de ningun modelo. Politica completa en /politica-de-privacidad/.",
	},
	ctaClose: {
		headline: "Pruebala. Es gratis.",
		body: "Sin compromiso. Si te sirve, vuelves. Si no, has perdido 30 segundos.",
		cta: { label: "Abrir IA Fiscal Melilla →", href: "/demos/ia-fiscal-melilla" },
	},
} as const;
```

- [ ] **Step 7: Demo + contacto + portafolio**

Create `frontend/src/content/demoIaFiscal.ts`:
```ts
export const demoIaFiscalContent = {
	hero: {
		eyebrow: "DEMO 1 · IA FISCAL MELILLA",
		headline: "Pregunta lo que quieras sobre fiscalidad en Melilla.",
		subheadline:
			"Asistente IA entrenado en normativa fiscal especifica de la Ciudad Autonoma de Melilla. IPSI, REF, IRPF local, deducciones aplicables, plazos, modelos. Responde con fuente.",
	},
	placeholderNote:
		"Demo en preparacion. El widget funcional se conecta en Fase 2. Mientras tanto, escribenos por WhatsApp si quieres una prueba guiada.",
	suggestedQuestions: [
		"¿Como tributa IPSI un servicio facturado a un cliente peninsular?",
		"¿Que deducciones autonomicas aplican en Melilla en la renta 2025?",
		"¿Plazo de presentacion del modelo 100 en Melilla este año?",
		"Soy autonomo nuevo en Melilla — ¿que pasos administrativos doy?",
	],
} as const;
```

Create `frontend/src/content/contacto.ts`:
```ts
export const contactoContent = {
	hero: {
		eyebrow: "CONTACTO",
		headline: "¿Como podemos ayudarte?",
		subheadline:
			"Cuentanos tu caso. Respondemos el mismo dia laborable. Si urge, escribenos por WhatsApp.",
	},
	form: {
		fields: {
			nombre: { label: "Nombre", required: true },
			email: { label: "Email", required: true },
			telefono: { label: "Telefono (opcional)", required: false },
			audience: {
				label: "Soy",
				required: true,
				options: [
					{ value: "empresa", label: "Empresa o autonomo" },
					{ value: "particular", label: "Particular" },
				],
			},
			mensaje: {
				label: "Cuentanos",
				required: true,
				placeholder:
					"Que problema te gustaria resolver con IA, o que duda tienes",
			},
			consent: {
				label: "He leido y acepto la politica de privacidad",
				required: true,
			},
		},
		submitLabel: "Enviar consulta →",
		successMessage:
			"Gracias. Hemos recibido tu consulta. Te respondemos en menos de 24 horas laborables.",
		errorMessage: "Algo no fue. Intentalo de nuevo o escribenos directamente por WhatsApp.",
	},
} as const;
```

Create `frontend/src/content/portafolio.ts`:
```ts
export const portafolioContent = {
	hero: {
		eyebrow: "PORTAFOLIO",
		headline: "Cosas que hemos construido.",
		subheadline:
			"Imagenes, videos y enlaces a proyectos reales. La mayoria con permiso de los clientes; algunos anonimos por confidencialidad.",
	},
	placeholderNote:
		"Galeria en curacion. Mientras tanto, puedes ver evidencias en nuestro Instagram.",
	items: [], // populated when curated migration from /evidencia-visual/ completes
} as const;
```

- [ ] **Step 8: Smoke build to catch any TS errors**

```bash
cd frontend
npm run build
```

Expected: build succeeds (no TS errors, only unused-content warnings if any). If errors, fix typing.

- [ ] **Step 9: Commit**

```bash
git add frontend/src/content/
git commit -m "feat(frontend): typed content constants for all pages"
```

---

## Task 6: Layout shell — Nav + Footer + WhatsAppFloat + PageShell

**Files:**
- Create: `frontend/src/components/layout/Nav.tsx`
- Create: `frontend/src/components/layout/Footer.tsx`
- Create: `frontend/src/components/layout/WhatsAppFloat.tsx`
- Create: `frontend/src/components/layout/PageShell.tsx`
- Create: `frontend/src/hooks/useScrollPosition.ts`
- Create: `frontend/src/components/layout/__tests__/Nav.test.tsx`

- [ ] **Step 1: useScrollPosition hook**

Create `frontend/src/hooks/useScrollPosition.ts`:
```ts
import { useEffect, useState } from "react";

export function useScrollPosition() {
	const [y, setY] = useState(typeof window !== "undefined" ? window.scrollY : 0);
	useEffect(() => {
		const handler = () => setY(window.scrollY);
		window.addEventListener("scroll", handler, { passive: true });
		return () => window.removeEventListener("scroll", handler);
	}, []);
	return y;
}
```

- [ ] **Step 2: Nav component**

Create `frontend/src/components/layout/Nav.tsx`:
```tsx
import { Link, NavLink } from "react-router-dom";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { navContent } from "@/content/nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Nav() {
	const y = useScrollPosition();
	const shrunk = y > 24;
	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/90 backdrop-blur-md transition-all duration-200",
				shrunk ? "h-14" : "h-20",
			)}
			aria-label="Navegacion principal"
		>
			<div className="container mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
				<Link to="/" className="font-display text-headline-sm font-bold text-on-surface">
					{navContent.logoAlt}
				</Link>
				<nav className="hidden md:flex items-center gap-1" aria-label="Secciones">
					{navContent.links.map((link) => (
						<NavLink
							key={link.href}
							to={link.href}
							className={({ isActive }) =>
								cn(
									"px-3 py-2 text-label-lg transition-colors",
									isActive ? "text-on-surface" : "text-on-surface-variant hover:text-on-surface",
								)
							}
						>
							{link.label}
						</NavLink>
					))}
				</nav>
				<Button asChild size="sm">
					<Link to={navContent.ctaHref}>{navContent.ctaLabel}</Link>
				</Button>
			</div>
		</header>
	);
}
```

Note: `asChild` requires a small Button extension. Add the prop and pass-through logic:

Update `frontend/src/components/ui/button.tsx` to add `asChild`:
```tsx
import { Slot } from "@radix-ui/react-slot";
```

Install radix slot:
```bash
cd frontend
npm install @radix-ui/react-slot
```

Then update the Button signature to accept `asChild?: boolean` and use `Slot` when true:
```tsx
export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
	},
);
Button.displayName = "Button";
```

- [ ] **Step 3: Nav test**

Create `frontend/src/components/layout/__tests__/Nav.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Nav } from "../Nav";

describe("Nav", () => {
	it("renders all nav links", () => {
		render(
			<MemoryRouter>
				<Nav />
			</MemoryRouter>,
		);
		expect(screen.getByText("Empresas")).toBeInTheDocument();
		expect(screen.getByText("Particulares")).toBeInTheDocument();
		expect(screen.getByText("Demos")).toBeInTheDocument();
		expect(screen.getByText("Contacto")).toBeInTheDocument();
	});

	it("renders the CTA button", () => {
		render(
			<MemoryRouter>
				<Nav />
			</MemoryRouter>,
		);
		expect(screen.getByText("Probar IA Fiscal")).toBeInTheDocument();
	});
});
```

Run: `npm test -- --run Nav.test`
Expected: 2 pass.

- [ ] **Step 4: Footer**

Create `frontend/src/components/layout/Footer.tsx`:
```tsx
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { footerContent } from "@/content/footer";
import { business } from "@/content/shared";
import { Separator } from "@/components/ui/separator";

export function Footer() {
	return (
		<footer className="border-t border-outline-variant bg-surface-container-low mt-32">
			<div className="container mx-auto max-w-[1200px] px-6 py-16">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-4">
					<div>
						<h2 className="text-headline-sm font-bold mb-4">{business.name}</h2>
						<p className="text-body-md text-on-surface-variant max-w-xs">
							{footerContent.tagline}
						</p>
					</div>
					{footerContent.columns.map((col) => (
						<div key={col.title}>
							<h3 className="text-label-caps text-on-surface-muted mb-4">{col.title}</h3>
							<ul className="flex flex-col gap-2">
								{col.links.map((link) => (
									<li key={link.href}>
										<Link
											to={link.href}
											className="text-body-md text-on-surface-variant hover:text-on-surface"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<Separator className="my-12" />
				<div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
					<div className="text-body-sm text-on-surface-muted">
						© {footerContent.copyrightYear} {business.name}. {business.address.street},{" "}
						{business.address.postalCode} {business.address.city}.
					</div>
					<div className="flex gap-4">
						<a href={business.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
							<Instagram className="h-5 w-5 text-on-surface-variant hover:text-on-surface" />
						</a>
						<a href={business.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
							<Linkedin className="h-5 w-5 text-on-surface-variant hover:text-on-surface" />
						</a>
						<a href={business.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
							<Facebook className="h-5 w-5 text-on-surface-variant hover:text-on-surface" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
```

- [ ] **Step 5: WhatsAppFloat**

Create `frontend/src/components/layout/WhatsAppFloat.tsx`:
```tsx
import { MessageCircle } from "lucide-react";
import { business } from "@/content/shared";

export function WhatsAppFloat() {
	return (
		<a
			href={business.whatsappUrl}
			target="_blank"
			rel="noreferrer"
			aria-label="Escribenos por WhatsApp"
			className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
			style={{ backgroundColor: "#075E54" }}
		>
			<MessageCircle className="h-6 w-6" />
		</a>
	);
}
```

- [ ] **Step 6: PageShell**

Create `frontend/src/components/layout/PageShell.tsx`:
```tsx
import { type ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function PageShell({ children }: { children: ReactNode }) {
	return (
		<>
			<Nav />
			<main className="min-h-screen">{children}</main>
			<Footer />
			<WhatsAppFloat />
		</>
	);
}
```

- [ ] **Step 7: Wrap pages in PageShell**

Modify each existing placeholder page in `frontend/src/pages/` to wrap its content in `<PageShell>`. Example for `Home.tsx`:

```tsx
import { PageShell } from "@/components/layout/PageShell";

export default function Home() {
	return (
		<PageShell>
			<div className="container mx-auto max-w-[1200px] px-6 py-16">
				<h1 className="text-display-md font-bold">Home</h1>
				<p className="text-body-md text-on-surface-variant mt-4">Placeholder</p>
			</div>
		</PageShell>
	);
}
```

Repeat for all 11 pages.

- [ ] **Step 8: Smoke test**

```bash
cd frontend
npm run dev
```

Verify in browser:
- Nav sticks to top, shrinks on scroll
- Footer renders 4 columns + social icons
- WhatsApp button floats bottom-right
- All routes still work

Stop server.

- [ ] **Step 9: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): layout shell — Nav Footer WhatsAppFloat PageShell"
```

---

## Task 7: Home — Hero + AudienceSplit sections

**Files:**
- Create: `frontend/src/components/sections/Hero.tsx`
- Create: `frontend/src/components/sections/AudienceSplit.tsx`
- Create: `frontend/src/components/sections/__tests__/AudienceSplit.test.tsx`
- Modify: `frontend/src/pages/Home.tsx`

- [ ] **Step 1: Hero section**

Create `frontend/src/components/sections/Hero.tsx`:
```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroProps {
	eyebrow: string;
	headline: string;
	subheadline: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

export function Hero({ eyebrow, headline, subheadline, primaryCta, secondaryCta }: HeroProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 pt-24 pb-32 md:pt-32 md:pb-40">
			<p className="text-label-caps text-primary mb-6">{eyebrow}</p>
			<h1 className="text-display-md md:text-display-lg font-bold tracking-tight whitespace-pre-line max-w-4xl">
				{headline}
			</h1>
			<p className="text-body-lg text-on-surface-variant mt-6 max-w-2xl">{subheadline}</p>
			<div className="mt-10 flex flex-col gap-4 sm:flex-row">
				<Button asChild size="lg">
					<Link to={primaryCta.href}>{primaryCta.label}</Link>
				</Button>
				{secondaryCta && (
					<Button asChild variant="outline" size="lg">
						<Link to={secondaryCta.href}>{secondaryCta.label}</Link>
					</Button>
				)}
			</div>
		</section>
	);
}
```

- [ ] **Step 2: AudienceSplit section**

Create `frontend/src/components/sections/AudienceSplit.tsx`:
```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface AudienceCard {
	audience: "b2b" | "b2c";
	badge: string;
	title: string;
	description: string;
	bullets: readonly string[];
	cta: { label: string; href: string };
}

interface AudienceSplitProps {
	eyebrow: string;
	headline: string;
	cards: readonly AudienceCard[];
}

export function AudienceSplit({ eyebrow, headline, cards }: AudienceSplitProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<p className="text-label-caps text-on-surface-muted mb-3">{eyebrow}</p>
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<div className="mt-12 grid gap-6 md:grid-cols-2">
				{cards.map((card) => (
					<Card key={card.audience} className="border border-outline-variant p-8">
						<CardHeader>
							<Badge variant={card.audience} className="self-start">
								{card.badge}
							</Badge>
							<CardTitle className="mt-3 text-headline-md">{card.title}</CardTitle>
						</CardHeader>
						<CardContent className="mt-4">
							<p>{card.description}</p>
							<ul className="mt-6 flex flex-col gap-3">
								{card.bullets.map((bullet) => (
									<li key={bullet} className="flex items-start gap-3 text-body-md text-on-surface">
										<Check className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
										<span>{bullet}</span>
									</li>
								))}
							</ul>
							<Button asChild variant={card.audience} className="mt-8 w-full sm:w-auto" size="lg">
								<Link to={card.cta.href}>{card.cta.label}</Link>
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
```

- [ ] **Step 3: AudienceSplit test**

Create `frontend/src/components/sections/__tests__/AudienceSplit.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AudienceSplit } from "../AudienceSplit";

const cards = [
	{
		audience: "b2b" as const,
		badge: "EMPRESAS",
		title: "Para tu negocio",
		description: "Description B2B",
		bullets: ["Bullet B2B 1", "Bullet B2B 2"],
		cta: { label: "B2B CTA", href: "/empresas" },
	},
	{
		audience: "b2c" as const,
		badge: "PARTICULARES",
		title: "Para ti",
		description: "Description B2C",
		bullets: ["Bullet B2C 1"],
		cta: { label: "B2C CTA", href: "/particulares" },
	},
];

describe("AudienceSplit", () => {
	it("renders both audience cards", () => {
		render(
			<MemoryRouter>
				<AudienceSplit eyebrow="EYE" headline="HEAD" cards={cards} />
			</MemoryRouter>,
		);
		expect(screen.getByText("Para tu negocio")).toBeInTheDocument();
		expect(screen.getByText("Para ti")).toBeInTheDocument();
	});

	it("renders all bullets", () => {
		render(
			<MemoryRouter>
				<AudienceSplit eyebrow="EYE" headline="HEAD" cards={cards} />
			</MemoryRouter>,
		);
		expect(screen.getByText("Bullet B2B 1")).toBeInTheDocument();
		expect(screen.getByText("Bullet B2B 2")).toBeInTheDocument();
		expect(screen.getByText("Bullet B2C 1")).toBeInTheDocument();
	});

	it("renders CTAs with correct hrefs", () => {
		render(
			<MemoryRouter>
				<AudienceSplit eyebrow="EYE" headline="HEAD" cards={cards} />
			</MemoryRouter>,
		);
		expect(screen.getByText("B2B CTA").closest("a")).toHaveAttribute("href", "/empresas");
		expect(screen.getByText("B2C CTA").closest("a")).toHaveAttribute("href", "/particulares");
	});
});
```

Run: `npm test -- --run AudienceSplit.test`
Expected: 3 pass.

- [ ] **Step 4: Wire into Home**

Modify `frontend/src/pages/Home.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/sections/Hero";
import { AudienceSplit } from "@/components/sections/AudienceSplit";
import { homeContent } from "@/content/home";

export default function Home() {
	return (
		<PageShell>
			<Hero
				eyebrow={homeContent.hero.eyebrow}
				headline={homeContent.hero.headline}
				subheadline={homeContent.hero.subheadline}
				primaryCta={homeContent.hero.primaryCta}
				secondaryCta={homeContent.hero.secondaryCta}
			/>
			<AudienceSplit
				eyebrow={homeContent.audienceSplit.eyebrow}
				headline={homeContent.audienceSplit.headline}
				cards={homeContent.audienceSplit.cards}
			/>
		</PageShell>
	);
}
```

- [ ] **Step 5: Smoke test in browser**

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173/`. Expected: hero with eyebrow, big H1, subheadline, two buttons. Below it the audience split with two cards (deep blue B2B / amber B2C). Stop server.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): Home hero + audience split sections"
```

---

## Task 8: Home — DemoFlagship section

**Files:**
- Create: `frontend/src/components/sections/DemoFlagship.tsx`
- Modify: `frontend/src/pages/Home.tsx`

- [ ] **Step 1: DemoFlagship section**

Create `frontend/src/components/sections/DemoFlagship.tsx`:
```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DemoFlagshipProps {
	eyebrow: string;
	headline: string;
	subheadline: string;
	exchange: { question: string; answer: string; source: string };
	cta: { label: string; href: string };
}

export function DemoFlagship({
	eyebrow,
	headline,
	subheadline,
	exchange,
	cta,
}: DemoFlagshipProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<div className="rounded-xl border border-outline-variant bg-surface-container p-8 md:p-12">
				<div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
					<div>
						<Badge variant="primary">{eyebrow}</Badge>
						<h2 className="mt-4 text-headline-lg font-semibold tracking-tight">{headline}</h2>
						<p className="mt-4 text-body-lg text-on-surface-variant">{subheadline}</p>
						<Button asChild size="lg" className="mt-8">
							<Link to={cta.href}>{cta.label}</Link>
						</Button>
					</div>
					<div className="flex flex-col gap-4">
						<div className="rounded-md bg-surface-container-high px-5 py-4">
							<p className="font-mono text-body-sm text-on-surface-muted mb-1">USUARIO</p>
							<p className="text-body-md text-on-surface">{exchange.question}</p>
						</div>
						<div className="rounded-md bg-surface-container-highest px-5 py-4">
							<p className="font-mono text-body-sm text-primary mb-1">IA FISCAL</p>
							<p className="text-body-md text-on-surface whitespace-pre-line">{exchange.answer}</p>
							<p className="mt-4 text-body-sm text-on-surface-muted">{exchange.source}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
```

- [ ] **Step 2: Wire into Home**

Modify `frontend/src/pages/Home.tsx` to add DemoFlagship below AudienceSplit:
```tsx
import { DemoFlagship } from "@/components/sections/DemoFlagship";
```
Inside the JSX, after `<AudienceSplit ... />`:
```tsx
<DemoFlagship
	eyebrow={homeContent.demoFlagship.eyebrow}
	headline={homeContent.demoFlagship.headline}
	subheadline={homeContent.demoFlagship.subheadline}
	exchange={homeContent.demoFlagship.exchange}
	cta={homeContent.demoFlagship.cta}
/>
```

- [ ] **Step 3: Smoke test**

```bash
cd frontend
npm run dev
```

Verify section renders. Stop server.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): Home demo flagship section"
```

---

## Task 9: Home — ProcessSteps + AboutMelilla + CtaClose

**Files:**
- Create: `frontend/src/components/sections/ProcessSteps.tsx`
- Create: `frontend/src/components/sections/AboutMelilla.tsx`
- Create: `frontend/src/components/sections/CtaClose.tsx`
- Modify: `frontend/src/pages/Home.tsx`

- [ ] **Step 1: ProcessSteps**

Create `frontend/src/components/sections/ProcessSteps.tsx`:
```tsx
interface ProcessStep {
	number: string;
	title: string;
	body: string;
}

interface ProcessStepsProps {
	id?: string;
	eyebrow: string;
	headline: string;
	steps: readonly ProcessStep[];
}

export function ProcessSteps({ id, eyebrow, headline, steps }: ProcessStepsProps) {
	return (
		<section id={id} className="container mx-auto max-w-[1200px] px-6 py-24">
			<p className="text-label-caps text-on-surface-muted mb-3">{eyebrow}</p>
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-2xl">{headline}</h2>
			<div className="mt-12 grid gap-12 md:grid-cols-3">
				{steps.map((step) => (
					<div key={step.number} className="flex flex-col gap-4">
						<p className="text-headline-md font-bold text-on-surface-muted">{step.number}</p>
						<h3 className="text-headline-sm font-semibold tracking-tight">{step.title}</h3>
						<p className="text-body-md text-on-surface-variant">{step.body}</p>
					</div>
				))}
			</div>
		</section>
	);
}
```

- [ ] **Step 2: AboutMelilla**

Create `frontend/src/components/sections/AboutMelilla.tsx`:
```tsx
interface AboutMelillaProps {
	eyebrow: string;
	headline: string;
	body: readonly string[];
}

export function AboutMelilla({ eyebrow, headline, body }: AboutMelillaProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
				<div>
					<p className="text-label-caps text-on-surface-muted mb-3">{eyebrow}</p>
					<h2 className="text-headline-lg font-semibold tracking-tight">{headline}</h2>
				</div>
				<div className="flex flex-col gap-6">
					{body.map((paragraph, idx) => (
						<p key={idx} className="text-body-lg text-on-surface-variant">
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</section>
	);
}
```

- [ ] **Step 3: CtaClose**

Create `frontend/src/components/sections/CtaClose.tsx`:
```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { business } from "@/content/shared";

interface CtaCloseProps {
	headline: string;
	subheadline: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

export function CtaClose({ headline, subheadline, primaryCta, secondaryCta }: CtaCloseProps) {
	const secondaryHref = secondaryCta?.href || business.whatsappUrl;
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<div className="rounded-xl border border-outline-variant bg-surface-container-low p-12 md:p-16 text-center">
				<h2 className="text-headline-lg md:text-display-md font-semibold tracking-tight">
					{headline}
				</h2>
				<p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl mx-auto">{subheadline}</p>
				<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
					<Button asChild size="lg">
						<Link to={primaryCta.href}>{primaryCta.label}</Link>
					</Button>
					{secondaryCta && (
						<Button asChild variant="outline" size="lg">
							<a href={secondaryHref} target="_blank" rel="noreferrer">
								{secondaryCta.label}
							</a>
						</Button>
					)}
				</div>
			</div>
		</section>
	);
}
```

- [ ] **Step 4: Wire into Home**

Modify `frontend/src/pages/Home.tsx` to add the three sections after DemoFlagship:
```tsx
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { AboutMelilla } from "@/components/sections/AboutMelilla";
import { CtaClose } from "@/components/sections/CtaClose";
```

In JSX:
```tsx
<ProcessSteps
	id="como-trabajamos"
	eyebrow={homeContent.processSteps.eyebrow}
	headline={homeContent.processSteps.headline}
	steps={homeContent.processSteps.steps}
/>
<AboutMelilla
	eyebrow={homeContent.aboutMelilla.eyebrow}
	headline={homeContent.aboutMelilla.headline}
	body={homeContent.aboutMelilla.body}
/>
<CtaClose
	headline={homeContent.ctaClose.headline}
	subheadline={homeContent.ctaClose.subheadline}
	primaryCta={homeContent.ctaClose.primaryCta}
	secondaryCta={homeContent.ctaClose.secondaryCta}
/>
```

- [ ] **Step 5: Smoke test entire home**

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173/`. Scroll through full home — hero, audience split, demo flagship, process steps, about Melilla, CTA close, footer. Check that `#como-trabajamos` anchor scrolls correctly. Stop server.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): Home process steps + about Melilla + CTA close"
```

---

## Task 10: Empresas landing page

**Files:**
- Create: `frontend/src/components/sections/ProblemSolutionGrid.tsx`
- Create: `frontend/src/components/sections/TargetAudienceList.tsx`
- Create: `frontend/src/components/sections/DemoCrosslink.tsx`
- Modify: `frontend/src/pages/Empresas.tsx`

- [ ] **Step 1: ProblemSolutionGrid**

Create `frontend/src/components/sections/ProblemSolutionGrid.tsx`:
```tsx
import { Card, CardContent } from "@/components/ui/card";

interface ProblemSolutionCard {
	problem: string;
	solution: string;
}

interface ProblemSolutionGridProps {
	headline: string;
	cards: readonly ProblemSolutionCard[];
}

export function ProblemSolutionGrid({ headline, cards }: ProblemSolutionGridProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<div className="mt-12 grid gap-6 md:grid-cols-2">
				{cards.map((card) => (
					<Card key={card.problem} className="border border-outline-variant">
						<CardContent>
							<p className="text-label-caps text-on-surface-muted mb-2">PROBLEMA</p>
							<p className="text-headline-sm font-semibold mb-4">{card.problem}</p>
							<p className="text-label-caps text-primary mb-2">SOLUCION</p>
							<p className="text-body-md text-on-surface-variant">{card.solution}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
```

- [ ] **Step 2: TargetAudienceList**

Create `frontend/src/components/sections/TargetAudienceList.tsx`:
```tsx
import { ArrowRight } from "lucide-react";

interface TargetAudienceListProps {
	headline: string;
	items: readonly string[];
}

export function TargetAudienceList({ headline, items }: TargetAudienceListProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<ul className="mt-10 flex flex-col gap-4">
				{items.map((item) => (
					<li key={item} className="flex items-start gap-4 text-body-lg text-on-surface">
						<ArrowRight className="mt-1.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
						<span>{item}</span>
					</li>
				))}
			</ul>
		</section>
	);
}
```

- [ ] **Step 3: DemoCrosslink**

Create `frontend/src/components/sections/DemoCrosslink.tsx`:
```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DemoCrosslinkProps {
	headline: string;
	body: string;
	cta: { label: string; href: string };
}

export function DemoCrosslink({ headline, body, cta }: DemoCrosslinkProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<div className="rounded-xl border border-outline-variant bg-surface-container p-12 md:p-16">
				<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
				<p className="mt-4 text-body-lg text-on-surface-variant max-w-3xl">{body}</p>
				<Button asChild size="lg" className="mt-8">
					<Link to={cta.href}>{cta.label}</Link>
				</Button>
			</div>
		</section>
	);
}
```

- [ ] **Step 4: Wire Empresas page**

Modify `frontend/src/pages/Empresas.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/sections/Hero";
import { ProblemSolutionGrid } from "@/components/sections/ProblemSolutionGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { DemoCrosslink } from "@/components/sections/DemoCrosslink";
import { TargetAudienceList } from "@/components/sections/TargetAudienceList";
import { CtaClose } from "@/components/sections/CtaClose";
import { empresasContent } from "@/content/empresas";
import { homeContent } from "@/content/home";

export default function Empresas() {
	return (
		<PageShell>
			<Hero
				eyebrow={empresasContent.hero.eyebrow}
				headline={empresasContent.hero.headline}
				subheadline={empresasContent.hero.subheadline}
				primaryCta={empresasContent.hero.primaryCta}
				secondaryCta={empresasContent.hero.secondaryCta}
			/>
			<ProblemSolutionGrid
				headline={empresasContent.problemSolutions.headline}
				cards={empresasContent.problemSolutions.cards}
			/>
			<ProcessSteps
				eyebrow={homeContent.processSteps.eyebrow}
				headline={homeContent.processSteps.headline}
				steps={homeContent.processSteps.steps}
			/>
			<DemoCrosslink
				headline={empresasContent.demoCrosslink.headline}
				body={empresasContent.demoCrosslink.body}
				cta={empresasContent.demoCrosslink.cta}
			/>
			<TargetAudienceList
				headline={empresasContent.targetAudience.headline}
				items={empresasContent.targetAudience.items}
			/>
			<CtaClose
				headline={empresasContent.ctaClose.headline}
				subheadline={empresasContent.ctaClose.body}
				primaryCta={empresasContent.ctaClose.cta}
			/>
		</PageShell>
	);
}
```

- [ ] **Step 5: Smoke test**

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173/empresas`. Verify all sections render. Stop server.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): Empresas landing page"
```

---

## Task 11: Particulares landing page

**Files:**
- Create: `frontend/src/components/sections/HelpfulCases.tsx`
- Create: `frontend/src/components/sections/HowItWorksList.tsx`
- Create: `frontend/src/components/sections/PrivacyNote.tsx`
- Modify: `frontend/src/pages/Particulares.tsx`

- [ ] **Step 1: HelpfulCases**

Create `frontend/src/components/sections/HelpfulCases.tsx`:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface HelpfulCase {
	title: string;
	body: string;
}

interface HelpfulCasesProps {
	headline: string;
	cards: readonly HelpfulCase[];
}

export function HelpfulCases({ headline, cards }: HelpfulCasesProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<div className="mt-12 grid gap-6 md:grid-cols-2">
				{cards.map((card) => (
					<Card key={card.title} className="border border-outline-variant">
						<CardHeader>
							<CardTitle>{card.title}</CardTitle>
						</CardHeader>
						<CardContent className="mt-3">{card.body}</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
```

- [ ] **Step 2: HowItWorksList**

Create `frontend/src/components/sections/HowItWorksList.tsx`:
```tsx
interface HowItWorksStep {
	title: string;
	body: string;
}

interface HowItWorksListProps {
	id?: string;
	headline: string;
	steps: readonly HowItWorksStep[];
}

export function HowItWorksList({ id, headline, steps }: HowItWorksListProps) {
	return (
		<section id={id} className="container mx-auto max-w-[1200px] px-6 py-24">
			<h2 className="text-headline-lg font-semibold tracking-tight max-w-3xl">{headline}</h2>
			<ol className="mt-12 flex flex-col gap-8">
				{steps.map((step, idx) => (
					<li key={step.title} className="flex gap-6 items-start">
						<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary font-bold">
							{idx + 1}
						</span>
						<div>
							<h3 className="text-headline-sm font-semibold tracking-tight">{step.title}</h3>
							<p className="mt-2 text-body-md text-on-surface-variant">{step.body}</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
```

- [ ] **Step 3: PrivacyNote**

Create `frontend/src/components/sections/PrivacyNote.tsx`:
```tsx
import { Shield } from "lucide-react";

interface PrivacyNoteProps {
	headline: string;
	body: string;
}

export function PrivacyNote({ headline, body }: PrivacyNoteProps) {
	return (
		<section className="container mx-auto max-w-[1200px] px-6 py-24">
			<div className="flex gap-6 items-start rounded-xl border border-outline-variant bg-surface-container p-12">
				<Shield className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
				<div>
					<h2 className="text-headline-md font-semibold tracking-tight">{headline}</h2>
					<p className="mt-3 text-body-md text-on-surface-variant">{body}</p>
				</div>
			</div>
		</section>
	);
}
```

- [ ] **Step 4: Wire Particulares page**

Modify `frontend/src/pages/Particulares.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/sections/Hero";
import { HelpfulCases } from "@/components/sections/HelpfulCases";
import { HowItWorksList } from "@/components/sections/HowItWorksList";
import { PrivacyNote } from "@/components/sections/PrivacyNote";
import { CtaClose } from "@/components/sections/CtaClose";
import { particularesContent } from "@/content/particulares";

export default function Particulares() {
	return (
		<PageShell>
			<Hero
				eyebrow={particularesContent.hero.eyebrow}
				headline={particularesContent.hero.headline}
				subheadline={particularesContent.hero.subheadline}
				primaryCta={particularesContent.hero.primaryCta}
				secondaryCta={particularesContent.hero.secondaryCta}
			/>
			<HelpfulCases
				headline={particularesContent.helpfulCases.headline}
				cards={particularesContent.helpfulCases.cards}
			/>
			<HowItWorksList
				id="como-funciona"
				headline={particularesContent.howItWorks.headline}
				steps={particularesContent.howItWorks.steps}
			/>
			<PrivacyNote
				headline={particularesContent.privacy.headline}
				body={particularesContent.privacy.body}
			/>
			<CtaClose
				headline={particularesContent.ctaClose.headline}
				subheadline={particularesContent.ctaClose.body}
				primaryCta={particularesContent.ctaClose.cta}
			/>
		</PageShell>
	);
}
```

- [ ] **Step 5: Smoke test**

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173/particulares`. Verify all sections render. Stop server.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): Particulares landing page"
```

---

## Task 12: Demo IA Fiscal Melilla page (placeholder)

**Files:**
- Create: `frontend/src/components/demo/DemoChatPlaceholder.tsx`
- Modify: `frontend/src/pages/DemoIaFiscal.tsx`

- [ ] **Step 1: DemoChatPlaceholder**

Create `frontend/src/components/demo/DemoChatPlaceholder.tsx`:
```tsx
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DemoChatPlaceholderProps {
	suggestedQuestions: readonly string[];
	placeholderNote: string;
}

export function DemoChatPlaceholder({
	suggestedQuestions,
	placeholderNote,
}: DemoChatPlaceholderProps) {
	return (
		<div className="rounded-xl border border-outline-variant bg-surface-container p-8">
			<div className="rounded-md border border-outline-variant bg-surface-container-low p-6 mb-6">
				<p className="text-body-sm text-on-surface-muted text-center">{placeholderNote}</p>
			</div>
			<form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
				<Input
					disabled
					placeholder="Escribe tu pregunta sobre fiscalidad en Melilla..."
					aria-label="Pregunta"
				/>
				<Button type="submit" disabled aria-label="Enviar">
					<Send className="h-5 w-5" />
				</Button>
			</form>
			<div className="mt-8">
				<p className="text-label-caps text-on-surface-muted mb-4">PRUEBA PREGUNTAR</p>
				<ul className="flex flex-col gap-2">
					{suggestedQuestions.map((q) => (
						<li
							key={q}
							className="rounded-md border border-outline-variant px-4 py-3 text-body-md text-on-surface-variant"
						>
							{q}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
```

- [ ] **Step 2: Wire DemoIaFiscal page**

Modify `frontend/src/pages/DemoIaFiscal.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";
import { DemoChatPlaceholder } from "@/components/demo/DemoChatPlaceholder";
import { Badge } from "@/components/ui/badge";
import { demoIaFiscalContent } from "@/content/demoIaFiscal";

export default function DemoIaFiscal() {
	return (
		<PageShell>
			<section className="container mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<Badge variant="primary" className="mb-6">
					{demoIaFiscalContent.hero.eyebrow}
				</Badge>
				<h1 className="text-display-md font-bold tracking-tight max-w-4xl">
					{demoIaFiscalContent.hero.headline}
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					{demoIaFiscalContent.hero.subheadline}
				</p>
				<div className="mt-12 max-w-3xl">
					<DemoChatPlaceholder
						suggestedQuestions={demoIaFiscalContent.suggestedQuestions}
						placeholderNote={demoIaFiscalContent.placeholderNote}
					/>
				</div>
			</section>
		</PageShell>
	);
}
```

- [ ] **Step 3: Smoke test**

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173/demos/ia-fiscal-melilla`. Stop server.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): Demo IA Fiscal Melilla placeholder page"
```

---

## Task 13: Contacto page + form

**Files:**
- Create: `frontend/src/components/contact/ContactForm.tsx`
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/components/contact/__tests__/ContactForm.test.tsx`
- Modify: `frontend/src/pages/Contacto.tsx`

- [ ] **Step 1: API stub**

Create `frontend/src/lib/api.ts`:
```ts
export interface ContactSubmission {
	nombre: string;
	email: string;
	telefono?: string;
	audience: "empresa" | "particular";
	mensaje: string;
}

export async function submitContact(data: ContactSubmission): Promise<{ ok: true } | { ok: false; error: string }> {
	// Backend not wired in Fase 1. Stub returns success after a short delay so the UI flow can be tested.
	// In Fase 2 this is replaced with a POST to /api/leads.
	await new Promise((r) => setTimeout(r, 600));
	if (!data.email.includes("@")) return { ok: false, error: "invalid_email" };
	return { ok: true };
}
```

- [ ] **Step 2: Write failing form test**

Create `frontend/src/components/contact/__tests__/ContactForm.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../ContactForm";
import * as api from "@/lib/api";

describe("ContactForm", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("renders all required fields", () => {
		render(<ContactForm />);
		expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Cuentanos/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Empresa o autonomo/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Particular/i)).toBeInTheDocument();
	});

	it("submits valid form and shows success message", async () => {
		const spy = vi.spyOn(api, "submitContact").mockResolvedValue({ ok: true });
		const user = userEvent.setup();
		render(<ContactForm />);
		await user.type(screen.getByLabelText(/Nombre/i), "Juan");
		await user.type(screen.getByLabelText(/Email/i), "juan@example.com");
		await user.click(screen.getByLabelText(/Empresa o autonomo/i));
		await user.type(screen.getByLabelText(/Cuentanos/i), "Necesito IA");
		await user.click(screen.getByLabelText(/He leido y acepto/i));
		await user.click(screen.getByRole("button", { name: /Enviar/i }));

		await waitFor(() => {
			expect(screen.getByText(/Gracias\. Hemos recibido tu consulta/i)).toBeInTheDocument();
		});
		expect(spy).toHaveBeenCalledOnce();
	});

	it("shows error message when submission fails", async () => {
		vi.spyOn(api, "submitContact").mockResolvedValue({ ok: false, error: "invalid_email" });
		const user = userEvent.setup();
		render(<ContactForm />);
		await user.type(screen.getByLabelText(/Nombre/i), "Juan");
		await user.type(screen.getByLabelText(/Email/i), "bad");
		await user.click(screen.getByLabelText(/Particular/i));
		await user.type(screen.getByLabelText(/Cuentanos/i), "Test");
		await user.click(screen.getByLabelText(/He leido y acepto/i));
		await user.click(screen.getByRole("button", { name: /Enviar/i }));

		await waitFor(() => {
			expect(screen.getByText(/Algo no fue/i)).toBeInTheDocument();
		});
	});
});
```

Run: `npm test -- --run ContactForm.test`
Expected: FAIL — ContactForm not defined.

- [ ] **Step 3: Implement ContactForm**

Create `frontend/src/components/contact/ContactForm.tsx`:
```tsx
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitContact, type ContactSubmission } from "@/lib/api";
import { contactoContent } from "@/content/contacto";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
	const [status, setStatus] = useState<Status>("idle");
	const fields = contactoContent.form.fields;

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data: ContactSubmission = {
			nombre: String(formData.get("nombre") || ""),
			email: String(formData.get("email") || ""),
			telefono: String(formData.get("telefono") || "") || undefined,
			audience: formData.get("audience") as "empresa" | "particular",
			mensaje: String(formData.get("mensaje") || ""),
		};
		setStatus("submitting");
		const result = await submitContact(data);
		setStatus(result.ok ? "success" : "error");
	}

	if (status === "success") {
		return (
			<div
				role="status"
				className="rounded-xl border border-primary bg-primary-container px-8 py-12 text-center"
			>
				<p className="text-headline-sm font-semibold text-on-primary-container">
					{contactoContent.form.successMessage}
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<div>
				<Label htmlFor="nombre">{fields.nombre.label}</Label>
				<Input id="nombre" name="nombre" required className="mt-2" />
			</div>
			<div>
				<Label htmlFor="email">{fields.email.label}</Label>
				<Input id="email" name="email" type="email" required className="mt-2" />
			</div>
			<div>
				<Label htmlFor="telefono">{fields.telefono.label}</Label>
				<Input id="telefono" name="telefono" type="tel" className="mt-2" />
			</div>
			<fieldset>
				<legend className="text-label-md text-on-surface-variant mb-3">{fields.audience.label}</legend>
				<div className="flex flex-col gap-3 md:flex-row md:gap-6">
					{fields.audience.options.map((opt) => (
						<label key={opt.value} className="flex items-center gap-2 text-body-md cursor-pointer">
							<input type="radio" name="audience" value={opt.value} required />
							{opt.label}
						</label>
					))}
				</div>
			</fieldset>
			<div>
				<Label htmlFor="mensaje">{fields.mensaje.label}</Label>
				<Textarea
					id="mensaje"
					name="mensaje"
					required
					className="mt-2"
					placeholder={fields.mensaje.placeholder}
				/>
			</div>
			<label className="flex items-start gap-3 text-body-sm text-on-surface-variant cursor-pointer">
				<input type="checkbox" required className="mt-1" />
				{fields.consent.label}
			</label>
			{status === "error" && (
				<p role="alert" className="text-body-sm text-error">
					{contactoContent.form.errorMessage}
				</p>
			)}
			<Button type="submit" size="lg" disabled={status === "submitting"}>
				{status === "submitting" ? "Enviando..." : contactoContent.form.submitLabel}
			</Button>
		</form>
	);
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
cd frontend
npm test -- --run ContactForm.test
```

Expected: 3 pass.

- [ ] **Step 5: Wire Contacto page**

Modify `frontend/src/pages/Contacto.tsx`:
```tsx
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/contact/ContactForm";
import { contactoContent } from "@/content/contacto";
import { business } from "@/content/shared";

export default function Contacto() {
	return (
		<PageShell>
			<section className="container mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-6">{contactoContent.hero.eyebrow}</p>
				<h1 className="text-display-md font-bold tracking-tight max-w-3xl">
					{contactoContent.hero.headline}
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					{contactoContent.hero.subheadline}
				</p>
				<div className="mt-16 grid gap-16 md:grid-cols-[1.5fr_1fr]">
					<div>
						<ContactForm />
					</div>
					<div className="flex flex-col gap-6">
						<h2 className="text-headline-sm font-semibold tracking-tight">Tambien puedes</h2>
						<ContactChannel
							icon={<MessageCircle className="h-5 w-5" />}
							label="WhatsApp"
							value={business.phone}
							href={business.whatsappUrl}
						/>
						<ContactChannel
							icon={<Mail className="h-5 w-5" />}
							label="Email"
							value={business.email}
							href={`mailto:${business.email}`}
						/>
						<ContactChannel
							icon={<Phone className="h-5 w-5" />}
							label="Telefono"
							value={business.phone}
							href={`tel:+${business.phoneIntl}`}
						/>
						<div className="flex items-start gap-3 text-body-md text-on-surface-variant">
							<MapPin className="mt-1 h-5 w-5 text-on-surface-muted" aria-hidden="true" />
							<div>
								{business.address.street}
								<br />
								{business.address.postalCode} {business.address.city}
							</div>
						</div>
					</div>
				</div>
			</section>
		</PageShell>
	);
}

function ContactChannel({
	icon,
	label,
	value,
	href,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	href: string;
}) {
	return (
		<a
			href={href}
			target={href.startsWith("http") ? "_blank" : undefined}
			rel="noreferrer"
			className="flex items-center gap-3 text-body-md text-on-surface hover:text-primary"
		>
			<span className="text-on-surface-muted">{icon}</span>
			<span>
				<span className="text-label-caps text-on-surface-muted">{label}</span>
				<span className="block">{value}</span>
			</span>
		</a>
	);
}
```

- [ ] **Step 6: Smoke test**

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173/contacto`. Fill the form, submit, verify success message. Stop server.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/
git commit -m "feat(frontend): Contacto page + form (stub backend submission)"
```

---

## Task 14: Portafolio + Blog placeholders

**Files:**
- Modify: `frontend/src/pages/Portafolio.tsx`
- Modify: `frontend/src/pages/Blog.tsx`

- [ ] **Step 1: Portafolio page**

Modify `frontend/src/pages/Portafolio.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { portafolioContent } from "@/content/portafolio";
import { business } from "@/content/shared";

export default function Portafolio() {
	return (
		<PageShell>
			<section className="container mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-6">{portafolioContent.hero.eyebrow}</p>
				<h1 className="text-display-md font-bold tracking-tight max-w-3xl">
					{portafolioContent.hero.headline}
				</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					{portafolioContent.hero.subheadline}
				</p>
				<div className="mt-16 rounded-xl border border-outline-variant bg-surface-container p-12 text-center">
					<p className="text-body-lg text-on-surface-variant">{portafolioContent.placeholderNote}</p>
					<Button asChild variant="outline" className="mt-6">
						<a href={business.instagram} target="_blank" rel="noreferrer">
							Ver Instagram →
						</a>
					</Button>
				</div>
			</section>
		</PageShell>
	);
}
```

- [ ] **Step 2: Blog placeholder**

Modify `frontend/src/pages/Blog.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";

export default function Blog() {
	return (
		<PageShell>
			<section className="container mx-auto max-w-[1200px] px-6 pt-16 pb-24">
				<p className="text-label-caps text-primary mb-6">BLOG</p>
				<h1 className="text-display-md font-bold tracking-tight max-w-3xl">Proximamente.</h1>
				<p className="mt-6 text-body-lg text-on-surface-variant max-w-2xl">
					Estamos preparando articulos sobre IA, fiscalidad y emprendimiento en Melilla. Mientras
					tanto, puedes seguirnos en Instagram para no perderte nada.
				</p>
			</section>
		</PageShell>
	);
}
```

- [ ] **Step 3: Smoke test**

```bash
cd frontend
npm run dev
```

Visit `/portafolio` and `/blog`. Verify both render. Stop server.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/
git commit -m "feat(frontend): Portafolio + Blog placeholder pages"
```

---

## Task 15: Legal pages (static content)

**Files:**
- Modify: `frontend/src/pages/AvisoLegal.tsx`
- Modify: `frontend/src/pages/PoliticaPrivacidad.tsx`
- Modify: `frontend/src/pages/PoliticaCookies.tsx`

- [ ] **Step 1: Create legal layout helper**

Inside each legal page, follow this pattern. Example for `AvisoLegal.tsx`:
```tsx
import { PageShell } from "@/components/layout/PageShell";
import { business } from "@/content/shared";

export default function AvisoLegal() {
	return (
		<PageShell>
			<article className="container mx-auto max-w-[800px] px-6 pt-16 pb-24 prose prose-invert">
				<h1 className="text-display-md font-bold tracking-tight">Aviso legal</h1>
				<h2 className="mt-12 text-headline-md">Datos identificativos</h2>
				<p className="text-body-md text-on-surface-variant mt-4">
					Titular del sitio web: Joaquin Gorge Lucianez.
					<br />
					Direccion: {business.address.street}, {business.address.postalCode}{" "}
					{business.address.city}.
					<br />
					Email: {business.email}
					<br />
					Telefono: {business.phone}
				</p>
				<h2 className="mt-12 text-headline-md">Objeto</h2>
				<p className="text-body-md text-on-surface-variant mt-4">
					El presente aviso legal regula el uso del sitio web {business.name} (iamelilla.com),
					propiedad del titular indicado.
				</p>
				{/* Continuar con secciones restantes — contenido completo migrado del aviso legal actual de iamelilla.com */}
				<p className="text-body-sm text-on-surface-muted mt-12">
					Ultima actualizacion: mayo 2026.
				</p>
			</article>
		</PageShell>
	);
}
```

**Implementation note**: el contenido completo de los 3 documentos legales se copia del scraping forense en `plans/web-recon-assets/raw/aviso-legal.html`, `politica-privacidad.html`, `politica-cookies.html`. Solo se actualizan datos especificos (año, version) y se eliminan referencias a plugins WordPress.

- [ ] **Step 2: Repeat for PoliticaPrivacidad + PoliticaCookies**

Mismo patron, contenido migrado de los respectivos HTML scraped.

- [ ] **Step 3: Install Tailwind typography for prose styles**

```bash
cd frontend
npm install -D @tailwindcss/typography
```

Add to globals.css after the imports:
```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 4: Smoke test**

Visit each legal page. Verify formato lectura readable.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/ frontend/src/styles/ frontend/package.json
git commit -m "feat(frontend): legal pages — aviso legal, privacidad, cookies"
```

---

## Task 16: anime.js animations

**Files:**
- Create: `frontend/src/components/animations/useAnimeEntry.ts`
- Create: `frontend/src/components/animations/useScrollFadeIn.ts`
- Create: `frontend/src/hooks/useReducedMotion.ts`
- Modify: `frontend/src/components/sections/Hero.tsx`
- Modify: `frontend/src/components/sections/AudienceSplit.tsx`

- [ ] **Step 1: Install anime.js**

```bash
cd frontend
npm install animejs
npm install -D @types/animejs
```

- [ ] **Step 2: useReducedMotion**

Create `frontend/src/hooks/useReducedMotion.ts`:
```ts
import { useEffect, useState } from "react";

export function useReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);
	return reduced;
}
```

- [ ] **Step 3: useAnimeEntry hook**

Create `frontend/src/components/animations/useAnimeEntry.ts`:
```ts
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function useAnimeEntry<T extends HTMLElement>(delay = 0) {
	const ref = useRef<T>(null);
	const reduced = useReducedMotion();
	useEffect(() => {
		if (!ref.current || reduced) return;
		const instance = animate(ref.current, {
			opacity: [0, 1],
			translateY: [24, 0],
			duration: 700,
			delay,
			easing: "cubicBezier(0.16, 1, 0.3, 1)",
		});
		return () => instance.pause();
	}, [delay, reduced]);
	return ref;
}
```

- [ ] **Step 4: useScrollFadeIn hook**

Create `frontend/src/components/animations/useScrollFadeIn.ts`:
```ts
import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function useScrollFadeIn<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const reduced = useReducedMotion();
	useEffect(() => {
		if (!ref.current || reduced) return;
		const el = ref.current;
		el.style.opacity = "0";
		el.style.transform = "translateY(24px)";
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						animate(el, {
							opacity: [0, 1],
							translateY: [24, 0],
							duration: 600,
							easing: "cubicBezier(0.16, 1, 0.3, 1)",
						});
						observer.unobserve(el);
					}
				});
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [reduced]);
	return ref;
}
```

- [ ] **Step 5: Apply entry animation to Hero**

Modify `frontend/src/components/sections/Hero.tsx` — wrap content in refs:
```tsx
import { useAnimeEntry } from "@/components/animations/useAnimeEntry";
// inside the component:
const eyebrowRef = useAnimeEntry<HTMLParagraphElement>(0);
const headlineRef = useAnimeEntry<HTMLHeadingElement>(100);
const subRef = useAnimeEntry<HTMLParagraphElement>(200);
const ctaRef = useAnimeEntry<HTMLDivElement>(300);
// then attach ref={eyebrowRef} etc.
```

- [ ] **Step 6: Apply scroll fade to AudienceSplit cards**

Modify `frontend/src/components/sections/AudienceSplit.tsx`. Replace the `<Card>` wrapping with a div using `useScrollFadeIn`:
```tsx
import { useScrollFadeIn } from "@/components/animations/useScrollFadeIn";

function AudienceCardWrapper({ children }: { children: React.ReactNode }) {
	const ref = useScrollFadeIn<HTMLDivElement>();
	return <div ref={ref}>{children}</div>;
}
```

Then wrap each Card render in `<AudienceCardWrapper>`.

- [ ] **Step 7: Smoke test**

```bash
cd frontend
npm run dev
```

Verify hero entry animates on first load. Scroll down — audience cards fade in. Set OS to reduced motion → animations should not run. Stop server.

- [ ] **Step 8: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): anime.js entry + scroll fade animations with reduced-motion respect"
```

---

## Task 17: SEO — meta tags, sitemap, JSON-LD

**Files:**
- Create: `frontend/src/components/seo/SeoHead.tsx`
- Create: `frontend/public/robots.txt`
- Modify: `frontend/index.html`
- Modify: each page in `frontend/src/pages/` to use SeoHead

- [ ] **Step 1: Install react-helmet-async**

```bash
cd frontend
npm install react-helmet-async
```

- [ ] **Step 2: Wrap App with HelmetProvider**

Modify `frontend/src/App.tsx`:
```tsx
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";

function AppRoutes() {
	return useRoutes(routes);
}

export default function App() {
	return (
		<HelmetProvider>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</HelmetProvider>
	);
}
```

- [ ] **Step 3: SeoHead component**

Create `frontend/src/components/seo/SeoHead.tsx`:
```tsx
import { Helmet } from "react-helmet-async";
import { business } from "@/content/shared";

interface SeoHeadProps {
	title: string;
	description: string;
	path: string;
	ogImage?: string;
}

const SITE_URL = "https://iamelilla.com";

export function SeoHead({ title, description, path, ogImage }: SeoHeadProps) {
	const canonical = `${SITE_URL}${path}`;
	const image = ogImage || `${SITE_URL}/og-default.png`;
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={canonical} />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={canonical} />
			<meta property="og:image" content={image} />
			<meta property="og:locale" content="es_ES" />
			<meta property="og:site_name" content={business.name} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />
		</Helmet>
	);
}
```

- [ ] **Step 4: Add JSON-LD to Home only**

Create `frontend/src/components/seo/OrganizationJsonLd.tsx`:
```tsx
import { Helmet } from "react-helmet-async";
import { business } from "@/content/shared";

export function OrganizationJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": "https://iamelilla.com/#organization",
				name: business.name,
				url: "https://iamelilla.com",
				email: business.email,
				telephone: business.phone,
				sameAs: [business.instagram, business.linkedin, business.facebook],
				address: {
					"@type": "PostalAddress",
					streetAddress: business.address.street,
					postalCode: business.address.postalCode,
					addressLocality: business.address.city,
					addressCountry: business.address.country,
				},
				description:
					"IA Melilla construye soluciones de inteligencia artificial para empresas, autonomos y particulares.",
			},
			{
				"@type": "WebSite",
				"@id": "https://iamelilla.com/#website",
				url: "https://iamelilla.com",
				name: business.name,
				inLanguage: "es",
			},
		],
	};
	return (
		<Helmet>
			<script type="application/ld+json">{JSON.stringify(data)}</script>
		</Helmet>
	);
}
```

- [ ] **Step 5: Add SeoHead to every page**

Example for Home:
```tsx
import { SeoHead } from "@/components/seo/SeoHead";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
// inside:
<SeoHead
	title="IA Melilla — Inteligencia artificial para empresas, autonomos y particulares"
	description="Construimos asistentes de IA practicos desde Melilla. Demo: IA Fiscal Melilla, especialista en regimen local."
	path="/"
/>
<OrganizationJsonLd />
```

Apply tailored `title` + `description` for each page using this table:

| Page | title (≤60 chars) | description (≤155 chars) |
|------|-------------------|--------------------------|
| Home `/` | IA Melilla — Inteligencia artificial para empresas y particulares | Construimos asistentes de IA practicos desde Melilla. Demo: IA Fiscal Melilla, especialista en regimen local. |
| `/empresas` | IA para empresas y autonomos — IA Melilla | Software de IA hecho a medida para asesorias, despachos y pymes. Integraciones reales, sin proof of concept eternos. |
| `/particulares` | Tu asistente fiscal de IA — IA Melilla | Pregunta lo que necesites sobre renta, IPSI, deducciones. Respuesta clara con fuentes oficiales, sin esperar al gestor. |
| `/demos/ia-fiscal-melilla` | IA Fiscal Melilla — Demo en vivo | Asistente IA entrenado en normativa fiscal de Melilla. IPSI, REF, IRPF local, deducciones, plazos. Responde con fuente. |
| `/contacto` | Contacto — IA Melilla | Cuentanos tu caso. Respondemos el mismo dia. Email, WhatsApp y formulario directos al equipo de IA Melilla. |
| `/portafolio` | Portafolio — Proyectos IA Melilla | Imagenes, videos y enlaces a proyectos reales de inteligencia artificial entregados por IA Melilla. |
| `/blog` | Blog — IA Melilla | Articulos sobre inteligencia artificial, fiscalidad y emprendimiento en Melilla y mas alla. |
| `/aviso-legal` | Aviso legal — IA Melilla | Aviso legal del sitio web iamelilla.com, propiedad de Joaquin Gorge Lucianez. Datos identificativos y condiciones de uso. |
| `/politica-de-privacidad` | Politica de privacidad — IA Melilla | Como tratamos y protegemos los datos personales de los usuarios del sitio iamelilla.com. |
| `/politica-de-cookies` | Politica de cookies — IA Melilla | Informacion sobre el uso de cookies en iamelilla.com: que son, cuales usamos y como gestionarlas. |

Implementation: in each page file, place `<SeoHead title="..." description="..." path="..." />` right after the `<PageShell>` opening tag.

- [ ] **Step 6: Update index.html**

Modify `frontend/index.html` `<head>` to add default tags + font preload:
```html
<link rel="preconnect" href="https://rsms.me" crossorigin />
<link rel="preload" as="style" href="/src/styles/fonts.css" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="theme-color" content="#0A0A0A" />
```

- [ ] **Step 7: robots.txt**

Create `frontend/public/robots.txt`:
```
User-Agent: *
Disallow:

User-agent: GPTBot
Disallow:

Sitemap: https://iamelilla.com/sitemap.xml
```

- [ ] **Step 8: Static sitemap.xml**

Create `frontend/public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>https://iamelilla.com/</loc></url>
	<url><loc>https://iamelilla.com/empresas</loc></url>
	<url><loc>https://iamelilla.com/particulares</loc></url>
	<url><loc>https://iamelilla.com/demos/ia-fiscal-melilla</loc></url>
	<url><loc>https://iamelilla.com/contacto</loc></url>
	<url><loc>https://iamelilla.com/portafolio</loc></url>
	<url><loc>https://iamelilla.com/blog</loc></url>
	<url><loc>https://iamelilla.com/aviso-legal</loc></url>
	<url><loc>https://iamelilla.com/politica-de-privacidad</loc></url>
	<url><loc>https://iamelilla.com/politica-de-cookies</loc></url>
</urlset>
```

- [ ] **Step 9: Smoke test**

```bash
cd frontend
npm run dev
```

Visit each route, inspect `<head>` in DevTools → confirm title/description/canonical/OG change per page. Home should also have the JSON-LD script. Stop server.

- [ ] **Step 10: Commit**

```bash
git add frontend/
git commit -m "feat(frontend): SEO meta tags + JSON-LD + sitemap + robots"
```

---

## Task 18: Deploy — Dockerfile + nginx + Coolify

**Files:**
- Create: `frontend/Dockerfile`
- Create: `frontend/nginx.conf`
- Create: `frontend/.dockerignore`

- [ ] **Step 1: Multi-stage Dockerfile**

Create `frontend/Dockerfile`:
```dockerfile
# ---------- build stage ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 2: nginx config**

Create `frontend/nginx.conf`:
```nginx
server {
	listen 80;
	server_name _;
	root /usr/share/nginx/html;
	index index.html;
	
	# Long-cache for hashed assets
	location ~* \.(?:css|js|woff2?|svg|jpg|jpeg|png|webp|gif|ico)$ {
		expires 1y;
		add_header Cache-Control "public, immutable";
		access_log off;
		try_files $uri =404;
	}
	
	# SPA fallback
	location / {
		try_files $uri $uri/ /index.html;
	}
	
	# Sitemap & robots — no cache
	location ~ ^/(robots\.txt|sitemap\.xml)$ {
		add_header Cache-Control "no-cache, must-revalidate";
	}
	
	# Gzip + Brotli (brotli requires module — skipping)
	gzip on;
	gzip_vary on;
	gzip_min_length 256;
	gzip_types text/plain text/css application/javascript application/json image/svg+xml;
	
	# Security headers
	add_header X-Frame-Options "SAMEORIGIN" always;
	add_header X-Content-Type-Options "nosniff" always;
	add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

- [ ] **Step 3: .dockerignore**

Create `frontend/.dockerignore`:
```
node_modules
dist
.vite
.eslintcache
coverage
*.log
.DS_Store
.git
.gitignore
README.md
src/test
__tests__
```

- [ ] **Step 4: Local docker build test**

```bash
cd frontend
docker build -t ia-melilla-frontend .
docker run --rm -p 8080:80 ia-melilla-frontend
```

Open `http://localhost:8080/` → home renders. Visit other routes — SPA fallback works. Stop container.

- [ ] **Step 5: Document Coolify deploy in plan**

Add a section to `plans/web-recon-iamelilla-2026-05-20.md` "Apendice — Coolify deployment" (a follow-up task to wire up; not part of this implementation phase, but the Dockerfile is ready).

- [ ] **Step 6: Commit**

```bash
git add frontend/Dockerfile frontend/nginx.conf frontend/.dockerignore
git commit -m "feat(frontend): Dockerfile + nginx config for Coolify static deploy"
```

---

## Task 19: Final verification

- [ ] **Step 1: Run full test suite**

```bash
cd frontend
npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 2: Run lint**

```bash
cd frontend
npm run lint
```

Expected: 0 errors.

- [ ] **Step 3: Production build**

```bash
cd frontend
npm run build
```

Expected: build succeeds. Note bundle size from output. Target: initial JS < 200 KB gzipped.

- [ ] **Step 4: Lighthouse local audit**

Serve the build locally:
```bash
cd frontend
npm run preview
```

Open `http://localhost:4173/` in Chrome → DevTools → Lighthouse → Performance + SEO + Accessibility (Desktop).

Expected:
- Performance ≥ 85
- SEO ≥ 95
- Accessibility ≥ 95
- Best Practices ≥ 90

Document the actual scores in a comment on the commit message of the next step.

- [ ] **Step 5: Run `theme:lint`**

```bash
cd frontend
npm run theme:lint
```

Expected: 0 errors, warnings allowed (orphan tokens).

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore(frontend): Fase 1 verified — tests pass, build green, Lighthouse [actual scores]"
```

---

## Acceptance criteria for Fase 1 closure

- [ ] All 11 routes (`/`, `/empresas`, `/particulares`, `/demos/ia-fiscal-melilla`, `/contacto`, `/portafolio`, `/blog`, 3 legales, `/404`) render in dev
- [ ] All tests pass (Vitest)
- [ ] `npm run build` succeeds
- [ ] `npm run lint` 0 errors
- [ ] `npm run theme:lint` 0 errors
- [ ] Contact form posts to stub API and shows success/error states
- [ ] WhatsApp float button links to `wa.me/34654186173`
- [ ] Hero entry animation runs on home (or skipped if `prefers-reduced-motion`)
- [ ] Scroll fade-in works on audience cards (or skipped)
- [ ] Nav sticky + shrinks on scroll
- [ ] All pages have SEO `<title>` + `<meta description>` + canonical
- [ ] Home has JSON-LD Organization + WebSite
- [ ] `sitemap.xml` and `robots.txt` accessible at root
- [ ] Dockerfile builds and serves on port 80
- [ ] Lighthouse Performance ≥ 85, SEO ≥ 95, A11y ≥ 95
- [ ] Mobile responsive 320 / 768 / 1024 / 1440 — no horizontal scroll, no overlapping content

---

## Out of scope (deferred to next phases)

- **Backend `/api/leads`** — Fase 2 (contact form wiring)
- **IA Fiscal Melilla functional demo** — Fase 2 (LLM integration, RAG strategy TBD)
- **Real portfolio gallery curation** — Fase 2
- **Blog real content + MDX setup** — Fase 6
- **Playwright E2E tests** — Fase 2
- **i18n `/en/`** — post-MVP
- **Analytics (Plausible)** — Fase 2
- **Cookie banner functional consent storage** — Fase 2 (currently no banner)
- **301 redirects from WordPress old URLs** — handled at Coolify/nginx level on cutover day
