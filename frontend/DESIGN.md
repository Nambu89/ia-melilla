---
version: alpha
name: IA Melilla v2
description: Charcoal + emerald premium aesthetic for IA Melilla — serious, fiscal-grade, zero AI-generic tropes. Built for a dual B2B/B2C audience showroom whose flagship demo is IA Fiscal Melilla.
colors:
  # Surfaces (charcoal progression — neutral, not tinted blue)
  surface: "#0A0A0A"
  surface-dim: "#080808"
  surface-bright: "#2E2E2E"
  surface-container-lowest: "#050505"
  surface-container-low: "#101010"
  surface-container: "#171717"
  surface-container-high: "#1F1F1F"
  surface-container-highest: "#262626"
  surface-variant: "#212121"

  # Text / on-surface
  on-surface: "#FAFAFA"
  on-surface-variant: "#A3A3A3"
  on-surface-muted: "#737373"
  on-surface-dim: "#525252"
  inverse-surface: "#FAFAFA"
  inverse-on-surface: "#0A0A0A"

  # Outlines / borders
  outline: "#2E2E2E"
  outline-variant: "#1F1F1F"
  outline-strong: "#404040"

  # Primary — Melilla blue (CTA, brand). Reemplaza emerald Linear desde 2026-05-23.
  # Pantone 2935 / bandera oficial Melilla. WCAG AA OK (#005EC4 sobre #0A0A0A = 5.5:1).
  primary: "#005EC4"
  on-primary: "#FFFFFF"
  primary-container: "#003B7F"
  on-primary-container: "#CFE4FF"
  primary-hover: "#2A78D8"
  primary-active: "#004A9C"
  primary-subtle: "#001F4D"

  # Tertiary — deep blue (B2B audience pathway)
  tertiary: "#1E40AF"
  on-tertiary: "#DBEAFE"
  tertiary-container: "#1E3A8A"
  on-tertiary-container: "#DBEAFE"
  tertiary-subtle: "#172554"

  # Secondary — amber (B2C audience pathway)
  secondary: "#B45309"
  on-secondary: "#FFFBEB"
  secondary-container: "#78350F"
  on-secondary-container: "#FDE68A"
  secondary-subtle: "#451A03"

  # Status colors
  success: "#10B981"
  on-success: "#022C1F"
  success-container: "#064E3B"
  on-success-container: "#A7F3D0"
  warning: "#D97706"
  on-warning: "#1C1004"
  warning-container: "#78350F"
  on-warning-container: "#FDE68A"
  error: "#DC2626"
  on-error: "#FEF2F2"
  error-container: "#7F1D1D"
  on-error-container: "#FECACA"

  # Background
  background: "#0A0A0A"
  on-background: "#FAFAFA"

typography:
  display-xl:
    fontFamily: Inter Display
    fontSize: 96px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Inter Display
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.035em
  display-md:
    fontFamily: Inter Display
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter Display
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter Display
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter Display
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.04em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.12em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 10px
  xl: 14px
  "2xl": 20px
  full: 9999px

spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px
  "4xl": 96px
  "5xl": 128px
  container-padding: 24px
  container-max: 1200px
  section-y-mobile: 80px
  section-y-desktop: 128px

components:
  # Navigation
  nav-link:
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.label-lg}"
    padding: "8px 12px"
  nav-link-hover:
    textColor: "{colors.on-surface}"
  nav-link-active:
    textColor: "{colors.on-surface}"

  # Buttons
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"

  button-secondary:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    height: 44px
  button-secondary-hover:
    backgroundColor: "{colors.surface-container-highest}"

  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-container-low}"

  button-outline:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-outline-hover:
    backgroundColor: "{colors.surface-container-low}"

  # Audience-coded buttons (only in B2B/B2C split hero)
  button-b2b:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-tertiary-container}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: "16px 28px"
  button-b2c:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: "16px 28px"

  # WhatsApp float (WhatsApp's darkest official brand green — WCAG AA pass)
  button-whatsapp-float:
    backgroundColor: "#075E54"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    height: 56px
    width: 56px

  # Cards
  card-default:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-elevated:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-interactive-hover:
    backgroundColor: "{colors.surface-container-highest}"

  # Inputs
  input-field:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: 44px
  input-field-focus:
    backgroundColor: "{colors.surface-container}"

  # Hero
  hero-headline:
    textColor: "{colors.on-surface}"
    typography: "{typography.display-lg}"
  hero-subheadline:
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-lg}"
  hero-eyebrow:
    textColor: "{colors.primary}"
    typography: "{typography.label-caps}"

  # Stat block
  stat-number:
    textColor: "{colors.on-surface}"
    typography: "{typography.display-md}"
  stat-label:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-caps}"
  stat-accent:
    textColor: "{colors.primary}"
    typography: "{typography.display-md}"

  # Badges
  badge-default:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  badge-primary:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  badge-b2b:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-tertiary-container}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  badge-b2c:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  badge-success:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: "4px 12px"

  # Dividers
  divider-default:
    backgroundColor: "{colors.outline-variant}"
    height: 1px
---

## Brand & Style

IA Melilla v2 is a precision dark interface in the tradition of Linear and Notion, with a deliberate fiscal-grade restraint. The flagship demo of the showroom is **IA Fiscal Melilla** — an AI assistant that helps autonomos and small businesses with tax, accounting, and compliance questions specific to Melilla's fiscal regime (IPSI, REF, IGIC absent, etc.). That demo sets the tone for the whole site: everything we ship has to feel like the work of a software product team that takes fiscal accuracy as seriously as a tax advisor would.

Three priorities in this exact order:

1. **Credibility** — the visual language must read "we build production software," not "we use AI generators." A fiscal asistant cannot afford to look like a Lovable demo.
2. **Dual audience legibility** — B2B (asesorias, autonomos, pymes) and B2C (particulares haciendo renta) see different signals on first scroll. The audience-coded colors (deep blue for B2B, amber for B2C) appear only in audience-routing components.
3. **Mediterranean ambition** — born in Melilla, but the product reasons about Spanish national tax law and beyond. Localness is a story, not a constraint.

The emotional register is calm, dense, confident. We deliberately avoid the visual cliches of the 2024-2026 AI startup wave: no glassmorphism, no orb-and-particle gradients, no holographic shaders, no abstract floating shapes meant to evoke "intelligence."

What you'll see instead: high-contrast type on near-black surfaces, surgical use of Melilla blue, generous vertical rhythm, and motion measured in milliseconds.

## Colors

The palette is rooted in **neutral charcoal** — not tinted-blue like Tailwind slate, not warm-grey like Notion. Pure neutral darks (`#0A0A0A` to `#262626`) form the surface progression. Decisions:

- **Charcoal surfaces** read "professional software" rather than "tech-startup blue." Slate-blue surfaces are over-used; neutral charcoal is what serious products (Linear, Vercel docs dark mode, Notion dark) standardized on after 2024.
- **Melilla blue primary (`#005EC4`)** carries the brand. Es el azul oficial de la bandera de Melilla (Pantone 2935), heredado de la Casa de Medina Sidonia. Connota institucionalidad, confianza, verificación y origen local sin caer en el tópico fintech-blue genérico. Contraste WCAG AA: `#005EC4` sobre `#0A0A0A` = 5.5:1; `#FFFFFF` sobre `#005EC4` = 6.7:1.
- **Tertiary deep blue (`#1E40AF`) for B2B**, **secondary amber (`#B45309`) for B2C**. These colors only exist in audience-routing components (audience-coded buttons and badges). If you see deep blue, you're in a B2B context. If you see amber, you're in B2C. Never mix in one component. (El primary Melilla blue es más vibrante y se distingue del tertiary deep blue B2B.)
- **Status colors** mantienen emerald (`#10B981`) para success — verificación, validación de formularios, confirmaciones. Warning `#D97706`, error `#DC2626`. Status colors solo aparecen en contextos reales de estado, nunca decorativamente.
- **On-surface text:** `#FAFAFA` for headlines, `#A3A3A3` for body, `#737373` for metadata. All three exceed WCAG AAA on the surface family.
- **Outlines:** `#2E2E2E` for default borders, `#1F1F1F` for subtle dividers, `#404040` for emphasized borders. Always 1px, always intentional.

The palette deliberately does NOT inherit anything from the existing WordPress site. The cyan accent on the current iamelilla.com belongs to that build; v2 starts clean.

Decisión 2026-05-23: el primary color cambia de emerald (`#10B981`) a azul oficial de Melilla (`#005EC4`, Pantone 2935). Razones: orgullo local + identidad institucional reconocible + la web pasa a tener el azul de la bandera como acento principal. Emerald se reserva para success/validación. La paleta cumple WCAG AA en ambos modos.

## Typography

The type system collapses to a single family: **Inter Display** for everything. Inter Display covers display, headline, body, and label roles via weight and size variation alone. Reasons:

- One font family means one network request and a smaller bundle
- Inter Display's display variant is optimized for large sizes (better than regular Inter above 56px)
- Linear, Stripe, and Vercel all built durable identities on Inter — proven technical aesthetic
- For a fiscal product, type discipline is more credibility-building than custom typefaces

Type discipline rules:

- **Display sizes (`56px+`)** carry negative letter-spacing (`-0.03em` to `-0.04em`) and tight line-heights (`1.0–1.1`). Linear signature.
- **Headlines (`24–40px`)** use moderate negative tracking (`-0.01em` to `-0.02em`).
- **Body (`14–18px`)** uses neutral tracking (`0em`) and generous line-height (`1.55–1.6`) for long-form readability (important for fiscal explainers and demo conversations).
- **Labels and uppercase (`11–14px`)** use positive tracking (`+0.01em` to `+0.12em`). The strongest tracking goes to `label-caps` — used for section markers, eyebrow text, and stat labels.
- **Weight palette:** 400, 600, 700. No 500 (visually indistinguishable). No italics — use color and weight to differentiate.

Code blocks and inline code use **JetBrains Mono** as the sole monospace concession (useful for showing fiscal forms references like Modelo 100, IRPF, etc.).

## Layout & Spacing

The layout is built on a **4px base unit**, scaling on doubling steps to a 128px maximum. Common increments: 4, 8, 16, 24, 32, 48, 64, 96, 128. Avoid off-grid values.

- **Container max-width**: `1200px`. Tighter than typical `1280px` to maintain visual stability of large display headings.
- **Container padding**: `24px` mobile, `32px` tablet, `48px` desktop.
- **Section vertical rhythm**: `80px` mobile / `128px` desktop between major sections. Spacious by design — dense fiscal content reads as anxiety.
- **Card internal padding**: `24px` default, `32px` elevated.
- **Gaps within sections**: `16px` related items, `48px` topic shift.

Grids:

- Hero: 12-column desktop, 1-column mobile
- Demo / service cards: 3-column desktop (`1024px+`), 2-column tablet, 1-column mobile
- Footer: 4-column desktop, 2-column tablet, 1-column mobile

CSS Grid only when 2D alignment is genuinely required. Flexbox for everything else.

## Elevation & Depth

Depth via **tonal layering**, not shadows.

- **Level 0 (page):** `surface` (`#0A0A0A`)
- **Level 1 (resting card):** `surface-container` (`#171717`) — no border, no shadow
- **Level 2 (hover):** `surface-container-highest` (`#262626`)
- **Level 3 (modal/overlay):** `surface-container-high` (`#1F1F1F`) + 1px `outline` border + single shadow `0 24px 48px -12px rgba(0,0,0,0.8)` to lift from backdrop

No box-shadows on resting cards. Shadow exists only for floating overlays (modals, dropdowns, WhatsApp float).

## Shapes

The shape vocabulary is **tight radius, technical edges**.

- **Buttons, inputs, cards**: `rounded.md` (`6px`) by default — tighter than the usual `8px` to feel more software-engineered
- **Large cards**: `rounded.lg` (`10px`)
- **Featured cards**: `rounded.xl` (`14px`)
- **Badges and pills**: `rounded.full`
- **Avatars, WhatsApp float**: `rounded.full`

Borders always `1px solid`. Never `2px`. Never dashed/dotted.

Icons: line-based, 1.5–2px stroke, Lucide React. No filled icons except status indicators.

## Components

### Navigation

Sticky top nav, shrinks on scroll. Logo left, nav items center, primary CTA right. Use `nav-link` for inactive, `nav-link-hover` and `nav-link-active` for state changes. Primary CTA on nav reflects the most important action of the current section — not "Contact" on every page.

### Hero (Split B2B/B2C)

The home hero divides into two paths after the headline. B2B card uses `button-b2b` and `badge-b2b` (deep blue family). B2C card uses `button-b2c` and `badge-b2c` (amber family). Cards sit on `card-default` with a 1px `outline-variant` border. On hover, elevate to `surface-container-highest`.

### Buttons

Four variants by intent:
- `button-primary` — emerald, single most important action per screen
- `button-secondary` — surface-container-high, "the other path"
- `button-ghost` — no background, tertiary actions
- `button-outline` — transparent with border, for secondary CTAs that need definition

B2B/B2C variants exist ONLY inside the audience-split hero. Use them anywhere else and the color coding loses meaning.

### Stat Numbers

Use `stat-number` for the figure (large display type, on-surface white) or `stat-accent` (emerald) when the stat is the headline of the section. Use `stat-label` for the descriptor (small uppercase tracked muted text). Animate from 0 to the final value with anime.js when entering viewport (300–600ms, `easeOutCubic`).

**Do not display placeholder stats.** If we don't have a verified number, don't show one. This rule is non-negotiable for a fiscal product.

### Cards

Default cards use `card-default`. Featured / call-to-attention cards use `card-elevated`. Interactive cards get `card-interactive-hover` on `:hover`. Rounded corners, no shadows at rest, motion under 200ms.

### Demo Cards (showroom)

A specific kind of card used for the demo listing. Each demo card includes:
- Eyebrow tag (`badge-b2b` or `badge-b2c` depending on target audience, `badge-primary` when both)
- Demo title (`typography.headline-sm`)
- One-line description (`typography.body-md`, `on-surface-variant`)
- "Probar demo" CTA (`button-outline`)
- Hover: elevation + emerald border accent appears

### Inputs

Single text input variant, single textarea. Focus state is a subtle background tone shift (`input-field-focus`), not an outline ring. Use `:focus-visible` (keyboard only) for a 2px emerald outline; mouse focus uses tone shift only.

### Cookie Banner

Custom-built (no plugin), bottom-fixed, single row desktop, stacked mobile. Background `surface-container-high`, text `on-surface`, two buttons: `button-ghost` (reject) and `button-primary` (accept). Max 60KB compiled.

### WhatsApp Float

`button-whatsapp-float`. 56px circular, fixed bottom-right with `18px` offset. We use **WhatsApp's darkest official brand green `#075E54`** rather than the bright `#25D366` — the dark teal hits WCAG AA contrast with white text (`#075E54` + `#FFFFFF` = 7.5:1) while still being unmistakably WhatsApp (it's WhatsApp's own brand color, used in their app's header). Hover: scale 1.05 + single subtle pulse ring (anime.js, 600ms, with 4s pause between pulses).

## Do's and Don'ts

- **Do** use the emerald `primary` color for one element per visible screen. Two primaries on a screen = one of them is wrong.
- **Don't** mix the B2B (deep blue) and B2C (amber) accent colors in the same component or section.
- **Do** use the surface progression (`surface`, `surface-container`, `surface-container-high`, `surface-container-highest`) to convey depth instead of reaching for shadows.
- **Don't** use blur, glassmorphism, or transparency effects. They violate the brand and tank performance.
- **Do** animate purposefully: hero entry, scroll-triggered fade-in, stat counters. 150–300ms UI, 600–800ms hero.
- **Don't** animate decoratively. No floating orbs, no parallax backgrounds, no infinite-loop particles.
- **Do** display stats only with verified numbers. Placeholder stats destroy credibility — fatal for a fiscal product.
- **Don't** keyword-stuff headlines. Write for humans; the 2026 algorithm prefers natural prose.
- **Do** preserve the WhatsApp float button — it converts in the current site.
- **Don't** introduce a third or fourth typeface. Inter Display + JetBrains Mono is the entire family.
- **Do** respect `prefers-reduced-motion` — disable non-essential animation.
- **Don't** rely on color alone to convey state. Always pair with iconography or text labels (accessibility).
- **Do** validate this file with `node node_modules/@google/design.md/dist/index.js lint frontend/DESIGN.md` before merging changes to the design system.
- **Do** export Tailwind theme with `node node_modules/@google/design.md/dist/index.js export --format tailwind frontend/DESIGN.md` whenever tokens change.
