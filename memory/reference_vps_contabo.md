---
name: reference_vps_contabo
description: Datos VPS Contabo para despliegue con Coolify
type: reference
---

# VPS Contabo

- **Hostname**: vmi3250010
- **IP publica**: 178.238.227.50
- **IPv6**: 2a02:c207:2325:0010::1/64
- **Recursos**: 6 vCPU, 18 GB RAM, 150 GB NVMe
- **Region**: EU
- **OS**: Ubuntu 24.04.4 LTS (Noble Numbat) — confirmado 2026-05-17. Kernel `6.8.0-117-generic` (actualizado 2026-05-17 desde 110). Compatible instalador automatico Coolify.
- **Plan Contabo**: Cloud VPS 20 SP NVMe (no setup) — €7.74/mes, contrato 12 meses
- **Creado**: 2026-04-22 (~25 dias antes del bootstrap)
- **MAC**: 00:50:56:63:5b:28
- **Host System Contabo**: 19210
- **Usuario por defecto**: root
- **VNC**: 5.189.135.210:63036
- **Auto-backup**: NO disponible. Implementar backups propios a S3-compatible.

## Requisito Coolify

Instalador automatico requiere Ubuntu LTS (20.04 / 22.04 / 24.04). Si version no-LTS: instalacion manual.

## Estado tras Fase 0 (2026-05-17) — COMPLETADA

- **Usuario admin**: `iamelilla` (sudo NOPASSWD, grupo docker)
- **Root SSH**: deshabilitado (PermitRootLogin no)
- **Password SSH**: deshabilitado (PasswordAuthentication no)
- **AllowUsers**: solo `iamelilla`
- **Clave SSH local**: `C:\Users\Fernando Prada\.ssh\id_ed25519_iamelilla` (passphrase en gestor)
- **Alias SSH**: `ssh ia-melilla` (definido en `~/.ssh/config`)
- **Admins SSH autorizados** (`/home/iamelilla/.ssh/authorized_keys`):
  1. `fernando@ia-melilla-vps` — Fernando (clave `id_ed25519_iamelilla` en `C:\Users\Fernando Prada\.ssh\`)
  2. `coolify-localhost` — Coolify deploys ("This Machine" wizard)
  3. `joaki@iamelilla` — tio co-founder (clave `id_ed25519_iamelilla` en `C:\Users\joaki\.ssh\`, anadido 2026-05-19). Pubkey fingerprint inicio: `AAAAC3NzaC1lZDI1NTE5AAAAIGjtVPDRNH0lCuEr...`
- **Politica claves**: cada admin = clave propia. Revocar = borrar linea concreta de `authorized_keys`. Nunca compartir privadas por chat/email.
- **Hardening sshd**: `/etc/ssh/sshd_config.d/00-hardening.conf` (NO `99-`, otro nombre)
- **UFW**: 22/80/443/8000 ALLOW, resto DENY
- **fail2ban**: jail sshd activo (maxretry 5 / findtime 10m / bantime 1h)
- **Coolify**: v4.0.0 + helper/realtime 1.0.13, panel en `http://178.238.227.50:8000` (credenciales en `reference_coolify_admin.md`)
- **Docker**: Docker Engine 29.5.0 + BuildKit + Buildx, instalado por Coolify
- **Wizard Coolify "This Machine" (localhost)**: configurado con user `iamelilla` (NOT root, NOT typo `aimelilla`). Public key Coolify en `/home/iamelilla/.ssh/authorized_keys` con comentario `coolify-localhost`.
- **ACL `/data/coolify`**: paquete `acl` instalado; `setfacl -R -m u:iamelilla:rwx /data/coolify` + default ACL aplicados. Permite a `iamelilla` (UID 1000) escribir aunque dirs sean `9999:root 700`.
- **Deploy prueba**: `nginxdemos/hello` desplegado y validado 2026-05-17 (rolling update OK, URL `*.178.238.227.50.sslip.io`)
- **Updates automaticos**: `unattended-upgrades` activo

## Lecciones aprendidas Fase 0 (CRITICO recordar)

Ver receta operativa completa en [[reference_coolify_localhost_setup]]. Resumen:

1. **Instalar Coolify SOLO como root** via `sudo -i` + `bash install.sh`. Install via `sudo bash` desde usuario normal crea mismatch UIDs (backend UID 1000, helper UID 9999) → `Permission denied`. Ver [[feedback_install_as_root]].
2. **Coolify compose**: `docker-compose.yml` (base, soketi sin image) + `docker-compose.prod.yml` (override). `docker compose restart` directo rompe. Usar siempre `bash /root/coolify-install.sh` (idempotente).
3. **Coolify "This Machine" + root SSH bloqueado**: anadir publica Coolify (`ssh-keygen -y -f /data/coolify/ssh/keys/id.root@host.docker.internal`) a `~iamelilla/.ssh/authorized_keys`. Wizard user `iamelilla`.
4. **CRITICO — ACL en `/data/coolify`**: tras install-as-root, `iamelilla` no esta en grupo 9999/root, NO puede entrar a `/data/coolify` (700 9999:root). Sin esto, deploys fallan con `tee Permission denied`. Fix: `sudo apt install -y acl && sudo setfacl -R -m u:iamelilla:rwx /data/coolify && sudo setfacl -R -d -m u:iamelilla:rwx /data/coolify`. El `-d` (default ACL) hereda permisos a dirs nuevos.
5. **Bind mounts Coolify**: `/data/coolify/ssh` → `/var/www/html/storage/app/ssh` dentro container.
6. **Reinstalaciones from-scratch**: borrar `coolify-db` y `coolify-redis` volumes ademas de containers + bind mount, sino postgres mantiene password vieja del install anterior.

## Pendiente Fase 0b — DNS + SSL

1. Registrar/migrar dominio (registrar pendiente decidir)
2. Crear registros A: `panel.iamelilla.com` y `iamelilla.com` (+ www) → 178.238.227.50
3. Configurar dominios en Coolify para panel + recursos
4. Validar SSL Let's Encrypt automatico
5. Cerrar puerto 8000 en UFW
6. Definir email LE (ADR-007)
