"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getClientDeviceId, requestPreciseLocation } from "@/lib/client-device";
import { startAuthentication } from "@simplewebauthn/browser";

/* ------------------------------------------------------------------ */
/*  Glass field style                                                  */
/* ------------------------------------------------------------------ */
const fieldClass =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/10";

function BrandLogo() {
  return (
    <Image
      src="/logo.svg"
      alt="BINZEO"
      width={132}
      height={31}
      priority
      className="mx-auto h-8 w-auto invert"
    />
  );
}

function SocialActions({ onMessage }: { onMessage: (message: string) => void }) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onMessage("Apple sign-in is not available yet.")}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/25"
      >
        <span className="font-semibold">A</span> Sign in with Apple
      </button>
      <button
        type="button"
        onClick={() => onMessage("Phone sign-in is not available yet.")}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/25"
      >
        <Image src="/icons/phone.svg" alt="" width={16} height={16} className="invert" />
        Sign in with phone
      </button>
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
  const [scanningQr, setScanningQr] = useState(false);
  const qrScannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
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
    const hashToken = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("temporary_token");
    if (!hashToken) return;
    window.history.replaceState(null, document.title, "/signin");
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setError(err instanceof Error ? err.message : "Camera access was unavailable");
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
      const optionsRes = await fetch("/api/auth/passkey/options", { method: "POST" });
      const optionsData = await optionsRes.json();
      if (!optionsData.success) throw new Error(optionsData.error?.message ?? "Passkey login failed");
      const response = await startAuthentication({ optionsJSON: optionsData.data.options });
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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ============================================================ */}
      {/*  FULL SCREEN BACKGROUND IMAGE                                 */}
      {/* ============================================================ */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/img3.jpg"
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* ============================================================ */}
      {/*  CONTENT                                                     */}
      {/* ============================================================ */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-[440px] rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.14)] px-6 py-8 sm:px-9 sm:py-10 text-white"
          style={{
            animation: "auth-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          {/* ---------- Keyframes ---------- */}
          <style jsx>{`
            @keyframes auth-fade-up {
              from {
                opacity: 0;
                transform: translateY(24px) scale(0.98);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>

          {/* ---------- Brand ---------- */}
          <BrandLogo />

          {/* ---------- Heading ---------- */}
          <div className="mt-8 text-center">
            <h1 className="text-[30px] font-semibold tracking-[-0.03em] leading-tight text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-[14px] text-white/70">
              Let&apos;s get you into your BINZEO ID
            </p>
            <p className="mt-3 text-[11px] text-white/45 leading-relaxed">
              For account security, your browser will ask permission to share
              your precise location during sign-in.
            </p>
          </div>

          {/* ---------- Error ---------- */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* ---------- Main Form ---------- */}
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.35)] hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* ---------- Divider ---------- */}
          <div className="my-6 flex items-center gap-3 text-xs text-white/50">
            <span className="h-px flex-1 bg-white/15" />
            <span>or</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          {/* ---------- Temporary Token Login ---------- */}
          <form
            onSubmit={handleTemporaryLogin}
            className="space-y-3 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl p-4"
          >
            <div>
              <div className="text-sm font-medium text-white">
                Temporary full-account login
              </div>
              <div className="mt-1 text-xs text-white/55">
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
              className="w-full rounded-full border border-white/25 bg-white/5 backdrop-blur-xl py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/35 disabled:opacity-60"
            >
              {tokenLoading ? "Signing in..." : "Sign in with temporary token"}
            </button>

            {!scanningQr ? (
              <button
                type="button"
                onClick={scanQrToken}
                disabled={tokenLoading}
                className="w-full rounded-full border border-white/15 bg-transparent py-2.5 text-xs text-white/80 transition-all duration-300 hover:bg-white/5 hover:border-white/25 disabled:opacity-60"
              >
                Scan QR token with camera
              </button>
            ) : (
              <>
                <div
                  id="binzeo-qr-reader"
                  className="overflow-hidden rounded-xl border border-white/15"
                />
                <button
                  type="button"
                  onClick={stopQrScan}
                  className="w-full rounded-full border border-white/15 bg-transparent py-2.5 text-xs text-white/60 hover:text-white transition-colors"
                >
                  Stop camera
                </button>
              </>
            )}
          </form>

          {/* ---------- Passkey ---------- */}
          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading}
            className="mt-3 w-full rounded-full border border-white/25 bg-white/5 backdrop-blur-xl py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/35 disabled:opacity-60"
          >
            {passkeyLoading ? "Checking passkey..." : "Sign in with passkey"}
          </button>

          {/* ---------- Social Actions ---------- */}
          <div className="mt-3">
            <SocialActions onMessage={setError} />
          </div>

          {/* ---------- Footer ---------- */}
          <p className="mt-7 text-center text-sm text-white/70">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-white hover:text-white/80 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
