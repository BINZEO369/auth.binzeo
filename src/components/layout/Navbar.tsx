"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar({ isLoggedIn = false, onMenu }: { isLoggedIn?: boolean; onMenu?: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dddddd]/80 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onMenu && <button type="button" onClick={onMenu} aria-label="Open dashboard menu" className="rounded-lg p-2 text-[#6666666] hover:bg-[#f3f3f3] lg:hidden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg></button>}
          <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.svg" alt="BINZEO" width={122} height={29} priority className="h-8 w-auto transition-opacity group-hover:opacity-70" />
          </Link>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#eeeeeetures" className="text-sm font-medium text-[#6666666] transition-colors hover:text-[#111111]">Features</Link>
          <Link href="#how" className="text-sm font-medium text-[#6666666] transition-colors hover:text-[#111111]">How it works</Link>
        </div>
        {isLoggedIn ? (
          <Link href="/dashboard" aria-label="Open dashboard" title="Dashboard" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#c9c9c9] bg-[#ededed] text-[#333333] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#e4e4e4]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/signin" className="rounded-lg px-3 py-2 text-sm font-medium text-[#444444] transition-colors hover:bg-[#f3f3f3] hover:text-[#111111]">Sign in</Link>
            <Link href="/signup" className="rounded-xl bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#cfcfcf]/25 transition hover:-translate-y-0.5 hover:bg-[#2b2b2b]">Get started</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
