# Fase 0 — Hardening VPS + Coolify (sin DNS aun)

> **Para agentes ejecutores:** este plan se ejecuta mano a mano con el usuario en su PowerShell + sesion SSH al VPS. NO es codigo de aplicacion, son operaciones de sistema. Cada paso lleva comando exacto, output esperado y criterio de exito. Marca cada `[ ]` al completar.

**Objetivo:** dejar VPS Contabo (178.238.227.50, Ubuntu 24.04 LTS) endurecido y con Coolify operativo, accesible via `http://178.238.227.50:8000`. DNS + SSL se hacen en Fase 0b cuando estemos listos para publicar.

**Arquitectura:**
- Crear usuario sudo `iamelilla` con autenticacion por clave SSH ed25519.
- Cerrar SSH a root + password (solo claves, solo usuario `iamelilla`).
- UFW abierto solo en 22 (SSH), 80 (HTTP futuro), 443 (HTTPS futuro), 8000 (Coolify panel temporal).
- fail2ban con jail sshd por defecto (5 intentos / 10 min ban).
- Coolify v4 via instalador oficial (`curl https://cdn.coollabs.io/coolify/install.sh`).
- Validacion: deploy `nginxdemos/hello` via Coolify, acceso por IP+sslip.io.

**Tech Stack VPS:** Ubuntu 24.04.4 LTS · Docker (lo instala Coolify) · Coolify v4 · UFW · fail2ban · OpenSSH

**Decisiones pendientes (Fase 0b):** registrar DNS (postpuesto), email Let's Encrypt (postpuesto).

**Pre-requisitos en tu maquina Windows:**
- PowerShell 5+ (ya disponible)
- OpenSSH Client (Windows 11 incluye por defecto: `Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'`)
- Acceso fisico a consola VNC de Contabo (5.189.135.210:63036) **por si te quedas fuera** durante hardening. Anota credenciales VNC ANTES de empezar.

**Riesgo principal:** un error en `sshd_config` puede dejarte fuera. Mitigacion: NUNCA cerrar la sesion root original hasta validar que el login con clave del usuario `iamelilla` funciona en una sesion paralela.

---

## Task 0 — Validar plan B (VNC Contabo) ANTES de empezar

**Files:** N/A (verificacion manual en panel cliente Contabo)

- [x] **Step 0.1: Abrir panel cliente Contabo** y verificar que el servicio VNC `5.189.135.210:63036` esta accesible.

- [x] **Step 0.2: Anotar credenciales VNC** en tu gestor de passwords. **No avances** sin esto: si Task 5 deja SSH inutilizable y VNC no funciona, pierdes el VPS.

- [x] **Step 0.3: Hacer una conexion VNC de prueba** (con TigerVNC, RealVNC u otro). Confirmar que ves la consola del VPS.

**Criterio exito:** VNC funciona AHORA y tienes login root local. Sin esto, NO continues.

---

## Task 1 — Limpiar known_hosts + reconectar root

**Files:** N/A (operacion local Windows + sesion SSH)

- [x] **Step 1.1: Borrar entrada vieja known_hosts (causo "Host key verification failed")**

Local (PowerShell):
```powershell
ssh-keygen -R 178.238.227.50
```
Output esperado:
```
# Host 178.238.227.50 found: line N
...updated
```
Si no existe: imprime nada. OK igual.

- [x] **Step 1.2: SSH a root, aceptar fingerprint nuevo**

```powershell
ssh root@178.238.227.50
```
Output esperado: te pide aceptar fingerprint (`yes`) y luego password root de Contabo. Quedas dentro como `root@vmi3250010:~#`.

- [x] **Step 1.3: Verificar entorno**

Dentro del VPS:
```bash
whoami && hostname && uptime && df -h /
```
Output esperado:
```
root
vmi3250010
... up X days, ...
Filesystem ... 150G ... /
```

**Criterio exito:** estas en root via SSH y el VPS responde correctamente.

---

## Task 2 — Actualizar sistema + instalar utilidades base

**Files:** N/A (apt en VPS, sesion root)

- [x] **Step 2.1: Update + upgrade**

En VPS (root):
```bash
apt update && apt upgrade -y
```
Output esperado: lista paquetes, descarga, instala. Sin errores. Si pide reiniciar servicios, acepta defaults (mantener configuraciones actuales).

- [x] **Step 2.2: Instalar utilidades base + sudo**

```bash
apt install -y sudo ufw fail2ban curl wget git htop ca-certificates gnupg lsb-release nano vim unattended-upgrades
```
Output esperado: paquetes instalados sin errores. `sudo` y `ufw` ya pueden venir, no pasa nada.

- [x] **Step 2.3: Activar updates de seguridad automaticos**

```bash
dpkg-reconfigure -plow unattended-upgrades
```
Acepta `Yes` (instala patches seguridad automaticamente).

- [x] **Step 2.4: Reiniciar si kernel fue actualizado**

```bash
[ -f /var/run/reboot-required ] && echo "REBOOT REQUIRED" || echo "no reboot needed"
```
Si dice REBOOT REQUIRED:
```bash
reboot
```
Esperar ~60s y reconectar:
```powershell
ssh root@178.238.227.50
```

**Criterio exito:** sistema actualizado, sin reboot pendiente, herramientas disponibles (`which ufw fail2ban-client sudo`).

---

## Task 3 — Crear usuario sudo `iamelilla`

**Files:** N/A (useradd en VPS)

- [x] **Step 3.1: Crear usuario con home + shell bash**

En VPS (root):
```bash
adduser --gecos "IA Melilla Admin" --disabled-password iamelilla
```
Output: crea `/home/iamelilla`, sin pedir password (lo dejamos sin password porque vamos a usar clave SSH).

- [x] **Step 3.2: Anadirlo a `sudo` y `docker` (este ultimo lo usara Coolify)**

```bash
usermod -aG sudo iamelilla
getent group docker >/dev/null || groupadd docker
usermod -aG docker iamelilla
```

- [x] **Step 3.3: Permitir sudo sin password (necesario para automatizar; protegido por clave SSH)**

```bash
echo "iamelilla ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/iamelilla
chmod 0440 /etc/sudoers.d/iamelilla
visudo -c
```
Output esperado:
```
/etc/sudoers: parsed OK
/etc/sudoers.d/iamelilla: parsed OK
```

- [x] **Step 3.4: Validar**

```bash
id iamelilla
```
Output esperado:
```
uid=1000(iamelilla) gid=1000(iamelilla) groups=1000(iamelilla),27(sudo),998(docker)
```
(IDs pueden variar, lo importante: `sudo` y `docker` aparecen).

**Criterio exito:** `iamelilla` existe, en grupos `sudo` y `docker`, con NOPASSWD configurado.

---

## Task 4 — Generar clave SSH ed25519 en Windows + copiarla al VPS

**Files:**
- Create local: `C:\Users\Fernando Prada\.ssh\id_ed25519_iamelilla` (privada)
- Create local: `C:\Users\Fernando Prada\.ssh\id_ed25519_iamelilla.pub` (publica)
- Modify VPS: `/home/iamelilla/.ssh/authorized_keys`
- Modify local: `C:\Users\Fernando Prada\.ssh\config`

- [x] **Step 4.1: Generar clave dedicada (PowerShell, en local — NO en VPS)**

```powershell
ssh-keygen -t ed25519 -C "fernando@ia-melilla-vps" -f "$env:USERPROFILE\.ssh\id_ed25519_iamelilla"
```
Cuando pida passphrase: **introduce una passphrase robusta** (recomendado, no dejar vacia — la clave queda en disco). Guardala en tu gestor de passwords.

Output esperado:
```
Your identification has been saved in C:\Users\Fernando Prada\.ssh\id_ed25519_iamelilla
Your public key has been saved in C:\Users\Fernando Prada\.ssh\id_ed25519_iamelilla.pub
The key fingerprint is: SHA256:...
```

- [x] **Step 4.2: Ver publica para copiarla**

```powershell
Get-Content "$env:USERPROFILE\.ssh\id_ed25519_iamelilla.pub"
```
Output esperado: una linea `ssh-ed25519 AAAA... fernando@ia-melilla-vps`. Copialo (Ctrl+C dentro de la terminal con boton derecho o `Set-Clipboard`):
```powershell
Get-Content "$env:USERPROFILE\.ssh\id_ed25519_iamelilla.pub" | Set-Clipboard
```

- [x] **Step 4.3: Pegar clave en authorized_keys del VPS (sesion root activa)**

En VPS (root):
```bash
mkdir -p /home/iamelilla/.ssh
nano /home/iamelilla/.ssh/authorized_keys
```
Pega la linea (boton derecho en PowerShell pega el portapapeles). Guarda (`Ctrl+O`, Enter, `Ctrl+X`).

```bash
chown -R iamelilla:iamelilla /home/iamelilla/.ssh
chmod 700 /home/iamelilla/.ssh
chmod 600 /home/iamelilla/.ssh/authorized_keys
cat /home/iamelilla/.ssh/authorized_keys
```
Output esperado: la linea `ssh-ed25519 AAAA...` aparece intacta.

- [x] **Step 4.4: Configurar alias SSH local en `~/.ssh/config`**

En local (PowerShell):
```powershell
if (-not (Test-Path "$env:USERPROFILE\.ssh\config")) { New-Item -Path "$env:USERPROFILE\.ssh\config" -ItemType File -Force | Out-Null }
Add-Content -Path "$env:USERPROFILE\.ssh\config" -Value @"

Host ia-melilla
    HostName 178.238.227.50
    User iamelilla
    IdentityFile ~/.ssh/id_ed25519_iamelilla
    IdentitiesOnly yes
"@
```

- [x] **Step 4.5: Probar login con clave en SESION PARALELA (¡NO cierres la sesion root!)**

Abre **otra ventana PowerShell** y:
```powershell
ssh ia-melilla
```
Output esperado: te pide passphrase de la clave (la del Step 4.1) y entras como `iamelilla@vmi3250010:~$`. Verifica sudo:
```bash
sudo whoami
```
Output: `root`.

**Criterio exito:** puedes loguearte sin password (solo passphrase de clave) como `iamelilla` y escalar a `sudo` sin password. Si falla: revisa permisos `/home/iamelilla/.ssh` (700) y `authorized_keys` (600) y propietario `iamelilla:iamelilla`.

---

## Task 5 — Endurecer sshd_config

**Files:**
- Modify VPS: `/etc/ssh/sshd_config.d/99-hardening.conf` (Ubuntu 24 lee `.d/` adicional)
- Reference VPS: `/etc/ssh/sshd_config`

- [x] **Step 5.1: Crear archivo override**

En VPS (sesion root original, MANTENLA ABIERTA):
```bash
cat > /etc/ssh/sshd_config.d/99-hardening.conf <<'EOF'
# Hardening IA Melilla 2026-05-17
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
PermitEmptyPasswords no
MaxAuthTries 3
LoginGraceTime 30
AllowUsers iamelilla
Protocol 2
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
```

- [x] **Step 5.2: Validar sintaxis**

```bash
sshd -t && echo "OK sshd config valid"
```
Output esperado: `OK sshd config valid`. Si hay error: corregir antes de continuar (si reinicias sshd con config rota te quedas fuera).

- [x] **Step 5.3: Reiniciar sshd**

```bash
systemctl restart ssh
systemctl status ssh --no-pager
```
Output esperado: `active (running)`.

- [x] **Step 5.4: Probar en TERCERA sesion (no cierres las dos anteriores)**

Abre **otra ventana PowerShell** y:
```powershell
ssh ia-melilla
```
Debe funcionar (entras como `iamelilla`).

Y probar que root ya NO puede:
```powershell
ssh root@178.238.227.50
```
Output esperado:
```
root@178.238.227.50: Permission denied (publickey).
```
(Esto es bueno: significa hardening funciona.)

- [x] **Step 5.5: Cerrar sesion root original**

Ahora si: en la sesion root vieja:
```bash
exit
```

**Criterio exito:** root SSH bloqueado, password SSH bloqueado, solo `iamelilla` con clave puede entrar. **Si algo falla** y te quedas fuera: usa VNC Contabo (5.189.135.210:63036) para entrar y revertir `/etc/ssh/sshd_config.d/99-hardening.conf`.

---

## Task 6 — UFW (firewall)

**Files:** N/A (estado del kernel)

- [x] **Step 6.1: Reglas base (denegar entrante, permitir saliente)**

En VPS (como `iamelilla` ahora):
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

- [x] **Step 6.2: Permitir puertos necesarios**

```bash
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP (Traefik futuro)'
sudo ufw allow 443/tcp comment 'HTTPS (Traefik futuro)'
sudo ufw allow 8000/tcp comment 'Coolify panel (temporal, cerrar tras DNS)'
```

- [x] **Step 6.2.1: Verificar reglas REGISTRADAS antes de activar (critico para no perder SSH)**

```bash
sudo ufw show added
```
Output esperado: las 4 reglas aparecen listadas. **Si 22/tcp NO aparece**, NO ejecutes el siguiente paso. Re-ejecuta Step 6.2 antes que nada — activar UFW sin la regla 22 te tira la sesion.

- [x] **Step 6.3: Activar UFW (cuidado: confirma `y`)**

```bash
sudo ufw enable
```
Output esperado:
```
Command may disrupt existing ssh connections. Proceed with operation (y|n)?
```
Responde `y`. Resultado:
```
Firewall is active and enabled on system startup
```

- [x] **Step 6.4: Validar**

```bash
sudo ufw status verbose
```
Output esperado:
```
Status: active
Default: deny (incoming), allow (outgoing), disabled (routed)
To                         Action      From
--                         ------      ----
22/tcp     (SSH)           ALLOW IN    Anywhere
80/tcp     (HTTP...)       ALLOW IN    Anywhere
443/tcp    (HTTPS...)      ALLOW IN    Anywhere
8000/tcp   (Coolify...)    ALLOW IN    Anywhere
... (v6 equivalentes)
```

- [x] **Step 6.5: Comprobar sesion SSH sigue viva**

Si la sesion no se cae al activar UFW (porque el 22 esta abierto): OK. Si se cae: clave abrir nueva con `ssh ia-melilla`.

**Criterio exito:** UFW activo, 4 puertos abiertos, resto bloqueado.

---

## Task 7 — fail2ban (ban tras 5 intentos fallidos SSH)

**Files:**
- Create VPS: `/etc/fail2ban/jail.d/sshd.local`

- [x] **Step 7.1: Crear jail local**

```bash
sudo tee /etc/fail2ban/jail.d/sshd.local > /dev/null <<'EOF'
[sshd]
enabled = true
port = ssh
filter = sshd
backend = systemd
maxretry = 5
findtime = 10m
bantime = 1h
ignoreip = 127.0.0.1/8 ::1
EOF
```

- [x] **Step 7.2: Reiniciar y validar**

```bash
sudo systemctl restart fail2ban
sudo systemctl status fail2ban --no-pager
sudo fail2ban-client status sshd
```
Output esperado en el ultimo comando:
```
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  |- Total failed:     0
|  `- File list:        /var/log/auth.log (or journal)
`- Actions
   |- Currently banned: 0
   |- Total banned:     0
   `- Banned IP list:
```

**Criterio exito:** jail `sshd` activo con 5/10m/1h.

---

## Task 8 — Instalar Coolify v4

**Files:** N/A (instalador descarga y configura `/data/coolify`)

- [x] **Step 8.1: Lanzar instalador oficial**

En VPS (como `iamelilla`):
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh -o /tmp/coolify-install.sh
less /tmp/coolify-install.sh
```
**Revisa el script antes de ejecutarlo** (espacio para hacer scroll, `q` para salir). Verifica que no tiene nada raro (debe instalar docker, descargar `docker-compose.yml` de Coolify, lanzarlo).

Cuando estes conforme:
```bash
sudo bash /tmp/coolify-install.sh
```

**Si falla mid-install** (por docker preexistente o conflicto de red): limpiar y reintentar:
```bash
sudo docker compose -f /data/coolify/source/docker-compose.yml down 2>/dev/null
sudo rm -rf /data/coolify
sudo bash /tmp/coolify-install.sh
```

Output esperado (resumido, dura ~3-5 min):
```
2026-05-17-... Welcome to Coolify Installer!
2026-05-17-... Installing required packages...
2026-05-17-... Docker is not installed. Installing Docker.
...
2026-05-17-... Coolify is installed!

Please visit http://178.238.227.50:8000 to get started.
```

- [x] **Step 8.2: Comprobar contenedores levantados**

```bash
sudo docker ps
```
Output esperado: contenedores `coolify`, `coolify-proxy` (Traefik), `coolify-db` (Postgres interna de Coolify), `coolify-redis`.

- [x] **Step 8.3: Abrir panel en tu navegador**

Abre: `http://178.238.227.50:8000`

Pantalla esperada: setup wizard de Coolify pidiendo crear cuenta admin (email + password). **Crea cuenta con email Fernando** (este admin es solo del panel Coolify; no es el LE). Anota password en gestor.

- [x] **Step 8.4: Validar version**

Dentro del panel, top-right o /settings: deberia ver Coolify v4.x.x. Anota version exacta para memoria.

**Criterio exito:** panel accesible en `http://178.238.227.50:8000`, cuenta admin creada.

---

## Task 9 — Test deploy (validar pipeline)

**Files:** N/A (operacion en panel Coolify)

- [x] **Step 9.1: Crear proyecto + recurso publico de prueba**

En panel Coolify:
1. `Projects` → `+ New` → nombre `sandbox`, environment `production`.
2. Dentro del proyecto: `+ New Resource` → `Docker Image` (Public).
3. Image: `nginxdemos/hello:latest`. Puerto: `80`.
4. **Domain**: deja el auto-generado (algo como `http://hello-xxxxx.178.238.227.50.sslip.io`) — sslip.io resuelve cualquier `*.<ip>.sslip.io` a esa IP, perfecto sin DNS propio.
5. Deploy.

- [x] **Step 9.2: Esperar deploy + abrir URL**

Cuando esten los logs en verde (~30s), abre la URL generada. Debe verse pagina `nginxdemos/hello` con hostname e IP.

- [x] **Step 9.3: Borrar despues de validar**

En el recurso → Settings → Delete. Confirma. Borra tambien el proyecto `sandbox` si quieres limpio.

**Criterio exito:** deploy automatico funciona end-to-end. Coolify + Traefik + Docker = operativos.

---

## Task 10 — Documentar + commit

**Files:**
- Modify: `memory/reference_vps_contabo.md`
- Create: `memory/reference_coolify_admin.md`
- Modify: `plans/ROADMAP.md`
- Modify: `agent-comms.md`
- Modify: `plans/DECISIONS.md` (anadir ADR-007 dejando DNS para Fase 0b)

- [x] **Step 10.0: PRIMERO bloquear secretos en .gitignore (antes de crear cualquier archivo con credenciales)**

En local, raiz repo:
```powershell
Add-Content -Path .gitignore -Value "`nmemory/reference_coolify_admin.md"
git status
```
Verifica que `.gitignore` aparece como modificado. **No avances** sin este paso — si creas el archivo de credenciales antes y haces `git add memory/`, se commitea con secretos.

- [x] **Step 10.1: Actualizar `memory/reference_vps_contabo.md`** anadiendo seccion:

```markdown
## Estado tras Fase 0 (2026-05-17)

- Usuario admin: `iamelilla` (sudo NOPASSWD, grupo docker)
- Root SSH: deshabilitado
- Password SSH: deshabilitado
- Clave SSH local: `C:\Users\Fernando Prada\.ssh\id_ed25519_iamelilla` (passphrase en gestor)
- Alias SSH: `ssh ia-melilla`
- UFW: 22/80/443/8000 ALLOW, resto DENY
- fail2ban: jail sshd (5/10m/1h)
- Coolify: v4.x.x en `http://178.238.227.50:8000`
- Docker: instalado por Coolify
```

- [x] **Step 10.2: Crear `memory/reference_coolify_admin.md`** (NO commitear si contiene secretos; mantener fuera de git si va el password — usar `.gitignore`):

```markdown
---
name: reference_coolify_admin
description: Credenciales y URL del panel Coolify (LOCAL, NO commitear)
type: reference
---

# Coolify Admin

- URL panel: http://178.238.227.50:8000 (temporal, hasta DNS Fase 0b)
- Email admin: <el que usaste>
- Password: <gestor de passwords>
- Version: <anota la que ves en el panel>

## Acceso

- SSH al VPS: `ssh ia-melilla`
- Re-deploy desde panel: Projects → Recurso → Redeploy
```

(Recordatorio: el `.gitignore` ya bloquea este archivo desde Step 10.0. Si te lo saltaste, vuelve a hacerlo AHORA antes del `git add`.)

- [x] **Step 10.3: Actualizar `plans/ROADMAP.md`** marcando como `[x]` las tareas Fase 0 completadas:

```markdown
- [x] Hardening basico SSH (deshabilitar root login con password, fail2ban, ufw) — 2026-05-17
- [x] Instalar Coolify (`curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash`) — 2026-05-17
- [x] Apuntar `iamelilla.com` y `panel.iamelilla.com` al VPS (registros A) — **Fase 0b**
- [x] Configurar SSL automatico con Let's Encrypt via Traefik — **Fase 0b**
- [x] Crear primer despliegue de prueba (`hello-world` en Coolify) — 2026-05-17
```

Anadir nueva subseccion:

```markdown
## Fase 0b — DNS + SSL (cuando estemos listos para publicar)

- [x] Decidir registrar y migrar DNS (DonDominio/Cloudflare/Namecheap/GoDaddy)
- [x] Crear registros A:
  - `panel.iamelilla.com` → 178.238.227.50
  - `iamelilla.com` + `www` → 178.238.227.50 (cuando Fase 1 frontend lista — antes rompe web actual)
- [x] Configurar dominio en Coolify para panel y para recursos
- [x] Verificar SSL Let's Encrypt automatico funciona
- [x] Cerrar puerto 8000 en UFW (panel solo accesible por subdominio HTTPS)
- [x] Definir email LE
```

- [x] **Step 10.4: Anadir ADR-007 a `plans/DECISIONS.md`:**

```markdown
## ADR-007: Diferir DNS + SSL a Fase 0b

- **Fecha**: 2026-05-17
- **Estado**: Aceptada
- **Contexto**: `iamelilla.com` apunta hoy al hosting WordPress productivo. Cambiar DNS antes de tener frontend nuevo rompe la web actual. El panel Coolify es accesible por IP+puerto sin problema durante desarrollo.
- **Decision**: Fase 0 termina con Coolify accesible via `http://178.238.227.50:8000`. DNS y SSL se hacen en Fase 0b, justo antes de publicar el frontend nuevo (Fase 1 lista).
- **Consecuencias**:
    - Puerto 8000 abierto temporalmente en UFW; se cierra en Fase 0b cuando exista `panel.iamelilla.com` con HTTPS.
    - Despliegues de prueba durante desarrollo usan `*.178.238.227.50.sslip.io` (sin DNS propio).
    - Registrar dominio se confirma en Fase 0b.
```

- [x] **Step 10.5: Registrar en `agent-comms.md`:**

```markdown
## [2026-05-17] [PM → infra] Fase 0 completada

Tarea: hardening SSH + UFW + fail2ban + Coolify install + test deploy.
Estado: DONE
Notas: Ubuntu 24.04.4 LTS, usuario `iamelilla`, root SSH cerrado, Coolify v4 en `http://178.238.227.50:8000`. DNS + SSL aplazados a Fase 0b por ADR-007.
```

- [x] **Step 10.6: Commit (rama nueva para revision)**

```powershell
git checkout -b claude/fase-0-infra
git add memory/reference_vps_contabo.md plans/ROADMAP.md plans/DECISIONS.md plans/2026-05-17-fase-0-infra-coolify.md agent-comms.md .gitignore
git commit -m "feat(infra): completar Fase 0 — hardening VPS + Coolify v4

- Usuario sudo iamelilla con SSH key ed25519
- sshd: root no, password no, AllowUsers iamelilla, MaxAuthTries 3
- UFW: 22/80/443/8000 ALLOW
- fail2ban jail sshd (5/10m/1h)
- Coolify v4 instalador automatico, accesible via http://178.238.227.50:8000
- ADR-007: DNS+SSL diferidos a Fase 0b
- Documentado en memory/reference_vps_contabo.md"
```

**Criterio exito:** memoria + ROADMAP + DECISIONS + agent-comms actualizados, branch `claude/fase-0-infra` con commit limpio, secretos fuera de git (ignorado `memory/reference_coolify_admin.md`).

---

## Verificacion final (Fase 0)

Antes de cerrar la fase, validar de cabo a rabo:

- [x] `ssh root@178.238.227.50` falla con `Permission denied (publickey)`
- [x] `ssh ia-melilla` funciona (con passphrase de clave)
- [x] `sudo ufw status` muestra 22/80/443/8000 ALLOW
- [x] `sudo fail2ban-client status sshd` muestra jail activo
- [x] `sudo docker ps` muestra contenedores Coolify corriendo
- [x] `http://178.238.227.50:8000` carga panel Coolify y login admin funciona
- [x] Deploy de prueba `nginxdemos/hello` funciono y se borro
- [x] Branch `claude/fase-0-infra` commiteada
- [x] VNC Contabo (5.189.135.210:63036) sigue accesible como plan B

Si todos `[x]`: Fase 0 cerrada. Si alguno `[ ]`: invocar `/verify` para diagnosticar.

---

## Plan B si te quedas fuera por SSH

1. Abrir VNC Contabo desde panel cliente Contabo (5.189.135.210:63036)
2. Login como root con password Contabo original
3. Revertir hardening:
   ```bash
   rm /etc/ssh/sshd_config.d/99-hardening.conf
   systemctl restart ssh
   ```
4. Volver a SSH normal y diagnosticar.

---

**Autor:** PM Coordinator IA Melilla v2
**Fecha:** 2026-05-17
**Estado:** EJECUTADO — Fase 0 completada 2026-05-17. Ver `agent-comms.md` y `memory/reference_vps_contabo.md`.
