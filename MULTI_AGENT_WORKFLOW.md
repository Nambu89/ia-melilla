# Guia de Trabajo Multi-Agente — IA Melilla v2

> Adaptado del flujo Boris Cherny (Anthropic) y del setup multi-agente de TaxIA. Punto de entrada UNICO: el PM Coordinator.

---

## Concepto

**El usuario habla SOLO con el PM Coordinator (`/pm`).** El PM activa al resto de agentes via `Task` tool o registra delegaciones en `agent-comms.md`. Tu eres el director de orquesta del PM, no de los especialistas.

| Tradicional | Multi-agente con PM |
|-------------|---------------------|
| Repites contexto cada sesion | PM lee CLAUDE.md + ROADMAP + agent-comms en cada activacion |
| Cambias entre 5 conversaciones | Una conversacion: el PM |
| Pierdes contexto entre sesiones | `claude-progress.txt` + `memory/` mantienen estado |

---

## Estructura

```
ia-melilla/
├── CLAUDE.md                    # Manual del proyecto
├── AGENTS.md                    # Reglas para agentes IA
├── MULTI_AGENT_WORKFLOW.md      # Esta guia
├── claude-progress.txt          # Log entre sesiones
├── agent-comms.md               # Canal inter-agentes
├── plans/
│   ├── ROADMAP.md               # Fases 0-7 + tareas
│   └── DECISIONS.md             # ADR log
├── memory/
│   └── MEMORY.md                # Indice memoria persistente
└── .claude/
    ├── agents/                  # 8 especialistas
    │   ├── pm-coordinator.md    # ← UNICO punto de entrada
    │   ├── backend-architect.md
    │   ├── frontend-dev.md
    │   ├── python-pro.md
    │   ├── qa-tester.md
    │   ├── plan-checker.md
    │   ├── verifier.md
    │   ├── doc-auditor.md
    │   └── _archive/            # competitive-intel.md (en pausa)
    ├── commands/
    │   ├── pm.md                # /pm — ACTIVAR PM
    │   ├── start.md             # /start — iniciar sesion
    │   ├── backend.md /frontend.md /python.md /qa.md
    │   ├── verify.md /check-plan.md /docs.md
    │   ├── test.md /commit.md /review.md /deploy.md
    │   └── ...
    └── skills/                  # Conocimiento reutilizable
```

---

## Slash commands principales

| Comando | Accion |
|---------|--------|
| `/start` | Inicio de sesion: lee progress + git status + roadmap |
| `/pm` | **ACTIVAR PM Coordinator** (deberias usar este 90% del tiempo) |
| `/check-plan` | Quality gate ANTES de implementar |
| `/verify` | Quality gate DESPUES de implementar |
| `/docs` | Activar Documentation Auditor |
| `/qa` | Activar QA Tester E2E |
| `/test` | Ejecutar tests |
| `/commit` | Commit con convencion |
| `/review` | Code review pre-commit |
| `/deploy` | Preparar deploy a Coolify |

Comandos `/backend`, `/frontend`, `/python` existen pero **no los uses tu directamente**. El PM los activa via Task tool si hace falta. Si los usas tu mismo, te saltas las reglas del PM.

---

## Flujo diario tipico

```
1. claude
2. /start                  → contexto al dia
3. /pm                     → activar PM
4. "Quiero anadir demo X"  → PM investiga → escribe plan en plans/
5. PM ejecuta /check-plan  → si PASS, te lo presenta
6. Tu apruebas             → PM delega a backend-architect / frontend-dev
7. Especialistas implementan en su contexto fresco
8. PM ejecuta /verify      → si VERIFIED, reporta done
9. /commit + /deploy       → push a main → Coolify despliega
```

---

## Quality Gates (OBLIGATORIO)

```
Plan → /check-plan (PASS?) → Presentar usuario → Aprobacion
     → Implementar → /verify (VERIFIED?) → Completado
```

NUNCA presentar plan sin pasar `plan-checker`. NUNCA reportar "hecho" sin pasar `verifier`.

---

## Memoria compartida

| Archivo | Proposito | Quien escribe |
|---------|-----------|---------------|
| `CLAUDE.md` | Stack, convenciones, reglas | Manual + doc-auditor |
| `backend/CLAUDE.md` | Stack backend, patrones | doc-auditor + backend-architect |
| `frontend/CLAUDE.md` | Stack frontend, componentes | doc-auditor + frontend-dev |
| `plans/ROADMAP.md` | Fases + tareas + estado | PM |
| `plans/DECISIONS.md` | ADR log | PM |
| `agent-comms.md` | Tareas y estados | Todos |
| `memory/MEMORY.md` | Indice de memoria | Auto |
| `claude-progress.txt` | Log sesion | Final de cada sesion |

---

## Mejores practicas

### DO
- `/start` al iniciar siempre
- `/pm` para casi todo (es tu punto de entrada)
- `/check-plan` antes de implementar features con >3 tareas
- `/verify` despues de cualquier implementacion
- Actualizar `claude-progress.txt` al cerrar sesion

### DON'T
- Llamar a `/backend`, `/frontend`, `/python` directamente — saltas el PM
- Pedir "haz todo de una vez" — trabajo incremental
- Ignorar bloqueos en `agent-comms.md`
- Cerrar sin commit

---

## Troubleshooting

**Claude no reconoce slash commands** → verifica `.claude/commands/` y reinicia.

**Claude se pierde en una sesion larga** → "Lee CLAUDE.md, plans/ROADMAP.md, agent-comms.md y refresca contexto".

**Conflictos entre agentes** → revisa `agent-comms.md`. Si dos agentes tocan el mismo archivo, uno reporta BLOCKED y el PM coordina.

---

**Ultima actualizacion:** 2026-05-10
