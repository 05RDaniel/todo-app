import Link from "next/link";
import { redirect } from "next/navigation";

type HomePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const userParam = params.user;
  const username = Array.isArray(userParam) ? userParam[0] : userParam;

  if (!username) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-12 text-center text-white">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Orbit Tasks
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome back, {username}!
        </h1>
        <p className="text-lg text-slate-300">
          You&apos;re logged in. Plug your database + auth to start listing and
          managing tasks from here.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-200 transition hover:border-sky-500"
        >
          Log out
        </Link>
      </div>
    </main>
  );
}

