"use client";

import { useState, useEffect } from "react";
import { deleteAccountAction, type DeleteAccountState } from "@/app/actions/auth";
import { useToast } from "./toast-provider";
import { SubmitButton } from "./submit-button";

export function DeleteAccountForm() {
  const { showError } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(formData: FormData) {
    setIsDeleting(true);
    try {
      await deleteAccountAction({} as DeleteAccountState, formData);
      // If successful, redirect will happen, so we won't reach here
    } catch (error) {
      showError(error instanceof Error ? error.message : "Failed to delete account");
      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-300">
          Are you sure you want to delete your account? This action cannot be undone.
          All your tasks will be permanently deleted.
        </p>
        <form action={handleDelete} className="space-y-4">
          <div>
            <label
              htmlFor="deletePassword"
              className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block"
            >
              Enter your password to confirm
            </label>
            <input
              id="deletePassword"
              name="password"
              type="password"
              required
              placeholder="••••••"
              className="w-full rounded-xl border border-rose-800/70 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 transition-all focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
            >
              Cancel
            </button>
            <SubmitButton
              pendingLabel="Deleting..."
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-50"
            >
              Delete Account
            </SubmitButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
      >
        Delete Account
      </button>
    </div>
  );
}

