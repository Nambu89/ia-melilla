# Panel de administración del blog — IA Melilla

Esta carpeta contiene la configuración de **Sveltia CMS**, el panel
visual para gestionar los artículos del blog sin tocar código.

## Acceso

URL: `https://iamelilla.com/admin/`

El login es con un **Personal Access Token de GitHub**, no con OAuth: no
hace falta ningún servidor de autenticación. En la pantalla de acceso,
pulsa **Sign In Using Access Token** y pega el token.

El token se crea aquí, con permiso **Contents: Read and write** sobre
`Nambu89/ia-melilla`:

<https://github.com/settings/personal-access-tokens/new?name=Sveltia+CMS&contents=write>

El token se guarda solo en el navegador de quien edita. Si se pierde el
equipo, se revoca desde *GitHub → Settings → Developer settings →
Personal access tokens*.

## Archivos

- `index.html` — carga el script de Sveltia CMS desde unpkg (versión fijada).
- `config.yml` — schema de campos del post, colección, backend GitHub.

## Cómo funciona

1. El editor entra en `/admin/` y pega su token de GitHub.
2. Crea o edita un post mediante el editor visual.
3. Al pulsar "Publicar", Sveltia hace un commit a `main` con el archivo
   `.md` actualizado en `frontend/content/blog/`.
4. Coolify detecta el push y redespliega el frontend automáticamente.
5. El post nuevo aparece en `https://iamelilla.com/blog`.

Las imágenes que se suban desde el editor se commitean en
`frontend/public/blog-media/` y quedan servidas en `/blog-media/...`,
también tras el redespliegue.

## Dar acceso a otra persona

Necesita cuenta de GitHub y permiso de escritura sobre el repositorio
(*Settings → Collaborators*). Después genera su propio token con el
enlace de arriba.

## Modificaciones del schema

Si quieres cambiar campos del post (añadir tipo, cambiar widget, etc.),
edita `config.yml` y compara con la documentación oficial:
<https://sveltiacms.app/en/docs/>

Sveltia CMS es compatible con el schema de Decap:
<https://decapcms.org/docs/configuration-options/>
