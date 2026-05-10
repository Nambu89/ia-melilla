# frontend/CLAUDE.md — Frontend IA Melilla

> Guia para agentes que tocan frontend. Complementa el `CLAUDE.md` de la raiz y `frontend/DESIGN.md` (Linear design system).

## Stack

- **React 18** + **TypeScript**
- **Vite** build
- **Tailwind CSS v4**
- **shadcn/ui** componentes base accesibles
- **React Bits** componentes animados (`npx shadcn@latest add https://reactbits.dev/r/<COMP>-TS-TW`)
- **anime.js v4** (`npm i animejs`) animaciones complejas
- **Framer Motion** (forzado por React Bits, coexiste con anime.js)
- **React Router v6**
- **TanStack Query** estado servidor
- **Lucide React** iconos

## Sistema de diseno

Ver `frontend/DESIGN.md` (Linear design system del repo `Nambu89/awesome-design-md`).

- Paleta: negros profundos + purpura Linear
- Tipografia: Inter Display
- Filosofia: ultra-minimal, precision, tipografia tight, transiciones sutiles
- **Cero glassmorphism ni efectos AI-genericos**

## Estructura `frontend/src/`

```
src/
├── main.tsx
├── App.tsx              # Router principal
├── pages/
│   ├── Home.tsx         # Hero B2B + B2C separados
│   ├── ServiciosEmpresas.tsx
│   ├── ServiciosParticulares.tsx
│   ├── Demos.tsx        # Listado showroom
│   ├── DemoDetalle.tsx  # ruta /demos/:slug
│   ├── Contacto.tsx
│   ├── Blog.tsx
│   └── BlogPost.tsx
├── components/
│   ├── ui/              # shadcn (button, card, input, etc.)
│   ├── reactbits/       # Componentes copiados de React Bits
│   ├── animations/      # Helpers anime.js (useAnime hook)
│   └── sections/        # Hero, Servicios, Testimonios, Footer, etc.
├── demos/               # Una carpeta por demo
│   ├── asistente-atencion/
│   ├── captador-leads/
│   └── ...
├── hooks/
│   ├── useAnime.ts      # wrapper anime.js + cleanup
│   └── useDemoChat.ts   # SSE/streaming de demos
├── lib/
│   ├── api.ts           # fetch wrapper + TanStack Query setup
│   └── analytics.ts     # Plausible
└── styles/
    └── globals.css      # Tailwind base + custom CSS vars
```

## Patrones

### anime.js + React (sin memory leaks)
```tsx
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export function HeroTitle() {
	const ref = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		const instance = animate(ref.current, {
			translateY: [40, 0],
			opacity: [0, 1],
			duration: 800,
			easing: "easeOutCubic",
		});
		return () => instance.pause();  // cleanup obligatorio
	}, []);

	return <h1 ref={ref} className="text-6xl font-bold">IA accesible</h1>;
}
```

### Componente shadcn pattern
- PascalCase
- Functional components con hooks
- Props con interfaces TypeScript estrictas
- Variantes con `cva` (class-variance-authority)

### Tailwind v4
- Tokens en `globals.css` con `@theme`
- Variables CSS custom para paleta Linear (negros + purpura)
- `cn()` helper para combinar clases (de shadcn)

## Convenciones

- `PascalCase.tsx` para componentes, `camelCase.ts` para hooks/utils
- Type hints estrictos (no `any`)
- `useEffect` siempre con cleanup si crea listeners/animaciones
- `useMemo`/`useCallback` solo cuando hay re-renders demostrables
- NO `console.log` en codigo merged (ESLint warning)
- Imports relativos cortos (`../components/ui/button`) o alias `@/components/ui/button` si configurado en `vite.config.ts`

## Reglas Auto-Fix vs STOP

### Auto-fix
- Bugs CSS, imports faltantes, types incorrectos, build errors
- Critico faltante (error boundaries, loading states, empty states, responsive roto)
- Bloqueos (deps no instaladas)

### STOP y pregunta al usuario (via PM)
- Nueva ruta/pagina o nueva dep npm grande (>30KB)
- Cambios de paleta, tipografia, layout system
- Nuevos flujos UX
- Issues en componentes que NO tocaste

## Auto-Verificacion al terminar

```bash
cd frontend
npm run build  # debe pasar
ls -la {archivos_modificados}
git diff --stat
```

NUNCA reportar "hecho" sin estos 3.

## Performance objetivo

- Lighthouse Performance >90
- Lighthouse SEO >95
- Lighthouse Accessibility >95
- LCP <2.5s
- CLS <0.1
- Bundle inicial <200KB gzipped

Si una dep grande baja Performance: discutir con PM antes de incluir.

## Testing

```bash
cd frontend
npm run build       # build limpio = primer test
npm run lint
# (Vitest + Playwright se anaden en Fase 1+ segun necesidad)
```
