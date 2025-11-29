"use client";

import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm transition-all hover:border-slate-600/50 hover:bg-slate-700/60 hover:text-white hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
      >
        Logout
      </button>
    </form>
  );
}

