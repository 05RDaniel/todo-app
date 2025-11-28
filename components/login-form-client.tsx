"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import type { LoginState } from "@/app/actions/auth";

type LoginFormClientProps = {
  loginAction: (
    state: LoginState | undefined | void,
    formData: FormData | null,
  ) => Promise<LoginState | void>;
  initialState: LoginState;
};

export function LoginFormClient({
  loginAction,
  initialState,
}: LoginFormClientProps) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-md space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/40 p-8 shadow-2xl shadow-black/40 backdrop-blur"
    >
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          Orbit Tasks
        </p>
        <h1 className="text-2xl font-semibold text-white">
          Sign in to continue
        </h1>
        <p className="text-sm text-slate-400">
          Use the demo credentials seeded via Prisma to explore the dashboard.
        </p>
      </div>

      <div>
        <label
          htmlFor="identifier"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400"
        >
          Username or email
        </label>
        <input
          id="identifier"
          name="identifier"
          required
          placeholder="dronkus or d@example.com"
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••"
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      {state?.error && (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
          {state.error}
        </p>
      )}

      <SubmitButton
        pendingLabel="Signing in..."
        className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400"
      >
        Sign in
      </SubmitButton>
    </form>
  );
}

