"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderProps = {
  isLoggedIn?: boolean;
  onMenu?: () => void;
};

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-[18px] w-[18px]"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Header({ isLoggedIn = false, onMenu }: HeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const handleMenuClick = () => {
    if (onMenu) onMenu();
    else window.dispatchEvent(new Event("binzeo:open-dashboard-menu"));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* ============================================================ */}
      {/*  LIQUID GLASS HEADER BACKGROUND                               */}
      {/* ============================================================ */}
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

      {/* Subtle top sheen */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
        }}
      />

      {/* ============================================================ */}
      {/*  NAV CONTENT                                                  */}
      {/* ============================================================ */}
      <nav className="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* ============================================================ */}
        {/*  LEFT — LOGO (direct, no wrapper box)                         */}
        {/* ============================================================ */}
        <Link
          href="/"
          className="group flex items-center transition-opacity duration-300 hover:opacity-80"
          aria-label="BINZEO home"
        >
          <Image
            src="/logo.svg"
            alt="BINZEO"
            width={140}
            height={34}
            priority
            className="h-8 w-auto sm:h-9 brightness-0 invert"
          />
        </Link>

        {/* ============================================================ */}
        {/*  CENTER — NAV LINKS (desktop only, optional)                  */}
        {/* ============================================================ */}
        <div className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2">
          <Link
            href="/#why-binzeo"
            className="text-[13.5px] text-white/65 hover:text-white transition-colors duration-300"
          >
            Why BINZEO
          </Link>
          <Link
            href="/#how-it-works"
            className="text-[13.5px] text-white/65 hover:text-white transition-colors duration-300"
          >
            How it works
          </Link>
          <Link
            href="/#security"
            className="text-[13.5px] text-white/65 hover:text-white transition-colors duration-300"
          >
            Security
          </Link>
        </div>

        {/* ============================================================ */}
        {/*  RIGHT SIDE                                                   */}
        {/*  Logged in  → Menu button (hamburger)                         */}
        {/*  Logged out → Get started button                              */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            /* --------- LOGGED IN: MENU BUTTON (right side) --------- */
            <button
              type="button"
              onClick={handleMenuClick}
              aria-label="Open dashboard menu"
              title="Dashboard menu"
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/85 transition-all duration-500 hover:bg-white/[0.14] hover:border-white/30 hover:text-white hover:-translate-y-px hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.35)]"
            >
              <MenuIcon />
            </button>
          ) : (
            /* --------- LOGGED OUT: GET STARTED BUTTON --------- */
            <Link
              href="/signup"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_14px_36px_-10px_rgba(255,255,255,0.55)] hover:-translate-y-px"
            >
              Get started
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
