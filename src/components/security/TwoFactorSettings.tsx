"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export default function TwoFactorSettings() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => { (async () => { const res = await apiFetch<{ enabled: boolean }>("/api/user/two-factor"); if (res.success) setEnabled(res.data.enabled); setLoading(false); })(); }, []);
  const toggle = async () => { setWorking(true); setMessage(null); const next = !enabled; const res = await apiFetch<{ enabled: boolean }>("/api/user/two-factor", { method: "POST", body: JSON.stringify({ enabled: next }) }); if (res.success) { setEnabled(res.data.enabled); setMessage(res.data.enabled ? "2FA enabled. Password sign-ins will require a 30-second email OTP." : "2FA disabled. Password sign-ins will not request an OTP."); } else setMessage(res.error.message); setWorking(false); };
  return <section className="p-5 rounded-2xl border border-[#dddddd] bg-white space-y-4"><div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-semibold text-[#111111]">Two-factor authentication</h2><p className="text-xs text-[#666666] mt-1">Email OTP protects email-and-password sign-ins. Passkeys and temporary tokens remain direct access, with a security email when 2FA is enabled.</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] ${enabled ? "border-green-200 bg-green-50 text-green-700" : "border-[#dddddd] bg-[#f5f5f5] text-[#666666]"}`}>{loading ? "Loading" : enabled ? "Enabled" : "Disabled"}</span></div><button onClick={toggle} disabled={loading || working} className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{working ? "Saving..." : enabled ? "Disable 2FA" : "Enable 2FA"}</button>{message && <div className="text-xs text-[#666666]">{message}</div>}</section>;
}
