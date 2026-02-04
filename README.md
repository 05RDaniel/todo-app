# Orbit Tasks

**Todo-app** — A modern, full-stack task management application with user accounts and subtasks.

## Highlights

- Full-stack task manager with user accounts, subtasks, priorities, and due dates.
- Next.js 16 (App Router), TypeScript, PostgreSQL, and Prisma in a single codebase.
- Session-based authentication with bcrypt; profile and account management.
- Ready for self-hosting or deployment (e.g. Vercel + managed PostgreSQL).

---

## Project Overview

**What it is**  
Orbit Tasks is a web application for managing personal or team tasks. Users can create tasks, set priorities and due dates, organize work with subtasks, and track status from pending to done. Each user has a private task list and a profile they can update.

**What problem it solves**  
It addresses the need for a simple, self-hostable task manager: clear ownership of tasks per user, hierarchy via subtasks, and filtering by status/priority/date—without relying on third-party SaaS.

**Context**  
Personal / learning project demonstrating full-stack development with Next.js, TypeScript, Prisma, and PostgreSQL. Suitable as a portfolio piece or as a base for internal tools.

---

## Key Features

- **Task CRUD** — Create, read, update, and delete tasks.
- **Subtasks** — Attach child tasks to any task for breakdown and progress.
- **Priorities** — Low, Medium, High per task.
- **Due dates** — Optional due date and completion timestamp.
- **Status workflow** — Pending → In progress → Done, with quick toggle.
- **User accounts** — Register, login, and session-based access.
- **Profile** — Update username, change password, delete account.
- **Filtering & sorting** — Filter by status/priority and sort by date or priority.
- **Responsive UI** — Modern interface with Tailwind CSS v4.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | Next.js API Routes + Server Actions |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | Session-based (HTTP-only cookie), bcrypt for password hashing |
| **Tooling** | Zod (validation), ESLint, TypeScript strict mode |

---

## Architecture Overview

- **Monorepo-style Next.js app**: single codebase with `app/` (routes, API, server actions), `components/`, `lib/`, and `prisma/`.
- **Responsibilities**:  
  - **Frontend**: React components and pages under `app/`; forms use Server Actions where appropriate.  
  - **Backend**: API routes under `app/api/` for REST-style task operations; Server Actions in `app/actions/` for auth and mutations.  
  - **Data**: Prisma Client in `lib/prisma.ts`; all DB access server-side.  
- **Flow**: Browser → Next.js (SSR/API) → Prisma → PostgreSQL. Auth state is a cookie holding the user id; every protected route/API checks it via `getCurrentUser` / `requireAuth`.

---

## Key Technical Decisions

- **Next.js App Router** — Single framework for SSR, API, and routing; Server Actions reduce boilerplate for forms.
- **Session in cookie (no DB sessions)** — Simplicity: cookie stores user id; validation is a single DB read. No session table or Redis.
- **Prisma** — Type-safe access, migrations, and indexes for common filters (userId + status, priority, dueDate).
- **Self-relation on Task** — Subtasks modeled as `Task.parentId` → `Task`; one model covers both top-level and nested tasks.
- **bcrypt for passwords** — Industry-standard hashing; no plain-text storage for new users.

---

## What This Project Demonstrates

- Full-stack development with a modern React/Next.js frontend and a PostgreSQL backend.
- RESTful API design and Server Actions for mutations and forms.
- Session-based authentication and protected routes.
- Relational data modeling (users, tasks, subtasks) and indexing for performance.
- Validation and error handling with Zod.
- Responsive UI and basic UX (toasts, loading states, redirects).

---

## Project Structure

```
todo-app/
├── app/
│   ├── actions/          # Server Actions (auth, tasks)
│   ├── api/              # API routes (auth, tasks CRUD)
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── profile/          # User profile page
│   ├── tasks/            # Task list, detail, new task pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home (redirect or dashboard)
│   └── globals.css       # Global styles
├── components/           # Reusable React components (forms, navbar, toasts, task list)
├── lib/
│   ├── auth.ts           # Session helpers (getCurrentUser, requireAuth, setSession, clearSession)
│   ├── prisma.ts         # Prisma Client singleton
│   └── task-sort.ts      # Task sorting utilities
├── prisma/
│   ├── schema.prisma     # Data model and enums
│   └── migrations/      # SQL migrations
├── types/                # Shared TypeScript types
├── scripts/              # Optional DB/user scripts
├── env.example           # Example environment variables
└── package.json
```

---

## Getting Started / Local Setup

**Prerequisites**

- Node.js 20+
- PostgreSQL (local or hosted)
- npm (or yarn)

**Installation**

```bash
git clone <repository-url>
cd todo-app
npm install
```

**Environment**

```bash
cp env.example .env
```

Edit `.env` and set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

**Database**

```bash
npx prisma generate
npx prisma db push
```

Or, for versioned migrations:

```bash
npx prisma migrate dev
```

**Run locally**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Register** to create an account, then **Login**.

**Useful scripts**

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm start` — Production server
- `npm run lint` — Lint
- `npx prisma studio` — DB GUI

---

## Database Design

**Main entities**

- **User** — `id`, `username` (unique), `email` (unique), `password` (hashed), timestamps.
- **Task** — `id`, `title`, `description`, `status`, `priority`, `dueDate`, `completedAt`, `userId`, `parentId` (optional, for subtasks), timestamps.

**Relations**

- **User → Task**: One-to-many. Every task belongs to one user.
- **Task → Task (subtasks)**: Self-relation via `parentId`; a task can have many subtasks and at most one parent.

**Enums**

- `TaskStatus`: `PENDING`, `IN_PROGRESS`, `DONE`
- `TaskPriority`: `LOW`, `MEDIUM`, `HIGH`

**Indexes**

- `(userId, status)`, `(userId, priority)`, `(userId, dueDate)`, `(userId, createdAt)`, `(parentId)` for fast filtered and sorted queries.

---

## Authentication Flow

**Type**  
Session-based: no JWT. A signed-in user is represented by an HTTP-only cookie containing the user id.

**Flow**

1. **Register** — User submits username, email, password; server validates (Zod), checks uniqueness, hashes password (bcrypt), creates `User`, sets session cookie, redirects to home.
2. **Login** — User submits identifier (username or email) and password; server finds user, compares password (bcrypt), sets session cookie, redirects to home.
3. **Protected routes** — `requireAuth()` reads cookie, loads user from DB; if missing, redirects to `/login`.
4. **API** — Task endpoints resolve user via the same cookie/session and scope all queries by `userId`.
5. **Logout** — Clears session cookie, redirects to `/login`.
6. **Profile** — Update username, change password (with current password check), or delete account (password confirmation; cascades to user’s tasks).

---

## Deployment

**Recommended platform**  
Vercel (Next.js native support). Alternatively any Node host that runs `next start`.

**Environment variables**

- `DATABASE_URL` (required) — PostgreSQL connection string. Must be reachable from the deployment (e.g. Railway, Supabase, Neon).

**Build and migrations**

- Vercel runs `npm run build`; `postinstall` runs `prisma generate`.
- Run migrations after first deploy (e.g. from CI or a one-off script):

  ```bash
  npx prisma migrate deploy
  ```

**Manual deploy**

1. `npm run build`
2. Set `DATABASE_URL` in the host’s environment.
3. Run `npx prisma migrate deploy` (or `prisma db push` for prototyping).
4. Start with `npm start`.

---

## Future Improvements / Roadmap

- **Features**: Recurring tasks, labels/tags, sharing or assigning tasks, due-date reminders.
- **Technical**: Optional DB-backed sessions for revocability; rate limiting on auth endpoints; optional OAuth (e.g. Google).
- **UX**: Keyboard shortcuts, drag-and-drop ordering, bulk actions, simple mobile PWA.

---

## License

All rights reserved.
