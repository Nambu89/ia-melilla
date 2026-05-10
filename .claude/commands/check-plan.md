---
name: check-plan
description: Verifica un plan de implementacion ANTES de ejecutarlo (quality gate pre-implementacion)
disable-model-invocation: true
---

# /check-plan — Quality Gate Pre-implementacion

Lee `.claude/agents/plan-checker.md` y adopta ese rol.

## Pasos

1. Identifica el plan a verificar:
    - `task.md` o `implementation_plan.md` en raiz
    - `plans/<fecha>-<feature>.md`
    - O texto pegado por el usuario

2. Aplica las 5 dimensiones:
    - D1: Cobertura requisitos
    - D2: Completitud tareas
    - D3: Dependencias
    - D4: Scope
    - D5: Riesgos

3. Emite veredicto: **PASS** o **ISSUES_FOUND**

4. Si `ISSUES_FOUND`: lista issues + recomendaciones concretas

5. Output en formato markdown estructurado (ver `plan-checker.md`)

NO modifiques archivos. Solo lee, analiza, reporta.
