"use client";

import { useState } from "react";
import { Task } from "@prisma/client";
import { deleteTaskAction, toggleTaskStatusAction } from "@/app/actions/tasks";
import { useToast } from "./toast-provider";
import Link from "next/link";

type TaskListClientProps = {
  tasks: Task[];
};

export function TaskListClient({ tasks }: TaskListClientProps) {
  const { showError, showSuccess } = useToast();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    taskId: string;
    currentStatus: "PENDING" | "IN_PROGRESS" | "DONE";
    nextStatus: "PENDING" | "IN_PROGRESS" | "DONE";
  } | null>(null);

  async function handleDelete(taskId: string) {
    try {
      setDeletingIds((prev) => new Set([...prev, taskId]));
      const formData = new FormData();
      formData.append("taskId", taskId);
      await deleteTaskAction(formData);
      showSuccess("Task deleted successfully");
      setConfirmDeleteId(null);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to delete task");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  }

  async function handleStatusChange(taskId: string, nextStatus: "PENDING" | "IN_PROGRESS" | "DONE") {
    try {
      const formData = new FormData();
      formData.append("taskId", taskId);
      formData.append("newStatus", nextStatus);
      await toggleTaskStatusAction(formData);
      showSuccess(`Task status updated to ${nextStatus === "DONE" ? "done" : nextStatus === "IN_PROGRESS" ? "in progress" : "pending"}`);
      setConfirmStatusChange(null);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to update task");
    }
  }

  function getNextStatus(currentStatus: "PENDING" | "IN_PROGRESS" | "DONE"): "PENDING" | "IN_PROGRESS" | "DONE" {
    if (currentStatus === "PENDING") return "IN_PROGRESS";
    if (currentStatus === "IN_PROGRESS") return "DONE";
    return "DONE"; // Si ya está DONE, no cambia (aunque no debería llegar aquí)
  }

  function getStatusLabel(status: "PENDING" | "IN_PROGRESS" | "DONE"): string {
    if (status === "PENDING") return "pending";
    if (status === "IN_PROGRESS") return "in progress";
    return "done";
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-800/80 bg-gradient-to-br from-slate-900/30 to-slate-900/20 p-12 text-center backdrop-blur-sm">
        <div className="rounded-full bg-slate-800/50 p-4">
          <svg
            className="h-8 w-8 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-200">You haven&apos;t added anything yet</p>
        <p className="max-w-md text-sm text-slate-400">
          Start by documenting three quick wins for today. Breaking work into smaller goals keeps
          momentum high.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {tasks.map((task) => {
        const isDeleting = deletingIds.has(task.id);
        const isDone = task.status === "DONE";

        return (
          <li
            key={task.id}
            className={`group flex h-full flex-col rounded-xl border bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-4 shadow-lg backdrop-blur-xl transition-all hover:border-slate-700/60 hover:shadow-xl ${
              isDone
                ? "border-emerald-800/50 opacity-60"
                : task.status === "IN_PROGRESS"
                  ? "border-amber-800/50"
                  : "border-slate-800/80"
            } ${isDeleting ? "opacity-50" : ""}`}
          >
            <div className="flex items-start gap-3 flex-1">
              <button
                type="button"
                onClick={() => {
                  const nextStatus = getNextStatus(task.status);
                  if (nextStatus !== task.status) {
                    setConfirmStatusChange({
                      taskId: task.id,
                      currentStatus: task.status,
                      nextStatus,
                    });
                  }
                }}
                className={`h-8 w-8 rounded-full border-2 text-sm font-semibold transition-all hover:scale-110 ${
                  task.status === "DONE"
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    : task.status === "IN_PROGRESS"
                      ? "border-amber-400 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                      : "border-slate-700 bg-slate-950/40 text-slate-400 hover:border-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
                }`}
                aria-label={`Change status from ${getStatusLabel(task.status)}`}
              >
                {task.status === "DONE" ? "✓" : task.status === "IN_PROGRESS" ? "→" : ""}
              </button>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide ${
                      task.priority === "HIGH"
                        ? "text-rose-400"
                        : task.priority === "MEDIUM"
                          ? "text-amber-400"
                          : "text-slate-500"
                    }`}
                  >
                    {task.priority === "HIGH" ? "H" : task.priority === "MEDIUM" ? "M" : "L"}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      isDone
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                        : task.status === "IN_PROGRESS"
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
                          : "border-slate-800/80 bg-slate-800/30 text-slate-400"
                    }`}
                  >
                    {task.status === "DONE"
                      ? "Done"
                      : task.status === "IN_PROGRESS"
                        ? "Progress"
                        : "Pending"}
                  </span>
                </div>
                <h3
                  className={`text-sm font-semibold transition-all ${
                    isDone ? "text-slate-400 line-through" : "text-white"
                  }`}
                >
                  {task.title}
                </h3>
                <div className="flex-1 min-h-[2.5rem]">
                  {task.description ? (
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
                      {task.description}
                    </p>
                  ) : (
                    <div className="mt-2" />
                  )}
                </div>
                <div className="mt-auto pt-3 flex items-center justify-between gap-2 text-[10px] text-slate-500 border-t border-slate-800/50">
                  <span>
                    Due: {task.dueDate ? formatDate(task.dueDate) : "Not set"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="font-semibold uppercase tracking-wide text-sky-300 transition-colors hover:text-sky-200"
                    >
                      View →
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(task.id)}
                      disabled={isDeleting}
                      className="h-6 w-6 rounded-full bg-rose-500/20 text-rose-300 transition-all hover:bg-rose-500/30 hover:text-rose-200 disabled:opacity-50 flex items-center justify-center text-sm font-bold"
                      aria-label="Delete task"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Diálogo de confirmación de eliminación */}
            {confirmDeleteId === task.id && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-sm rounded-xl border border-slate-800/70 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">Delete task?</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      disabled={isDeleting}
                      className="flex-1 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Diálogo de confirmación de cambio de estado */}
            {confirmStatusChange && confirmStatusChange.taskId === task.id && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-sm rounded-xl border border-slate-800/70 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
                  <h3 className="text-lg font-semibold text-white mb-2">Change task status?</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Change &quot;{task.title}&quot; from{" "}
                    <span className="font-semibold text-white">
                      {getStatusLabel(confirmStatusChange.currentStatus)}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-white">
                      {getStatusLabel(confirmStatusChange.nextStatus)}
                    </span>
                    ?
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmStatusChange(null)}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(confirmStatusChange.taskId, confirmStatusChange.nextStatus)}
                      className="flex-1 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        );
      })}
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

