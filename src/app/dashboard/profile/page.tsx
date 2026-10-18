"use client";
import Image from "next/image";
import Link from "next/link";
import TemporaryLoginTokens from "@/components/security/TemporaryLoginTokens";
import PasskeyManager from "@/components/security/PasskeyManager";
import TwoFactorSettings from "@/components/security/TwoFactorSettings";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/static-components, react-hooks/purity, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */
import Loader from "@/components/ui/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
/*  ICONS (SVG) - iOS matched                                          */
/* ================================================================== */
const Icons = {
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px] text-black"><path d="m15 18-6-6 6-6"/></svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  Help: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  ),
  Chevron: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] text-gray-300"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Explore: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
  ),
  Agents: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  )
};

/* ================================================================== */
/*  SHARED STYLES — Pure White Background                              */
/* ================================================================== */
const cardCls = "bg-white rounded-[18px] overflow-hidden border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]";
const listRowCls = "group flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors duration-200 cursor-pointer";
const inputCls = "text-right bg-transparent border-none outline-none text-[15px] font-medium text-gray-900 placeholder-gray-400 w-full max-w-[60%] focus:ring-0 transition-colors";

/* ================================================================== */
/*  MENU ITEM COMPONENT (iOS-style list row with icon)                 */
/* ================================================================== */
function MenuItem({ icon, label, onClick, isDestructive = false }: { icon: React.ReactNode; label: string; onClick: () => void; isDestructive?: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full px-4 py-3.5 bg-white border-b border-gray-100 last:border-0 active:bg-gray-50 transition-colors duration-200 text-left">
      <div className="flex items-center gap-3.5">
        <span className={`flex items-center justify-center w-[30px] h-[30px] rounded-[8px] ${isDestructive ? "bg-rose-50 text-rose-600" : "bg-gray-100 text-gray-700"}`}>
          {icon}
        </span>
        <span className={`text-[15px] font-medium ${isDestructive ? "text-rose-600" : "text-gray-900"}`}>{label}</span>
      </div>
      {!isDestructive && <Icons.Chevron />}
    </button>
  );
}

/* ================================================================== */
/*  ADDRESSES SECTION                                                  */
/* ================================================================== */
function AddressesSection() {
  type Address = { id: string; address_type: string; address_line_1: string; address_line_2: string | null; address_line_3: string | null; country_code: string | null; state_province: string | null; district: string | null; city: string | null; area: string | null; postal_code: string | null; latitude: number | null; longitude: number | null; location_accuracy_meters: number | null; location_source: string | null; is_primary: boolean; };
  const modalInputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-[15px] placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300";
  const emptyForm: Partial<Address> = { address_type: "home", address_line_1: "", is_primary: false };
  const TYPE_LABEL: Record<string, string> = { home: "Home", work: "Work", billing: "Billing", shipping: "Shipping", other: "Other" };
  function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) { return <div className={span ? "col-span-2" : ""}><label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</label>{children}</div>; }

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Address>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => { const res = await apiFetch<{ addresses: Address[] }>("/api/user/addresses"); if (res.success) setAddresses(res.data.addresses); setLoading(false); };
  useEffect(() => { load(); }, []);
  const update = <K extends keyof Address>(key: K, value: Address[K]) => { setForm((f) => ({ ...f, [key]: value })); };
  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); setMessage(null); };
  const openEdit = (a: Address) => { setForm(a); setEditingId(a.id); setShowForm(true); setMessage(null); };
  const cancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMessage(null);
    const url = editingId ? `/api/user/addresses/${editingId}` : "/api/user/addresses";
    const method = editingId ? "PATCH" : "POST";
    const res = await apiFetch<{ address: Address }>(url, { method, body: JSON.stringify(form) });
    if (res.success) { setMessage({ type: "success", text: editingId ? "Address updated" : "Address added" }); cancel(); load(); }
    else { setMessage({ type: "error", text: res.error.message }); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    setDeleting(id);
    const res = await apiFetch(`/api/user/addresses/${id}`, { method: "DELETE" });
    if (res.success) { setMessage({ type: "success", text: "Address deleted" }); load(); }
    else { setMessage({ type: "error", text: res.error.message }); }
    setDeleting(null);
  };

  if (loading) return <Loader variant="addresses" />;

  return (
    <div className="relative isolate min-h-[80vh]">
      <div className="relative z-10 mx-auto max-w-6xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
          <div className="min-w-0"><h1 className="mb-2 text-2xl font-semibold tracking-[-0.02em] text-gray-900">Addresses</h1><p className="max-w-lg text-[13.5px] leading-6 text-gray-500">Keep your saved locations in one place. Add or edit anytime — changes apply instantly.</p></div>
          {!showForm && addresses.length > 0 && (
            <button onClick={openNew} className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black bg-black px-4 py-2.5 text-[12.5px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5 shadow-lg shadow-black/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-90"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              <span className="relative">Add address</span>
            </button>
          )}
        </div>

        {message && <div className={`rounded-[16px] px-4 py-3.5 text-[13px] font-medium mb-5 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>{message.text}</div>}

        {!loading && addresses.length === 0 && !showForm && (
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-gray-100 bg-gray-50 shadow-sm">
              <Image src="/icons/location.svg" alt="" width={32} height={32} className="opacity-60" />
            </div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">No addresses yet</h2>
            <p className="mx-auto mb-8 max-w-sm text-[13.5px] leading-6 text-gray-500">Add a home, work, or billing address so it&apos;s always ready when you need it.</p>
            <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full border border-black bg-black px-5 py-3 text-[13px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5 shadow-lg shadow-black/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-4 w-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add your first address
            </button>
          </div>
        )}

        {!loading && addresses.length > 0 && (
          <div className="space-y-4">
            {addresses.map((a) => (
              <article key={a.id} className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)]">
                <div className="relative mb-4 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600">{TYPE_LABEL[a.address_type] ?? a.address_type}</span>
                    {a.is_primary && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Primary</span>}
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button onClick={() => openEdit(a)} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-black transition-all"><Icons.Edit /></button>
                    <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50"><Image src="/icons/location.svg" alt="" width={18} height={18} className="opacity-60" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[14px] font-semibold leading-snug text-gray-900">{a.address_line_1}{a.address_line_2 && <span className="font-normal text-gray-500">, {a.address_line_2}</span>}</p>
                    {(a.city || a.state_province || a.postal_code || a.country_code) && <p className="text-[12.5px] leading-relaxed text-gray-500">{[a.city, a.state_province, a.postal_code, a.country_code].filter(Boolean).join(", ")}</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={cancel} />
            <div className="relative w-full max-h-[92vh] overflow-y-auto rounded-t-[28px] border border-gray-100 bg-white sm:max-w-xl sm:rounded-3xl shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white">
                <div><h2 className="text-[16px] font-semibold text-gray-900">{editingId ? "Edit address" : "New address"}</h2><p className="mt-0.5 text-[11.5px] text-gray-500">{editingId ? "Update your saved location" : "Save a new location to your account"}</p></div>
                <button onClick={cancel} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-black transition-all"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-4"><Field label="Type"><select value={form.address_type ?? "home"} onChange={(e) => update("address_type", e.target.value)} className={modalInputCls}><option value="home">Home</option><option value="work">Work</option><option value="billing">Billing</option><option value="shipping">Shipping</option><option value="other">Other</option></select></Field><Field label="Country code"><input type="text" maxLength={2} value={form.country_code ?? ""} onChange={(e) => update("country_code", e.target.value.toUpperCase())} className={modalInputCls} placeholder="US" /></Field></div>
                <Field label="Address line 1" span><input type="text" required value={form.address_line_1 ?? ""} onChange={(e) => update("address_line_1", e.target.value)} className={modalInputCls} placeholder="Street address" /></Field>
                <Field label="Address line 2" span><input type="text" value={form.address_line_2 ?? ""} onChange={(e) => update("address_line_2", e.target.value)} className={modalInputCls} placeholder="Apartment, suite, etc. (optional)" /></Field>
                <div className="grid grid-cols-2 gap-4"><Field label="City"><input type="text" value={form.city ?? ""} onChange={(e) => update("city", e.target.value)} className={modalInputCls} /></Field><Field label="State / Province"><input type="text" value={form.state_province ?? ""} onChange={(e) => update("state_province", e.target.value)} className={modalInputCls} /></Field></div>
                <div className="grid grid-cols-2 gap-4"><Field label="District"><input type="text" value={form.district ?? ""} onChange={(e) => update("district", e.target.value)} className={modalInputCls} /></Field><Field label="Postal code"><input type="text" value={form.postal_code ?? ""} onChange={(e) => update("postal_code", e.target.value)} className={modalInputCls} /></Field></div>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-colors duration-300 hover:bg-white">
                  <div><div className="text-[13.5px] font-semibold text-gray-900">Set as primary</div><div className="mt-0.5 text-[11.5px] text-gray-500">Used by default when sharing your address</div></div>
                  <div className="relative shrink-0"><input type="checkbox" checked={!!form.is_primary} onChange={(e) => update("is_primary", e.target.checked)} className="peer sr-only" /><div className="h-[31px] w-[51px] rounded-full bg-gray-200 peer-checked:bg-black transition-colors duration-300"></div><div className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 peer-checked:translate-x-[20px]"></div></div>
                </label>
                <div className="flex gap-3 pt-1"><button type="button" onClick={cancel} className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-all">Cancel</button><button type="submit" disabled={saving} className="flex-1 rounded-full bg-black px-5 py-3.5 text-[13px] font-medium text-white hover:bg-gray-800 transition-all disabled:opacity-50">{saving ? "Saving..." : (editingId ? "Save changes" : "Add address")}</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  CONTACTS SECTION                                                   */
/* ================================================================== */
function ContactsSection() {
  type Contact = { id: string; contact_type: string; contact_value: string; label: string | null; is_primary: boolean; is_verified: boolean; };
  const modalInputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-[15px] placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300";
  const emptyForm: Partial<Contact> = { contact_type: "website", contact_value: "", is_primary: false };
  const TYPE_ICON: Record<string, string> = { website: "/icons/link.svg", social: "/icons/message.svg", messenger: "/icons/mobile.svg", other: "/icons/link.svg" };
  const TYPE_LABEL: Record<string, string> = { website: "Website", social: "Social", messenger: "Messenger", other: "Other" };
  function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) { return <div><label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</label>{children}{hint && <p className="mt-1.5 text-[11.5px] leading-5 text-gray-400">{hint}</p>}</div>; }

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Contact>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => { const res = await apiFetch<{ contacts: Contact[] }>("/api/user/contacts"); if (res.success) setContacts(res.data.contacts); setLoading(false); };
  useEffect(() => { load(); }, []);
  const update = <K extends keyof Contact>(key: K, value: Contact[K]) => { setForm((f) => ({ ...f, [key]: value })); };
  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); setMessage(null); };
  const openEdit = (c: Contact) => { setForm(c); setEditingId(c.id); setShowForm(true); setMessage(null); };
  const cancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMessage(null);
    const url = editingId ? `/api/user/contacts/${editingId}` : "/api/user/contacts";
    const method = editingId ? "PATCH" : "POST";
    const res = await apiFetch<{ contact: Contact }>(url, { method, body: JSON.stringify(form) });
    if (res.success) { setMessage({ type: "success", text: editingId ? "Contact updated" : "Contact added" }); cancel(); load(); }
    else { setMessage({ type: "error", text: res.error.message }); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    setDeleting(id);
    const res = await apiFetch(`/api/user/contacts/${id}`, { method: "DELETE" });
    if (res.success) { setMessage({ type: "success", text: "Contact deleted" }); load(); }
    else { setMessage({ type: "error", text: res.error.message }); }
    setDeleting(null);
  };

  if (loading) return <Loader variant="contacts" />;

  return (
    <div className="relative isolate min-h-[80vh]">
      <div className="relative z-10 mx-auto max-w-6xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
          <div className="min-w-0"><h1 className="mb-2 text-2xl font-semibold tracking-[-0.02em] text-gray-900">Contacts</h1><p className="max-w-lg text-[13.5px] leading-6 text-gray-500">Websites, social profiles and messaging handles — all in one place.</p></div>
          {!showForm && contacts.length > 0 && <button onClick={openNew} className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black bg-black px-4 py-2.5 text-[12.5px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5 shadow-lg shadow-black/10"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-90"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg><span className="relative">Add contact</span></button>}
        </div>

        {message && <div className={`rounded-[16px] px-4 py-3.5 text-[13px] font-medium mb-5 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>{message.text}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 sm:p-7 shadow-sm mb-6">
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">{editingId ? "Edit contact" : "New contact"}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label="Type"><select value={form.contact_type ?? "website"} onChange={(e) => update("contact_type", e.target.value)} className={modalInputCls}><option value="website">Website</option><option value="social">Social</option><option value="messenger">Messenger</option><option value="other">Other</option></select></Field><Field label="Label"><input type="text" value={form.label ?? ""} onChange={(e) => update("label", e.target.value)} className={modalInputCls} placeholder="e.g. Personal" /></Field></div>
              <Field label="Contact value"><input type="text" required value={form.contact_value ?? ""} onChange={(e) => update("contact_value", e.target.value)} className={modalInputCls} placeholder="https://example.com or @username" /></Field>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-colors duration-300 hover:bg-white">
                <div><div className="text-[13.5px] font-semibold text-gray-900">Set as primary</div><div className="mt-0.5 text-[11.5px] text-gray-500">Used by default when sharing this contact</div></div>
                <div className="relative shrink-0"><input type="checkbox" checked={!!form.is_primary} onChange={(e) => update("is_primary", e.target.checked)} className="peer sr-only" /><div className="h-[31px] w-[51px] rounded-full bg-gray-200 peer-checked:bg-black transition-colors duration-300"></div><div className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 peer-checked:translate-x-[20px]"></div></div>
              </label>
              <div className="flex flex-wrap items-center justify-end gap-3 pt-1"><button type="button" onClick={cancel} className="rounded-full border border-gray-200 bg-white px-5 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-all">Cancel</button><button type="submit" disabled={saving} className="rounded-full bg-black px-6 py-3 text-[13px] font-medium text-white hover:bg-gray-800 transition-all disabled:opacity-50">{saving ? "Saving..." : (editingId ? "Update contact" : "Add contact")}</button></div>
            </div>
          </form>
        )}

        {contacts.length === 0 && !showForm && (
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-gray-100 bg-gray-50 shadow-sm"><Image src="/icons/id-card.svg" alt="" width={32} height={32} className="opacity-60" /></div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">No contacts yet</h2><p className="mx-auto mb-8 max-w-sm text-[13.5px] leading-6 text-gray-500">Add your website, social profiles, and messaging handles so people can reach you.</p>
            <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full border border-black bg-black px-5 py-3 text-[13px] font-medium text-white transition-all duration-500 hover:-translate-y-0.5 shadow-lg shadow-black/10"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-4 w-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add your first contact</button>
          </div>
        )}

        {contacts.length > 0 && (
          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">Saved Contacts</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {contacts.map((c) => {
                const icon = TYPE_ICON[c.contact_type] ?? "/icons/link.svg";
                const typeLabel = TYPE_LABEL[c.contact_type] ?? c.contact_type;
                return (
                  <article key={c.id} className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)]">
                    <div className="relative mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50"><Image src={icon} alt="" width={18} height={18} className="opacity-60" /></span><div className="flex flex-col"><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">{typeLabel}</span>{c.label && <span className="mt-0.5 text-[11.5px] text-gray-500">{c.label}</span>}</div></div>
                      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">{c.is_primary && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Primary</span>}{c.is_verified && <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="M20 6 9 17l-5-5" /></svg> Verified</span>}</div>
                    </div>
                    <p className="relative mb-4 truncate text-[14.5px] font-semibold text-gray-900" title={c.contact_value}>{c.contact_value}</p>
                    <div className="relative flex items-center justify-end gap-2 border-t border-gray-100 pt-3"><button onClick={() => openEdit(c)} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-gray-700 hover:bg-gray-50 transition-all"><Icons.Edit /> Edit</button><button onClick={() => handleDelete(c.id)} disabled={deleting === c.id} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[11.5px] font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 transition-all"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> Delete</button></div>
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

/* ================================================================== */
/*  DEVICES SECTION                                                    */
/* ================================================================== */
function DevicesSection() {
  type Device = { id: string; device_id: string; device_name: string | null; device_type: string | null; operating_system: string | null; os_version: string | null; browser: string | null; browser_version: string | null; app_version: string | null; last_seen_at: string | null; is_trusted: boolean; created_at: string; };
  function timeAgo(iso: string | null) { if (!iso) return "Never"; const diff = Date.now() - new Date(iso).getTime(); const mins = Math.floor(diff / 60000); if (mins < 1) return "Just now"; if (mins < 60) return `${mins}m ago`; const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}h ago`; const days = Math.floor(hrs / 24); if (days < 30) return `${days}d ago`; return new Date(iso).toLocaleDateString(); }

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => { const res = await apiFetch<{ devices: Device[] }>("/api/user/devices"); if (res.success) setDevices(res.data.devices); setLoading(false); };
  useEffect(() => { load(); }, []);

  const toggleTrust = async (d: Device) => {
    setBusyId(d.id); setMessage(null);
    const res = await apiFetch(`/api/user/devices/${d.id}`, { method: "PATCH", body: JSON.stringify({ is_trusted: !d.is_trusted }) });
    if (res.success) { setMessage({ type: "success", text: d.is_trusted ? "Device untrusted" : "Device trusted" }); await load(); }
    else { setMessage({ type: "error", text: res.error.message }); }
    setBusyId(null);
  };

  const handleRename = async (id: string) => {
    setBusyId(id); setMessage(null);
    const res = await apiFetch(`/api/user/devices/${id}`, { method: "PATCH", body: JSON.stringify({ device_name: editName.trim() }) });
    if (res.success) { setMessage({ type: "success", text: "Device renamed" }); setEditingId(null); await load(); }
    else { setMessage({ type: "error", text: res.error.message }); }
    setBusyId(null);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this device? You may need to log in again.")) return;
    setBusyId(id); setMessage(null);
    const res = await apiFetch(`/api/user/devices/${id}`, { method: "DELETE" });
    if (res.success) { setMessage({ type: "success", text: "Device removed" }); await load(); }
    else { setMessage({ type: "error", text: res.error.message }); }
    setBusyId(null);
  };

  if (loading) return <Loader variant="devices" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900 mb-2">Devices</h1><p className="text-sm text-gray-500">Devices that have accessed your Binzeo ID account</p></div>
      {message && <div className={`rounded-[16px] px-4 py-3.5 text-[13px] font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>{message.text}</div>}
      {devices.length === 0 ? (
        <div className="p-12 rounded-3xl border border-gray-100 bg-white text-center shadow-sm"><Image src="/icons/device.svg" alt="" width={40} height={40} className="opacity-40 mx-auto mb-4" /><p className="text-gray-500 text-sm">No devices recorded yet.</p></div>
      ) : (
        <div className="space-y-3">
          {devices.map((d) => (
            <div key={d.id} className="p-5 rounded-3xl border border-gray-100 bg-white hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] transition-all duration-300">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0"><Image src={d.device_type === "mobile" ? "/icons/mobile.svg" : "/icons/device.svg"} alt={d.device_type ?? "device"} width={24} height={24} className="opacity-60" /></div>
                  <div className="min-w-0 flex-1">
                    {editingId === d.id ? (
                      <div className="flex items-center gap-2"><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-gray-300" autoFocus /><button onClick={() => handleRename(d.id)} disabled={busyId === d.id} className="text-xs text-gray-700 font-medium hover:text-black shrink-0">Save</button><button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-gray-700 shrink-0">Cancel</button></div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-900 text-sm truncate">{d.device_name ?? "Unnamed device"}</span>{d.is_trusted && <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"><Image src="/icons/check.svg" alt="" width={12} height={12} className="opacity-70" /> Trusted</span>}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1 truncate">{[d.operating_system, d.browser, d.device_type].filter(Boolean).join(" · ")}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Last seen: {timeAgo(d.last_seen_at)}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <button onClick={() => { setEditingId(d.id); setEditName(d.device_name ?? d.device_id); }} className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors">Rename</button>
                <button onClick={() => toggleTrust(d)} disabled={busyId === d.id} className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors disabled:opacity-50">{d.is_trusted ? "Untrust" : "Trust"}</button>
                <div className="flex-1" />
                <button onClick={() => handleRemove(d.id)} disabled={busyId === d.id} className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors disabled:opacity-50">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  SECTORS SECTION                                                    */
/* ================================================================== */
function SectorsSection() {
  type Sector = { id: string; sector_code: string; sector_name: string; description: string | null; is_active: boolean; };
  type SectorAccess = { sector_id: string; status: string; selected_at: string; updated_at: string; sectors: Sector | null; };

  const [allSectors, setAllSectors] = useState<Sector[]>([]);
  const [mySectors, setMySectors] = useState<SectorAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => { const [a, b] = await Promise.all([apiFetch<{ sectors: Sector[] }>("/api/sectors"), apiFetch<{ sector_access: SectorAccess[] }>("/api/user/sector-access")]); if (a.success) setAllSectors(a.data.sectors); if (b.success) setMySectors(b.data.sector_access); setLoading(false); };
  useEffect(() => { load(); }, []);
  const mySectorIds = new Set(mySectors.map((s) => s.sector_id));

  const handleJoin = async (sectorId: string) => { setBusyId(sectorId); setMessage(null); const res = await apiFetch("/api/user/sector-access", { method: "POST", body: JSON.stringify({ sector_id: sectorId, status: "active" }) }); if (res.success) { setMessage({ type: "success", text: "Joined sector" }); await load(); } else { setMessage({ type: "error", text: res.error.message }); } setBusyId(null); };
  const handleLeave = async (sectorId: string) => { if (!confirm("Leave this sector?")) return; setBusyId(sectorId); setMessage(null); const res = await apiFetch(`/api/user/sector-access/${sectorId}`, { method: "DELETE" }); if (res.success) { setMessage({ type: "success", text: "Left sector" }); await load(); } else { setMessage({ type: "error", text: res.error.message }); } setBusyId(null); };
  const handleStatusChange = async (sectorId: string, status: string) => { setBusyId(sectorId); setMessage(null); const res = await apiFetch(`/api/user/sector-access/${sectorId}`, { method: "PATCH", body: JSON.stringify({ status }) }); if (res.success) { setMessage({ type: "success", text: "Status updated" }); await load(); } else { setMessage({ type: "error", text: res.error.message }); } setBusyId(null); };

  if (loading) return <Loader variant="sectors" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900 mb-2">Sectors</h1><p className="text-sm text-gray-500">Join industry sectors to unlock related features</p></div>
      {message && <div className={`rounded-[16px] px-4 py-3.5 text-[13px] font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>{message.text}</div>}
      {mySectors.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.18em]">My Sectors ({mySectors.length})</h2>
          <div className="space-y-2">
            {mySectors.map((s) => (
              <div key={s.sector_id} className="p-4 rounded-3xl border border-gray-100 bg-white flex items-center justify-between gap-3 shadow-sm">
                <div className="min-w-0"><div className="flex items-center gap-2 mb-1"><span className="font-mono text-[10px] text-gray-600 px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200">{s.sectors?.sector_code}</span><span className="font-medium text-gray-900 text-sm truncate">{s.sectors?.sector_name}</span></div><div className="text-xs text-gray-500">Status: <span className={s.status === "active" ? "text-emerald-600 font-medium" : "text-gray-500"}>{s.status}</span></div></div>
                <div className="flex items-center gap-2 shrink-0"><select value={s.status} disabled={busyId === s.sector_id} onChange={(e) => handleStatusChange(s.sector_id, e.target.value)} className="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none"><option value="active">Active</option><option value="paused">Paused</option><option value="inactive">Inactive</option></select><button onClick={() => handleLeave(s.sector_id)} disabled={busyId === s.sector_id} className="text-xs text-rose-500 hover:text-rose-700 font-medium disabled:opacity-50">Leave</button></div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="space-y-3">
        <h2 className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.18em]">Available Sectors</h2>
        {allSectors.length === 0 ? (
          <div className="p-12 rounded-3xl border border-gray-100 bg-white text-center shadow-sm"><Image src="/icons/building.svg" alt="" width={40} height={40} className="opacity-40 mx-auto mb-4" /><p className="text-gray-500 text-sm">No sectors available right now.</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {allSectors.map((s) => {
              const joined = mySectorIds.has(s.id);
              return (
                <div key={s.id} className="p-5 rounded-3xl border border-gray-100 bg-white hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2"><div className="font-mono text-[10px] text-gray-600 px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200">{s.sector_code}</div>{joined && <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"><Image src="/icons/check.svg" alt="" width={12} height={12} className="opacity-70" /> Joined</span>}</div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">{s.sector_name}</div>
                  {s.description && <p className="text-xs text-gray-500 mb-4 flex-1">{s.description}</p>}
                  <button onClick={() => joined ? handleLeave(s.id) : handleJoin(s.id)} disabled={busyId === s.id} className={`mt-auto w-full py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${joined ? "border border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-black text-white hover:bg-gray-800"}`}>{busyId === s.id ? "..." : joined ? "Leave" : "Join"}</button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/* ================================================================== */
/*  SECURITY SECTION                                                   */
/* ================================================================== */
function SecuritySection() {
  type LoginEntry = { id: string; login_method: string | null; login_status: string; ip_address: string | null; user_agent: string | null; country: string | null; city: string | null; latitude: number | null; longitude: number | null; location_accuracy_meters: number | null; location_source: string | null; login_at: string; logout_at: string | null; user_devices: { device_name: string | null; device_type: string | null; operating_system: string | null; os_version: string | null; browser: string | null; browser_version: string | null; } | null; };
  type ActivityEntry = { id: string; activity_type: string; activity_description: string | null; ip_address: string | null; created_at: string; };
  type AuthMethod = { id: string; provider: string; auth_method: string; provider_email: string | null; first_seen_at: string; last_sign_in_at: string | null; login_count: number; last_event: string | null; };
  type Verification = { id: string; verification_type: string; verification_status: string; verified_at: string | null; last_requested_at: string | null; expires_at: string | null; attempt_count: number; };
  type ProjectApplication = { project_key: string; project_name: string; brand_name: string; client_key: string | null; client_name: string | null; last_used_at: string; last_ip: string | null; last_city: string | null; event_count: number; };
  type ProjectAccessEvent = { id: string; event_type: string; outcome: string; ip_address: string | null; country: string | null; region: string | null; city: string | null; device_name: string | null; device_type: string | null; operating_system: string | null; browser: string | null; request_id: string | null; occurred_at: string; platform_projects?: { project_name?: string; brand_name?: string } | null; platform_clients?: { client_name?: string; client_type?: string } | null; };

  function LockIcon({ className = "h-4 w-4" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>; }
  function timeAgo(iso: string | null) { if (!iso) return "—"; const diff = Date.now() - new Date(iso).getTime(); const mins = Math.floor(diff / 60000); if (mins < 1) return "Just now"; if (mins < 60) return `${mins}m ago`; const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}h ago`; const days = Math.floor(hrs / 24); if (days < 30) return `${days}d ago`; return new Date(iso).toLocaleDateString(); }
  function SectionHeading({ children }: { children: React.ReactNode }) { return <div className="mb-4 flex items-center gap-3"><span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">{children}</span><span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" /></div>; }
  function StatusPill({ status }: { status: string }) { const map: Record<string, string> = { success: "border-emerald-200 bg-emerald-50 text-emerald-700", verified: "border-emerald-200 bg-emerald-50 text-emerald-700", failed: "border-red-200 bg-red-50 text-red-700", blocked: "border-amber-200 bg-amber-50 text-amber-700", pending: "border-amber-200 bg-amber-50 text-amber-700" }; const cls = map[status] ?? "border-gray-200 bg-gray-50 text-gray-700"; return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${cls}`}>{status}</span>; }
  function PrimaryButton({ href, children, icon }: { href?: string; children: React.ReactNode; icon?: React.ReactNode }) { const cls = "group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black px-4 py-2.5 text-[12.5px] font-medium transition-all duration-500 hover:-translate-y-0.5 shadow-lg shadow-black/10"; const style: React.CSSProperties = { background: "#0a0a0a", color: "#ffffff" }; const inner = (<><span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)" }} />{icon && <span className="relative flex items-center">{icon}</span>}<span className="relative" style={{ color: "#ffffff" }}>{children}</span></>); if (href) return <Link href={href} className={cls} style={style}>{inner}</Link>; return <button type="button" className={cls} style={style}>{inner}</button>; }
  function EmptyState({ icon, text }: { icon: string; text: string }) { return (<div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 shadow-sm"><Image src={icon} alt="" width={24} height={24} className="opacity-60" /></div><p className="text-[13px] text-gray-500">{text}</p></div>); }

  const TABS = [{ id: "logins", label: "Login History" }, { id: "activity", label: "Activity" }, { id: "applications", label: "Connected Applications" }, { id: "methods", label: "Auth Methods" }, { id: "verifications", label: "Verifications" }] as const;
  type TabId = (typeof TABS)[number]["id"];

  const [tab, setTab] = useState<TabId>("logins");
  const [logins, setLogins] = useState<LoginEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [methods, setMethods] = useState<AuthMethod[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [projectEvents, setProjectEvents] = useState<ProjectAccessEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, b, c, d, e] = await Promise.all([apiFetch<{ history: LoginEntry[] }>("/api/user/login-history?limit=50"), apiFetch<{ activities: ActivityEntry[] }>("/api/user/activity-logs?limit=50"), apiFetch<{ auth_methods: AuthMethod[] }>("/api/user/auth-methods"), apiFetch<{ verifications: Verification[] }>("/api/user/verification-records"), apiFetch<{ applications: ProjectApplication[]; events: ProjectAccessEvent[] }>("/api/user/project-access")]);
      if (a.success) setLogins(a.data.history);
      if (b.success) setActivities(b.data.activities);
      if (c.success) setMethods(c.data.auth_methods);
      if (d.success) setVerifications(d.data.verifications);
      if (e.success) { setApplications(e.data.applications); setProjectEvents(e.data.events); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader variant="security" />;

  return (
    <div className="relative isolate min-h-[80vh] w-full overflow-x-hidden">
      

      <div className="relative z-10 mx-auto w-full max-w-6xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
          <div className="min-w-0"><h1 className="mb-2 text-2xl font-semibold tracking-[-0.02em] text-gray-900">Security</h1><p className="max-w-lg text-[13.5px] leading-6 text-gray-500">Monitor your account activity and manage security settings.</p></div>
          <PrimaryButton href="/dashboard/security/password" icon={<LockIcon className="h-4 w-4" />}>Change password</PrimaryButton>
        </div>

        <div className="sec-tool-wrap mb-5"><div data-sec-tool className="relative w-full"><TemporaryLoginTokens /></div></div>
        <div className="sec-tool-wrap mb-5"><div data-sec-tool className="relative w-full"><PasskeyManager /></div></div>
        <div className="sec-tool-wrap mb-5"><div data-sec-tool className="relative w-full"><TwoFactorSettings /></div></div>

        <section className="relative w-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 sm:p-7 shadow-sm">
          <div className="relative">
            <SectionHeading>Account Activity</SectionHeading>
            <div className="mb-5 flex flex-wrap gap-2">
              {TABS.map((t) => { const active = tab === t.id; return (<button key={t.id} type="button" onClick={() => setTab(t.id)} className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-2 text-[12px] font-medium transition-all duration-500 ${active ? "border-black bg-black text-white shadow-md shadow-black/10" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-black"}`}><span className="relative">{t.label}</span></button>); })}
            </div>

            {tab === "logins" && (<div className="space-y-3">{logins.length === 0 ? <EmptyState icon="/icons/lock.svg" text="No login history yet." /> : logins.map((l) => (<article key={l.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-500 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.1)] sm:p-5"><div className="relative flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><StatusPill status={l.login_status} /><span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600">{l.login_method ?? "password"}</span></div><div className="truncate text-[12.5px] text-gray-600">{l.ip_address ?? "No IP"} · {[l.city, l.country].filter(Boolean).join(", ") || "Unknown location"}</div>{l.user_devices && <div className="mt-1 text-[11.5px] text-gray-500">{l.user_devices.device_name ?? l.user_devices.device_type ?? "Unknown device"}{l.user_devices.operating_system && ` · ${l.user_devices.operating_system}`}{l.user_devices.browser && ` · ${l.user_devices.browser}`}</div>}</div><div className="shrink-0 text-[11px] font-medium text-gray-400">{timeAgo(l.login_at)}</div></div></article>))}</div>)}
            {tab === "activity" && (<div className="space-y-3">{activities.length === 0 ? <EmptyState icon="/icons/history.svg" text="No activity recorded yet." /> : activities.map((a) => (<article key={a.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-500 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.1)] sm:p-5"><div className="relative flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="mb-0.5 text-[13px] font-semibold capitalize text-gray-900">{a.activity_type.replace(/_/g, " ")}</div>{a.activity_description && <div className="text-[12px] text-gray-500">{a.activity_description}</div>}{a.ip_address && <div className="mt-1 text-[11px] text-gray-400">IP: {a.ip_address}</div>}</div><div className="shrink-0 text-[11px] font-medium text-gray-400">{timeAgo(a.created_at)}</div></div></article>))}</div>)}
            {tab === "applications" && (<div className="space-y-5"><div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-[12px] leading-5 text-blue-900">These applications use your BINZEO identity. Passwords and tokens are never shared with them; Central Auth only sends a verified identity token.</div>{applications.length === 0 ? <EmptyState icon="/icons/globe.svg" text="No connected application activity yet." /> : <><div className="grid gap-3 sm:grid-cols-2">{applications.map((app) => <article key={`${app.project_key}:${app.client_key}`} className="rounded-2xl border border-gray-100 bg-white p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">{app.project_key === "jabiyen" ? <Image src="/images/jabiyenlogo.png" alt="JABIYEN logo" width={44} height={44} className="h-full w-full object-contain" /> : <Image src="/icons/globe.svg" alt="" width={22} height={22} />}</div><div className="min-w-0"><div className="text-[13px] font-semibold text-gray-900">{app.brand_name}</div><div className="mt-1 text-[12px] text-gray-500">{app.client_name ?? app.project_name}</div></div></div><StatusPill status="success" /></div><div className="mt-3 text-[11px] text-gray-500">Last used {timeAgo(app.last_used_at)} · {app.event_count} recorded event{app.event_count === 1 ? "" : "s"}</div><div className="mt-1 text-[11px] text-gray-400">{app.last_ip ?? "No IP"}{app.last_city ? ` · ${app.last_city}` : ""}</div></article>)}</div><SectionHeading>Detailed access history</SectionHeading><div className="space-y-3">{projectEvents.map((event) => { const project = Array.isArray(event.platform_projects) ? event.platform_projects[0] : event.platform_projects; const client = Array.isArray(event.platform_clients) ? event.platform_clients[0] : event.platform_clients; return <article key={event.id} className="rounded-2xl border border-gray-100 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-[13px] font-semibold capitalize text-gray-900">{event.event_type.replace(/_/g, " ")} · {project?.brand_name ?? "Application"}</div><div className="mt-1 text-[11px] text-gray-500">{client?.client_name ?? "Client"} · {event.outcome}</div><div className="mt-1 text-[11px] text-gray-400">{event.ip_address ?? "No IP"} · {[event.city, event.region, event.country].filter(Boolean).join(", ") || "Unknown location"}</div><div className="mt-1 text-[11px] text-gray-400">{[event.device_name, event.operating_system, event.browser].filter(Boolean).join(" · ") || "Unknown device"}</div></div><div className="shrink-0 text-[11px] text-gray-400">{timeAgo(event.occurred_at)}</div></div></article>; })}</div></> }</div>)}
            {tab === "methods" && (<div className="space-y-3">{methods.length === 0 ? <EmptyState icon="/icons/lock.svg" text="No auth methods linked yet." /> : methods.map((m) => (<article key={m.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-500 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.1)] sm:p-5"><div className="relative flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><span className="text-[13px] font-semibold capitalize text-gray-900">{m.auth_method.replace(/_/g, " ")}</span><span className="text-[11px] text-gray-500">via {m.provider}</span></div>{m.provider_email && <div className="text-[12px] text-gray-500">{m.provider_email}</div>}<div className="mt-1 text-[11px] text-gray-400">Signed in {m.login_count} time{m.login_count !== 1 ? "s" : ""}{m.last_sign_in_at && ` · Last: ${timeAgo(m.last_sign_in_at)}`}</div></div><span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600">{m.last_event ?? "linked"}</span></div></article>))}</div>)}
            {tab === "verifications" && (<div className="space-y-3">{verifications.length === 0 ? <EmptyState icon="/icons/check.svg" text="No verification records yet." /> : verifications.map((v) => (<article key={v.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-500 hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.1)] sm:p-5"><div className="relative flex items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><span className="text-[13px] font-semibold capitalize text-gray-900">{v.verification_type}</span><StatusPill status={v.verification_status} /></div><div className="text-[11.5px] text-gray-500">{v.verified_at ? `Verified ${timeAgo(v.verified_at)}` : v.last_requested_at ? `Requested ${timeAgo(v.last_requested_at)}` : "No activity"}</div><div className="mt-0.5 text-[11px] text-gray-400">Attempts: {v.attempt_count}</div></div></div></article>))}</div>)}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PROFILE PAGE                                                  */
/* ================================================================== */
export default function ProfilePage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"menu" | "profile" | "security" | "contacts" | "addresses" | "devices" | "sectors">("menu");
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
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white antialiased">

      {/* STICKY HEADER — Pure white, no gap */}
      <div className="sticky top-0 z-40 bg-white flex items-center justify-between px-4 py-3.5">
        {activeSection === "menu" ? (
          <div className="w-6" />
        ) : (
          <button type="button" onClick={() => setActiveSection("menu")} className="p-1 -ml-2 rounded-full active:bg-gray-100 transition-colors">
            <Icons.Back />
          </button>
        )}
        <h1 className="text-[17px] font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2 tracking-tight">
          {activeSection === "menu" ? "Settings" : sectionTabs.find(t => t[0] === activeSection)?.[1]}
        </h1>
        <div className="w-6" />
      </div>

      {activeSection === "menu" ? (
        /* ================= MAIN MENU VIEW ================= */
        <div className="mx-auto max-w-md px-4 pt-2 pb-8 space-y-5">

          {/* Profile Header Card */}
          <div className={`${cardCls} p-4 flex items-center gap-4`}>
            <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-gray-100">
              {form.profile_photo_url ? (
                <img src={form.profile_photo_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-400">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-semibold text-gray-900 truncate leading-tight tracking-tight">{displayName}</h2>
              <p className="text-[13px] text-gray-500 truncate mt-0.5">{userEmail}</p>
              <button onClick={() => setActiveSection("profile")} className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 active:scale-95 transition-all duration-200 bg-blue-50 px-3 py-1 rounded-full">
                <Icons.Edit /> Edit Profile
              </button>
            </div>
          </div>

          {/* SECTION: Account details */}
          <div>
            <h3 className="mb-2 px-4 text-[12px] font-medium text-gray-500 tracking-wide uppercase">Account details</h3>
            <div className={cardCls}>
              <MenuItem icon={<Icons.User />} label="Profile" onClick={() => setActiveSection("profile")} />
            </div>
          </div>

          {/* SECTION: Security & Preferences */}
          <div>
            <h3 className="mb-2 px-4 text-[12px] font-medium text-gray-500 tracking-wide uppercase">Security & Preferences</h3>
            <div className={cardCls}>
              <MenuItem icon={<Icons.Lock />} label="Security" onClick={() => setActiveSection("security")} />
              <MenuItem icon={<Icons.Info />} label="Contacts" onClick={() => setActiveSection("contacts")} />
              <MenuItem icon={<Icons.Globe />} label="Addresses" onClick={() => setActiveSection("addresses")} />
            </div>
          </div>

          {/* SECTION: General */}
          <div>
            <h3 className="mb-2 px-4 text-[12px] font-medium text-gray-500 tracking-wide uppercase">General</h3>
            <div className={cardCls}>
              <MenuItem icon={<Icons.Agents />} label="Devices" onClick={() => setActiveSection("devices")} />
              <MenuItem icon={<Icons.Explore />} label="Sectors" onClick={() => setActiveSection("sectors")} />
            </div>
          </div>

          {/* SECTION: Support */}
          <div className="pb-4">
            <h3 className="mb-2 px-4 text-[12px] font-medium text-gray-500 tracking-wide uppercase">Support</h3>
            <div className={cardCls}>
              <MenuItem icon={<Icons.Help />} label="Help Center" onClick={() => {}} />
              <MenuItem icon={<Icons.Lock />} label="Log Out" onClick={handleLogout} isDestructive />
            </div>
          </div>

        </div>
      ) : (
        /* ================= SUB-SECTION VIEWS ================= */
        <div className="mx-auto max-w-6xl px-3 sm:px-5 pb-8">
          {activeSection === "profile" && (
            <form onSubmit={handleSubmit} className="mx-auto max-w-md px-4 pt-2 space-y-6">
              {message && (
                <div className={`rounded-[14px] px-4 py-3.5 text-[13px] font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>{message.text}</div>
              )}

              <div className={`${cardCls} p-4 flex items-center gap-4`}>
                <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-gray-100">
                  {form.profile_photo_url ? (
                    <img src={form.profile_photo_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-400">{displayName.charAt(0).toUpperCase()}</div>
                  )}
                  {photoUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] text-white"><span>...</span></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[16px] font-semibold text-gray-900 truncate leading-tight tracking-tight">{displayName}</h2>
                  <p className="text-[13px] text-gray-500 truncate mt-0.5">{userEmail}</p>
                  <label className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 active:scale-95 transition-all duration-200 bg-blue-50 px-3 py-1 rounded-full">
                    <Icons.Edit /> Change Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={photoUploading} className="sr-only" />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-2 px-4 text-[12px] font-medium text-gray-500 tracking-wide uppercase">Account details</h3>
                <div className={cardCls}>
                  <div className={listRowCls}>
                    <div className="flex items-center gap-3"><Icons.User /><span className="text-[15px] font-normal text-gray-900">First Name</span></div>
                    <input type="text" value={form.first_name ?? ""} onChange={(e) => update("first_name", e.target.value)} className={inputCls} placeholder="Enter first name" />
                  </div>
                  <div className={listRowCls}>
                    <div className="flex items-center gap-3"><Icons.User /><span className="text-[15px] font-normal text-gray-900">Last Name</span></div>
                    <input type="text" value={form.last_name ?? ""} onChange={(e) => update("last_name", e.target.value)} className={inputCls} placeholder="Enter last name" />
                  </div>
                  <div className={listRowCls}>
                    <div className="flex items-center gap-3"><Icons.User /><span className="text-[15px] font-normal text-gray-900">Username</span></div>
                    <div className="flex flex-col items-end max-w-[60%] w-full">
                      <input type="text" value={form.username ?? ""} onChange={(e) => update("username", e.target.value)} className={`${inputCls} max-w-full`} placeholder="username" />
                      {usernameCheck.message && <span className={`text-[10px] mt-0.5 text-right w-full font-medium ${usernameCheck.available ? "text-emerald-600" : "text-rose-500"}`}>{usernameCheck.message}</span>}
                    </div>
                  </div>
                  <div className={listRowCls}>
                    <div className="flex items-center gap-3"><Icons.User /><span className="text-[15px] font-normal text-gray-900">Gender</span></div>
                    <select value={form.gender ?? ""} onChange={(e) => update("gender", e.target.value || null)} className={`${inputCls} appearance-none`}>
                      <option value="">Not specified</option><option value="male">Male</option><option value="female">Female</option><option value="non_binary">Non-binary</option><option value="prefer_not_to_say">Prefer not to say</option><option value="other">Other</option>
                    </select>
                  </div>
                  <div className={listRowCls}>
                    <div className="flex items-center gap-3"><Icons.Calendar /><span className="text-[15px] font-normal text-gray-900">Date of Birth</span></div>
                    <input type="date" value={form.date_of_birth ?? ""} onChange={(e) => update("date_of_birth", e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 px-4 text-[12px] font-medium text-gray-500 tracking-wide uppercase">Preferences</h3>
                <div className={cardCls}>
                  <div className={listRowCls}><div className="flex items-center gap-3"><Icons.Globe /><span className="text-[15px] font-normal text-gray-900">Language</span></div><input type="text" value={form.preferred_language ?? ""} onChange={(e) => update("preferred_language", e.target.value)} className={inputCls} placeholder="English" /></div>
                  <div className={listRowCls}><div className="flex items-center gap-3"><Icons.Globe /><span className="text-[15px] font-normal text-gray-900">Timezone</span></div><input type="text" value={form.timezone ?? ""} onChange={(e) => update("timezone", e.target.value)} className={inputCls} placeholder="UTC" /></div>
                  <div className={listRowCls}><div className="flex items-center gap-3"><Icons.Info /><span className="text-[15px] font-normal text-gray-900">Currency</span></div><input type="text" value={form.currency ?? ""} onChange={(e) => update("currency", e.target.value)} className={inputCls} placeholder="USD" /></div>
                  <div className={listRowCls}><div className="flex items-center gap-3"><Icons.Sun /><span className="text-[15px] font-normal text-gray-900">Time Format</span></div><select value={form.time_format ?? "24h"} onChange={(e) => update("time_format", e.target.value)} className={`${inputCls} appearance-none`}><option value="24h">24-hour</option><option value="12h">12-hour</option></select></div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 px-4 text-[12px] font-medium text-gray-500 tracking-wide uppercase">Notifications</h3>
                <div className={cardCls}>
                  <div className={listRowCls}>
                    <div className="flex items-center gap-3"><Icons.Bell /><span className="text-[15px] font-normal text-gray-900">Marketing Emails</span></div>
                    <label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" checked={!!form.marketing_email} onChange={(e) => update("marketing_email", e.target.checked)} className="peer sr-only" /><div className="h-[31px] w-[51px] rounded-full bg-gray-200 peer-checked:bg-black transition-colors duration-300"></div><div className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-checked:translate-x-[20px]"></div></label>
                  </div>
                  <div className={listRowCls}>
                    <div className="flex items-center gap-3"><Icons.Bell /><span className="text-[15px] font-normal text-gray-900">Push Notifications</span></div>
                    <label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" checked={!!form.push_notifications} onChange={(e) => update("push_notifications", e.target.checked)} className="peer sr-only" /><div className="h-[31px] w-[51px] rounded-full bg-gray-200 peer-checked:bg-black transition-colors duration-300"></div><div className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-checked:translate-x-[20px]"></div></label>
                  </div>
                  <div className={listRowCls}>
                    <div className="flex items-center gap-3"><Icons.Lock /><span className="text-[15px] font-normal text-gray-900">Security Alerts</span></div>
                    <label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" checked={!!form.security_notifications} onChange={(e) => update("security_notifications", e.target.checked)} className="peer sr-only" /><div className="h-[31px] w-[51px] rounded-full bg-gray-200 peer-checked:bg-black transition-colors duration-300"></div><div className="absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-checked:translate-x-[20px]"></div></label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 px-4 text-[12px] font-medium text-gray-500 tracking-wide uppercase">Support</h3>
                <div className={cardCls}>
                  <div className={listRowCls}><div className="flex items-center gap-3"><Icons.Help /><span className="text-[15px] font-normal text-gray-900">Recovery Email</span></div><input type="email" value={form.recovery_email ?? ""} onChange={(e) => update("recovery_email", e.target.value)} className={inputCls} placeholder="backup@example.com" /></div>
                  <div className={listRowCls}><div className="flex items-center gap-3"><Icons.Info /><span className="text-[15px] font-normal text-gray-900">Help Center</span></div><Icons.Chevron /></div>
                </div>
              </div>

              <div className="pt-2 pb-6">
                <button type="submit" disabled={saving} className="w-full rounded-[16px] bg-black py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-gray-800 active:scale-[0.97] disabled:opacity-50 shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                  {saving ? (<><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>) : ("Save Changes")}
                </button>
              </div>
            </form>
          )}

          {activeSection === "security" && <SecuritySection />}
          {activeSection === "contacts" && <ContactsSection />}
          {activeSection === "addresses" && <AddressesSection />}
          {activeSection === "devices" && <DevicesSection />}
          {activeSection === "sectors" && <SectorsSection />}
        </div>
      )}
    </div>
  );
}
