"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Profile = {
  binzeo_user_id: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  username: string | null;
  country_code: string | null;
  account_status: string | null;
  profile_photo_url: string | null;
  created_at: string;
};

type Data = {
  profile: Profile | null;
  user: { id: string; email: string | null };
};

/* ================================================================== */
/*  Blur preference storage                                            */
/* ================================================================== */
const BLUR_STORAGE_KEY = "binzeo_dashboard_blur";
const BLUR_DEFAULT = 5;
const BLUR_MIN = 0;
const BLUR_MAX = 20;

function readStoredBlur(): number {
  if (typeof window === "undefined") return BLUR_DEFAULT;
  try {
    const raw = window.localStorage.getItem(BLUR_STORAGE_KEY);
    if (raw === null) return BLUR_DEFAULT;
    const n = Number(raw);
    if (!Number.isFinite(n)) return BLUR_DEFAULT;
    return Math.min(BLUR_MAX, Math.max(BLUR_MIN, n));
  } catch {
    return BLUR_DEFAULT;
  }
}

/* ================================================================== */
/*  Icons                                                              */
/* ================================================================== */
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function BlurIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6" opacity="0.55" />
      <circle cx="12" cy="12" r="9" opacity="0.25" />
    </svg>
  );
}

/* ================================================================== */
/*  Liquid glass                                                       */
/* ================================================================== */
const liquidGlass = {
  background:
    "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.58) 45%, rgba(255,255,255,0.46) 100%)",
  backdropFilter: "blur(30px) saturate(180%)",
  WebkitBackdropFilter: "blur(30px) saturate(180%)",
  boxShadow:
    "inset 0 1px 0 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.04), 0 22px 52px -24px rgba(0,0,0,0.35)",
} as const;

/* ================================================================== */
/*  Blur slider — liquid glass control                                 */
/* ================================================================== */
function BlurControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div
      className="group relative flex items-center gap-2.5 overflow-hidden rounded-full border border-white/45 px-3 py-2 text-black/85 transition-all duration-500 hover:border-white/70 sm:gap-3 sm:px-3.5"
      style={{
        background:
          "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 100%)",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.4), 0 10px 26px -12px rgba(0,0,0,0.4)",
        animation:
          "db-item-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
      }}
      title="Background blur"
    >
      {/* Sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)",
        }}
      />

      {/* Icon */}
      <span className="relative flex items-center text-black/70">
        <BlurIcon />
      </span>

      {/* Range slider */}
      <input
        type="range"
        min={BLUR_MIN}
        max={BLUR_MAX}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Background blur"
        className="bz-blur-range relative h-1 w-20 cursor-pointer appearance-none rounded-full outline-none sm:w-28"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) ${
            ((value - BLUR_MIN) / (BLUR_MAX - BLUR_MIN)) * 100
          }%, rgba(255,255,255,0.55) ${
            ((value - BLUR_MIN) / (BLUR_MAX - BLUR_MIN)) * 100
          }%, rgba(255,255,255,0.55) 100%)`,
        }}
      />

      {/* Value */}
      <span className="relative min-w-[34px] text-right font-mono text-[11px] font-medium tabular-nums text-black/75">
        {value}px
      </span>

      {/* Custom thumb + track styling */}
      <style jsx>{`
        .bz-blur-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: radial-gradient(
            120% 120% at 30% 20%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.85) 60%,
            rgba(240, 240, 240, 0.9) 100%
          );
          border: 1px solid rgba(0, 0, 0, 0.15);
          box-shadow:
            0 1px 0 0 rgba(255, 255, 255, 0.9) inset,
            0 4px 10px -3px rgba(0, 0, 0, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .bz-blur-range:hover::-webkit-slider-thumb {
          transform: scale(1.12);
        }
        .bz-blur-range:active::-webkit-slider-thumb {
          transform: scale(1.05);
        }
        .bz-blur-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: radial-gradient(
            120% 120% at 30% 20%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 0.85) 60%,
            rgba(240, 240, 240, 0.9) 100%
          );
          border: 1px solid rgba(0, 0, 0, 0.15);
          box-shadow:
            0 1px 0 0 rgba(255, 255, 255, 0.9) inset,
            0 4px 10px -3px rgba(0, 0, 0, 0.4),
            0 1px 2px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .bz-blur-range:hover::-moz-range-thumb {
          transform: scale(1.12);
        }
        .bz-blur-range::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 999px;
          background: transparent;
        }
        .bz-blur-range::-moz-range-track {
          height: 4px;
          border-radius: 999px;
          background: transparent;
        }
        .bz-blur-range:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

/* ================================================================== */
/*  Stat Card                                                          */
/* ================================================================== */
function StatCard({
  title,
  value,
  hint,
  href,
  delay = 0,
}: {
  title: string;
  value: string;
  hint?: string;
  href?: string;
  delay?: number;
}) {
  const inner = (
    <div
      className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.5] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.7] hover:shadow-[0_26px_56px_-22px_rgba(0,0,0,0.48)]"
      style={{
        ...liquidGlass,
        animation: `db-item-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.65), transparent 60%)",
        }}
      />
      <div className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
        {title}
      </div>
      <div className="relative mt-2 truncate text-[17px] font-semibold text-black/90">
        {value}
      </div>
      {hint && (
        <div className="relative mt-1 truncate text-[11.5px] text-black/60">
          {hint}
        </div>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}

/* ================================================================== */
/*  Manage tile                                                        */
/* ================================================================== */
function ManageTile({
  href,
  title,
  desc,
  delay = 0,
}: {
  href: string;
  title: string;
  desc: string;
  delay?: number;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.5] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.7] hover:shadow-[0_26px_56px_-22px_rgba(0,0,0,0.48)]"
      style={{
        ...liquidGlass,
        animation: `db-item-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.65), transparent 60%)",
        }}
      />
      <div className="relative mb-2 flex items-center justify-between">
        <div className="text-[14px] font-semibold text-black/90 transition-colors group-hover:text-black">
          {title}
        </div>
        <span className="text-black/40 transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-black/80">
          <ArrowIcon />
        </span>
      </div>
      <div className="relative text-[12px] leading-5 text-black/65">{desc}</div>
    </Link>
  );
}

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */
export default function DashboardOverviewPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [blur, setBlur] = useState<number>(BLUR_DEFAULT);

  /* -------- Load blur preference from localStorage -------- */
  useEffect(() => {
    setBlur(readStoredBlur());
  }, []);

  /* -------- Persist blur preference on change -------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(BLUR_STORAGE_KEY, String(blur));
    } catch {
      /* ignore quota / privacy errors */
    }
  }, [blur]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<Data>("/api/user/profile");
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, []);

  const profile = data?.profile;
  const name = profile?.display_name || profile?.first_name || "there";
  const isActive = profile?.account_status === "active";
  const photo = profile?.profile_photo_url ?? null;
  const hasPhoto = Boolean(photo && photo.trim().length > 0);
  const bg = hasPhoto ? photo! : "/images/img3.jpg";

  if (loading) {
    return (
      <div className="relative isolate flex min-h-screen items-center justify-center">
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage: "url('/images/img3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: `blur(${Math.min(blur + 2, BLUR_MAX)}px) saturate(115%)`,
            transform: "scale(1.06)",
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/25 backdrop-blur-sm" />
        <div className="relative z-10 h-6 w-6 animate-spin rounded-full border-2 border-white/60 border-t-white" />
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen w-full">
      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style jsx global>{`
        @keyframes db-item-in {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.99);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes db-float-soft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes db-kenburns {
          0%, 100% { transform: scale(1.04) translate(0, 0); }
          50%      { transform: scale(1.1) translate(-1%, -0.6%); }
        }
        @keyframes db-shimmer {
          0%   { transform: translateX(-8%); opacity: 0.55; }
          50%  { transform: translateX(8%); opacity: 0.8; }
          100% { transform: translateX(-8%); opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-db-anim] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      {/* ============================================================ */}
      {/*  BACKGROUND — starts right below the fixed app header         */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 z-0 h-[74vh] overflow-hidden sm:h-[72vh]"
        style={{ top: "60px" }}
      >
        {/* --- Photo layer: uses user blur preference --- */}
        <div
          key={bg}
          className="absolute -inset-[6%]"
          style={{
            backgroundImage: `url('${bg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            filter: `blur(${blur}px) saturate(125%) brightness(0.96)`,
            animation: "db-kenburns 32s ease-in-out infinite",
            transition: "filter 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {/* --- Liquid glass wet-sheen: multiple soft light pools --- */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(55% 40% at 12% 6%, rgba(255,255,255,0.32) 0%, transparent 62%),
              radial-gradient(40% 32% at 88% 18%, rgba(255,220,200,0.28) 0%, transparent 65%),
              radial-gradient(48% 38% at 22% 42%, rgba(200,220,255,0.20) 0%, transparent 68%),
              radial-gradient(60% 45% at 78% 62%, rgba(255,255,255,0.16) 0%, transparent 70%),
              radial-gradient(70% 55% at 50% 96%, rgba(255,255,255,0.22) 0%, transparent 72%)
            `,
          }}
        />

        {/* --- Slow shimmer sweep across the glass --- */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 -left-1/4 w-[150%] opacity-40 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 48%, rgba(255,255,255,0.15) 55%, transparent 70%)",
            animation: "db-shimmer 14s ease-in-out infinite",
          }}
        />

        {/* --- Depth & readability gradient --- */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.14) 26%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.16) 78%, rgba(0,0,0,0.28) 100%)",
          }}
        />

        {/* --- Bottom: soft blur veil --- */}
        <div
          className="absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            backdropFilter: "blur(10px) saturate(130%)",
            WebkitBackdropFilter: "blur(10px) saturate(130%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 38%, black 78%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 38%, black 78%)",
          }}
        />

        {/* --- Bottom: WHITE liquid-glass fade --- */}
        <div
          className="absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            background: `linear-gradient(180deg,
              rgba(247,247,245,0) 0%,
              rgba(247,247,245,0.06) 18%,
              rgba(247,247,245,0.22) 38%,
              rgba(247,247,245,0.52) 58%,
              rgba(247,247,245,0.82) 78%,
              rgba(247,247,245,0.96) 92%,
              rgba(247,247,245,1) 100%)`,
          }}
        />

        {/* --- Liquid glass boundary highlight (the wet edge) --- */}
        <div
          className="absolute inset-x-0 bottom-0 h-[26%]"
          style={{
            background: `radial-gradient(130% 100% at 50% 100%,
              rgba(255,255,255,0.65) 0%,
              rgba(255,255,255,0.22) 32%,
              rgba(255,255,255,0.05) 55%,
              transparent 78%)`,
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* ============================================================ */}
      {/*  HEADER — greeting left, blur control right                   */}
      {/* ============================================================ */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-start justify-between gap-4 px-4 pt-8 sm:px-6 sm:pt-10">
        {/* Greeting */}
        <div
          className="flex flex-col"
          style={{
            animation:
              "db-item-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
          }}
        >
          <span
            className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/85"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
          >
            Welcome back
          </span>
          <h1
            className="mt-1.5 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[34px]"
            style={{
              textShadow:
                "0 2px 20px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.45)",
            }}
          >
            Hi, {name}
          </h1>
        </div>

        {/* Blur control */}
        <BlurControl value={blur} onChange={setBlur} />
      </header>

      {/* ============================================================ */}
      {/*  CONTENT — cards sit on the white liquid-glass surface         */}
      {/* ============================================================ */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-3 sm:px-5">
        {/* Spacer — reserves the visible photo area above cards */}
        <div className="h-[44vh] sm:h-[42vh]" aria-hidden="true" />

        {/* ID + status pills floating over the white surface */}
        <div
          className="mb-4 flex flex-wrap items-center gap-2"
          style={{
            animation:
              "db-item-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
          }}
        >
          {profile?.binzeo_user_id && (
            <div
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-3 py-1.5 backdrop-blur-md"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 100%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.9), 0 8px 22px -10px rgba(0,0,0,0.28)",
              }}
            >
              <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-black/55">
                ID
              </span>
              <span className="font-mono text-[11.5px] font-medium text-black/85">
                {profile.binzeo_user_id}
              </span>
            </div>
          )}

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur-md ${
              isActive
                ? "border-emerald-300/70 bg-emerald-100/65 text-emerald-800"
                : "border-amber-300/70 bg-amber-100/65 text-amber-800"
            }`}
          >
            <span className="flex h-3.5 w-3.5 items-center justify-center">
              <CheckIcon />
            </span>
            {isActive ? "Verified" : "Action needed"}
          </span>
        </div>

        {/* ---------- QUICK STATS ---------- */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            title="Account Status"
            value={profile?.account_status ?? "—"}
            hint={isActive ? "Verified" : "Action needed"}
            delay={0.2}
          />
          <StatCard
            title="Country"
            value={profile?.country_code ?? "Not set"}
            hint="Your region"
            href="/dashboard/profile"
            delay={0.25}
          />
          <StatCard
            title="Member Since"
            value={
              profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"
            }
            delay={0.3}
          />
          <StatCard
            title="Email"
            value={data?.user.email ? "Set" : "—"}
            hint={data?.user.email ?? ""}
            delay={0.35}
          />
        </div>

        {/* ---------- MANAGE ---------- */}
        <div className="mt-6 sm:mt-8">
          <div
            className="mb-4 flex items-center gap-3"
            style={{
              animation:
                "db-item-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both",
            }}
          >
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-black/60">
              Manage
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0))",
              }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/dashboard/profile", title: "Profile", desc: "Personal info, photo, preferences" },
              { href: "/dashboard/addresses", title: "Addresses", desc: "Home, work, billing addresses" },
              { href: "/dashboard/contacts", title: "Contacts", desc: "Website, social, messenger" },
              { href: "/dashboard/sectors", title: "Sectors", desc: "Join industry sectors" },
              { href: "/dashboard/devices", title: "Devices", desc: "Logged-in devices" },
              { href: "/dashboard/security", title: "Security", desc: "Login history, activity log" },
            ].map((item, i) => (
              <ManageTile
                key={item.href}
                href={item.href}
                title={item.title}
                desc={item.desc}
                delay={0.45 + i * 0.05}
              />
            ))}
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-10 sm:h-14" aria-hidden="true" />
      </main>
    </div>
  );
}
