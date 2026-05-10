# backend/CLAUDE.md — Backend IA Melilla

> Guia para agentes que tocan backend. Complementa el `CLAUDE.md` de la raiz.

## Stack

- **Python 3.12+**
- **FastAPI** (async, OpenAPI auto)
- **Pydantic v2**
- **SQLModel** (SQLAlchemy + tipos Pydantic)
- **SQLite** + `aiosqlite` (DB unica `data/app.db`)
- **OpenAI SDK** (`openai`) para LLM
- **`uv`** gestion deps
- **`ruff`** lint + format
- **`pytest` + `httpx`** tests
- **`python-telegram-bot`** notificaciones
- **`resend`** o `sendgrid` email transaccional

## Estructura `backend/app/`

```
app/
├── main.py              # FastAPI app, lifespan, middleware
├── api/
│   └── v1/
│       ├── leads.py     # POST /api/v1/leads
│       ├── contact.py   # POST /api/v1/contact
│       ├── chat.py      # widget atencion automatica
│       └── demos/       # un endpoint por demo (1, 2, 4, 7, 10 monolito)
├── core/
│   ├── config.py        # Settings (pydantic_settings)
│   ├── database.py      # engine + get_session
│   ├── security.py      # rate limiting, CORS
│   └── deps.py          # Depends() comunes
├── models/              # SQLModel (entidades DB)
│   ├── lead.py
│   ├── appointment.py
│   └── message.py
├── schemas/             # Pydantic DTOs (input/output API)
├── repositories/        # Acceso a datos (DIP — un repo por entidad)
├── services/            # Logica de negocio
│   ├── lead_service.py
│   ├── notification_service.py
│   └── openai_client.py # implementa LLMClient Protocol
├── agents/              # Un agente por demo (implementan Agent Protocol)
│   ├── attention_agent.py
│   ├── lead_capture_agent.py
│   └── ...
├── protocols/           # typing.Protocol abstractions
│   ├── llm_client.py
│   └── agent.py
└── workers/             # Tareas async (BackgroundTasks helpers)
```

## Patrones

### Endpoint pattern
```python
from fastapi import APIRouter, Depends
from app.core.deps import get_lead_service

router = APIRouter(prefix="/api/v1", tags=["leads"])

@router.post("/leads", status_code=201)
async def create_lead(
	payload: LeadCreate,
	service: LeadService = Depends(get_lead_service),
) -> LeadRead:
	return await service.create(payload)
```

### LLMClient Protocol (D de SOLID)
```python
from typing import Protocol

class LLMClient(Protocol):
	async def chat(self, system: str, messages: list[dict]) -> str: ...
	async def stream(self, system: str, messages: list[dict]): ...
```

Implementacion: `services/openai_client.py`. Para cambiar a Anthropic: nuevo `services/anthropic_client.py` y cambiar binding en `Depends()`.

### Agent Protocol (O de SOLID)
```python
class Agent(Protocol):
	name: str
	system_prompt: str
	async def run(self, user_input: str) -> AgentResponse: ...
```

Cada demo es una clase que implementa `Agent`. Anadir demo = nueva clase, no se tocan otras.

## Convenciones

- **Tabulacion** (no espacios) — confirmado por usuario
- **Type hints obligatorios** en publico
- `snake_case` en archivos y vars
- Docstrings en funciones publicas (estilo Google)
- `pathlib.Path` en lugar de `os.path`
- f-strings, no `.format()` ni `%`
- `logging` en lugar de `print` (modulo `app.core.logging`)
- Funciones >50 lineas: dividir

## Reglas Auto-Fix vs STOP

### Auto-fix
- Bugs (queries rotas, types incorrectos, imports rotos)
- Critico faltante (error handling, validacion input)
- Bloqueos (deps faltantes)

### STOP y pregunta al usuario (via PM)
- Cambios arquitectonicos (nueva tabla, schema migration, nuevo middleware)
- Issues pre-existentes que no causaste
- Producto: nuevos endpoints/flujos no solicitados

Limite: 3 intentos auto-fix → DETENTE y reporta en `agent-comms.md`.

## Auto-Verificacion al terminar tarea

```bash
ls -la {archivos_modificados}
cd backend && uv run pytest tests/ -v --tb=short -q
git diff --stat
```

NUNCA reportar "hecho" sin estos 3.

## Security non-negotiables

1. Queries parametrizadas (SQLModel ya lo hace por defecto — NO uses raw SQL con f-strings)
2. Rate limiting en endpoints publicos LLM (caro)
3. Validar tamano y tipo de uploads
4. CORS estricto (solo `iamelilla.com` y `demos.iamelilla.com`)
5. Variables sensibles en `.env`, NUNCA commiteadas
6. Logs no incluyen PII ni claves API

## Testing

```bash
cd backend
uv run pytest tests/ -v
uv run pytest tests/test_leads.py::test_create_lead -v
uv run pytest tests/ --cov=app --cov-report=term-missing
```

Mock OpenAI con fixtures en `tests/conftest.py`. NO llamar API real en tests.
