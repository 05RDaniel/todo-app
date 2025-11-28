"use client";

import { useActionState, useEffect } from "react";
import { useToast } from "./toast-provider";
import { SubmitButton } from "./submit-button";
import Link from "next/link";

const initialState = {
  error: "",
};

type LoginFormClientProps = {
  loginAction: (
    state: LoginState | undefined | void,
    formData: FormData | null,
  ) => Promise<LoginState>;
  initialState: LoginState;
};

type LoginState = {
  error?: string;
};

export function LoginFormClient({ loginAction: action, initialState }: LoginFormClientProps) {
  const { showError } = useToast();
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state?.error) {
      showError(state.error);
    }
  }, [state?.error, showError]);

  return (
    <form
      action={formAction}
      className="w-full max-w-md space-y-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all hover:border-slate-700/60"
    >
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          Orbit Tasks
        </p>
        <h1 className="text-2xl font-semibold text-white">Sign in to continue</h1>
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
          disabled={isPending}
          placeholder="dronkus or d@gmail.com"
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:opacity-50"
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
          disabled={isPending}
          placeholder="••••"
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:opacity-50"
        />
      </div>

      <SubmitButton
        pendingLabel="Signing in..."
        disabled={isPending}
        className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30 disabled:opacity-50"
      >
        Sign in
      </SubmitButton>

      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-sky-300 hover:text-sky-200 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
