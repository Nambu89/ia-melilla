---
name: test
description: Run backend + frontend tests
disable-model-invocation: true
---

# /test — Ejecutar tests

## Backend

```bash
cd backend && uv run pytest tests/ -v --tb=short
```

## Frontend

```bash
cd frontend && npm run build
```

(Vitest / Playwright se anaden segun fases del roadmap.)

## Reportar

- Tests pasando: cuantos
- Tests fallando: lista + traceback breve
- Sugerencias correccion si hay fallos
- Si hay coverage report: porcentaje y modulos con <70%
