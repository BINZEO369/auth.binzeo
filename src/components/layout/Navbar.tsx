"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar({ isLoggedIn = false, onMenu }: { isLoggedIn?: boolean; onMenu?: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d5dfdd]/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onMenu && <button type="button" onClick={onMenu} aria-label="Open dashboard menu" className="rounded-lg p-2 text-[#5c6b70] hover:bg-[#eef2f1] lg:hidden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg></button>}
          <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.svg" alt="BINZEO" width={122} height={29} priority className="h-8 w-auto transition-opacity group-hover:opacity-70" />
          </Link>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm font-medium text-[#5c6b70] transition-colors hover:text-[#101820]">Features</Link>
          <Link href="#how" className="text-sm font-medium text-[#5c6b70] transition-colors hover:text-[#101820]">How it works</Link>
        </div>
        {isLoggedIn ? (
          <Link href="/dashboard" aria-label="Open dashboard" title="Dashboard" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#b4ded3] bg-[#e3f4ee] text-[#216f9e] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#d7eee8]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/signin" className="rounded-lg px-3 py-2 text-sm font-medium text-[#35454c] transition-colors hover:bg-[#eef2f1] hover:text-[#101820]">Sign in</Link>
            <Link href="/signup" className="rounded-xl bg-[#101820] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#9bd8c7]/25 transition hover:-translate-y-0.5 hover:bg-[#263746]">Get started</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
