import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileContent } from "@/components/profile-content";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const currentUser = await requireAuth();
  
  // Get full user data including createdAt
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/30 via-slate-950/40 to-transparent blur-3xl" />
      <main className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-10 pt-[200px] md:pt-[128px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Profile
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Account Settings
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-wide text-slate-300 hover:text-sky-400"
          >
            ← Back to dashboard
          </Link>
        </header>

        <ProfileContent user={user} />
      </main>
    </div>
  );
}

