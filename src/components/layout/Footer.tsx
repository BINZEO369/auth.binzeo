"use client";

import Image from "next/image";
import Link from "next/link";

type FooterProps = {
  isLoggedIn?: boolean;
};

/* ================================================================== */
/*  Support / Sign-in method icons                                     */
/* ================================================================== */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M11.4 24H0V12.6h11.4V24z" fill="#F1511B" />
      <path d="M24 24H12.6V12.6H24V24z" fill="#80CC28" />
      <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#00ADEF" />
      <path d="M24 11.4H12.6V0H24v11.4z" fill="#FBBC09" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px]" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
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

/* ================================================================== */
/*  Social Network icons                                               */
/* ================================================================== */
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

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

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

/* ================================================================== */
/*  Data                                                               */
/* ================================================================== */
const supportMethods = [
  { label: "Google", href: "/signin", icon: <GoogleIcon /> },
  { label: "Microsoft", href: "/signin", icon: <MicrosoftIcon /> },
  { label: "Apple", href: "/signin", icon: <AppleIcon /> },
  { label: "Email", href: "/signin", icon: <EmailIcon /> },
  { label: "GitHub", href: "/signin", icon: <GitHubIcon /> },
];

const socialNetworks = [
  { label: "YouTube", href: "https://youtube.com", icon: <YouTubeIcon /> },
  { label: "Facebook", href: "https://facebook.com", icon: <FacebookIcon /> },
  { label: "X", href: "https://x.com", icon: <XIcon /> },
  { label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedInIcon /> },
  { label: "Instagram", href: "https://instagram.com", icon: <InstagramIcon /> },
];

const subCompanies = [
  { label: "Jabiyen", src: "/images/jabiyenlogo.png", href: "https://jabiyen.com" },
  { label: "Isyen", src: "/images/isyenlogo.png", href: "https://isyen.com" },
  { label: "Hiryen", src: "/images/hiryenlogo.png", href: "https://hiryen.com" },
  { label: "Bcloud", src: "/images/bcloudlogo.png", href: "https://bcloud.com" },
];

/* ================================================================== */
/*  Column heading                                                     */
/* ================================================================== */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">
      {children}
      <span
        aria-hidden="true"
        className="h-px w-8"
        style={{
          background: "linear-gradient(90deg, rgba(0,0,0,0.12), transparent)",
        }}
      />
    </h4>
  );
}

/* ================================================================== */
/*  Icon link row (Support / Social)                                   */
/* ================================================================== */
function IconLinkRow({
  href,
  label,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-black/70 transition-all duration-500 group-hover:scale-110"
      >
        {icon}
      </span>
      <span className="relative text-[13px] font-medium text-black/60 transition-colors duration-300 group-hover:text-black">
        {label}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-black transition-all duration-500 group-hover:w-full" />
      </span>
    </>
  );

  const className =
    "group inline-flex items-center gap-2.5 transition-all duration-300 hover:-translate-x-0.5";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={label}>
      {inner}
    </Link>
  );
}

/* ================================================================== */
/*  Footer                                                             */
/* ================================================================== */
export default function Footer({ isLoggedIn: _isLoggedIn = false }: FooterProps) {
  const year = new Date().getFullYear();

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
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:gap-12">
          {/* ---------- BRAND — LOGO ONLY, NO BOX, NO TEXT ---------- */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              aria-label="BINZEO home"
              className="mb-5 inline-flex items-center transition-all duration-500 hover:opacity-80"
            >
              <Image
                src="/logo.svg"
                alt="BINZEO"
                width={140}
                height={34}
                priority
                className="h-8 w-auto"
                style={{ filter: "brightness(0) saturate(100%)" }}
              />
            </Link>

            <p className="max-w-xs text-[13px] leading-6 text-black/55">
              Your secure digital identity — create, manage and share with
              confidence.
            </p>
          </div>

          {/* ---------- SUPPORT (Sign-up methods) ---------- */}
          <div>
            <ColumnHeading>Support</ColumnHeading>
            <ul className="space-y-2.5">
              {supportMethods.map((item) => (
                <li key={item.label}>
                  <IconLinkRow
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- SOCIAL NETWORK ---------- */}
          <div>
            <ColumnHeading>Social Network</ColumnHeading>
            <ul className="space-y-2.5">
              {socialNetworks.map((item) => (
                <li key={item.label}>
                  <IconLinkRow
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    external
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- SUB COMPANIES — logo only ---------- */}
          <div className="col-span-2 sm:col-span-1">
            <ColumnHeading>Companies</ColumnHeading>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-4">
              {subCompanies.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="group inline-flex items-center transition-all duration-500 hover:opacity-80"
                  >
                    <Image
                      src={item.src}
                      alt={item.label}
                      width={92}
                      height={28}
                      className="h-6 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: "grayscale(0.15) brightness(0.35)" }}
                    />
                  </a>
                </li>
              ))}
            </ul>
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

          <p className="text-black/40">Built with Next.js · Supabase</p>
        </div>
      </div>
    </footer>
  );
}
