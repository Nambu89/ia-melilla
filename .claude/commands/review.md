---
name: review
description: Code review of pending changes before commit
disable-model-invocation: true
---

# /review — Code Review pre-commit

Analiza los cambios pendientes antes de hacer commit.

## Pasos

1. **Ver cambios**:
    ```bash
    git status
    git diff
    git diff --staged
    ```

2. **Revisar**:
    - **Convenciones**: PEP 8 (Python) / ESLint (TS), tabulacion en Python, `PascalCase.tsx`, `camelCase.ts`
    - **Errores logicos**: off-by-one, condiciones invertidas, returns prematuros
    - **Tests faltantes**: hay logica nueva sin test? Si tocaste service: hay test del service?
    - **Codigo duplicado**: extraer a util?
    - **`console.log` / `print` olvidados**
    - **TODOs** sin issue trackeado
    - **Type hints / interfaces** faltantes
    - **Security**: queries parametrizadas? CORS estricto? Rate limiting? Secrets en `.env` no commiteados?

3. **Reportar findings**:
    - Lista de issues con archivo:linea
    - Severidad: Critico / Medio / Bajo
    - Sugerencias concretas

4. Si todo OK: dar luz verde para `/commit`
