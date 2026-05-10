---
name: deploy
description: Prepare deployment to Coolify on Contabo VPS
disable-model-invocation: true
---

# /deploy — Preparar despliegue Coolify

> **Nota**: Coolify despliega automaticamente al detectar push a `main` (si esta configurado el webhook GitHub).
>
> Pre-requisito: Fase 0 completada (Coolify instalado en VPS, webhook configurado).

## Pasos

1. **Verificar limpieza**:
    ```bash
    git status   # debe estar limpio
    git log --oneline -5
    ```

2. **Tests + build**:
    ```bash
    cd backend && uv run pytest tests/ -v --tb=short
    cd frontend && npm run build
    ```

3. **Verificar `.env.example` actualizado** si hay nuevas vars

4. **Push a main**:
    ```bash
    git push origin main
    ```

5. **Monitorizar despliegue Coolify**:
    - Panel: `https://panel.iamelilla.com`
    - Verificar logs del contenedor
    - Healthcheck: `https://iamelilla.com/health` (backend) / `https://iamelilla.com` (frontend)

## Rollback

Si despliegue falla:
- Coolify panel → ultimo despliegue OK → `Redeploy`
- O: `git revert HEAD && git push origin main`

## NO hacer

- NO `git push --force` a `main`
- NO desplegar sin tests pasando
- NO commitear `.env` ni secrets
