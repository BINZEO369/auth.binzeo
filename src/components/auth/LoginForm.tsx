"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getClientDeviceId, requestPreciseLocation } from "@/lib/client-device";
import { startAuthentication } from "@simplewebauthn/browser";

type Step = "splash" | "welcome" | "choose" | "email" | "token" | "passkey" | "success";
type Method = "email" | "token" | "passkey" | "apple";

const fieldClass =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/10";

/* ------------------------------------------------------------------ */
/*  SVG icons (inline, monochrome)                                     */
/* ------------------------------------------------------------------ */
function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function IconKey() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="8" cy="15" r="4" />
      <path d="m10.85 12.15 8.4-8.4M18 5l2 2M15 8l2 2" />
    </svg>
  );
}
function IconPasskey() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" />
      <path d="M9 12h.01M12 12h.01M15 12h.01" />
    </svg>
  );
}
function IconApple() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.32-.06-.02-.1-.04-.26-.04-.44 0-1.11.5-2.22 1.19-3.02C13.79.74 15.05.09 16.16.03c.05.14.08.28.08.44a.36.36 0 0 1-.01.06c.06.32.13.62.13.9zM12.6 8.35c1.13 0 2.66-.98 3.63-.98 1.51 0 2.32.7 3.07 1.6-.06.06-1.86 1.08-1.86 3.34 0 2.62 2.3 3.54 2.34 3.55-.02.06-.36 1.24-1.19 2.44-.72 1.04-1.47 2.09-2.63 2.09-1.13 0-1.45-.65-2.72-.65-1.25 0-1.68.67-2.75.67-1.11 0-1.87-1-2.72-2.15-1.02-1.42-1.85-3.65-1.85-5.75 0-3.4 2.2-5.16 4.38-5.16 1.15 0 2.11.75 2.83.75.68 0 1.77-.76 3.07-.76z" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [step, setStep] = useState<Step>("splash");
  const [lastMethod, setLastMethod] = useState<Method | null>(null);
  const [error, setError] = useState("");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [temporaryToken, setTemporaryToken] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [scanningQr, setScanningQr] = useState(false);
  const qrScannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);

  /* ---------- Splash timing ---------- */
  useEffect(() => {
    if (step !== "splash") return;
    const t = setTimeout(() => setStep("welcome"), 2400);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== "welcome") return;
    const t = setTimeout(() => setStep("choose"), 2600);
    return () => clearTimeout(t);
  }, [step]);

  /* ---------- Email login ---------- */
  const handleEmailSubmit = async (e: React.FormEvent) => {
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
      setStep("success");
      setTimeout(() => {
        router.push(next);
        router.refresh();
      }, 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Precise location permission is required");
      setLoading(false);
    }
  };

  /* ---------- Temporary token ---------- */
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
        setStep("success");
        setTimeout(() => {
          router.push(next);
          router.refresh();
        }, 1600);
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

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await exchangeTemporaryToken(temporaryToken);
  };

  /* ---------- QR ---------- */
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

  /* ---------- Passkey ---------- */
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
      setStep("success");
      setTimeout(() => {
        router.push(next);
        router.refresh();
      }, 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Passkey login was cancelled");
      setPasskeyLoading(false);
    }
  };

  /* ---------- Method selection ---------- */
  const chooseMethod = (method: Method) => {
    setError("");
    setLastMethod(method);
    if (method === "passkey") {
      void handlePasskeyLogin();
      return;
    }
    if (method === "apple") {
      setError("Apple sign-in is not available yet.");
      return;
    }
    setStep(method);
  };

  const goBack = () => {
    setError("");
    void stopQrScan();
    setStep("choose");
  };

  /* ================================================================== */
  /*  RENDER                                                             */
  /* ================================================================== */
  return (
    <div className="relative w-full min-h-[100dvh] overflow-x-hidden">
      {/* ---------- Fixed background ---------- */}
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
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.68) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.32) 100%)",
        }}
      />

      {/* ---------- Global keyframes ---------- */}
      <style jsx global>{`
        @keyframes cine-fade-up {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cine-scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cine-logo {
          0%   { opacity: 0; transform: scale(0.6) rotate(-8deg); filter: blur(12px); }
          40%  { opacity: 1; transform: scale(1.05) rotate(0deg); filter: blur(0); }
          60%  { transform: scale(1); }
          85%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.15); filter: blur(6px); }
        }
        @keyframes cine-ring {
          0%   { transform: scale(0.4); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes cine-text-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cine-card-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(-12px) scale(0.98); }
        }
        @keyframes cine-check {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cine-ring-expand {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .cine-fade-up   { animation: cine-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .cine-scale-in  { animation: cine-scale-in 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .cine-delay-1   { animation-delay: 0.08s; }
        .cine-delay-2   { animation-delay: 0.16s; }
        .cine-delay-3   { animation-delay: 0.24s; }
        .cine-delay-4   { animation-delay: 0.32s; }
      `}</style>

      {/* ================================================================ */}
      {/*  MAIN CONTAINER                                                    */}
      {/* ================================================================ */}
      <div className="relative z-10 flex w-full min-h-[100dvh] items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[520px]">

          {/* ============================================================== */}
          {/*  STEP 1 — SPLASH                                                */}
          {/* ============================================================== */}
          {step === "splash" && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border border-white/30"
                  style={{ animation: "cine-ring 2s ease-out infinite" }} />
                <div className="absolute inset-0 rounded-full border border-white/20"
                  style={{ animation: "cine-ring 2s ease-out 0.5s infinite" }} />
                <div style={{ animation: "cine-logo 2.4s cubic-bezier(0.22,1,0.36,1) both" }}>
                  <Image
                    src="/logo.svg"
                    alt="BINZEO"
                    width={160}
                    height={38}
                    priority
                    className="h-10 w-auto invert"
                  />
                </div>
              </div>
              <div
                className="mt-10 text-white/50 text-xs tracking-[0.35em] uppercase"
                style={{ animation: "cine-text-in 1.4s 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
              >
                Secure Identity
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/*  STEP 2 — WELCOME                                              */}
          {/* ============================================================== */}
          {step === "welcome" && (
            <div className="text-center py-16">
              <div style={{ animation: "cine-fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both" }}>
                <Image
                  src="/logo.svg"
                  alt="BINZEO"
                  width={132}
                  height={31}
                  priority
                  className="mx-auto h-8 w-auto invert"
                />
              </div>
              <h1
                className="mt-10 text-[44px] sm:text-[56px] font-semibold tracking-[-0.04em] leading-[1.02] text-white"
                style={{ animation: "cine-text-in 1s 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
              >
                Welcome back
              </h1>
              <p
                className="mt-4 text-[16px] text-white/65 max-w-md mx-auto leading-relaxed"
                style={{ animation: "cine-text-in 1s 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
              >
                Let&apos;s get you into your BINZEO account.
              </p>
              <p
                className="mt-3 text-[12px] text-white/40 max-w-sm mx-auto leading-relaxed"
                style={{ animation: "cine-text-in 1s 1.1s cubic-bezier(0.22,1,0.36,1) both" }}
              >
                For account security, your browser will ask permission to share your precise location during sign-in.
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/*  STEP 3 — CHOOSE METHOD                                        */}
          {/* ============================================================== */}
          {step === "choose" && (
            <div
              className="rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.14)] px-7 py-9 sm:px-10 sm:py-11 text-white"
              style={{ animation: "cine-fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <div className="text-center">
                <Image
                  src="/logo.svg"
                  alt="BINZEO"
                  width={132}
                  height={31}
                  className="mx-auto h-7 w-auto invert"
                />
                <h1 className="mt-7 text-[28px] font-semibold tracking-[-0.03em] leading-tight text-white">
                  Sign in to your account
                </h1>
                <p className="mt-2 text-[14px] text-white/60">
                  Choose how you&apos;d like to continue
                </p>
              </div>

              {error && (
                <div
                  className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200"
                  style={{ animation: "cine-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  {error}
                </div>
              )}

              <div className="mt-7 space-y-3">
                {/* Email option */}
                <button
                  type="button"
                  onClick={() => chooseMethod("email")}
                  className="group w-full flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-5 py-4 text-left transition-all duration-300 hover:bg-white/[0.09] hover:border-white/25 hover:translate-x-0.5"
                  style={{ animation: "cine-fade-up 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/85 group-hover:bg-white/15 transition-colors">
                    <IconEmail />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium text-white">Continue with Email</span>
                    <span className="block text-[12px] text-white/50 mt-0.5">Email and password</span>
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                {/* Token option */}
                <button
                  type="button"
                  onClick={() => chooseMethod("token")}
                  className="group w-full flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-5 py-4 text-left transition-all duration-300 hover:bg-white/[0.09] hover:border-white/25 hover:translate-x-0.5"
                  style={{ animation: "cine-fade-up 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/85 group-hover:bg-white/15 transition-colors">
                    <IconKey />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium text-white">Temporary token</span>
                    <span className="block text-[12px] text-white/50 mt-0.5">One-time access code or QR</span>
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                {/* Passkey option */}
                <button
                  type="button"
                  onClick={() => chooseMethod("passkey")}
                  disabled={passkeyLoading}
                  className="group w-full flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-5 py-4 text-left transition-all duration-300 hover:bg-white/[0.09] hover:border-white/25 hover:translate-x-0.5 disabled:opacity-60"
                  style={{ animation: "cine-fade-up 0.6s 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/85 group-hover:bg-white/15 transition-colors">
                    <IconPasskey />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium text-white">
                      {passkeyLoading ? "Checking passkey..." : "Continue with Passkey"}
                    </span>
                    <span className="block text-[12px] text-white/50 mt-0.5">Biometric or security key</span>
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                {/* Apple option */}
                <button
                  type="button"
                  onClick={() => chooseMethod("apple")}
                  className="group w-full flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-5 py-4 text-left transition-all duration-300 hover:bg-white/[0.09] hover:border-white/25 hover:translate-x-0.5"
                  style={{ animation: "cine-fade-up 0.6s 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  <span className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white/85 group-hover:bg-white/15 transition-colors">
                    <IconApple />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium text-white">Continue with Apple</span>
                    <span className="block text-[12px] text-white/50 mt-0.5">Coming soon</span>
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>

              <p className="mt-7 text-center text-sm text-white/60">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-white hover:text-white/80 transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          )}

          {/* ============================================================== */}
          {/*  STEP 4a — EMAIL                                               */}
          {/* ============================================================== */}
          {step === "email" && (
            <div
              className="rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.14)] px-7 py-8 sm:px-10 sm:py-10 text-white"
              style={{ animation: "cine-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-xs text-white/55 hover:text-white transition-colors"
              >
                <IconArrowLeft />
                Back
              </button>

              <div className="mt-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white/90 mb-5">
                  <IconEmail />
                </div>
                <h2 className="text-[26px] font-semibold tracking-[-0.025em] leading-tight text-white">
                  Sign in with email
                </h2>
                <p className="mt-2 text-[14px] text-white/60">
                  Enter your credentials to continue
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="mt-7 space-y-3.5">
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

                <div className="pt-1 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-full bg-white py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/*  STEP 4b — TOKEN                                               */}
          {/* ============================================================== */}
          {step === "token" && (
            <div
              className="rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.14)] px-7 py-8 sm:px-10 sm:py-10 text-white"
              style={{ animation: "cine-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-xs text-white/55 hover:text-white transition-colors"
              >
                <IconArrowLeft />
                Back
              </button>

              <div className="mt-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white/90 mb-5">
                  <IconKey />
                </div>
                <h2 className="text-[26px] font-semibold tracking-[-0.025em] leading-tight text-white">
                  Temporary token
                </h2>
                <p className="mt-2 text-[14px] text-white/60">
                  Paste a one-time token or scan the QR code
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleTokenSubmit} className="mt-7 space-y-3.5">
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
                  className="w-full rounded-full bg-white py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {tokenLoading ? "Signing in..." : "Sign in with token"}
                </button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs text-white/40">
                <span className="h-px flex-1 bg-white/15" />
                <span>or</span>
                <span className="h-px flex-1 bg-white/15" />
              </div>

              {!scanningQr ? (
                <button
                  type="button"
                  onClick={scanQrToken}
                  disabled={tokenLoading}
                  className="w-full rounded-full border border-white/25 bg-white/5 backdrop-blur-xl py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/35 disabled:opacity-60"
                >
                  Scan QR code with camera
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
                    className="mt-3 w-full rounded-full border border-white/15 bg-transparent py-2.5 text-xs text-white/60 hover:text-white transition-colors"
                  >
                    Stop camera
                  </button>
                </>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/*  STEP 4c — PASSKEY (loading)                                   */}
          {/* ============================================================== */}
          {step === "passkey" && (
            <div
              className="rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.14)] px-7 py-12 sm:px-10 text-white text-center"
              style={{ animation: "cine-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white/90">
                <IconPasskey />
              </div>
              <h2 className="mt-6 text-[24px] font-semibold tracking-[-0.025em] text-white">
                Checking your passkey
              </h2>
              <p className="mt-2 text-[14px] text-white/60">
                Follow your device&apos;s prompt to continue
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs text-white/50">
                <span className="w-3 h-3 rounded-full border-2 border-white/50 border-t-transparent animate-spin" />
                Waiting for authentication...
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/*  STEP 5 — SUCCESS                                              */}
          {/* ============================================================== */}
          {step === "success" && (
            <div
              className="rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.14)] px-7 py-14 sm:px-10 text-white text-center"
              style={{ animation: "cine-scale-in 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <div className="relative w-20 h-20 mx-auto">
                <span
                  className="absolute inset-0 rounded-full bg-green-400/25"
                  style={{ animation: "cine-ring-expand 1.4s ease-out infinite" }}
                />
                <span
                  className="absolute inset-0 rounded-full bg-green-400/25"
                  style={{ animation: "cine-ring-expand 1.4s 0.4s ease-out infinite" }}
                />
                <span
                  className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400/30 to-emerald-500/20 border border-green-400/40 flex items-center justify-center text-green-200"
                  style={{ animation: "cine-check 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  <IconCheck />
                </span>
              </div>
              <h2 className="mt-8 text-[28px] font-semibold tracking-[-0.025em] text-white">
                Welcome to Binzeo
              </h2>
              <p className="mt-2 text-[14px] text-white/60">
                Signed in successfully. Taking you to your account...
              </p>
              <div className="mt-8 flex justify-center">
                <div className="h-1 w-32 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-white/70 rounded-full"
                    style={{
                      animation: "cine-progress 1.5s cubic-bezier(0.4, 0, 0.2, 1) both",
                    }}
                  />
                </div>
              </div>
              <style jsx>{`
                @keyframes cine-progress {
                  from { width: 0%; }
                  to   { width: 100%; }
                }
              `}</style>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
