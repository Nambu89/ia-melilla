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
- **OS**: Ubuntu (version a confirmar — `cat /etc/os-release`)
- **Usuario por defecto**: root
- **VNC**: 5.189.135.210:63036
- **Auto-backup**: NO disponible. Implementar backups propios a S3-compatible.

## Requisito Coolify

Instalador automatico requiere Ubuntu LTS (20.04 / 22.04 / 24.04). Si version no-LTS: instalacion manual.

## Pendiente Fase 0

1. Confirmar version Ubuntu
2. Hardening SSH (deshabilitar root login con password, fail2ban, ufw)
3. Instalar Coolify
4. Apuntar dominio + SSL
