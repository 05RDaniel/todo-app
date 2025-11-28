import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/30 via-slate-950/40 to-transparent blur-3xl" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-12">
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Welcome back
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Sign in to access your tasks
              </h1>
              <p className="text-lg text-slate-300">
                Use the demo account or wire this starter to your auth provider
                to unlock the Orbit Tasks workspace. Everything adapts to any
                screen size, so you can keep shipping from anywhere.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="Teams onboarded" value="12+" />
              <StatCard label="Tasks tracked" value="4.3k" />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center lg:justify-end">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-4 text-left shadow-xl shadow-black/20 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

