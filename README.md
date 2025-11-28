## Orbit Tasks

A batteries-included starter for a to-do list web app powered by:

- **Next.js 16 (App Router)** with React Server Components and Server Actions
- **TypeScript** and modern ESLint config
- **Tailwind CSS v4** with a glassmorphism-inspired UI
- **Prisma ORM** talking to **PostgreSQL**

Everything you need to start shipping task management features—forms, server mutations, list rendering, and a schema that can grow with your product.

---

## Project Structure

- `app/` – App Router pages, layouts, and styling
- `components/` – Reusable UI pieces, including a server-action aware submit button
- `app/actions/` – Server actions for creating, toggling, and deleting tasks
- `lib/prisma.ts` – Prisma client singleton
- `prisma/schema.prisma` – Task data model and enums

---

## Prerequisites

- Node.js 18.18+
- PostgreSQL database (local Docker container works great)

---

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp env.example .env
   # Update DATABASE_URL with your credentials
   ```

3. **Apply the Prisma schema**

   ```bash
   npm run db:migrate     # generates + applies migrations locally
   # or npm run db:push   # for prototyping without migrations
   ```

4. **Seed demo user (optional)**

   The SQL migration inserts `dronkus / d@example.com / 1234`. To reseed manually run:

   ```bash
   npx prisma db execute --file prisma/migrations/202511281230_add_user_table/migration.sql --schema prisma/schema.prisma
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the dashboard and start creating tasks.

---

## NPM Scripts

| Script               | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start Next.js in dev mode with hot reload |
| `npm run build`      | Production build                        |
| `npm run start`      | Run the compiled app                    |
| `npm run lint`       | ESLint                                  |
| `npm run db:push`    | `prisma db push`                        |
| `npm run db:migrate` | `prisma migrate dev`                    |
| `npm run db:studio`  | Open Prisma Studio UI                   |
| `npm run db:generate`| Regenerate Prisma Client                |

> Additional Prisma commands are defined in `package.json`.

---

## Next Steps

- Swap the demo login redirect for real session management (Auth.js, Clerk, etc.)
- Extend the `/home` page to list actual tasks from the Prisma layer
- Deploy to Vercel or your preferred host when ready

Happy building! 🚀
