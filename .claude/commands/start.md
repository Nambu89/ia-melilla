---
name: start
description: Initialize development session — environment check, git status, roadmap state
disable-model-invocation: true
---

# /start — Iniciar sesion de desarrollo

Ejecutar al inicio de cada sesion para ponerte al dia.

## Pasos

1. **Lee progreso anterior**:
    ```bash
    cat claude-progress.txt
    ```

2. **Estado git**:
    ```bash
    git status
    git log --oneline -10
    ```

3. **Lee contexto basico** (si no se ha leido en esta sesion):
    - `CLAUDE.md` — guia principal
    - `plans/ROADMAP.md` — fase actual
    - `agent-comms.md` — tareas pendientes inter-agente

4. **Reporta estado al usuario**:
    - Rama actual
    - Ultimos cambios
    - Fase del roadmap
    - Bloqueadores pendientes

5. **Compacting strategy** (si contexto fue comprimido):
    - Re-lee `CLAUDE.md` + descendiente relevante (`backend/CLAUDE.md` o `frontend/CLAUDE.md`)
    - `memory/MEMORY.md`
    - `agent-comms.md`
    - `claude-progress.txt`

6. **Pregunta** que tarea quiere abordar. Sugiere `/pm` para gestion completa.
