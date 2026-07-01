# LINEAR_CLONE — Frontend

Clon funcional de [Linear](https://linear.app) construido con React 19 + Vite + TypeScript. Proyecto de portafolio MERN.

**Demo en producción:** https://linearclonefront-production.up.railway.app

## Features

- Autenticación (registro + login con JWT)
- Proyectos con identificador y color
- Tablero Kanban con drag & drop (@dnd-kit)
- Vista Lista con tabla de tareas
- Filtros de prioridad
- Command Palette (Ctrl+K)
- Dark theme estilo Linear, interfaz en español

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS · TanStack Query v5 · Zustand · Radix UI · @dnd-kit · cmdk

## Setup local

```bash
npm install
cp .env.example .env
# editar .env con la URL del backend
npm run dev
# http://localhost:5173
```

Variables de entorno:
```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCKS=false
```

> Con `VITE_USE_MOCKS=true` la app usa MSW para mockear la API sin necesitar el backend.

## Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # build de producción
npm test           # tests con Vitest (18 tests)
npm run lint       # ESLint
```

## Backend

Repositorio del API: https://github.com/aicreationcl/linear_clone_backend
