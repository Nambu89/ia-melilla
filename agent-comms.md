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

## [2026-05-17] [PM → infra] Fase 0 completada

Tarea: hardening VPS Contabo + UFW + fail2ban + Coolify install + deploy de prueba.
Estado: DONE
Notas:
- Ubuntu 24.04.4 LTS Noble Numbat confirmado, kernel 6.8.0-117 actualizado.
- Usuario sudo `iamelilla` con clave SSH ed25519 (passphrase, NOPASSWD sudo, grupo docker).
- sshd hardened: PermitRootLogin no, PasswordAuthentication no, AllowUsers iamelilla, MaxAuthTries 3.
- UFW: 22/80/443/8000 ALLOW IN, resto DENY.
- fail2ban jail sshd activo (5 intentos / 10 min / ban 1h).
- Coolify v4 instalado via instalador oficial, accesible en `http://178.238.227.50:8000`. Cuenta admin creada.
- Deploy de prueba `nginxdemos/hello` validado via `sslip.io` y borrado.
- Incidencia previa con instalador (`Failed to pull coolify-helper:1.0.13`) resuelta. Origino memoria [[feedback_research_before_fix]].
- DNS + SSL diferidos a Fase 0b por ADR-007.
- Credenciales Coolify en `memory/reference_coolify_admin.md` (gitignored, local).

Siguiente: Fase 1 frontend estatico.

---
