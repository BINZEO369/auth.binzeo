"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  isLoggedIn?: boolean;
  onMenu?: () => void;
};

/* ================================================================== */
/*  Navigation data                                                    */
/* ================================================================== */
const siteNavigation = [
  { href: "/", label: "Home", sub: "Back to homepage" },
  { href: "/#why-binzeo", label: "Why BINZEO", sub: "What makes us different" },
  { href: "/#how-it-works", label: "How it works", sub: "Three simple steps" },
  { href: "/#security", label: "Security", sub: "Your data, protected" },
] as const;

const dashboardNavigation = [
  { href: "/dashboard", label: "Overview", sub: "Your dashboard" },
  { href: "/dashboard/profile", label: "Profile", sub: "Personal information" },
  { href: "/dashboard/addresses", label: "Addresses", sub: "Saved locations" },
  { href: "/dashboard/contacts", label: "Contacts", sub: "Ways to reach you" },
  { href: "/dashboard/sectors", label: "Sectors", sub: "Industry access" },
  { href: "/dashboard/devices", label: "Devices", sub: "Logged-in devices" },
  { href: "/dashboard/verify-email", label: "Verify Email", sub: "Confirm your address" },
  { href: "/dashboard/security", label: "Security", sub: "Activity & sessions" },
] as const;

/* ================================================================== */
/*  Icons                                                              */
/* ================================================================== */
function MenuIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[19px] w-[19px]"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      ) : (
        <>
          <line x1="3.5" y1="6.5" x2="20.5" y2="6.5" />
          <line x1="3.5" y1="12" x2="20.5" y2="12" />
          <line x1="3.5" y1="17.5" x2="20.5" y2="17.5" />
        </>
      )}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* ================================================================== */
/*  Main Header                                                        */
/* ================================================================== */
export default function Header({ isLoggedIn = false, onMenu }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  /* ------------------------------------------------------------- */
  /*  Scroll detection — glass intensifies                          */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ------------------------------------------------------------- */
  /*  Outside click + ESC to close                                  */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* ------------------------------------------------------------- */
  /*  Lock body scroll when menu open                               */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ------------------------------------------------------------- */
  /*  Handlers                                                      */
  /* ------------------------------------------------------------- */
  const handleMenuClick = () => {
    if (onMenu) {
      onMenu();
      return;
    }
    setOpen((v) => !v);
  };

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    closeMenu();
    router.push("/signin");
    router.refresh();
  };

  /* ================================================================== */
  /*  RENDER                                                            */
  /* ================================================================== */
  return (
    <div ref={wrapperRef}>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* ============================================================ */}
        {/*  LIQUID GLASS BACKGROUND — WHITE                              */}
        {/* ============================================================ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 border-b transition-all duration-500"
          style={{
            background: scrolled
              ? "rgba(255,255,255,0.72)"
              : "rgba(255,255,255,0.55)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            borderBottomColor: scrolled
              ? "rgba(0,0,0,0.08)"
              : "rgba(0,0,0,0.04)",
            boxShadow: scrolled
              ? "inset 0 -1px 0 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.04), 0 12px 40px -16px rgba(0,0,0,0.12)"
              : "inset 0 -1px 0 0 rgba(255,255,255,0.6)",
          }}
        />

        {/* Subtle top sheen (white glow) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
          }}
        />

        {/* ============================================================ */}
        {/*  NAV                                                          */}
        {/* ============================================================ */}
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 transition-all duration-500"
          style={{ height: scrolled ? "60px" : "68px" }}
        >
          {/* ---------- LEFT: Logo ---------- */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center transition-all duration-300 hover:opacity-70"
            aria-label="BINZEO home"
          >
            <Image
              src="/logo.svg"
              alt="BINZEO"
              width={140}
              height={34}
              priority
              className="h-7 w-auto sm:h-8"
              style={{
                filter: "brightness(0) saturate(100%)", // pure black
              }}
            />
          </Link>

          {/* ---------- CENTER: Nav links (desktop) ---------- */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
            {siteNavigation.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="group relative text-[13.5px] font-medium text-black/60 transition-colors duration-300 hover:text-black"
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-black transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* ---------- RIGHT: Menu button only ---------- */}
          <button
            type="button"
            onClick={handleMenuClick}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-navigation-menu"
            title={open ? "Close" : "Menu"}
            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-500 hover:-translate-y-px active:translate-y-0"
            style={{
              background: open
                ? "rgba(0,0,0,0.92)"
                : "rgba(255,255,255,0.55)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: open
                ? "1px solid rgba(0,0,0,0.92)"
                : "1px solid rgba(0,0,0,0.10)",
              color: open ? "#ffffff" : "#0a0a0a",
              boxShadow: open
                ? "inset 0 1px 0 0 rgba(255,255,255,0.18), 0 12px 32px -10px rgba(0,0,0,0.35)"
                : "inset 0 1px 0 0 rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            {/* Hover sheen */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: open
                  ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%)"
                  : "radial-gradient(circle at 30% 30%, rgba(0,0,0,0.08), transparent 60%)",
              }}
            />
            <span className="relative">
              <MenuIcon open={open} />
            </span>
          </button>
        </nav>

        {/* ============================================================ */}
        {/*  DROPDOWN MENU — WHITE LIQUID GLASS                           */}
        {/* ============================================================ */}
        {open && (
          <>
            {/* Backdrop (mobile) */}
            <div
              aria-hidden="true"
              className="fixed inset-0 top-[68px] bg-black/20 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />

            <div
              id="site-navigation-menu"
              className="relative border-b"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.92) 100%)",
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                borderBottomColor: "rgba(0,0,0,0.06)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,1), 0 32px 80px -24px rgba(0,0,0,0.18)",
                animation:
                  "hdr-drop-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
                maxHeight: "calc(100vh - 68px)",
                overflowY: "auto",
              }}
            >
              <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
                {/* ---------- SITE NAV ---------- */}
                <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40 mb-3">
                  Navigation
                </p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {siteNavigation.map((item, i) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="group flex flex-col gap-1 rounded-2xl border border-black/[0.06] bg-white/60 px-4 py-3.5 transition-all duration-400 hover:bg-white hover:border-black/[0.12] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)]"
                      style={{
                        animation: `hdr-item-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.05 + i * 0.04
                        }s both`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-medium text-black">
                          {item.label}
                        </span>
                        <span className="text-black/25 transition-all duration-400 group-hover:text-black/70 group-hover:translate-x-0.5">
                          <ArrowIcon />
                        </span>
                      </div>
                      <span className="text-[11.5px] text-black/45">
                        {item.sub}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* ---------- DASHBOARD (if logged in) ---------- */}
                {isLoggedIn && (
                  <>
                    <div className="mt-7 flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40 whitespace-nowrap">
                        Your Account
                      </span>
                      <div className="h-px flex-1 bg-black/[0.06]" />
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {dashboardNavigation.map((item, i) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className={`group flex flex-col gap-1 rounded-2xl border px-4 py-3.5 transition-all duration-400 hover:-translate-y-0.5 ${
                              isActive
                                ? "bg-black text-white border-black hover:bg-black/90"
                                : "bg-white/60 border-black/[0.06] text-black hover:bg-white hover:border-black/[0.12] hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)]"
                            }`}
                            style={{
                              animation: `hdr-item-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${
                                0.1 + i * 0.03
                              }s both`,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[14px] font-medium ${
                                  isActive ? "text-white" : "text-black"
                                }`}
                              >
                                {item.label}
                              </span>
                              <span
                                className={`transition-all duration-400 group-hover:translate-x-0.5 ${
                                  isActive
                                    ? "text-white/70"
                                    : "text-black/25 group-hover:text-black/70"
                                }`}
                              >
                                <ArrowIcon />
                              </span>
                            </div>
                            <span
                              className={`text-[11.5px] ${
                                isActive ? "text-white/70" : "text-black/45"
                              }`}
                            >
                              {item.sub}
                            </span>
                          </Link>
                        );
                      })}

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="group flex flex-col gap-1 rounded-2xl border border-red-200 bg-red-50/60 px-4 py-3.5 text-left transition-all duration-400 hover:bg-red-50 hover:border-red-300 hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-medium text-red-600">
                            {loggingOut ? "Logging out..." : "Logout"}
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5 text-red-400 transition-transform duration-400 group-hover:translate-x-0.5"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                        </div>
                        <span className="text-[11.5px] text-red-400/80">
                          End this session
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {/* ---------- AUTH (if logged out) ---------- */}
                {!isLoggedIn && (
                  <>
                    <div className="mt-7 flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40 whitespace-nowrap">
                        Get Started
                      </span>
                      <div className="h-px flex-1 bg-black/[0.06]" />
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <Link
                        href="/signin"
                        onClick={closeMenu}
                        className="group flex flex-col gap-1 rounded-2xl border border-black/[0.06] bg-white/60 px-4 py-3.5 transition-all duration-400 hover:bg-white hover:border-black/[0.12] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)]"
                        style={{
                          animation:
                            "hdr-item-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-medium text-black">
                            Sign in
                          </span>
                          <span className="text-black/25 transition-all duration-400 group-hover:text-black/70 group-hover:translate-x-0.5">
                            <ArrowIcon />
                          </span>
                        </div>
                        <span className="text-[11.5px] text-black/45">
                          Welcome back
                        </span>
                      </Link>

                      <Link
                        href="/signup"
                        onClick={closeMenu}
                        className="group flex flex-col gap-1 rounded-2xl bg-black px-4 py-3.5 transition-all duration-400 hover:bg-black/90 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.45)]"
                        style={{
                          animation:
                            "hdr-item-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.19s both",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-medium text-white">
                            Create your ID
                          </span>
                          <span className="text-white/60 transition-all duration-400 group-hover:text-white group-hover:translate-x-0.5">
                            <ArrowIcon />
                          </span>
                        </div>
                        <span className="text-[11.5px] text-white/55">
                          It&apos;s free
                        </span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/*  KEYFRAMES                                                    */}
        {/* ============================================================ */}
        <style jsx global>{`
          @keyframes hdr-drop-in {
            from {
              opacity: 0;
              transform: translateY(-12px);
              filter: blur(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }
          @keyframes hdr-item-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </header>
    </div>
  );
}
