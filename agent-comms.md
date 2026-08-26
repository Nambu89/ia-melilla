# Agent Communications — IA Melilla v2

> Canal de comunicacion inter-agente. El PM Coordinator delega tareas aqui y los agentes especialistas reportan estado.
>
> **Formato entrada:**
> ```
> ## [YYYY-MM-DD HH:MM] [PM → agent-name] {titulo}
> Tarea: ...
> Archivos: ...
> Resultado esperado: ...
> Estado: PENDING | IN_PROGRESS | DONE | BLOCKED
> ```

---

## [2026-08-26 12:30] [PM → frontend-dev] SEO: los tres ficheros de Joaquin y lo que aparecio al aplicarlos
Estado: **DONE** — PR #26, rama `claude/seo-llms-sitemap`, 2 commits.

Joaquin mando `llms.txt`, `sitemap.xml` y `robots.txt` el 2026-06-08. Llevaban
casi tres meses sin aplicarse. Se recuperaron del correo (MIME en crudo) y
**ninguno se aplico tal cual**, porque al compararlos aparecio esto:

**El sitemap anunciaba `/particulares` y `/portafolio`, que no existen** en
`routes.tsx`. Al ser una SPA con fallback, devolvian **HTTP 200 con la pagina de
404**: soft 404. Un curl al codigo de estado no lo detecta — hay que contrastar
contra el router. Faltaban ademas `/terminos`, `/transparencia-ia` y los dos
posts del blog.

**Quitarlas del sitemap no bastaba**: quien ya las tiene indexadas sigue
pidiendolas. La 404 pasa a `noindex, follow`.

**`/cliente/*` era indexable**: no esta en el sitemap, pero el menu enlaza
"Acceso clientes". Ahora lleva `X-Robots-Tag` por cabecera de nginx, no por meta
en React — el rastreador que no ejecuta JS nunca veria la meta.

**TRAMPA DE NGINX, para que no se repita**: `try_files` (el fallback de la SPA)
es una **redireccion interna**. Nginx vuelve a elegir `location`, cae en
`location /` y **descarta los `add_header` del bloque de origen**. La cabecera se
pierde sin ningun aviso; solo se ve midiendo con un contenedor real. Y al
resolverlo con un `add_header` en `location /`, ese bloque **deja de heredar** las
tres cabeceras de seguridad del `server` — o sea todas las paginas HTML. Van
repetidas a proposito. Misma familia que el hallazgo del PR #25.

**Sitemap y `llms.txt` se generan ahora en el build**
(`frontend/scripts/seo-files-plugin.ts`) desde las rutas reales, y los posts se
leen con `parseFrontmatter`, el mismo parser del router, para que no puedan
divergir. **Publicar un post desde `/admin/` ya no exige tocar codigo.**

**14 correcciones de ortografia** en 11 ficheros. Entre ellas: el
`meta description` de Contacto sin tildes (**es lo que Google enseña**), un
**voseo rioplatense** en la demo ("Pregunta", no "Preguntá"), y "TU" en vez de
"TÚ" en el chat publico. Detalle: `content/contacto.ts` ya lo tenia bien — lo
que fallaba era una copia hardcodeada en la pagina.

**Pendiente de humano**: (1) confirmar si `lopentan` es la cuenta de Joaquin y
reenviarle la invitacion, caducada desde el 2026-06-15; (2) los 5 ficheros de
imagen del correo "logo y favicon", que siguen sin poner — el favicon es aun el
cuadrado azul con "IA" en texto; (3) decidir si `/sobre-nosotros` lleva `noindex`
mientras diga "Pagina en construccion".

**Deuda anotada, no tocada**: `npm run lint` roto en `main` (eslint 9 sin
`eslint.config.js`), y `ContactForm.test.tsx` busca `/Cuentanos/i` sin tildes —
la bandera `i` ignora mayusculas pero NO diacriticos, asi que quien arregle el
`Link` fuera de `Router` se dara contra un segundo muro acto seguido.


---

## [2026-08-23 12:15] [PM → frontend-dev] Panel /admin/ del blog usable de verdad
Estado: **DONE** — PR #25, rama `claude/blog-admin-token`, 5 commits.

**El diagnostico de partida era falso.** Se creia que `/admin/` no podia loguear
porque `config.yml` apuntaba `base_url` a un Cloudflare Worker que nunca se
desplego (`curl` -> HTTP 000). El Worker efectivamente no existe, pero **no
bloqueaba nada**: Sveltia CMS ofrece ademas login por token y ese boton llevaba
meses habilitado. Verificado contra el bundle real y con Playwright, tres
configuraciones en la misma corrida.

El bloqueador real: la invitacion de colaborador estaba **caducada** (GitHub las
caduca a los 7 dias) y la guia del repo solo contaba el camino del Worker.

**Lo que hay que saber para dar acceso a alguien**: el enlace que ofrece el
propio panel **solo sirve al dueno del repositorio**. GitHub no da escritura
sobre repositorios publicos ajenos a los tokens *fine-grained*, solo a los
*classic* con ambito `public_repo`. Un colaborador que siga el enlace del panel
crea un token que parece correcto y falla al guardar.

**Cambios**: `auth_methods: [token]`; Sveltia 0.164.0 -> 0.196.0 (panel en
espanol, enlace al token pintado, boton de OAuth fuera); `blog-media/.gitkeep`;
`Cache-Control` en `/admin/`; `view_filters` fuera (su etiqueta mentia); y **las
tres cabeceras de seguridad, que no llegaban a cuatro rutas** — un `add_header`
dentro de un `location` sustituye a los heredados del `server`, y el bloque de
assets casa `css|js|...`, o sea que todo el JS y el CSS se servian sin `nosniff`.

**Documentacion**: `docs/sveltia-cms-setup.md` BORRADO (mandaba montar
infraestructura innecesaria). `docs/blog-admin.md` con el acceso reescrito.
`.gitignore` ampliado: el repo es publico y tenia sin ignorar un fichero de
codigos de recuperacion de Coolify en la raiz.

**Limite de lo verificado**: nadie ha editado y guardado un post de verdad. Eso
exige un token con escritura y commitea en `main`. Pendiente para `qa-tester`.

**Pendiente de humano**: reenviar la invitacion de colaborador (la de `lopentan`
del 2026-06-08 esta `expired: true`) y confirmar que esa cuenta es la de Joaquin
antes de darle escritura sobre lo que despliega Coolify.


---

## [2026-05-10] [Setup] Inicializacion del proyecto

Tarea: copiar y adaptar sistema multi-agente desde TaxIA → IA Melilla v2.
Estado: DONE
Notas: estructura `.claude/`, agentes, comandos, plans/, memory/ creados. Git inicializado con remote `https://github.com/Nambu89/ia-melilla.git`.

---

## [2026-05-17] [PM → infra] Fase 0 — Hardening + Coolify (COMPLETADA, con incidencias resueltas)

Tarea: hardening VPS Contabo + UFW + fail2ban + Coolify install + wizard.
Estado: DONE (deploy de prueba PENDIENTE — wizard recien superado)
Notas:
- Ubuntu 24.04.4 LTS Noble Numbat, kernel 6.8.0-117 actualizado.
- Usuario sudo `iamelilla` con clave SSH ed25519 (NOPASSWD sudo, grupo docker).
- sshd hardened: `/etc/ssh/sshd_config.d/00-hardening.conf` (PermitRootLogin no, PasswordAuthentication no, AllowUsers iamelilla, MaxAuthTries 3).
- UFW: 22/80/443/8000 ALLOW IN, resto DENY.
- fail2ban jail sshd activo (5/10m/1h).
- Coolify v4.0.0 (helper/realtime 1.0.13, Postgres 15-alpine, Redis 7-alpine) en `http://178.238.227.50:8000`. Cuenta admin creada.
- Setup wizard "This Machine" superado con user `iamelilla` (NO root, NO typo `aimelilla`). Public key Coolify anadida a `~iamelilla/.ssh/authorized_keys`.
- DNS + SSL diferidos a Fase 0b por ADR-007.
- Credenciales Coolify en `memory/reference_coolify_admin.md` (gitignored, local).

### Incidencias resueltas (timeline)

1. **`coolify-helper:1.0.13` pull fail durante install** → resuelto, origino [[feedback_research_before_fix]].
2. **CLAIM FALSO previo** (commit 084b7f4): se commiteo "Deploy validado" sin haberlo verificado. Corregido en este commit.
3. **Deploy `nginxdemos/hello` fallaba con `Permission denied` en tee `.env`**:
    - Causa raiz: install hecho via `sudo bash` desde `iamelilla` (UID 1000) → containers con `--user 1000`, mismatch con helper UID 9999. Docs Coolify: "non-root not fully supported".
    - Fix intentado fallido: `chown -R 9999:root` + `chmod 700` (no soluciona — Coolify backend sigue UID 1000 internamente).
    - Solucion: reinstalacion limpia (rm containers + network + volumes coolify-db/coolify-redis + mv /data/coolify) y reinstalar **como root** via `sudo -i`.
    - Origino [[feedback_install_as_root]].
4. **HTTP 500 panel tras reinstalacion** → causa: volumen Postgres `coolify-db` residual con password vieja. `docker volume rm coolify-db coolify-redis` + re-correr installer.
5. **`docker compose restart` falla con `soketi has neither image nor build`** → necesita ambos `docker-compose.yml` + `docker-compose.prod.yml`. Mejor usar installer (idempotente).
6. **Wizard `Permission denied (publickey)` SSH a `host.docker.internal`** → typo user `aimelilla`/`iamelilla` + falta publica Coolify en authorized_keys de iamelilla. Anadida y verificada con `sudo ssh -i /data/coolify/ssh/keys/id.root@host.docker.internal iamelilla@127.0.0.1`.

### Cierre Fase 0 — 2026-05-17 ~20:39

7. **Deploy `nginxdemos/hello` SEGUIA fallando** tras todas las correcciones anteriores. Causa raiz definitiva: Coolify "This Machine" hace SSH como `iamelilla`, pero `/data/coolify` es `9999:root 700`, e iamelilla (UID 1000) NO esta en grupo 9999/root → no puede entrar al dir → tee falla. Fix: **ACL POSIX** sobre `/data/coolify`:
   ```bash
   sudo apt install -y acl
   sudo setfacl -R -m u:iamelilla:rwx /data/coolify
   sudo setfacl -R -d -m u:iamelilla:rwx /data/coolify
   ```
   Default ACL (`-d`) hace que dirs nuevos hereden permisos para iamelilla. Mantiene seguridad (700 base + permisos extra solo para iamelilla via ACL).

8. **Deploy validado**: log final `Rolling update completed`. URL `*.178.238.227.50.sslip.io` responde nginx demo.

Memoria nueva: [[reference_coolify_localhost_setup]] (receta completa).

Estado final Fase 0: **CERRADA**.

Siguiente: Fase 1 frontend estatico.

---

## [2026-05-17] [Setup] MCP Playwright + skill web-recon instalados

Tarea: anadir browser automation para que PM pueda auditar `iamelilla.com` antes de Fase 1.
Estado: DONE
Notas:
- MCP `@playwright/mcp@latest` (Microsoft oficial) instalado scope local via `claude mcp add playwright npx @playwright/mcp@latest`. Verificado `claude mcp list` muestra `✓ Connected`.
- Skill custom `.claude/skills/web-recon/SKILL.md` creado con procedimiento para extraer estructura, paleta, tipografias, copy, SEO + generar brief para frontend-dev.
- Memoria: [[reference_mcp_playwright]] con receta install + maintenance.
- Listo para invocar cuando PM o usuario pida "auditar/inspeccionar web actual".

Siguiente: arrancar recon de iamelilla.com → brief → Fase 1 frontend.

---

---

## [2026-05-21 09:55] [PM → frontend-dev] Fase 2 — Wiring DemoIaFiscal ↔ backend Impuestify (PENDING)

Tarea: sustituir `DemoChatPlaceholder.tsx` por widget funcional conectado al backend Impuestify demo desplegado.
Archivos:
- `frontend/src/components/demo/DemoChatPlaceholder.tsx` → renombrar a `DemoChat.tsx`
- `frontend/src/hooks/useDemoChat.ts` (nuevo)
- `frontend/src/lib/apiClient.ts` (nuevo)
- `frontend/.env.example` (nuevo)
- `frontend/src/pages/DemoIaFiscal.tsx` (modificar)
- `frontend/src/components/demo/__tests__/useDemoChat.test.ts` (nuevo)

Backend desplegado: `http://g100ae8up9ehmq4w0mn9od97.178.238.227.50.sslip.io`
- Login: `POST /auth/login` → response `{user, tokens: {access_token, refresh_token, token_type}}` (token nested)
- Stream chat: `POST /api/ask/stream` Bearer JWT, body `{question:str(1-1000), conversation_id?, workspace_id?, k?}`
- Errores: 403 si subscription guard activo (fix commit 8ca8556 pendiente redeploy)

Estado: BLOCKED por redeploy backend pendiente (user opera Coolify)
Plan completo: `plans/2026-05-21-fase-2-demo-chat.md`
Plan-check: PENDING
Resultado esperado: chat funcional con login silencioso + streaming SSE + suggested questions + disclaimer permanente + retry UI. Build verde, tests pasan, PR a main.


---

## [2026-05-21 23:48] [PM smoke test] Backend issues detectados pre-Fase 2

Backend desplegado en `http://g100ae8up9ehmq4w0mn9od97.178.238.227.50.sslip.io` esta en commit `8ca8556` (subscription_guard bypass) pero NO incluye commits posteriores `8eec52c1` ni `af205b56` que arreglan el bug `name 'req' is not defined` en `chat_stream.py`.

Estado:
- `/health` → 200, confirma `subscriptions_enabled: false` ✓
- `/auth/login` → 200, devuelve `{user, tokens: {access_token, ...}}` ✓
- `/api/ask` (no-stream) → 200 funcional (RAG vacio: `chunks_found: 0`)
- `/api/ask/stream` → **500** `NameError: name 'req' is not defined` ✗

Tambien: RAG con `documents: 0, embeddings: 0, rag_initialized: false`. Backend devuelve "No encontré información relevante". Necesita ingest separado a Upstash Vector.

Acciones pendientes:
- Backend (user): redeploy a HEAD `af205b56` para que `/api/ask/stream` funcione
- Backend (user): ingest corpus Melilla a Upstash Vector — follow-up no bloquea Fase 2 frontend

Fase 2 frontend BLOCKED hasta `/api/ask/stream` devuelva 200.

---

## [2026-05-21 23:55] [PM update] Backend Fase 2 OK — proceed con plan original

Confirmacion del user:
- `/api/ask/stream` HTTP 200, SSE valido (sse_starlette format)
- Eventos verificados: `content` (multi-line data), `done` (data = JSON con conversation_id)
- Otros eventos posibles: `thinking`, `tool_call`, `tool_result`, `error`
- Bug minor backend (`warmup_service.py` strings residuales "Impuestify") NO bloquea Fase 2 — la marca correcta es **Fiscal IA Melilla**, el frontend gestiona disclaimer con marca correcta.

Plan ajustado a SSE format real:
- `consumeStream` reescrito para sse_starlette format (event blocks separados por blank line, multi-line data joined con `\n`)
- Tests SSE fixtures actualizados a CRLF + event/data lines
- Plan-checker findings (BLOCKERs + MAJORs + MINORs) ya resueltos
- Cero referencias a "Impuestify" en plan — backend es proyecto separado Fiscal IA Melilla

Delegando a frontend-dev (siguiente entrada).

---

## [2026-05-22 00:24] [frontend-dev → PM] Fase 2 — DemoChat DONE

Estado: DONE (subagent inicio, PM termino directo tras context drop subagent)
Branch: claude/fase-2-demo-chat
PR: https://github.com/Nambu89/ia-melilla/pull/1
Commits incluidos:
- 5dc6b85 apiClient wrapper + env vars
- 517cbd8 useDemoChat hook — login + SSE streaming + retry + 6 tests
- 26201dd DemoChat live widget + page wiring + 4 tests

Tests: 28/28 pass (13 nuevos: 3 apiClient + 6 useDemoChat + 4 DemoChat)
Bundle: 21.97 KB CSS (5.0 KB gzip) / 367 KB JS (117 KB gzip) — bajo umbral
Typecheck: 0 errors
Theme lint: 0 errors

Smoke test stream live verificado (curl):
- /auth/login → 200, devuelve {tokens: {access_token,...}} ✓
- /api/ask/stream → 200 sse_starlette format con eventos: thinking, content, done, : ping, : heartbeat
- Parser handles all event types correctly (thinking/ping/heartbeat ignored, content emitted, done terminates)
- Backend tarda >45s en generar (RAG vacio + LLM lento) pero frontend maneja streaming token-a-token sin problemas

Decisiones tomadas fuera del plan:
- Test bug: loginResponse reusado (Response body solo consumible una vez) → fix con factory makeLogin()
- TS strict narrowing: refactor a vars derivadas hasError + showEmptyState (más limpio que casts)
- scrollTo guard defensivo (jsdom no implementa scrollTo en Element)
- ChatBubble streaming check: extraido como const para evitar inline narrowing weirdness

Brand: "Fiscal IA Melilla" confirmado en disclaimer + bubble label "IA FISCAL". Cero ref a "Impuestify" en frontend code.

Follow-up registrados:
- frontend/CLAUDE.md dice React 18, repo tiene 19 (actualizar)
- Backend bug residual "Impuestify" en warmup_service.py (no bloquea Fase 2, user lo arregla aparte)
- Backend RAG vacio (0 docs/embeddings) — ingest pendiente (no Fase 2 frontend)
- scrollTo en cada chunk podria jankear con respuestas largas — debounce raf si se nota
- Refresh token auto-renewal post-1h TTL (out of scope MVP)

Verifier `/verify` queda pendiente — PM lo invoca tras review usuario.

---

## [2026-05-22 00:50] [verifier → PM] Fase 2 — VERIFIED (post-PR-merge)

Estado: VERIFIED
Commit verificado: a78c6b1 (merge PR #1)
Tests: 28/28 pass
Bundle: 117 KB JS gzip / 5 KB CSS gzip (bajo umbral 200 KB)
Typecheck: 0 errors
Theme lint: 0 errors

Verifier inicial reporto 3 fails — PM revalido manualmente:
- abortSignal: PASS funcional (ES6 shorthand `signal,` en apiClient.ts lines 29+71)
- .env.example: PASS, archivo tracked en 5dc6b85 (verifier corrio ls sin -a)
- backend smoke: PASS, /health + /auth/login devuelven 200 (verifier timeout transient)

Cero issues bloqueantes. Fase 2 cerrada.

Follow-ups pendientes (no bloquean):
- Backend warmup_service.py strings "Impuestify" residuales
- Backend RAG vacio — necesita ingest
- frontend/CLAUDE.md desactualizado React 18 → 19
- Plan acceptance criterion #6 mejor formulado como `grep -E "\bsignal\b"` para futuras revisiones
