---
name: project_session0_bootstrap
description: Sesion 0 — bootstrap del repo y sistema multi-agente
type: project
---

# Sesion 0 — Bootstrap (2026-05-10)

Repo creado en `https://github.com/Nambu89/ia-melilla.git`. Sistema multi-agente copiado y adaptado desde TaxIA.

**Why**: empezar con misma metodologia que TaxIA (PM coordinator + agentes especialistas + quality gates). Reduce carga cognitiva del usuario y mantiene calidad sistematica.

**How to apply**:
- Cualquier agente que arranque debe leer `CLAUDE.md`, `plans/ROADMAP.md`, `agent-comms.md` antes de actuar.
- Usuario habla SOLO con `/pm`. Si te invocan directamente como `backend-architect` o `frontend-dev`, asume que el PM te delego.
- Quality gates obligatorios para cualquier feature con >3 tareas.

## Adaptaciones vs TaxIA

| TaxIA | IA Melilla |
|-------|-----------|
| Postgres + Redis + ARQ | SQLite + aiosqlite + BackgroundTasks |
| OpenAI GPT-5-mini | OpenAI gpt-4o / gpt-4o-mini (de momento) |
| CSS modules custom | Tailwind v4 + shadcn/ui + React Bits |
| Framer Motion | anime.js v4 + Framer (donde React Bits lo exige) |
| Railway | Coolify en VPS Contabo |
| competitive-intel activo | Archivado en `.claude/agents/_archive/` |
| Hooks `.cjs` complejos (claude-flow) | Solo `settings.json` minimo |
