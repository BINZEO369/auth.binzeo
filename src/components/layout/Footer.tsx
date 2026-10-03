"use client";

import Link from "next/link";

type FooterProps = {
  isLoggedIn?: boolean;
};

export default function Footer({ isLoggedIn = false }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#07111a]/80 text-white backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-2">
                <img src="/logo.svg" alt="BINZEO" className="h-full w-full object-contain brightness-0 invert" />
              </span>
              <span className="font-semibold tracking-[0.14em] text-white/90">BINZEO</span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-white/50">
              Your secure digital identity — create, manage and share with confidence.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/85">Product</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href={isLoggedIn ? "/dashboard" : "/signup"} className="transition hover:text-white">{isLoggedIn ? "Dashboard" : "Get started"}</Link></li>
              {!isLoggedIn && <li><Link href="/signin" className="transition hover:text-white">Sign in</Link></li>}
              <li><Link href="/#why-binzeo" className="transition hover:text-white">Why BINZEO</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/85">Explore</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/#how-it-works" className="transition hover:text-white">How it works</Link></li>
              <li><Link href="/#security" className="transition hover:text-white">Security</Link></li>
              <li><Link href="/" className="transition hover:text-white">Home</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p className="text-white/50">© {year} BINZEO Labs. All rights reserved.</p>
          <p className="text-white/35">Built with Next.js · Supabase</p>
        </div>
      </div>
    </footer>
  );
}
