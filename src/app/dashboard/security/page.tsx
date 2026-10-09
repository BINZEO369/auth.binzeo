"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import TemporaryLoginTokens from "@/components/security/TemporaryLoginTokens";
import PasskeyManager from "@/components/security/PasskeyManager";
import TwoFactorSettings from "@/components/security/TwoFactorSettings";

type LoginEntry = {
  id: string;
  login_method: string | null;
  login_status: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  location_accuracy_meters: number | null;
  location_source: string | null;
  login_at: string;
  logout_at: string | null;
  user_devices: {
    device_name: string | null;
    device_type: string | null;
    operating_system: string | null;
    os_version: string | null;
    browser: string | null;
    browser_version: string | null;
  } | null;
};

type ActivityEntry = {
  id: string;
  activity_type: string;
  activity_description: string | null;
  ip_address: string | null;
  created_at: string;
};

type AuthMethod = {
  id: string;
  provider: string;
  auth_method: string;
  provider_email: string | null;
  first_seen_at: string;
  last_sign_in_at: string | null;
  login_count: number;
  last_event: string | null;
};

type Verification = {
  id: string;
  verification_type: string;
  verification_status: string;
  verified_at: string | null;
  last_requested_at: string | null;
  expires_at: string | null;
  attempt_count: number;
};

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

const containerCls =
  "relative z-10 mx-auto max-w-6xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8";

/* ================================================================== */
/*  Background                                                         */
/* ================================================================== */
function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute -inset-[6%]"
        style={{
          backgroundImage: "url('/images/img3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "sec-kenburns 32s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Icons                                                              */
/* ================================================================== */
function ChevronIcon() {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ================================================================== */
/*  Time helper                                                        */
/* ================================================================== */
function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

/* ================================================================== */
/*  Section heading                                                    */
/* ================================================================== */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0))",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Status pill — semantic color per status                            */
/* ================================================================== */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    success: "border-emerald-300/70 bg-emerald-100/60 text-emerald-800",
    verified: "border-emerald-300/70 bg-emerald-100/60 text-emerald-800",
    failed: "border-red-300/70 bg-red-100/60 text-red-800",
    blocked: "border-amber-300/70 bg-amber-100/60 text-amber-800",
    pending: "border-amber-300/70 bg-amber-100/60 text-amber-800",
  };
  const cls =
    map[status] ?? "border-white/40 bg-white/40 text-black/70";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md ${cls}`}
    >
      {status}
    </span>
  );
}

/* ================================================================== */
/*  PRIMARY BUTTON — always white text, forced                        */
/* ================================================================== */
function PrimaryButton({
  href,
  children,
  icon,
}: {
  href?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const cls =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black px-4 py-2.5 text-[12.5px] font-medium transition-all duration-500 hover:-translate-y-0.5";
  const style: React.CSSProperties = {
    background: "#0a0a0a",
    color: "#ffffff",
    boxShadow:
      "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 2px 4px rgba(0,0,0,0.08), 0 12px 28px -12px rgba(0,0,0,0.5)",
  };
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)",
        }}
      />
      {icon && <span className="relative flex items-center">{icon}</span>}
      <span className="relative" style={{ color: "#ffffff" }}>
        {children}
      </span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} style={style}>
      {inner}
    </button>
  );
}

/* ================================================================== */
/*  Empty state                                                        */
/* ================================================================== */
function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-10 text-center"
      style={{
        background:
          "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
      }}
    >
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/40"
        style={{
          background:
            "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 100%)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,1), 0 6px 16px -8px rgba(0,0,0,0.10)",
          animation: "sec-float-soft 4s ease-in-out infinite",
        }}
      >
        <Image
          src={icon}
          alt=""
          width={24}
          height={24}
          className="opacity-70"
        />
      </div>
      <p className="text-[13px] text-black/65">{text}</p>
    </div>
  );
}

/* ================================================================== */
/*  Tabs                                                               */
/* ================================================================== */
const TABS = [
  { id: "logins", label: "Login History" },
  { id: "activity", label: "Activity" },
  { id: "methods", label: "Auth Methods" },
  { id: "verifications", label: "Verifications" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */
export default function SecurityPage() {
  const [tab, setTab] = useState<TabId>("logins");
  const [logins, setLogins] = useState<LoginEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [methods, setMethods] = useState<AuthMethod[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, b, c, d] = await Promise.all([
        apiFetch<{ history: LoginEntry[] }>("/api/user/login-history?limit=50"),
        apiFetch<{ activities: ActivityEntry[] }>(
          "/api/user/activity-logs?limit=50"
        ),
        apiFetch<{ auth_methods: AuthMethod[] }>("/api/user/auth-methods"),
        apiFetch<{ verifications: Verification[] }>(
          "/api/user/verification-records"
        ),
      ]);
      if (a.success) setLogins(a.data.history);
      if (b.success) setActivities(b.data.activities);
      if (c.success) setMethods(c.data.auth_methods);
      if (d.success) setVerifications(d.data.verifications);
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

  return (
    <div className="relative isolate min-h-[80vh]">
      {/* KEYFRAMES */}
      <style jsx global>{`
        @keyframes sec-item-in {
          from { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes sec-banner-in {
          from { opacity: 0; transform: translateY(24px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes sec-float-soft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes sec-kenburns {
          0%, 100% { transform: scale(1.04) translate(0, 0); }
          50%      { transform: scale(1.12) translate(-1%, -0.8%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-sec-anim] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      <PageBackground />

      <div className={containerCls}>
        {/* ============================================================ */}
        {/*  HERO BANNER                                                  */}
        {/* ============================================================ */}
        <div
          data-sec-anim
          className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-6 sm:p-9"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
            animation:
              "sec-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
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
              animation: "sec-float-soft 7s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,180,0.45) 0%, rgba(255,200,180,0) 70%)",
              filter: "blur(36px)",
              animation: "sec-float-soft 7s ease-in-out 1.4s infinite",
            }}
          />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 backdrop-blur-md">
              <span
                className="h-1.5 w-1.5 rounded-full bg-black/80"
                style={{ animation: "sec-float-soft 2.4s ease-in-out infinite" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/70">
                Safety
              </span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0">
                <h1
                  className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-black sm:text-3xl"
                  style={{
                    textShadow:
                      "0 1px 12px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.6)",
                  }}
                >
                  Security
                </h1>
                <p className="max-w-lg text-[13.5px] leading-6 text-black/70">
                  Monitor your account activity and manage security settings.
                </p>
              </div>

              <PrimaryButton
                href="/dashboard/security/password"
                icon={<LockIcon className="h-4 w-4" />}
              >
                Change password
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  SECURITY TOOLS (existing components)                        */}
        {/* ============================================================ */}
        <div
          className="space-y-5 sm:space-y-6"
          style={{
            animation:
              "sec-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
          }}
        >
          <TemporaryLoginTokens />
          <PasskeyManager />
          <TwoFactorSettings />
        </div>

        {/* ============================================================ */}
        {/*  AUDIT LOGS — tabs inside liquid glass card                   */}
        {/* ============================================================ */}
        <section
          className="relative overflow-hidden rounded-3xl border border-white/[0.35] p-5 sm:p-7"
          style={{
            ...liquidGlass,
            animation:
              "sec-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
            }}
          />

          <div className="relative">
            <SectionHeading>Account Activity</SectionHeading>

            {/* Tabs — liquid glass pills */}
            <div className="mb-5 flex flex-wrap gap-2">
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-2 text-[12px] font-medium transition-all duration-500 ${
                      active
                        ? "border-black"
                        : "border-white/40 bg-white/40 text-black/70 backdrop-blur-md hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
                    }`}
                    style={
                      active
                        ? {
                            background: "#0a0a0a",
                            color: "#ffffff",
                            boxShadow:
                              "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 2px 4px rgba(0,0,0,0.08), 0 12px 28px -12px rgba(0,0,0,0.5)",
                          }
                        : undefined
                    }
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)",
                        }}
                      />
                    )}
                    <span
                      className="relative"
                      style={active ? { color: "#ffffff" } : undefined}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ---------- Login History ---------- */}
            {tab === "logins" && (
              <div className="space-y-3">
                {logins.length === 0 ? (
                  <EmptyState
                    icon="/icons/lock.svg"
                    text="No login history yet."
                  />
                ) : (
                  logins.map((l, i) => (
                    <article
                      key={l.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.35] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)] sm:p-5"
                      style={{
                        ...liquidGlass,
                        animation: `sec-item-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.05 + i * 0.03
                        }s both`,
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

                      <div className="relative flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {/* Top row — status + method */}
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusPill status={l.login_status} />
                            <span className="rounded-full border border-white/40 bg-white/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/65 backdrop-blur-md">
                              {l.login_method ?? "password"}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="truncate text-[12.5px] text-black/70">
                            {l.ip_address ?? "No IP"} ·{" "}
                            {[l.city, l.country].filter(Boolean).join(", ") ||
                              "Unknown location"}
                          </div>

                          {/* Coordinates */}
                          {l.latitude !== null && l.longitude !== null && (
                            <div className="mt-0.5 text-[11px] text-black/50">
                              {Number(l.latitude).toFixed(6)},{" "}
                              {Number(l.longitude).toFixed(6)}
                              {l.location_accuracy_meters !== null &&
                                ` · ±${Math.round(
                                  l.location_accuracy_meters
                                )}m`}
                              {l.location_source &&
                                ` · ${l.location_source.replace(/_/g, " ")}`}
                            </div>
                          )}

                          {/* Device */}
                          {l.user_devices && (
                            <div className="mt-1 text-[11.5px] text-black/55">
                              {l.user_devices.device_name ??
                                l.user_devices.device_type ??
                                "Unknown device"}
                              {l.user_devices.operating_system &&
                                ` · ${l.user_devices.operating_system}${
                                  l.user_devices.os_version
                                    ? ` ${l.user_devices.os_version}`
                                    : ""
                                }`}
                              {l.user_devices.browser &&
                                ` · ${l.user_devices.browser}${
                                  l.user_devices.browser_version
                                    ? ` ${l.user_devices.browser_version}`
                                    : ""
                                }`}
                            </div>
                          )}

                          {/* User agent */}
                          {l.user_agent && (
                            <div
                              className="mt-1 truncate text-[10.5px] text-black/40"
                              title={l.user_agent}
                            >
                              {l.user_agent}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 text-[11px] font-medium text-black/55">
                          {timeAgo(l.login_at)}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* ---------- Activity ---------- */}
            {tab === "activity" && (
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <EmptyState
                    icon="/icons/history.svg"
                    text="No activity recorded yet."
                  />
                ) : (
                  activities.map((a, i) => (
                    <article
                      key={a.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.35] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)] sm:p-5"
                      style={{
                        ...liquidGlass,
                        animation: `sec-item-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.05 + i * 0.03
                        }s both`,
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

                      <div className="relative flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 text-[13px] font-semibold capitalize text-black/90">
                            {a.activity_type.replace(/_/g, " ")}
                          </div>
                          {a.activity_description && (
                            <div className="text-[12px] text-black/60">
                              {a.activity_description}
                            </div>
                          )}
                          {a.ip_address && (
                            <div className="mt-1 text-[11px] text-black/45">
                              IP: {a.ip_address}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 text-[11px] font-medium text-black/55">
                          {timeAgo(a.created_at)}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* ---------- Auth Methods ---------- */}
            {tab === "methods" && (
              <div className="space-y-3">
                {methods.length === 0 ? (
                  <EmptyState
                    icon="/icons/lock.svg"
                    text="No auth methods linked yet."
                  />
                ) : (
                  methods.map((m, i) => (
                    <article
                      key={m.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.35] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)] sm:p-5"
                      style={{
                        ...liquidGlass,
                        animation: `sec-item-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.05 + i * 0.03
                        }s both`,
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

                      <div className="relative flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="text-[13px] font-semibold capitalize text-black/90">
                              {m.auth_method.replace(/_/g, " ")}
                            </span>
                            <span className="text-[11px] text-black/55">
                              via {m.provider}
                            </span>
                          </div>
                          {m.provider_email && (
                            <div className="text-[12px] text-black/60">
                              {m.provider_email}
                            </div>
                          )}
                          <div className="mt-1 text-[11px] text-black/50">
                            Signed in {m.login_count} time
                            {m.login_count !== 1 ? "s" : ""}
                            {m.last_sign_in_at &&
                              ` · Last: ${timeAgo(m.last_sign_in_at)}`}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-white/40 bg-white/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/70 backdrop-blur-md">
                          {m.last_event ?? "linked"}
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* ---------- Verifications ---------- */}
            {tab === "verifications" && (
              <div className="space-y-3">
                {verifications.length === 0 ? (
                  <EmptyState
                    icon="/icons/check.svg"
                    text="No verification records yet."
                  />
                ) : (
                  verifications.map((v, i) => (
                    <article
                      key={v.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.35] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.28)] sm:p-5"
                      style={{
                        ...liquidGlass,
                        animation: `sec-item-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.05 + i * 0.03
                        }s both`,
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

                      <div className="relative flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="text-[13px] font-semibold capitalize text-black/90">
                              {v.verification_type}
                            </span>
                            <StatusPill status={v.verification_status} />
                          </div>
                          <div className="text-[11.5px] text-black/60">
                            {v.verified_at
                              ? `Verified ${timeAgo(v.verified_at)}`
                              : v.last_requested_at
                              ? `Requested ${timeAgo(v.last_requested_at)}`
                              : "No activity"}
                          </div>
                          <div className="mt-0.5 text-[11px] text-black/45">
                            Attempts: {v.attempt_count}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
