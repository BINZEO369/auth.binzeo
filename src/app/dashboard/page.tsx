"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Profile = {
  binzeo_user_id: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
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
/*  Liquid glass wrapper helper                                        */
/* ================================================================== */
const liquidGlass = {
  background:
    "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.55) 100%)",
  backdropFilter: "blur(22px) saturate(180%)",
  WebkitBackdropFilter: "blur(22px) saturate(180%)",
  boxShadow:
    "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.45), 0 1px 2px rgba(0,0,0,0.03), 0 12px 32px -18px rgba(0,0,0,0.12)",
} as const;

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
      className="group relative h-full overflow-hidden rounded-2xl border border-black/[0.06] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-black/[0.10] hover:shadow-[0_20px_44px_-22px_rgba(0,0,0,0.20)]"
      style={{
        ...liquidGlass,
        animation: `db-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      {/* Sheen on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(0,0,0,0.04), transparent 60%)",
        }}
      />

      <div className="relative text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
        {title}
      </div>
      <div className="relative mt-2 truncate text-[17px] font-semibold text-black/85">
        {value}
      </div>
      {hint && (
        <div className="relative mt-1 truncate text-[11.5px] text-black/45">
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-black/[0.10] hover:shadow-[0_20px_44px_-22px_rgba(0,0,0,0.20)]"
      style={{
        ...liquidGlass,
        animation: `db-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      {/* Sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(0,0,0,0.04), transparent 60%)",
        }}
      />

      <div className="relative flex items-center justify-between mb-2">
        <div className="text-[14px] font-semibold text-black/85 transition-colors group-hover:text-black">
          {title}
        </div>
        <span className="text-black/25 transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-black/70">
          <ArrowIcon />
        </span>
      </div>
      <div className="relative text-[12px] leading-5 text-black/50">{desc}</div>
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
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />
      </div>
    );
  }

  const profile = data?.profile;
  const name = profile?.display_name || profile?.first_name || "User";
  const isActive = profile?.account_status === "active";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
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
      {/*  WELCOME BANNER — liquid glass, matches home hero            */}
      {/* ============================================================ */}
      <div
        data-db-anim
        className="relative overflow-hidden rounded-3xl border border-black/[0.06] p-7 sm:p-9"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(247,247,245,0.95) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.4), 0 24px 60px -28px rgba(0,0,0,0.18)",
          animation:
            "db-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
        }}
      >
        {/* Top sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
          }}
        />

        {/* Floating light blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(180,200,255,0.35) 0%, rgba(180,200,255,0) 70%)",
            filter: "blur(36px)",
            animation: "db-float-soft 7s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(255,200,180,0.30) 0%, rgba(255,200,180,0) 70%)",
            filter: "blur(36px)",
            animation: "db-float-soft 7s ease-in-out 1.4s infinite",
          }}
        />

        <div className="relative">
          {/* Kicker */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1.5 backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full bg-black"
              style={{ animation: "db-float-soft 2.4s ease-in-out infinite" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
              Welcome back
            </span>
          </div>

          <h1 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-black/90 sm:text-3xl">
            {name}
          </h1>

          {profile?.binzeo_user_id && (
            <div
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] px-3 py-2"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.65) 100%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,1), 0 2px 8px -4px rgba(0,0,0,0.06)",
              }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                Your ID
              </span>
              <span className="font-mono text-[12.5px] font-medium text-black/75">
                {profile.binzeo_user_id}
              </span>
            </div>
          )}

          {/* Quick status row */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                isActive
                  ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-700"
                  : "border-amber-200/70 bg-amber-50/70 text-amber-700"
              }`}
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center">
                <CheckIcon />
              </span>
              {isActive ? "Account verified" : "Action needed"}
            </span>

            <Link
              href="/dashboard/profile"
              className="group inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/60 px-3 py-1.5 text-[11px] font-medium text-black/70 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-black/[0.14] hover:text-black hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]"
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
        {/* Section heading — matches home pattern */}
        <div
          className="mb-4 flex items-center gap-3"
          style={{
            animation:
              "db-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both",
          }}
        >
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
            Manage
          </span>
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.10), rgba(0,0,0,0))",
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
  );
}
