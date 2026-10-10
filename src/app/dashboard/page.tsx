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
/*  Liquid glass                                                       */
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
/*  Background layer — user's profile photo (fallback: img3.jpg)       */
/* ================================================================== */
function PageBackground({ url }: { url?: string | null }) {
  const bg = url && url.trim().length > 0 ? url : "/images/img3.jpg";
  const usingProfilePhoto = Boolean(url && url.trim().length > 0);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Image — full bleed, oversized for Ken Burns */}
      <div
        key={bg}
        className="absolute -inset-[6%]"
        style={{
          backgroundImage: `url('${bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          animation: "db-kenburns 32s ease-in-out infinite",
        }}
      />

      {/* Readability overlay — stronger when the user's own photo is used */}
      <div
        className="absolute inset-0"
        style={{
          background: usingProfilePhoto
            ? "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.32) 30%, rgba(0,0,0,0.24) 55%, rgba(0,0,0,0.30) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.14) 100%)",
        }}
      />

      {/* Soft blur veil so the photo doesn't overpower the cards */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: usingProfilePhoto ? "blur(6px) saturate(120%)" : "blur(2px) saturate(120%)",
          WebkitBackdropFilter: usingProfilePhoto
            ? "blur(6px) saturate(120%)"
            : "blur(2px) saturate(120%)",
        }}
      />

      {/* Bottom fade into the page so cards read clearly */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60vh]"
        style={{
          background: usingProfilePhoto
            ? "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.28) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.15) 100%)",
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
      className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.35] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_22px_48px_-22px_rgba(0,0,0,0.42)]"
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
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.4), transparent 60%)",
        }}
      />

      <div className="relative text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.35] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_22px_48px_-22px_rgba(0,0,0,0.42)]"
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
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.4), transparent 60%)",
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

  const profile = data?.profile;
  const name = profile?.display_name || profile?.first_name || "User";
  const isActive = profile?.account_status === "active";
  const photo = profile?.profile_photo_url ?? null;
  const hasPhoto = Boolean(photo && photo.trim().length > 0);

  /* ---------------- loading state ---------------- */
  if (loading) {
    return (
      <div className="relative isolate flex min-h-[80vh] items-center justify-center">
        <PageBackground url={null} />
        <div className="relative z-10 h-6 w-6 animate-spin rounded-full border-2 border-white/60 border-t-black/70" />
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
          from { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes db-banner-in {
          from { opacity: 0; transform: translateY(24px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes db-float-soft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes db-kenburns {
          0%, 100% { transform: scale(1.05) translate(0, 0); }
          50%      { transform: scale(1.12) translate(-1%, -0.8%); }
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
      {/*  BACKGROUND — user's profile photo (fallback: img3.jpg)       */}
      {/* ============================================================ */}
      <PageBackground url={photo} />

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-3 sm:px-5">
        {/* ============================================================ */}
        {/*  HERO IDENTITY — takes ~40vh so cards start lower             */}
        {/* ============================================================ */}
        <section
          className="relative flex min-h-[42vh] flex-col items-center justify-center pt-16 pb-10 text-center sm:min-h-[46vh] sm:pt-20 sm:pb-14"
          style={{
            animation:
              "db-banner-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
          }}
        >
          {/* Avatar — big, prominent, floating over background */}
          <div className="relative mb-5" data-db-anim>
            <div
              className="relative h-28 w-28 overflow-hidden rounded-full border border-white/50 p-1 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] sm:h-36 sm:w-36"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.55) 100%)",
                backdropFilter: "blur(18px) saturate(180%)",
                WebkitBackdropFilter: "blur(18px) saturate(180%)",
              }}
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white/25 text-4xl font-semibold text-white/95 sm:text-5xl">
                {hasPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo!}
                    alt={`${name}'s profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    style={{
                      textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                    }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Online / verified dot */}
            {isActive && (
              <span
                className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-emerald-600 shadow-[0_6px_18px_-6px_rgba(16,185,129,0.6)]"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  animation: "db-float-soft 3s ease-in-out infinite",
                }}
                aria-hidden="true"
              >
                <CheckIcon />
              </span>
            )}
          </div>

          {/* Kicker */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-3 py-1.5 backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full bg-white/90"
              style={{ animation: "db-float-soft 2.4s ease-in-out infinite" }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/95">
              Welcome back
            </span>
          </div>

          {/* Name */}
          <h1
            className="mb-2 max-w-3xl text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl"
            style={{
              textShadow:
                "0 2px 20px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.35)",
            }}
          >
            {name}
          </h1>

          {/* Username */}
          {profile?.username && (
            <p
              className="mb-4 text-[13.5px] font-medium text-white/85"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
            >
              @{profile.username}
            </p>
          )}

          {/* ID + status pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {profile?.binzeo_user_id && (
              <div
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-3 py-2"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.7), 0 6px 20px -10px rgba(0,0,0,0.35)",
                  backdropFilter: "blur(18px) saturate(180%)",
                  WebkitBackdropFilter: "blur(18px) saturate(180%)",
                }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  ID
                </span>
                <span className="font-mono text-[12.5px] font-medium text-black/90">
                  {profile.binzeo_user_id}
                </span>
              </div>
            )}

            <Link
              href="/dashboard/profile"
              className="group inline-flex items-center gap-1.5 rounded-xl border border-white/40 px-3 py-2 text-[11.5px] font-medium text-black/85 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 100%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.7), 0 6px 20px -10px rgba(0,0,0,0.35)",
                backdropFilter: "blur(18px) saturate(180%)",
                WebkitBackdropFilter: "blur(18px) saturate(180%)",
              }}
            >
              Edit profile
              <span className="transition-transform duration-500 group-hover:translate-x-0.5">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  CARDS — start below the identity section                     */}
        {/* ============================================================ */}
        <div className="space-y-6 pb-10 sm:pb-14">
          {/* ---------- QUICK STATS ---------- */}
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

          {/* ---------- MANAGE ---------- */}
          <div>
            <div
              className="mb-4 flex items-center gap-3"
              style={{
                animation:
                  "db-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both",
              }}
            >
              <span
                className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90"
                style={{
                  textShadow: "0 1px 12px rgba(0,0,0,0.5)",
                }}
              >
                Manage
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0))",
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
    </div>
  );
}
