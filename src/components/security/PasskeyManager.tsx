"use client";

import { useEffect, useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { apiFetch } from "@/lib/api/client";

type Passkey = {
  id: string;
  device_name: string | null;
  authenticator_type: string;
  is_backed_up: boolean;
  last_used_at: string | null;
  created_at: string;
};

export default function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [deviceName, setDeviceName] = useState("This device");
  const [working, setWorking] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    const res = await apiFetch<{ passkeys: Passkey[] }>("/api/user/passkeys");
    if (res.success) setPasskeys(res.data.passkeys);
    else setMessage({ type: "error", text: res.error.message });
  };

  useEffect(() => { void load(); }, []);

  const register = async () => {
    setWorking(true);
    setMessage(null);
    try {
      const optionsRes = await apiFetch<{ challenge_id: string; options: Parameters<typeof startRegistration>[0]["optionsJSON"] }>("/api/user/passkeys", { method: "POST", body: JSON.stringify({}) });
      if (!optionsRes.success) throw new Error(optionsRes.error.message);
      const response = await startRegistration({ optionsJSON: optionsRes.data.options });
      const verifyRes = await apiFetch("/api/user/passkeys/register", { method: "POST", body: JSON.stringify({ challenge_id: optionsRes.data.challenge_id, challenge: optionsRes.data.options.challenge, response, device_name: deviceName.trim() || "This device" }) });
      if (!verifyRes.success) throw new Error(verifyRes.error.message);
      setMessage({ type: "success", text: "Fingerprint passkey created successfully." });
      await load();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Passkey registration cancelled";
      if (errorMessage.includes("NotAllowedError")) setMessage({ type: "error", text: "Fingerprint was not accepted. Make sure a fingerprint is enrolled and approve the native prompt." });
      else if (errorMessage.includes("InvalidStateError")) setMessage({ type: "error", text: "A passkey already exists on this device." });
      else setMessage({ type: "error", text: errorMessage });
    } finally {
      setWorking(false);
    }
  };

  const deletePasskey = async (id: string) => {
    setDeletingId(id);
    setConfirmingId(null);
    setMessage(null);
    const res = await apiFetch<{ message: string }>(`/api/user/passkeys/${id}`, { method: "DELETE" });
    if (res.success) {
      setPasskeys((current) => current.filter((passkey) => passkey.id !== id));
      setMessage({ type: "success", text: "Passkey deleted permanently." });
    } else {
      setMessage({ type: "error", text: res.error.message });
    }
    setDeletingId(null);
  };

  return (
    <section className="space-y-4 rounded-2xl border border-[#dddddd] bg-white p-5">
      <div><h2 className="text-base font-semibold text-[#111111]">Fingerprint passkey</h2><p className="mt-1 text-xs text-[#666666]">Create a platform passkey using your enrolled fingerprint. BINZEO never receives your biometric data.</p></div>
      <div className="rounded-xl border border-[#eeeeee] bg-[#fafafa] px-3 py-2.5 text-xs text-[#555555]">
        <div className="font-medium text-[#222222]">Before you start</div>
        <ol className="mt-1 list-inside list-decimal space-y-0.5"><li>Enroll at least one fingerprint in your device settings.</li><li>Keep screen lock enabled and use HTTPS.</li><li>Approve the native prompt with your fingerprint.</li></ol>
        <div className="mt-1 text-[11px] text-[#777777]">Your operating system may request a PIN as an additional security step.</div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row"><input value={deviceName} onChange={(event) => setDeviceName(event.target.value)} className="flex-1 rounded-lg border border-[#dddddd] bg-[#f3f3f3] px-3 py-2 text-sm outline-none focus:border-[#999999]" placeholder="Device name" maxLength={100} /><button type="button" onClick={register} disabled={working || deletingId !== null} className="rounded-lg bg-[#111111] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60">{working ? "Waiting for fingerprint…" : "Add fingerprint passkey"}</button></div>
      {message && <div role="status" className={`rounded-lg px-3 py-2 text-xs ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{message.text}</div>}
      <div className="space-y-2">
        {passkeys.length === 0 ? <div className="rounded-lg border border-dashed border-[#dddddd] px-3 py-4 text-center text-xs text-[#777777]">No fingerprint passkeys are connected to this account.</div> : passkeys.map((passkey) => {
          const isConfirming = confirmingId === passkey.id;
          const isDeleting = deletingId === passkey.id;
          return <div key={passkey.id} className="flex flex-col gap-3 rounded-lg border border-[#eeeeee] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0"><div className="truncate text-xs font-medium text-[#111111]">{passkey.device_name || "Passkey"}</div><div className="mt-0.5 text-[11px] text-[#888888]">{passkey.authenticator_type}{passkey.is_backed_up ? " · backed up" : ""}</div></div>
            {isConfirming ? <div className="flex shrink-0 items-center gap-2"><span className="text-[11px] text-rose-700">Delete permanently?</span><button type="button" onClick={() => void deletePasskey(passkey.id)} disabled={isDeleting} className="rounded-md bg-rose-600 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-rose-700 disabled:opacity-60">{isDeleting ? "Deleting…" : "Yes, delete"}</button><button type="button" onClick={() => setConfirmingId(null)} disabled={isDeleting} className="rounded-md border border-[#dddddd] px-2.5 py-1.5 text-[11px] text-[#555555] hover:bg-[#f7f7f7] disabled:opacity-60">Cancel</button></div> : <button type="button" onClick={() => setConfirmingId(passkey.id)} disabled={working || deletingId !== null} className="shrink-0 rounded-md border border-rose-200 px-2.5 py-1.5 text-[11px] font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">Delete passkey</button>}
          </div>;
        })}
      </div>
    </section>
  );
}
