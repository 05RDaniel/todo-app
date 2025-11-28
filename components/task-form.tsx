import { createTaskAction } from "@/app/actions/tasks";
import { SubmitButton } from "@/components/submit-button";

export function TaskForm() {
  return (
    <form
      action={createTaskAction}
      className="grid w-full gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur"
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
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
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
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
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
          <div className="mt-2 flex gap-2 rounded-xl border border-slate-800/70 bg-slate-950/60 p-2">
            {["LOW", "MEDIUM", "HIGH"].map((priority) => (
              <label
                key={priority}
                className="flex flex-1 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:bg-slate-900/80"
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  defaultChecked={priority === "MEDIUM"}
                  className="sr-only"
                />
                {priority.toLowerCase()}
              </label>
            ))}
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
            className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>
      </div>

      <SubmitButton
        pendingLabel="Adding task..."
        className="mt-2 rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400"
      >
        Add task
      </SubmitButton>
    </form>
  );
}

