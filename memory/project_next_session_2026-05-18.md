---
name: project_next_session_2026-05-18
description: Plan concreto sesion 2026-05-18 — recon iamelilla.com + arrancar Fase 1 frontend
metadata:
  type: project
---

# Proxima sesion — 2026-05-18

## Estado al cerrar 2026-05-17

- **Fase 0 CERRADA**: VPS Contabo + Coolify v4 operativo, deploy nginxdemos/hello validado via `*.178.238.227.50.sslip.io`. Receta completa en [[reference_coolify_localhost_setup]].
- **Tooling listo**: MCP `@playwright/mcp@latest` instalado, skill `web-recon` activo. Ver [[reference_mcp_playwright]].
- **Git**: `main` al dia (commit `786c856`). Rama `infra/fase-0-coolify` viva por si toca tocar infra.
- **Sin codigo backend/frontend aun**: dirs `backend/` y `frontend/` solo tienen `CLAUDE.md`.

## Tareas mañana (orden estricto)

### 1. Auditoria web actual `iamelilla.com` (skill `web-recon`)

- Trigger: usuario dice "audita iamelilla.com" o "vamos con la recon".
- PM Coordinator invoca skill `web-recon`.
- Skill usa MCP `playwright` para navegar la web productiva WordPress + Elementor.
- Output: `plans/web-recon-iamelilla-2026-05-18.md` con 13 secciones:
    1. Inventario paginas (URL + titulo + meta + H1/H2/H3)
    2. Sitemap textual
    3. Paleta colores (hex de body, h1, links, CTAs)
    4. Tipografias (font-family, pesos, tamanos)
    5. Componentes recurrentes (header, footer, hero, cards, formularios)
    6. Copy textual exacto por seccion
    7. Estructura informacional (B2B vs B2C actual)
    8. Datos contacto + CTAs
    9. SEO (meta, OG, JSON-LD, sitemap.xml, robots.txt)
    10. Performance / stack detectado
    11. URLs para redirect 301
    12. Mejoras propuestas
    13. Brief para frontend-dev
- Screenshots en `plans/web-recon-assets/`.

### 2. Confirmar brief con usuario

- PM lee el reporte recon
- Lleva al usuario las decisiones criticas:
    - Paleta nueva final (combinar identidad actual + Linear)
    - Tipografia (defaulteamos a Inter Display per CLAUDE.md)
    - Estructura paginas Fase 1 (¿que paginas exactamente?)
    - Separacion B2B/B2C en hero (decision producto ya tomada CLAUDE.md, confirmar)
    - Lista redirects SEO

### 3. Plan implementacion Fase 1 frontend

- Escribir `plans/2026-05-18-fase-1-frontend.md` con:
    - Init Vite + React 18 + TS + Tailwind v4 + shadcn + animejs v4
    - Estructura paginas (Home con secciones B2B+B2C, Servicios, Contacto)
    - Componentes shadcn a anadir
    - Estrategia animaciones anime.js (hero, transitions)
    - DESIGN.md a copiar del repo Nambu89/awesome-design-md
    - Dockerfile + despliegue Coolify
- Plan-check via subagente `plan-checker` antes de codigo.

### 4. Delegar a `frontend-dev`

- PM invoca subagente `frontend-dev` con el plan aprobado.
- Frontend-dev codifica en rama `frontend/fase-1-init` (o similar).
- Tras codigo: `qa-tester` E2E + `verifier` cumple criterios plan.

## Pendientes paralelos (no bloqueantes)

- **memory/reference_coolify_admin.md** (gitignored): rellenar email + password admin Coolify reales (placeholder vacio actualmente).
- **Borrar `image.png` + `image copy.png`** de raiz repo (screenshots de debug del fix Coolify, no util ya).
- **Decidir registrar dominio** para Fase 0b (DonDominio / Cloudflare / etc.) — sin urgencia hasta Fase 1 lista.

## Riesgos / dependencias

- **iamelilla.com bot detection**: si bloquea Playwright MCP, ajustar user-agent o usar headless=false. Plan B: recon manual con DevTools y volcar a mano.
- **DESIGN.md repo externo**: confirmar que `Nambu89/awesome-design-md` tiene la version Linear actualizada antes de copiarla.
- **Skill `web-recon` no testeado contra iamelilla.com aun**: primera ejecucion sera prueba real.

## Comandos rapidos para arrancar

```bash
# 1. Comprobar que MCP playwright sigue activo
claude mcp list | grep playwright

# 2. Confirmar deploy Coolify sigue vivo
ssh ia-melilla "sudo docker ps --format '{{.Names}}\t{{.Status}}' | grep coolify"

# 3. Recordatorio: branch main al dia
git fetch && git log --oneline origin/main..HEAD
```

## Notas

- Tono: caveman mode activo, mantenerlo si el usuario no cambia.
- No commitear nada con atribucion "Claude" — preferencia explicita del usuario.
- Punto unico de entrada: usuario solo habla con PM, PM delega.

Relacionadas: [[reference_coolify_localhost_setup]], [[reference_mcp_playwright]], [[feedback_install_as_root]], [[feedback_research_before_fix]].
