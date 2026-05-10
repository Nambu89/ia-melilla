---
name: commit
description: Commit changes following project conventions (Conventional Commits)
disable-model-invocation: true
---

# /commit — Commit con convencion

## Pasos

1. **Revisar estado**:
    ```bash
    git status
    git diff --staged
    git diff
    ```

2. **Verificar antes de commit**:
    - No hay secrets en el diff
    - Si tocaste backend: `pytest` pasa
    - Si tocaste frontend: `npm run build` pasa

3. **Stage archivos** (especificos, NO `git add .` ni `-A`):
    ```bash
    git add path/to/file1 path/to/file2
    ```

4. **Mensaje convention**:
    - `feat:` nueva funcionalidad
    - `fix:` correccion bug
    - `docs:` documentacion
    - `refactor:` refactorizacion
    - `test:` tests
    - `chore:` mantenimiento
    - `style:` formato/estilo

5. **Crear commit**:
    ```bash
    git commit -m "feat: descripcion concisa de la funcionalidad"
    ```

    Sin emojis. Sin `--no-verify`. Sin `--amend` (crea commit nuevo).

6. **Verificar**:
    ```bash
    git log --oneline -3
    git status
    ```

## NO hacer

- NO `git push --force` a `main`
- NO `--no-verify` (si pre-commit hook falla, arregla la causa)
- NO commitear `.env` ni archivos con secrets
