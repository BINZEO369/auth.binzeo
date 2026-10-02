"use client";

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
  is_primary: boolean;
};

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[#1f1f2e] bg-[#0a0a0f] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors";

const emptyForm: Partial<Address> = {
  address_type: "home",
  address_line_1: "",
  is_primary: false,
};

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
      <label className="block text-xs font-medium text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Address>>(emptyForm);
  const [saving, setSaving] = useState(false);
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
    const res = await apiFetch(`/api/user/addresses/${id}`, {
      method: "DELETE",
    });
    if (res.success) {
      setMessage({ type: "success", text: "Address deleted" });
      load();
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Addresses</h1>
          <p className="text-sm text-gray-400">
            Manage your saved addresses
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openNew}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            + Add address
          </button>
        )}
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl border border-indigo-500/20 bg-[#0d0d13] space-y-4"
        >
          <h2 className="text-sm font-semibold text-white">
            {editingId ? "Edit address" : "New address"}
          </h2>

          <div className="grid grid-cols-2 gap-3">
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
              placeholder="Apartment, suite, etc."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
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

          <div className="grid grid-cols-2 gap-3">
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

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.is_primary}
              onChange={(e) => update("is_primary", e.target.checked)}
              className="w-4 h-4 rounded border-[#1f1f2e] bg-[#0a0a0f] accent-indigo-600"
            />
            Set as primary address
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2 rounded-lg border border-[#1f1f2e] text-gray-300 hover:text-white hover:border-[#2d2d40] text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium transition-colors"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="p-12 rounded-2xl border border-dashed border-[#1f1f2e] text-center">
          <div className="text-4xl mb-3">📍</div>
          <p className="text-gray-400 text-sm mb-4">
            No addresses yet. Add your first one.
          </p>
          <button
            onClick={openNew}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Add address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="p-5 rounded-2xl border border-[#1f1f2e] bg-[#0d0d13] hover:border-indigo-500/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                    {a.address_type}
                  </span>
                  {a.is_primary && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(a)}
                    className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-300">
                {a.address_line_1}
                {a.address_line_2 && `, ${a.address_line_2}`}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {[a.city, a.state_province, a.postal_code, a.country_code]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
