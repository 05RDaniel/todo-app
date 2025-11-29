"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { logoutAction } from "@/app/actions/auth";

type NavbarClientProps = {
  username: string;
};

export function NavbarClient({ username }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && isMenuOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMenuOpen(false);
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("nav")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-black/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xl font-bold tracking-tight text-white transition-all hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Orbit Tasks
            </span>
          </Link>
          {/* Desktop menu */}
          <div className="hidden items-center gap-6 md:flex">
            <NavLink href="/" pathname={pathname}>Dashboard</NavLink>
            <NavLink href="/tasks" pathname={pathname}>My Tasks</NavLink>
            <NavLink href="/tasks/new" pathname={pathname}>New Task</NavLink>
            <NavLink href="/profile" pathname={pathname}>Profile</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden rounded-lg bg-gradient-to-r from-slate-800/60 to-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm backdrop-blur-sm sm:px-4 sm:text-sm md:inline">
            {username}
          </span>
          <div className="hidden sm:block">
            <LogoutButton />
          </div>
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="border-t border-slate-800/50 bg-slate-950/95 px-4 py-3 backdrop-blur-2xl md:hidden animate-in slide-in-from-top-2 shadow-xl">
          <div className="flex flex-col gap-2">
            <MobileNavLink href="/" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/tasks" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
              My Tasks
            </MobileNavLink>
            <MobileNavLink href="/tasks/new" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
              New Task
            </MobileNavLink>
            <MobileNavLink href="/profile" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
              Profile
            </MobileNavLink>
            <div className="pt-2 border-t border-slate-800/50 mt-2">
              <div className="px-3 py-2 text-xs text-slate-400 mb-2">{username}</div>
              <MobileLogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, pathname, children }: { href: string; pathname: string; children: React.ReactNode }) {
  // Special handling for /tasks to avoid matching /tasks/new
  let isActive: boolean;
  if (href === "/") {
    isActive = pathname === "/";
  } else if (href === "/tasks") {
    // Only active for exact /tasks, not /tasks/new or /tasks/[id]
    isActive = pathname === "/tasks";
  } else {
    // For other routes, check exact match or starts with
    isActive = pathname === href || pathname.startsWith(href + "/");
  }
  
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-all ${
        isActive
          ? "text-white"
          : "text-slate-400 hover:text-slate-200"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full" />
      )}
    </Link>
  );
}

function MobileNavLink({ 
  href, 
  pathname, 
  onClick, 
  children 
}: { 
  href: string; 
  pathname: string; 
  onClick: () => void;
  children: React.ReactNode;
}) {
  // Special handling for /tasks to avoid matching /tasks/new
  let isActive: boolean;
  if (href === "/") {
    isActive = pathname === "/";
  } else if (href === "/tasks") {
    // Only active for exact /tasks, not /tasks/new or /tasks/[id]
    isActive = pathname === "/tasks";
  } else {
    // For other routes, check exact match or starts with
    isActive = pathname === href || pathname.startsWith(href + "/");
  }
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
        isActive
          ? "bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-300 shadow-sm"
          : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white text-left"
      >
        Logout
      </button>
    </form>
  );
}

