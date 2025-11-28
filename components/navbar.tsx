import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export async function Navbar() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/70 bg-slate-900/90 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            Orbit Tasks
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <NavLink href="/">Dashboard</NavLink>
            <NavLink href="/tasks">My Tasks</NavLink>
            <NavLink href="/tasks/new">New Task</NavLink>
            <NavLink href="/profile">Profile</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden rounded-full bg-slate-800/50 px-3 py-1.5 text-sm text-slate-300 sm:inline">
            {user.username}
          </span>
          <LogoutButton />
        </div>
      </div>
      {/* Mobile menu */}
      <div className="border-t border-slate-800/70 bg-slate-900/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex flex-col gap-3">
          <MobileNavLink href="/">Dashboard</MobileNavLink>
          <MobileNavLink href="/tasks">My Tasks</MobileNavLink>
          <MobileNavLink href="/tasks/new">New Task</MobileNavLink>
          <MobileNavLink href="/profile">Profile</MobileNavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate-300 transition-all hover:text-white hover:underline decoration-sky-400 underline-offset-4"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800/50 hover:text-white"
    >
      {children}
    </Link>
  );
}

