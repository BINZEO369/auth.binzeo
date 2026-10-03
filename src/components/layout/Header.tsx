"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type HeaderProps = {
  isLoggedIn?: boolean;
  onMenu?: () => void;
};

function MenuIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

export default function Header({ isLoggedIn = false, onMenu }: HeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const [open, setOpen] = useState(false);
  const showSiteMenu = open && !isDashboard && !onMenu;

  const handleMenuClick = () => {
    if (onMenu || isDashboard) {
      if (onMenu) onMenu();
      else window.dispatchEvent(new Event("binzeo:open-dashboard-menu"));
      return;
    }
    setOpen((value) => !value);
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="absolute inset-0 border-b border-white/10 backdrop-blur-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.55) 100%)",
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 8px 32px -12px rgba(0,0,0,0.55)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
        }}
      />

      <nav className="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex items-center transition-opacity duration-300 hover:opacity-80"
          aria-label="BINZEO home"
          onClick={closeMenu}
        >
          <Image
            src="/logo.svg"
            alt="BINZEO"
            width={140}
            height={34}
            priority
            className="h-8 w-auto brightness-0 invert sm:h-9"
          />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <Link href="/#why-binzeo" className="text-[13.5px] text-white/65 transition-colors duration-300 hover:text-white" onClick={closeMenu}>
            Why BINZEO
          </Link>
          <Link href="/#how-it-works" className="text-[13.5px] text-white/65 transition-colors duration-300 hover:text-white" onClick={closeMenu}>
            How it works
          </Link>
          <Link href="/#security" className="text-[13.5px] text-white/65 transition-colors duration-300 hover:text-white" onClick={closeMenu}>
            Security
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMenuClick}
            aria-label={isDashboard ? "Open dashboard menu" : open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isDashboard ? undefined : open}
            aria-controls={isDashboard ? undefined : "site-navigation-menu"}
            title={isDashboard ? "Dashboard menu" : open ? "Close navigation menu" : "Open navigation menu"}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/85 backdrop-blur-xl transition-all duration-500 hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.14] hover:text-white hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.35)]"
          >
            <MenuIcon open={!isDashboard && open} />
          </button>

          {!isLoggedIn && (
            <Link
              href="/signup"
              onClick={closeMenu}
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-black transition-all duration-500 hover:-translate-y-px hover:bg-white/95 hover:shadow-[0_14px_36px_-10px_rgba(255,255,255,0.55)]"
            >
              Get started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          )}
        </div>
      </nav>

      {showSiteMenu && (
        <div id="site-navigation-menu" className="border-t border-white/10 bg-[#07111a]/95 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <div className="mx-auto grid max-w-7xl gap-1 px-5 py-4 sm:px-8 md:grid-cols-3 lg:grid-cols-6 lg:px-10">
            <Link href="/" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">Home</Link>
            <Link href="/#why-binzeo" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">Why BINZEO</Link>
            <Link href="/#how-it-works" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">How it works</Link>
            <Link href="/#security" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">Security</Link>
            <Link href={isLoggedIn ? "/dashboard" : "/signin"} onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">{isLoggedIn ? "Dashboard" : "Sign in"}</Link>
            {!isLoggedIn && <Link href="/signup" onClick={closeMenu} className="rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/20">Get started</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
