"use client";
/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
import Loader from "@/components/ui/Loader";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import SecuritySection from "@/components/dashboard/sections/SecuritySection";
import ContactsSection from "@/components/dashboard/sections/ContactsSection";
import AddressesSection from "@/components/dashboard/sections/AddressesSection";
import DevicesSection from "@/components/dashboard/sections/DevicesSection";
import SectorsSection from "@/components/dashboard/sections/SectorsSection";

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
/*  ICONS (SVG) - Perfectly matched with iOS design                    */
/* ================================================================== */
const Icons = {
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-black"><path d="m15 18-6-6 6-6"/></svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-700"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-700"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-700"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-700"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-700"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-700"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-700"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  Help: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-700"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  ),
  Chevron: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-300"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Explore: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  Agents: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  )
};

/* ================================================================== */
/*  SHARED STYLES (Advanced & Professional iOS feel)                   */
/* ================================================================== */
const cardCls = "bg-[#F8F9FA] rounded-[16px] overflow-hidden border border-gray-100/80 transition-all duration-300";
const listRowCls = "group flex items-center justify-between px-4 py-3.5 border-b border-gray-200/60 last:border-0 active:bg-gray-100 transition-colors duration-200 cursor-pointer";
const inputCls = "text-right bg-transparent border-none outline-none text-[15px] font-medium text-gray-900 placeholder-gray-400 w-full max-w-[60%] focus:ring-0 transition-colors";

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */
export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedSection = searchParams.get("section");
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "contacts" | "addresses" | "devices" | "sectors">(
    requestedSection === "security" || requestedSection === "contacts" || requestedSection === "addresses" || requestedSection === "devices" || requestedSection === "sectors" ? requestedSection : "profile",
  );
  const [data, setData] = useState<Data | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [usernameCheck, setUsernameCheck] = useState<UsernameCheck>({
    checking: false, available: false, checked: "", message: "", suggestions: [],
  });

  const sectionTabs = [
    ["profile", "Profile"],
    ["security", "Security"],
    ["contacts", "Contacts"],
    ["addresses", "Addresses"],
    ["devices", "Devices"],
    ["sectors", "Sectors"],
  ] as const;

  const selectSection = (section: typeof sectionTabs[number][0]) => {
    setActiveSection(section);
    window.history.replaceState(null, "", section === "profile" ? "/dashboard/profile" : `/dashboard/profile?section=${section}`);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/signin");
    router.refresh();
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
      const res = await apiFetch<any>("/api/auth/check-username", {
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
    const res = await apiFetch<any>("/api/user/profile/photo", { method: "POST", body });
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

    const res = await apiFetch<any>("/api/user/profile", {
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

  if (loading) return <Loader variant="profile" />;

  const displayName = form.display_name || `${form.first_name || ""} ${form.last_name || ""}`.trim() || "User";
  const userEmail = data?.user?.email || "user@example.com";

  return (
    <div className="min-h-screen bg-white pb-32 font-sans text-gray-900 selection:bg-black selection:text-white antialiased">
      
      {/* Top Header (Sticky & Professional) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 flex items-center justify-between px-4 py-3.5 transition-all duration-300">
        <button type="button" className="p-1 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <Icons.Back />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2 tracking-tight">Profile</h1>
        <div className="w-6" /> {/* Spacer for centering */}
      </div>

      <div className="mx-auto max-w-6xl px-3 pt-2 sm:px-5">
        <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto rounded-2xl border border-gray-200/70 bg-white/70 p-1.5 shadow-sm backdrop-blur-md" role="tablist" aria-label="Profile sections">
          {sectionTabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeSection === key}
              onClick={() => selectSection(key)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors ${activeSection === key ? "bg-black text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
            >
              {label}
            </button>
          ))}
          <button type="button" onClick={handleLogout} className="ml-auto shrink-0 rounded-xl px-3.5 py-2 text-[13px] font-medium text-rose-600 transition-colors hover:bg-rose-50">
            Log out
          </button>
        </div>
      </div>

      {activeSection === "profile" ? <form onSubmit={handleSubmit} className="mx-auto max-w-md px-4 space-y-7 pt-5">
        
        {/* Message Banner */}
        {message && (
          <div className={`rounded-[14px] px-4 py-3.5 text-[13px] font-medium animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
            {message.text}
          </div>
        )}

        {/* Profile Header Card */}
        <div className={`${cardCls} p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
          <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-gray-100">
            {form.profile_photo_url ? (
              <img src={form.profile_photo_url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-400">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {photoUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] text-white">
                <span className="animate-pulse">...</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-semibold text-gray-900 truncate leading-tight tracking-tight">{displayName}</h2>
            <p className="text-[13px] text-gray-500 truncate mt-0.5">{userEmail}</p>
            <label className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 active:scale-95 transition-all duration-200 bg-blue-50 px-3 py-1 rounded-full">
              <Icons.Edit /> Edit Profile
              <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={photoUploading} className="sr-only" />
            </label>
          </div>
        </div>

        {/* SECTION: Account details */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <h3 className="mb-2 px-4 text-[13px] font-medium text-gray-500 tracking-wide uppercase">Account details</h3>
          <div className={cardCls}>
            {/* First Name */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.User />
                <span className="text-[15px] font-normal text-gray-900">First Name</span>
              </div>
              <input type="text" value={form.first_name ?? ""} onChange={(e) => update("first_name", e.target.value)} className={inputCls} placeholder="Enter first name" />
            </div>
            {/* Last Name */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.User />
                <span className="text-[15px] font-normal text-gray-900">Last Name</span>
              </div>
              <input type="text" value={form.last_name ?? ""} onChange={(e) => update("last_name", e.target.value)} className={inputCls} placeholder="Enter last name" />
            </div>
            {/* Username */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.User />
                <span className="text-[15px] font-normal text-gray-900">Username</span>
              </div>
              <div className="flex flex-col items-end max-w-[60%] w-full">
                <input type="text" value={form.username ?? ""} onChange={(e) => update("username", e.target.value)} className={`${inputCls} max-w-full`} placeholder="username" />
                {usernameCheck.message && (
                  <span className={`text-[10px] mt-0.5 text-right w-full font-medium ${usernameCheck.available ? "text-emerald-600" : "text-rose-500"}`}>{usernameCheck.message}</span>
                )}
              </div>
            </div>
            {/* Gender */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.User />
                <span className="text-[15px] font-normal text-gray-900">Gender</span>
              </div>
              <select value={form.gender ?? ""} onChange={(e) => update("gender", e.target.value || null)} className={`${inputCls} appearance-none`}>
                <option value="">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Date of Birth */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Calendar />
                <span className="text-[15px] font-normal text-gray-900">Date of Birth</span>
              </div>
              <input type="date" value={form.date_of_birth ?? ""} onChange={(e) => update("date_of_birth", e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* SECTION: Preferences */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h3 className="mb-2 px-4 text-[13px] font-medium text-gray-500 tracking-wide uppercase">Preferences</h3>
          <div className={cardCls}>
            {/* Language */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Globe />
                <span className="text-[15px] font-normal text-gray-900">Language</span>
              </div>
              <input type="text" value={form.preferred_language ?? ""} onChange={(e) => update("preferred_language", e.target.value)} className={inputCls} placeholder="English" />
            </div>
            {/* Timezone */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Globe />
                <span className="text-[15px] font-normal text-gray-900">Timezone</span>
              </div>
              <input type="text" value={form.timezone ?? ""} onChange={(e) => update("timezone", e.target.value)} className={inputCls} placeholder="UTC" />
            </div>
            {/* Currency */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Info />
                <span className="text-[15px] font-normal text-gray-900">Currency</span>
              </div>
              <input type="text" value={form.currency ?? ""} onChange={(e) => update("currency", e.target.value)} className={inputCls} placeholder="USD" />
            </div>
            {/* Time Format */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Sun />
                <span className="text-[15px] font-normal text-gray-900">Light/Dark Mode</span>
              </div>
              <select value={form.time_format ?? "24h"} onChange={(e) => update("time_format", e.target.value)} className={`${inputCls} appearance-none`}>
                <option value="24h">24-hour</option>
                <option value="12h">12-hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION: Notifications (Toggles) */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <h3 className="mb-2 px-4 text-[13px] font-medium text-gray-500 tracking-wide uppercase">Notifications</h3>
          <div className={cardCls}>
            {/* Marketing Emails */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Bell />
                <span className="text-[15px] font-normal text-gray-900">Marketing Emails</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={!!form.marketing_email} onChange={(e) => update("marketing_email", e.target.checked)} className="peer sr-only" />
                <div className="h-[31px] w-[51px] rounded-full bg-gray-200 peer-checked:bg-black transition-colors duration-300"></div>
                <div className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-checked:translate-x-[20px]"></div>
              </label>
            </div>
            {/* Push Notifications */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Bell />
                <span className="text-[15px] font-normal text-gray-900">Push Notifications</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={!!form.push_notifications} onChange={(e) => update("push_notifications", e.target.checked)} className="peer sr-only" />
                <div className="h-[31px] w-[51px] rounded-full bg-gray-200 peer-checked:bg-black transition-colors duration-300"></div>
                <div className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-checked:translate-x-[20px]"></div>
              </label>
            </div>
            {/* Security Notifications */}
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Lock />
                <span className="text-[15px] font-normal text-gray-900">Security Alerts</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" checked={!!form.security_notifications} onChange={(e) => update("security_notifications", e.target.checked)} className="peer sr-only" />
                <div className="h-[31px] w-[51px] rounded-full bg-gray-200 peer-checked:bg-black transition-colors duration-300"></div>
                <div className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-checked:translate-x-[20px]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION: Support */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
          <h3 className="mb-2 px-4 text-[13px] font-medium text-gray-500 tracking-wide uppercase">Support</h3>
          <div className={cardCls}>
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Help />
                <span className="text-[15px] font-normal text-gray-900">Recovery Email</span>
              </div>
              <input type="email" value={form.recovery_email ?? ""} onChange={(e) => update("recovery_email", e.target.value)} className={inputCls} placeholder="backup@example.com" />
            </div>
            <div className={listRowCls}>
              <div className="flex items-center gap-3">
                <Icons.Info />
                <span className="text-[15px] font-normal text-gray-900">Help Center</span>
              </div>
              <Icons.Chevron />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-[16px] bg-black py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-gray-800 active:scale-[0.97] disabled:opacity-50 shadow-lg shadow-black/10 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form> : (
        <section className="mx-auto max-w-6xl px-3 pb-28 pt-4 sm:px-5">
          {activeSection === "security" && <SecuritySection />}
          {activeSection === "contacts" && <ContactsSection />}
          {activeSection === "addresses" && <AddressesSection />}
          {activeSection === "devices" && <DevicesSection />}
          {activeSection === "sectors" && <SectorsSection />}
        </section>
      )}

      {/* Bottom Navigation Bar (Strictly Matching Image 2) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/80 backdrop-blur-xl pb-safe pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-3">
          <button type="button" className="flex flex-col items-center gap-1.5 text-gray-400 transition-all duration-300 hover:text-black active:scale-95">
            <Icons.Home />
            <span className="text-[10px] font-medium tracking-wide">Home</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1.5 text-gray-400 transition-all duration-300 hover:text-black active:scale-95">
            <Icons.Explore />
            <span className="text-[10px] font-medium tracking-wide">Explore</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1.5 text-gray-400 transition-all duration-300 hover:text-black active:scale-95">
            <Icons.Heart />
            <span className="text-[10px] font-medium tracking-wide">Favorites</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1.5 text-gray-400 transition-all duration-300 hover:text-black active:scale-95">
            <Icons.Agents />
            <span className="text-[10px] font-medium tracking-wide">Agents</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1.5 text-black scale-105">
            <Icons.Profile />
            <span className="text-[10px] font-semibold tracking-wide">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
