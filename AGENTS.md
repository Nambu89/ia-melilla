# AGENTS.md — Instrucciones para agentes de codigo

> Este archivo es leido por agentes IA (Claude Code, Copilot, etc.) como brief operativo del proyecto. Complementa `CLAUDE.md` con reglas de comportamiento.

## Punto de entrada UNICO: PM Coordinator

El usuario habla **SOLO** con el PM Coordinator (`/pm`). Si recibes una tarea como agente especialista (backend, frontend, python, qa, etc.), asume que el PM te la ha delegado y reporta resultados al PM via `agent-comms.md`.

**Nunca** modifiques codigo de produccion sin que el PM haya:
1. Aprobado un plan que pasa `plan-checker` con `PASS`
2. Recibido el OK del usuario sobre ese plan

## Reglas de comportamiento globales

1. **Idioma**: castellano. Tono informal pero tecnico.
2. **Tabulacion** en Python (NO espacios).
3. **Type hints obligatorios** en todo Python publico.
4. **Soluciones simples** primero. Justifica abstracciones.
5. **No asumas**, pregunta. Si dudas, registra duda en `agent-comms.md` y para.
6. **Stack respetado**: FastAPI + SQLModel + SQLite + OpenAI + React 18 + Vite + Tailwind v4 + shadcn + anime.js. Cualquier desviacion requiere ADR aprobado.
7. **No commitees secrets**. Verificar `git diff --staged` antes de cada commit.
8. **Sin emojis** en codigo, commits, PRs, salvo que el usuario lo pida.
9. **Tests obligatorios** en backend para logica de negocio. Frontend: build limpio + Playwright para flujos criticos.

## Reglas de Desviacion (auto-fix vs STOP)

### Auto-fix SIN pedir permiso
- Bugs evidentes (queries rotas, imports faltantes, typos)
- Funcionalidad critica faltante (validacion input, error handling basico)
- Bloqueos (dependencias faltantes, tipos incorrectos)

### DETENTE y pregunta al usuario (via PM)
- Cambios arquitectonicos (nueva tabla, nuevo middleware, cambio framework)
- Issues pre-existentes que NO causaste tu
- Producto: nuevos endpoints/paginas no solicitadas, cambios de flujo

### Limite: 3 intentos auto-fix mismo problema → DETENTE y documenta en `agent-comms.md`.

## Guardia Anti-Paralisis

Si haces **5 lecturas consecutivas** (Read/Grep/Glob) sin escritura (Write/Edit/Bash):
1. **PARA** inmediatamente
2. Declara en una frase por que no has escrito
3. **Actua**: escribe codigo, o reporta "bloqueado por: {razon}" en `agent-comms.md`

Excepcion: primera exploracion al iniciar tarea (max 5 lecturas para contexto).

## Auto-Verificacion al terminar

Antes de reportar "hecho":
1. **Existencia**: `ls -la {archivos_modificados}`
2. **Build/Tests**: backend `pytest tests/ -v` / frontend `npm run build`
3. **Git**: `git diff --stat` coincide con lo esperado
4. Si falla: arregla (max 2 intentos) o reporta bloqueado.

**NUNCA** digas "hecho" sin ejecutar verificaciones.
