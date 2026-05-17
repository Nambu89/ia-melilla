---
name: web-recon
description: Inspeccionar la web actual de IA Melilla (WordPress productivo iamelilla.com) via Playwright MCP para extraer estructura, paleta, tipografias, secciones y copy. Generar brief detallado para frontend-dev del rediseno moderno Fase 1. Usar cuando el PM o usuario pida "ver", "inspeccionar", "auditar", "analizar" la web actual antes de codificar la nueva.
---

# Web Recon — Inspeccion web actual IA Melilla

> Skill operada por PM Coordinator (o subagente delegado). Requiere MCP `playwright` (@playwright/mcp@latest) activo en la sesion. Verificar con `/mcp` que `playwright` aparece conectado antes de empezar.

## Objetivo

Capturar estado completo de `https://iamelilla.com` (WordPress + Elementor productivo) para que `frontend-dev` codifique el rediseno **moderno** Fase 1 manteniendo:
- Mensaje comercial y posicionamiento actual
- Estructura informativa que ya funciona SEO
- Identidad de marca (logo, colores, tono)

Y mejorando:
- Diseño visual (Linear design system — ver `frontend/DESIGN.md`)
- Performance (Lighthouse > 90)
- Separacion clara B2B vs B2C desde hero (decision producto CLAUDE.md)
- Componentes interactivos (anime.js v4, shadcn/ui)
- Accesibilidad

## Pre-requisitos

1. MCP `playwright` conectado (verificar `claude mcp list` muestra `playwright: ✓ Connected`).
2. Browsers Playwright instalados — primera ejecucion del MCP los descarga automaticamente, paciencia ~30-60s.
3. Conexion a internet (la web actual esta en iamelilla.com).

## Output esperado

Un archivo `plans/web-recon-iamelilla-<fecha>.md` con secciones (orden estricto):

1. **Inventario de paginas** — URL + titulo + meta description + H1 + jerarquia H2/H3 + ¿esta indexable?
2. **Sitemap textual** — arbol completo con profundidad (Home → Servicios → ServicioX → CTA)
3. **Paleta de colores** — hex de fondo, texto, primario, secundario, acentos, links (extraido de CSS computed)
4. **Tipografias** — font-family de h1/h2/h3/body, pesos usados, tamanos clave (px o rem)
5. **Componentes recurrentes** — header, footer, hero, CTA, tarjetas servicios, formularios, sidebar, testimonios (con screenshot de cada uno)
6. **Copy clave por seccion** — hero headlines, value props, llamadas a accion (texto exacto)
7. **Estructura informacional** — orden de secciones home, separacion (o falta de) B2B vs B2C, ofertas, paquetes
8. **Datos de contacto y CTAs** — email, WhatsApp, Instagram, formularios (campos), redes
9. **SEO actual** — meta tags, OG, schema/JSON-LD, canonical, sitemap.xml, robots.txt
10. **Performance / Stack detectado** — User-Agent reveals WordPress/Elementor version, plugins detectables, CDN si hay, scripts cargados
11. **Lista de URLs para redirect 301** — todas las URLs actuales con su pagina destino en el nuevo sitio (decidido junto al usuario; aqui solo inventario)
12. **Mejoras propuestas** — bullets concisos: que mantener, que rehacer, que eliminar
13. **Brief para frontend-dev** — paginas a codificar en orden de prioridad, con referencias a secciones de este reporte

## Procedimiento paso a paso

### Paso 1 — Navegar y screenshot home

Usar tools del MCP playwright:
- `browser_navigate` a `https://iamelilla.com`
- `browser_snapshot` (DOM tree accesibilidad)
- `browser_take_screenshot` (viewport completo, full page true) → guardar en `plans/web-recon-assets/home.png`
- `browser_evaluate` con `() => ({ title: document.title, meta: { description: document.querySelector('meta[name=description]')?.content, og: Array.from(document.querySelectorAll('meta[property^=og]')).map(m => ({prop: m.getAttribute('property'), content: m.content})) }, lang: document.documentElement.lang })` para meta.

### Paso 2 — Inventario de paginas via sitemap

- Fetch `https://iamelilla.com/sitemap.xml` (si existe) o `robots.txt`
- Si no hay sitemap accesible: extraer links del nav principal + footer
- Para CADA URL encontrada:
    - Navegar
    - Capturar title + h1 + meta description
    - Snapshot estructura H2/H3
    - Screenshot full-page

### Paso 3 — Extraer paleta y tipografias

`browser_evaluate` con:
```javascript
() => {
  const styles = window.getComputedStyle(document.body);
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  return {
    body: {
      bg: styles.backgroundColor,
      color: styles.color,
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
    },
    h1: h1 && {
      fontFamily: window.getComputedStyle(h1).fontFamily,
      fontSize: window.getComputedStyle(h1).fontSize,
      fontWeight: window.getComputedStyle(h1).fontWeight,
      color: window.getComputedStyle(h1).color,
    },
    h2: h2 && {
      fontFamily: window.getComputedStyle(h2).fontFamily,
      fontSize: window.getComputedStyle(h2).fontSize,
      fontWeight: window.getComputedStyle(h2).fontWeight,
    },
    links: Array.from(document.querySelectorAll('a')).slice(0, 5).map(a => ({
      color: window.getComputedStyle(a).color,
      textDecoration: window.getComputedStyle(a).textDecoration,
    })),
  };
}
```

### Paso 4 — Detectar componentes recurrentes

- Identificar header (logo + nav + CTA)
- Identificar footer (datos contacto, links secundarios, copyright)
- Identificar hero por pagina (headline + subheadline + CTA)
- Identificar bloques de servicios/productos
- Identificar formulario(s) de contacto

Por cada componente: screenshot recortado + lista de campos/links/iconos.

### Paso 5 — Capturar copy textual exacto

`browser_evaluate` para extraer:
- Todos los `<h1>`, `<h2>`, `<h3>`
- Todos los CTAs (botones, links que parezcan CTA — texto + href)
- Footer completo
- Hero subheadlines

NO inventar — copiar literal.

### Paso 6 — SEO

- Title de cada pagina
- Meta description
- OG tags
- Schema.org JSON-LD (`script[type="application/ld+json"]`)
- Canonical
- hreflang si hay
- Sitemap.xml URLs

### Paso 7 — Performance / Stack

- WordPress detect: presencia de `wp-content/` en URLs de assets
- Elementor: clases CSS `elementor-*`
- Plugins comunes: detectar por scripts cargados
- Lighthouse manual (opcional, no MCP playwright): anotar URLs lentas

### Paso 8 — Generar brief final

Crear `plans/web-recon-iamelilla-<YYYY-MM-DD>.md` con las 13 secciones del Output esperado. Para la seccion **13 Brief para frontend-dev**:

- Lista de paginas a codificar Fase 1 en orden:
    1. Home (con separacion B2B/B2C desde hero)
    2. Servicios (overview)
    3. Servicios → detalle (cada servicio actual)
    4. Contacto
    5. Sobre nosotros (si existe)
    6. Blog (placeholder, Fase 6)
- Paleta nueva recomendada: combinar identidad actual + Linear design system (negros profundos + purpura)
- Tipografia nueva: Inter Display (ya decidido en CLAUDE.md)
- Componentes a generar (en orden): Hero con animacion anime.js, Cards de servicios, CTA contacto, Footer con datos, Nav sticky con scroll.
- Mejoras que NO son negociables (decisiones producto CLAUDE.md):
    - Separacion B2B vs B2C visible desde hero
    - Cero glassmorphism / cero efectos AI-genericos
    - Tipografia tight, espaciado generoso
    - Animaciones sutiles, no decorativas

## Cuando NO usar este skill

- Si la web actual ya esta auditada y existe `plans/web-recon-iamelilla-*.md` reciente: leer ese fichero en lugar de re-correr Playwright.
- Si el objetivo es solo SEO redirects: skill diferente (a crear si hace falta).
- Si el objetivo es testing E2E de la web NUEVA: usar agente `qa-tester`, no este skill.

## Tras ejecutar

1. Commit el reporte en `plans/web-recon-iamelilla-<fecha>.md` + assets.
2. Avisar al PM Coordinator en `agent-comms.md`.
3. El PM decide si delegar a `frontend-dev` o si necesita confirmacion del usuario sobre la paleta/tipografia.

## Errores comunes

- **MCP playwright no conectado**: reiniciar Claude Code session tras `claude mcp add playwright npx @playwright/mcp@latest`. Verificar `/mcp`.
- **Playwright pide instalar browsers**: la primera invocacion lo hace automatico (descarga ~150MB chromium). Ser paciente.
- **iamelilla.com da 403/captcha por bot detection**: el MCP Playwright NO es headless por defecto en algunas versiones — anadir `--headless=false` si bloquea, o flag `--user-agent` real.
- **PDF/imagenes grandes**: no descargar binarios > 5MB. Skip.
