"use client";

import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
  isLoggedIn?: boolean;
  onMenu?: () => void;
};

export default function Navbar({ isLoggedIn = false, onMenu }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111a]/80 text-white backdrop-blur-2xl">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          {onMenu && (
            <button
              type="button"
              onClick={onMenu}
              aria-label="Open dashboard menu"
              className="rounded-xl p-2 text-white/75 transition hover:bg-white/10 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <Link href="/" className="group flex items-center gap-3" aria-label="BINZEO home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/25 bg-white/15 p-2 shadow-lg shadow-cyan-950/20 backdrop-blur-xl transition group-hover:bg-white/25">
              <Image src="/logo.svg" alt="BINZEO" width={122} height={29} priority className="h-full w-full object-contain brightness-0 invert" />
            </span>
            <span className="text-sm font-semibold tracking-[0.22em] text-white/90">BINZEO</span>
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#why-binzeo" className="text-sm text-white/65 transition-colors hover:text-white">Why BINZEO</Link>
          <Link href="/#how-it-works" className="text-sm text-white/65 transition-colors hover:text-white">How it works</Link>
          <Link href="/#security" className="text-sm text-white/65 transition-colors hover:text-white">Security</Link>
        </div>

        {isLoggedIn ? (
          <Link href="/dashboard" aria-label="Open dashboard" title="Dashboard" className="liquid-button liquid-button-light px-4 py-2.5 text-sm sm:px-5">
            <span className="hidden sm:inline">Dashboard</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/signin" className="hidden rounded-full px-4 py-2.5 text-sm text-white/75 transition hover:bg-white/10 hover:text-white sm:inline-flex">Sign in</Link>
            <Link href="/signup" className="liquid-button liquid-button-light px-4 py-2.5 text-sm sm:px-5">Get started</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
