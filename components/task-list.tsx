import { deleteTaskAction, toggleTaskStatusAction } from "@/app/actions/tasks";
import { Task } from "@prisma/client";
import { SubmitButton } from "@/components/submit-button";

type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-800/80 bg-slate-900/30 p-12 text-center">
        <p className="text-lg font-semibold text-slate-200">
          You haven&apos;t added anything yet
        </p>
        <p className="max-w-md text-sm text-slate-400">
          Start by documenting three quick wins for today. Breaking work into
          smaller goals keeps momentum high.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 shadow-2xl shadow-black/20 backdrop-blur"
        >
          <div className="flex flex-wrap items-center gap-4">
            <form action={toggleTaskStatusAction}>
              <input type="hidden" name="taskId" value={task.id} />
              <SubmitButton
                pendingLabel="Updating..."
                className={`h-10 w-10 rounded-full border text-lg font-semibold ${
                  task.status === "DONE"
                    ? "border-green-400 bg-green-500/10 text-green-400"
                    : "border-slate-700 bg-slate-950/40 text-slate-400 hover:border-sky-400 hover:text-sky-300"
                }`}
                aria-label={
                  task.status === "DONE" ? "Mark as pending" : "Mark as done"
                }
              >
                {task.status === "DONE" ? "✓" : ""}
              </SubmitButton>
            </form>

            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {task.priority.toLowerCase()} priority
              </p>
              <h3 className="text-xl font-semibold text-white">{task.title}</h3>
            </div>

            <span className="rounded-full border border-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {task.status === "DONE" ? "Completed" : "In progress"}
            </span>
          </div>

          {task.description && (
            <p className="mt-4 text-sm text-slate-300">{task.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Due
              </span>
              <span className="font-semibold text-white">
                {task.dueDate ? formatDate(task.dueDate) : "Not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Added
              </span>
              <span>{formatDate(task.createdAt)}</span>
            </div>
            <form action={deleteTaskAction}>
              <input type="hidden" name="taskId" value={task.id} />
              <SubmitButton
                pendingLabel="Removing..."
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-300 hover:text-rose-200"
              >
                Remove
              </SubmitButton>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatDate(date: Date | string) {
  const normalized = typeof date === "string" ? new Date(date) : date;
  return normalized.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

