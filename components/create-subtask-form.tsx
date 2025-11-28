"use client";

import { useState } from "react";
import { createSubtaskAction } from "@/app/actions/tasks";
import { useToast } from "./toast-provider";
import { SubmitButton } from "./submit-button";
import { useFormStatus } from "react-dom";

type CreateSubtaskFormProps = {
  parentId: string;
  onSuccess: () => void;
};

function CreateSubtaskFormContent({ parentId }: { parentId: string }) {
  const { pending } = useFormStatus();
  const [selectedPriority, setSelectedPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  const priorityConfig = {
    LOW: { label: "L", color: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" },
    MEDIUM: { label: "M", color: "bg-amber-500 text-white shadow-md shadow-amber-500/30" },
    HIGH: { label: "H", color: "bg-rose-500 text-white shadow-md shadow-rose-500/30" },
  };

  return (
    <>
      <div>
        <label
          htmlFor="subtask-title"
          className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
        >
          Title
        </label>
        <input
          id="subtask-title"
          name="title"
          required
          minLength={3}
          maxLength={80}
          placeholder="Subtask title"
          disabled={pending}
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="subtask-description"
          className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
        >
          Description
        </label>
        <textarea
          id="subtask-description"
          name="description"
          rows={2}
          maxLength={280}
          placeholder="Optional description"
          disabled={pending}
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 resize-none disabled:opacity-50"
        />
      </div>

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

      <input type="hidden" name="parentId" value={parentId} />

      <SubmitButton
        pendingLabel="Creating..."
        disabled={pending}
        className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-sky-500 disabled:opacity-50"
      >
        Create Subtask
      </SubmitButton>
    </>
  );
}

export function CreateSubtaskForm({ parentId, onSuccess }: CreateSubtaskFormProps) {
  const { showError, showSuccess } = useToast();

  async function handleSubmit(formData: FormData) {
    try {
      await createSubtaskAction(formData);
      showSuccess("Subtask created successfully!");
      onSuccess();
      const form = document.getElementById("create-subtask-form") as HTMLFormElement;
      form?.reset();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to create subtask");
    }
  }

  return (
    <form
      id="create-subtask-form"
      action={handleSubmit}
      className="space-y-3 rounded-xl border border-slate-800/70 bg-slate-950/60 p-4"
    >
      <CreateSubtaskFormContent parentId={parentId} />
    </form>
  );
}
