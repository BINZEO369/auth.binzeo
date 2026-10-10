"use client";
import Loader from "@/components/ui/Loader";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Profile = {
  binzeo_user_id: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  display_name: string | null;
  username: string | null;
  date_of_birth: string | null;
  age?: number | null;
  gender: string | null;
  profile_photo_url: string | null;
  profile_photo_public_id?: string | null;
  country_code: string | null;
  preferred_language: string | null;
  timezone: string | null;
  date_format: string | null;
  time_format: string | null;
  currency: string | null;
  recovery_email: string | null;
  marketing_email: boolean;
  marketing_sms: boolean;
  push_notifications: boolean;
  security_notifications: boolean;
};

type Data = {
  profile: Profile | null;
  user: { id: string; email: string | null };
};

type UsernameCheck = {
  checking: boolean;
  available: boolean;
  checked: string;
  message: string;
  suggestions: string[];
};

/* ================================================================== */
/*  Liquid glass — same as dashboard / addresses                       */
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
/*  SHARED LAYOUT TOKENS                                               */
/* ================================================================== */
const containerCls =
  "relative z-10 mx-auto max-w-6xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 backdrop-blur-md text-black/90 text-[15px] placeholder-black/35 focus:outline-none focus:border-white/60 focus:bg-white/60 focus:ring-4 focus:ring-white/30 transition-all duration-300";

/* ================================================================== */
/*  Background layer — full viewport, no gaps                          */
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
          animation: "prof-kenburns 32s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Chevron icon                                                       */
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

/* ================================================================== */
/*  Field wrapper                                                      */
/* ================================================================== */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[11.5px] leading-5 text-black/50">{hint}</p>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Toggle row (liquid glass)                                          */
/* ================================================================== */
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/40 p-4 backdrop-blur-md transition-colors duration-300 hover:border-white/60 hover:bg-white/60">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-black/90">{label}</div>
        <div className="mt-0.5 text-[11.5px] text-black/55">{description}</div>
      </div>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-6 w-11 rounded-full bg-white/60 transition-colors duration-300 peer-checked:bg-black/90" />
        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

/* ================================================================== */
/*  Collapsible section — liquid glass card with animated header       */
/* ================================================================== */
function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  delay = 0,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/[0.35] transition-all duration-500 hover:border-white/[0.5]"
      style={{
        ...liquidGlass,
        animation: `prof-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      {/* Top sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
        }}
      />

      {/* Header — always visible, clickable */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="group relative z-10 flex w-full items-center justify-between gap-3 px-6 py-5 text-left transition-colors duration-300 sm:px-7 sm:py-6"
      >
        {/* Hover sheen */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.35), transparent 60%)",
          }}
        />

        <div className="relative flex min-w-0 flex-1 items-center gap-3">
          <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-black/70">
            {title}
          </span>
          <span
            aria-hidden="true"
            className="h-px min-w-6 flex-1"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0))",
            }}
          />
        </div>

        {/* Chevron button (visual) */}
        <span
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/40 text-black/70 backdrop-blur-md transition-all duration-500 group-hover:border-white/60 group-hover:bg-white/60 group-hover:text-black"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronIcon />
        </span>
      </button>

      {/* Animated collapsible content */}
      <div
        id={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 sm:px-7 sm:pb-7">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */
export default function ProfilePage() {
  const [data, setData] = useState<Data | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [usernameCheck, setUsernameCheck] = useState<UsernameCheck>({
    checking: false,
    available: false,
    checked: "",
    message: "",
    suggestions: [],
  });

  /* -------- Collapsible sections state (all collapsed by default) -------- */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: false,
    regional: false,
    notifications: false,
    recovery: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    (async () => {
      const res = await apiFetch<Data>("/api/user/profile");
      if (res.success) {
        setData(res.data);
        setForm(res.data.profile ?? {});
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const normalized = String(form.username ?? "").trim().toLowerCase().replace(/^@/, "");
    const currentUsername = String(data?.profile?.username ?? "").trim().toLowerCase().replace(/^@/, "");

    if (!normalized) {
      setUsernameCheck({ checking: false, available: false, checked: "", message: "Choose a username to continue.", suggestions: [] });
      return;
    }

    if (normalized === currentUsername) {
      setUsernameCheck({ checking: false, available: true, checked: normalized, message: "Your current username is available to keep.", suggestions: [] });
      return;
    }

    setUsernameCheck((current) => ({ ...current, checking: true, available: false, checked: "", message: "Checking availability…", suggestions: [] }));
    const timer = setTimeout(async () => {
      const res = await apiFetch<{
        available: boolean;
        username: string;
        suggestions?: string[];
        message?: string;
      }>("/api/auth/check-username", {
        method: "POST",
        body: JSON.stringify({ username: normalized }),
      });

      if (res.success) {
        setUsernameCheck({
          checking: false,
          available: res.data.available,
          checked: res.data.username,
          message: res.data.message ?? (res.data.available ? "Username is available." : "Username is not available."),
          suggestions: res.data.suggestions ?? [],
        });
      } else {
        setUsernameCheck({ checking: false, available: false, checked: "", message: res.error.message, suggestions: [] });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [data?.profile?.username, form.username]);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoUploading(true);
    setMessage(null);
    const body = new FormData();
    body.append("file", file);
    const res = await apiFetch<{ profile: Pick<Profile, "profile_photo_url" | "profile_photo_public_id"> }>(
      "/api/user/profile/photo",
      { method: "POST", body },
    );
    if (res.success) {
      setForm((current) => ({ ...current, ...res.data.profile }));
      setMessage({ type: "success", text: "Profile photo updated successfully" });
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setPhotoUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUsername = String(form.username ?? "").trim().toLowerCase().replace(/^@/, "");
    const currentUsername = String(data?.profile?.username ?? "").trim().toLowerCase().replace(/^@/, "");
    if (normalizedUsername !== currentUsername && (!usernameCheck.available || usernameCheck.checked !== normalizedUsername)) {
      setMessage({ type: "error", text: usernameCheck.checking ? "Please wait until username availability is confirmed." : usernameCheck.message || "Choose an available username before saving." });
      return;
    }
    setSaving(true);
    setMessage(null);

    const res = await apiFetch<{ profile: Profile }>("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify(form),
    });

    if (res.success) {
      setMessage({ type: "success", text: "Profile updated successfully" });
      setForm(res.data.profile);
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setSaving(false);
  };

  /* ---------------- loading state ---------------- */
  if (loading) return <Loader variant="profile" />;

  return (
    <div className="relative isolate min-h-[80vh]">
      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style jsx global>{`
        @keyframes prof-item-in {
          from { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes prof-banner-in {
          from { opacity: 0; transform: translateY(24px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes prof-float-soft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes prof-kenburns {
          0%, 100% { transform: scale(1.04) translate(0, 0); }
          50%      { transform: scale(1.12) translate(-1%, -0.8%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-prof-anim] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>

      {/* Background */}
      <PageBackground />

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <form onSubmit={handleSubmit} className={containerCls}>
        {/* ============================================================ */}
        {/*  HERO BANNER                                                  */}
        {/* ============================================================ */}
        <div
          data-prof-anim
          className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-6 sm:p-9"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
            animation:
              "prof-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
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
              animation: "prof-float-soft 7s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,180,0.45) 0%, rgba(255,200,180,0) 70%)",
              filter: "blur(36px)",
              animation: "prof-float-soft 7s ease-in-out 1.4s infinite",
            }}
          />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 backdrop-blur-md">
              <span
                className="h-1.5 w-1.5 rounded-full bg-black/80"
                style={{ animation: "prof-float-soft 2.4s ease-in-out infinite" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/70">
                Account
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
                  Profile
                </h1>
                <p className="max-w-lg text-[13.5px] leading-6 text-black/70">
                  Manage your personal information and preferences.
                </p>
              </div>

              {data?.profile?.binzeo_user_id && (
                <div
                  className="inline-flex items-center gap-3 rounded-xl border border-white/40 px-3 py-2 backdrop-blur-md"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.45) 100%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,1), 0 2px 8px -4px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-black/50">
                      Your ID
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[12.5px] font-medium text-black/85">
                      {data.profile.binzeo_user_id}
                    </div>
                  </div>
                  <Image
                    src="/icons/id-card.svg"
                    alt=""
                    width={22}
                    height={22}
                    className="shrink-0 opacity-60"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  MESSAGE BANNER                                               */}
        {/* ============================================================ */}
        {message && (
          <div
            className={`relative overflow-hidden rounded-2xl border px-4 py-3.5 text-[13px] backdrop-blur-md ${
              message.type === "success"
                ? "border-emerald-300/60 bg-emerald-100/50 text-emerald-800"
                : "border-amber-300/60 bg-amber-100/50 text-amber-800"
            }`}
            style={{
              animation: `prof-item-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both`,
            }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {message.type === "success" ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
              </div>
              <span className="leading-relaxed">{message.text}</span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  PERSONAL INFORMATION (collapsible)                          */}
        {/* ============================================================ */}
        <CollapsibleSection
          title="Personal Information"
          isOpen={openSections.personal}
          onToggle={() => toggleSection("personal")}
          delay={0.15}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/40 bg-white/35 p-4 backdrop-blur-md">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white/70 bg-white/60 shadow-inner">
                {form.profile_photo_url ? (
                  <img src={form.profile_photo_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-black/40">
                    {(form.display_name || form.first_name || "B").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-[220px] flex-1">
                <div className="text-[13.5px] font-semibold text-black/90">Profile photo</div>
                <div className="mt-0.5 text-[11.5px] text-black/55">JPEG, PNG, WebP or AVIF · maximum 5 MB</div>
                <label className="mt-3 inline-flex cursor-pointer items-center rounded-full border border-black/15 bg-white/65 px-3.5 py-2 text-[12px] font-medium text-black/75 transition hover:bg-white">
                  {photoUploading ? "Uploading…" : "Choose image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handlePhotoUpload} disabled={photoUploading} className="sr-only" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input
                  type="text"
                  value={form.first_name ?? ""}
                  onChange={(e) => update("first_name", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Last name">
                <input
                  type="text"
                  value={form.last_name ?? ""}
                  onChange={(e) => update("last_name", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Middle name">
              <input
                type="text"
                value={form.middle_name ?? ""}
                onChange={(e) => update("middle_name", e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Display name">
              <input
                type="text"
                value={form.display_name ?? ""}
                onChange={(e) => update("display_name", e.target.value)}
                className={inputCls}
                placeholder="How your name appears publicly"
              />
            </Field>

            <Field
              label="Username"
              hint="Change it anytime. Use 3–30 lowercase letters, numbers, or underscores; start with a letter."
            >
              <div className="relative">
                <input
                  type="text"
                  value={form.username ?? ""}
                  onChange={(e) => update("username", e.target.value)}
                  className={`${inputCls} pr-12`}
                  placeholder="your_username"
                  autoComplete="username"
                  spellCheck={false}
                  aria-describedby="username-status"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm" aria-hidden="true">
                  {usernameCheck.checking ? "…" : usernameCheck.available ? "✓" : usernameCheck.checked ? "×" : ""}
                </span>
              </div>
              <div
                id="username-status"
                className={`mt-1.5 text-[12px] ${usernameCheck.available ? "text-emerald-700" : usernameCheck.checking ? "text-black/55" : "text-rose-700"}`}
                aria-live="polite"
              >
                {usernameCheck.message}
              </div>
              {usernameCheck.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-black/50">Try:</span>
                  {usernameCheck.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => update("username", suggestion)}
                      className="rounded-full border border-black/10 bg-white/60 px-2.5 py-1 text-[11px] font-medium text-black/70 transition hover:bg-white"
                    >
                      @{suggestion}
                    </button>
                  ))}
                </div>
              )}
              {form.username && usernameCheck.available && (
                <a
                  className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-black/65 underline decoration-black/30 underline-offset-2 transition-colors hover:text-black"
                  href={`/u/@${String(form.username).replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  binzeo.com/u/@{String(form.username).replace(/^@/, "")}
                </a>
              )}
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Date of birth">
                <input
                  type="date"
                  value={form.date_of_birth ?? ""}
                  onChange={(e) => update("date_of_birth", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Current age">
                <div className={`${inputCls} opacity-70`}>
                  {form.age ?? "Not available"}
                </div>
              </Field>
            </div>

            <Field label="Gender">
              <select
                value={form.gender ?? ""}
                onChange={(e) => update("gender", e.target.value || null)}
                className={inputCls}
              >
                <option value="">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
        </CollapsibleSection>

        {/* ============================================================ */}
        {/*  REGIONAL PREFERENCES (collapsible)                          */}
        {/* ============================================================ */}
        <CollapsibleSection
          title="Regional Preferences"
          isOpen={openSections.regional}
          onToggle={() => toggleSection("regional")}
          delay={0.22}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Country code">
                <input
                  type="text"
                  maxLength={2}
                  value={form.country_code ?? ""}
                  onChange={(e) =>
                    update("country_code", e.target.value.toUpperCase())
                  }
                  className={inputCls}
                  placeholder="US"
                />
              </Field>
              <Field label="Language">
                <input
                  type="text"
                  value={form.preferred_language ?? ""}
                  onChange={(e) =>
                    update("preferred_language", e.target.value)
                  }
                  className={inputCls}
                  placeholder="en"
                />
              </Field>
            </div>

            <Field label="Timezone">
              <input
                type="text"
                value={form.timezone ?? ""}
                onChange={(e) => update("timezone", e.target.value)}
                className={inputCls}
                placeholder="UTC"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Date format">
                <input
                  type="text"
                  value={form.date_format ?? ""}
                  onChange={(e) => update("date_format", e.target.value)}
                  className={inputCls}
                  placeholder="YYYY-MM-DD"
                />
              </Field>
              <Field label="Time format">
                <select
                  value={form.time_format ?? "24h"}
                  onChange={(e) => update("time_format", e.target.value)}
                  className={inputCls}
                >
                  <option value="24h">24-hour</option>
                  <option value="12h">12-hour</option>
                </select>
              </Field>
              <Field label="Currency">
                <input
                  type="text"
                  value={form.currency ?? ""}
                  onChange={(e) => update("currency", e.target.value)}
                  className={inputCls}
                  placeholder="USD"
                />
              </Field>
            </div>
          </div>
        </CollapsibleSection>

        {/* ============================================================ */}
        {/*  NOTIFICATIONS (collapsible)                                 */}
        {/* ============================================================ */}
        <CollapsibleSection
          title="Notifications"
          isOpen={openSections.notifications}
          onToggle={() => toggleSection("notifications")}
          delay={0.29}
        >
          <div className="space-y-3">
            <ToggleRow
              label="Marketing emails"
              description="Product updates, tips and offers"
              checked={!!form.marketing_email}
              onChange={(v) => update("marketing_email", v)}
            />
            <ToggleRow
              label="Marketing SMS"
              description="Occasional text messages from BINZEO"
              checked={!!form.marketing_sms}
              onChange={(v) => update("marketing_sms", v)}
            />
            <ToggleRow
              label="Push notifications"
              description="Alerts on the devices you're signed in on"
              checked={!!form.push_notifications}
              onChange={(v) => update("push_notifications", v)}
            />
            <ToggleRow
              label="Security notifications"
              description="Important alerts about your account"
              checked={!!form.security_notifications}
              onChange={(v) => update("security_notifications", v)}
            />
          </div>
        </CollapsibleSection>

        {/* ============================================================ */}
        {/*  ACCOUNT RECOVERY (collapsible)                              */}
        {/* ============================================================ */}
        <CollapsibleSection
          title="Account Recovery"
          isOpen={openSections.recovery}
          onToggle={() => toggleSection("recovery")}
          delay={0.36}
        >
          <Field
            label="Recovery email"
            hint="Used to help you back into your account if you lose access."
          >
            <input
              type="email"
              value={form.recovery_email ?? ""}
              onChange={(e) => update("recovery_email", e.target.value)}
              className={inputCls}
              placeholder="backup@example.com"
            />
          </Field>
        </CollapsibleSection>

        {/* ============================================================ */}
        {/*  SAVE BAR                                                    */}
        {/* ============================================================ */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pb-2"
          style={{
            animation:
              "prof-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.42s both",
          }}
        >
          <p className="text-[12px] text-black/55">
            Changes are applied to your account immediately after saving.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-black bg-black px-6 py-3 text-[13px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 2px 4px rgba(0,0,0,0.08), 0 12px 28px -12px rgba(0,0,0,0.5)",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)",
              }}
            />
            {saving ? (
              <>
                <span aria-hidden="true" />
                <span className="relative">Saving...</span>
              </>
            ) : (
              <span className="relative">Save changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
