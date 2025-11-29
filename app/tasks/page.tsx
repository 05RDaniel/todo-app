import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sortTasks } from "@/lib/task-sort";
import { TasksPageClient } from "@/components/tasks-page-client";
import { TaskWithParent } from "@/types";

export default async function TasksPage() {
  const user = await requireAuth();

  const tasksRaw = await prisma.task.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      parentId: true,
      parent: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [
      { status: "asc" },
      { dueDate: { sort: "asc", nulls: "last" } },
      { priority: "desc" },
      { createdAt: "asc" },
    ],
  });

  const tasks = sortTasks(tasksRaw) as TaskWithParent[];

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/30 via-slate-950/40 to-transparent blur-3xl" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 pb-16 sm:px-6 lg:px-12 pt-[200px] md:pt-[128px]">
        <section className="flex flex-col gap-8">
          <TasksPageClient tasks={tasks} />
        </section>
      </main>
    </div>
  );
}


