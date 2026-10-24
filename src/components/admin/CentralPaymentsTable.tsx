"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type PaymentRow = {
  payment_request_id: string;
  website_id: string;
  website_key: string;
  website_name: string;
  brand_name: string | null;
  user_id: string | null;
  binzeo_user_id: string | null;
  username: string | null;
  user_name: string | null;
  user_email: string | null;
  order_id: string;
  amount_minor: number;
  currency: string;
  status: "pending" | "paid" | "cancelled" | "expired" | "refunded";
  created_at: string;
  paid_at: string | null;
};

type PaymentSite = {
  project_id: string;
  site_key: string;
  site_name: string;
  brand_name: string;
  status: string;
};

type PaymentHistory = {
  rows: PaymentRow[];
  sites: PaymentSite[];
  pagination: { page: number; page_size: number; total: number; total_pages: number };
};

const PAGE_SIZE = 25;
const selectClass = "min-h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-gray-500";

function formatAmount(minor: number, currency: string) {
  try {
    const code = currency.toUpperCase();
    const digits = new Intl.NumberFormat("en-US", { style: "currency", currency: code }).resolvedOptions().maximumFractionDigits ?? 2;
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(minor / (10 ** digits));
  } catch {
    return `${(minor / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function statusClasses(status: PaymentRow["status"]) {
  if (status === "paid") return "bg-emerald-50 text-emerald-700 ring-emerald-600/15";
  if (status === "refunded") return "bg-violet-50 text-violet-700 ring-violet-600/15";
  if (status === "pending") return "bg-amber-50 text-amber-700 ring-amber-600/15";
  return "bg-gray-100 text-gray-600 ring-gray-500/10";
}

export default function CentralPaymentsTable() {
  const [history, setHistory] = useState<PaymentHistory | null>(null);
  const [site, setSite] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE), site, status });

    void apiFetch<PaymentHistory>(`/api/admin/payments?${params}`, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;
      if (result.success) {
        setHistory(result.data);
      } else {
        setHistory(null);
        setError(result.error.code === "PAYMENTS_READ_REQUIRED" || result.error.code === "HTTP_403"
          ? "Your administrator account does not have permission to read payment records."
          : result.error.message);
      }
      setLoading(false);
    });

    return () => controller.abort();
  }, [page, site, status, refreshVersion]);

  const pageCount = history?.pagination.total_pages ?? 0;

  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50 px-3 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">BINZEO · Finance operations</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Central payment records</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Payments from all registered websites, with their site, Central Auth user, order, amount and webhook-verified status. Card numbers and payment credentials are never shown or stored here.</p>
          </div>
          <button type="button" onClick={() => { setLoading(true); setError(""); setRefreshVersion((value) => value + 1); }} disabled={loading} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-50">
            {loading ? "Loading…" : "Refresh records"}
          </button>
        </header>

        <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Payment filters">
          <label className="grid gap-1 text-xs font-medium text-slate-600">
            Website
            <select className={selectClass} value={site} onChange={(event) => { setLoading(true); setError(""); setSite(event.target.value); setPage(1); }}>
              <option value="all">All websites</option>
              {(history?.sites ?? []).map((item) => <option key={item.project_id} value={item.site_key}>{item.site_name} · {item.site_key}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-medium text-slate-600">
            Payment status
            <select className={selectClass} value={status} onChange={(event) => { setLoading(true); setError(""); setStatus(event.target.value); setPage(1); }}>
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="refunded">Refunded</option>
            </select>
          </label>
          <div className="ml-auto text-sm text-slate-500" aria-live="polite">
            {history ? `${history.pagination.total.toLocaleString()} records` : "Central records"}
          </div>
        </section>

        {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Website</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Central Auth user</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Order ID</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Amount</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Created</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Paid at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && !history && <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">Loading central payment records…</td></tr>}
                {!loading && !error && history?.rows.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No payment records match these filters.</td></tr>}
                {history?.rows.map((row) => (
                  <tr key={row.payment_request_id} className="align-top hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">{row.website_name}</div>
                      <div className="mt-1 text-xs text-slate-500">{row.website_key} · {row.brand_name ?? ""}</div>
                      <div className="mt-1 max-w-48 truncate font-mono text-[10px] text-slate-400" title={row.website_id}>{row.website_id}</div>
                    </td>
                    <td className="max-w-72 px-4 py-4">
                      <div className="font-medium text-slate-900">{row.user_name ?? row.username ?? "Account name unavailable"}</div>
                      <div className="mt-1 break-all text-xs text-slate-600">{row.user_email ?? "Email unavailable"}</div>
                      <div className="mt-1 break-all font-mono text-[10px] text-slate-500">User ID: {row.user_id ?? "account removed"}</div>
                      {row.binzeo_user_id && <div className="mt-1 break-all font-mono text-[10px] text-slate-500">BINZEO ID: {row.binzeo_user_id}</div>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="break-all font-medium text-slate-900">{row.order_id}</div>
                      <div className="mt-1 max-w-56 break-all font-mono text-[10px] text-slate-400" title={row.payment_request_id}>Payment ID: {row.payment_request_id}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold tabular-nums text-slate-900">{formatAmount(row.amount_minor, row.currency)}</td>
                    <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusClasses(row.status)}`}>{row.status}</span></td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">{formatDate(row.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600">{formatDate(row.paid_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <span>{history && history.pagination.total ? `Page ${history.pagination.page} of ${history.pagination.total_pages}` : "Payments are sorted newest first"}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setError(""); setPage((value) => Math.max(1, value - 1)); }} className="min-h-10 rounded-lg border border-slate-300 px-3 disabled:opacity-40">Previous</button>
              <button type="button" disabled={!history || page >= pageCount || loading} onClick={() => { setLoading(true); setError(""); setPage((value) => value + 1); }} className="min-h-10 rounded-lg border border-slate-300 px-3 disabled:opacity-40">Next</button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
