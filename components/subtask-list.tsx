"use client";

import { Task } from "@prisma/client";
import { toggleTaskStatusAction, deleteTaskAction } from "@/app/actions/tasks";
import { useToast } from "./toast-provider";
import { SubmitButton } from "./submit-button";

type SubtaskListProps = {
  subtasks: Task[];
};

export function SubtaskList({ subtasks }: SubtaskListProps) {
  const { showError, showSuccess } = useToast();

  async function handleToggle(formData: FormData) {
    try {
      await toggleTaskStatusAction(formData);
      showSuccess("Subtask status updated");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to update subtask");
    }
  }

  async function handleDelete(formData: FormData) {
    if (!window.confirm("Are you sure you want to delete this subtask?")) {
      return;
    }
    try {
      await deleteTaskAction(formData);
      showSuccess("Subtask deleted successfully");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to delete subtask");
    }
  }

  if (subtasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800/80 bg-slate-900/20 p-6 text-center">
        <p className="text-sm text-slate-400">No subtasks yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {subtasks.map((subtask) => {
        const isDone = subtask.status === "DONE";

        return (
          <li
            key={subtask.id}
            className={`flex items-center gap-3 rounded-xl border bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-3 transition-all ${
              isDone ? "border-emerald-800/50 opacity-60" : "border-slate-800/80"
            }`}
          >
            <form action={handleToggle}>
              <input type="hidden" name="taskId" value={subtask.id} />
              <SubmitButton
                pendingLabel="..."
                className={`h-6 w-6 rounded-full border-2 text-xs font-semibold transition-all ${
                  isDone
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-400"
                    : "border-slate-700 bg-slate-950/40 text-slate-400 hover:border-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
                }`}
                aria-label={isDone ? "Mark as pending" : "Mark as done"}
              >
                {isDone ? "✓" : ""}
              </SubmitButton>
            </form>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-semibold uppercase tracking-wide ${
                    subtask.priority === "HIGH"
                      ? "text-rose-400"
                      : subtask.priority === "MEDIUM"
                        ? "text-amber-400"
                        : "text-slate-500"
                  }`}
                >
                  {subtask.priority === "HIGH" ? "H" : subtask.priority === "MEDIUM" ? "M" : "L"}
                </span>
                <h3
                  className={`text-xs font-semibold transition-all ${
                    isDone ? "text-slate-400 line-through" : "text-white"
                  }`}
                >
                  {subtask.title}
                </h3>
              </div>
              {subtask.description && (
                <p className="mt-1 text-[10px] leading-relaxed text-slate-400 line-clamp-1">
                  {subtask.description}
                </p>
              )}
            </div>

            <form action={handleDelete} className="flex-shrink-0">
              <input type="hidden" name="taskId" value={subtask.id} />
              <SubmitButton
                pendingLabel="..."
                className="h-5 w-5 rounded-full bg-rose-500/20 text-rose-300 transition-all hover:bg-rose-500/30 hover:text-rose-200 text-xs font-bold flex items-center justify-center"
                aria-label="Delete subtask"
              >
                ×
              </SubmitButton>
            </form>
          </li>
        );
      })}
    </ul>
  );
}

