# Aureon

Aureon is a business operations platform concept — projects, tasks, workflows, approvals, and team insight unified in one workspace. This repository is the frontend: a standalone React + TypeScript app running entirely on mock data, built as a portfolio demo.

## Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 8
- **Routing:** React Router v7 (`BrowserRouter`)
- **Data fetching:** TanStack Query, backed by in-memory mock services (`src/mock-data`, `src/services`)
- **State:** Zustand
- **Styling:** Tailwind CSS v4
- **UI primitives:** Radix UI
- **Animation:** Framer Motion
- **Charts:** Recharts

## Running locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build   # tsc -b && vite build, outputs to dist/
npm run preview # serve the production build locally
```

## Deployment

Deployed as a static single-page app on Vercel. `vercel.json` rewrites all paths to `/index.html` so client-side routes resolve correctly on direct load and refresh.

No environment variables are required — the app has no backend dependency. `src/services/http/client.ts` is a scaffold for a future `.NET` API integration (`VITE_API_BASE_URL`) and is not currently wired into any service.
