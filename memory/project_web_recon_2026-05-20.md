---
name: project_web_recon_2026-05-20
description: Recon iamelilla.com 2026-05-20 — paleta dark + cyan, Bai Jamjuree/Mulish → Inter Display, 15 URLs, stack WP+Elementor+SiteGround
metadata:
  type: project
---

# Recon iamelilla.com — 2026-05-20

## Hechos clave extraidos

- **Identidad actual**: dark theme navy/negro (`#00060B` background) con acento cyan `#5DD7F2` (preservar — diferenciador real frente a webs IA tipicas)
- **Fuentes actuales**: Bai Jamjuree (headings, 600) + Mulish (body, 400). v2 colapsa a **Inter Display unica**.
- **Stack actual**: WordPress + Elementor 4.0.8 + SiteGround Optimizer + Rank Math SEO + GDPR Cookie Compliance + gTranslate (inactivo) + Selection Lite. Hostinger hosting.
- **Performance actual**: bundle CSS combinado 1.06 MB (~70 KB gzipped) — excesivo. Objetivo v2: <50 KB gzipped.
- **15 URLs indexables**: 1 home + 1 hub servicios + 5 servicios detalle + 1 galeria + 1 contacto + 1 blog listing + 2 posts + 3 legales.
- **JSON-LD**: Place + Organization + WebSite + Person (Joaquin Gorge Lucianez) en home — preservar 1:1 en migracion.
- **Anti-bot Hostinger**: bloquea curl/PowerShell con UA generico. Pasa con UA Safari macOS. WebFetch (Anthropic backend) tambien pasa.

## Decisiones diseno tomadas (revision usuario 2026-05-20)

**El usuario rechazo la primera propuesta cyan-derivada del WP** ("no cojamos nada del wordpress, vamos a hacerlo mejor"). Se reinicio paleta desde cero.

Direccion final aceptada: **"Slate + emerald premium"** (de menu de 4 opciones presentadas).

**Why:** primer demo del showroom es IA Fiscal Melilla (decision producto misma sesion). Tono fiscal-grade pide paleta seria, premium, NO startup-techy generica. Emerald `#10B981` es uncommon en fintech/fiscal y connota verificacion/crecimiento sin caer en healthcare-green.

**How to apply:** cualquier ajuste futuro a `frontend/DESIGN.md` debe respetar la regla "no inherit del WP actual". El cyan `#5DD7F2`, Bai Jamjuree y Mulish NO vuelven.

- **DESIGN.md v2** en formato Google `@google/design.md` (alpha spec). Lint pasa (0 errors, 29 warnings orphan tokens intencionales, 0 contrast warnings).
- **Paleta v2 final**:
    - Surfaces charcoal neutral: `#0A0A0A → #262626` (6 stops, sin tinte azul)
    - Text: `#FAFAFA` / `#A3A3A3` / `#737373` / `#525252`
    - Primary: emerald `#10B981` (CTA, brand)
    - B2B routing: deep blue `#1E40AF` (solo audience-coded components)
    - B2C routing: amber `#B45309` (solo audience-coded components)
    - Status: emerald success / `#D97706` warning / `#DC2626` error
    - WhatsApp float: `#075E54` (verde oficial WhatsApp darkest, WCAG AA pass 7.5:1)
- **Tipografia v2**: Inter Display unico + JetBrains Mono code. 13 niveles.
- **Componentes**: 28 definidos. Buttons primary/secondary/ghost/outline + audience b2b/b2c + whatsapp-float + cards default/elevated/interactive + hero/stat/badge tokens.
- **Separacion B2B/B2C**: confirmada. v2 split desde hero. Audience colors SOLO en componentes audience-routing — nunca decorativos.

## Decisiones producto tomadas misma sesion

- **Demo 1 flagship: IA Fiscal Melilla** (sobre regimen fiscal local — IPSI, REF). Define tono credibility del showroom.
- **Catalogo 10 demos anterior queda archivado**. No se construyen hasta que IA Fiscal este en produccion y se replantee.
- **Servicios actuales WordPress (modelos virtuales ropa, influencer IA, reservas WhatsApp, redes sociales IA, chatbots) NO migran a v2**. Redirect 301 → home.
- **WhatsApp boton flotante mantiene comportamiento actual** (CTA mas convierte).
- **`/evidencia-visual/` → `/portafolio/`** (galeria curada, no migracion directa).
- **No commit aun** — usuario revisara antes de empezar.

## Excepciones WCAG documentadas

- Ninguna. Tras lint inicial fallar con `#128C7E` (4.14:1 < 4.5:1 AA) se ajusto WhatsApp float a `#075E54` (7.5:1 AA pass). Cero excepciones activas.

## Artefactos del recon

- `plans/web-recon-iamelilla-2026-05-20.md` — reporte 13 secciones (commiteado)
- `plans/web-recon-assets/extracted.json` — datos estructurados (commiteado)
- `plans/web-recon-assets/sitemap_index.xml`, `page-sitemap.xml`, `post-sitemap.xml`, `category-sitemap.xml`, `robots.txt` (commiteado)
- `plans/web-recon-assets/raw/*.html` (15 paginas) + `combined.css` (1.06 MB) — gitignored (snapshot forense en disco)
- `C:/tmp/scrape_iamelilla.py` + `C:/tmp/extract_iamelilla.py` — scripts reutilizables en C:/tmp (no commit)
- `frontend/DESIGN.md` — reescrito formato Google spec (commiteado)

## Pendientes inmediatos

- [ ] Confirmar con usuario mapeo servicios actuales ↔ demos MVP v2 (¿/modelos-virtuales-para-ropa/ es servicio o demo?)
- [ ] Decidir destino `/evidencia-visual/` (→ `/portafolio/` o eliminar)
- [ ] Una vez Playwright MCP funcione (sesion nueva), repetir recon DOM-rendered para validar palette en pixels reales y capturar screenshots
- [ ] Inspeccionar form `/contacto/` campos exactos

## Notas tecnicas para futuros recon

- **Hostinger anti-bot trick**: usar UA `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15` con `Accept-Language: es-ES,es;q=0.9` y `Accept-Encoding: gzip, deflate`. Pasa el WAF.
- **WebFetch limit**: solo procesa body markdown. NO accede a `<head>`, `<style>`, `<script>`, `<link>`. Inutil para tokens.
- **Playwright MCP**: tras `claude mcp add` puede aparecer connected pero sin tools surfaced en la sesion donde se anadio. Reiniciar Claude Code soluciona.
- **CSS combinado SiteGround**: las variables Elementor `--e-global-color-*` y `--e-global-typography-*` viven en el `combined-css-*.css`. Es la fuente canonica de tokens del sitio.

Relacionadas: [[reference_mcp_playwright]], [[project_next_session_2026-05-18]], [[user_role]].
