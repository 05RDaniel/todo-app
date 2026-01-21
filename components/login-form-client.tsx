"use client";

import { useActionState, useEffect } from "react";
import { useToast } from "./toast-provider";
import { SubmitButton } from "./submit-button";
import Link from "next/link";

type LoginFormClientProps = {
  loginAction: (
    prevState: LoginState | undefined | void,
    formData: FormData,
  ) => Promise<LoginState | void>;
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
      className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-8 sm:p-10 shadow-2xl shadow-black/60 backdrop-blur-2xl transition-all"
    >
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your workspace
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Username or email
          </label>
          <input
            id="identifier"
            name="identifier"
            required
            disabled={isPending}
            placeholder="Enter your username or email"
            className="w-full rounded-lg border border-slate-700/50 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-sky-500/50 focus:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={isPending}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-slate-700/50 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-sky-500/50 focus:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-4">
        <SubmitButton
          pendingLabel="Signing in..."
          disabled={isPending}
          className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:from-sky-400 hover:to-blue-500 hover:shadow-xl hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign in
        </SubmitButton>

        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </form>
  );
}
