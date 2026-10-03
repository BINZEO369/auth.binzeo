"use client";

import { useEffect, useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { apiFetch } from "@/lib/api/client";

type Passkey = { id: string; device_name: string | null; authenticator_type: string; is_backed_up: boolean; last_used_at: string | null; created_at: string };

export default function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [deviceName, setDeviceName] = useState("This device");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const load = async () => { const res = await apiFetch<{ passkeys: Passkey[] }>("/api/user/passkeys"); if (res.success) setPasskeys(res.data.passkeys); };
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);
  const register = async () => {
    setWorking(true); setMessage(null);
    try {
      const optionsRes = await apiFetch<{ challenge_id: string; options: Parameters<typeof startRegistration>[0]["optionsJSON"] }>("/api/user/passkeys", { method: "POST", body: JSON.stringify({}) });
      if (!optionsRes.success) throw new Error(optionsRes.error.message);
      const response = await startRegistration({ optionsJSON: optionsRes.data.options });
      const verifyRes = await apiFetch("/api/user/passkeys/register", { method: "POST", body: JSON.stringify({ challenge_id: optionsRes.data.challenge_id, challenge: optionsRes.data.options.challenge, response, device_name: deviceName }) });
      if (!verifyRes.success) throw new Error(verifyRes.error.message);
      setMessage("Passkey created. You can use fingerprint, Face ID, PIN, or device unlock to sign in."); await load();
    } catch (err) { setMessage(err instanceof Error ? err.message : "Passkey registration cancelled"); }
    setWorking(false);
  };
  const revoke = async (id: string) => { setWorking(true); const res = await apiFetch(`/api/user/passkeys/${id}`, { method: "DELETE" }); setMessage(res.success ? "Passkey revoked." : res.error.message); if (res.success) await load(); setWorking(false); };
  return <section className="p-5 rounded-2xl border border-[#dddddd] bg-white space-y-4">
    <div><h2 className="text-base font-semibold text-[#111111]">Passkeys</h2><p className="text-xs text-[#666666] mt-1">Use your device biometric, Face ID, PIN, Windows Hello, or a security key. A normal photo is not accepted.</p></div>
    <div className="flex gap-2"><input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} className="flex-1 rounded-lg border border-[#dddddd] bg-[#f3f3f3] px-3 py-2 text-sm" placeholder="Device name" /><button onClick={register} disabled={working} className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{working ? "Waiting..." : "Create passkey"}</button></div>
    {message && <div className="text-xs text-[#6666666]">{message}</div>}
    <div className="space-y-2">{passkeys.map((p) => <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#eeeeee] p-3"><div><div className="text-xs font-medium text-[#111111]">{p.device_name ?? "Passkey"}</div><div className="text-[11px] text-[#888888]">{p.authenticator_type}{p.is_backed_up ? " · backed up" : ""}</div></div><button onClick={() => revoke(p.id)} disabled={working} className="text-xs text-[#333333]">Revoke</button></div>)}</div>
  </section>;
}
