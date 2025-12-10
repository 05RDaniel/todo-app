"use client";

import { useState, useCallback, memo } from "react";
import { deleteTaskAction, toggleTaskStatusAction } from "@/app/actions/tasks";
import { useToast } from "./toast-provider";
import Link from "next/link";
import { TaskWithParent } from "@/types";

type TaskListClientProps = {
  tasks: TaskWithParent[];
};

export const TaskListClient = memo(function TaskListClient({ tasks }: TaskListClientProps) {
  const { showError, showSuccess } = useToast();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    taskId: string;
    currentStatus: "PENDING" | "IN_PROGRESS" | "DONE";
    nextStatus: "PENDING" | "IN_PROGRESS" | "DONE";
  } | null>(null);

  const handleDelete = useCallback(async (taskId: string) => {
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
  }, [showError, showSuccess]);

  const handleStatusChange = useCallback(async (taskId: string, nextStatus: "PENDING" | "IN_PROGRESS" | "DONE") => {
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
  }, [showError, showSuccess]);

  const getNextStatus = useCallback((currentStatus: "PENDING" | "IN_PROGRESS" | "DONE"): "PENDING" | "IN_PROGRESS" | "DONE" => {
    if (currentStatus === "PENDING") return "IN_PROGRESS";
    if (currentStatus === "IN_PROGRESS") return "DONE";
    return "DONE";
  }, []);

  const getStatusLabel = useCallback((status: "PENDING" | "IN_PROGRESS" | "DONE"): string => {
    if (status === "PENDING") return "pending";
    if (status === "IN_PROGRESS") return "in progress";
    return "done";
  }, []);

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
            className={`group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-900/70 to-slate-950/70 shadow-xl backdrop-blur-sm transition-all hover:border-slate-700/50 hover:shadow-2xl ${
              isDone
                ? "border-emerald-800/30 opacity-70"
                : task.status === "IN_PROGRESS"
                  ? "border-amber-800/40"
                  : "border-slate-800/50"
            } ${isDeleting ? "opacity-50" : ""}`}
          >
            {/* Status indicator bar */}
            <div className={`h-1 ${
              isDone
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                : task.status === "IN_PROGRESS"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600"
                  : "bg-gradient-to-r from-slate-700 to-slate-800"
            }`} />
            
            <div className="px-6 py-4 flex flex-col flex-1 min-h-0">
              <div className="flex items-start gap-5 flex-1 min-h-0">
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
                  className={`h-14 w-14 flex-shrink-0 rounded-xl border-2 flex items-center justify-center text-lg font-semibold transition-all hover:scale-105 ${
                    task.status === "DONE"
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : task.status === "IN_PROGRESS"
                        ? "border-amber-400 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        : "border-slate-700 bg-slate-950/40 text-slate-400 hover:border-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
                  }`}
                  aria-label={`Change status from ${getStatusLabel(task.status)}`}
                >
                  {task.status === "DONE" ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : task.status === "IN_PROGRESS" ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-current" />
                  )}
                </button>

                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {task.parent && (
                        <div className="mb-1 flex items-center gap-1.5">
                          <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <Link
                            href={`/tasks/${task.parent.id}`}
                            className="text-xs text-slate-400 hover:text-sky-400 transition-colors truncate"
                            title={task.parent.title}
                          >
                            {task.parent.title}
                          </Link>
                        </div>
                      )}
                      <h3
                        className={`text-lg font-bold leading-tight transition-all ${
                          isDone ? "text-slate-400 line-through" : "text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-bold ${
                          task.priority === "HIGH"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : task.priority === "MEDIUM"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-slate-700/30 text-slate-500 border border-slate-700/50"
                        }`}
                      >
                        {task.priority === "HIGH" ? "H" : task.priority === "MEDIUM" ? "M" : "L"}
                      </span>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-base leading-relaxed text-slate-400 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                </div>
              </div>
              
              <div className="mt-auto pt-3 flex items-center justify-between gap-4 border-t border-slate-800/50">
                  {task.dueDate ? (
                    <div className="flex items-center gap-2 text-base text-slate-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due {formatDate(task.dueDate)}</span>
                    </div>
                  ) : (
                    <div className="text-base text-slate-600">No due date</div>
                  )}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="group flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-1.5 text-sm font-medium text-sky-300 transition-all hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-200"
                    >
                      <span>View</span>
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(task.id)}
                      disabled={isDeleting}
                      className="h-10 w-10 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all hover:bg-rose-500/30 hover:border-rose-500/50 hover:text-rose-200 disabled:opacity-50 flex items-center justify-center"
                      aria-label="Delete task"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
});

function formatDate(date: Date | string) {
  const normalized = typeof date === "string" ? new Date(date) : date;
  // Use a fixed locale to ensure consistent formatting between server and client
  return normalized.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

