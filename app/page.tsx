import { LoginForm } from "@/components/login-form";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/30 via-slate-950/40 to-transparent blur-3xl" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 py-10">
        <div className="flex w-full flex-col items-center gap-10 text-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Welcome back
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Sign in to access your tasks
            </h1>
            <p className="text-lg text-slate-300">
              Use the demo account or wire this starter to your auth provider to
              unlock the Orbit Tasks workspace.
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
