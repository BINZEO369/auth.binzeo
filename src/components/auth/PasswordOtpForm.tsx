"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { apiFetch } from "@/lib/api/client";

const inputClass = "w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-[#111] placeholder-black/35 outline-none focus:border-black/35 focus:bg-white";

type Props = { mode: "reset" | "change" };

type Step = "request" | "verify" | "success";

export default function PasswordOtpForm({ mode }: Props) {
  const isReset = mode === "reset";
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusDigit = (index: number) => inputRefs.current[index]?.focus();

  const updateDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      const pasted = clean.slice(0, 6 - index).split("");
      setDigits((current) => {
        const next = [...current];
        pasted.forEach((digit, offset) => { next[index + offset] = digit; });
        return next;
      });
      focusDigit(Math.min(index + pasted.length, 5));
      return;
    }
    setDigits((current) => current.map((digit, item) => item === index ? clean : digit));
    if (clean && index < 5) focusDigit(index + 1);
  };

  const requestCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const endpoint = isReset ? "/api/auth/password-reset/request" : "/api/user/password-change/request";
    const response = await apiFetch<{ challenge_id?: string; message: string }>(
      endpoint,
      { method: "POST", body: JSON.stringify(isReset ? { email } : {}) },
    );
    if (response.success && response.data.challenge_id) {
      setChallengeId(response.data.challenge_id);
      setDigits(["", "", "", "", "", ""]);
      setStep("verify");
      setMessage({ type: "success", text: response.data.message });
      setTimeout(() => focusDigit(0), 100);
    } else if (response.success) {
      setMessage({ type: "success", text: response.data.message });
    } else {
      setMessage({ type: "error", text: response.error.message });
    }
    setLoading(false);
  };

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!challengeId) return;
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    setMessage(null);
    const response = await apiFetch<{ verified: boolean; reason: string }>(
      "/api/auth/password-reset/verify",
      {
        method: "POST",
        body: JSON.stringify({
          challenge_id: challengeId,
          code: digits.join(""),
          new_password: newPassword,
          confirm_password: confirmPassword,
          purpose: mode,
        }),
      },
    );
    if (response.success && response.data.verified) {
      setStep("success");
      setMessage({ type: "success", text: "Password changed successfully. A security notification was sent to your email." });
    } else {
      setMessage({ type: "error", text: response.success ? `Verification failed: ${response.data.reason}` : response.error.message });
      setDigits(["", "", "", "", "", ""]);
      focusDigit(0);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-[100dvh] bg-[#f3f3f3] px-4 py-12 text-[#111] sm:py-20">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <Link href={isReset ? "/signin" : "/dashboard/security"} className="text-sm text-[#666] hover:text-[#111]">← Back</Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[#777]">BINZEO account security</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{isReset ? "Reset your password" : "Change your password"}</h1>
          <p className="mt-2 text-sm leading-6 text-[#666]">{isReset ? "Request a one-time code, then choose a new password." : "We will verify your email before changing your password."}</p>
        </div>

        {message && <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${message.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>{message.text}</div>}

        {step === "request" && (
          <form onSubmit={requestCode} className="space-y-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            {isReset && <label className="block"><span className="mb-2 block text-sm font-medium">Account email</span><input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>}
            <button disabled={loading} className="w-full rounded-full bg-[#111] py-3.5 text-sm font-semibold text-white transition hover:bg-[#333] disabled:opacity-60">{loading ? "Sending code…" : "Send verification code"}</button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={submitPassword} className="space-y-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div><p className="text-sm font-medium">Enter your 6-digit code</p><p className="mt-1 text-xs text-[#777]">The code expires in 10 minutes and can be used once.</p></div>
            <div className="flex justify-between gap-2">
              {digits.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} className="h-12 w-11 rounded-xl border border-black/10 bg-black/[0.03] text-center text-lg font-bold outline-none focus:border-black/40 focus:bg-white" inputMode="numeric" maxLength={6} value={digit} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digits[index] && index > 0) focusDigit(index - 1); }} aria-label={`Code digit ${index + 1}`} />)}
            </div>
            <label className="block"><span className="mb-2 block text-sm font-medium">New password</span><input className={inputClass} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} maxLength={72} autoComplete="new-password" required /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Confirm new password</span><input className={inputClass} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} maxLength={72} autoComplete="new-password" required /></label>
            <button disabled={loading || digits.some((digit) => !digit)} className="w-full rounded-full bg-[#111] py-3.5 text-sm font-semibold text-white transition hover:bg-[#333] disabled:opacity-60">{loading ? "Updating password…" : "Update password"}</button>
          </form>
        )}

        {step === "success" && <div className="rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">✓</div><h2 className="mt-5 text-xl font-semibold">Password updated</h2><p className="mt-2 text-sm leading-6 text-[#666]">Your password has been changed and the security notification email has been sent.</p><Link href={isReset ? "/signin" : "/dashboard/security"} className="mt-6 inline-block rounded-full bg-[#111] px-5 py-3 text-sm font-semibold text-white">{isReset ? "Return to sign in" : "Return to security"}</Link></div>}
      </div>
    </main>
  );
}
