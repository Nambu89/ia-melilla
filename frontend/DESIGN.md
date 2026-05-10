# DESIGN.md — IA Melilla v2 (Linear-inspired)

> **Pendiente**: pegar el contenido completo del DESIGN.md de Linear desde el repo `Nambu89/awesome-design-md`.
>
> Este archivo es el sistema de diseno canonico del frontend. Cualquier componente, pagina o pantalla nueva debe respetar la paleta, tipografia, espaciado y patrones aqui definidos.

## Filosofia visual

- **Ultra-minimal** — espacio en blanco, sin decoracion innecesaria
- **Precision** — alineaciones exactas, grid estricto
- **Tipografia tight** — `letter-spacing` negativo en headlines, line-heights bajos
- **Transiciones sutiles** — milisegundos cuentan, sin animaciones invasivas
- **Cero glassmorphism** — nada de blur+transparencia tipica AI 2024
- **Cero efectos AI-genericos** — orbes flotantes, gradientes psicodelicos, particulas, etc.

## Paleta base (preliminar — sustituir con la oficial de Linear cuando se pegue)

- **Backgrounds**: `#0A0A0F` (casi negro) → `#13131A` (negro card)
- **Foregrounds**: `#FAFAFA` (blanco texto) → `#A1A1AA` (gris secundario)
- **Accent (purpura Linear)**: `#5E6AD2` (primary) → `#8B92E8` (hover)
- **Bordes**: `rgba(255,255,255,0.06)` (sutiles)
- **Status**: success `#10B981`, warning `#F59E0B`, danger `#EF4444`

## Tipografia

- **Font primary**: Inter Display (Variable, woff2)
- **Headings**: tracking ajustado (`letter-spacing: -0.02em` en h1, `-0.01em` en h2)
- **Body**: Inter regular, `line-height: 1.5`
- **Sizes** (mobile-first):
    - h1: 2.5rem → 4rem desktop
    - h2: 2rem → 3rem
    - h3: 1.5rem → 2rem
    - body: 1rem (16px)
    - small: 0.875rem (14px)

## Espaciado (Tailwind tokens)

Escala base 4px. Usa `space-y-*`, `gap-*`, `p-*` de Tailwind. Densidad media:
- Secciones: `py-24 md:py-32`
- Cards: `p-6 md:p-8`
- Botones: `px-6 py-3`

## Componentes base (shadcn)

Instalar segun necesidad:
- `button`, `card`, `input`, `textarea`, `dialog`, `dropdown-menu`, `toast`, `badge`, `separator`, `tabs`, `accordion`

Variantes custom: extender con `cva` en `components/ui/`.

## Animaciones

| Tipo | Tool | Cuando |
|------|------|--------|
| Hero, page transitions, SVG morph | **anime.js v4** | Animaciones complejas con timeline |
| Componentes React Bits (CountUp, GradientText, etc.) | **Framer Motion** | Forzado por dependencias |
| Hover/focus/transitions UI | **Tailwind** (`transition-*`) | Cambios de estado simples |

Reglas:
- Duraciones: 150-300ms para UI, 600-800ms para hero/destacados
- Easing por defecto: `cubic-bezier(0.16, 1, 0.3, 1)` (suave salida)
- Cleanup obligatorio en `useEffect` (anime.js + Framer)
- Respetar `prefers-reduced-motion`

## Estados (siempre disenar los 4)

Para cualquier componente interactivo:
1. **Default** — estado en reposo
2. **Hover** — feedback al pasar
3. **Active/Focus** — pulsado o navegacion teclado
4. **Disabled** — accion no disponible (opacidad 50%, `pointer-events: none`)

## Accesibilidad (no-negociable)

- Contraste minimo AA (4.5:1 texto, 3:1 UI components)
- `aria-label` en iconos sin texto
- `:focus-visible` con outline purpura
- Navegacion completa por teclado
- `prefers-reduced-motion` respetado

---

> **TODO**: pegar contenido oficial del Linear DESIGN.md desde `https://github.com/Nambu89/awesome-design-md` cuando arranque Fase 1.
