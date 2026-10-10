"use client";
import Loader from "@/components/ui/Loader";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

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
export default function AddressesPage() {
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
  if (loading) {
    return (
      <div className="relative isolate min-h-[80vh]">
        <PageBackground />
        <style jsx global>{`
          @keyframes addr-item-in {
            from { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(8px); }
            to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes addr-kenburns {
            0%, 100% { transform: scale(1.04) translate(0, 0); }
            50%      { transform: scale(1.12) translate(-1%, -0.8%); }
          }
        `}</style>
        <div className={containerCls}><Loader size="lg" label="Loading addresses…" className="text-black/60" /></div>
      </div>
    );
  }

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
                        <Loader size="sm" className="h-4 w-4" />
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
                        <Loader size="sm" className="relative h-4 w-4" />
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
