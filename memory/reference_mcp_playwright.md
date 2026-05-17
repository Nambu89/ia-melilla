---
name: reference_mcp_playwright
description: MCP Playwright (Microsoft oficial) + skill web-recon para inspeccionar la web actual de IA Melilla antes de Fase 1
metadata:
  type: reference
---

# MCP Playwright + skill web-recon

Instalado 2026-05-17 para que el PM Coordinator pueda inspeccionar `https://iamelilla.com` (WordPress + Elementor productivo) via browser automation y generar brief detallado para que `frontend-dev` codifique el rediseno moderno Fase 1.

## MCP server

- **Paquete**: `@playwright/mcp@latest` (Microsoft oficial — NO el viejo `@modelcontextprotocol/server-playwright`)
- **Repo**: https://github.com/microsoft/playwright-mcp
- **Comando install Claude Code**: `claude mcp add playwright npx @playwright/mcp@latest`
- **Scope**: `local` (project-only, persistido en `~/.claude.json` bajo el path del proyecto)
- **Verificar**: `claude mcp list` debe mostrar `playwright: npx @playwright/mcp@latest - ✓ Connected`
- **Reinstalar / actualizar**: `claude mcp remove playwright` + `claude mcp add playwright npx @playwright/mcp@latest`

## Skill custom

- **Path**: `.claude/skills/web-recon/SKILL.md`
- **Trigger**: PM o usuario pide "ver", "inspeccionar", "auditar", "analizar" la web actual
- **Output**: `plans/web-recon-iamelilla-<YYYY-MM-DD>.md` con 13 secciones (inventario paginas, paleta, tipografias, copy, SEO, brief frontend-dev)
- **Mantenimiento**: si cambian objetivos del rediseno o paginas a auditar, editar la SKILL.md directamente.

## Notas operativas

- Primera invocacion del MCP descarga browsers Playwright (~150MB chromium). Tardar 30-60s normal.
- Si `npx` baja paquete primera vez: paciencia ~1-2 min.
- Pre-bajar manualmente para acelerar: `npx -y @playwright/mcp@latest --help`.
- Si Coolify GET 403 / bot detection: el MCP usa user-agent real chromium por defecto, no deberia bloquearse.
- Asset binarios > 5MB: saltar (no descargar PDFs/imagenes grandes en recon).

## Cuando NO usar este MCP

- Tests E2E de la web nueva (showroom IA Melilla v2): usar agente `qa-tester` con su propio flujo Playwright (no via MCP, scripts directos en `tests/e2e/`).
- Automatizacion de tareas web genericas: este MCP esta para recon puntual, no para corredor continuo.

Relacionada: el agente [[qa-tester]] (.claude/agents/qa-tester.md) ya menciona Playwright MCP — puede usar este mismo MCP para sus tests si lo prefiere sobre scripts.
