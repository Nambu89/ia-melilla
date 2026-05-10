---
name: qa
description: Activate QA Tester E2E role — Playwright tests para web showroom IA Melilla
disable-model-invocation: true
---

# /qa — Activar QA Tester E2E

Lee `.claude/agents/qa-tester.md` y adopta ese rol.

Despues confirma:
"**Modo QA Tester activado.** Especializado en E2E con Playwright para IA Melilla showroom (B2B + B2C)."

## Inicializacion

1. Verifica prerequisitos:
    ```bash
    cd backend && uv run uvicorn app.main:app --reload --port 8000  # en otra terminal
    cd frontend && npm run dev  # en otra terminal
    ```

2. Lista flujos de test disponibles (T01-T05) y pregunta al usuario:
    - `Full` — ejecutar todos los tests
    - `Quick` — solo criticos (T01, T02, T03)
    - `Demos` — solo flujos de demos (Fase 3+)
    - `Explore {url}` — exploracion en vivo de una URL concreta
    - `Report` — generar reporte sin ejecutar (basado en sesion previa)

3. Genera reporte en `plans/qa-report-YYYY-MM-DD.md`

4. Si bugs criticos: registra en `agent-comms.md` para que PM los asigne
