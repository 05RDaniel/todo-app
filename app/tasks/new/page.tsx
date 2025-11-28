import { requireAuth } from "@/lib/auth";
import { createTaskAction } from "@/app/actions/tasks";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";

export default async function NewTaskPage() {
  await requireAuth();

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/30 via-slate-950/40 to-transparent blur-3xl" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-4 pb-16 sm:px-6 lg:px-10 pt-[200px] md:pt-[128px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Create task
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              New task
            </h1>
          </div>
          <Link
            href="/tasks"
            className="text-sm font-semibold uppercase tracking-wide text-slate-300 hover:text-sky-400"
          >
            ← Back to list
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-6 shadow-xl shadow-black/30 backdrop-blur">
          <form action={createTaskAction} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="text-xs font-semibold uppercase tracking-wide text-slate-400"
              >
                Title *
              </label>
              <input
                id="title"
                name="title"
                required
                minLength={3}
                maxLength={80}
                placeholder="What needs to be done?"
                className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
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
                rows={6}
                maxLength={280}
                placeholder="Add more details about this task..."
                className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Priority
                </p>
                <div className="mt-2 flex gap-2 rounded-xl border border-slate-800/70 bg-slate-950/60 p-2">
                  {["LOW", "MEDIUM", "HIGH"].map((priority) => (
                    <label
                      key={priority}
                      className="flex flex-1 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:bg-slate-900/80 data-[checked]:bg-sky-500/20 data-[checked]:text-sky-300"
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

              <div>
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
                  className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <SubmitButton
                pendingLabel="Creating..."
                className="flex-1 rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400"
              >
                Create task
              </SubmitButton>
              <Link
                href="/tasks"
                className="rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

