# Sveltia CMS — Setup de OAuth y backend de autenticación

Para que `iamelilla.com/admin/` permita login con GitHub se necesitan **dos cosas externas** al repositorio:

1. Una **GitHub OAuth App** (gratuita, en tu cuenta personal o de la organización).
2. Un **Cloudflare Worker** que actúa como puente OAuth entre Sveltia CMS y GitHub.

Tiempo total: ~20-30 minutos la primera vez. Después solo se toca si cambian secretos o dominio.

---

## 1. Crear la GitHub OAuth App

1. Entra en <https://github.com/settings/developers> (o en la sección _Settings → Developer settings → OAuth Apps_ de la organización si es un repo de organización).
2. Click en **New OAuth App**.
3. Rellena:
   - **Application name**: `IA Melilla CMS` (visible para el usuario en el flujo OAuth).
   - **Homepage URL**: `https://iamelilla.com`
   - **Application description** (opcional): `Panel de edición del blog de iamelilla.com`.
   - **Authorization callback URL**: `https://sveltia-cms-auth.ia-melilla.workers.dev/callback` (el subdominio del worker que crearemos en el paso 2).
4. Click **Register application**.
5. En la pantalla siguiente:
   - Copia el **Client ID** (lo necesitarás en el paso 2).
   - Click **Generate a new client secret**. Copia el **Client Secret** inmediatamente — solo se muestra una vez.
6. Si quieres logo, sube uno (opcional).

Deja la pestaña abierta o guarda los dos valores en un gestor de contraseñas. **El secret no se vuelve a mostrar.**

---

## 2. Desplegar el Cloudflare Worker de autenticación

Sveltia CMS necesita un endpoint backend que intercambie el `code` OAuth de GitHub por un token. El equipo de Sveltia mantiene un worker oficial: `sveltia-cms-auth`.

### Prerrequisitos

- Cuenta gratuita en Cloudflare: <https://dash.cloudflare.com/sign-up>
- Node.js 18+ instalado localmente (solo para usar `wrangler`).

### Pasos

1. **Instala Wrangler** (CLI de Cloudflare) globalmente:
   ```bash
   npm install -g wrangler
   ```

2. **Clona el repo del worker** en una carpeta temporal:
   ```bash
   git clone https://github.com/sveltia/sveltia-cms-auth.git
   cd sveltia-cms-auth
   ```

3. **Login en Cloudflare** desde la CLI (abre navegador):
   ```bash
   wrangler login
   ```

4. **Configura el `wrangler.toml`** del proyecto (créalo o edita) con:
   ```toml
   name = "sveltia-cms-auth"
   main = "src/index.ts"
   compatibility_date = "2024-08-01"
   workers_dev = true

   [vars]
   ALLOWED_DOMAINS = "iamelilla.com"
   ```

5. **Guarda los secrets** (Client ID y Client Secret de GitHub) como variables de entorno cifradas en Cloudflare:
   ```bash
   wrangler secret put GITHUB_CLIENT_ID
   # pega el Client ID y enter

   wrangler secret put GITHUB_CLIENT_SECRET
   # pega el Client Secret y enter
   ```

6. **Despliega el worker**:
   ```bash
   wrangler deploy
   ```
   Cloudflare te dará una URL del estilo `https://sveltia-cms-auth.<tu-subdominio>.workers.dev`. Cópiala.

7. **Subdominio personalizado (opcional)**:
   Si quieres que sea `https://sveltia-cms-auth.ia-melilla.workers.dev`, ve a Cloudflare → Workers & Pages → tu worker → Settings → Triggers → Custom Domains. Añade el dominio (necesita que `workers.dev` o tu DNS lo permita).

8. **Actualiza el callback URL en GitHub OAuth App** si la URL final del worker es distinta a la que pusiste en el paso 1.4. Vuelve a <https://github.com/settings/developers>, edita la app y pega la URL real.

9. **Actualiza `frontend/public/admin/config.yml`** con la URL real del worker en `backend.base_url`. Por defecto está en:
   ```yaml
   backend:
     base_url: https://sveltia-cms-auth.ia-melilla.workers.dev
   ```

---

## 3. Verificación

1. Despliega la rama a producción (merge a `main` → Coolify autodespliega).
2. Abre `https://iamelilla.com/admin/` en el navegador.
3. Pulsa **Login with GitHub**.
4. GitHub pedirá autorización a la app `IA Melilla CMS`. Acéptala.
5. Si todo va bien, entrarás al editor visual.

### Si falla
- **"Redirect URI mismatch"**: el callback URL del OAuth App no coincide con la del worker. Edita y guarda en GitHub.
- **"Invalid client secret"**: regenera el secret en GitHub y guárdalo otra vez con `wrangler secret put GITHUB_CLIENT_SECRET`.
- **CORS errors**: verifica que `ALLOWED_DOMAINS` del worker incluye `iamelilla.com`.

---

## 4. Dar acceso a otros editores (ej. tío Joaquín)

Sveltia CMS otorga acceso al usuario que se autentica con GitHub si éste tiene permisos de **escritura** sobre el repositorio `Nambu89/ia-melilla`.

1. Pide al editor que cree una cuenta gratuita en <https://github.com/signup>.
2. En el repositorio del proyecto en GitHub: **Settings → Collaborators → Add people** y añádelo con permisos `Write`.
3. El editor recibe un email de invitación. Tras aceptarla, ya puede entrar en `/admin/` con su cuenta.

> **Nota de seguridad**: con permiso `Write` el editor también puede hacer push directo al repo. Si quieres restringirlo a solo el blog, configura **branch protection rules** en `main` o usa una _fork-based collaboration_ (más avanzado).

---

## 5. Coste

- GitHub OAuth App: **gratis**.
- Cloudflare Worker: **gratis** (plan free incluye 100.000 requests/día — sobra de sobra para un panel de blog).
- Sveltia CMS: **gratis** (open-source MIT).

Total: 0 €/mes.
