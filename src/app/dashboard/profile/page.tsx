"use client";

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

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[#dddddd] bg-[#f3f3f3] text-[#111111] text-sm placeholder-gray-600 focus:outline-none focus:border-[#777777] focus:ring-2 focus:ring-[#777777]/30 transition-colors";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#6666666] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const [data, setData] = useState<Data | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#777777] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Profile</h1>
        <p className="text-sm text-[#6666666]">
          Manage your personal information and preferences
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-[#eeeeee] border-[#d1d1d1] text-[#444444]"
              : "bg-[#f2f2f2] border-[#cccccc] text-[#333333]"
          }`}
        >
          {message.text}
        </div>
      )}

      {data?.profile?.binzeo_user_id && (
        <div className="p-4 rounded-xl border border-[#c9c9c9] bg-[#2b2b2b]/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#6666666] mb-0.5">
              Your Binzeo ID (permanent)
            </div>
            <div className="font-mono text-[#333333] font-medium">
              {data.profile.binzeo_user_id}
            </div>
          </div>
          <Image
            src="/icons/id-card.svg"
            alt=""
            width={28}
            height={28}
            className="invert"
          />
        </div>
      )}

      <section className="p-5 rounded-2xl border border-[#dddddd] bg-white space-y-4">
        <h2 className="text-xs font-semibold text-[#6666666] uppercase tracking-wider">
          Personal Information
        </h2>

        <div className="grid grid-cols-2 gap-3">
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

        <Field label="Username">
          <input
            type="text"
            value={form.username ?? ""}
            className={inputCls}
            readOnly
            disabled
          />
          <p className="mt-1.5 text-xs text-[#777777]">Your username is permanent and cannot be changed.</p>
          {form.username && <a className="mt-1 block text-xs text-[#333333] underline" href={`/u/@${form.username}`} target="_blank" rel="noreferrer">binzeo.com/u/@{form.username}</a>}
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date of birth">
            <input
              type="date"
              value={form.date_of_birth ?? ""}
              onChange={(e) => update("date_of_birth", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Current age">
            <div className={inputCls}>{form.age ?? "Not available"}</div>
          </Field>
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
      </section>

      <section className="p-5 rounded-2xl border border-[#dddddd] bg-white space-y-4">
        <h2 className="text-xs font-semibold text-[#6666666] uppercase tracking-wider">
          Regional Preferences
        </h2>

        <div className="grid grid-cols-2 gap-3">
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
              onChange={(e) => update("preferred_language", e.target.value)}
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

        <div className="grid grid-cols-3 gap-3">
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
      </section>

      <section className="p-5 rounded-2xl border border-[#dddddd] bg-white space-y-1">
        <h2 className="text-xs font-semibold text-[#6666666] uppercase tracking-wider mb-3">
          Notifications
        </h2>

        {[
          { key: "marketing_email" as const, label: "Marketing emails" },
          { key: "marketing_sms" as const, label: "Marketing SMS" },
          { key: "push_notifications" as const, label: "Push notifications" },
          {
            key: "security_notifications" as const,
            label: "Security notifications",
          },
        ].map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center justify-between py-2 cursor-pointer"
          >
            <span className="text-sm text-[#444444]">{label}</span>
            <input
              type="checkbox"
              checked={!!form[key]}
              onChange={(e) => update(key, e.target.checked as never)}
              className="w-4 h-4 rounded border-[#dddddd] bg-[#f3f3f3] accent-[#111111]"
            />
          </label>
        ))}
      </section>

      <section className="p-5 rounded-2xl border border-[#dddddd] bg-white space-y-4">
        <h2 className="text-xs font-semibold text-[#6666666] uppercase tracking-wider">
          Account Recovery
        </h2>
        <Field label="Recovery email">
          <input
            type="email"
            value={form.recovery_email ?? ""}
            onChange={(e) => update("recovery_email", e.target.value)}
            className={inputCls}
            placeholder="backup@example.com"
          />
        </Field>
      </section>

      <div className="flex justify-end gap-3 pb-6">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-[#111111] hover:bg-[#2b2b2b] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shadow-lg shadow-[#cfcfcf]/25"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
