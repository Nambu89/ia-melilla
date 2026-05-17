---
name: feedback_install_as_root
description: Instalar herramientas self-hosted como root cuando los docs lo piden, NUNCA via sudo desde usuario normal
metadata:
  type: feedback
---

# Instalar como root cuando los docs lo dicen

Cuando un instalador de herramienta self-hosted (Coolify, similar) dice en docs oficiales **"non-root not fully supported"** o **"Log in as the root user"**, hay que instalar **literalmente como root via `sudo -i`**, NO via `sudo bash install.sh` desde un usuario normal.

**Why:** El 2026-05-17 instalamos Coolify v4 via `sudo bash /tmp/coolify-install.sh` desde el usuario `iamelilla` (sudo NOPASSWD). El installer detecto UID 1000 (iamelilla) y configuro los contenedores con `--user 1000`, pero el coolify-helper image usa UID 9999 internamente. Mismatch causo:
- `tee /data/coolify/applications/<uuid>/.env: Permission denied` en cada deploy
- `service "soketi" has neither an image nor a build context specified` al hacer `docker compose restart`
- Tras reinstalar: HTTP 500 panel por Postgres password rot (volume residual con creds viejas)

Reinstalar limpio implico:
1. `docker rm -f $(docker ps -aq --filter "name=coolify")`
2. `docker network rm coolify`
3. `docker volume rm coolify-db coolify-redis` ← **clave que olvide la primera vez**
4. `mv /data/coolify /data/coolify.broken-<ts>`
5. `sudo -i` (root shell)
6. `bash /root/coolify-install.sh`

Solo entonces UIDs consistentes (todo 9999:root), compose levanta limpio, Postgres password matches `.env`.

**How to apply:**
- ANTES de ejecutar cualquier instalador automatico de PaaS / self-hosted infra: leer docs install y buscar "root", "non-root", "sudo", "Required privileges".
- Si docs dicen "instalar como root" → `sudo -i` SIEMPRE, no `sudo bash <installer>`.
- Si dudas: `sudo -i` es la opcion segura (los installers que aceptan non-root tambien aceptan root).
- En reinstalaciones from-scratch: **siempre** borrar containers + network + **volumes** + bind mount dir. Volumes son la trampa que te pilla.

Aplica a: Coolify, Dokku, CapRover, instalaciones n8n/PostgreSQL/Redis self-hosted, herramientas con installer `curl | bash`.

Relacionada: [[feedback_research_before_fix]] (consultar docs antes de improvisar fix).
