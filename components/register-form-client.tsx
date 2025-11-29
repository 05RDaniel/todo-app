"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import type { RegisterState } from "@/app/actions/auth";
import Link from "next/link";

type RegisterFormClientProps = {
  registerAction: (
    state: RegisterState | undefined | void,
    formData: FormData | null,
  ) => Promise<RegisterState | void>;
  initialState: RegisterState;
};

export function RegisterFormClient({
  registerAction,
  initialState,
}: RegisterFormClientProps) {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-8 sm:p-10 shadow-2xl shadow-black/60 backdrop-blur-2xl"
    >
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Create account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Get started with your workspace
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          placeholder="johndoe"
          className="mt-2 w-full rounded-lg border border-slate-700/50 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-sky-500/50 focus:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
        <p className="mt-1 text-[10px] text-slate-500">
          Letters, numbers, and underscores only
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          className="mt-2 w-full rounded-lg border border-slate-700/50 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-sky-500/50 focus:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
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
          minLength={6}
          placeholder="••••••"
          className="mt-2 w-full rounded-lg border border-slate-700/50 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-sky-500/50 focus:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
        <p className="mt-1 text-[10px] text-slate-500">
          At least 6 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          placeholder="••••••"
          className="mt-2 w-full rounded-lg border border-slate-700/50 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 backdrop-blur-sm transition-all focus:border-sky-500/50 focus:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 backdrop-blur-sm">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
        <SubmitButton
          pendingLabel="Creating account..."
          className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:from-sky-400 hover:to-blue-500 hover:shadow-xl hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create account
        </SubmitButton>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}

