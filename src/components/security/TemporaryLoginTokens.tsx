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
      const directLoginUrl = `${window.location.origin}/signin#temporary_token=${encodeURIComponent(response.data.token)}`;
      setQrImage(await QRCode.toDataURL(directLoginUrl, { width: 240, margin: 2, color: { dark: "#111111", light: "#ffffff" } }));
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
    <section className="p-5 rounded-2xl border border-[#dddddd] bg-white space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[#111111]">Temporary full-login tokens</h2>
        <p className="text-xs text-[#666666] mt-1">
          Create a one-time token for full account login. It expires automatically and can be revoked anytime.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="flex-1 rounded-lg border border-[#dddddd] bg-[#f3f3f3] px-3 py-2 text-sm text-[#111111]">
          {DURATIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <button onClick={createToken} disabled={working} className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {working ? "Creating..." : "Create token"}
        </button>
      </div>
      {newToken && (
        <div className="rounded-xl border border-[#cccccc] bg-[#f5f5f5] p-3 space-y-2">
          <div className="text-xs font-medium text-[#333333]">Copy this token now</div>
          <code className="block break-all rounded-lg bg-white p-2 text-xs text-[#111111]">{newToken}</code>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={copy} className="rounded-lg border border-[#aaaaaa] px-3 py-1.5 text-xs text-[#333333]">Copy token</button>
            {qrImage && <Image src={qrImage} alt="QR code for temporary login token" width={160} height={160} unoptimized className="h-40 w-40 rounded-lg border border-[#cccccc] bg-white p-2" />}
          </div>
          <div className="text-[11px] text-[#333333]">Google Lens or any QR camera can open this BINZEO login URL directly and complete login. Anyone who scans it can enter the account, so keep it private.</div>
        </div>
      )}
      {message && <div className="text-xs text-[#6666666]">{message}</div>}
      {!loading && tokens.length > 0 && (
        <div className="space-y-2">
          {tokens.map((token) => {
            const state = status(token);
            const active = state === "Active";
            return (
              <div key={token.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#eeeeee] p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#111111]">
                    <code>{token.token_preview}</code>
                    <span className={`rounded-full px-2 py-0.5 ${active ? "bg-[#eeeeee] text-[#444444]" : "bg-[#f3f3f3] text-[#666666]"}`}>{state}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-[#888888]">Expires {new Date(token.expires_at).toLocaleString()}</div>
                </div>
                {active && <button onClick={() => revoke(token.id)} disabled={working} className="shrink-0 text-xs text-[#333333]">Revoke</button>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
