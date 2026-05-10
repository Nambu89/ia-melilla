# IA Melilla v2 — Roadmap

> Fases del proyecto. Estado actualizado por el PM Coordinator.
>
> Convenciones: `[ ]` pendiente | `[~]` en progreso | `[x]` completado | `[!]` bloqueado

## Estado del Proyecto: Mayo 2026 (Sesion 0 — bootstrap)

Sistema multi-agente inicializado. Repo en `https://github.com/Nambu89/ia-melilla.git`. Stack confirmado: FastAPI + SQLite + OpenAI + React 18 + Tailwind v4 + shadcn + anime.js v4 + Coolify.

**Pendiente inmediato**: arrancar Fase 0 (infra Coolify + dominio + SSL).

---

## Fase 0 — Setup Infraestructura

Objetivo: VPS preparado, Coolify instalado, dominio + SSL operativos.

- [ ] Confirmar version Ubuntu del VPS (`ssh root@178.238.227.50 "cat /etc/os-release"`)
- [ ] Si NO es Ubuntu LTS (20.04 / 22.04 / 24.04): planear instalacion manual de Coolify
- [ ] Hardening basico SSH (deshabilitar root login con password, fail2ban, ufw)
- [ ] Instalar Coolify (`curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash`)
- [ ] Apuntar `iamelilla.com` y `panel.iamelilla.com` al VPS (registros A)
- [ ] Configurar SSL automatico con Let's Encrypt via Traefik
- [ ] Crear primer despliegue de prueba (`hello-world` en Coolify)
- [ ] Configurar backups manuales SQLite + uploads a S3-compatible
- [ ] Documentar credenciales y URLs en `memory/reference_infra.md`

**Bloqueadores potenciales**: version Ubuntu no LTS, dominio aun apuntando a hosting WordPress (necesita ventana migracion).

---

## Fase 1 — Frontend estatico (web publica)

Objetivo: web nueva con paginas publicas, sin demos aun. Migrar SEO de WordPress.

- [ ] Init `frontend/` con Vite + React 18 + TS + Tailwind v4
- [ ] Pegar `frontend/DESIGN.md` desde repo `Nambu89/awesome-design-md` (Linear)
- [ ] Configurar shadcn/ui base
- [ ] Instalar `animejs` v4
- [ ] Estructura paginas: Home (B2B + B2C separados), Servicios, Contacto, Blog (placeholder)
- [ ] Hero con anime.js (revisar si Claude Design genera prototipos)
- [ ] Footer con datos negocio (email, WhatsApp, Instagram, ubicacion)
- [ ] SEO basico (meta tags, OG, JSON-LD LocalBusiness Melilla)
- [ ] Migrar SEO desde WordPress (extraer URLs actuales, planificar redirects 301)
- [ ] Dockerfile frontend + despliegue Coolify
- [ ] Verificar Lighthouse > 90 en Performance/SEO/Accessibility

---

## Fase 2 — Backend base

Objetivo: FastAPI funcional, DB SQLite, endpoint leads + formulario contacto real.

- [ ] Init `backend/` con `uv init` + estructura `app/{api,core,models,schemas,repositories,services,protocols}`
- [ ] FastAPI app con lifespan (init DB)
- [ ] SQLModel + aiosqlite + alembic (o SQLModel migrate manual)
- [ ] Tabla `leads` (id, name, email, phone, message, source, created_at)
- [ ] Tabla `appointments` (id, lead_id, slot_start, slot_end, status, notes)
- [ ] Endpoint `POST /api/v1/leads` con rate limiting + validacion email
- [ ] Endpoint `POST /api/v1/contact` (form publico)
- [ ] Notificacion Telegram al recibir lead (`python-telegram-bot`)
- [ ] Email transaccional al recibir lead (Resend o SendGrid)
- [ ] Tests pytest cobertura >70% en services/repositories
- [ ] Dockerfile backend + despliegue Coolify
- [ ] CORS estricto (solo `iamelilla.com`)

---

## Fase 3 — Demos simples (monolito)

Demos: 1 (Asistente atencion), 2 (Captador leads), 4 (Generador contenido), 7 (Generador presupuestos), 10 (Notificador leads).

- [ ] Definir `Protocol` `Agent` (OpenAI client + system prompt + tools)
- [ ] Implementar `OpenAIClient` (impl `LLMClient` Protocol)
- [ ] Demo 1: chatbot widget web embebible (`/demos/asistente-atencion`)
- [ ] Demo 2: form + LLM extrae intent → guarda lead enriquecido
- [ ] Demo 4: form (tema, tono, plataforma) → genera 3 posts
- [ ] Demo 7: form (cliente, servicio, alcance) → presupuesto PDF
- [ ] Demo 10: integra demos 1+2 → notifica via Telegram + email
- [ ] Cada demo: pagina explicativa + widget interactivo + CTA contacto

---

## Fase 4 — Demos medias

Demos: 5 (Respondedor emails), 6 (Seguimiento post-venta), 8 (Soporte interno RAG), 9 (Agente sectorial).

- [ ] Demo 5: mailbox simulada (UI tipo bandeja) + LLM redacta respuestas
- [ ] Demo 6: secuencias programadas con FastAPI BackgroundTasks (sin Redis)
- [ ] Demo 8: RAG simple sobre PDFs subidos (chunks + embeddings + busqueda semantica)
- [ ] Demo 9: agente parametrizable por sector (clinica/restaurante/taller) con prompts especificos

---

## Fase 5 — Microservicio reservas (demo 3)

- [ ] Crear `services/reservas-api/` (FastAPI independiente)
- [ ] Integracion Google Calendar API (OAuth service account)
- [ ] Endpoint `POST /reservas/check-availability`
- [ ] Endpoint `POST /reservas/book` con validacion conflictos
- [ ] Subdominio `demos.iamelilla.com/reservas-api`
- [ ] Demo frontend en `/demos/reservas` que consume el microservicio

---

## Fase 6 — Blog y CMS ligero

- [ ] Decidir stack: MDX en repo / CMS headless (Sanity, Directus) / Ghost en contenedor — **PENDING DECISION**
- [ ] Migrar posts existentes desde WordPress
- [ ] Implementar listing + paginacion + busqueda
- [ ] RSS feed
- [ ] Sitemap.xml dinamico

---

## Fase 7 — Observabilidad y backups

- [ ] Plausible Analytics self-hosted (contenedor Coolify, GDPR-friendly)
- [ ] Logs estructurados (JSON con `structlog`)
- [ ] Sentry (opcional, free tier)
- [ ] Backups automaticos SQLite + uploads a S3-compatible (Backblaze B2 / Wasabi)
- [ ] Healthcheck endpoint `/health` + uptime monitor (UptimeRobot)
- [ ] Documentar runbook ante incidentes

---

## Fase Futura (post-MVP)

- [ ] Integracion WhatsApp Business (Meta Cloud API) como microservicio `services/whatsapp-bot/`
- [ ] Panel admin para ver leads y citas (auth basica)
- [ ] Multi-idioma (espanol + ingles + frances? — Melilla zona de paso)
- [ ] Pasarela de pagos para servicios particulares (Stripe)

---

**Ultima actualizacion:** 2026-05-10
