"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getClientDeviceId, requestPreciseLocation } from "@/lib/client-device";
import { startAuthentication } from "@simplewebauthn/browser";

const fieldClass =
  "w-full rounded-2xl border border-[#4a4d51] bg-transparent px-4 py-3.5 text-sm text-white placeholder-[#8f949b] outline-none transition-colors focus:border-white focus:ring-1 focus:ring-white/30";

function BrandLogo() {
  return (
    <Image src="/logo.svg" alt="BINZEO" width={132} height={31} priority className="mx-auto h-8 w-auto invert" />
  );
}

function SocialActions({ onMessage }: { onMessage: (message: string) => void }) {
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => onMessage("Apple sign-in is not available yet.")} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#15171a] py-3 text-sm font-medium text-white transition hover:bg-[#202327]"><span className="font-semibold">A</span> Sign in with Apple</button>
      <button type="button" onClick={() => onMessage("Phone sign-in is not available yet.")} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#15171a] py-3 text-sm font-medium text-white transition hover:bg-[#202327]"><Image src="/icons/phone.svg" alt="" width={16} height={16} className="invert" /> Sign in with phone</button>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [temporaryToken, setTemporaryToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const preciseLocation = await requestPreciseLocation();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-binzeo-device-id": getClientDeviceId(),
        },
        body: JSON.stringify({ email, password, location: preciseLocation }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Login failed");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Precise location permission is required");
      setLoading(false);
    }
  };

  const handleTemporaryLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokenLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/temporary-login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-binzeo-device-id": getClientDeviceId() },
        body: JSON.stringify({ token: temporaryToken.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Temporary login failed");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Temporary login failed. Please try again.");
    } finally {
      setTokenLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true);
    setError("");
    try {
      const optionsRes = await fetch("/api/auth/passkey/options", { method: "POST" });
      const optionsData = await optionsRes.json();
      if (!optionsData.success) throw new Error(optionsData.error?.message ?? "Passkey login failed");
      const response = await startAuthentication({ optionsJSON: optionsData.data.options });
      const verifyRes = await fetch("/api/auth/passkey/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-binzeo-device-id": getClientDeviceId() },
        body: JSON.stringify({ challenge_id: optionsData.data.challenge_id, challenge: optionsData.data.challenge, response }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) throw new Error(verifyData.error?.message ?? "Passkey login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Passkey login was cancelled");
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[420px] bg-[#050607] px-1 py-4 text-white sm:px-4 sm:py-8">
      <BrandLogo />
      <div className="mt-9 text-center">
        <h1 className="text-[28px] font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-[#a6abb2]">Let&apos;s get you into your BINZEO ID</p>
        <p className="mt-2 text-xs text-[#7f8790]">For account security, your browser will ask permission to share your precise location during sign-in.</p>
      </div>

      {error && <div className="mt-6 rounded-2xl border border-[#9d514f] bg-[#2a1516] px-4 py-3 text-sm text-[#ffb8b4]">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-7 space-y-3">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="Your Email" aria-label="Email" className={fieldClass} />
        <div className="relative">
          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Your Password" aria-label="Password" className={`${fieldClass} pr-16`} />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#a6abb2] hover:text-white">{showPassword ? "Hide" : "Show"}</button>
        </div>
        <div className="pt-2 text-center"><Link href="/forgot-password" className="text-sm text-[#a6abb2] transition hover:text-white">Forgot password?</Link></div>
        <button type="submit" disabled={loading} className="mt-3 w-full rounded-full bg-white py-3.5 text-sm font-semibold text-[#050607] transition hover:bg-[#e3e6e8] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-[#8f949b]"><span className="h-px flex-1 bg-[#3d4145]" /><span>or</span><span className="h-px flex-1 bg-[#3d4145]" /></div>
      <form onSubmit={handleTemporaryLogin} className="space-y-3 rounded-2xl border border-[#2d3135] bg-[#0b0d0f] p-4">
        <div>
          <div className="text-sm font-medium text-white">Temporary full-account login</div>
          <div className="mt-1 text-xs text-[#8f949b]">Use a one-time token created from Account → Security.</div>
        </div>
        <input type="password" value={temporaryToken} onChange={(e) => setTemporaryToken(e.target.value)} required autoComplete="one-time-code" placeholder="Paste temporary token" aria-label="Temporary login token" className={fieldClass} />
        <button type="submit" disabled={tokenLoading} className="w-full rounded-full border border-[#5c6269] py-3 text-sm font-semibold text-white transition hover:bg-[#15171a] disabled:opacity-60">{tokenLoading ? "Signing in..." : "Sign in with temporary token"}</button>
      </form>
      <button type="button" onClick={handlePasskeyLogin} disabled={passkeyLoading} className="mt-3 w-full rounded-full border border-[#5c6269] py-3 text-sm font-semibold text-white transition hover:bg-[#15171a] disabled:opacity-60">{passkeyLoading ? "Checking passkey..." : "Sign in with passkey"}</button>
      <SocialActions onMessage={setError} />
      <p className="mt-7 text-center text-sm text-[#a6abb2]">Don&apos;t have an account? <Link href="/register" className="font-medium text-white hover:text-[#c9e8f1]">Create one</Link></p>
    </div>
  );
}
