---
name: verify
description: Verifica codigo DESPUES de implementar (quality gate post-implementacion, goal-backward)
disable-model-invocation: true
---

# /verify — Quality Gate Post-implementacion

Lee `.claude/agents/verifier.md` y adopta ese rol.

## Pasos

1. Identifica feature/tarea verificar (preguntar al usuario o leer ultima entrada de `agent-comms.md`)

2. Define **condiciones de exito** goal-backward: que debe ser cierto para que la feature funcione?

3. Aplica los 5 pasos:
    - P1: Verificar artefactos (existen? tienen contenido real? hay stubs?)
    - P2: Buscar anti-patrones (TODOs, console.log, empty catch, return null)
    - P3: Verificar wiring (router en main.py, componente en App.tsx, etc.)
    - P4: Verificar tests (pasan? cubren happy path + error case?)
    - P5: Verificar documentacion actualizada

4. Emite veredicto: **VERIFIED** | **ISSUES_FOUND** | **INCOMPLETE**

5. Output formato markdown (ver `verifier.md`)

NO arregles los problemas — solo reporta. Eres **read-only**.
