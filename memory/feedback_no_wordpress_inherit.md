---
name: feedback_no_wordpress_inherit
description: Para IA Melilla v2 no heredar nada del sitio WordPress actual (paleta, fuentes, copy, servicios). Reset visual completo.
metadata:
  type: feedback
---

# Reset total frente al sitio WordPress actual

**Regla**: IA Melilla v2 no hereda visual ni copy ni catalogo de servicios del sitio WordPress productivo (`iamelilla.com` actual).

**Why:** el usuario lo declaro explicitamente 2026-05-20 cuando le propuse adoptar el cyan `#5DD7F2` del CSS de Elementor: *"No, no cojamos nada del wordpress, vamos a hacerlo mejor."* El sitio actual es trabajo de terceros (Webmelilla) sobre Elementor 4.0.8 — el usuario quiere romper esa identidad porque no la considera suya y no representa el nivel del producto v2.

**How to apply:**
- **Paleta**: no recuperar `#5DD7F2` cyan ni los tokens `--e-global-color-*` extraidos del CSS combinado SiteGround Optimizer. Paleta v2 vive solo en `frontend/DESIGN.md` (charcoal + emerald).
- **Fuentes**: no usar Bai Jamjuree ni Mulish. v2 usa Inter Display + JetBrains Mono.
- **Copy**: no reciclar headlines del sitio actual ("Inteligencia Artificial en Melilla al Alcance de Todos", "Sectores donde aplicamos inteligencia artificial Melilla", etc.) — son keyword-stuffed y de baja calidad editorial. Reescribir todo el copy de cero.
- **Catalogo servicios**: los servicios actuales (modelos virtuales ropa, influencer IA, reservas WhatsApp, redes sociales IA, chatbots personalizados) NO existen en v2. Redirect 301 → home.
- **Estructura informativa**: replantear desde cero con foco en showroom de demos + audience routing B2B/B2C. NO heredar la IA del site map actual.

**Lo unico que se preserva del sitio actual:**
- Datos de contacto (`hola@iamelilla.com`, `+34 654 186 173`, IG `@iamelilla`)
- JSON-LD Organization + Place (preserva SEO local Melilla — direccion fisica, owner Joaquin Gorge Lucianez)
- WhatsApp float button (CTA mas convierte, decision data-driven)
- Slugs de paginas legales y `/contacto/`, `/blog/`
- Los 2 posts del blog actual (redirect 301 con prefijo `/blog/`)

**Excepcion**: si en algun momento se necesita revisar el sitio actual para SEO redirects, performance comparisons o brand archeology, el snapshot scrapeado vive en `plans/web-recon-assets/raw/` (gitignored) — pero es lectura forense, no fuente de inspiracion.

Relacionadas: [[project_web_recon_2026-05-20]], [[user_role]].
