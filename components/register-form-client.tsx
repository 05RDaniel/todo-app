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
      className="w-full max-w-md space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/40 p-8 shadow-2xl shadow-black/40 backdrop-blur"
    >
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          Orbit Tasks
        </p>
        <h1 className="text-2xl font-semibold text-white">
          Create your account
        </h1>
        <p className="text-sm text-slate-400">
          Fill in your details to get started.
        </p>
      </div>

      <div>
        <label
          htmlFor="username"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400"
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
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        <p className="mt-1 text-[10px] text-slate-500">
          Letters, numbers, and underscores only
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
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
          minLength={6}
          placeholder="••••••"
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        <p className="mt-1 text-[10px] text-slate-500">
          At least 6 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400"
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
          className="mt-2 w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      {state?.error && (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
          {state.error}
        </p>
      )}

      <SubmitButton
        pendingLabel="Creating account..."
        className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-400"
      >
        Sign up
      </SubmitButton>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-sky-300 hover:text-sky-200 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

