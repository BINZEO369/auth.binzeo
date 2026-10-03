"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api/client";
import QRCode from "qrcode";

type TokenRecord = {
  id: string;
  token_preview: string;
  duration_minutes: number;
  expires_at: string;
  used_at: string | null;
  revoked_at: string | null;
  created_ip: string | null;
  created_at: string;
};

const DURATIONS = [
  { value: 1, label: "1 minute" },
  { value: 2, label: "2 minutes" },
  { value: 5, label: "5 minutes" },
  { value: 1440, label: "24 hours" },
  { value: 4320, label: "72 hours" },
  { value: 7200, label: "5 days" },
];

function status(token: TokenRecord) {
  if (token.used_at) return "Used";
  if (token.revoked_at) return "Revoked";
  if (new Date(token.expires_at).getTime() <= Date.now()) return "Expired";
  return "Active";
}

export default function TemporaryLoginTokens() {
  const [tokens, setTokens] = useState<TokenRecord[]>([]);
  const [duration, setDuration] = useState(5);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const response = await apiFetch<{ tokens: TokenRecord[] }>("/api/user/temporary-login-tokens");
    if (response.success) setTokens(response.data.tokens);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  const createToken = async () => {
    setWorking(true);
    setMessage(null);
    setNewToken(null);
    setQrImage(null);
    const response = await apiFetch<{ token: string; token_record: TokenRecord }>(
      "/api/user/temporary-login-tokens",
      { method: "POST", body: JSON.stringify({ duration_minutes: duration }) },
    );
    if (response.success) {
      setNewToken(response.data.token);
      const directLoginUrl = `${window.location.origin}/login#temporary_token=${encodeURIComponent(response.data.token)}`;
      setQrImage(await QRCode.toDataURL(directLoginUrl, { width: 240, margin: 2, color: { dark: "#101820", light: "#ffffff" } }));
      setMessage("Token created. Copy it now; it will not be shown again.");
      await load();
    } else {
      setMessage(response.error.message);
    }
    setWorking(false);
  };

  const revoke = async (id: string) => {
    setWorking(true);
    const response = await apiFetch(`/api/user/temporary-login-tokens/${id}`, { method: "DELETE" });
    setMessage(response.success ? "Temporary token revoked." : response.error.message);
    if (response.success) await load();
    setWorking(false);
  };

  const copy = async () => {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setMessage("Token copied to clipboard. Treat it like a password.");
  };

  return (
    <section className="p-5 rounded-2xl border border-[#d5dfdd] bg-white space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[#101820]">Temporary full-login tokens</h2>
        <p className="text-xs text-[#6d7c80] mt-1">
          Create a one-time token for full account login. It expires automatically and can be revoked anytime.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="flex-1 rounded-lg border border-[#d5dfdd] bg-[#eef2f1] px-3 py-2 text-sm text-[#101820]">
          {DURATIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button onClick={createToken} disabled={working} className="rounded-lg bg-[#101820] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {working ? "Creating..." : "Create token"}
        </button>
      </div>
      {newToken && (
        <div className="rounded-xl border border-[#ead39a] bg-[#fff8e8] p-3 space-y-2">
          <div className="text-xs font-medium text-[#7a5b14]">Copy this token now</div>
          <code className="block break-all rounded-lg bg-white p-2 text-xs text-[#101820]">{newToken}</code>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={copy} className="rounded-lg border border-[#d8bd6e] px-3 py-1.5 text-xs text-[#7a5b14]">Copy token</button>
            {qrImage && <Image src={qrImage} alt="QR code for temporary login token" width={160} height={160} unoptimized className="h-40 w-40 rounded-lg border border-[#ead39a] bg-white p-2" />}
          </div>
          <div className="text-[11px] text-[#7a5b14]">Google Lens or any QR camera can open this BINZEO login URL directly and complete login. Anyone who scans it can enter the account, so keep it private.</div>
        </div>
      )}
      {message && <div className="text-xs text-[#5c6b70]">{message}</div>}
      {!loading && tokens.length > 0 && (
        <div className="space-y-2">
          {tokens.map((token) => {
            const state = status(token);
            const active = state === "Active";
            return (
              <div key={token.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#eef0ef] p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#101820]">
                    <code>{token.token_preview}</code>
                    <span className={`rounded-full px-2 py-0.5 ${active ? "bg-[#dff2e9] text-[#2e8064]" : "bg-[#eef2f1] text-[#6d7c80]"}`}>{state}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#849295]">Expires {new Date(token.expires_at).toLocaleString()}</div>
                </div>
                {active && <button onClick={() => revoke(token.id)} disabled={working} className="shrink-0 text-xs text-[#b84f4b]">Revoke</button>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
