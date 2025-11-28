"use client";

import { useState } from "react";
import { Task } from "@prisma/client";
import { updateTaskAction } from "@/app/actions/tasks";
import { useToast } from "./toast-provider";
import { SubmitButton } from "./submit-button";
import { useRouter } from "next/navigation";

type TaskDetailFormProps = {
  task: Task;
};

export function TaskDetailForm({ task }: TaskDetailFormProps) {
  const { showError, showSuccess } = useToast();
  const router = useRouter();
  const [selectedPriority, setSelectedPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
    task.priority,
  );
  const [selectedStatus, setSelectedStatus] = useState<"PENDING" | "IN_PROGRESS" | "DONE">(
    task.status,
  );
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPendingFormData(formData);
    setShowConfirmSave(true);
  }

  async function confirmSave() {
    if (!pendingFormData) return;

    try {
      setIsSaving(true);
      await updateTaskAction(pendingFormData);
      showSuccess("Task updated successfully!");
      router.push("/tasks");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to update task");
      setShowConfirmSave(false);
      setPendingFormData(null);
    } finally {
      setIsSaving(false);
    }
  }

  const priorityConfig = {
    LOW: { label: "L", color: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" },
    MEDIUM: { label: "M", color: "bg-amber-500 text-white shadow-md shadow-amber-500/30" },
    HIGH: { label: "H", color: "bg-rose-500 text-white shadow-md shadow-rose-500/30" },
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-5 shadow-xl shadow-black/30 backdrop-blur">
      <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
        Edit task
      </h2>
      <form action={handleSubmit} className="space-y-3">
        <input type="hidden" name="id" value={task.id} />

        <div>
          <label
            htmlFor="title"
            className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={task.title}
            required
            className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={task.description ?? ""}
            className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 resize-none"
          />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Status
            </p>
            <div className="flex gap-1 rounded-xl border border-slate-800/70 bg-slate-950/60 p-0.5">
              {(["PENDING", "IN_PROGRESS", "DONE"] as const).map((status) => {
                const isSelected = selectedStatus === status;
                const statusConfig = {
                  PENDING: {
                    label: "Pending",
                    color: "bg-slate-700 text-white shadow-md shadow-slate-700/30",
                  },
                  IN_PROGRESS: {
                    label: "Progress",
                    color: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
                  },
                  DONE: {
                    label: "Done",
                    color: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30",
                  },
                };
                const config = statusConfig[status];
                return (
                  <label
                    key={status}
                    className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg px-2 py-1.5 text-[10px] font-semibold transition-all ${
                      isSelected
                        ? config.color
                        : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={isSelected}
                      onChange={() => setSelectedStatus(status)}
                      className="sr-only"
                    />
                    {config.label}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Priority
              </p>
              <div className="flex gap-1 rounded-xl border border-slate-800/70 bg-slate-950/60 p-0.5">
                {(["LOW", "MEDIUM", "HIGH"] as const).map((priority) => {
                  const isSelected = selectedPriority === priority;
                  const config = priorityConfig[priority];
                  return (
                    <label
                      key={priority}
                      className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg px-2 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? config.color
                          : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={isSelected}
                        onChange={() => setSelectedPriority(priority)}
                        className="sr-only"
                      />
                      {config.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
              >
                Due date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                defaultValue={
                  task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
                }
                className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-1.5 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
          </div>
        </div>


        <SubmitButton
          pendingLabel="..."
          className="mt-1 w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30"
        >
          Save changes
        </SubmitButton>
      </form>

      {/* Diálogo de confirmación de guardado */}
      {showConfirmSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-800/70 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-2">Save changes?</h3>
            <p className="text-sm text-slate-300 mb-4">
              Are you sure you want to save the changes to &quot;{task.title}&quot;?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSave(false);
                  setPendingFormData(null);
                }}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSave}
                disabled={isSaving}
                className="flex-1 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

