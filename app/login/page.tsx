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
      <main className="relative mx-auto flex min-h-screen w-full items-center justify-center px-4 py-16 sm:px-6">
        <LoginForm />
      </main>
    </div>
  );
}

