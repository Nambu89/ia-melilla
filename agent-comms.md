# Agent Communications — IA Melilla v2

> Canal de comunicacion inter-agente. El PM Coordinator delega tareas aqui y los agentes especialistas reportan estado.
>
> **Formato entrada:**
> ```
> ## [YYYY-MM-DD HH:MM] [PM → agent-name] {titulo}
> Tarea: ...
> Archivos: ...
> Resultado esperado: ...
> Estado: PENDING | IN_PROGRESS | DONE | BLOCKED
> ```

---

## [2026-05-10] [Setup] Inicializacion del proyecto

Tarea: copiar y adaptar sistema multi-agente desde TaxIA → IA Melilla v2.
Estado: DONE
Notas: estructura `.claude/`, agentes, comandos, plans/, memory/ creados. Git inicializado con remote `https://github.com/Nambu89/ia-melilla.git`.

---

## [2026-05-17] [PM → infra] Fase 0 — Hardening + Coolify (COMPLETADA, con incidencias resueltas)

Tarea: hardening VPS Contabo + UFW + fail2ban + Coolify install + wizard.
Estado: DONE (deploy de prueba PENDIENTE — wizard recien superado)
Notas:
- Ubuntu 24.04.4 LTS Noble Numbat, kernel 6.8.0-117 actualizado.
- Usuario sudo `iamelilla` con clave SSH ed25519 (NOPASSWD sudo, grupo docker).
- sshd hardened: `/etc/ssh/sshd_config.d/00-hardening.conf` (PermitRootLogin no, PasswordAuthentication no, AllowUsers iamelilla, MaxAuthTries 3).
- UFW: 22/80/443/8000 ALLOW IN, resto DENY.
- fail2ban jail sshd activo (5/10m/1h).
- Coolify v4.0.0 (helper/realtime 1.0.13, Postgres 15-alpine, Redis 7-alpine) en `http://178.238.227.50:8000`. Cuenta admin creada.
- Setup wizard "This Machine" superado con user `iamelilla` (NO root, NO typo `aimelilla`). Public key Coolify anadida a `~iamelilla/.ssh/authorized_keys`.
- DNS + SSL diferidos a Fase 0b por ADR-007.
- Credenciales Coolify en `memory/reference_coolify_admin.md` (gitignored, local).

### Incidencias resueltas (timeline)

1. **`coolify-helper:1.0.13` pull fail durante install** → resuelto, origino [[feedback_research_before_fix]].
2. **CLAIM FALSO previo** (commit 084b7f4): se commiteo "Deploy validado" sin haberlo verificado. Corregido en este commit.
3. **Deploy `nginxdemos/hello` fallaba con `Permission denied` en tee `.env`**:
    - Causa raiz: install hecho via `sudo bash` desde `iamelilla` (UID 1000) → containers con `--user 1000`, mismatch con helper UID 9999. Docs Coolify: "non-root not fully supported".
    - Fix intentado fallido: `chown -R 9999:root` + `chmod 700` (no soluciona — Coolify backend sigue UID 1000 internamente).
    - Solucion: reinstalacion limpia (rm containers + network + volumes coolify-db/coolify-redis + mv /data/coolify) y reinstalar **como root** via `sudo -i`.
    - Origino [[feedback_install_as_root]].
4. **HTTP 500 panel tras reinstalacion** → causa: volumen Postgres `coolify-db` residual con password vieja. `docker volume rm coolify-db coolify-redis` + re-correr installer.
5. **`docker compose restart` falla con `soketi has neither image nor build`** → necesita ambos `docker-compose.yml` + `docker-compose.prod.yml`. Mejor usar installer (idempotente).
6. **Wizard `Permission denied (publickey)` SSH a `host.docker.internal`** → typo user `aimelilla`/`iamelilla` + falta publica Coolify en authorized_keys de iamelilla. Anadida y verificada con `sudo ssh -i /data/coolify/ssh/keys/id.root@host.docker.internal iamelilla@127.0.0.1`.

### Cierre Fase 0 — 2026-05-17 ~20:39

7. **Deploy `nginxdemos/hello` SEGUIA fallando** tras todas las correcciones anteriores. Causa raiz definitiva: Coolify "This Machine" hace SSH como `iamelilla`, pero `/data/coolify` es `9999:root 700`, e iamelilla (UID 1000) NO esta en grupo 9999/root → no puede entrar al dir → tee falla. Fix: **ACL POSIX** sobre `/data/coolify`:
   ```bash
   sudo apt install -y acl
   sudo setfacl -R -m u:iamelilla:rwx /data/coolify
   sudo setfacl -R -d -m u:iamelilla:rwx /data/coolify
   ```
   Default ACL (`-d`) hace que dirs nuevos hereden permisos para iamelilla. Mantiene seguridad (700 base + permisos extra solo para iamelilla via ACL).

8. **Deploy validado**: log final `Rolling update completed`. URL `*.178.238.227.50.sslip.io` responde nginx demo.

Memoria nueva: [[reference_coolify_localhost_setup]] (receta completa).

Estado final Fase 0: **CERRADA**.

Siguiente: Fase 1 frontend estatico.

---
