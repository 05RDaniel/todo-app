"use client";

import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
      >
        Logout
      </button>
    </form>
  );
}

