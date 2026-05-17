---
name: feedback_research_before_fix
description: Investigar documentacion oficial ANTES de proponer arreglos a errores de herramientas externas
metadata:
  type: feedback
---

# Investigar docs antes de proponer fix

Cuando una herramienta externa (Coolify, Docker, FastAPI, libreria de terceros, etc.) falla con un error concreto:

1. **NO improvisar el fix** basado solo en intuicion o output del error.
2. **PRIMERO consultar documentacion oficial** del proyecto: README, docs site, troubleshooting/knowledge-base, GitHub issues abiertos/cerrados con el mismo error.
3. Solo despues proponer fix con cita de la fuente.

**Why:** Fernando lo pidio explicitamente 2026-05-17 durante Fase 0 cuando el instalador de Coolify fallo con `Failed to pull ghcr.io/coollabsio/coolify-helper:1.0.13`. Le aplica tambien al briefing inicial CLAUDE.md regla 3: "Investigar en profundidad herramientas actuales antes de recomendar integracion."

**How to apply:**
- Antes de cualquier comando de troubleshooting: WebSearch / WebFetch a docs oficiales.
- Si la herramienta tiene knowledge-base o troubleshooting page, leerla.
- Si el error es muy especifico: buscar en GitHub Issues del repo oficial.
- Citar fuentes al proponer fix.
- Solo "tirar comandos por intuicion" si docs no cubren el caso.

Aplica a: instalacion infra, integraciones LLM (OpenAI/Anthropic), bibliotecas frontend (Tailwind v4, shadcn, anime.js), librerias backend (FastAPI, SQLModel, alembic).
