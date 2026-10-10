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

/* ================================================================== */
/*  Liquid glass                                                       */
/* ================================================================== */
const liquidGlass = {
  background:
    "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.62) 45%, rgba(255,255,255,0.5) 100%)",
  backdropFilter: "blur(30px) saturate(200%)",
  WebkitBackdropFilter: "blur(30px) saturate(200%)",
  boxShadow:
    "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.04), 0 22px 52px -24px rgba(0,0,0,0.35)",
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
      className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.55] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.75] hover:shadow-[0_26px_56px_-22px_rgba(0,0,0,0.48)]"
      style={{
        ...liquidGlass,
        animation: `db-item-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      {/* Liquid glass sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.75), transparent 60%)",
        }}
      />
      {/* Top inner highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.55] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.75] hover:shadow-[0_26px_56px_-22px_rgba(0,0,0,0.48)]"
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
            "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.75), transparent 60%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
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
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/img3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(6px) saturate(130%)",
            transform: "scale(1.06)",
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/25 backdrop-blur-md" />
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
          0%, 100% { transform: scale(1.05) translate(0, 0); }
          50%      { transform: scale(1.11) translate(-0.8%, -0.6%); }
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
      {/*  HEADER — clean white strip above the background image        */}
      {/* ============================================================ */}
      <header className="relative z-30 w-full">
        <div
          className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8"
          style={{
            animation:
              "db-item-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
          }}
        >
          <div className="flex flex-col">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-black/45">
              Welcome back
            </span>
            <h1 className="mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-black/90 sm:text-[30px]">
              Hi, {name}
            </h1>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/*  BACKGROUND — starts below the header, ~66vh of the top       */}
      {/*  Behind it: blurred user photo with liquid-glass finish       */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 z-0 h-[66vh] overflow-hidden sm:h-[64vh]"
        style={{
          top: "calc(8rem + 72px)", /* header height + spacing */
        }}
      >
        {/* Blurred photo layer — LIGHTER blur, more liquid-glass */}
        <div
          key={bg}
          className="absolute -inset-[6%]"
          style={{
            backgroundImage: `url('${bg}')`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            filter: "blur(6px) saturate(140%) brightness(0.96)",
            animation: "db-kenburns 32s ease-in-out infinite",
          }}
        />

        {/* Liquid-glass sheen — moist, wet-glass radial highlights */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(55% 42% at 14% 6%, rgba(255,255,255,0.32) 0%, transparent 62%),
              radial-gradient(42% 32% at 90% 20%, rgba(255,225,205,0.26) 0%, transparent 66%),
              radial-gradient(75% 58% at 55% 98%, rgba(255,255,255,0.2) 0%, transparent 72%)
            `,
          }}
        />

        {/* Liquid-glass top edge — soft transition from white header */}
        <div
          className="absolute inset-x-0 top-0 h-[12%]"
          style={{
            background: `linear-gradient(180deg,
              rgba(247,247,245,1) 0%,
              rgba(247,247,245,0.75) 35%,
              rgba(247,247,245,0.28) 70%,
              rgba(247,247,245,0) 100%)`,
          }}
        />

        {/* Depth gradient for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.16) 60%, rgba(0,0,0,0.26) 82%, rgba(0,0,0,0.34) 100%)",
          }}
        />

        {/* Bottom — blur veil (helps the white fade look liquid) */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            backdropFilter: "blur(12px) saturate(130%)",
            WebkitBackdropFilter: "blur(12px) saturate(130%)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 40%, black 78%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 40%, black 78%)",
          }}
        />

        {/* Bottom — WHITE liquid-glass fade into the page surface */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background: `linear-gradient(180deg,
              rgba(247,247,245,0) 0%,
              rgba(247,247,245,0.10) 20%,
              rgba(247,247,245,0.32) 42%,
              rgba(247,247,245,0.66) 64%,
              rgba(247,247,245,0.9) 84%,
              rgba(247,247,245,0.99) 95%,
              rgba(247,247,245,1) 100%)`,
          }}
        />

        {/* Liquid-glass inner sheen on the boundary */}
        <div
          className="absolute inset-x-0 bottom-0 h-[22%]"
          style={{
            background: `radial-gradient(130% 100% at 50% 100%,
              rgba(255,255,255,0.6) 0%,
              rgba(255,255,255,0.18) 42%,
              transparent 78%)`,
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* ============================================================ */}
      {/*  CONTENT — cards sit on the white liquid-glass surface        */}
      {/* ============================================================ */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-3 sm:px-5">
        {/* Spacer — reserves the visible photo area above cards */}
        <div className="h-[38vh] sm:h-[36vh]" aria-hidden="true" />

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
              className="inline-flex items-center gap-2 rounded-full border border-white/55 px-3 py-1.5 backdrop-blur-md"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.95), 0 8px 22px -10px rgba(0,0,0,0.28)",
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
                ? "border-emerald-300/75 bg-emerald-100/70 text-emerald-800"
                : "border-amber-300/75 bg-amber-100/70 text-amber-800"
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
