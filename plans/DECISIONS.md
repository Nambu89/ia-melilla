# IA Melilla v2 — Decisions Log (ADR)

> Architecture Decision Records. Cada decision importante se documenta aqui para referencia futura.
>
> Estados: Propuesta | Aceptada | Rechazada | Superada

---

## ADR-001: Stack tecnologico base

- **Fecha**: 2026-05-10
- **Estado**: Aceptada
- **Contexto**: Migracion desde WordPress + Elementor a stack moderno. Necesitamos rapidez de desarrollo, buen SEO, soporte para showroom de demos LLM, despliegue en VPS propio.
- **Opciones consideradas**:
    1. **Next.js full-stack (frontend + API routes)**: una sola app, SSR potente. Pero acopla logica de demos al framework de UI.
    2. **Astro + backend Python separado**: Astro genera estatico, mejor SEO. Pero curva de aprendizaje y menos componentes interactivos para demos.
    3. **React + Vite + FastAPI separado** (elegido): backend Python idiomatico para LLM/agents, frontend React rapido, monorepo claro.
- **Decision**:
    - Backend: **FastAPI + SQLModel + SQLite + uv + ruff + pytest**
    - Frontend: **React 18 + Vite + TypeScript + Tailwind v4 + shadcn/ui + React Bits + anime.js v4**
    - LLM: **OpenAI SDK** con Protocol abstraction para cambiar a Anthropic mas adelante
    - Infra: **VPS Contabo + Coolify**
- **Consecuencias**:
    - Monorepo con `backend/` y `frontend/`
    - Tareas async simples sin Redis ni ARQ (BackgroundTasks de FastAPI)
    - Microservicios solo cuando justificado (demo reservas Fase 5)

## ADR-002: SQLite como DB principal

- **Fecha**: 2026-05-10
- **Estado**: Aceptada
- **Contexto**: Web showroom sin auth de usuarios. Solo guardamos leads, citas y mensajes. Postgres seria sobre-ingenieria para este volumen (estimado <1000 leads/mes).
- **Opciones consideradas**:
    1. **PostgreSQL 16 en contenedor Coolify**: robusto, escalable, pero requiere otro contenedor + backups + tunning.
    2. **SQLite + aiosqlite** (elegida): un solo archivo, backup trivial (copiar `.db`), zero-admin, suficiente hasta ~100k registros.
    3. **Turso (libSQL edge)**: como en TaxIA. Pero introduce dependencia externa y latencia de red para datos pequenos.
- **Decision**: SQLite local en volumen Coolify (`/data/app.db`). Backup: snapshot periodico del archivo a S3-compatible.
- **Consecuencias**:
    - Sin Redis ni ARQ — tareas async via FastAPI `BackgroundTasks`
    - Si en algun momento necesitamos colas/cache: anadir Redis como contenedor extra
    - Migracion futura a Postgres trivial gracias a SQLModel

## ADR-003: OpenAI como LLM (de momento)

- **Fecha**: 2026-05-10
- **Estado**: Aceptada
- **Contexto**: Usuario tiene clave API OpenAI ya activa. Para showroom y demos no es critico el modelo concreto. Anthropic Claude es preferido para criticidad alta (TaxIA), pero IA Melilla no la tiene en MVP.
- **Decision**: usar OpenAI SDK (`openai`) con `gpt-4o` y `gpt-4o-mini` segun criticidad. Implementar `LLMClient` como `typing.Protocol` para que cambiar a Anthropic en el futuro sea cambiar la implementacion sin tocar agentes.
- **Consecuencias**:
    - Skill `openai-sdk` (no `anthropic-sdk`)
    - `protocols/llm_client.py` define interface
    - `services/openai_client.py` implementa
    - Migracion futura: anadir `services/anthropic_client.py` y cambiar binding en `Depends()`

## ADR-004: anime.js v4 para animaciones

- **Fecha**: 2026-05-10
- **Estado**: Aceptada
- **Contexto**: El usuario quiere usar [anime.js](https://animejs.com/) para animaciones complejas (hero, page transitions, SVG morphing, demos). React Bits depende de Framer Motion (`motion` package).
- **Opciones consideradas**:
    1. **Solo Framer Motion**: integracion React perfecta. Pero menos potente para timelines complejos y SVG.
    2. **Solo anime.js**: timelines potentes, ligero (~17KB v4). Pero rompe React Bits.
    3. **Coexistencia** (elegida): anime.js para hero/timelines/SVG, Framer para componentes React Bits.
- **Decision**: instalar ambos. anime.js para animaciones custom, Framer Motion solo donde React Bits lo exige.
- **Consecuencias**:
    - Skill `animejs-patterns`: integrar anime.js v4 con `useEffect` + `useRef` sin memory leaks (cleanup obligatorio)
    - Documentar patron `useAnime(targets, params)` hook custom

## ADR-005: Coolify como gestor de contenedores

- **Fecha**: 2026-05-10
- **Estado**: Aceptada
- **Contexto**: VPS Contabo propio (vmi3250010, 6 vCPU/18GB/150GB). Necesitamos PaaS para no gestionar Traefik, SSL, deploys manualmente.
- **Opciones consideradas**:
    1. **Docker Compose + Traefik manual**: control total, sin abstracciones. Pero curva alta para gestionar SSL, restarts, backups.
    2. **Coolify** (elegido): self-hosted PaaS open source. Panel web, deploys desde GitHub, SSL Let's Encrypt automatico, DBs one-click, soporta Docker Compose nativo.
    3. **Dokku**: similar a Coolify pero menos amigable.
    4. **CapRover**: similar, menos comunidad.
- **Decision**: Coolify v4 self-hosted en VPS Contabo.
- **Consecuencias**:
    - Requiere Ubuntu LTS (20.04 / 22.04 / 24.04) para instalador automatico
    - Si VPS no es LTS, instalacion manual (anadido a Fase 0 ROADMAP)
    - `docker-compose.prod.yml` queda como referencia para Coolify

## ADR-006: Sistema multi-agente con PM como punto unico

- **Fecha**: 2026-05-10
- **Estado**: Aceptada
- **Contexto**: El usuario ya usa este patron en TaxIA. Quiere hablar SOLO con un agente coordinador que delega al resto. Reduce carga cognitiva y centraliza decisiones.
- **Decision**: replicar sistema TaxIA adaptado:
    - 1 PM Coordinator (`/pm`) — punto unico de entrada
    - 7 especialistas: backend-architect, frontend-dev, python-pro, qa-tester, plan-checker, verifier, doc-auditor
    - 1 archivado: competitive-intel (en `_archive/`, sin activar)
    - Quality gates obligatorios: `plan-checker` antes, `verifier` despues
- **Consecuencias**:
    - Usuario solo invoca `/pm`, `/start`, `/check-plan`, `/verify`, `/qa`, `/docs`, `/test`, `/commit`, `/review`, `/deploy`
    - Comandos `/backend`, `/frontend`, `/python` existen pero solo el PM los activa via Task tool
    - `agent-comms.md` es el canal de delegacion
    - Sin claude-flow ni hooks complejos `.cjs` (sobre-ingenieria para este caso)

---

**Ultima actualizacion:** 2026-05-10
