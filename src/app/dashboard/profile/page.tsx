"use client";
import Loader from "@/components/ui/Loader";
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
/*  SHARED LAYOUT TOKENS (Clean Mobile UI)                             */
/* ================================================================== */
const containerCls = "mx-auto w-full max-w-lg pb-24 pt-4";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:bg-white focus:outline-none";

/* ================================================================== */
/*  Icons                                                              */
/* ================================================================== */
function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ================================================================== */
/*  Field wrapper                                                      */
/* ================================================================== */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[13px] font-medium text-gray-600">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-[11.5px] leading-5 text-gray-400">{hint}</p>}
    </div>
  );
}

/* ================================================================== */
/*  Toggle row (iOS Style)                                             */
/* ================================================================== */
function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium text-gray-900">{label}</div>
        <div className="mt-0.5 text-[12.5px] text-gray-500">{description}</div>
      </div>
      <div className="relative shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <div className="h-7 w-12 rounded-full bg-gray-200 transition-colors duration-300 peer-checked:bg-black" />
        <div className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

/* ================================================================== */
/*  Collapsible section (iOS Settings Style)                           */
/* ================================================================== */
function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 ml-4 text-[12px] font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      <div className="overflow-hidden rounded-2xl bg-white">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between bg-white px-4 py-4 transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center gap-3 text-gray-900">
            <span className="text-gray-500">{icon}</span>
            <span className="text-[15px] font-medium">{title}</span>
          </div>
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        
        {isOpen && (
          <div className="border-t border-gray-100 px-4 py-5">
            {children}
          </div>
        )}
      </div>
    </div>
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [usernameCheck, setUsernameCheck] = useState<UsernameCheck>({
    checking: false, available: false, checked: "", message: "", suggestions: [],
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: false, regional: false, notifications: false, recovery: false,
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
    if (window.location.hash === "#notifications") {
      setOpenSections((prev) => ({ ...prev, notifications: true }));
    }
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
      const res = await apiFetch<{ available: boolean; username: string; suggestions?: string[]; message?: string }>("/api/auth/check-username", {
        method: "POST", body: JSON.stringify({ username: normalized }),
      });
      if (res.success) {
        setUsernameCheck({
          checking: false, available: res.data.available, checked: res.data.username,
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
    const res = await apiFetch<{ profile: Pick<Profile, "profile_photo_url" | "profile_photo_public_id"> }>("/api/user/profile/photo", { method: "POST", body });
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
    const res = await apiFetch<{ profile: Profile }>("/api/user/profile", { method: "PATCH", body: JSON.stringify(form) });
    if (res.success) {
      setMessage({ type: "success", text: "Profile updated successfully" });
      setForm(res.data.profile);
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setSaving(false);
  };

  if (loading) return <Loader variant="profile" />;

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans">
      <form onSubmit={handleSubmit} className={containerCls}>
        
        {/* ============================================================ */}
        {/*  HEADER & PROFILE CARD (Matching Image 1 & 2)                */}
        {/* ============================================================ */}
        <div className="mb-6 flex items-center justify-between px-4">
          <button type="button" className="text-gray-900">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-[17px] font-semibold text-gray-900">Profile</h1>
          <div className="w-5" /> {/* Spacer */}
        </div>

        <div className="mb-6 rounded-2xl bg-white p-4 mx-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
              {form.profile_photo_url ? (
                <img src={form.profile_photo_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-400">
                  {(form.display_name || form.first_name || "B").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[17px] font-semibold text-gray-900 truncate">
                {form.display_name || `${form.first_name || ""} ${form.last_name || ""}`.trim() || "User"}
              </h2>
              <p className="text-[13px] text-gray-500 truncate">{data?.user?.email || "No email"}</p>
              <label className="mt-1 inline-flex cursor-pointer items-center text-[13px] font-medium text-blue-500">
                Edit Profile
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handlePhotoUpload} disabled={photoUploading} className="sr-only" />
              </label>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  MESSAGE BANNER                                               */}
        {/* ============================================================ */}
        {message && (
          <div className={`mx-4 mb-4 rounded-xl border px-4 py-3 text-[13px] ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
            {message.text}
          </div>
        )}

        {/* ============================================================ */}
        {/*  PERSONAL INFORMATION                                        */}
        {/* ============================================================ */}
        <div className="px-4">
          <CollapsibleSection
            title="Account details"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            isOpen={openSections.personal}
            onToggle={() => toggleSection("personal")}
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First name">
                  <input type="text" value={form.first_name ?? ""} onChange={(e) => update("first_name", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Last name">
                  <input type="text" value={form.last_name ?? ""} onChange={(e) => update("last_name", e.target.value)} className={inputCls} />
                </Field>
              </div>
              <Field label="Middle name">
                <input type="text" value={form.middle_name ?? ""} onChange={(e) => update("middle_name", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Display name">
                <input type="text" value={form.display_name ?? ""} onChange={(e) => update("display_name", e.target.value)} className={inputCls} placeholder="How your name appears publicly" />
              </Field>
              <Field label="Username" hint="Use 3–30 lowercase letters, numbers, or underscores; start with a letter.">
                <div className="relative">
                  <input type="text" value={form.username ?? ""} onChange={(e) => update("username", e.target.value)} className={`${inputCls} pr-12`} placeholder="your_username" autoComplete="username" spellCheck={false} />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm">
                    {usernameCheck.checking ? "…" : usernameCheck.available ? "✓" : usernameCheck.checked ? "×" : ""}
                  </span>
                </div>
                <div className={`mt-1.5 text-[12px] ${usernameCheck.available ? "text-emerald-600" : usernameCheck.checking ? "text-gray-500" : "text-rose-600"}`}>
                  {usernameCheck.message}
                </div>
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Date of birth">
                  <input type="date" value={form.date_of_birth ?? ""} onChange={(e) => update("date_of_birth", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Gender">
                  <select value={form.gender ?? ""} onChange={(e) => update("gender", e.target.value || null)} className={inputCls}>
                    <option value="">Not specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non_binary">Non-binary</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* ============================================================ */}
        {/*  REGIONAL PREFERENCES                                        */}
        {/* ============================================================ */}
        <div className="px-4">
          <CollapsibleSection
            title="Preferences"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>}
            isOpen={openSections.regional}
            onToggle={() => toggleSection("regional")}
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Country code">
                  <input type="text" maxLength={2} value={form.country_code ?? ""} onChange={(e) => update("country_code", e.target.value.toUpperCase())} className={inputCls} placeholder="US" />
                </Field>
                <Field label="Language">
                  <input type="text" value={form.preferred_language ?? ""} onChange={(e) => update("preferred_language", e.target.value)} className={inputCls} placeholder="en" />
                </Field>
              </div>
              <Field label="Timezone">
                <input type="text" value={form.timezone ?? ""} onChange={(e) => update("timezone", e.target.value)} className={inputCls} placeholder="UTC" />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Date format">
                  <input type="text" value={form.date_format ?? ""} onChange={(e) => update("date_format", e.target.value)} className={inputCls} placeholder="YYYY-MM-DD" />
                </Field>
                <Field label="Time format">
                  <select value={form.time_format ?? "24h"} onChange={(e) => update("time_format", e.target.value)} className={inputCls}>
                    <option value="24h">24-hour</option>
                    <option value="12h">12-hour</option>
                  </select>
                </Field>
                <Field label="Currency">
                  <input type="text" value={form.currency ?? ""} onChange={(e) => update("currency", e.target.value)} className={inputCls} placeholder="USD" />
                </Field>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* ============================================================ */}
        {/*  NOTIFICATIONS                                               */}
        {/* ============================================================ */}
        <div className="px-4">
          <CollapsibleSection
            title="Notifications"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>}
            isOpen={openSections.notifications}
            onToggle={() => toggleSection("notifications")}
          >
            <div className="space-y-1">
              <ToggleRow label="Marketing emails" description="Product updates, tips and offers" checked={!!form.marketing_email} onChange={(v) => update("marketing_email", v)} />
              <ToggleRow label="Marketing SMS" description="Occasional text messages from BINZEO" checked={!!form.marketing_sms} onChange={(v) => update("marketing_sms", v)} />
              <ToggleRow label="Push notifications" description="Alerts on the devices you're signed in on" checked={!!form.push_notifications} onChange={(v) => update("push_notifications", v)} />
              <ToggleRow label="Security notifications" description="Important alerts about your account" checked={!!form.security_notifications} onChange={(v) => update("security_notifications", v)} />
            </div>
          </CollapsibleSection>
        </div>

        {/* ============================================================ */}
        {/*  ACCOUNT RECOVERY                                            */}
        {/* ============================================================ */}
        <div className="px-4">
          <CollapsibleSection
            title="Support"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
            isOpen={openSections.recovery}
            onToggle={() => toggleSection("recovery")}
          >
            <Field label="Recovery email" hint="Used to help you back into your account if you lose access.">
              <input type="email" value={form.recovery_email ?? ""} onChange={(e) => update("recovery_email", e.target.value)} className={inputCls} placeholder="backup@example.com" />
            </Field>
          </CollapsibleSection>
        </div>

        {/* ============================================================ */}
        {/*  SAVE BAR                                                    */}
        {/* ============================================================ */}
        <div className="mt-8 px-4">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center rounded-xl bg-black py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

      </form>
    </div>
  );
}
