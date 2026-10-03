"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getClientDeviceId, requestPreciseLocation } from "@/lib/client-device";
import { startAuthentication } from "@simplewebauthn/browser";

/* ------------------------------------------------------------------ */
/* Liquid Glass field                                                  */
/* ------------------------------------------------------------------ */
const fieldClass =
  "w-full rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl px-4 py-3.5 text-sm text-white placeholder-white/60 outline-none transition-all duration-300 focus:border-white/60 focus:bg-white/15 focus:ring-4 focus:ring-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_1px_2px_rgba(0,0,0,0.10)]";

/* ------------------------------------------------------------------ */
/* Brand logo                                                          */
/* ------------------------------------------------------------------ */
function BrandLogo() {
  return (
    <div className="flex justify-center">
      <div className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl px-5 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_8px_24px_-8px_rgba(0,0,0,0.35)]">
        <Image
          src="/logo.svg"
          alt="BINZEO"
          width={132}
          height={31}
          priority
          className="h-7 w-auto invert"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Social actions                                                      */
/* ------------------------------------------------------------------ */
function SocialActions({
  onMessage,
}: {
  onMessage: (message: string) => void;
}) {
  const base =
    "flex w-full items-center justify-center gap-2.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-xl py-3.5 text-sm font-medium text-white transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.15)] hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0";

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onMessage("Apple sign-in is not available yet.")}
        className={base}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        Sign in with Apple
      </button>

      <button
        type="button"
        onClick={() => onMessage("Phone sign-in is not available yet.")}
        className={base}
      >
        <Image
          src="/icons/phone.svg"
          alt=""
          width={16}
          height={16}
          className="invert"
        />
        Sign in with phone
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Glass Card Wrapper                                                  */
/* ------------------------------------------------------------------ */
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/25 bg-white/[0.08] backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(0,0,0,0.10),0_1px_2px_rgba(0,0,0,0.10),0_24px_64px_-24px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Inner highlight streak */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {children}
    </div>
  );
}

/* ================================================================== */
/* Main Login Form                                                     */
/* ================================================================== */
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
  const [scanningQr, setScanningQr] = useState(false);
  const qrScannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

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
      setError(
        err instanceof Error
          ? err.message
          : "Precise location permission is required"
      );
      setLoading(false);
    }
  };

  const exchangeTemporaryToken = useCallback(
    async (token: string) => {
      setTokenLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/temporary-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-binzeo-device-id": getClientDeviceId(),
          },
          body: JSON.stringify({ token: token.trim() }),
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
    },
    [next, router]
  );

  useEffect(() => {
    const hashToken = new URLSearchParams(
      window.location.hash.replace(/^#/, "")
    ).get("temporary_token");
    if (!hashToken) return;
    window.history.replaceState(null, document.title, "/signin");
    void exchangeTemporaryToken(hashToken);
  }, [exchangeTemporaryToken]);

  const handleTemporaryLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await exchangeTemporaryToken(temporaryToken);
  };

  const scanQrToken = async () => {
    setError("");
    setScanningQr(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("binzeo-qr-reader");
      qrScannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          const token = decodedText.startsWith("BINZEO_TEMP_TOKEN:")
            ? decodedText.slice("BINZEO_TEMP_TOKEN:".length)
            : decodedText;
          await scanner.stop().catch(() => undefined);
          scanner.clear();
          qrScannerRef.current = null;
          setScanningQr(false);
          setTemporaryToken(token);
          await exchangeTemporaryToken(token);
        },
        () => undefined
      );
    } catch (err) {
      setScanningQr(false);
      setError(
        err instanceof Error ? err.message : "Camera access was unavailable"
      );
    }
  };

  const stopQrScan = async () => {
    await qrScannerRef.current?.stop().catch(() => undefined);
    qrScannerRef.current?.clear();
    qrScannerRef.current = null;
    setScanningQr(false);
  };

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true);
    setError("");
    try {
      const optionsRes = await fetch("/api/auth/passkey/options", {
        method: "POST",
      });
      const optionsData = await optionsRes.json();
      if (!optionsData.success)
        throw new Error(optionsData.error?.message ?? "Passkey login failed");
      const response = await startAuthentication({
        optionsJSON: optionsData.data.options,
      });
      const verifyRes = await fetch("/api/auth/passkey/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-binzeo-device-id": getClientDeviceId(),
        },
        body: JSON.stringify({
          challenge_id: optionsData.data.challenge_id,
          challenge: optionsData.data.challenge,
          response,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success)
        throw new Error(verifyData.error?.message ?? "Passkey login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Passkey login was cancelled");
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* ============================================================ */}
      {/*  Full-screen background image                                */}
      {/* ============================================================ */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/img3.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          onLoad={() => setImageLoaded(true)}
          className={`object-cover transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            imageLoaded
              ? "scale-100 opacity-100 blur-0"
              : "scale-110 opacity-0 blur-2xl"
          }`}
        />
        {/* Dark gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      {/* ============================================================ */}
      {/*  Content                                                      */}
      {/* ============================================================ */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
        <div
          className={`w-full max-w-[440px] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            imageLoaded
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <GlassCard className="p-6 sm:p-8">
            {/* Brand */}
            <BrandLogo />

            {/* Header */}
            <div className="mt-8 text-center">
              <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Let&apos;s get you into your BINZEO ID
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-white/50">
                For account security, your browser will ask permission to
                share your precise location during sign-in.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-500/15 backdrop-blur-xl px-4 py-3 text-sm text-red-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
                {error}
              </div>
            )}

            {/* Primary form */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Your Email"
                aria-label="Email"
                className={fieldClass}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Your Password"
                  aria-label="Password"
                  className={`${fieldClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/60 transition-colors hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="pt-1 text-center">
                <Link
                  href="/forgot-password"
                  className="text-[13px] text-white/60 transition-colors hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 w-full overflow-hidden rounded-full bg-white py-3.5 text-sm font-semibold text-[#0a0a0a] shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.15),0_12px_32px_-12px_rgba(255,255,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.15),0_20px_44px_-14px_rgba(255,255,255,0.65)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? "Signing in..." : "Sign in"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100 group-hover:animate-[sheen_1s_ease-out]" />
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.1em] text-white/50">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span>or</span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </div>

            {/* Temporary token block */}
            <form
              onSubmit={handleTemporaryLogin}
              className="space-y-3 rounded-2xl border border-white/20 bg-white/[0.05] backdrop-blur-xl p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)]"
            >
              <div>
                <div className="text-[13px] font-semibold text-white">
                  Temporary full-account login
                </div>
                <div className="mt-1 text-[12px] leading-relaxed text-white/60">
                  Use a one-time token created from Account → Security.
                </div>
              </div>

              <input
                type="password"
                value={temporaryToken}
                onChange={(e) => setTemporaryToken(e.target.value)}
                required
                autoComplete="one-time-code"
                placeholder="Paste temporary token"
                aria-label="Temporary login token"
                className={fieldClass}
              />

              <button
                type="submit"
                disabled={tokenLoading}
                className="w-full rounded-full border border-white/30 bg-white/[0.06] backdrop-blur-xl py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/15 hover:border-white/50 hover:-translate-y-0.5 disabled:opacity-60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]"
              >
                {tokenLoading ? "Signing in..." : "Sign in with temporary token"}
              </button>

              {!scanningQr ? (
                <button
                  type="button"
                  onClick={scanQrToken}
                  disabled={tokenLoading}
                  className="w-full rounded-full border border-white/15 bg-white/[0.03] py-2.5 text-xs text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white disabled:opacity-60"
                >
                  Scan QR token with camera
                </button>
              ) : (
                <>
                  <div
                    id="binzeo-qr-reader"
                    className="overflow-hidden rounded-2xl border border-white/25 bg-black/40 backdrop-blur-xl"
                  />
                  <button
                    type="button"
                    onClick={stopQrScan}
                    className="w-full rounded-full border border-white/20 bg-white/[0.05] py-2.5 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Stop camera
                  </button>
                </>
              )}
            </form>

            {/* Passkey */}
            <button
              type="button"
              onClick={handlePasskeyLogin}
              disabled={passkeyLoading}
              className="mt-3 w-full rounded-full border border-white/30 bg-white/[0.06] backdrop-blur-xl py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/15 hover:border-white/50 hover:-translate-y-0.5 disabled:opacity-60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] inline-flex items-center justify-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" />
              </svg>
              {passkeyLoading ? "Checking passkey..." : "Sign in with passkey"}
            </button>

            {/* Social */}
            <div className="mt-3">
              <SocialActions onMessage={setError} />
            </div>

            {/* Footer */}
            <p className="mt-7 text-center text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-white transition-colors hover:text-white/80"
              >
                Create one
              </Link>
            </p>
          </GlassCard>

          {/* Small footnote below card */}
          <p className="mt-6 text-center text-[11px] text-white/40">
            © {new Date().getFullYear()} BINZEO Labs
          </p>
        </div>
      </div>

      {/* Sheen keyframe for CTA button */}
      <style>{`
        @keyframes sheen {
          0%   { transform: translateX(0%)   skewX(-12deg); }
          100% { transform: translateX(500%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
}
