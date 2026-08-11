# AI Agent Builder — Project Progress

## App Idea (Overview)

An **n8n clone** — a visual AI-agent workflow automation builder. Users drag &
connect nodes on a canvas (React Flow) to build automation pipelines
(triggers → AI nodes → actions), similar to n8n/Zapier but with a focus on
AI agent nodes powered by Gemini.

- **Core stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Auth:** Clerk (sign-in + user identity)
- **Database:** PostgreSQL via Prisma v7 (driver adapter)
- **AI:** Google Gemini (`@google/generative-ai`)
- **Canvas:** `@xyflow/react` (node-based visual editing)
- **State/Data:** Zustand (client state) + TanStack React Query (server state)

## What Has Been Achieved

### 1. Project Setup
- Next.js 16 app bootstrapped, configured with TypeScript + Tailwind v4.
- React Compiler enabled in `next.config.ts`.

### 2. Authentication (Clerk) — DONE
- `clerkMiddleware` wired in `src/proxy.ts` (protects all routes except static assets).
- `<ClerkProvider>` added in root layout.
- Sign-in page at `src/app/sign-in/[[...sign-in]]/page.tsx`.
- Signed-in user is available via `currentUser()`.

### 3. Database (Prisma + PostgreSQL) — DONE
- Prisma v7 configured with PostgreSQL driver adapter (`@prisma/adapter-pg`).
- Schema (`prisma/schema.prisma`):
  - **User** — synced from Clerk (`clerkId` unique, email).
  - **Workflow** — name + `flowData` (JSON: nodes/edges of the flow canvas), owned by a User.
  - **Execution** — status + logs (JSON) for each workflow run.
- Prisma client generated to `src/generated/prisma`.
- `src/lib/prisma.ts` — singleton PrismaClient with PG adapter.

### 4. User Sync + Dashboard — PARTIAL
- `src/lib/getOrCreateUser.ts` — creates a DB user on first login (Clerk → Prisma).
- Dashboard (`src/app/page.tsx`) — fetches and shows the logged-in user's
  workflow count. (Basic; UI not built yet.)

### 5. Dependencies Installed (ready but NOT yet used)
- `@xyflow/react` — flow canvas for the visual editor.
- `@google/generative-ai` — AI node execution.
- `zustand` — client-side state (e.g., current flow being edited).
- `@tanstack/react-query` — server-state fetching.
- `svix` — Clerk webhooks (e.g., user deleted → cleanup DB).

## What's Next (Suggested Order)

1. **Dashboard UI** — list workflows + "create new" button.
2. **Workflow editor** — React Flow canvas, nodes saved into `flowData`,
   save/load via Prisma (API routes or Server Actions).
3. **Node types** — n8n-style nodes:
   - **Trigger nodes** (manual / webhook / schedule)
   - **AI nodes** (Gemini: prompt/LLM node — receives input from previous
     connected nodes, outputs response as the next node's input → chained
     processing)
   - **Utility/action nodes** (text transform, condition, HTTP request, etc.)
4. **Execution engine** — *not decided yet* (options: run on server, save
   status/logs in `Execution`; can be designed after the editor is built).
5. **Execution history** — view past runs, statuses, and logs.
6. **Clerk webhooks** — sync user deletion via svix.

## Tech Notes / Gotchas

- Prisma v7 requires driver adapters; client target is `prisma-client`
  (files generated under `src/generated/prisma`).
- `DATABASE_URL` must be set in `.env` (PrismaPg reads it).