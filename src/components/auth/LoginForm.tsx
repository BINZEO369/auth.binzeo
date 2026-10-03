"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getClientDeviceId, requestPreciseLocation } from "@/lib/client-device";
import { startAuthentication } from "@simplewebauthn/browser";

/* ================================================================== */
/*  Field — Liquid glass input                                        */
/* ================================================================== */
const fieldClass =
  "w-full rounded-2xl border border-white/25 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/50 outline-none backdrop-blur-xl transition-all duration-300 focus:border-white/60 focus:bg-white/15 focus:ring-4 focus:ring-white/10";

/* ================================================================== */
/*  Brand logo — glass chip                                           */
/* ================================================================== */
function BrandLogo() {
  return (
    <div className="flex justify-center">
      <div className="glass-chip px-5 py-2.5">
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

/* ================================================================== */
/*  Social actions                                                    */
/* ================================================================== */
function SocialActions({
  onMessage,
}: {
  onMessage: (message: string) => void;
}) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => onMessage("Apple sign-in is not available yet.")}
        className="glass-button w-full"
      >
        <span className="font-semibold text-base leading-none"></span>
        <span>Sign in with Apple</span>
      </button>
      <button
        type="button"
        onClick={() => onMessage("Phone sign-in is not available yet.")}
        className="glass-button w-full"
      >
        <Image
          src="/icons/phone.svg"
          alt=""
          width={16}
          height={16}
          className="invert"
        />
        <span>Sign in with phone</span>
      </button>
    </div>
  );
}

/* ================================================================== */
/*  Main                                                              */
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
  const qrScannerRef = useRef<{
    stop: () => Promise<void>;
    clear: () => void;
  } | null>(null);
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
      setError(
        err instanceof Error ? err.message : "Passkey login was cancelled"
      );
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <>
      {/* ============== Global liquid glass styles ============== */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes lg-fade-up {
              from { opacity: 0; transform: translateY(24px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes lg-fade-in {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes lg-pulse-soft {
              0%,100% { opacity: 1; }
              50%     { opacity: 0.45; }
            }

            /* Frosted glass card */
            .lg-glass {
              background: rgba(255,255,255,0.06);
              backdrop-filter: blur(28px) saturate(180%);
              -webkit-backdrop-filter: blur(28px) saturate(180%);
              border: 1px solid rgba(255,255,255,0.14);
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,0.20),
                inset 0 -1px 0 0 rgba(0,0,0,0.10),
                0 1px 2px rgba(0,0,0,0.20),
                0 24px 56px -20px rgba(0,0,0,0.55);
            }

            /* Small chip (logo container) */
            .glass-chip {
              background: rgba(255,255,255,0.10);
              backdrop-filter: blur(20px) saturate(180%);
              -webkit-backdrop-filter: blur(20px) saturate(180%);
              border: 1px solid rgba(255,255,255,0.18);
              border-radius: 999px;
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,0.25),
                0 4px 14px -6px rgba(0,0,0,0.35);
            }

            /* Glass button (secondary) */
            .glass-button {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px 20px;
              border-radius: 999px;
              background: rgba(255,255,255,0.08);
              backdrop-filter: blur(20px) saturate(180%);
              -webkit-backdrop-filter: blur(20px) saturate(180%);
              border: 1px solid rgba(255,255,255,0.16);
              color: #ffffff;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,0.20),
                0 4px 14px -6px rgba(0,0,0,0.30);
              cursor: pointer;
            }
            .glass-button:hover:not(:disabled) {
              background: rgba(255,255,255,0.14);
              transform: translateY(-1px);
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,0.28),
                0 8px 24px -8px rgba(0,0,0,0.45);
            }
            .glass-button:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            /* Primary white button */
            .glass-primary {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              width: 100%;
              padding: 14px 24px;
              border-radius: 999px;
              background: #ffffff;
              color: #0a0a0a;
              font-size: 14px;
              font-weight: 600;
              border: 1px solid rgba(255,255,255,0.9);
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,1),
                0 1px 2px rgba(0,0,0,0.15),
                0 10px 26px -8px rgba(0,0,0,0.40);
              transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
              cursor: pointer;
            }
            .glass-primary:hover:not(:disabled) {
              background: #f5f5f5;
              transform: translateY(-1px);
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,1),
                0 2px 4px rgba(0,0,0,0.15),
                0 16px 34px -10px rgba(0,0,0,0.50);
            }
            .glass-primary:active:not(:disabled) {
              transform: translateY(0);
              box-shadow:
                inset 0 2px 6px rgba(0,0,0,0.15),
                0 1px 2px rgba(0,0,0,0.15);
            }
            .glass-primary:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }

            /* Divider line */
            .glass-divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.20), transparent);
            }

            .lg-anim-in  { animation: lg-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
            .lg-anim-out { animation: lg-fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
            .lg-pulse    { animation: lg-pulse-soft 2.4s ease-in-out infinite; }
          `,
        }}
      />

      {/* ============== Full-screen background + centered card ============== */}
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/img4.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark veil — ensures text contrast */}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        {/* Content wrapper */}
        <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:py-14">
          {/* Liquid glass card */}
          <div
            className="lg-glass lg-anim-in w-full max-w-[420px] rounded-[32px] p-6 sm:p-8"
            style={{ animationDelay: "0.05s" }}
          >
            <BrandLogo />

            {/* Heading */}
            <div className="mt-8 text-center">
              <h1
                className="lg-anim-out text-[28px] font-semibold tracking-tight text-white"
                style={{ animationDelay: "0.15s" }}
              >
                Welcome back
              </h1>
              <p
                className="lg-anim-out mt-2 text-sm text-white/70"
                style={{ animationDelay: "0.22s" }}
              >
                Let&apos;s get you into your BINZEO ID
              </p>
              <p
                className="lg-anim-out mt-2 text-[11px] leading-relaxed text-white/50"
                style={{ animationDelay: "0.28s" }}
              >
                For account security, your browser will ask permission to share
                your precise location during sign-in.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="lg-anim-out mt-6 flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100 backdrop-blur-xl">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 h-4 w-4 shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Primary form */}
            <form
              onSubmit={handleSubmit}
              className="lg-anim-out mt-6 space-y-3"
              style={{ animationDelay: "0.32s" }}
            >
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="pt-1 text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glass-primary mt-2"
              >
                {loading ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      className="h-4 w-4"
                      style={{ animation: "lg-pulse-soft 1.2s linear infinite" }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            <div
              className="lg-anim-out my-6 flex items-center gap-3 text-xs text-white/50"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="glass-divider flex-1" />
              <span>or</span>
              <div className="glass-divider flex-1" />
            </div>

            {/* Temporary token form */}
            <form
              onSubmit={handleTemporaryLogin}
              className="lg-anim-out space-y-3 rounded-2xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl"
              style={{ animationDelay: "0.44s" }}
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
                className="glass-button w-full"
              >
                {tokenLoading ? "Signing in..." : "Sign in with temporary token"}
              </button>

              {!scanningQr ? (
                <button
                  type="button"
                  onClick={scanQrToken}
                  disabled={tokenLoading}
                  className="glass-button w-full text-xs"
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
                    className="glass-button w-full text-xs"
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
              className="glass-button lg-anim-out mt-3 w-full"
              style={{ animationDelay: "0.5s" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                <path d="M6 15h12v7H6z" />
                <circle cx="12" cy="18.5" r="1.2" />
              </svg>
              {passkeyLoading ? "Checking passkey..." : "Sign in with passkey"}
            </button>

            {/* Social */}
            <div
              className="lg-anim-out mt-3"
              style={{ animationDelay: "0.54s" }}
            >
              <SocialActions onMessage={setError} />
            </div>

            {/* Footer */}
            <p
              className="lg-anim-out mt-7 text-center text-sm text-white/70"
              style={{ animationDelay: "0.6s" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
