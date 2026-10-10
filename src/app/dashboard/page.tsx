"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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

function SlidersIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <circle cx="9" cy="7" r="2" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="15" cy="17" r="2" />
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
/*  Blur control — fixed-position popover always inside viewport       */
/* ================================================================== */
function BlurControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const POPOVER_W = 248;
  const POPOVER_H = 190;

  /* ---- compute safe position ---- */
  const recalc = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const pad = 12;

    /* Horizontal — right-align with button but keep inside viewport */
    let left = rect.right - POPOVER_W;
    if (left < pad) left = pad;
    if (left + POPOVER_W > window.innerWidth - pad) {
      left = window.innerWidth - POPOVER_W - pad;
    }

    /* Vertical — prefer above; fall back below if no room */
    let top = rect.top - POPOVER_H - 12;
    if (top < pad) top = rect.bottom + 12;

    setCoords({ top, left });
  }, []);

  /* ---- on open: compute + listen to scroll/resize ---- */
  useEffect(() => {
    if (!open) return;
    recalc();
    const onScroll = () => recalc();
    const onResize = () => recalc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open, recalc]);

  /* ---- close on outside click + ESC ---- */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapperRef.current?.contains(t)) return;
      /* also ignore clicks inside the popover itself */
      const pop = document.getElementById("bz-blur-popover");
      if (pop && pop.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pct = ((value - BLUR_MIN) / (BLUR_MAX - BLUR_MIN)) * 100;

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      {/* Trigger — compact pill matching sibling status pill */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Adjust background blur"
        title="Adjust background blur"
        aria-expanded={open}
        aria-controls="bz-blur-popover"
        className="group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5"
        style={{
          borderColor: open ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.5)",
          background: open
            ? "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)"
            : "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 100%)",
          boxShadow: open
            ? "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.55), 0 10px 26px -12px rgba(0,0,0,0.4)"
            : "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.4), 0 8px 22px -10px rgba(0,0,0,0.3)",
          color: "rgba(0,0,0,0.8)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), transparent 60%)",
          }}
        />
        <span className="relative flex items-center">
          <SlidersIcon />
        </span>
        <span className="relative font-mono text-[10.5px] tabular-nums text-black/70">
          {value}
        </span>
      </button>

      {/* Popover — position: fixed → always inside viewport, never clipped */}
      {open && coords && (
        <div
          id="bz-blur-popover"
          role="dialog"
          aria-label="Background blur settings"
          className="w-[248px] rounded-2xl border border-white/50 p-4"
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
            background:
              "radial-gradient(140% 120% at 20% 0%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 45%, rgba(255,255,255,0.78) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.55), 0 28px 60px -20px rgba(0,0,0,0.5), 0 12px 30px -12px rgba(0,0,0,0.25)",
            animation:
              "blur-pop-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
            transformOrigin: "center bottom",
          }}
        >
          {/* Top sheen */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
            }}
          />
          {/* Bottom sheen */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-2xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />

          {/* Header */}
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/60 text-black/70"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 100%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,1), 0 2px 6px -2px rgba(0,0,0,0.12)",
                }}
              >
                <SlidersIcon className="h-3 w-3" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/70">
                Blur
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold tabular-nums text-black/80">
              {value}px
            </span>
          </div>

          {/* Slider — thumb is a perfect circle centered on the track */}
          <div className="bz-blur-wrap relative flex h-4 w-full items-center">
            <input
              type="range"
              min={BLUR_MIN}
              max={BLUR_MAX}
              step={1}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              aria-label="Background blur"
              className="bz-blur-range relative z-10 m-0 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-transparent p-0 outline-none"
              style={{
                background: `linear-gradient(90deg, #0a0a0a 0%, #0a0a0a ${pct}%, rgba(0,0,0,0.14) ${pct}%, rgba(0,0,0,0.14) 100%)`,
                backgroundSize: "100% 6px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>

          {/* Min / Max labels */}
          <div className="mt-2.5 flex items-center justify-between text-[9.5px] font-semibold uppercase tracking-[0.14em] text-black/40">
            <span>Sharp</span>
            <span>Soft</span>
          </div>

          <style jsx>{`
            /* ---- WebKit / Chromium ---- */
            .bz-blur-range::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 999px;
              /* center 16px thumb on 6px track → (16-6)/2 = 5 */
              margin-top: -5px;
              background: radial-gradient(
                120% 120% at 30% 20%,
                rgba(255, 255, 255, 1) 0%,
                rgba(250, 250, 250, 0.98) 55%,
                rgba(235, 235, 235, 1) 100%
              );
              border: 1px solid rgba(0, 0, 0, 0.15);
              box-shadow:
                0 1px 0 0 rgba(255, 255, 255, 1) inset,
                0 4px 10px -2px rgba(0, 0, 0, 0.35),
                0 1px 2px rgba(0, 0, 0, 0.15);
              cursor: grab;
              transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .bz-blur-range:hover::-webkit-slider-thumb {
              transform: scale(1.12);
            }
            .bz-blur-range:active::-webkit-slider-thumb {
              cursor: grabbing;
              transform: scale(1.02);
            }
            .bz-blur-range::-webkit-slider-runnable-track {
              height: 6px;
              border-radius: 999px;
              background: transparent;
            }

            /* ---- Firefox ---- */
            .bz-blur-range::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 999px;
              background: radial-gradient(
                120% 120% at 30% 20%,
                rgba(255, 255, 255, 1) 0%,
                rgba(250, 250, 250, 0.98) 55%,
                rgba(235, 235, 235, 1) 100%
              );
              border: 1px solid rgba(0, 0, 0, 0.15);
              box-shadow:
                0 1px 0 0 rgba(255, 255, 255, 1) inset,
                0 4px 10px -2px rgba(0, 0, 0, 0.35),
                0 1px 2px rgba(0, 0, 0, 0.15);
              cursor: grab;
              transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .bz-blur-range:hover::-moz-range-thumb {
              transform: scale(1.12);
            }
            .bz-blur-range::-moz-range-track {
              height: 6px;
              border-radius: 999px;
              background: transparent;
            }

            .bz-blur-range:focus-visible {
              outline: none;
              box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6);
            }
          `}</style>
        </div>
      )}
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

  useEffect(() => {
    setBlur(readStoredBlur());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(BLUR_STORAGE_KEY, String(blur));
    } catch {
      /* ignore */
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

  const email = data?.user?.email ?? null;
  const country = profile?.country_code
    ? profile.country_code.toUpperCase()
    : null;

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
        @keyframes db-sub-in {
          0% {
            opacity: 0;
            transform: translateY(-10px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
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
        @keyframes blur-pop-in {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.96);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-db-anim],
          [data-db-anim] * {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      {/* ============================================================ */}
      {/*  BACKGROUND                                                   */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 z-0 h-[76vh] overflow-hidden sm:h-[74vh]"
        style={{ top: "60px" }}
      >
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

        <div
          aria-hidden="true"
          className="absolute inset-y-0 -left-1/4 w-[150%] opacity-40 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 48%, rgba(255,255,255,0.15) 55%, transparent 70%)",
            animation: "db-shimmer 14s ease-in-out infinite",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.14) 26%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.16) 78%, rgba(0,0,0,0.28) 100%)",
          }}
        />

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
      {/*  HEADER                                                       */}
      {/* ============================================================ */}
      <header className="relative z-20 mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12">
        <div className="min-w-0">
          <p
            className="text-[13px] font-medium uppercase tracking-[0.28em] text-white/85 sm:text-[14px]"
            style={{
              textShadow: "0 1px 14px rgba(0,0,0,0.55)",
              animation:
                "db-item-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
            }}
          >
            Welcome
          </p>

          <h1
            key={name}
            className="mt-2 text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[42px]"
            style={{
              textShadow:
                "0 3px 24px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.45)",
              animation:
                "db-sub-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both",
            }}
          >
            {name}
          </h1>

          <div
            className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] font-medium text-white/85"
            style={{
              textShadow: "0 1px 12px rgba(0,0,0,0.5)",
              animation:
                "db-sub-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both",
            }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="opacity-60">✉</span>
              <span className="truncate max-w-[210px] sm:max-w-none">
                {email ?? "Unknown"}
              </span>
            </span>

            <span aria-hidden="true" className="opacity-50">
              ·
            </span>

            <span className="inline-flex items-center gap-1.5">
              <span className="opacity-60">◍</span>
              <span>{country ?? "Unknown"}</span>
            </span>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-3 sm:px-5">
        <div className="h-[46vh] sm:h-[44vh]" aria-hidden="true" />

        {/* ID + Verified + Blur control */}
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

          <BlurControl value={blur} onChange={setBlur} />
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            title="Account Status"
            value={profile?.account_status ?? "—"}
            hint={isActive ? "Verified" : "Action needed"}
            delay={0.2}
          />
          <StatCard
            title="Country"
            value={country ?? "Unknown"}
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
            value={email ? "Set" : "Unknown"}
            hint={email ?? ""}
            delay={0.35}
          />
        </div>

        {/* MANAGE */}
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

        <div className="h-10 sm:h-14" aria-hidden="true" />
      </main>
    </div>
  );
}
