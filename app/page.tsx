import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sortTasks } from "@/lib/task-sort";
import Link from "next/link";

export default async function Home() {
  const user = await requireAuth();

  const allTasks = await prisma.task.findMany({
    where: { userId: user.id, parentId: null },
  });

  const sortedAllTasks = sortTasks(allTasks);

  const completedTasks = sortedAllTasks.filter((task) => task.status === "DONE").length;
  const pendingTasks = sortedAllTasks.filter((task) => task.status === "PENDING").length;
  const inProgressTasks = sortedAllTasks.filter((task) => task.status === "IN_PROGRESS").length;

  return (
    <div className="relative h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-500/20 via-slate-900/20 to-transparent blur-3xl" />
      <main className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-8 px-4 py-8 sm:px-6 lg:px-10 pt-[200px] md:pt-[128px]">
        <section className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Welcome back, {user.username}!
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Here&apos;s an overview of your tasks. Create new ones, track progress,
              and stay organized.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total tasks" value={sortedAllTasks.length} />
            <StatCard label="Pending" value={pendingTasks} />
            <StatCard label="In progress" value={inProgressTasks} />
            <StatCard label="Completed" value={completedTasks} />
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/tasks"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30"
            >
              My Tasks
            </Link>
            <Link
              href="/tasks/new"
              className="rounded-xl border border-sky-500/50 bg-sky-500/10 px-6 py-3 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-500/20"
            >
              New Task
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
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-5 shadow-xl shadow-black/20 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
