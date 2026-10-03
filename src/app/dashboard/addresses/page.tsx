"use client";

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

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const KEYFRAMES = `
  @keyframes bn-fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bn-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes bn-scale-in {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes bn-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes bn-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes bn-pulse-ring {
    0%   { transform: scale(0.9); opacity: 0.7; }
    70%  { transform: scale(1.6); opacity: 0; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes bn-spin {
    to { transform: rotate(360deg); }
  }
`;

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#d5dfdd] bg-[#f7faf9] text-[#101820] text-[15px] placeholder-[#9aa8ac] focus:outline-none focus:border-[#79b9d5] focus:bg-white focus:ring-4 focus:ring-[#79b9d5]/15 transition-all duration-300";

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

/* ------------------------------------------------------------------ */
/* Field wrapper                                                       */
/* ------------------------------------------------------------------ */
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
      <label className="block text-[12px] font-medium text-[#5c6b70] mb-2 tracking-wide uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton card                                                       */
/* ------------------------------------------------------------------ */
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="p-6 rounded-3xl border border-[#e4ebe9] bg-white overflow-hidden"
      style={{
        animation: `bn-fade-up 0.7s ${EASE} both`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="h-6 w-20 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #eef2f1 0%, #f8fbfa 50%, #eef2f1 100%)",
            backgroundSize: "400px 100%",
            animation: "bn-shimmer 1.4s linear infinite",
          }}
        />
        <div
          className="h-6 w-16 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #eef2f1 0%, #f8fbfa 50%, #eef2f1 100%)",
            backgroundSize: "400px 100%",
            animation: "bn-shimmer 1.4s linear infinite",
            animationDelay: "0.1s",
          }}
        />
      </div>
      <div
        className="h-4 w-3/4 rounded-md mb-3"
        style={{
          background:
            "linear-gradient(90deg, #eef2f1 0%, #f8fbfa 50%, #eef2f1 100%)",
          backgroundSize: "400px 100%",
          animation: "bn-shimmer 1.4s linear infinite",
          animationDelay: "0.2s",
        }}
      />
      <div
        className="h-3 w-1/2 rounded-md"
        style={{
          background:
            "linear-gradient(90deg, #eef2f1 0%, #f8fbfa 50%, #eef2f1 100%)",
          backgroundSize: "400px 100%",
          animation: "bn-shimmer 1.4s linear infinite",
          animationDelay: "0.3s",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div className="max-w-3xl mx-auto">
        {/* ---------------- Hero Header ---------------- */}
        <header
          className="mb-10"
          style={{ animation: `bn-fade-up 0.8s ${EASE} both` }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#d5dfdd] text-[11px] font-medium text-[#5c6b70] tracking-wide uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#79b9d5] animate-pulse" />
            Locations
          </div>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-[42px] leading-[1.05] font-semibold text-[#101820] tracking-[-0.03em] mb-3">
                Addresses
              </h1>
              <p className="text-[15px] text-[#5c6b70] max-w-lg leading-relaxed">
                Keep your saved locations in one place. Add or edit anytime —
                changes apply instantly.
              </p>
            </div>

            {!showForm && addresses.length > 0 && (
              <button
                onClick={openNew}
                className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#101820] hover:bg-[#1d2c3a] text-white text-sm font-medium transition-all duration-300 shadow-[0_2px_8px_rgba(16,24,32,0.15)] hover:shadow-[0_8px_24px_rgba(16,24,32,0.25)] hover:-translate-y-0.5"
                style={{ animation: `bn-fade-in 0.6s ${EASE} both` }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add address
              </button>
            )}
          </div>
        </header>

        {/* ---------------- Message banner ---------------- */}
        {message && (
          <div
            className={`mb-6 px-4 py-3.5 rounded-2xl border text-sm flex items-start gap-3 ${
              message.type === "success"
                ? "bg-[#eafaf2] border-[#a8d9c4] text-[#1f6a50]"
                : "bg-[#fdeeec] border-[#efb8b0] text-[#a8433f]"
            }`}
            style={{ animation: `bn-fade-up 0.5s ${EASE} both` }}
          >
            <div className="mt-0.5 shrink-0">
              {message.type === "success" ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
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
                  className="w-4 h-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <span className="leading-relaxed">{message.text}</span>
          </div>
        )}

        {/* ---------------- Loading skeleton ---------------- */}
        {loading && (
          <div className="space-y-4">
            <SkeletonCard delay={0} />
            <SkeletonCard delay={80} />
            <SkeletonCard delay={160} />
          </div>
        )}

        {/* ---------------- Empty state ---------------- */}
        {!loading && addresses.length === 0 && !showForm && (
          <div
            className="relative p-12 sm:p-16 rounded-3xl border border-[#e4ebe9] bg-white text-center overflow-hidden"
            style={{ animation: `bn-scale-in 0.8s ${EASE} both` }}
          >
            <div className="absolute inset-0 -z-0 pointer-events-none">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#79b9d5]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#eef6f9] to-[#dff2eb] border border-[#d5dfdd] flex items-center justify-center"
                style={{
                  animation: `bn-float 4s ease-in-out infinite`,
                }}
              >
                <Image
                  src="/icons/location.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="opacity-80"
                />
              </div>

              <h2 className="text-2xl font-semibold text-[#101820] tracking-[-0.02em] mb-3">
                No addresses yet
              </h2>
              <p className="text-[15px] text-[#5c6b70] max-w-sm mx-auto mb-8 leading-relaxed">
                Add a home, work, or billing address so it&apos;s always ready
                when you need it.
              </p>

              <button
                onClick={openNew}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#101820] hover:bg-[#1d2c3a] text-white text-sm font-medium transition-all duration-300 shadow-[0_2px_8px_rgba(16,24,32,0.15)] hover:shadow-[0_10px_28px_rgba(16,24,32,0.28)] hover:-translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add your first address
              </button>
            </div>
          </div>
        )}

        {/* ---------------- Address list ---------------- */}
        {!loading && addresses.length > 0 && (
          <div className="space-y-4">
            {addresses.map((a, i) => (
              <article
                key={a.id}
                className="group relative p-6 rounded-3xl border border-[#e4ebe9] bg-white hover:border-[#b4ded3] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(16,24,32,0.14)]"
                style={{
                  animation: `bn-fade-up 0.7s ${EASE} both`,
                  animationDelay: `${i * 70}ms`,
                }}
              >
                {/* Top row — badges + actions */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eef6f9] text-[#216f9e] border border-[#c9e2ee] text-[11px] font-medium tracking-wide uppercase">
                      {TYPE_LABEL[a.address_type] ?? a.address_type}
                    </span>
                    {a.is_primary && (
                      <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eafaf2] text-[#2e8064] border border-[#b6e1cf] text-[11px] font-medium tracking-wide uppercase">
                        <span className="relative flex w-1.5 h-1.5">
                          <span
                            className="absolute inset-0 rounded-full bg-[#2e8064]"
                            style={{
                              animation:
                                "bn-pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                            }}
                          />
                          <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#2e8064]" />
                        </span>
                        Primary
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openEdit(a)}
                      aria-label="Edit"
                      className="w-9 h-9 rounded-full hover:bg-[#eef6f9] text-[#5c6b70] hover:text-[#216f9e] flex items-center justify-center transition-colors duration-200"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deleting === a.id}
                      aria-label="Delete"
                      className="w-9 h-9 rounded-full hover:bg-[#fdeeec] text-[#5c6b70] hover:text-[#b84f4b] flex items-center justify-center transition-colors duration-200 disabled:opacity-40"
                    >
                      {deleting === a.id ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="w-4 h-4"
                          style={{ animation: "bn-spin 0.8s linear infinite" }}
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Address content */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#f7faf9] border border-[#e4ebe9] flex items-center justify-center shrink-0 group-hover:bg-[#eef6f9] group-hover:border-[#c9e2ee] transition-colors duration-500">
                    <Image
                      src="/icons/location.svg"
                      alt=""
                      width={18}
                      height={18}
                      className="opacity-70"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-[#101820] leading-snug mb-1">
                      {a.address_line_1}
                      {a.address_line_2 && (
                        <span className="text-[#5c6b70]">
                          , {a.address_line_2}
                        </span>
                      )}
                    </p>

                    {(a.city || a.state_province || a.postal_code || a.country_code) && (
                      <p className="text-[13px] text-[#6d7c80] leading-relaxed">
                        {[a.city, a.state_province, a.postal_code, a.country_code]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    {a.latitude !== null && a.longitude !== null && (
                      <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#f7faf9] border border-[#e4ebe9]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3 text-[#79b9d5]"
                        >
                          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
                          <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        <span className="text-[11px] text-[#6d7c80] font-mono tracking-tight">
                          {Number(a.latitude).toFixed(5)},{" "}
                          {Number(a.longitude).toFixed(5)}
                        </span>
                        {a.location_accuracy_meters !== null && (
                          <>
                            <span className="w-px h-3 bg-[#d5dfdd]" />
                            <span className="text-[11px] text-[#6d7c80]">
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

        {/* ---------------- Modal form ---------------- */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
            style={{ animation: `bn-fade-in 0.3s ${EASE} both` }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#101820]/40 backdrop-blur-md"
              onClick={cancel}
            />

            {/* Panel */}
            <div
              className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[28px] sm:rounded-3xl bg-white border border-[#e4ebe9] shadow-[0_24px_60px_-12px_rgba(16,24,32,0.25)]"
              style={{ animation: `bn-scale-in 0.5s ${EASE} both` }}
            >
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#e4ebe9] px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#101820] tracking-[-0.01em]">
                    {editingId ? "Edit address" : "New address"}
                  </h2>
                  <p className="text-[12px] text-[#6d7c80] mt-0.5">
                    {editingId
                      ? "Update your saved location"
                      : "Save a new location to your account"}
                  </p>
                </div>
                <button
                  onClick={cancel}
                  aria-label="Close"
                  className="w-9 h-9 rounded-full hover:bg-[#f7faf9] text-[#5c6b70] hover:text-[#101820] flex items-center justify-center transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="w-4 h-4"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

                <label className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-[#e4ebe9] bg-[#f7faf9] cursor-pointer hover:bg-[#eef6f9] hover:border-[#c9e2ee] transition-colors duration-300">
                  <div>
                    <div className="text-sm font-medium text-[#101820]">
                      Set as primary
                    </div>
                    <div className="text-[12px] text-[#6d7c80] mt-0.5">
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
                    <div className="w-11 h-6 rounded-full bg-[#d5dfdd] peer-checked:bg-[#101820] transition-colors duration-300" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm peer-checked:translate-x-5 transition-transform duration-300" />
                  </div>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={cancel}
                    className="flex-1 px-5 py-3.5 rounded-full border border-[#d5dfdd] text-[#35454c] hover:bg-[#f7faf9] hover:border-[#bdccca] text-sm font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-5 py-3.5 rounded-full bg-[#101820] hover:bg-[#1d2c3a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-all duration-300 shadow-[0_2px_8px_rgba(16,24,32,0.15)] hover:shadow-[0_10px_24px_rgba(16,24,32,0.25)] inline-flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          className="w-4 h-4"
                          style={{ animation: "bn-spin 0.8s linear infinite" }}
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Saving...
                      </>
                    ) : editingId ? (
                      "Save changes"
                    ) : (
                      "Add address"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
