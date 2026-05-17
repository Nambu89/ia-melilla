# IA Melilla v2 — Roadmap

> Fases del proyecto. Estado actualizado por el PM Coordinator.
>
> Convenciones: `[ ]` pendiente | `[~]` en progreso | `[x]` completado | `[!]` bloqueado

## Estado del Proyecto: Mayo 2026 (Fase 0 cerrada)

Sistema multi-agente inicializado. Repo en `https://github.com/Nambu89/ia-melilla.git`. Stack confirmado: FastAPI + SQLite + OpenAI + React 18 + Tailwind v4 + shadcn + anime.js v4 + Coolify.

**VPS operativo** con Coolify v4 accesible en `http://178.238.227.50:8000`. SSH hardened, UFW + fail2ban activos. Deploy de prueba validado.

**Pendiente inmediato**: arrancar Fase 1 (frontend estatico). DNS + SSL diferidos a Fase 0b (ver ADR-007).

---

## Fase 0 — Setup Infraestructura

Objetivo: VPS preparado, Coolify instalado.

- [x] Confirmar version Ubuntu del VPS — **24.04.4 LTS Noble Numbat** (2026-05-17)
- [x] Si NO es Ubuntu LTS (20.04 / 22.04 / 24.04): planear instalacion manual de Coolify — N/A, es LTS
- [x] Hardening basico SSH (usuario `iamelilla`, root SSH bloqueado, password SSH bloqueado, UFW 22/80/443/8000, fail2ban 5/10m/1h) — 2026-05-17
- [x] Instalar Coolify v4 (reinstalado como root tras intento fallido via `sudo` desde non-root) — 2026-05-17
- [x] Configurar SSH key Coolify → host (publica Coolify a `~iamelilla/.ssh/authorized_keys`) — 2026-05-17
- [x] **ACL `/data/coolify`**: `setfacl -R -m u:iamelilla:rwx` + default ACL, para que iamelilla SSH user pueda escribir aunque dirs sean `9999:root 700` — 2026-05-17
- [x] Entrar al panel Coolify + setup wizard completado con server "This Machine" + user `iamelilla` — 2026-05-17
- [x] Crear primer despliegue de prueba (`nginxdemos/hello` via sslip.io) — DESPLEGADO OK 2026-05-17
- [x] Documentar credenciales y URLs en `memory/reference_coolify_admin.md` (local, gitignored) — 2026-05-17

**Fase 0 CERRADA**. Receta operativa completa en `memory/reference_coolify_localhost_setup.md`.

**Bloqueadores resueltos (con sus lecciones)**:
- Ubuntu LTS confirmado (24.04.4)
- Install Coolify via `sudo bash` desde iamelilla creo install corrupto (UIDs mismatch + DB password rot). Reinstalado como root via `sudo -i` — limpio.
- SSH wizard: publica Coolify a `authorized_keys` de iamelilla; wizard user `iamelilla`.
- Deploy seguia fallando `tee Permission denied` aun con install limpio: `/data/coolify` 700 9999:root, iamelilla no en grupo. Fix definitivo: ACLs (`setfacl` con default ACL).

---

## Fase 0b — DNS + SSL (cuando estemos listos para publicar)

Objetivo: dominio operativo + HTTPS automatico, sin tirar la web WordPress actual.

- [ ] Decidir registrar y migrar DNS (DonDominio / Cloudflare / Namecheap / GoDaddy)
- [ ] Crear registros A:
  - `panel.iamelilla.com` → 178.238.227.50 (primero, no rompe nada)
  - `iamelilla.com` + `www` → 178.238.227.50 (solo cuando Fase 1 frontend este lista)
- [ ] Configurar dominio en Coolify para panel y para recursos
- [ ] Verificar SSL Let's Encrypt automatico funciona
- [ ] Cerrar puerto 8000 en UFW (panel solo via subdominio HTTPS)
- [ ] Definir email Let's Encrypt
- [ ] Configurar backups SQLite + uploads a S3-compatible (Backblaze B2 / Wasabi)

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

**Ultima actualizacion:** 2026-05-17
