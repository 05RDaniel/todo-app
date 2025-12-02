import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const user = await requireAuth();

  // Optimizar: usar agregaciones en lugar de cargar todos los registros
  const [allTasksCount, completedTasks, pendingTasks, inProgressTasks] = await Promise.all([
    prisma.task.count({ where: { userId: user.id } }),
    prisma.task.count({ where: { userId: user.id, status: "DONE" } }),
    prisma.task.count({ where: { userId: user.id, status: "PENDING" } }),
    prisma.task.count({ where: { userId: user.id, status: "IN_PROGRESS" } }),
  ]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-sky-500/10 via-blue-500/5 to-transparent blur-3xl" />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-10 pt-[200px] md:pt-[128px] pb-16">
        <section className="flex flex-col gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-500" />
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Dashboard
              </p>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome back, <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">{user.username}</span>
            </h1>
            <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
              Here&apos;s an overview of your tasks. Create new ones, track progress,
              and stay organized.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total tasks" value={allTasksCount} icon="📋" />
            <StatCard label="Pending" value={pendingTasks} icon="⏳" />
            <StatCard label="In progress" value={inProgressTasks} icon="🚀" />
            <StatCard label="Completed" value={completedTasks} icon="✅" />
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/tasks"
              className="group relative rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:from-sky-400 hover:to-blue-500 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-[1.02]"
            >
              <span className="relative flex items-center gap-2">
                My Tasks
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link
              href="/tasks/new"
              className="rounded-xl border border-slate-700/50 bg-slate-800/30 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-300 hover:shadow-md"
            >
              + New Task
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  icon?: string;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-6 shadow-xl shadow-black/30 backdrop-blur-sm transition-all hover:border-slate-700/50 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-blue-500/0 to-purple-500/0 opacity-0 transition-opacity group-hover:opacity-5" />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {label}
          </p>
          {icon && <span className="text-xl">{icon}</span>}
        </div>
        <p className="text-4xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
