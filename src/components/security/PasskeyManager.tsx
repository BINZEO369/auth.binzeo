"use client";

import { useEffect, useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { apiFetch } from "@/lib/api/client";

type Passkey = { id: string; device_name: string | null; authenticator_type: string; is_backed_up: boolean; last_used_at: string | null; created_at: string };

export default function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [deviceName, setDeviceName] = useState("This device");
  const [platformAvailable, setPlatformAvailable] = useState<boolean | null>(null);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const load = async () => { const res = await apiFetch<{ passkeys: Passkey[] }>("/api/user/passkeys"); if (res.success) setPasskeys(res.data.passkeys); };
  useEffect(() => {
    void load();
    if (typeof PublicKeyCredential === "undefined" ||
        typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== "function") {
      setPlatformAvailable(false);
      return;
    }
    void PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      .then(setPlatformAvailable)
      .catch(() => setPlatformAvailable(false));
  }, []);
  const register = async () => {
    setWorking(true); setMessage(null);
    try {
      const optionsRes = await apiFetch<{ challenge_id: string; options: Parameters<typeof startRegistration>[0]["optionsJSON"] }>("/api/user/passkeys", { method: "POST", body: JSON.stringify({}) });
      if (!optionsRes.success) throw new Error(optionsRes.error.message);
      const response = await startRegistration({ optionsJSON: optionsRes.data.options });
      const verifyRes = await apiFetch("/api/user/passkeys/register", { method: "POST", body: JSON.stringify({ challenge_id: optionsRes.data.challenge_id, challenge: optionsRes.data.options.challenge, response, device_name: deviceName }) });
      if (!verifyRes.success) throw new Error(verifyRes.error.message);
      setMessage("Device passkey created. You can now use fingerprint, Face ID, PIN, or device unlock to sign in."); await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Passkey registration cancelled";
      setMessage(message.includes("NotAllowedError") ? "Device passkey setup was cancelled or this browser does not support a device authenticator." : message);
    }
    setWorking(false);
  };
  const revoke = async (id: string) => { setWorking(true); const res = await apiFetch(`/api/user/passkeys/${id}`, { method: "DELETE" }); setMessage(res.success ? "Passkey revoked." : res.error.message); if (res.success) await load(); setWorking(false); };
  return <section className="p-5 rounded-2xl border border-[#dddddd] bg-white space-y-4">
    <div><h2 className="text-base font-semibold text-[#111111]">Device passkeys</h2><p className="text-xs text-[#666666] mt-1">Add a passkey protected by your device: fingerprint, Face ID, Windows Hello, Android screen lock, or device PIN. BINZEO never receives your biometric data.</p></div>
    {platformAvailable === false && <div className="rounded-xl border border-[#dddddd] bg-[#f7f7f7] px-3 py-2 text-xs text-[#555555]">We could not confirm platform-authenticator availability in this browser. You can still try setup; your device will show its native fingerprint, Face ID, or PIN prompt if supported.</div>}
    <div className="flex gap-2"><input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} className="flex-1 rounded-lg border border-[#dddddd] bg-[#f3f3f3] px-3 py-2 text-sm" placeholder="Device name" /><button onClick={register} disabled={working} className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{working ? "Waiting for device..." : "Add device passkey"}</button></div>
    {message && <div className="text-xs text-[#6666666]">{message}</div>}
    <div className="space-y-2">{passkeys.map((p) => <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#eeeeee] p-3"><div><div className="text-xs font-medium text-[#111111]">{p.device_name ?? "Passkey"}</div><div className="text-[11px] text-[#888888]">{p.authenticator_type}{p.is_backed_up ? " · backed up" : ""}</div></div><button onClick={() => revoke(p.id)} disabled={working} className="text-xs text-[#333333]">Revoke</button></div>)}</div>
  </section>;
}
