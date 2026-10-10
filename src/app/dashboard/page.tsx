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
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ================================================================== */
/*  Liquid glass — truly transparent (visible image behind it)         */
/* ================================================================== */
const liquidGlass = {
  background:
    "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.40) 45%, rgba(255,255,255,0.28) 100%)",
  backdropFilter: "blur(26px) saturate(180%)",
  WebkitBackdropFilter: "blur(26px) saturate(180%)",
  boxShadow:
    "inset 0 1px 0 0 rgba(255,255,255,0.85), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 18px 42px -22px rgba(0,0,0,0.28)",
} as const;

/* ================================================================== */
/*  Background layer — full viewport, no side gaps                    */
/* ================================================================== */
function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Image — full bleed, slightly oversized for Ken Burns */}
      <div
        className="absolute -inset-[6%]"
        style={{
          backgroundImage: "url('/images/img3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "db-kenburns 32s ease-in-out infinite",
        }}
      />
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
      className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.35] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_22px_48px_-22px_rgba(0,0,0,0.32)]"
      style={{
        ...liquidGlass,
        animation: `db-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />

      <div className="relative text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.35] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_22px_48px_-22px_rgba(0,0,0,0.32)]"
      style={{
        ...liquidGlass,
        animation: `db-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />

      <div className="relative flex items-center justify-between mb-2">
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

  useEffect(() => {
    (async () => {
      const res = await apiFetch<Data>("/api/user/profile");
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="relative isolate flex min-h-[80vh] items-center justify-center">
        <PageBackground />
        <div className="relative z-10 h-6 w-6 animate-spin rounded-full border-2 border-white/60 border-t-black/70" />
      </div>
    );
  }

  const profile = data?.profile;
  const name = profile?.display_name || profile?.first_name || "User";
  const isActive = profile?.account_status === "active";

  return (
    <div className="relative isolate min-h-[80vh]">
      {/* Keyframes */}
      <style jsx global>{`
        @keyframes db-item-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.99);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes db-banner-in {
          from {
            opacity: 0;
            transform: translateY(24px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes db-float-soft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes db-kenburns {
          0%, 100% { transform: scale(1.04) translate(0, 0); }
          50%      { transform: scale(1.12) translate(-1%, -0.8%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-db-anim] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          .db-bg-img {
            animation: none !important;
          }
        }
      `}</style>

      {/* ============================================================ */}
      {/*  FIXED FULL-VIEWPORT BACKGROUND — no side gaps                */}
      {/* ============================================================ */}
      <PageBackground />

      {/* ============================================================ */}
      {/*  CONTENT — centered, max-width for readability                */}
      {/* ============================================================ */}
      <div className="relative z-10 mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* ============================================================ */}
        {/*  WELCOME BANNER                                               */}
        {/* ============================================================ */}
        <div
          data-db-anim
          className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-7 sm:p-9"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
            animation:
              "db-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(180,200,255,0.5) 0%, rgba(180,200,255,0) 70%)",
              filter: "blur(36px)",
              animation: "db-float-soft 7s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,180,0.45) 0%, rgba(255,200,180,0) 70%)",
              filter: "blur(36px)",
              animation: "db-float-soft 7s ease-in-out 1.4s infinite",
            }}
          />

          <div className="relative">
            <div className="mb-5 flex items-center gap-4">
              <div
                className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[24px] border border-white/60 bg-white/45 p-1 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.45)]"
                style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
              >
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[19px] bg-black/10 text-2xl font-semibold text-black/70">
                  {profile?.profile_photo_url ? (
                    <img
                      src={profile.profile_photo_url}
                      alt={`${name}'s profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Your profile
                </div>
                <div className="mt-1 truncate text-lg font-semibold text-black/90">{name}</div>
                {profile?.username && (
                  <div className="mt-0.5 truncate text-[12px] text-black/60">@{profile.username}</div>
                )}
              </div>
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 backdrop-blur-md">
              <span
                className="h-1.5 w-1.5 rounded-full bg-black/80"
                style={{ animation: "db-float-soft 2.4s ease-in-out infinite" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/70">
                Welcome back
              </span>
            </div>

            <h1
              className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-black"
              style={{
                textShadow: "0 1px 12px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.6)",
              }}
            >
              {name}
            </h1>

            {profile?.binzeo_user_id && (
              <div
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-3 py-2"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 100%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.85), 0 2px 8px -4px rgba(0,0,0,0.10)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Your ID
                </span>
                <span className="font-mono text-[12.5px] font-medium text-black/85">
                  {profile.binzeo_user_id}
                </span>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur-md ${
                  isActive
                    ? "border-emerald-300/60 bg-emerald-100/50 text-emerald-800"
                    : "border-amber-300/60 bg-amber-100/50 text-amber-800"
                }`}
              >
                <span className="flex h-3.5 w-3.5 items-center justify-center">
                  <CheckIcon />
                </span>
                {isActive ? "Account verified" : "Action needed"}
              </span>

              <Link
                href="/dashboard/profile"
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 text-[11px] font-medium text-black/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.28)]"
              >
                Edit profile
                <span className="transition-transform duration-500 group-hover:translate-x-0.5">
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  QUICK STATS                                                  */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            title="Account Status"
            value={profile?.account_status ?? "—"}
            hint={isActive ? "Verified" : "Action needed"}
            delay={0.15}
          />
          <StatCard
            title="Country"
            value={profile?.country_code ?? "Not set"}
            hint="Your region"
            href="/dashboard/profile"
            delay={0.2}
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
            delay={0.25}
          />
          <StatCard
            title="Email"
            value={data?.user.email ? "Set" : "—"}
            hint={data?.user.email ?? ""}
            delay={0.3}
          />
        </div>

        {/* ============================================================ */}
        {/*  MANAGE                                                       */}
        {/* ============================================================ */}
        <div>
          <div
            className="mb-4 flex items-center gap-3"
            style={{
              animation:
                "db-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both",
            }}
          >
            <span
              className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-black/75"
              style={{
                textShadow: "0 1px 8px rgba(255,255,255,0.9)",
              }}
            >
              Manage
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.28), rgba(0,0,0,0))",
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
                delay={0.4 + i * 0.05}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
