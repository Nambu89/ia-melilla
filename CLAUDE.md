# CLAUDE.md — IA Melilla v2

> **CRITICAL:** Antes de empezar cualquier tarea compleja, comprueba si existen `task.md` o `implementation_plan.md`. Son la fuente de verdad para los objetivos actuales.
>
> **Punto de entrada UNICO:** El usuario habla SOLO con el PM Coordinator (`/pm`). El PM delega al resto de agentes. NUNCA llames a backend/frontend/python directamente sin pasar por el PM.

## Project Overview

IA Melilla v2 es la nueva version de [iamelilla.com](https://iamelilla.com): negocio de servicios de Inteligencia Artificial con base en Melilla, enfocado en autonomos, pymes y particulares. Migracion desde WordPress + Elementor a stack moderno **Python + React** desplegado en VPS Contabo gestionado con **Coolify**.

**Dos objetivos paralelos:**
1. Sustituir la web actual con rediseno moderno, rapido, mejor SEO. Posicionamiento: "IA accesible para Melilla y el mundo".
2. Anadir **showroom de demos reales funcionando** para que clientes prueben las soluciones antes de contratar.

**Decision de producto importante:** separar claramente flujos B2B (empresas/autonomos) y B2C (particulares) desde el hero. Venden cosas distintas.

## Datos de negocio

- Email: `hola@iamelilla.com`
- WhatsApp: `+34 654 186 173`
- Instagram: `@iamelilla`
- Ubicacion: Melilla (Espana)
- Dominio: `iamelilla.com` (apuntara al VPS nuevo cuando este Fase 1 lista)

## Stack tecnologico

### Backend
- **FastAPI** (async, OpenAPI auto)
- **Pydantic v2** validacion
- **SQLModel** ORM (SQLAlchemy debajo)
- **SQLite** + `aiosqlite` (DB unica para leads, citas, mensajes — sin auth de usuarios)
- **Tareas async**: FastAPI `BackgroundTasks` (sin Redis ni ARQ — showroom no lo necesita)
- **LLM**: OpenAI SDK (`openai`) — modelos `gpt-4o` / `gpt-4o-mini` segun criticidad
- **Abstraccion LLM**: `Protocol` `LLMClient` (D de SOLID) para poder cambiar a Anthropic sin reescribir
- **Dependencias**: `uv`
- **Linter/formatter**: `ruff`
- **Tests**: `pytest` + `httpx`

### Frontend
- **React 18 + TypeScript**
- **Vite** build
- **Tailwind CSS v4**
- **shadcn/ui** (componentes base accesibles)
- **React Bits** (`npx shadcn@latest add https://reactbits.dev/r/<COMP>-TS-TW`)
- **anime.js v4** (`npm i animejs`) — animaciones complejas, hero, page transitions, SVG
- **Framer Motion** (forzado por React Bits — coexiste)
- **React Router v6**, **TanStack Query**, **Lucide React**

### Sistema de diseno
- `frontend/DESIGN.md` — Linear design system del repo `Nambu89/awesome-design-md`
- Paleta: negros profundos + purpura Linear
- Tipografia: Inter Display
- Filosofia visual: ultra-minimal, precision, tipografia tight, transiciones sutiles. **Cero glassmorphism ni efectos AI-genericos.**
- Herramienta diseno: Claude Design (Anthropic Labs) → exportar → Claude Code

### Infraestructura
- **VPS Contabo**: vmi3250010, IP `178.238.227.50`, 6 vCPU / 18 GB / 150 GB NVMe
- **Coolify** (self-hosted PaaS) gestiona contenedores Docker, SSL Let's Encrypt via Traefik, DBs one-click
- **Sin auto-backup** — implementar backups propios a S3-compatible

### Topologia despliegue
```
iamelilla.com ──┬── /          → Frontend React (contenedor 1)
                ├── /api       → Backend FastAPI monolito (contenedor 2)
                │               └─ SQLite volume (sin contenedor extra)
                ├── /demos     → Paginas de demos dentro del frontend
                └── demos.iamelilla.com → microservicios pesados (futuro)

panel.iamelilla.com → Coolify UI (puerto 8000 detras de Traefik)
```

## Catalogo demos (decision 2026-05-20)

**Demo 1 (flagship)**: **IA Fiscal Melilla** — asistente IA sobre regimen fiscal de Melilla (IPSI, REF, especificidades autonomos/pymes locales). Define el tono de credibilidad de todo el showroom.

**Demos siguientes**: por decidir. El catalogo de 10 demos anterior (asistente atencion, captador leads, reservas Google Calendar, generador contenido, etc.) queda **archivado**. No se construyen hasta que IA Fiscal Melilla este en produccion y se replantee la lista en base a feedback real.

**Los servicios actuales de iamelilla.com (modelos virtuales ropa, influencer IA, reservas WhatsApp, redes sociales IA, chatbots personalizados) NO migran a v2** — son del sitio WordPress actual y no forman parte del producto v2.

WhatsApp como canal de contacto se mantiene (boton flotante). NO hay demo de WhatsApp en MVP.

## Directory Layout

```
ia-melilla/
├── backend/         # FastAPI Python 3.12+ (ver backend/CLAUDE.md)
├── frontend/        # React 18 + Vite + TS + Tailwind + shadcn (ver frontend/CLAUDE.md)
├── services/        # Microservicios independientes (reservas-api, etc.)
├── plans/           # ROADMAP.md, DECISIONS.md, planes implementacion
├── memory/          # MEMORY.md (indice) + memorias persistentes por tema
├── .claude/
│   ├── agents/      # 8 agentes especialistas
│   ├── commands/    # Slash commands (entry points)
│   └── skills/      # Conocimiento especializado
├── agent-comms.md   # Canal comunicacion inter-agente
├── claude-progress.txt  # Log sesiones
├── AGENTS.md        # Instrucciones para agentes de codigo
├── MULTI_AGENT_WORKFLOW.md  # Guia de trabajo multi-agente
├── docker-compose.yml      # Desarrollo local
└── docker-compose.prod.yml # Referencia para Coolify
```

## Deep-Dive References

- **Backend**: `backend/CLAUDE.md`
- **Frontend**: `frontend/CLAUDE.md` + `frontend/DESIGN.md`
- **Roadmap**: `plans/ROADMAP.md`
- **Decisiones**: `plans/DECISIONS.md`
- **Memoria**: `memory/MEMORY.md`
- **Comunicacion agentes**: `agent-comms.md`

## Naming Conventions

| Contexto | Estilo | Ejemplo |
|----------|--------|---------|
| Python | `snake_case.py` | `lead_service.py` |
| TS components | `PascalCase.tsx` | `DemoCard.tsx` |
| TS hooks/utils | `camelCase.ts` | `useDemoChat.ts` |
| Python vars/funcs | `snake_case` | `create_lead` |
| TS vars/funcs | `camelCase` | `submitLead` |
| Constants | `UPPER_SNAKE` | `MAX_TOKENS` |
| Classes | `PascalCase` | `LeadRepository` |

## Git Workflow

- Branch convention: `claude/<descriptor>` para trabajo asistido por IA
- Commit format: `<type>: <description>` (feat/fix/docs/style/refactor/test/chore)
- Main branch: `main`
- Antes de commit: `npm run build` (frontend) + `pytest tests/ -v` (backend)
- NO `--no-verify`, NO bypass de hooks, NO force push a main

## Reglas de colaboracion (del briefing)

1. **No codificar hasta indicacion explicita.** Primero investigar, disenar, decidir. Codigo despues.
2. **Preguntar siempre** que haya duda. Nunca asumir.
3. **Investigar en profundidad** herramientas actuales (AI Foundry, Azure AI Foundry, etc.) antes de recomendar integracion.
4. Respuestas en **castellano**, tono informal pero tecnico, explicaciones detalladas.
5. **Prioridad a soluciones simples** frente a sobre-ingenieria.
6. **Tabulacion** en todo el codigo Python (no espacios).
7. **Sensible al contexto**: si propones algo que choca con stack o decisiones de este doc, avisa antes de ejecutar.

## SOLID en backend Python (guia)

- **S** — Single Responsibility: endpoints en `api/`, negocio en `services/`, datos en `repositories/`, modelos en `models/`. NO mezclar capas.
- **O** — Open/Closed: cada demo es un `Agent` que implementa un `Protocol` comun. Anadir demo = nueva clase. Nunca tocar otras.
- **L** — Liskov Substitution: cualquier impl de un Protocol debe ser intercambiable. Aplica a agentes y proveedores LLM.
- **I** — Interface Segregation: `typing.Protocol` pequenos y especificos. Mejor varios chicos (`ChatClient`, `StreamingClient`, `ToolUser`) que un `LLMClient` gigante.
- **D** — Dependency Inversion: alto nivel depende de Protocols, no de impls. `Depends()` de FastAPI inyecta repos, clientes LLM, etc. Trivializa testear con mocks.

**Equilibrio:** SOLID NO es excusa para sobre-arquitecturar. Endpoint de 10 lineas que solo lee DB no necesita protocolos. Aplicar cuando: hay 2+ implementaciones posibles, algo va a testearse aislado, o la logica crece. Para CRUD simple: codigo directo. Si propones abstraccion: justifica por que.

## Quality Gates (OBLIGATORIO)

### Pre-ejecucion: Plan Checker
**ANTES** de presentar cualquier plan al usuario:
1. Escribir plan en `plans/<fecha>-<feature>.md` o `implementation_plan.md`
2. Invocar `/check-plan` (o spawn subagente `plan-checker`)
3. Si `ISSUES_FOUND`: corregir y re-verificar
4. Solo presentar al usuario planes con `PASS`

### Post-ejecucion: Verifier
**DESPUES** de implementar TODAS las tareas:
1. Confirmar todas las tareas implementadas
2. Invocar `/verify` (o spawn subagente `verifier`)
3. Si `ISSUES_FOUND`: corregir y re-verificar
4. Solo reportar "completado" cuando verifier pase con `VERIFIED`

### Flujo completo
```
Plan → /check-plan (PASS?) → Presentar usuario → Aprobacion → Implementar → /verify (VERIFIED?) → Completado
```

## Post-Bugfix Protocol

Despues de cualquier bugfix, documentar en 3 sitios:
1. `backend/CLAUDE.md` o `frontend/CLAUDE.md` (segun corresponda) — regla/patron para prevenir recurrencia
2. `memory/bugfixes-YYYY-MM.md` — detalle tecnico
3. `agent-comms.md` — registrar como DONE

## Security Non-Negotiables

1. **Siempre** queries parametrizadas: `WHERE email = ?`, nunca f-strings
2. **Nunca** logguear passwords, tokens, PII
3. **Siempre** validar uploads (magic numbers + size limits)
4. **Siempre** rate-limit endpoints caros (LLM calls)
5. Variables sensibles SOLO en `.env`, nunca commiteadas
6. `.env.example` siempre actualizado con nuevas vars
7. CORS estricto en produccion (solo `iamelilla.com`)

## Pendientes abiertos (resolver conversando con PM)

1. Confirmar version exacta Ubuntu del VPS (`cat /etc/os-release`)
2. Decidir blog: MDX en repo / CMS headless (Sanity, Directus) / Ghost en contenedor
3. Definir estrategia migracion SEO (redirects 301 desde WordPress)
4. Definir precios y paquetes comerciales seccion Servicios

---

**Ultima actualizacion:** 2026-05-21 (recon iamelilla.com + catalogo demos restart con IA Fiscal Melilla)
**Autor inicial:** Fernando Prada (AI Tech Lead) + tio (co-founder)
