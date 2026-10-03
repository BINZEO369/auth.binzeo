"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getClientDeviceId, requestPreciseLocation } from "@/lib/client-device";
import { startAuthentication } from "@simplewebauthn/browser";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */
type Stage = "logo" | "welcome" | "methods" | "email" | "token" | "passkey" | "qr" | "success";

/* ================================================================== */
/*  Field class                                                        */
/* ================================================================== */
const fieldClass =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/10";

/* ================================================================== */
/*  Small icon components                                              */
/* ================================================================== */
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconKey() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="8" cy="15" r="4" />
      <path d="m10.85 12.15 8-8" />
      <path d="M18 5 21 8" />
      <path d="M15 8 18 11" />
    </svg>
  );
}

function IconFingerprint() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 16h.01" />
      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
    </svg>
  );
}

function IconQR() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h3v3h-3z" />
      <path d="M21 14v3" />
      <path d="M14 21h3" />
      <path d="M21 21h-3" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ================================================================== */
/*  Brand logo — bigger on splash                                      */
/* ================================================================== */
function BrandLogo({ big = false }: { big?: boolean }) {
  return (
    <Image
      src="/logo.svg"
      alt="BINZEO"
      width={big ? 180 : 132}
      height={big ? 42 : 31}
      priority
      className={`mx-auto w-auto invert transition-all duration-700 ${
        big ? "h-11 sm:h-12" : "h-8"
      }`}
    />
  );
}

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [stage, setStage] = useState<Stage>("logo");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [temporaryToken, setTemporaryToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);

  const [passkeyLoading, setPasskeyLoading] = useState(false);

  const [scanningQr, setScanningQr] = useState(false);
  const qrScannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);

  const [error, setError] = useState("");

  /* ------------------------------------------------------------------ */
  /*  Cinematic auto-transitions                                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (stage === "logo") {
      const t = setTimeout(() => setStage("welcome"), 1800);
      return () => clearTimeout(t);
    }
    if (stage === "welcome") {
      const t = setTimeout(() => setStage("methods"), 1700);
      return () => clearTimeout(t);
    }
  }, [stage]);

  /* ------------------------------------------------------------------ */
  /*  Success handler — shows animation then redirects                  */
  /* ------------------------------------------------------------------ */
  const handleSuccess = useCallback(() => {
    setStage("success");
    setTimeout(() => {
      router.push(next);
      router.refresh();
    }, 1600);
  }, [next, router]);

  /* ------------------------------------------------------------------ */
  /*  Email/password login                                              */
  /* ------------------------------------------------------------------ */
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
      handleSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Precise location permission is required");
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Temporary token login                                             */
  /* ------------------------------------------------------------------ */
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
          setTokenLoading(false);
          return;
        }
        handleSuccess();
      } catch {
        setError("Temporary login failed. Please try again.");
      } finally {
        setTokenLoading(false);
      }
    },
    [handleSuccess]
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

  /* ------------------------------------------------------------------ */
  /*  QR scanner                                                        */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*  Passkey login                                                     */
  /* ------------------------------------------------------------------ */
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
      handleSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Passkey login was cancelled");
    } finally {
      setPasskeyLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Method selection helper                                           */
  /* ------------------------------------------------------------------ */
  const selectMethod = (m: Stage) => {
    setError("");
    setStage(m);
  };

  const goBack = () => {
    setError("");
    setStage("methods");
  };

  /* ================================================================== */
  /*  RENDER                                                             */
  /* ================================================================== */
  return (
    <div className="relative w-full min-h-[100dvh] overflow-x-hidden">
      {/* ------------ Keyframes ------------ */}
      <style jsx global>{`
        @keyframes bn-splash-in {
          0%   { opacity: 0; transform: scale(0.86); filter: blur(8px); }
          60%  { opacity: 1; transform: scale(1.02); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes bn-splash-glow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(1.15); }
        }
        @keyframes bn-splash-exit {
          0%   { opacity: 1; transform: scale(1); filter: blur(0); }
          100% { opacity: 0; transform: scale(1.08); filter: blur(6px); }
        }
        @keyframes bn-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bn-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bn-slide-in {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bn-slide-out {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-28px); }
        }
        @keyframes bn-pop {
          0%   { opacity: 0; transform: scale(0.6); }
          60%  { opacity: 1; transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bn-ring {
          0%   { transform: scale(0.9); opacity: 0.65; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes bn-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes bn-spin {
          to { transform: rotate(360deg); }
        }
        .bn-ease { animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      {/* ------------ Fixed background ------------ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/images/img3.jpg')", backgroundColor: "#000" }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.40) 40%, rgba(0,0,0,0.72) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* ============================================================ */}
      {/*  STAGE: LOGO — full-screen cinematic                          */}
      {/* ============================================================ */}
      {stage === "logo" && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Glow ring */}
            <div
              className="absolute w-72 h-72 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.28) 0%, transparent 65%)",
                animation: "bn-splash-glow 2.2s ease-in-out infinite",
              }}
            />
            <div
              className="relative"
              style={{
                animation:
                  "bn-splash-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
              }}
            >
              <BrandLogo big />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  STAGE: WELCOME — hero text                                   */}
      {/* ============================================================ */}
      {stage === "welcome" && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <div
              className="text-white"
              style={{
                animation:
                  "bn-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) both",
              }}
            >
              <BrandLogo />
            </div>
            <h1
              className="mt-10 text-[40px] sm:text-[48px] font-semibold tracking-[-0.04em] leading-[1.05] text-white"
              style={{
                animation:
                  "bn-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
              }}
            >
              Welcome back
            </h1>
            <p
              className="mt-4 text-[16px] text-white/75"
              style={{
                animation:
                  "bn-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.30s both",
              }}
            >
              Let&apos;s get you into your BINZEO account.
            </p>
            <p
              className="mt-6 text-[12px] text-white/45 leading-relaxed max-w-sm mx-auto"
              style={{
                animation:
                  "bn-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
              }}
            >
              For account security, your browser will ask permission to share
              your precise location during sign-in.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  STAGE: METHODS / EMAIL / TOKEN / PASSKEY / QR                */}
      {/* ============================================================ */}
      {(stage === "methods" ||
        stage === "email" ||
        stage === "token" ||
        stage === "passkey" ||
        stage === "qr") && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:py-12">
          <div
            className="w-full max-w-[520px] rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.14)] px-7 py-9 sm:px-10 sm:py-11 text-white"
            style={{
              animation:
                "bn-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            {/* ---------- Header ---------- */}
            <div className="flex items-center justify-between mb-8">
              {stage === "methods" ? (
                <div className="w-full text-center">
                  <BrandLogo />
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center gap-1.5 px-3 py-2 -ml-3 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    <IconArrowLeft />
                    <span className="text-sm">Back</span>
                  </button>
                  <div className="text-[13px] text-white/50">
                    {stage === "email" && "Email sign in"}
                    {stage === "token" && "Temporary token"}
                    {stage === "passkey" && "Passkey"}
                    {stage === "qr" && "QR token"}
                  </div>
                </>
              )}
            </div>

            {/* ============================================================ */}
            {/*  METHODS VIEW                                               */}
            {/* ============================================================ */}
            {stage === "methods" && (
              <div
                style={{
                  animation:
                    "bn-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <div className="text-center">
                  <h1 className="text-[30px] sm:text-[32px] font-semibold tracking-[-0.035em] leading-tight">
                    Welcome back
                  </h1>
                  <p className="mt-2.5 text-[14.5px] text-white/70">
                    Let&apos;s get you into your BINZEO account.
                  </p>
                  <p className="mt-3 text-[11px] text-white/40 leading-relaxed max-w-[340px] mx-auto">
                    Choose how you&apos;d like to sign in.
                  </p>
                </div>

                <div className="mt-8 grid gap-3">
                  {[
                    {
                      key: "email" as Stage,
                      icon: <IconMail />,
                      label: "Sign in with Email",
                      sub: "Use your email and password",
                    },
                    {
                      key: "token" as Stage,
                      icon: <IconKey />,
                      label: "Temporary token",
                      sub: "One-time full-account access",
                    },
                    {
                      key: "passkey" as Stage,
                      icon: <IconFingerprint />,
                      label: "Sign in with Passkey",
                      sub: "Biometric or security key",
                    },
                    {
                      key: "qr" as Stage,
                      icon: <IconQR />,
                      label: "Scan QR token",
                      sub: "Use your camera to scan",
                    },
                  ].map((m, i) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => selectMethod(m.key)}
                      className="group flex items-center gap-4 w-full rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-4 py-4 text-left transition-all duration-300 hover:bg-white/[0.10] hover:border-white/25 hover:-translate-y-0.5"
                      style={{
                        animation: `bn-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.15 + i * 0.08
                        }s both`,
                      }}
                    >
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/90 group-hover:bg-white/15 transition-all duration-300">
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] font-medium text-white">
                          {m.label}
                        </div>
                        <div className="text-[12px] text-white/50 mt-0.5">
                          {m.sub}
                        </div>
                      </div>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all duration-300"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Social separator */}
                <div className="my-7 flex items-center gap-3 text-[11px] text-white/40">
                  <span className="h-px flex-1 bg-white/12" />
                  <span>or continue with</span>
                  <span className="h-px flex-1 bg-white/12" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setError("Apple sign-in is not available yet.")
                    }
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/25"
                  >
                    <span className="font-semibold">A</span>
                    Apple
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setError("Phone sign-in is not available yet.")
                    }
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/25"
                  >
                    <Image
                      src="/icons/phone.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="invert"
                    />
                    Phone
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <p className="mt-8 text-center text-sm text-white/60">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-white hover:text-white/80 transition-colors"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            )}

            {/* ============================================================ */}
            {/*  EMAIL VIEW                                                 */}
            {/* ============================================================ */}
            {stage === "email" && (
              <div
                style={{
                  animation:
                    "bn-slide-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <div>
                  <h2 className="text-[26px] font-semibold tracking-[-0.03em]">
                    Sign in with email
                  </h2>
                  <p className="mt-2 text-[13.5px] text-white/60">
                    Enter your credentials to continue.
                  </p>
                </div>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
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
                    className="mt-3 w-full rounded-full bg-white py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              </div>
            )}

            {/* ============================================================ */}
            {/*  TOKEN VIEW                                                 */}
            {/* ============================================================ */}
            {stage === "token" && (
              <div
                style={{
                  animation:
                    "bn-slide-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <div>
                  <h2 className="text-[26px] font-semibold tracking-[-0.03em]">
                    Temporary token
                  </h2>
                  <p className="mt-2 text-[13.5px] text-white/60">
                    Use a one-time token created from Account → Security.
                  </p>
                </div>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleTemporaryLogin} className="mt-7 space-y-3.5">
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
                    className="w-full rounded-full bg-white py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {tokenLoading ? "Signing in..." : "Sign in with token"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStage("qr");
                    }}
                    className="w-full rounded-full border border-white/15 bg-transparent py-3 text-xs text-white/80 transition-all duration-300 hover:bg-white/5 hover:border-white/25"
                  >
                    Or scan QR code instead
                  </button>
                </form>
              </div>
            )}

            {/* ============================================================ */}
            {/*  PASSKEY VIEW                                               */}
            {/* ============================================================ */}
            {stage === "passkey" && (
              <div
                className="text-center"
                style={{
                  animation:
                    "bn-slide-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <div
                  className="mx-auto w-20 h-20 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center text-white/90"
                  style={{ animation: "bn-float 3.5s ease-in-out infinite" }}
                >
                  <IconFingerprint />
                </div>

                <h2 className="mt-6 text-[26px] font-semibold tracking-[-0.03em]">
                  Sign in with Passkey
                </h2>
                <p className="mt-2.5 text-[13.5px] text-white/60 max-w-sm mx-auto">
                  Use your fingerprint, face, or security key to sign in
                  securely without a password.
                </p>

                {error && (
                  <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200 text-left">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePasskeyLogin}
                  disabled={passkeyLoading}
                  className="mt-8 w-full rounded-full bg-white py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passkeyLoading ? "Checking passkey..." : "Continue"}
                </button>
              </div>
            )}

            {/* ============================================================ */}
            {/*  QR VIEW                                                    */}
            {/* ============================================================ */}
            {stage === "qr" && (
              <div
                style={{
                  animation:
                    "bn-slide-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <div>
                  <h2 className="text-[26px] font-semibold tracking-[-0.03em]">
                    Scan QR token
                  </h2>
                  <p className="mt-2 text-[13.5px] text-white/60">
                    Point your camera at the QR code on your other device.
                  </p>
                </div>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="mt-7">
                  {!scanningQr ? (
                    <button
                      type="button"
                      onClick={scanQrToken}
                      disabled={tokenLoading}
                      className="w-full rounded-full bg-white py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Open camera
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div
                        id="binzeo-qr-reader"
                        className="overflow-hidden rounded-2xl border border-white/15"
                      />
                      <button
                        type="button"
                        onClick={stopQrScan}
                        className="w-full rounded-full border border-white/15 bg-transparent py-2.5 text-xs text-white/60 hover:text-white transition-colors"
                      >
                        Stop camera
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  STAGE: SUCCESS                                              */}
      {/* ============================================================ */}
      {stage === "success" && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6">
          <div className="text-center max-w-md">
            {/* Success ring */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-white/40"
                style={{
                  animation:
                    "bn-ring 1.6s cubic-bezier(0.22, 1, 0.36, 1) infinite",
                }}
              />
              <div
                className="w-20 h-20 rounded-full bg-white/10 border border-white/25 backdrop-blur-xl flex items-center justify-center text-white"
                style={{
                  animation:
                    "bn-pop 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <IconCheck />
              </div>
            </div>

            <h1
              className="mt-8 text-[32px] sm:text-[38px] font-semibold tracking-[-0.035em] text-white"
              style={{
                animation:
                  "bn-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
              }}
            >
              Welcome to BINZEO
            </h1>
            <p
              className="mt-3 text-[15px] text-white/70"
              style={{
                animation:
                  "bn-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.30s both",
              }}
            >
              You&apos;re signed in. Taking you in…
            </p>

            {/* Loading dots */}
            <div
              className="mt-8 flex items-center justify-center gap-1.5"
              style={{
                animation:
                  "bn-fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/70"
                  style={{
                    animation: `bn-float 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
