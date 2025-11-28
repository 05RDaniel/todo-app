"use client";

import { useActionState, useEffect } from "react";
import { updateUsernameAction, type UpdateUsernameState } from "@/app/actions/auth";
import { useToast } from "./toast-provider";
import { SubmitButton } from "./submit-button";

type UpdateUsernameFormProps = {
  currentUsername: string;
};

const initialState: UpdateUsernameState = {};

export function UpdateUsernameForm({ currentUsername }: UpdateUsernameFormProps) {
  const { showError, showSuccess } = useToast();
  const [state, formAction] = useActionState(updateUsernameAction, initialState);

  useEffect(() => {
    if (state?.error) {
      showError(state.error);
    } else if (state?.success) {
      showSuccess("Username updated successfully!");
      // Reset form
      const form = document.getElementById("update-username-form") as HTMLFormElement;
      form?.reset();
      // Reload to show new username
      window.location.reload();
    }
  }, [state, showError, showSuccess]);

  return (
    <form id="update-username-form" action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
        >
          New Username
        </label>
        <input
          id="username"
          name="username"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          defaultValue={currentUsername}
          className="w-full rounded-xl border border-slate-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        <p className="mt-1 text-[10px] text-slate-500">
          Letters, numbers, and underscores only
        </p>
      </div>

      <SubmitButton
        pendingLabel="Updating..."
        className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-sky-500 hover:shadow-xl hover:shadow-sky-500/30"
      >
        Update Username
      </SubmitButton>
    </form>
  );
}

