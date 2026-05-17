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
- **UFW**: 22/80/443/8000 ALLOW, resto DENY
- **fail2ban**: jail sshd activo (maxretry 5 / findtime 10m / bantime 1h)
- **Coolify**: v4 instalado, panel en `http://178.238.227.50:8000` (version exacta en `reference_coolify_admin.md`)
- **Docker**: instalado por Coolify (engine + compose)
- **Deploy prueba**: nginxdemos/hello desplegado y borrado OK
- **Updates automaticos**: `unattended-upgrades` activo

## Pendiente Fase 0b — DNS + SSL

1. Registrar/migrar dominio (registrar pendiente decidir)
2. Crear registros A: `panel.iamelilla.com` y `iamelilla.com` (+ www) → 178.238.227.50
3. Configurar dominios en Coolify para panel + recursos
4. Validar SSL Let's Encrypt automatico
5. Cerrar puerto 8000 en UFW
6. Definir email LE (ADR-007)
