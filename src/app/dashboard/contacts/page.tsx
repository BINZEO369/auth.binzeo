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

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[#d5dfdd] bg-[#eef2f1] text-[#101820] text-sm placeholder-gray-600 focus:outline-none focus:border-[#79b9d5] focus:ring-2 focus:ring-[#79b9d5]/30 transition-colors";

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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#5c6b70] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Contact>>(emptyForm);
  const [saving, setSaving] = useState(false);
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
    const res = await apiFetch(`/api/user/contacts/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      setMessage({ type: "success", text: "Contact deleted" });
      load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#79b9d5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#101820] mb-1">Contacts</h1>
          <p className="text-sm text-[#5c6b70]">
            Websites, social profiles and messaging handles
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openNew}
            className="px-4 py-2 rounded-lg bg-[#101820] hover:bg-[#263746] text-[#101820] text-sm font-medium transition-colors"
          >
            + Add contact
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-[#dff2e9] border-[#a8d9c4] text-[#2e8064]"
              : "bg-[#fbe5e2] border-[#efb8b0] text-[#b84f4b]"
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl border border-[#b4ded3] bg-white space-y-4"
        >
          <h2 className="text-sm font-semibold text-[#101820]">
            {editingId ? "Edit contact" : "New contact"}
          </h2>

          <div className="grid grid-cols-2 gap-3">
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

          <label className="flex items-center gap-2 text-sm text-[#35454c] cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.is_primary}
              onChange={(e) => update("is_primary", e.target.checked)}
              className="w-4 h-4 rounded border-[#d5dfdd] bg-[#eef2f1] accent-[#101820]"
            />
            Set as primary
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2 rounded-lg border border-[#d5dfdd] text-[#35454c] hover:text-[#101820] hover:border-[#bdccca] text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#101820] hover:bg-[#263746] disabled:opacity-60 text-[#101820] text-sm font-medium transition-colors"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      )}

      {contacts.length === 0 && !showForm ? (
        <div className="p-12 rounded-2xl border border-dashed border-[#d5dfdd] text-center">
          <Image
            src="/icons/id-card.svg"
            alt=""
            width={40}
            height={40}
            className="invert mx-auto mb-3"
          />
          <p className="text-[#5c6b70] text-sm mb-4">
            No contacts yet. Add your first one.
          </p>
          <button
            onClick={openNew}
            className="px-4 py-2 rounded-lg bg-[#101820] hover:bg-[#263746] text-[#101820] text-sm font-medium transition-colors"
          >
            Add contact
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-[#d5dfdd] bg-white hover:border-[#9bd7c7] transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    <Image
                      src={TYPE_ICON[c.contact_type] ?? "/icons/link.svg"}
                      alt=""
                      width={20}
                      height={20}
                      className="invert"
                    />
                  </span>
                  <span className="text-xs text-[#5c6b70] capitalize">
                    {c.contact_type}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-xs text-[#5c6b70] hover:text-[#216f9e] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs text-[#5c6b70] hover:text-[#b84f4b] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="text-sm text-[#101820] font-medium truncate mb-1">
                {c.contact_value}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {c.label && (
                  <span className="text-xs text-[#6d7c80]">{c.label}</span>
                )}
                {c.is_primary && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#dff2eb] text-[#216f9e] border border-[#b4ded3]">
                    Primary
                  </span>
                )}
                {c.is_verified && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#dff2e9] text-[#2e8064] border border-[#b6e1cf]">
                    <Image
                      src="/icons/check.svg"
                      alt=""
                      width={12}
                      height={12}
                      className="invert inline-block mr-1 align-[-2px]"
                    />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
