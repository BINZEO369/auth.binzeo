"use client";
import Image from "next/image";
import Link from "next/link";
import TemporaryLoginTokens from "@/components/security/TemporaryLoginTokens";
import PasskeyManager from "@/components/security/PasskeyManager";
import TwoFactorSettings from "@/components/security/TwoFactorSettings";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/static-components, react-hooks/purity, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */
import Loader from "@/components/ui/Loader";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
function AddressesSection() {

type Address = {
  id: string;
  address_type: string;
  address_line_1: string;
  address_line_2: string | null;
  address_line_3: string | null;
  country_code: string | null;
  state_province: string | null;
  district: string | null;
  city: string | null;
  area: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  location_accuracy_meters: number | null;
  location_source: string | null;
  is_primary: boolean;
};

/* ================================================================== */
/*  Liquid glass — same as dashboard overview                          */
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
/*  SHARED LAYOUT TOKENS — remember for future pages                  */
/* ================================================================== */
/*  - Page container:  max-w-6xl  (wider, better on small screens)     */
/*  - Mobile padding:  px-3 sm:px-5                                    */
/*  - Vertical padding: py-5 sm:py-8                                   */
/*  - Content gap:     space-y-5 sm:space-y-6                          */
/*  - Modal width:     sm:max-w-xl                                     */
const containerCls =
  "relative z-10 mx-auto max-w-6xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 backdrop-blur-md text-black/90 text-[15px] placeholder-black/35 focus:outline-none focus:border-white/60 focus:bg-white/60 focus:ring-4 focus:ring-white/30 transition-all duration-300";

const emptyForm: Partial<Address> = {
  address_type: "home",
  address_line_1: "",
  is_primary: false,
};

const TYPE_LABEL: Record<string, string> = {
  home: "Home",
  work: "Work",
  billing: "Billing",
  shipping: "Shipping",
  other: "Other",
};

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
          animation: "addr-kenburns 32s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  Field wrapper                                                      */
/* ================================================================== */
function Field({
  label,
  children,
  span,
}: {
  label: string;
  children: React.ReactNode;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </label>
      {children}
    </div>
  );
}


/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Address>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = async () => {
    const res = await apiFetch<{ addresses: Address[] }>("/api/user/addresses");
    if (res.success) setAddresses(res.data.addresses);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = <K extends keyof Address>(key: K, value: Address[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage(null);
  };

  const openEdit = (a: Address) => {
    setForm(a);
    setEditingId(a.id);
    setShowForm(true);
    setMessage(null);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = editingId
      ? `/api/user/addresses/${editingId}`
      : "/api/user/addresses";
    const method = editingId ? "PATCH" : "POST";

    const res = await apiFetch<{ address: Address }>(url, {
      method,
      body: JSON.stringify(form),
    });

    if (res.success) {
      setMessage({
        type: "success",
        text: editingId ? "Address updated" : "Address added",
      });
      cancel();
      load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    setDeleting(id);
    const res = await apiFetch(`/api/user/addresses/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      setMessage({ type: "success", text: "Address deleted" });
      load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setDeleting(null);
  };

  /* ---------------- loading state ---------------- */
  if (loading) return <Loader variant="addresses" />;

  return (
    <div className="relative isolate min-h-[80vh]">
      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style jsx global>{`
        @keyframes addr-item-in {
          from { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes addr-banner-in {
          from { opacity: 0; transform: translateY(24px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes addr-float-soft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes addr-kenburns {
          0%, 100% { transform: scale(1.04) translate(0, 0); }
          50%      { transform: scale(1.12) translate(-1%, -0.8%); }
        }
        @keyframes addr-pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-addr-anim] {
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
      {/*  CONTENT — wider container (max-w-6xl)                        */}
      {/* ============================================================ */}
      <div className={containerCls}>
        {/* ============================================================ */}
        {/*  HERO BANNER                                                  */}
        {/* ============================================================ */}
        <div
          data-addr-anim
          className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-6 sm:p-9"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
            animation:
              "addr-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
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
                "radial-gradient(circle, rgba(180,200,255,0.5) 0%, rgba(180,200,255,0) 70%)",
              filter: "blur(36px)",
              animation: "addr-float-soft 7s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,180,0.45) 0%, rgba(255,200,180,0) 70%)",
              filter: "blur(36px)",
              animation: "addr-float-soft 7s ease-in-out 1.4s infinite",
            }}
          />

          <div className="relative">
            {/* Kicker */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 backdrop-blur-md">
              <span
                className="h-1.5 w-1.5 rounded-full bg-black/80"
                style={{ animation: "addr-float-soft 2.4s ease-in-out infinite" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/70">
                Locations
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
                  Addresses
                </h1>
                <p className="max-w-lg text-[13.5px] leading-6 text-black/70">
                  Keep your saved locations in one place. Add or edit anytime —
                  changes apply instantly.
                </p>
              </div>

              {!showForm && addresses.length > 0 && (
                <button
                  onClick={openNew}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black bg-black px-4 py-2.5 text-[12.5px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5"
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
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-90"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="relative">Add address</span>
                </button>
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
              animation: `addr-item-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both`,
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
        {/*  EMPTY STATE                                                  */}
        {/* ============================================================ */}
        {!loading && addresses.length === 0 && !showForm && (
          <div
            data-addr-anim
            className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-12 text-center sm:p-16"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
              animation:
                "addr-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
            }}
          >
            <div className="relative">
              <div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/40"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 100%)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,1), 0 6px 16px -8px rgba(0,0,0,0.10)",
                  animation: "addr-float-soft 4s ease-in-out infinite",
                }}
              >
                <Image
                  src="/icons/location.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="opacity-75"
                />
              </div>

              <h2
                className="mb-3 text-xl font-semibold tracking-[-0.01em] text-black"
                style={{
                  textShadow:
                    "0 1px 12px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.6)",
                }}
              >
                No addresses yet
              </h2>
              <p className="mx-auto mb-8 max-w-sm text-[13.5px] leading-6 text-black/65">
                Add a home, work, or billing address so it&apos;s always ready
                when you need it.
              </p>

              <button
                onClick={openNew}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black bg-black px-5 py-3 text-[13px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5"
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-90"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="relative">Add your first address</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  ADDRESS LIST                                                 */}
        {/* ============================================================ */}
        {!loading && addresses.length > 0 && (
          <div className="space-y-4">
            {addresses.map((a, i) => (
              <article
                key={a.id}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.35] p-6 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_22px_48px_-22px_rgba(0,0,0,0.32)]"
                style={{
                  ...liquidGlass,
                  animation: `addr-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${
                    0.15 + i * 0.06
                  }s both`,
                }}
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

                {/* Top row — badges + actions */}
                <div className="relative mb-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/70 backdrop-blur-md">
                      {TYPE_LABEL[a.address_type] ?? a.address_type}
                    </span>
                    {a.is_primary && (
                      <span className="relative inline-flex items-center gap-1.5 rounded-full border border-emerald-300/60 bg-emerald-100/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800 backdrop-blur-md">
                        <span className="relative flex h-1.5 w-1.5">
                          <span
                            className="absolute inset-0 rounded-full bg-emerald-600"
                            style={{
                              animation:
                                "addr-pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                            }}
                          />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        </span>
                        Primary
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(a)}
                      aria-label="Edit"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/40 text-black/65 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deleting === a.id}
                      aria-label="Delete"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/40 text-black/65 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-red-300/60 hover:bg-red-100/50 hover:text-red-700 disabled:opacity-40"
                    >
                      {deleting === a.id ? (
                        <span aria-hidden="true" />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Address content */}
                <div className="relative flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/40 transition-colors duration-500 group-hover:border-white/60"
                    style={{
                      background:
                        "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 100%)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      boxShadow:
                        "inset 0 1px 0 0 rgba(255,255,255,1), 0 2px 8px -4px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Image
                      src="/icons/location.svg"
                      alt=""
                      width={18}
                      height={18}
                      className="opacity-70"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[14px] font-semibold leading-snug text-black/90">
                      {a.address_line_1}
                      {a.address_line_2 && (
                        <span className="font-normal text-black/60">
                          , {a.address_line_2}
                        </span>
                      )}
                    </p>

                    {(a.city ||
                      a.state_province ||
                      a.postal_code ||
                      a.country_code) && (
                      <p className="text-[12.5px] leading-relaxed text-black/60">
                        {[a.city, a.state_province, a.postal_code, a.country_code]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    {a.latitude !== null && a.longitude !== null && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/40 px-2.5 py-1 backdrop-blur-md">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-black/45"
                        >
                          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
                          <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        <span className="font-mono text-[11px] tracking-tight text-black/70">
                          {Number(a.latitude).toFixed(5)},{" "}
                          {Number(a.longitude).toFixed(5)}
                        </span>
                        {a.location_accuracy_meters !== null && (
                          <>
                            <span className="h-3 w-px bg-black/20" />
                            <span className="text-[11px] text-black/60">
                              ±{Math.round(a.location_accuracy_meters)}m
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/*  MODAL FORM — liquid glass, wider panel                       */}
        {/* ============================================================ */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
            style={{
              animation: `addr-banner-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both`,
            }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={cancel}
            />

            {/* Panel */}
            <div
              className="relative w-full max-h-[92vh] overflow-y-auto rounded-t-[28px] border border-white/[0.4] sm:max-w-xl sm:rounded-3xl"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.72) 45%, rgba(255,255,255,0.60) 100%)",
                backdropFilter: "blur(36px) saturate(180%)",
                WebkitBackdropFilter: "blur(36px) saturate(180%)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(255,255,255,0.4), 0 32px 80px -24px rgba(0,0,0,0.35)",
                animation:
                  "addr-banner-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
              }}
            >
              {/* Sticky header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between border-b border-white/30 px-6 py-4"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                }}
              >
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-black/90">
                    {editingId ? "Edit address" : "New address"}
                  </h2>
                  <p className="mt-0.5 text-[11.5px] text-black/55">
                    {editingId
                      ? "Update your saved location"
                      : "Save a new location to your account"}
                  </p>
                </div>
                <button
                  onClick={cancel}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/40 text-black/65 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="h-4 w-4"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Type">
                    <select
                      value={form.address_type ?? "home"}
                      onChange={(e) => update("address_type", e.target.value)}
                      className={inputCls}
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="billing">Billing</option>
                      <option value="shipping">Shipping</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
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
                </div>

                <Field label="Address line 1" span>
                  <input
                    type="text"
                    required
                    value={form.address_line_1 ?? ""}
                    onChange={(e) => update("address_line_1", e.target.value)}
                    className={inputCls}
                    placeholder="Street address"
                  />
                </Field>

                <Field label="Address line 2" span>
                  <input
                    type="text"
                    value={form.address_line_2 ?? ""}
                    onChange={(e) => update("address_line_2", e.target.value)}
                    className={inputCls}
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="City">
                    <input
                      type="text"
                      value={form.city ?? ""}
                      onChange={(e) => update("city", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="State / Province">
                    <input
                      type="text"
                      value={form.state_province ?? ""}
                      onChange={(e) => update("state_province", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="District">
                    <input
                      type="text"
                      value={form.district ?? ""}
                      onChange={(e) => update("district", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Postal code">
                    <input
                      type="text"
                      value={form.postal_code ?? ""}
                      onChange={(e) => update("postal_code", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Primary toggle — liquid glass card */}
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/40 p-4 backdrop-blur-md transition-colors duration-300 hover:border-white/60 hover:bg-white/60">
                  <div>
                    <div className="text-[13.5px] font-semibold text-black/90">
                      Set as primary
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-black/55">
                      Used by default when sharing your address
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={!!form.is_primary}
                      onChange={(e) => update("is_primary", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-white/60 transition-colors duration-300 peer-checked:bg-black/90" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-5" />
                  </div>
                </label>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={cancel}
                    className="flex-1 rounded-full border border-white/40 bg-white/40 px-5 py-3.5 text-[13px] font-medium text-black/75 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full border border-black bg-black px-5 py-3.5 text-[13px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
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
                      <span className="relative">
                        {editingId ? "Save changes" : "Add address"}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactsSection() {

type Contact = {
  id: string;
  contact_type: string;
  contact_value: string;
  label: string | null;
  is_primary: boolean;
  is_verified: boolean;
};

/* ================================================================== */
/*  Liquid glass — same as dashboard / addresses / profile / security  */
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

const emptyForm: Partial<Contact> = {
  contact_type: "website",
  contact_value: "",
  is_primary: false,
};

const TYPE_ICON: Record<string, string> = {
  website: "/icons/link.svg",
  social: "/icons/message.svg",
  messenger: "/icons/mobile.svg",
  other: "/icons/link.svg",
};

const TYPE_LABEL: Record<string, string> = {
  website: "Website",
  social: "Social",
  messenger: "Messenger",
  other: "Other",
};

/* ================================================================== */
/*  Background layer — full viewport                                   */
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
          animation: "cont-kenburns 32s ease-in-out infinite",
        }}
      />
    </div>
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
/*  Page                                                               */
/* ================================================================== */

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Contact>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = async () => {
    const res = await apiFetch<{ contacts: Contact[] }>("/api/user/contacts");
    if (res.success) setContacts(res.data.contacts);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = <K extends keyof Contact>(key: K, value: Contact[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage(null);
  };

  const openEdit = (c: Contact) => {
    setForm(c);
    setEditingId(c.id);
    setShowForm(true);
    setMessage(null);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const url = editingId
      ? `/api/user/contacts/${editingId}`
      : "/api/user/contacts";
    const method = editingId ? "PATCH" : "POST";

    const res = await apiFetch<{ contact: Contact }>(url, {
      method,
      body: JSON.stringify(form),
    });

    if (res.success) {
      setMessage({
        type: "success",
        text: editingId ? "Contact updated" : "Contact added",
      });
      cancel();
      load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    setDeleting(id);
    const res = await apiFetch(`/api/user/contacts/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      setMessage({ type: "success", text: "Contact deleted" });
      load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setDeleting(null);
  };

  /* ---------------- loading state ---------------- */
  if (loading) return <Loader variant="contacts" />;

  return (
    <div className="relative isolate min-h-[80vh]">
      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style jsx global>{`
        @keyframes cont-item-in {
          from { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes cont-banner-in {
          from { opacity: 0; transform: translateY(24px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes cont-float-soft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes cont-kenburns {
          0%, 100% { transform: scale(1.04) translate(0, 0); }
          50%      { transform: scale(1.12) translate(-1%, -0.8%); }
        }
        @keyframes cont-pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-cont-anim] {
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
      <div className={containerCls}>
        {/* ============================================================ */}
        {/*  HERO BANNER                                                  */}
        {/* ============================================================ */}
        <div
          data-cont-anim
          className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-6 sm:p-9"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
            animation:
              "cont-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
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
                "radial-gradient(circle, rgba(180,200,255,0.5) 0%, rgba(180,200,255,0) 70%)",
              filter: "blur(36px)",
              animation: "cont-float-soft 7s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,180,0.45) 0%, rgba(255,200,180,0) 70%)",
              filter: "blur(36px)",
              animation: "cont-float-soft 7s ease-in-out 1.4s infinite",
            }}
          />

          <div className="relative">
            {/* Kicker */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 backdrop-blur-md">
              <span
                className="h-1.5 w-1.5 rounded-full bg-black/80"
                style={{ animation: "cont-float-soft 2.4s ease-in-out infinite" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/70">
                Connections
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
                  Contacts
                </h1>
                <p className="max-w-lg text-[13.5px] leading-6 text-black/70">
                  Websites, social profiles and messaging handles — all in one
                  place.
                </p>
              </div>

              {!showForm && contacts.length > 0 && (
                <button
                  onClick={openNew}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black bg-black px-4 py-2.5 text-[12.5px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5"
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
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-90"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="relative">Add contact</span>
                </button>
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
              animation: `cont-item-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both`,
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
        {/*  FORM CARD (when open)                                        */}
        {/* ============================================================ */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-3xl border border-white/[0.35] p-6 sm:p-7"
            style={{
              ...liquidGlass,
              animation:
                "cont-item-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
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
              <SectionHeading>
                {editingId ? "Edit contact" : "New contact"}
              </SectionHeading>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Type">
                    <select
                      value={form.contact_type ?? "website"}
                      onChange={(e) => update("contact_type", e.target.value)}
                      className={inputCls}
                    >
                      <option value="website">Website</option>
                      <option value="social">Social</option>
                      <option value="messenger">Messenger</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                  <Field label="Label">
                    <input
                      type="text"
                      value={form.label ?? ""}
                      onChange={(e) => update("label", e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Personal"
                    />
                  </Field>
                </div>

                <Field label="Contact value">
                  <input
                    type="text"
                    required
                    value={form.contact_value ?? ""}
                    onChange={(e) => update("contact_value", e.target.value)}
                    className={inputCls}
                    placeholder="https://example.com or @username"
                  />
                </Field>

                {/* Primary toggle — liquid glass card */}
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/40 p-4 backdrop-blur-md transition-colors duration-300 hover:border-white/60 hover:bg-white/60">
                  <div>
                    <div className="text-[13.5px] font-semibold text-black/90">
                      Set as primary
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-black/55">
                      Used by default when sharing this contact
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={!!form.is_primary}
                      onChange={(e) => update("is_primary", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-white/60 transition-colors duration-300 peer-checked:bg-black/90" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-5" />
                  </div>
                </label>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={cancel}
                    className="rounded-full border border-white/40 bg-white/40 px-5 py-3 text-[13px] font-medium text-black/75 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
                  >
                    Cancel
                  </button>
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
                      <span className="relative">
                        {editingId ? "Update contact" : "Add contact"}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/*  EMPTY STATE                                                  */}
        {/* ============================================================ */}
        {contacts.length === 0 && !showForm && (
          <div
            data-cont-anim
            className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-12 text-center sm:p-16"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
              animation:
                "cont-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
            }}
          >
            <div className="relative">
              <div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/40"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 100%)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,1), 0 6px 16px -8px rgba(0,0,0,0.10)",
                  animation: "cont-float-soft 4s ease-in-out infinite",
                }}
              >
                <Image
                  src="/icons/id-card.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="opacity-70"
                />
              </div>

              <h2
                className="mb-3 text-xl font-semibold tracking-[-0.01em] text-black"
                style={{
                  textShadow:
                    "0 1px 12px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.6)",
                }}
              >
                No contacts yet
              </h2>
              <p className="mx-auto mb-8 max-w-sm text-[13.5px] leading-6 text-black/65">
                Add your website, social profiles, and messaging handles so
                people can reach you.
              </p>

              <button
                onClick={openNew}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black bg-black px-5 py-3 text-[13px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5"
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-90"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="relative">Add your first contact</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  CONTACTS GRID                                                */}
        {/* ============================================================ */}
        {contacts.length > 0 && (
          <div>
            <SectionHeading>Saved Contacts</SectionHeading>

            <div className="grid gap-4 sm:grid-cols-2">
              {contacts.map((c, i) => {
                const icon = TYPE_ICON[c.contact_type] ?? "/icons/link.svg";
                const typeLabel =
                  TYPE_LABEL[c.contact_type] ?? c.contact_type;

                return (
                  <article
                    key={c.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/[0.35] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.5] hover:shadow-[0_22px_48px_-22px_rgba(0,0,0,0.32)]"
                    style={{
                      ...liquidGlass,
                      animation: `cont-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${
                        0.15 + i * 0.06
                      }s both`,
                    }}
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

                    {/* Top row — icon + type + badges */}
                    <div className="relative mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/40 transition-colors duration-500 group-hover:border-white/60"
                          style={{
                            background:
                              "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 100%)",
                            backdropFilter: "blur(14px)",
                            WebkitBackdropFilter: "blur(14px)",
                            boxShadow:
                              "inset 0 1px 0 0 rgba(255,255,255,1), 0 2px 8px -4px rgba(0,0,0,0.08)",
                          }}
                        >
                          <Image
                            src={icon}
                            alt=""
                            width={18}
                            height={18}
                            className="opacity-70"
                          />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
                            {typeLabel}
                          </span>
                          {c.label && (
                            <span className="mt-0.5 text-[11.5px] text-black/60">
                              {c.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                        {c.is_primary && (
                          <span className="relative inline-flex items-center gap-1.5 rounded-full border border-emerald-300/60 bg-emerald-100/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800 backdrop-blur-md">
                            <span className="relative flex h-1.5 w-1.5">
                              <span
                                className="absolute inset-0 rounded-full bg-emerald-600"
                                style={{
                                  animation:
                                    "cont-pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                }}
                              />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            </span>
                            Primary
                          </span>
                        )}
                        {c.is_verified && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/60 bg-emerald-100/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800 backdrop-blur-md">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-2.5 w-2.5"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Value */}
                    <p
                      className="relative mb-4 truncate text-[14.5px] font-semibold text-black/90"
                      title={c.contact_value}
                    >
                      {c.contact_value}
                    </p>

                    {/* Actions row — separated and clear */}
                    <div className="relative flex items-center justify-end gap-2 border-t border-white/30 pt-3">
                      <button
                        onClick={() => openEdit(c)}
                        aria-label="Edit contact"
                        className="group/btn inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/40 px-3.5 py-1.5 text-[11.5px] font-medium text-black/75 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deleting === c.id}
                        aria-label="Delete contact"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/40 px-3.5 py-1.5 text-[11.5px] font-medium text-black/75 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-red-300/60 hover:bg-red-100/50 hover:text-red-700 disabled:opacity-40"
                      >
                        {deleting === c.id ? (
                          <span aria-hidden="true" />
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        )}
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DevicesSection() {

type Device = {
  id: string;
  device_id: string;
  device_name: string | null;
  device_type: string | null;
  operating_system: string | null;
  os_version: string | null;
  browser: string | null;
  browser_version: string | null;
  app_version: string | null;
  last_seen_at: string | null;
  is_trusted: boolean;
  created_at: string;
};

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[#dddddd] bg-[#f3f3f3] text-[#111111] text-sm placeholder-gray-600 focus:outline-none focus:border-[#777777] focus:ring-2 focus:ring-[#777777]/30 transition-colors";

function timeAgo(iso: string | null) {
  if (!iso) return "Never";
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

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = async () => {
    const res = await apiFetch<{ devices: Device[] }>("/api/user/devices");
    if (res.success) setDevices(res.data.devices);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleTrust = async (d: Device) => {
    setBusyId(d.id);
    setMessage(null);
    const res = await apiFetch(`/api/user/devices/${d.id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_trusted: !d.is_trusted }),
    });
    if (res.success) {
      setMessage({
        type: "success",
        text: d.is_trusted ? "Device untrusted" : "Device trusted",
      });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const handleRename = async (id: string) => {
    setBusyId(id);
    setMessage(null);
    const res = await apiFetch(`/api/user/devices/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ device_name: editName.trim() }),
    });
    if (res.success) {
      setMessage({ type: "success", text: "Device renamed" });
      setEditingId(null);
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this device? You may need to log in again.")) return;
    setBusyId(id);
    setMessage(null);
    const res = await apiFetch(`/api/user/devices/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      setMessage({ type: "success", text: "Device removed" });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const startEdit = (d: Device) => {
    setEditingId(d.id);
    setEditName(d.device_name ?? d.device_id);
  };

  if (loading) return <Loader variant="devices" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Devices</h1>
        <p className="text-sm text-[#6666666]">
          Devices that have accessed your Binzeo ID account
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

      {devices.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-[#dddddd] text-center">
          <Image
            src="/icons/device.svg"
            alt=""
            width={40}
            height={40}
            className="invert mx-auto mb-3"
          />
          <p className="text-[#6666666] text-sm">
            No devices recorded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-2xl border border-[#dddddd] bg-white hover:border-[#cfcfcf] transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#eeeeee] border border-[#c9c9c9] flex items-center justify-center shrink-0 text-lg">
                    <Image
                      src={
                        d.device_type === "mobile"
                          ? "/icons/mobile.svg"
                          : "/icons/device.svg"
                      }
                      alt={d.device_type ?? "device"}
                      width={24}
                      height={24}
                      className="invert"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    {editingId === d.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={inputCls + " !py-1.5 !text-sm"}
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(d.id)}
                          disabled={busyId === d.id}
                          className="text-xs text-[#333333] hover:text-[#5e5e5e] shrink-0"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-[#666666] hover:text-[#444444] shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[#111111] text-sm truncate">
                          {d.device_name ?? "Unnamed device"}
                        </span>
                        {d.is_trusted && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#eeeeee] text-[#444444] border border-[#cccccc]">
                            <Image
                              src="/icons/check.svg"
                              alt=""
                              width={12}
                              height={12}
                              className="invert inline-block mr-1 align-[-2px]"
                            />
                            Trusted
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-[#666666] mt-1 truncate">
                      {[
                        d.operating_system,
                        d.browser,
                        d.device_type,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                    <div className="text-xs text-[#888888] mt-0.5">
                      Last seen: {timeAgo(d.last_seen_at)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#dddddd]">
                <button
                  onClick={() => startEdit(d)}
                  className="text-xs text-[#6666666] hover:text-[#333333] transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={() => toggleTrust(d)}
                  disabled={busyId === d.id}
                  className="text-xs text-[#6666666] hover:text-[#333333] transition-colors disabled:opacity-50"
                >
                  {d.is_trusted ? "Untrust" : "Trust"}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => handleRemove(d.id)}
                  disabled={busyId === d.id}
                  className="text-xs text-[#333333] hover:text-[#6666666] disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectorsSection() {

type Sector = {
  id: string;
  sector_code: string;
  sector_name: string;
  description: string | null;
  is_active: boolean;
};

type SectorAccess = {
  sector_id: string;
  status: string;
  selected_at: string;
  updated_at: string;
  sectors: Sector | null;
};

  const [allSectors, setAllSectors] = useState<Sector[]>([]);
  const [mySectors, setMySectors] = useState<SectorAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const load = async () => {
    const [a, b] = await Promise.all([
      apiFetch<{ sectors: Sector[] }>("/api/sectors"),
      apiFetch<{ sector_access: SectorAccess[] }>("/api/user/sector-access"),
    ]);
    if (a.success) setAllSectors(a.data.sectors);
    if (b.success) setMySectors(b.data.sector_access);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const mySectorIds = new Set(mySectors.map((s) => s.sector_id));

  const handleJoin = async (sectorId: string) => {
    setBusyId(sectorId);
    setMessage(null);
    const res = await apiFetch("/api/user/sector-access", {
      method: "POST",
      body: JSON.stringify({ sector_id: sectorId, status: "active" }),
    });
    if (res.success) {
      setMessage({ type: "success", text: "Joined sector" });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const handleLeave = async (sectorId: string) => {
    if (!confirm("Leave this sector?")) return;
    setBusyId(sectorId);
    setMessage(null);
    const res = await apiFetch(`/api/user/sector-access/${sectorId}`, {
      method: "DELETE",
    });
    if (res.success) {
      setMessage({ type: "success", text: "Left sector" });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  const handleStatusChange = async (sectorId: string, status: string) => {
    setBusyId(sectorId);
    setMessage(null);
    const res = await apiFetch(`/api/user/sector-access/${sectorId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.success) {
      setMessage({ type: "success", text: "Status updated" });
      await load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setBusyId(null);
  };

  if (loading) return <Loader variant="sectors" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] mb-1">Sectors</h1>
        <p className="text-sm text-[#6666666]">
          Join industry sectors to unlock related features
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

      {/* My Sectors */}
      {mySectors.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-[#6666666] uppercase tracking-wider">
            My Sectors ({mySectors.length})
          </h2>
          <div className="space-y-2">
            {mySectors.map((s) => (
              <div
                key={s.sector_id}
                className="p-4 rounded-2xl border border-[#c9c9c9] bg-[#2b2b2b]/5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-[#333333] px-1.5 py-0.5 rounded bg-[#eeeeee]">
                      {s.sectors?.sector_code}
                    </span>
                    <span className="font-medium text-[#111111] text-sm truncate">
                      {s.sectors?.sector_name}
                    </span>
                  </div>
                  <div className="text-xs text-[#666666]">
                    Status:{" "}
                    <span
                      className={
                        s.status === "active"
                          ? "text-[#444444]"
                          : s.status === "paused"
                          ? "text-[#444444]"
                          : "text-[#6666666]"
                      }
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={s.status}
                    disabled={busyId === s.sector_id}
                    onChange={(e) =>
                      handleStatusChange(s.sector_id, e.target.value)
                    }
                    className="text-xs px-2 py-1 rounded border border-[#dddddd] bg-[#f3f3f3] text-[#111111]"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => handleLeave(s.sector_id)}
                    disabled={busyId === s.sector_id}
                    className="text-xs text-[#333333] hover:text-[#6666666] disabled:opacity-50"
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available Sectors */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-[#6666666] uppercase tracking-wider">
          Available Sectors
        </h2>

        {allSectors.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-[#dddddd] text-center">
            <Image
              src="/icons/building.svg"
              alt=""
              width={40}
              height={40}
              className="invert mx-auto mb-3"
            />
            <p className="text-[#6666666] text-sm">
              No sectors available right now.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {allSectors.map((s) => {
              const joined = mySectorIds.has(s.id);
              return (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl border border-[#dddddd] bg-white hover:border-[#cfcfcf] transition-colors flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-mono text-[10px] text-[#333333] px-1.5 py-0.5 rounded bg-[#eeeeee]">
                      {s.sector_code}
                    </div>
                    {joined && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#eeeeee] text-[#444444] border border-[#cccccc]">
                        <Image
                          src="/icons/check.svg"
                          alt=""
                          width={12}
                          height={12}
                          className="invert inline-block mr-1 align-[-2px]"
                        />
                        Joined
                      </span>
                    )}
                  </div>

                  <div className="font-medium text-[#111111] text-sm mb-1">
                    {s.sector_name}
                  </div>
                  {s.description && (
                    <p className="text-xs text-[#666666] mb-4 flex-1">
                      {s.description}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      joined ? handleLeave(s.id) : handleJoin(s.id)
                    }
                    disabled={busyId === s.id}
                    className={`mt-auto w-full py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                      joined
                        ? "border border-[#dddddd] text-[#444444] hover:border-[#cccccc] hover:text-[#333333]"
                        : "bg-[#111111] hover:bg-[#2b2b2b] text-white"
                    }`}
                  >
                    {busyId === s.id
                      ? "..."
                      : joined
                      ? "Leave"
                      : "Join"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function SecuritySection() {

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
  "relative z-10 mx-auto w-full max-w-6xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8";

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
/*  Status pill                                                        */
/* ================================================================== */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    success: "border-emerald-300/70 bg-emerald-100/60 text-emerald-800",
    verified: "border-emerald-300/70 bg-emerald-100/60 text-emerald-800",
    failed: "border-red-300/70 bg-red-100/60 text-red-800",
    blocked: "border-amber-300/70 bg-amber-100/60 text-amber-800",
    pending: "border-amber-300/70 bg-amber-100/60 text-amber-800",
  };
  const cls = map[status] ?? "border-white/40 bg-white/40 text-black/70";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md ${cls}`}
    >
      {status}
    </span>
  );
}

/* ================================================================== */
/*  Primary button — always white text                                 */
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

  if (loading) return <Loader variant="security" />;

  return (
    <div className="relative isolate min-h-[80vh] w-full overflow-x-hidden">
      {/* ============================================================ */}
      {/*  KEYFRAMES + SCOPED OVERRIDES FOR EMBEDDED COMPONENTS         */}
      {/* ============================================================ */}
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

        /* ============================================================ */
        /*  SCOPED OVERRIDES — [data-sec-tool] wrapper                   */
        /*  Forces TemporaryLoginTokens / PasskeyManager / 2FA          */
        /*  to fit into the liquid glass theme without overflow         */
        /* ============================================================ */

        [data-sec-tool],
        [data-sec-tool] * {
          box-sizing: border-box;
          max-width: 100%;
        }

        [data-sec-tool] {
          width: 100% !important;
          overflow-x: hidden;
          text-align: left;
        }

        [data-sec-tool] > * {
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          max-width: 100% !important;
        }

        /* Flatten any nested outer containers (double card / borders) */
        [data-sec-tool] > div,
        [data-sec-tool] > section,
        [data-sec-tool] > article {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
          width: 100% !important;
        }

        /* All inputs → liquid glass */
        [data-sec-tool] input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="hidden"]),
        [data-sec-tool] select,
        [data-sec-tool] textarea {
          width: 100% !important;
          padding: 12px 14px !important;
          border-radius: 12px !important;
          border: 1px solid rgba(255,255,255,0.4) !important;
          background: rgba(255,255,255,0.4) !important;
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
          color: rgba(0,0,0,0.9) !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          outline: none !important;
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,0.9),
            0 1px 2px rgba(0,0,0,0.03) !important;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-sec-tool] input::placeholder,
        [data-sec-tool] textarea::placeholder {
          color: rgba(0,0,0,0.35) !important;
        }

        [data-sec-tool] input:focus,
        [data-sec-tool] select:focus,
        [data-sec-tool] textarea:focus {
          border-color: rgba(255,255,255,0.7) !important;
          background: rgba(255,255,255,0.6) !important;
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,1),
            0 0 0 4px rgba(255,255,255,0.3) !important;
        }

        /* All labels */
        [data-sec-tool] label {
          display: block !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.16em !important;
          color: rgba(0,0,0,0.6) !important;
          margin-bottom: 8px !important;
        }

        /* Secondary buttons → liquid glass pill */
        [data-sec-tool] button:not([type="submit"]):not([data-primary]) {
          border-radius: 999px !important;
          border: 1px solid rgba(255,255,255,0.4) !important;
          background: rgba(255,255,255,0.4) !important;
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
          color: rgba(0,0,0,0.75) !important;
          font-weight: 500 !important;
          padding: 10px 18px !important;
          font-size: 12.5px !important;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,0.85),
            0 2px 4px rgba(0,0,0,0.04) !important;
          max-width: 100% !important;
          white-space: normal !important;
        }

        [data-sec-tool] button:not([type="submit"]):not([data-primary]):hover {
          background: rgba(255,255,255,0.65) !important;
          border-color: rgba(255,255,255,0.7) !important;
          color: rgba(0,0,0,0.95) !important;
          transform: translateY(-2px);
        }

        /* Primary / submit buttons → BLACK with WHITE text (forced) */
        [data-sec-tool] button[type="submit"],
        [data-sec-tool] button[data-primary] {
          border-radius: 999px !important;
          border: 1px solid #0a0a0a !important;
          background: #0a0a0a !important;
          color: #ffffff !important;
          font-weight: 500 !important;
          font-size: 12.5px !important;
          padding: 12px 22px !important;
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,0.14),
            0 2px 4px rgba(0,0,0,0.08),
            0 12px 28px -12px rgba(0,0,0,0.5) !important;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          max-width: 100% !important;
          white-space: normal !important;
        }

        [data-sec-tool] button[type="submit"] *,
        [data-sec-tool] button[data-primary] * {
          color: #ffffff !important;
        }

        [data-sec-tool] button[type="submit"]:hover,
        [data-sec-tool] button[data-primary]:hover {
          transform: translateY(-2px);
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,0.2),
            0 4px 8px rgba(0,0,0,0.1),
            0 18px 36px -12px rgba(0,0,0,0.55) !important;
        }

        [data-sec-tool] button[type="submit"]:disabled,
        [data-sec-tool] button[data-primary]:disabled {
          opacity: 0.6 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }

        /* Heading / text inside tools */
        [data-sec-tool] h1,
        [data-sec-tool] h2,
        [data-sec-tool] h3,
        [data-sec-tool] h4 {
          color: rgba(0,0,0,0.9) !important;
          font-weight: 600 !important;
          letter-spacing: -0.01em !important;
        }

        [data-sec-tool] p,
        [data-sec-tool] small,
        [data-sec-tool] span {
          color: rgba(0,0,0,0.65);
        }

        [data-sec-tool] a {
          color: rgba(0,0,0,0.75) !important;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.3s;
        }

        [data-sec-tool] a:hover {
          color: #000 !important;
        }

        /* Nested grids — responsive */
        [data-sec-tool] .grid,
        [data-sec-tool] [class*="grid-cols"] {
          gap: 12px !important;
          width: 100% !important;
        }

        [data-sec-tool] [class*="flex"],
        [data-sec-tool] [class*="grid"] {
          min-width: 0 !important;
        }

        /* Any inner card-like element → keep it inside bounds */
        [data-sec-tool] [class*="rounded"],
        [data-sec-tool] [class*="border"] {
          max-width: 100% !important;
        }

        /* Code / OTP / mono inputs — keep compact */
        [data-sec-tool] input[inputmode="numeric"],
        [data-sec-tool] input[autocomplete="one-time-code"] {
          text-align: center !important;
          font-size: 16px !important;
          font-weight: 600 !important;
        }

        /* Error / success */
        [data-sec-tool] [class*="error"],
        [data-sec-tool] [class*="Error"] {
          background: rgba(254, 226, 226, 0.6) !important;
          border: 1px solid rgba(252, 165, 165, 0.7) !important;
          color: #991b1b !important;
          border-radius: 12px !important;
          padding: 10px 14px !important;
          backdrop-filter: blur(14px);
          max-width: 100% !important;
        }

        [data-sec-tool] [class*="success"],
        [data-sec-tool] [class*="Success"] {
          background: rgba(209, 250, 229, 0.6) !important;
          border: 1px solid rgba(110, 231, 183, 0.7) !important;
          color: #065f46 !important;
          border-radius: 12px !important;
          padding: 10px 14px !important;
          backdrop-filter: blur(14px);
          max-width: 100% !important;
        }

        /* ============================================================ */
        /*  WRAPPER for each tool — a liquid glass section              */
        /* ============================================================ */
        .sec-tool-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.35);
          padding: 20px;
          transition: border-color 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (min-width: 640px) {
          .sec-tool-wrap { padding: 24px; }
        }

        .sec-tool-wrap:hover {
          border-color: rgba(255,255,255,0.5);
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,0.9),
            inset 0 0 0 1px rgba(255,255,255,0.4),
            0 2px 4px rgba(0,0,0,0.04),
            0 22px 48px -22px rgba(0,0,0,0.32) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          [data-sec-anim],
          [data-sec-tool] * {
            animation: none !important;
            transition: none !important;
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
          className="relative w-full overflow-hidden rounded-3xl border border-white/[0.4] p-6 sm:p-9"
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
        {/*  SECURITY TOOLS — each wrapped in its own liquid glass card   */}
        {/* ============================================================ */}

        <div
          className="sec-tool-wrap"
          style={{
            ...liquidGlass,
            animation:
              "sec-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
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
          <div data-sec-tool className="relative w-full">
            <TemporaryLoginTokens />
          </div>
        </div>

        <div
          className="sec-tool-wrap"
          style={{
            ...liquidGlass,
            animation:
              "sec-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both",
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
          <div data-sec-tool className="relative w-full">
            <PasskeyManager />
          </div>
        </div>

        <div
          className="sec-tool-wrap"
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
          <div data-sec-tool className="relative w-full">
            <TwoFactorSettings />
          </div>
        </div>

        {/* ============================================================ */}
        {/*  AUDIT LOGS — tabs inside liquid glass card                   */}
        {/* ============================================================ */}
        <section
          className="relative w-full overflow-hidden rounded-3xl border border-white/[0.35] p-5 sm:p-7"
          style={{
            ...liquidGlass,
            animation:
              "sec-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
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

            {/* Tabs */}
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
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusPill status={l.login_status} />
                            <span className="rounded-full border border-white/40 bg-white/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/65 backdrop-blur-md">
                              {l.login_method ?? "password"}
                            </span>
                          </div>

                          <div className="truncate text-[12.5px] text-black/70">
                            {l.ip_address ?? "No IP"} ·{" "}
                            {[l.city, l.country].filter(Boolean).join(", ") ||
                              "Unknown location"}
                          </div>

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
