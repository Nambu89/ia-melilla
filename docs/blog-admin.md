# Cómo escribir y publicar artículos en el blog de IA Melilla

Esta guía está pensada para el editor del blog (titular, redactores). **No necesitas tocar código** ni saber programar. El sistema funciona con un panel visual estilo WordPress.

## Acceso al panel

1. Abre <https://iamelilla.com/admin/> en tu navegador.
2. Pulsa **Login with GitHub**.
3. Introduce tu cuenta de GitHub. La primera vez tendrás que **autorizar la app "IA Melilla CMS"** (es la única vez).
4. Verás el panel con la lista de artículos publicados.

> Si no tienes acceso aún, pide al administrador del repo que te añada como colaborador con permisos de escritura en GitHub.

## Crear un artículo nuevo

1. Click en **+ New Artículo** (botón arriba a la derecha).
2. Rellena los campos en el formulario:

   | Campo | Qué poner |
   |---|---|
   | **Slug (URL)** | URL del post sin tildes. Ej: `chatbots-whatsapp-melilla`. Es lo que va detrás de `/blog/`. |
   | **Título** | Título principal. Aparecerá como H1 en la página. Ej: *"Chatbots de WhatsApp para Melilla"*. |
   | **Descripción breve** | 1-2 frases que resuman el post. Aparece en la tarjeta del listado y en buscadores (SEO). Entre 40 y 200 caracteres. |
   | **Fecha de publicación** | Día en que se publica. Por defecto pone hoy. |
   | **Minutos de lectura** | Estimación. ~1 minuto por cada 200 palabras. |
   | **Tags** | Etiquetas (3-5 máximo). Ej: `WhatsApp`, `Pymes`, `Automatización`. Pulsa Enter tras cada tag. |
   | **Imagen de portada → Texto alternativo** | Descripción de la imagen (accesibilidad y SEO). |
   | **Imagen de portada → Imagen** | Sube una foto (JPG/PNG/WEBP). Si no tienes, déjalo vacío y elige un placeholder. |
   | **Imagen de portada → Placeholder** | Solo si no subes imagen. Elige el gradiente que mejor pegue con el tema del post. |
   | **Cuerpo del artículo** | El contenido principal. Editor visual con botones para negrita, enlaces, títulos, listas. Ver abajo. |

3. Click **Save** (arriba a la derecha) para guardar como borrador.
4. Click **Publish** → **Publish now** para publicarlo. Esto hace dos cosas:
   - Guarda el post en el repositorio de GitHub como un archivo `.md`.
   - Dispara un nuevo build de la web (Coolify lo detecta y redespliega en ~2 minutos).
5. Tras ~2 min, el post estará visible en `https://iamelilla.com/blog/<slug>`.

## Editar el cuerpo del artículo

El editor visual funciona como un Word básico. Usa los botones de la barra:

| Botón | Hace |
|---|---|
| **B** | Negrita (`**texto**`). Úsalo para resaltar palabras clave SEO. |
| *I* | Cursiva. |
| 🔗 Link | Insertar enlace. Pega la URL. Los enlaces externos se abren en nueva pestaña. |
| **H2** | Sección principal. Úsalo para los apartados grandes del post (ej. "¿Por qué importa?"). |
| **H3** | Subsección. Para subdividir un H2 si hace falta. |
| **❝** Quote | Cita resaltada. **La primera cita del post se renderiza como copete en cursiva con borde azul.** Útil para abrir el artículo con una frase de gancho. |
| **• Lista** | Lista con viñetas. |
| **1. Lista** | Lista numerada (pasos). |
| 🖼️ Imagen | Insertar imagen dentro del cuerpo. |

### Buenas prácticas SEO

- **Usa la keyword principal en el título, en el primer H2 y en el cuerpo varias veces** (ej. "inteligencia artificial Melilla").
- **Pon la keyword en negrita** las primeras 2-3 veces que aparezca.
- **Enlaza a otros posts del blog y a páginas de la web** (ej. `/demos/ia-fiscal-melilla`).
- **Mete una imagen cada 300-500 palabras** para romper el muro de texto.
- **Mínimo 600 palabras por post** (los de menos no posicionan).

## Editar un artículo existente

1. En el panel `/admin/`, click sobre el artículo en la lista.
2. Modifica lo que necesites.
3. Click **Save** y luego **Publish** → **Publish now**.
4. Coolify redespliega y los cambios estarán visibles en ~2 minutos.

## Borrar un artículo

1. Abre el artículo en el panel.
2. Click **Delete entry** (abajo del todo).
3. Confirma. Se borra del repo y desaparece de la web en el próximo despliegue.

> Cuidado: borrar es permanente. El historial queda en git, pero recuperar requiere acción del desarrollador.

## Vista previa

Sveltia CMS no tiene preview en vivo (es estático). Para ver cómo queda el post real:

1. Tras publicar, espera ~2 minutos a que Coolify redesplíegue.
2. Abre `https://iamelilla.com/blog/<slug>` en otra pestaña.

Si quieres preview local antes de publicar, pídeselo al desarrollador (`npm run dev` y abre `localhost:5173/blog/<slug>`).

## Cuándo pedir ayuda al desarrollador

- Si quieres añadir un tipo de bloque nuevo al editor (tablas, código, vídeo, embed Twitter…).
- Si quieres cambiar la estructura del listado del blog o el diseño de la tarjeta.
- Si quieres categorías además de tags, o post relacionados manuales, o autor por post.
- Si el editor da error o no carga.
- Si quieres restringir quién puede publicar (workflows de aprobación).

## Tip rápido: estructura recomendada de un post SEO

```
> [Frase corta gancho con la keyword principal en negrita]

## ¿Por qué importa [keyword]?
[2-3 párrafos contestando]

## Aplicaciones / Beneficios / Cómo funciona
- Lista con bullets
- Cada uno con negrita al inicio

[IMAGEN cada 300-500 palabras]

## Ejemplo / Caso real
[Párrafo con caso concreto local]

## Cómo empezar / Pasos
1. Paso 1
2. Paso 2
3. Paso 3

## Conclusión
[Cierre con CTA suave: "te ayudamos en..."]
```

Tiempo medio para un post nuevo: 30-60 min escribiendo + 5 min publicando.
