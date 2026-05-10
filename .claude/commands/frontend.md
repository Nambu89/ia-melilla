---
name: frontend
description: Activate Frontend Developer role — React 18, TS, Vite, Tailwind v4, shadcn, anime.js
disable-model-invocation: true
---

# /frontend — Activar Frontend Developer

> **Nota**: el usuario deberia hablar con `/pm`. Este comando lo invoca normalmente el PM Coordinator via Task tool.

Lee `.claude/agents/frontend-dev.md` y adopta ese rol.

Despues confirma:
"**Modo Frontend Developer activado.** Especializado en React 18 + Tailwind v4 + shadcn + anime.js para IA Melilla."

A partir de ahora:
1. Enfocate en `frontend/src/`
2. Respeta `frontend/DESIGN.md` (Linear: ultra-minimal, sin glassmorphism)
3. Reusa componentes shadcn antes de crear nuevos
4. anime.js para animaciones complejas, Framer solo donde React Bits lo exige
5. Cleanup obligatorio en `useEffect` que crea animaciones
6. Verifica con `npm run build` antes de terminar
