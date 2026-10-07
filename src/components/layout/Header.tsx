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
/*  Navigation data — with icons                                      */
/* ================================================================== */
const siteNavigation = [
  { href: "/", label: "Home", sub: "Back to homepage", icon: "/icons/home.svg" },
  { href: "/#why-binzeo", label: "Why BINZEO", sub: "What makes us different", icon: "/icons/check.svg" },
  { href: "/#how-it-works", label: "How it works", sub: "Three simple steps", icon: "/icons/grid.svg" },
  { href: "/#security", label: "Security", sub: "Your data, protected", icon: "/icons/shield.svg" },
] as const;

const dashboardNavigation = [
  { href: "/dashboard", label: "Overview", sub: "Your dashboard", icon: "/icons/grid.svg" },
  { href: "/dashboard/profile", label: "Profile", sub: "Personal information", icon: "/icons/user.svg" },
  { href: "/dashboard/addresses", label: "Addresses", sub: "Saved locations", icon: "/icons/location.svg" },
  { href: "/dashboard/contacts", label: "Contacts", sub: "Ways to reach you", icon: "/icons/message.svg" },
  { href: "/dashboard/sectors", label: "Sectors", sub: "Industry access", icon: "/icons/building.svg" },
  { href: "/dashboard/devices", label: "Devices", sub: "Logged-in devices", icon: "/icons/device.svg" },
  { href: "/dashboard/security", label: "Security", sub: "Activity & sessions", icon: "/icons/shield.svg" },
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
/*  Menu tile — reusable                                              */
/* ================================================================== */
function MenuTile({
  href,
  label,
  sub,
  icon,
  isActive,
  delay = 0,
  onClick,
  variant = "light",
}: {
  href: string;
  label: string;
  sub: string;
  icon: string;
  isActive?: boolean;
  delay?: number;
  onClick?: () => void;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark" || isActive;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border px-4 py-3.5 transition-all duration-500 hover:-translate-y-0.5 ${
        isDark
          ? "border-black bg-black text-white hover:bg-black/90 hover:shadow-[0_16px_40px_-14px_rgba(0,0,0,0.5)]"
          : "border-black/[0.06] bg-white/70 text-black hover:border-black/[0.14] hover:bg-white hover:shadow-[0_16px_40px_-18px_rgba(0,0,0,0.18)]"
      }`}
      style={{
        animation: `hdr-item-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      {/* Sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: isDark
            ? "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 60%)"
            : "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.05), transparent 60%)",
        }}
      />

      {/* Icon in glass circle */}
      <span
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 ${
          isDark
            ? "border-white/15 bg-white/10"
            : "border-black/[0.06] bg-white group-hover:border-black/[0.10] group-hover:bg-white"
        }`}
      >
        <Image
          src={icon}
          alt=""
          width={18}
          height={18}
          className={`h-[18px] w-[18px] transition-all duration-500 group-hover:scale-110 ${
            isDark ? "invert" : ""
          }`}
        />
      </span>

      {/* Text */}
      <span className="relative flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[14px] font-medium leading-tight">
          {label}
        </span>
        <span
          className={`mt-0.5 truncate text-[11.5px] leading-tight ${
            isDark ? "text-white/55" : "text-black/45"
          }`}
        >
          {sub}
        </span>
      </span>

      {/* Arrow */}
      <span
        className={`relative shrink-0 transition-all duration-500 group-hover:translate-x-0.5 ${
          isDark ? "text-white/50 group-hover:text-white" : "text-black/25 group-hover:text-black/70"
        }`}
      >
        <ArrowIcon />
      </span>
    </Link>
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

  /* -------- Scroll detection -------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* -------- Outside click + ESC -------- */
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

  /* -------- Lock body scroll -------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* -------- Handlers -------- */
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
        {/*  LIQUID GLASS HEADER BACKGROUND — WHITE                       */}
        {/* ============================================================ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 border-b transition-all duration-500"
          style={{
            background: scrolled
              ? "rgba(255,255,255,0.78)"
              : "rgba(255,255,255,0.58)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            borderBottomColor: scrolled
              ? "rgba(0,0,0,0.07)"
              : "rgba(0,0,0,0.03)",
            boxShadow: scrolled
              ? "inset 0 -1px 0 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.03), 0 12px 40px -16px rgba(0,0,0,0.10)"
              : "inset 0 -1px 0 0 rgba(255,255,255,0.6)",
          }}
        />

        {/* Top sheen */}
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
          className="relative mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8 lg:px-10"
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
              style={{ filter: "brightness(0) saturate(100%)" }}
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
            {/* Mobile backdrop */}
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
                  "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.94) 100%)",
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
                {/* ---------- NAVIGATION ---------- */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40 whitespace-nowrap">
                    Navigation
                  </span>
                  <div className="h-px flex-1 bg-black/[0.06]" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {siteNavigation.map((item, i) => (
                    <MenuTile
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      sub={item.sub}
                      icon={item.icon}
                      delay={0.05 + i * 0.04}
                      onClick={closeMenu}
                    />
                  ))}
                </div>

                {/* ---------- YOUR ACCOUNT (logged in) ---------- */}
                {isLoggedIn && (
                  <>
                    <div className="mt-8 mb-3 flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40 whitespace-nowrap">
                        Your Account
                      </span>
                      <div className="h-px flex-1 bg-black/[0.06]" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {dashboardNavigation.map((item, i) => (
                        <MenuTile
                          key={item.href}
                          href={item.href}
                          label={item.label}
                          sub={item.sub}
                          icon={item.icon}
                          isActive={pathname === item.href}
                          delay={0.12 + i * 0.03}
                          onClick={closeMenu}
                        />
                      ))}

                      {/* Logout tile */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-red-200/70 bg-red-50/50 px-4 py-3.5 text-left transition-all duration-500 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:shadow-[0_16px_40px_-18px_rgba(220,38,38,0.25)] disabled:opacity-50"
                        style={{
                          animation: `hdr-item-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${
                            0.12 + dashboardNavigation.length * 0.03
                          }s both`,
                        }}
                      >
                        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200/70 bg-white transition-all duration-500 group-hover:scale-105">
                          <Image
                            src="/icons/logout.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px] transition-all duration-500"
                            style={{
                              filter:
                                "invert(18%) sepia(94%) saturate(2033%) hue-rotate(340deg) brightness(95%) contrast(92%)",
                            }}
                          />
                        </span>
                        <span className="relative flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-[14px] font-medium leading-tight text-red-600">
                            {loggingOut ? "Logging out..." : "Logout"}
                          </span>
                          <span className="mt-0.5 truncate text-[11.5px] leading-tight text-red-400/80">
                            End this session
                          </span>
                        </span>
                        <span className="relative shrink-0 text-red-300 transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-red-500">
                          <ArrowIcon />
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {/* ---------- GET STARTED (logged out) ---------- */}
                {!isLoggedIn && (
                  <>
                    <div className="mt-8 mb-3 flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40 whitespace-nowrap">
                        Get Started
                      </span>
                      <div className="h-px flex-1 bg-black/[0.06]" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <MenuTile
                        href="/signin"
                        label="Sign in"
                        sub="Welcome back"
                        icon="/icons/user.svg"
                        delay={0.15}
                        onClick={closeMenu}
                      />
                      <MenuTile
                        href="/signup"
                        label="Create your ID"
                        sub="It's free"
                        icon="/icons/id-card.svg"
                        delay={0.19}
                        onClick={closeMenu}
                        variant="dark"
                      />
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
