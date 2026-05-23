# Panel de administración del blog — IA Melilla

Esta carpeta contiene la configuración de **Sveltia CMS**, el panel
visual para gestionar los artículos del blog sin tocar código.

## Acceso

URL: `https://iamelilla.com/admin/`

Login con cuenta de GitHub que tenga permisos sobre el repositorio
`Nambu89/ia-melilla`.

## Archivos

- `index.html` — carga el script de Sveltia CMS desde unpkg.
- `config.yml` — schema de campos del post, colección, backend GitHub.

## Cómo funciona

1. El editor entra en `/admin/` y se autentica con GitHub OAuth.
2. Crea o edita un post mediante el editor visual.
3. Al pulsar "Publicar", Sveltia hace un commit a `main` con el archivo
   `.md` actualizado en `frontend/content/blog/`.
4. Coolify detecta el push y redespliega el frontend automáticamente.
5. El post nuevo aparece en `https://iamelilla.com/blog`.

## Backend de autenticación

El backend OAuth corre en un Cloudflare Worker independiente
(`https://sveltia-cms-auth.ia-melilla.workers.dev`).

Ver `docs/blog-admin.md` para los pasos de instalación del worker y
de la GitHub OAuth App.

## Modificaciones del schema

Si quieres cambiar campos del post (añadir tipo, cambiar widget, etc.),
edita `config.yml` y compara con la documentación oficial:
<https://decapcms.org/docs/configuration-options/>

Sveltia CMS es compatible con el schema de Decap.
