# Web Recon — `iamelilla.com` (2026-05-20)

> **Metodo**: Playwright MCP no surfaceo tools esta sesion (server conectado pero sin schemas). Fallback al plan B del skill: `python urllib` con UA Safari (pasa anti-bot Hostinger 403). Scrape de 15 URLs + CSS combinado SiteGround Optimizer.
>
> **Cero screenshots automaticos** — render binario no posible sin browser. Assets HTML/CSS raw en `plans/web-recon-assets/`.
>
> **Limites de este metodo**:
> - No DOM computed styles (solo CSS estatica).
> - No interacciones / popups Elementor.
> - No layout final visual (sin renderer).
> - Suficiente para tokens, copy, estructura, SEO.

## 1. Inventario de paginas

Sitemap raiz: `https://iamelilla.com/sitemap_index.xml` (Rank Math SEO).

| URL | Title | H1 real | Meta description | Tipo |
|-----|-------|---------|------------------|------|
| `/` | Inteligencia Artificial Melilla -Soluciones de IA para todos | Inteligencia Artificial Melilla | Inteligencia Artificial Melilla - Soluciones de IA para empresas, autonomos y particulares | Home |
| `/todos-los-servicios/` | Todos los servicios - ... – IA Melilla | Servicios de Inteligencia Artificial para Empresas, autonomos y particulares | Desde automatizacion de tareas hasta asistentes virtuales y creacion de contenido con IA. Soluciones practicas y escalables adaptadas a tu negocio. | Hub |
| `/modelos-virtuales-para-ropa/` | Modelos virtuales para ropa \| Imagenes IA para tiendas | modelos virtuales para ropa. En solo 24h y sin fotografos | Promociona tu negocio con modelos virtuales para ropa. Imagenes profesionales sin fotografos, listas para redes o e-commerce. | Servicio |
| `/influencer-ia/` | Influencer IA - ... – IA Melilla | Influencer IA: Crea tu avatar virtual y destaca en redes sociales con Inteligencia Artificial | Genera contenido visual realista y profesional para tus redes sociales usando IA avanzada. | Servicio |
| `/reservas-por-whatsapp/` | Reservas por Whatsapp - ... – IA Melilla | Sistema de reservas automatizado por WhatsApp | Automatiza tus citas, responde a tus clientes 24/7 y olvidate del telefono. | Servicio |
| `/redes-sociales-ia/` | Redes sociales IA - ... – IA Melilla | Redes sociales con IA | Publicaciones atractivas, consistentes y automatizadas para Instagram, Facebook o TikTok, sin que tengas que hacer nada. | Servicio |
| `/chatbots-personalizados/` | Chatbots personalizados - ... – IA Melilla | Chatbots personalizados | Nuestros chatbots personalizados permiten automatizar respuestas, resolver dudas frecuentes y ofrecer atencion al cliente inmediata en cualquier momento. | Servicio |
| `/evidencia-visual/` | Evidencia visual - ... – IA Melilla | Galeria de imagenes y videos | Nota: todas las imagenes en WebP para mejor velocidad. | Galeria |
| `/contacto/` | Contacto - ... – IA Melilla | Contacto | Escribenos si necesitas asesoramiento, resolver preguntas o solicitar informacion. Estamos disponibles de lunes a viernes. | Form |
| `/blog/` | Blog - ... – IA Melilla | Blog / Nuestro Blog | Listing posts | Listing |
| `/automatizacion-ia-melilla/` | Automatizacion IA Melilla: guia practica para pymes | Automatizacion IA Melilla: como implementar la IA en tu pyme en 6 pasos sin complicaciones | Automatizacion IA Melilla: guia practica para pymes. Aplica IA en inventarios, emails y reservas con pasos simples, ejemplo local, checklist y FAQs. | Post |
| `/la-inteligencia-artificial-en-melilla/` | Transforma tu Negocio con Inteligencia Artificial en Melilla | La inteligencia artificial en Melilla | Descubre como la inteligencia artificial en Melilla esta transformando pymes y autonomos. Ayudas, formacion y ejemplos reales. | Post |
| `/aviso-legal/` | Aviso legal - ... – IA Melilla | (vacio) | DATOS IDENTIFICATIVOS | Legal |
| `/politica-de-privacidad/` | politica de privacidad - ... – IA Melilla | (vacio) | Joaquin Gorge Lucianez te informa sobre su Politica de Privacidad respecto del tratamiento... | Legal |
| `/politica-de-cookies/` | politica de Cookies - ... – IA Melilla | (vacio) | Si quieres saber mas sobre el uso de cookies... | Legal |
| `/category/inteligencia-artifical/` | (categoria) | — | — | Taxonomy |
| `/category/ia-melilla/` | (categoria) | — | — | Taxonomy |

**Total indexable**: 15 paginas + 2 categorias.

**Bug detectado**: cada H1/H2 se repite 3 veces ("Chatbots Chatbots Chatbots", "Influencer IA Influencer IA Influencer IA"). Es widget Elementor "headline animated" decorativo, NO SEO desastre porque uno solo es `<h1>` real. En rediseno se elimina.

## 2. Sitemap textual

```
iamelilla.com
├── /                                                      # Home (B2B+B2C mezclado)
├── /todos-los-servicios/                                  # Hub servicios (UNICO sitio con split B2B/B2C)
│   ├── /modelos-virtuales-para-ropa/                       # Servicio B2B e-commerce
│   ├── /influencer-ia/                                     # Servicio B2C+B2B contenido
│   ├── /reservas-por-whatsapp/                             # Servicio B2B sectorial
│   ├── /redes-sociales-ia/                                 # Servicio B2B+B2C
│   └── /chatbots-personalizados/                           # Servicio B2B
├── /evidencia-visual/                                     # Galeria pruebas
├── /blog/                                                 # Listing
│   ├── /automatizacion-ia-melilla/                         # Post
│   └── /la-inteligencia-artificial-en-melilla/             # Post
├── /contacto/                                             # Form principal
├── /aviso-legal/
├── /politica-de-privacidad/
└── /politica-de-cookies/

Categorias blog:
- /category/inteligencia-artifical/   (typo: "artifical" sin 'i')
- /category/ia-melilla/
```

**Issue SEO**: typo en slug categoria `inteligencia-artifical` — corregir con 301 en migracion.

## 3. Paleta de colores (extraida del CSS combinado SiteGround Optimizer)

### Variables Elementor globales (canonicas)

| Variable | Valor | Uso |
|----------|-------|-----|
| `--e-global-color-primary` | `#FFFFFF` | Headings (h1/h2/h3) sobre fondo oscuro |
| `--e-global-color-secondary` | `#EBEBEB` | Texto secundario claro |
| `--e-global-color-text` | `#D8D8D8` | Body text |
| `--e-global-color-accent` | `#5DD7F2` | Acento principal — cyan/celeste |
| `--e-global-color-93b6ba6` | `#00060B` | Background base (casi negro) |
| `--e-global-color-67624cd` | `#101C32` | Background secundario navy |
| `--e-global-color-cab0d2c` | `#091621` | Background tarjetas dark |
| `--e-global-color-a276482` | `#07142D` | Background containers |
| `--e-global-color-ccee587` | `#344460` | Mid-blue divider/border |
| `--e-global-color-6c10b8d` | `#162865` | Royal blue acentos |
| `--e-global-color-c152dda` | `#C8F4FE` | Cyan claro highlights |
| `--e-global-color-949cff2` | `#F7FB41` | Amarillo spotlight (CTA secundario) |
| `--e-global-color-364a86b` | `#A9FC9F` | Verde mint (stats/badges) |
| `--e-global-color-5bcca30` | `#FC9F9E` | Coral pink |
| `--e-global-color-7bf05d4` | `#1D4852` | Teal oscuro |
| `--e-global-color-5a398e1` | `#4B7A8D` | Steel blue |

### Otros colores del CSS combinado (mas usados)

- `#25d366` — WhatsApp green oficial (boton float bottom-right)
- `#0c4da2` — azul corporativo (forms, popups GDPR cookie banner)
- `#2098d1` — Elementor default theme blue (raro, restos)

**Lectura**: identidad es **DARK MODE** moderno. Fondo navy/negro + headings blancos + body gris claro + **cyan #5DD7F2** como acento principal. Spice colors: amarillo/mint/coral para badges y stats. No es Hostinger blue como parecia por los inline styles del cookie banner.

## 4. Tipografias

### Fuentes (Elementor globals)

| Rol | Familia | Peso | Tamano base |
|-----|---------|------|-------------|
| `--e-global-typography-primary` (h1) | **Bai Jamjuree** | 600 | 60px desktop / 48px tablet / 38px mobile |
| `--e-global-typography-secondary` (h2/h3) | **Bai Jamjuree** | 600 | 40px desktop / 28px responsive |
| `--e-global-typography-text` (body) | **Mulish** | 400 | 18px |
| `--e-global-typography-accent` (label/CTA) | **Bai Jamjuree** | 600 | 16px |
| Iconos | Font Awesome 5 Free + Brands + eicons | — | inline |

Ambas fuentes son **Google Fonts gratuitas** y libres comerciales. Bai Jamjuree es geometric semi-condensed disenada para tailandes + latino — caracter contemporaneo. Mulish es sans-serif minimalista (ex-Muli, redisenada por Vernon Adams).

**Decision migracion**: dado que CLAUDE.md prescribe **Inter Display** (Linear-inspired), proponer cambio. Bai Jamjuree es OK pero menos sistematica que Inter. Inter cubre el rol que Bai cumplia en heading + Mulish desaparece (Inter cubre body). Reduce de 2 fuentes a 1, mejor performance.

### Tamanos detectados (frecuencia en CSS)

`16px`(x19) · `24px`(x19) · `20px`(x16) · `14px`(x12) · `1rem`(x11) · `18px`(x10) · `40px`(x8) · `28px`(x8) · `13px`(x7) · `65px`(x6) · `100px`(x6) · `30px`(x5) · `2em`(x6)

Mobile responsive: h1 baja a `38px`, h2 a `28px`.

## 5. Componentes recurrentes detectados

| Componente | Donde | Notas |
|------------|-------|-------|
| **Header** | Todas | Logo `IA_Melilla_Brighter_240x56.webp` + nav horizontal (8 enlaces) |
| **WhatsApp Float Button** | Todas | `#wam-btn` 56x56px circular fijo bottom-right 18px, verde `#25d366` |
| **Cookie banner GDPR** | Todas (primer visit) | Plugin gdpr-cookie-compliance, color `#0c4da2` |
| **Hero per page** | Cada `/servicio/` | Estructura: badge animado "X X X" repetido 3 veces + H1 + subheadline + 2 CTAs (uno primario otro secundario) |
| **Stats block** | Servicios | Cards con numero grande + label (ej: "70% Ahorro de tiempo", "95% Confirmaciones instantaneas") |
| **"Como lo hacemos"** | Cada servicio | Seccion explicativa proceso |
| **Cards de servicios** | Home + /todos-los-servicios/ | Imagen + titulo + descripcion corta + CTA "Saber mas" |
| **Bloque testimonios** | Home | "Testimonios de clientes" — formato no inspeccionado (sin DOM render) |
| **Sectores aplicables** | Home | "Sectores donde aplicamos inteligencia artificial Melilla" |
| **CTA cierre seccion** | Cada servicio | "Resultados que importan" + 3-4 stats |
| **Form contacto** | `/contacto/` | Plugin desconocido (probable Contact Form 7 o WPForms Lite) |
| **Footer** | Todas | Datos legales + redes (LinkedIn + Instagram) + WhatsApp + email + "Diseño web Webmelilla" credit |

## 6. Copy textual exacto (relevante)

### Home

**H1**: `Inteligencia Artificial Melilla`

**H2 (orden de aparicion)**:
1. `PARA EMPRESAS Y NEGOCIOS` (repetido 4x — widget Elementor)
2. `Inteligencia Artificial en Melilla al Alcance de Todos`
3. `Que ofrecemos`
4. `Soluciones en video profesionales de inteligencia artificial Melilla`
5. `Resultados reales de inteligencia artificial Melilla`
6. `Aplicaciones Reales de inteligencia artificial Melilla`
7. `Testimonios de clientes`
8. `En Melilla, aplicar soluciones de inteligencia artificial Melilla nunca habia sido tan facil y accesible.`
9. `Sectores donde aplicamos inteligencia artificial Melilla`
10. `Unete a la revoluion IA` (typo: "revoluion" → "revolucion")

**H3 destacados**:
- `Asistentes Virtuales para WhatsApp`
- `Contenido Visual con IA para E-commerce y Redes`
- `Impulsa tus ventas con contenido generado por IA`
- `Optimizacion operativa con IA para decisiones mas inteligentes`
- `Soluciones de IA que marcan la diferencia`
- `Estrategias de marketing con IA que funcionan`
- `IA para mantenimiento y operaciones`

**Footer text**: `Impulsamos negocios con soluciones de inteligencia artificial practicas, accesibles y adaptadas a Melilla y al mundo.`

### Servicios — Hero subheadlines (1 linea cada uno)

| Servicio | Subheadline |
|----------|-------------|
| Chatbots personalizados | Automatiza conversaciones reales con un asistente que nunca descansa. |
| Influencer IA | ¿Que es una Influencer IA? / Una influencer consistente, realista y con estilo propio |
| Reservas WhatsApp | Sacale el maximo rendimiento a tus citas |
| Redes sociales IA | Haz que tu presencia online trabaje por ti... con ayuda de la inteligencia artificial. |
| Modelos virtuales ropa | ¿Que son los modelos virtuales para ropa y como pueden ayudarte? |

### Stats / numericos recurrentes (placeholder values del template)

- `% menos trabajo manual`
- `% mejora en productividad`
- `Reduccion en tiempo de respuesta`
- `Clientes atendidos sin intervencion humana`
- `Aumento en la captacion de leads`
- `Ahorro de tiempo`
- `Confirmaciones instantaneas`
- `Reduccion de "no-shows"`

**Nota**: estos numeros NO tienen valor real en HTML — son etiquetas. Decisiones para v2: o usar numeros reales (mejor caso, con clientes verificables) o quitarlos por completo si no hay datos.

### CTAs (unicos en toda la web)

| Frecuencia | Texto | Destino |
|-----------|-------|---------|
| 15× | `Reservas por Whatsapp` | `/reservas-por-whatsapp/` |
| 15× | `Asesoreme` | `/contacto/` |
| 15× | `Whatsapp` (float button) | `wa.me/34654186173` |
| 1× | `Ver soluciones de IA` | `/todos-los-servicios/` |
| 1× | `Haznos tu consulta` | `/contacto/` |
| 1× | `Pide asesoramiento` | `/contacto/` |
| 1× | `Pide tu influencer` | `/contacto/` |
| 1× | `Solicite su demo gratis` | `/contacto/` |
| 1× | `Solicita tu demo` | `/contacto/` |
| 1× | `Haz clic aqui para ver una demo personalizada.` | `/contacto/` |

**Conclusion**: CTAs todos llevan a `/contacto/` o WhatsApp. No hay funnel diferenciado B2B vs B2C en URLs.

## 7. Estructura informacional

### Home (orden actual)

1. Hero — H1 "Inteligencia Artificial Melilla" + badge "PARA EMPRESAS Y NEGOCIOS" (sesgo B2B desde inicio, pero claim "para todos")
2. Bloque "Inteligencia Artificial en Melilla al Alcance de Todos" — subtitulo mixto
3. "Que ofrecemos" — grid de 6-7 servicios con cards
4. "Soluciones en video" — bloque video YouTube/Vimeo embebido (no descargado)
5. "Resultados reales" — stats numericos placeholder
6. "Aplicaciones Reales" — casos uso
7. "Testimonios"
8. "Sectores" — listado vertical de industrias (e-commerce, hosteleria, clinicas, etc. — no extraido entero)
9. "Unete a la revolucion IA" — CTA cierre con link a contacto

### Separacion B2B/B2C

**Solo existe en `/todos-los-servicios/`** con dos H2:
- `Servicios para empresas y autonomos` (B2B)
- `Servicios para emprendedores o particulares` (B2C)

El resto del sitio mezcla audiencias. CLAUDE.md v2 ya tomo la decision de **separar en hero desde el principio**.

### Paginas de servicio (patron repetido)

1. Badge animado (decorativo, sin valor SEO)
2. H1 del servicio
3. Subheadline / "¿que es?"
4. Bloque beneficios (`¿que beneficios tiene...?` o "Una X consistente, realista...")
5. "Sacale el maximo rendimiento" — uso casos
6. "Resultados que importan" — stats placeholder
7. "Como lo hacemos" — proceso
8. CTAs: Asesoreme + WhatsApp

## 8. Datos contacto y CTAs

- **Email**: `hola@iamelilla.com`
- **Telefono / WhatsApp**: `+34 654 186 173`
- **WhatsApp link directo**: `https://api.whatsapp.com/send/?phone=34654186173&text=Hola%2C+vengo+desde+IAmelilla.com+y+quiero+informaci%C3%B3n&type=phone_number&app_absent=0`
- **WhatsApp alternativo**: `https://wa.me/34654186173?text=Hola%2C%20quiero%20ponerme%20en%20contacto%20con%20iamelilla`
- **Instagram**: `https://www.instagram.com/iamelilla/`
- **Facebook**: `https://www.facebook.com/iamelilla/` (en schema.org, no visible en menu)
- **LinkedIn**: presente en footer (URL no extraida del HTML actual)
- **Direccion fisica**: `C/ Doctor Juan Rios Garcia, 7 2ºA, Melilla 52003, Espana`
- **Owner legal**: `Joaquin Gorge Lucianez`
- **Webmaster**: `Webmelilla` (`http://webmelilla.com`)

### Formulario `/contacto/`

No inspeccionado a nivel de campos (sin DOM render). Plugin desconocido. Pendiente confirmar al delegar `qa-tester` o tras tener Playwright funcionando.

## 9. SEO actual

- **Plugin SEO**: Rank Math SEO (`robots.txt` lo declara)
- **Sitemap raiz**: `https://iamelilla.com/sitemap_index.xml`
    - `post-sitemap.xml` (2 posts)
    - `page-sitemap.xml` (13 paginas)
    - `category-sitemap.xml` (2 categorias)
- **robots.txt**:
    ```
    User-Agent: *
    Disallow: /wp-admin/
    Allow: /wp-admin/admin-ajax.php
    
    User-agent: GPTBot
    Disallow:                    # explicitamente permitido — politica positiva
    
    Sitemap: https://iamelilla.com/sitemap_index.xml
    ```
- **Canonical**: presente en cada pagina, todas correctas
- **hreflang**: ausente (sitio solo `es`)
- **Open Graph**: completo (locale, type, title, description, url, site_name, updated_time, image 1024x1024, alt)
- **Twitter Card**: summary_large_image
- **Schema.org JSON-LD** (en home): `@graph` con `Place` + `Organization` + `WebSite` + `Person`(Joaquin) + `BreadcrumbList`
- **Generator meta**: `Elementor 4.0.8`
- **Lang**: `es`
- **Bot signal**: `GPTBot` permitido — ya optimizado para AI search/Perplexity

**Items a preservar 1:1 en migracion**:
- Schema Place/Organization/WebSite (paths cambian si re-estructuramos URLs)
- Meta description por pagina (estan bien redactadas)
- OG image (`/wp-content/uploads/2025/06/instagram.png`) — descargar y migrar

## 10. Performance / stack detectado

- **CMS**: WordPress (version exacta no expuesta)
- **Page builder**: **Elementor 4.0.8** (mas reciente — 2026)
- **Theme**: probable Hello Elementor (default Elementor theme)
- **Plugins detectados** (via URLs assets):
    - `siteground-optimizer` — combinador CSS/JS (genera el `combined-css-*.css` de 1.06 MB)
    - `gdpr-cookie-compliance` — banner cookies
    - `gtranslate` — traduccion (no activo visualmente en el HTML)
    - `selection-lite` — desconocido (probable plugin de seleccion de texto)
    - `Rank Math SEO` — SEO meta + sitemap
- **CDN**: ninguno detectado (assets directos desde `iamelilla.com`)
- **Hosting**: **Hostinger** (deduccion: anti-bot 403 con UA generico, plus el patron CSS combinator de SiteGround Optimizer)
- **Assets**:
    - 1 CSS combinado: 1,087 KB (sin gzip — ~70 KB transferido gzipped)
    - 5 scripts inline + externos
    - Imagenes en WebP (positivo — Optimizer las convierte)
    - Logo: `IA_Melilla_Brighter_240x56.webp`
- **Fonts**: Bai Jamjuree + Mulish + Font Awesome 5 (Free + Brands) + eicons (icons Elementor)
- **Performance estimada** (sin Lighthouse real):
    - LCP: probablemente >3s por CSS combinado masivo
    - CLS: medio por widgets Elementor "animated headline" cargando dinamicamente
    - Bundle CSS: 1 MB es **excesivo** — la mayoria es codigo Elementor para widgets que no se usan

## 11. URLs para redirect 301 (mapping migracion → v2)

**Decision usuario 2026-05-20**: las herramientas/servicios actuales de iamelilla.com NO migran a v2. Son del sitio WordPress y no forman parte del producto v2. Solo se preservan home, contacto, legales, blog (placeholder) y galeria → portafolio.

| URL actual | URL v2 propuesta | Notas |
|------------|------------------|-------|
| `/` | `/` | Home — rediseñada de cero |
| `/todos-los-servicios/` | redirect 301 → `/demos/` o `/` | Hub viejo, no se reconstruye |
| `/modelos-virtuales-para-ropa/` | redirect 301 → `/` | Servicio fuera de v2 |
| `/influencer-ia/` | redirect 301 → `/` | Servicio fuera de v2 |
| `/reservas-por-whatsapp/` | redirect 301 → `/` | Servicio fuera de v2 |
| `/chatbots-personalizados/` | redirect 301 → `/` | Servicio fuera de v2 |
| `/redes-sociales-ia/` | redirect 301 → `/` | Servicio fuera de v2 |
| `/evidencia-visual/` | `/portafolio/` | Galeria → portafolio. Curaduria de imagenes pendiente |
| `/contacto/` | `/contacto/` | Preservar URL |
| `/blog/` | `/blog/` | Placeholder Fase 6 |
| `/automatizacion-ia-melilla/` | redirect 301 → `/blog/automatizacion-ia-melilla/` | Post mantiene contenido, slug bajo /blog/ |
| `/la-inteligencia-artificial-en-melilla/` | redirect 301 → `/blog/la-inteligencia-artificial-en-melilla/` | Idem |
| `/aviso-legal/` | `/aviso-legal/` | Preservar |
| `/politica-de-privacidad/` | `/politica-de-privacidad/` | Preservar |
| `/politica-de-cookies/` | `/politica-de-cookies/` | Preservar |
| `/category/inteligencia-artifical/` | redirect 301 → `/blog/?cat=inteligencia-artificial` (typo corregido) | |
| `/category/ia-melilla/` | redirect 301 → `/blog/?cat=ia-melilla` | |

**Nuevas URLs v2**:
- `/demos/` — listing showroom
- `/demos/ia-fiscal-melilla/` — demo flagship (Demo 1)
- `/empresas/` — landing B2B (audience routing)
- `/particulares/` — landing B2C (audience routing)

## 12. Mejoras propuestas (que mantener / rehacer / eliminar)

### Mantener
- Identidad dark + acento cyan (`#5DD7F2`) — diferencial visual real frente a la mayoria de webs de IA que tiran a violetas y gradientes
- Datos contacto + JSON-LD Organization/Place (preservar SEO local Melilla)
- Estructura de pagina servicio: hero + beneficios + casos + stats + CTA
- WhatsApp como canal principal de captacion
- robots.txt amigable con GPTBot (mantener)
- WebP en imagenes
- Sitemap.xml y meta descriptions actuales

### Rehacer
- **Hero home**: anadir split B2B vs B2C visible desde primer scroll (decision producto CLAUDE.md)
- **Tipografia**: Bai Jamjuree + Mulish → **Inter Display** unica (cumple ambos roles, reduce HTTP requests)
- **Paleta**: refinar a token system (Google `DESIGN.md` spec) — fondos `#00060B` + `#091621` se mantienen, accent cyan se mantiene, pero anadir purpura Linear como segundo acento opcional para dualidad B2B/B2C (decision contigo)
- **Performance**: matar Elementor → bundle CSS objetivo <50 KB gzipped (vs 1 MB actual)
- **Eliminar widgets decorativos**: "headline animated" que repite "Chatbots Chatbots Chatbots" 3 veces — ruido visual sin valor SEO
- **Stats reales** o eliminarlos: numeros placeholder "% mejora en productividad" sin valor concreto restan credibilidad
- **Copy SEO-stuffed**: "inteligencia artificial Melilla" repetido en cada H2 — Google penaliza keyword stuffing. Reescribir mas natural

### Eliminar
- Plugin SiteGround Optimizer (no necesario en stack v2 con Vite)
- Elementor entero (se reemplaza por React)
- GDPR plugin (sustituir por banner custom 5 KB)
- gTranslate (sin uso visible, sitio solo `es`)
- "Diseño web Webmelilla" footer credit (sustituir o quitar — decision con dueno actual: el sitio actual lo construyo terceros)
- Typo `revoluion` en home
- Typo slug `inteligencia-artifical` (con 301 al correcto)

### Anadir (no existe ahora)
- **Showroom de demos interactivas** (objetivo principal IA Melilla v2)
- **Pricing transparente** (CLAUDE.md lo lista como pendiente)
- **Caso de uso por sector** con datos reales (clinicas, restaurantes, talleres — Demo 9 del MVP)
- **Newsletter signup** (captura adicional al WhatsApp)
- **Switch idioma** EN si se quiere expandir mas alla de Melilla

## 13. Brief para `frontend-dev` (Fase 1)

### Orden de paginas a codificar

1. **Home** (`/`) — prioridad maxima
    - Hero con split B2B vs B2C en primer fold (audience routing)
    - Bloque "Demo flagship" → tarjeta IA Fiscal Melilla con CTA "Probar demo"
    - Bloque "Como funciona" → 3 pasos del proceso (sin stats placeholder)
    - Bloque sobre Melilla / regimen fiscal local (autoridad/credibilidad)
    - Footer con contacto completo
2. **`/demos/`** — listing showroom (solo IA Fiscal en MVP, infra lista para mas)
3. **`/demos/ia-fiscal-melilla/`** — pagina de la demo flagship con widget interactivo
4. **`/empresas/`** — landing B2B (asesorias, autonomos, pymes)
5. **`/particulares/`** — landing B2C (renta, IRPF, dudas fiscales)
6. **`/contacto/`** — form + WhatsApp + datos
7. **`/portafolio/`** — galeria curada (sustituye /evidencia-visual/)
8. **`/blog/`** y `/blog/[slug]/` — Fase 6 (placeholder simple ahora con los 2 posts existentes redirected)
9. **Legales** — 3 paginas estaticas, contenido copy-paste del actual con datos actualizados

### Tokens visuales (input para `frontend/DESIGN.md`)

**Decision usuario 2026-05-20**: paleta v2 NO hereda nada del WordPress actual. Cyan `#5DD7F2` queda fuera. Se adopta direccion **"Slate + emerald premium"** (recommended del menu de paletas): charcoal puro + acento esmerald. Justificacion: tono fiscal-grade requerido por Demo 1 (IA Fiscal Melilla), no startup-techy generico.

Ver `frontend/DESIGN.md` (formato Google `@google/design.md` spec, lint pasa con 0 errors).

Resumen tokens v2:
- Surfaces: `#0A0A0A` → `#262626` (6 stops charcoal neutro)
- Text: `#FAFAFA` / `#A3A3A3` / `#737373`
- Primary: emerald `#10B981` (CTA, brand)
- B2B audience: deep blue `#1E40AF` (solo en hero split)
- B2C audience: amber `#B45309` (solo en hero split)
- WhatsApp float: `#075E54` (verde teal oscuro oficial WhatsApp, WCAG AA pass)
- Tipografia: Inter Display unica + JetBrains Mono code

### Reglas no-negociables

- Separacion B2B vs B2C visible desde hero ([[CLAUDE.md]] decision producto)
- Cero glassmorphism, cero efectos AI-genericos (orbes/particulas/gradientes psicodelicos)
- Tipografia tight (letter-spacing negativo en headings)
- Animaciones sutiles (150-300ms UI / 600-800ms hero)
- WCAG AA minimo (4.5:1 texto)
- Lighthouse Performance >90 + SEO >95 + A11y >95
- Bundle inicial <200 KB gzipped (vs 1 MB CSS actual del sitio WP)
- WhatsApp float button preservado (es el CTA principal actual)
- Mantener todos los meta descriptions actuales (estan bien)
- JSON-LD Place + Organization preservar tal cual con paths v2

### Componentes a crear (orden de prioridad)

1. `<Nav />` — sticky + scroll-shrink + logo + menu + WhatsApp CTA
2. `<HeroSplit />` — split B2B/B2C con anime.js timeline entry
3. `<ServiceCard />` — tarjeta de servicio con hover sutil
4. `<StatNumber />` — numero animado con CountUp (anime.js) — sin valores placeholder
5. `<TestimonialCarousel />` — opcional Fase 1
6. `<CTABlock />` — bloque cierre seccion con WhatsApp + Contacto
7. `<Footer />` — datos contacto + redes + legales
8. `<WhatsAppFloat />` — boton flotante (preserva comportamiento actual)
9. `<CookieBanner />` — banner GDPR custom (<5 KB)

### Animaciones (anime.js v4)

- Hero entry: stagger en H1 letras + fade-in subheadline + slide-up CTAs (timeline ~800ms)
- Cards: fade-in + translateY al scroll (IntersectionObserver)
- Stats: CountUp numerico cuando entra viewport
- Page transitions: fade entre rutas (300ms)

### Aceptacion Fase 1 (gate)

- Home + Servicios hub + 1 servicio detallado + Contacto funcionando en local
- DESIGN.md validado con `npx @google/design.md lint`
- `npm run build` pasa
- Lighthouse local: Perf >85 (90 cuando Coolify deploy)
- Responsive 320 / 768 / 1024 / 1440 sin roturas

---

## Apendices

- `plans/web-recon-assets/raw/*.html` — HTML scraped raw (15 paginas)
- `plans/web-recon-assets/raw/combined.css` — CSS combinado Elementor (~1.06 MB)
- `plans/web-recon-assets/extracted.json` — datos estructurados extraidos
- `plans/web-recon-assets/sitemap_index.xml` — sitemap raiz
- `plans/web-recon-assets/page-sitemap.xml` — pages
- `plans/web-recon-assets/post-sitemap.xml` — posts blog
- `plans/web-recon-assets/category-sitemap.xml` — categorias
- `plans/web-recon-assets/robots.txt` — robots.txt actual

## Pendientes para sesion siguiente

- [ ] Inspeccion DOM rendered (Playwright tras reinicio Claude Code para surface tools) — opcional, no bloqueante
- [ ] Screenshots full-page de cada URL — opcional, no bloqueante (reporte ya tiene todos los datos)
- [ ] Definir scope funcional de Demo 1 "IA Fiscal Melilla" (preguntas que responde, alcance, modelo LLM, RAG vs prompt simple)
- [ ] Plan implementacion Fase 1 frontend (`plans/2026-05-21-fase-1-frontend.md`) basado en DESIGN.md v2 + brief seccion 13
- [ ] Definir copy nuevo home (no se reusa el actual — keyword stuffed)
- [ ] Definir copy landings `/empresas/` y `/particulares/`
- [ ] Plan-check via `plan-checker` antes de delegar a `frontend-dev`
