"use client";

import { useState } from "react";
import { useToast } from "./toast-provider";
import { createTaskAction } from "@/app/actions/tasks";
import { SubmitButton } from "./submit-button";
import { useFormStatus } from "react-dom";

export function TaskFormClient() {
  const { showError, showSuccess } = useToast();
  const { pending } = useFormStatus();
  const [selectedPriority, setSelectedPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  async function handleSubmit(formData: FormData) {
    try {
      await createTaskAction(formData);
      showSuccess("Task created successfully!");
      // Reset form
      const form = document.querySelector('form[action*="handleSubmit"]') as HTMLFormElement;
      form?.reset();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to create task");
    }
  }

  return (
    <form
      action={handleSubmit}
      className="grid w-full gap-4 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 backdrop-blur-xl shadow-xl transition-all hover:border-slate-700/60"
    >
      <div>
        <label
          htmlFor="title"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400"
        >
          Task title
        </label>
        <input
          id="title"
          name="title"
          placeholder="Draft onboarding email"
          required
          minLength={3}
          maxLength={80}
          disabled={pending}
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Add a short note to give more context…"
          maxLength={280}
          disabled={pending}
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:opacity-50 resize-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="priority"
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Priority
          </label>
          <div className="mt-2 flex gap-1.5 rounded-xl border border-slate-800/70 bg-slate-950/60 p-1">
            {(["LOW", "MEDIUM", "HIGH"] as const).map((priority) => {
              const isSelected = selectedPriority === priority;
              const priorityConfig = {
                LOW: { label: "L", color: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" },
                MEDIUM: { label: "M", color: "bg-amber-500 text-white shadow-md shadow-amber-500/30" },
                HIGH: { label: "H", color: "bg-rose-500 text-white shadow-md shadow-rose-500/30" },
              };
              const config = priorityConfig[priority];
              
              return (
                <label
                  key={priority}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                    isSelected
                      ? config.color
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-300"
                  } ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={isSelected}
                    onChange={() => setSelectedPriority(priority)}
                    disabled={pending}
                    className="sr-only"
                  />
                  {config.label}
                </label>
              );
            })}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="dueDate"
            className="text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Due date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:opacity-50"
          />
        </div>
      </div>

      <SubmitButton
        pendingLabel="Adding task..."
        disabled={pending}
        className="mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30 disabled:opacity-50"
      >
        Add task
      </SubmitButton>
    </form>
  );
}

