import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TaskDetailForm } from "@/components/task-detail-form";
import { SubtasksSection } from "@/components/subtasks-section";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const user = await requireAuth();
  const { id } = await params;

  const task = await prisma.task.findFirst({
    where: { id, userId: user.id },
    include: {
      subtasks: {
        orderBy: [
          { status: "asc" },
          { dueDate: { sort: "asc", nulls: "last" } },
          { priority: "desc" },
          { createdAt: "asc" },
        ],
      },
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/30 via-slate-950/40 to-transparent blur-3xl" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-10 pt-[200px] md:pt-[128px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Task detail
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {task.title}
            </h1>
          </div>
          <Link
            href="/tasks"
            className="text-sm font-semibold uppercase tracking-wide text-slate-300 hover:text-sky-400"
          >
            ← Back to list
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(260px,0.9fr)_1.1fr]">
          <div className="space-y-6">
            <TaskDetailForm task={task} />
            <SubtasksSection taskId={task.id} subtasks={task.subtasks} />
          </div>

          <aside className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/30 p-6 text-sm text-slate-300 shadow-xl shadow-black/20 backdrop-blur">
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              At a glance
            </h2>
            <div className="space-y-3">
              <p>
                <span className="text-slate-500">Status:</span>{" "}
                <span className="font-semibold text-white">{task.status}</span>
              </p>
              <p>
                <span className="text-slate-500">Priority:</span>{" "}
                <span className="font-semibold text-white">
                  {task.priority.toLowerCase()}
                </span>
              </p>
              <p>
                <span className="text-slate-500">Created:</span>{" "}
                <span>
                  {new Date(task.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              <p>
                <span className="text-slate-500">Due:</span>{" "}
                <span>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "Not set"}
                </span>
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}


