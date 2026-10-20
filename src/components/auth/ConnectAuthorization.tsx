"use client";

import { useState } from "react";

const JABIYEN_LOGO = "https://jabiyen-website.vercel.app/logo.png";

export default function ConnectAuthorization({
  clientId,
  redirectUri,
  state,
  codeChallenge,
}: {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connect = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/oauth/authorize", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, redirect_uri: redirectUri, state, code_challenge: codeChallenge }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result?.success !== true || typeof result?.redirect_url !== "string") {
        throw new Error(result?.error?.message || "This connection could not be completed. Please try again.");
      }
      window.location.assign(result.redirect_url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "This connection could not be completed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-5 py-12 text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />
      <section className="relative w-full max-w-[440px] rounded-[32px] border border-white/10 bg-white/[0.055] p-7 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-9">
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white p-2 shadow-lg shadow-black/20">
            <img src={JABIYEN_LOGO} alt="JABIYEN" className="h-full w-full object-contain" />
          </div>
          <div className="flex items-center gap-1.5 text-white/35" aria-hidden="true">
            <span className="h-px w-8 bg-white/25" />
            <span className="h-2 w-2 rounded-full border border-white/50" />
            <span className="h-px w-8 bg-white/25" />
          </div>
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-black p-2 shadow-lg shadow-black/30">
            <img src="/logo.svg" alt="BINZEO" className="h-full w-full object-contain invert" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Secure connection</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Connect JABIYEN</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/60">
            Use your active BINZEO account to continue to JABIYEN. No password, email code, or QR scan is needed because you are already signed in.
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center text-xs text-white/55">
          Your verified BINZEO identity will be used to open your JABIYEN account.
        </div>

        {error && <p role="alert" className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-center text-sm text-red-100">{error}</p>}

        <button type="button" onClick={() => void connect()} disabled={loading} className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60">
          {loading ? "Connecting…" : "Connect and continue"}
        </button>
        <p className="mt-5 text-center text-[11px] leading-5 text-white/35">You can disconnect access later from your BINZEO security settings.</p>
      </section>
    </main>
  );
}
