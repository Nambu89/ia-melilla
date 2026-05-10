# IA Melilla v2

> Web showroom + servicios de IA accesibles para autonomos, pymes y particulares.
>
> Migracion desde WordPress de [iamelilla.com](https://iamelilla.com) a stack moderno Python + React desplegado en VPS Contabo gestionado con Coolify.

## Stack

- **Backend**: FastAPI + SQLModel + SQLite + OpenAI SDK + uv + ruff
- **Frontend**: React 18 + Vite + TypeScript + Tailwind v4 + shadcn/ui + React Bits + anime.js v4
- **Infra**: VPS Contabo (Ubuntu) + Coolify (PaaS self-hosted) + Traefik + Let's Encrypt
- **Diseno**: Linear design system (negros + purpura), Inter Display, ultra-minimal

## Estructura

```
ia-melilla/
├── backend/         FastAPI monolito (mayoria de demos viven aqui)
├── frontend/        React + Vite (web publica + showroom)
├── services/        Microservicios pesados (reservas-api, etc.)
├── plans/           ROADMAP.md + DECISIONS.md (ADR log)
├── memory/          Memoria persistente del PM y agentes
├── .claude/         Agentes, comandos, skills (sistema multi-agente)
└── docker-compose.yml + docker-compose.prod.yml
```

## Como trabajar con este repo

1. Habla SOLO con el PM Coordinator: `claude` → `/pm`
2. El PM lee `CLAUDE.md`, `plans/ROADMAP.md`, `agent-comms.md` y propone siguiente accion
3. PM delega a agentes especialistas (backend, frontend, python, qa, doc-auditor) cuando hace falta
4. Quality gates obligatorios: `/check-plan` antes de implementar, `/verify` despues

Detalles completos: `MULTI_AGENT_WORKFLOW.md`.

## Setup local (placeholder — Fase 1+)

```bash
# Backend
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## Datos de negocio

- Email: hola@iamelilla.com
- WhatsApp: +34 654 186 173
- Instagram: @iamelilla
- Web actual: https://iamelilla.com

## Licencia

Privado. Copyright 2026 IA Melilla.
