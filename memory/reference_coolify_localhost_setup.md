---
name: reference_coolify_localhost_setup
description: Receta completa Coolify "This Machine" con root SSH bloqueado por hardening — install root + ACL + SSH key
metadata:
  type: reference
---

# Coolify "This Machine" + hardening SSH — receta completa

> Setup operativo confirmado 2026-05-17 en VPS Contabo `vmi3250010` (Ubuntu 24.04.4 LTS). Resolvio el caso donde Coolify "Quick Start - This Machine" fallaba con `tee Permission denied` tras hardening que bloqueo root SSH.

## El problema (recordar)

Coolify "This Machine" deploys ejecuta comandos en el host via SSH a `host.docker.internal`. Por defecto SSH como `root`. Si root SSH esta bloqueado por hardening (`PermitRootLogin no`), hay que usar un usuario non-root (`iamelilla`). Pero `/data/coolify` es `9999:root` mode `700`, e `iamelilla` (UID 1000) no esta en grupo 9999 → no puede entrar → `tee Permission denied`.

Docs Coolify recomiendan instalar como root (sino crea install corrupto con UIDs mismatch). Pero los docs **no documentan** el caso de "root install + non-root SSH user". La pista esta entre lineas (issue #5199), pero la receta exacta requiere ACL.

## Receta (probada 2026-05-17, deploy `nginxdemos/hello` validado)

### 1. Install Coolify como root (no via sudo desde usuario normal)

```bash
sudo -i   # shell de root local (no via SSH si root SSH bloqueado)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh -o /root/coolify-install.sh
bash /root/coolify-install.sh
exit
```

Resultado: `/data/coolify` con todo `9999:root` mode `700`, containers Coolify `Up (healthy)`.

### 2. Anadir public key Coolify al usuario SSH non-root

Coolify genera private key durante install en `/data/coolify/ssh/keys/id.root@host.docker.internal` (sin `.pub`, hay que extraer publica).

```bash
sudo ssh-keygen -y -f /data/coolify/ssh/keys/id.root@host.docker.internal > /tmp/coolify-pub.tmp
sudo bash -c 'cat /tmp/coolify-pub.tmp >> /home/iamelilla/.ssh/authorized_keys'
sudo chown iamelilla:iamelilla /home/iamelilla/.ssh/authorized_keys
sudo chmod 600 /home/iamelilla/.ssh/authorized_keys
sudo rm /tmp/coolify-pub.tmp
```

Verificar con test directo desde host:
```bash
sudo ssh -o StrictHostKeyChecking=no -i /data/coolify/ssh/keys/id.root@host.docker.internal -p 22 iamelilla@127.0.0.1 "whoami && hostname"
```
Esperado: `iamelilla\nvmi3250010`.

### 3. **CRITICO** — ACL para que iamelilla pueda escribir a /data/coolify

```bash
sudo apt install -y acl   # Ubuntu 24.04 minimal no trae acl pre-instalado
sudo setfacl -R -m u:iamelilla:rwx /data/coolify
sudo setfacl -R -d -m u:iamelilla:rwx /data/coolify
```

El `-d` (default ACL) hace que TODO archivo/dir futuro creado dentro de `/data/coolify` herede `iamelilla:rwx`. Sin esto, los dirs nuevos que crea Coolify quedan inaccesibles para iamelilla SSH user.

Verificar:
```bash
echo "test" > /data/coolify/applications/test.txt && cat /data/coolify/applications/test.txt && rm /data/coolify/applications/test.txt && echo OK
```
Debe imprimir `test` y `OK` sin "Permission denied".

### 4. Wizard Coolify

1. Abrir `http://178.238.227.50:8000`
2. Crear cuenta admin
3. Setup server type: **Quick Start → This Machine**
4. Config:
   - **User**: `iamelilla` (cuidado typo `aimelilla`)
   - **Port**: `22`
5. Click **Check Again** → debe pasar verde
6. Continuar wizard

### 5. Validar deploy

`Projects` → `+ New` → `sandbox` / production → `+ New Resource` → `Docker Image` → `nginxdemos/hello:latest` puerto `80` → Deploy.

Log esperado:
```
Pulling latest images from the registry.
New container started.
Removing old containers.
Rolling update completed.
```

URL auto-generada `*.178.238.227.50.sslip.io` responde con pagina nginx demo.

## Lecciones grabadas (ya separadas en otras memorias)

- [[feedback_install_as_root]] — instalar via `sudo -i`, NUNCA `sudo bash` desde non-root
- [[feedback_research_before_fix]] — docs oficiales antes de improvisar
- En `/data/coolify` mantener perms restrictivos `700 9999:root` y anadir ACL en lugar de chmod 770 (mejor seguridad).
- Si reinstalamos Coolify: borrar tambien volumes `coolify-db` + `coolify-redis` (NO solo containers + bind mount).
- Coolify compose se compone de `docker-compose.yml` (base) + `docker-compose.prod.yml` (override). `docker compose restart` directo falla por `soketi` sin `image:`. Usar siempre `bash /root/coolify-install.sh` (idempotente).
