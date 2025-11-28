"use client";

import { useState } from "react";
import { Task } from "@prisma/client";
import { SubtaskList } from "./subtask-list";
import { CreateSubtaskForm } from "./create-subtask-form";

type SubtasksSectionProps = {
  taskId: string;
  subtasks: Task[];
};

export function SubtasksSection({ taskId, subtasks }: SubtasksSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-5 shadow-xl shadow-black/30 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Subtasks ({subtasks.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl border border-sky-500/50 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition-colors hover:bg-sky-500/20"
        >
          {showForm ? "Cancel" : "+ Add Subtask"}
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
          <CreateSubtaskForm parentId={taskId} onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <SubtaskList subtasks={subtasks} />
    </section>
  );
}

