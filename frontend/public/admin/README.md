# Panel de administración del blog — IA Melilla

Esta carpeta contiene la configuración de **Sveltia CMS**, el panel
visual para gestionar los artículos del blog sin tocar código.

## Acceso

URL: `https://iamelilla.com/admin/`

El login es con un **Personal Access Token de GitHub**, no con OAuth: no
hace falta ningún servidor de autenticación. Es el único botón de la
pantalla de acceso, **Iniciar sesión con un token de acceso**.

Qué token hace falta depende de quién entra, y **el enlace que ofrece el
diálogo solo vale para el dueño del repositorio**:

- **Nambu89**, dueño de `Nambu89/ia-melilla`: el enlace del propio
  diálogo, que abre la página de token *fine-grained* con el permiso
  **Contents: Read and write** preseleccionado.
- **Cualquier otra persona colaboradora**: necesita un token
  **classic**, no vale el *fine-grained*. GitHub solo da escritura sobre
  repositorios públicos ajenos a los classic. Se crea en
  <https://github.com/settings/tokens/new?scopes=public_repo&description=Sveltia+CMS>
  (ámbito `public_repo`; si el repositorio pasara a privado, `repo`).

El token se guarda solo en el navegador de quien edita. Si se pierde el
equipo, se revoca desde *GitHub → Settings → Developer settings →
Personal access tokens*.

El panel sale en el idioma del navegador; Sveltia CMS no admite fijarlo
desde `config.yml`.

## Archivos

- `index.html` — carga el script de Sveltia CMS desde unpkg (versión fijada: 0.196.0).
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

1. Cuenta de GitHub.
2. Invitación como colaborador con permiso de escritura
   (*Settings → Collaborators*). **Las invitaciones de GitHub caducan a
   los 7 días**: si no la acepta a tiempo hay que reenviarla. Sin ser
   colaborador, el panel rechaza el login con *"Not a collaborator of
   the repository"*.
3. Su propio token **classic**, con el enlace de la sección Acceso.

## Modificaciones del schema

Si quieres cambiar campos del post (añadir tipo, cambiar widget, etc.),
edita `config.yml` y compara con la documentación oficial:
<https://sveltiacms.app/en/docs/>

Sveltia CMS lee el schema de Decap, pero no admite todas sus opciones
—ignora `locale`, por ejemplo—. Ante la duda, manda la suya:
<https://decapcms.org/docs/configuration-options/>
