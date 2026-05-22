# Rediseño Espectacular Frontend IA Melilla v2 — Design Spec

> **Fecha:** 2026-05-22
> **Autor:** PM Coordinator (sesión brainstorming con Fernando)
> **Estado:** Aprobado por usuario (secciones 1-6 OK), pendiente review final spec
> **Branch destino:** `claude/frontend-redesign-spectacular` (crear desde `main` tras merge actual `claude/frontend-healthcheck-ipv4`)
> **Issue raíz que origina este trabajo:** layout colapsa en producción (deploy `http://sz39upcf6i90z0scclclnaq6.178.238.227.50.sslip.io/`) por bug Tailwind v4 token collision `--spacing-Xxl` vs `--container-Xxl`. Aprovechamos el bugfix para subir nivel visual a producto premium.

---

## 1. Big Picture + Arquitectura

### Objetivo
Sustituir frontend actual (estructura correcta pero visualmente roto y poco impactante) por web **espectacular, responsive mobile-first, premium tier** manteniendo identidad Charcoal + Emerald del `DESIGN.md`. Producto estrella: chat real funcional contra backend Impuestify (demo IA Fiscal Melilla).

### Topología despliegue
```
VPS Contabo 178.238.227.50 (Coolify)
├── iamelilla.com
│   └── contenedor "frontend"
│       Source: este repo (Nambu89/AI-Melilla branch claude/frontend-redesign-spectacular)
│       Build: Vite + nginx static
│
├── fiscal.iamelilla.com (provisional: subdominio sslip.io Coolify)
│   └── contenedor "fiscal-backend"
│       Source: github.com/Nambu89/Impuestify branch demo/fiscal-ia-melilla
│       Dockerfile ya existe en backend/Dockerfile
│       Puerto: 8000 (FastAPI uvicorn)
│
└── panel.iamelilla.com → Coolify UI
```

### Routing frontend v2
| Ruta | Componente | Notas |
|------|------------|-------|
| `/` | `HomeNew` | Hero + marquee tech + dos publicos + demo preview + proceso + comparativa + melilla + FAQ + hablamos |
| `/empresas` | `EmpresasNew` (B2B) | 3 casos uso, integraciones, pricing tiers, casos exito |
| `/particulares` | `ParticularesNew` (B2C) | 3 casos uso cotidianos, sin pricing, tono cercano |
| `/demos` | `DemosListing` | Card flagship live + skeletons coming soon |
| `/demos/ia-fiscal-melilla` | `IAFiscalChat` | Chat real funcional SSE contra backend Impuestify |
| `/portafolio` | `Portafolio` | Grid masonry casos proyectos (mock Phase 1) |
| `/blog` | `BlogList` | List MDX posts + tags filter |
| `/blog/:slug` | `BlogPost` | MDX renderer + TOC + share |
| `/contacto` | `Contacto` | Form + Formspree interim + WhatsApp + map |
| `/aviso-legal`, `/politica-de-privacidad`, `/politica-de-cookies` | legal pages | Markdown puro |

---

## 2. Sistema Visual + Tokens

### 2.1 Fix Tailwind v4 root cause (origen layout roto)

**Causa:** `theme.css` define `--spacing-Xxl` (xs=4px, 2xl=48px, 3xl=64px, 4xl=96px). Tailwind v4 resuelve `max-w-Xxl` contra estos tokens en lugar de los defaults `--container-Xxl` (42rem, 48rem, 56rem). H1 hero queda 96px de ancho, layout colapsa.

**Fix:** actualizar `frontend/scripts/generate-theme.mjs` para emitir AMBOS namespaces. Spacing para paddings/margins/gaps. Container para max-w-*.

```css
@theme {
  /* Spacing (paddings/margins/gaps) */
  --spacing-xs: 4px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;

  /* Container (max-w-*) — Tailwind v4 default scale */
  --container-xs: 20rem;
  --container-sm: 24rem;
  --container-md: 28rem;
  --container-lg: 32rem;
  --container-xl: 36rem;
  --container-2xl: 42rem;
  --container-3xl: 48rem;
  --container-4xl: 56rem;
  --container-5xl: 64rem;
  --container-6xl: 72rem;
  --container-7xl: 80rem;
}
```

### 2.2 Fuentes self-host
- Descargar `Inter-Variable.woff2` + `InterDisplay-Variable.woff2` a `frontend/public/fonts/`
- Subset latin + latin-ext
- `@font-face src: local + url('/fonts/...woff2')`
- Eliminar dependencia rsms.me (404 actual)

### 2.3 Paleta — Charcoal + Emerald (dark base + light mode)

```yaml
# DARK (mantener actual DESIGN.md)
surface:                #0A0A0A
surface-container-low:  #101010
surface-container:      #171717
surface-container-high: #1F1F1F
on-surface:             #FAFAFA
on-surface-variant:     #A3A3A3
on-surface-muted:       #737373
outline:                #2E2E2E
outline-variant:        #1F1F1F
primary:                #10B981  # emerald 500
primary-hover:          #34D399
primary-active:         #059669
primary-subtle:         #022C22

# LIGHT (nuevo — espejo high-contrast)
surface:                #FAFAFA
surface-container-low:  #F5F5F5
surface-container:      #FFFFFF
surface-container-high: #EAEAEA
on-surface:             #0A0A0A
on-surface-variant:     #525252
on-surface-muted:       #737373
outline:                #D4D4D4
outline-variant:        #E5E5E5
primary:                #059669  # emerald 600 (contraste sobre blanco)
primary-hover:          #047857
primary-active:         #065F46

# AURORA HERO (decorativo, solo dark)
aurora-from: rgba(16, 185, 129, 0.18)
aurora-via:  rgba(5, 150, 105, 0.10)
aurora-to:   rgba(10, 10, 10, 0)
```

Toggle: `localStorage.theme = "dark" | "light" | "system"`, `<html data-theme="..."`. Variables swap por selector `[data-theme="light"]`.

### 2.4 Tipografía fluida

```css
--text-display-xl: clamp(72px, 8vw, 96px);
--text-display-lg: clamp(56px, 6vw, 72px);
--text-display-md: clamp(40px, 5vw, 56px);
--text-headline-lg: clamp(28px, 4vw, 40px);
--text-headline-md: clamp(22px, 3vw, 32px);
--text-headline-sm: 24px;
--text-body-lg: 18px;
--text-body-md: 16px;
--text-label-caps: 11px;  /* tracking 0.12em uppercase */
```

### 2.5 Motion vocabulary

```yaml
# Easings
ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1)
ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1)
spring-default: stiffness 200 damping 25

# Durations
fast:   150ms   # hover, focus
base:   250ms   # section transitions
slow:   500ms   # parallax, page transitions
hero:   800ms   # entrada hero words

# Patterns
words-stagger: 60ms entre palabras hero (anime.js)
section-reveal: opacity 0->1 + translateY 24->0, threshold 0.2 IntersectionObserver
card-hover: lift -4px Y + border emerald 250ms + glow shadow
cta-magnetic: cursor influence ±8px en radius 120px (desktop pointer fine only)
counter: easeOutCubic 1200ms al entrar viewport
page-transition: opacity + translateY 12px, 350ms (AnimatePresence mode="wait")
marquee: translateX -50% loop infinite 30s linear, pause on hover
```

### 2.6 Radii + shadows

```yaml
radius-sm: 4px
radius-md: 6px
radius-lg: 10px   # cards
radius-xl: 14px   # buttons primarios
radius-2xl: 20px  # hero cards / chat container

shadow-sm:    0 1px 2px rgba(0,0,0,0.4)
shadow-md:    0 4px 12px rgba(0,0,0,0.5)
shadow-lg:    0 12px 32px rgba(0,0,0,0.6)
glow-emerald: 0 0 32px rgba(16, 185, 129, 0.25)
ring-focus:   0 0 0 2px rgba(16, 185, 129, 0.5)
```

---

## 3. Páginas — wireframes desktop + mobile

### 3.1 Home `/`

Secciones (orden):
1. **Hero**: title 96px (clamp), aurora verde sutil, animated headline anime.js word-stagger, 2 CTAs (primary "Probar IA Fiscal" + ghost "Como trabajamos")
2. **Marquee Tech** (NUEVO): scroll infinito horizontal con "OpenAI · RAG · LangChain · FastAPI · React · Streaming · Multi-agent · Vector DB · SSE · Vite · Tailwind · Python 3.12 · TypeScript"
3. **Dos públicos** (existente, mejorar): cards B2B/B2C con TiltCard hover + magnetic CTAs
4. **Demo preview** (existente, animar): chat snippet auto-typing
5. **Proceso 3 pasos** (existente, añadir count-up "01" "02" "03")
6. **Comparativa con/sin IA Melilla** (NUEVO): tabla 2-col side-by-side
7. **Melilla no encaja** (existente, parallax sutil background)
8. **FAQ acordeón** (NUEVO): 8 preguntas Radix Accordion
9. **¿Hablamos?** (existente, refinar con MagneticCTA)
10. **Footer** (existente, refinar tokens)

### 3.2 `/empresas` (B2B) + `/particulares` (B2C)

Estructura espejo:
1. Hero pathway (titular grande pathway-specific + CTA)
2. 3 casos uso reales
3. Como integramos (B2B: stack visual integrations) / Para qué te sirve (B2C: ejemplos cotidianos)
4. Pricing tiers Starter/Pro/Custom (SOLO B2B)
5. Casos éxito (cards con metricas; SOLO B2B Phase 1, mock data ok)
6. CTA final pedir cita

### 3.3 `/demos` listing

- Hero "Pruébalo tu mismo"
- Grid 1 card flagship live (IA Fiscal Melilla → /demos/ia-fiscal-melilla)
- 3 skeletons "Coming soon" debajo

### 3.4 `/demos/ia-fiscal-melilla` (FLAGSHIP)

**Desktop:** split layout sidebar 320px + chat flex-1.
**Mobile:** chat full-width + bottom sheet sugerencias.

Componentes:
- `ChatStream` (mensajes + typing indicator + markdown render)
- `ChatSidebar` (preguntas sugeridas estáticas — listado fijo `data/suggested-questions.ts`. Las fuentes citadas vienen INLINE en el markdown de la respuesta del backend, no como evento SSE separado)
- Disclaimer legal sticky bottom
- Pre-mount health check: si `GET /api/demo/health` falla → fallback CTA contacto sin renderizar chat

### 3.5 `/portafolio`, `/blog`, `/contacto`, legal

Ver sección 3 del briefing inline (estructuras simples, datos mock Phase 1).

---

## 4. Componentes signature + tech

### 4.1 Deps nuevas

```jsonc
{
  "dependencies": {
    "animejs": "^4.0.2",
    "framer-motion": "^11.x",
    "@radix-ui/react-accordion": "^1.x",
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-tooltip": "^1.x",
    "react-markdown": "^9.x",
    "remark-gfm": "^4.x",
    "shiki": "^1.x",
    "@mdx-js/react": "^3.x"
  },
  "devDependencies": {
    "@mdx-js/rollup": "^3.x"
  }
}
```

Estimado +80KB gzip. Bajo objetivo 200KB inicial.

### 4.2 Componentes signature

| Componente | Path | Función |
|------------|------|---------|
| `<AnimatedHeadline>` | components/animations/ | hero words anime.js stagger |
| `<AuroraBackground>` | components/decoration/ | radial-gradients verde sutil + hue-rotate loop |
| `<MagneticCTA>` | components/ui/ | wrapper CTA con efecto cursor magnético |
| `<TiltCard>` | components/ui/ | rotateX/Y 6deg sutil + glow hover |
| `<MarqueeRow>` | components/marketing/ | scroll infinito horizontal |
| `<CountUp>` | components/animations/ | número easeOutCubic al entrar viewport |
| `<RevealOnScroll>` | components/animations/ | fade+translateY al entrar |
| `<Accordion>` | components/ui/ | wrapper Radix accordion |
| `<MobileDrawer>` | components/navigation/ | menú fullscreen Radix Dialog |
| `<ThemeToggle>` | components/ui/ | dark/light/system |
| `<ChatStream>` | components/chat/ | SSE consumer + render mensajes |
| `<ChatSidebar>` | components/chat/ | sugerencias + fuentes |
| `<CursorBlob>` | components/decoration/ | blob blur follow cursor (desktop only) |
| `<PageTransition>` | components/animations/ | AnimatePresence route transitions |

### 4.3 Hooks

`useAnime`, `useChatStream`, `useInView`, `useReducedMotion`, `useTheme`, `useMagnetic`.

### 4.4 Estructura `src/` final
Ver sección 4.4 del briefing inline.

---

## 5. Backend integration

### 5.1 Backend NO requiere cambios código

Verificado en `Nambu89/Impuestify@demo/fiscal-ia-melilla`:
- CORS configurable via env `ALLOWED_ORIGINS`
- Endpoints existentes: `POST /api/ask/stream` (SSE), `POST /api/demo/chat`, `GET /api/demo/health`
- Rate limiter ya implementado

### 5.2 Contrato cliente SSE

```ts
// frontend/src/lib/api.ts
const FISCAL_API = import.meta.env.VITE_FISCAL_API_URL;

export type StreamMessage = { role: "user" | "assistant"; content: string };
export type StreamRequest = { messages: StreamMessage[]; conversation_id?: string };

// SSE eventos REALES emitidos por Impuestify backend:
// event: thinking        data: "Buscando información relevante..."
// event: content         data: "<token o chunk de texto>"
// event: conversation_id data: "uuid"
// event: done            data: "" o JSON metadata
// event: error           data: "<mensaje error>"

// Llamada: POST /api/ask/stream con body JSON, Accept: text/event-stream
// Consumer: fetch + ReadableStream parser (no usar EventSource — solo GET)
```

### 5.3 Coolify deploy backend (config, no código)

Crear servicio "fiscal-backend":
- Source: github.com/Nambu89/Impuestify branch `demo/fiscal-ia-melilla`
- Build: usar `backend/Dockerfile`
- Env vars:
  ```
  ALLOWED_ORIGINS=https://iamelilla.com,https://www.iamelilla.com,http://sz39upcf6i90z0scclclnaq6.178.238.227.50.sslip.io
  OPENAI_API_KEY=<key>
  ENV=production
  RATE_LIMIT_CHAT=10/minute
  SECRET_KEY=<32 bytes hex>
  ```
- Puerto interno: 8000
- Volume persistent: `/app/data` (SQLite + RAG indices)
- Health check: `GET /api/demo/health`

### 5.4 Env vars frontend

```bash
# frontend/.env.example
VITE_FISCAL_API_URL=https://fiscal-backend.<coolify-domain>.sslip.io  # provisional
VITE_PLAUSIBLE_DOMAIN=iamelilla.com
VITE_CONTACT_ENDPOINT=https://formspree.io/f/XXXXX  # interim
```

### 5.5 Error handling cliente

| Estado | UI |
|--------|----|
| connecting | spinner sutil 200ms delay (evita flash) |
| streaming | typing dots animados |
| error_network | banner "No podemos conectar ahora. Escríbenos por WhatsApp." |
| error_rate (429) | "Demasiadas consultas. Espera {Retry-After}s." |
| error_500 | "El asistente tiene un problema temporal. contacta@iamelilla.com" |
| backend_down (pre-mount /health fail) | sin chat. Banner amarillo + CTA "Apúntate a la beta" |

### 5.6 Privacy + Legal
- Banner cookies primer load (Radix Dialog opt-in analítica)
- Disclaimer visible bajo input chat: "Tus preguntas se procesan para responder. No guardamos datos identificables. [Política]"
- Modal previo primera consulta: "Información orientativa, no sustituye asesor profesional"

---

## 6. Plan implementación (fases)

| Fase | Descripción | Tiempo | Día |
|------|-------------|--------|-----|
| 0 | Spec doc + user review | 30min | hoy |
| 1 | Bugfix tokens + self-host Inter + favicon | 1h | hoy |
| 2 | Sistema componentes base (animations, ui, hooks) | 4h | hoy/mañana |
| 3 | Home rediseño 10 secciones | 3h | mañana |
| 4 | Empresas + Particulares páginas | 2h | mañana |
| 5 | Demo IA Fiscal chat (SSE + sidebar + fallbacks) | 4h | mañana |
| 6 | Demos listing + Portafolio + Blog setup + Contacto + Legal | 4h | pasado |
| 7 | Deploy frontend + backend Impuestify Coolify | 1h | pasado |
| 8 | QA + Playwright + Lighthouse + ajustes | 1h | pasado |

**Total: ~22h. Con paralelización agentes especialistas: ~1-2 días reales.**

### Delegación agentes

| Fase | Owner |
|------|-------|
| 0-1 | PM Coordinator (main session) |
| 2-5 | `frontend-dev` agent |
| 6 | `frontend-dev` agent |
| 7 | PM Coordinator + (potencial `backend-architect` para verificar contrato endpoint) |
| 8 | `qa-tester` agent (Playwright) + `verifier` |

---

## 7. Verificación QA (Fase 8)

### Checklist obligatorio antes "completado"
- [ ] Build frontend pasa (`npm run build`)
- [ ] Lighthouse home: Performance >90, SEO >95, Accessibility >95, LCP <2.5s, CLS <0.1
- [ ] Mobile 375px (Pixel 5 viewport) — todas las páginas
- [ ] Tablet 768px — todas las páginas
- [ ] Desktop 1440px — todas las páginas
- [ ] `prefers-reduced-motion: reduce` desactiva animaciones (testear via DevTools)
- [ ] Light/dark toggle funciona + persiste localStorage
- [ ] Tab order accesible (keyboard navigation)
- [ ] Focus visible en todos los CTAs (ring-focus emerald)
- [ ] Contraste WCAG AA (texto sobre superficie)
- [ ] Chat SSE: golden path enviar pregunta → recibir respuesta streaming → fuentes
- [ ] Chat fallback: simular backend down → muestra CTA contacto
- [ ] Mobile drawer abre/cierra + cierra al click link
- [ ] WhatsApp flotante visible mobile + desktop
- [ ] Form contacto valida + envía a Formspree
- [ ] Routes 404 manejadas
- [ ] `pre-commit` no skip hooks, no `--no-verify`

### Playwright E2E
- Golden path home → demo IA Fiscal → enviar pregunta → respuesta llega
- Golden path B2B → click pricing → form contacto enviado
- Mobile menu drawer toggle
- Theme toggle persiste recarga

---

## 8. Riesgos + mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Backend Impuestify endpoint `/api/ask/stream` requiere auth | Verificar Fase 7. Si auth requerido: añadir token interno frontend o usar `/api/demo/chat` (no streaming) en lugar |
| Bundle excede 200KB gzip | Code-splitting por ruta + lazy imports Framer Motion components no críticos |
| Inter Variable woff2 peso excesivo | Subset latin + latin-ext, `font-display: swap` |
| CORS bloqueado producción | Doble check env `ALLOWED_ORIGINS` antes deploy |
| anime.js v4 + Framer coexisten mal | Usar Framer SOLO para layout/AnimatePresence, anime.js SOLO para hero entrance y count-up |
| Light mode contraste falla emerald sobre blanco | Usar emerald-600 (#059669) en light, no emerald-500 |

---

## 9. Decisiones tomadas (registro)

| Decisión | Valor | Origen |
|----------|-------|--------|
| Identidad visual | Charcoal + Emerald (mantener) | Brainstorming Q1 |
| Hero treatment | Tipo masiva + entrada anime.js + aurora verde | Q2 |
| Motion level | Premium Linear-style (spring, magnetic, parallax sutil) | Q3 |
| Alcance | TODAS las 9 páginas | Q4 |
| Secciones nuevas home | Marquee tech + Comparativa + FAQ | Q5 |
| Demo flagship | Chat real funcional SSE + sidebar | Q6 |
| Backend chat | Impuestify branch demo/fiscal-ia-melilla (sin modificar código) | Verificación post-Q6 |
| Mobile menu | Hamburger → drawer fullscreen | Q7 |
| WhatsApp flotante | Mantener tal cual | Q7 |
| Modo | Dark + Light toggle | Q7 |

---

## 10. NO incluido en Phase 1 (scope explícitamente fuera)

- Multi-idioma (i18n) — solo castellano Phase 1
- Buscador interno
- Dashboard / login usuario / portal cliente
- Newsletter signup
- Pricing real con pago (Stripe) — solo tabla informativa
- CMS headless blog — usamos MDX local
- Backups automáticos S3 — manual interim
- Analítica self-host Plausible — usar Plausible Cloud o nada Phase 1
- Modelos virtuales / influencer IA / WhatsApp como demo — descartados (NO migran del WordPress actual según `CLAUDE.md`)
- Demos adicionales más allá de IA Fiscal Melilla — siguiente demo se decide post-feedback

---

**FIN SPEC.**
