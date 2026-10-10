"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

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
export default function ContactsPage() {
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
  if (loading) {
    return (
      <div className="relative isolate flex min-h-[80vh] items-center justify-center">
        <PageBackground />
        <span aria-hidden="true" />
      </div>
    );
  }

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
