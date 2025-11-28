"use client";

import { useActionState, useEffect } from "react";
import { changePasswordAction, type ChangePasswordState } from "@/app/actions/auth";
import { useToast } from "./toast-provider";
import { SubmitButton } from "./submit-button";

const initialState: ChangePasswordState = {};

export function ChangePasswordForm() {
  const { showError, showSuccess } = useToast();
  const [state, formAction] = useActionState(changePasswordAction, initialState);

  useEffect(() => {
    if (state?.error) {
      showError(state.error);
    } else if (state?.success) {
      showSuccess("Password changed successfully!");
      // Reset form
      const form = document.getElementById("change-password-form") as HTMLFormElement;
      form?.reset();
    }
  }, [state, showError, showSuccess]);

  return (
    <form id="change-password-form" action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="oldPassword"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
        >
          Current Password
        </label>
        <input
          id="oldPassword"
          name="oldPassword"
          type="password"
          required
          placeholder="••••••"
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
        >
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          placeholder="••••••"
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        <p className="mt-1 text-[10px] text-slate-500">
          At least 6 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
        >
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          placeholder="••••••"
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      <SubmitButton
        pendingLabel="Changing..."
        className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30"
      >
        Change Password
      </SubmitButton>
    </form>
  );
}

