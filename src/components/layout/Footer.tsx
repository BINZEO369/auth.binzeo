"use client";

import Image from "next/image";
import Link from "next/link";

type FooterProps = {
  isLoggedIn?: boolean;
};

/* ================================================================== */
/*  Social Icons                                                       */
/* ================================================================== */
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

/* ================================================================== */
/*  Social button                                                      */
/* ================================================================== */
function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-black/[0.06] text-black/60 transition-all duration-500 hover:-translate-y-0.5 hover:border-black/[0.12] hover:text-black hover:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.22)]"
      style={{
        background:
          "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.75) 40%, rgba(255,255,255,0.5) 100%)",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 6px -2px rgba(0,0,0,0.06)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(0,0,0,0.06), transparent 65%)",
        }}
      />
      <span className="relative">{children}</span>
    </a>
  );
}

/* ================================================================== */
/*  Footer                                                             */
/* ================================================================== */
export default function Footer({ isLoggedIn = false }: FooterProps) {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative z-10 shrink-0 overflow-hidden">
      {/* ============================================================ */}
      {/*  LIQUID GLASS WHITE BACKGROUND                                */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(247,247,245,0.95) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
        }}
      />

      {/* Top sheen line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
        }}
      />

      {/* Soft floating light blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(180,200,255,0.35) 0%, rgba(180,200,255,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,180,0.28) 0%, rgba(255,200,180,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:gap-14">
          {/* ---------- BRAND ---------- */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="group mb-5 inline-flex items-center gap-3 transition-opacity duration-300 hover:opacity-80"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.06] p-2 transition-all duration-500 group-hover:scale-105"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 100%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,1), 0 4px 12px -6px rgba(0,0,0,0.10)",
                }}
              >
                <Image
                  src="/logo.svg"
                  alt="BINZEO"
                  width={122}
                  height={29}
                  className="h-full w-full object-contain"
                  style={{ filter: "brightness(0) saturate(100%)" }}
                />
              </span>
              <span className="text-[15px] font-semibold tracking-[0.16em] text-black/85">
                BINZEO
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-[13.5px] leading-6 text-black/55">
              Your secure digital identity — create, manage and share with
              confidence.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2">
              <SocialButton href="https://x.com" label="X (Twitter)">
                <XIcon />
              </SocialButton>
              <SocialButton href="https://linkedin.com" label="LinkedIn">
                <LinkedInIcon />
              </SocialButton>
              <SocialButton href="https://github.com" label="GitHub">
                <GitHubIcon />
              </SocialButton>
            </div>
          </div>

          {/* ---------- PRODUCT ---------- */}
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Product
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.12), transparent)",
                }}
              />
            </h4>
            <ul className="space-y-2.5 text-[13.5px] text-black/60">
              <li>
                <Link
                  href={isLoggedIn ? "/dashboard" : "/signup"}
                  className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-black"
                >
                  <span className="relative">
                    {isLoggedIn ? "Dashboard" : "Get started"}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-500 group-hover:w-full" />
                  </span>
                </Link>
              </li>
              {!isLoggedIn && (
                <li>
                  <Link
                    href="/signin"
                    className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-black"
                  >
                    <span className="relative">
                      Sign in
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-500 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/#why-binzeo"
                  className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-black"
                >
                  <span className="relative">
                    Why BINZEO
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-500 group-hover:w-full" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ---------- EXPLORE ---------- */}
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Explore
              <span
                aria-hidden="true"
                className="h-px w-8"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.12), transparent)",
                }}
              />
            </h4>
            <ul className="space-y-2.5 text-[13.5px] text-black/60">
              <li>
                <Link
                  href="/#how-it-works"
                  className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-black"
                >
                  <span className="relative">
                    How it works
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-500 group-hover:w-full" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#security"
                  className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-black"
                >
                  <span className="relative">
                    Security
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-500 group-hover:w-full" />
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-black"
                >
                  <span className="relative">
                    Home
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-500 group-hover:w-full" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* ---------- CTA CARD ---------- */}
          <div className="col-span-2 sm:col-span-1">
            <div
              className="relative overflow-hidden rounded-2xl border border-black/[0.06] p-5"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 10%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.65) 60%, rgba(255,255,255,0.4) 100%)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.35), 0 12px 32px -16px rgba(0,0,0,0.12)",
              }}
            >
              {/* subtle sheen */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full opacity-70"
                style={{
                  background:
                    "radial-gradient(circle, rgba(180,200,255,0.45) 0%, transparent 70%)",
                  filter: "blur(14px)",
                }}
              />

              <h4 className="relative mb-1.5 text-[14px] font-semibold text-black/85">
                {isLoggedIn ? "You're all set" : "Own your identity"}
              </h4>
              <p className="relative mb-4 text-[12.5px] leading-5 text-black/55">
                {isLoggedIn
                  ? "Manage your profile, devices and sessions from one calm place."
                  : "Create your secure digital ID in under a minute. Free forever."}
              </p>

              <Link
                href={isLoggedIn ? "/dashboard" : "/signup"}
                className="group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full px-4 py-2.5 text-[12.5px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 1px 2px rgba(0,0,0,0.2), 0 10px 24px -10px rgba(0,0,0,0.5)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 60%)",
                  }}
                />
                <span className="relative">
                  {isLoggedIn ? "Open dashboard" : "Create your ID"}
                </span>
                <span className="relative transition-transform duration-500 group-hover:translate-x-0.5">
                  <ArrowRightIcon />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  BOTTOM BAR                                                   */}
        {/* ============================================================ */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/[0.06] pt-6 text-[12px] sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
            <p className="text-black/50">
              © {year} BINZEO Labs. All rights reserved.
            </p>
            <span
              aria-hidden="true"
              className="hidden h-1 w-1 rounded-full bg-black/20 sm:block"
            />
            <div className="flex items-center gap-4 text-black/45">
              <Link
                href="/privacy"
                className="transition-colors duration-300 hover:text-black"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition-colors duration-300 hover:text-black"
              >
                Terms
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-black/40">Built with Next.js · Supabase</p>

            {/* Back to top button — liquid glass */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-black/[0.06] text-black/60 transition-all duration-500 hover:-translate-y-0.5 hover:border-black/[0.12] hover:text-black hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.22)]"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.45) 100%)",
                backdropFilter: "blur(18px) saturate(180%)",
                WebkitBackdropFilter: "blur(18px) saturate(180%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 6px -2px rgba(0,0,0,0.06)",
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(0,0,0,0.06), transparent 65%)",
                }}
              />
              <span className="relative transition-transform duration-500 group-hover:-translate-y-0.5">
                <ArrowUpIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
