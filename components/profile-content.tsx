"use client";

import { UpdateUsernameForm } from "./update-username-form";
import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccountForm } from "./delete-account-form";

type ProfileContentProps = {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
  };
};

export function ProfileContent({ user }: ProfileContentProps) {
  return (
    <div className="space-y-6">
      {/* Account Info */}
      <section className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 shadow-xl shadow-black/30 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 mb-4">
          Account Information
        </h2>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-slate-500">Username:</span>{" "}
            <span className="font-semibold text-white">{user.username}</span>
          </div>
          <div>
            <span className="text-slate-500">Email:</span>{" "}
            <span className="font-semibold text-white">{user.email}</span>
          </div>
          <div>
            <span className="text-slate-500">Member since:</span>{" "}
            <span>
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Update Username */}
      <section className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 shadow-xl shadow-black/30 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 mb-4">
          Update Username
        </h2>
        <UpdateUsernameForm currentUsername={user.username} />
      </section>

      {/* Change Password */}
      <section className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 shadow-xl shadow-black/30 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 mb-4">
          Change Password
        </h2>
        <ChangePasswordForm />
      </section>

      {/* Delete Account */}
      <section className="rounded-3xl border border-rose-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/40 p-6 shadow-xl shadow-black/30 backdrop-blur">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400 mb-4">
          Danger Zone
        </h2>
        <DeleteAccountForm />
      </section>
    </div>
  );
}

