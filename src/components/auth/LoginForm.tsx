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
type Stage =
  | "logo"
  | "welcome"
  | "methods"
  | "email"
  | "token"
  | "passkey"
  | "qr"
  | "success";

/* ================================================================== */
/*  Field class                                                        */
/* ================================================================== */
const fieldClass =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10 focus:ring-2 focus:ring-white/10";

/* ================================================================== */
/*  Icons                                                              */
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
/*  Brand logo                                                         */
/* ================================================================== */
function BrandLogo({ big = false }: { big?: boolean }) {
  return (
    <Image
      src="/logo.svg"
      alt="BINZEO"
      width={big ? 200 : 132}
      height={big ? 48 : 31}
      priority
      className={`mx-auto w-auto invert transition-all duration-700 ${
        big ? "h-12 sm:h-14" : "h-8"
      }`}
    />
  );
}

/* ================================================================== */
/*  Method definitions                                                 */
/* ================================================================== */
const METHODS = [
  {
    key: "email" as Stage,
    icon: <IconMail />,
    label: "Continue with Email",
    sub: "Email and password",
  },
  {
    key: "token" as Stage,
    icon: <IconKey />,
    label: "Temporary Token",
    sub: "One-time access code",
  },
  {
    key: "passkey" as Stage,
    icon: <IconFingerprint />,
    label: "Continue with Passkey",
    sub: "Biometric or security key",
  },
  {
    key: "qr" as Stage,
    icon: <IconQR />,
    label: "Scan QR Code",
    sub: "Use your camera",
  },
];

/* ================================================================== */
/*  Main                                                               */
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

  /* ------------------------------------------------------------- */
  /*  Auto transitions                                             */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    if (stage === "logo") {
      const t = setTimeout(() => setStage("welcome"), 2100);
      return () => clearTimeout(t);
    }
    if (stage === "welcome") {
      const t = setTimeout(() => setStage("methods"), 2000);
      return () => clearTimeout(t);
    }
  }, [stage]);

  /* ------------------------------------------------------------- */
  /*  Success                                                       */
  /* ------------------------------------------------------------- */
  const handleSuccess = useCallback(() => {
    setStage("success");
    setTimeout(() => {
      router.push(next);
      router.refresh();
    }, 1800);
  }, [next, router]);

  /* ------------------------------------------------------------- */
  /*  Email login                                                   */
  /* ------------------------------------------------------------- */
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
      setError(
        err instanceof Error
          ? err.message
          : "Precise location permission is required"
      );
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------- */
  /*  Temporary token                                               */
  /* ------------------------------------------------------------- */
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

  /* ------------------------------------------------------------- */
  /*  QR scanner                                                    */
  /* ------------------------------------------------------------- */
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

  /* ------------------------------------------------------------- */
  /*  Passkey                                                       */
  /* ------------------------------------------------------------- */
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
      handleSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Passkey login was cancelled"
      );
    } finally {
      setPasskeyLoading(false);
    }
  };

  /* ------------------------------------------------------------- */
  /*  Navigation helpers                                            */
  /* ------------------------------------------------------------- */
  const selectMethod = (m: Stage) => {
    setError("");
    setStage(m);
  };

  const goBack = () => {
    setError("");
    setStage("methods");
  };

  /* ================================================================== */
  /*  RENDER                                                            */
  /* ================================================================== */
  return (
    <div className="relative w-full min-h-[100dvh] overflow-x-hidden">
      {/* ============ Keyframes ============ */}
      <style jsx global>{`
        /* ---- Logo splash ---- */
        @keyframes bn-logo-in {
          0% {
            opacity: 0;
            transform: scale(0.78) rotate(-3deg);
            filter: blur(14px);
          }
          40% {
            opacity: 0.6;
            filter: blur(4px);
          }
          70% {
            opacity: 1;
            transform: scale(1.04) rotate(0.5deg);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: blur(0);
          }
        }
        @keyframes bn-logo-out {
          0% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.15);
            filter: blur(10px);
          }
        }
        @keyframes bn-halo-breathe {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.75;
            transform: scale(1.18);
          }
        }
        @keyframes bn-halo-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bn-orbit {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(14px, -12px); opacity: 0.95; }
        }

        /* ---- Text reveals ---- */
        @keyframes bn-word-in {
          from {
            opacity: 0;
            transform: translateY(28px);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes bn-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bn-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bn-underline {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ---- Card / view transitions ---- */
        @keyframes bn-slide-in-right {
          from {
            opacity: 0;
            transform: translateX(40px) scale(0.98);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes bn-card-in {
          0% {
            opacity: 0;
            transform: translateY(32px) scale(0.94);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* ---- Method buttons ---- */
        @keyframes bn-method-in {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ---- Success ---- */
        @keyframes bn-pop {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bn-ring {
          0% { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes bn-ring-2 {
          0% { transform: scale(0.85); opacity: 0.5; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes bn-dot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-6px); opacity: 1; }
        }

        .bn-ease {
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {/* ============ Fixed background ============ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/img3.jpg')",
          backgroundColor: "#000",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.38) 100%)",
        }}
      />

      {/* ============================================================ */}
      {/*  STAGE 1 · LOGO — cinematic splash                            */}
      {/* ============================================================ */}
      {stage === "logo" && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center overflow-hidden">
          {/* Ambient orbiting glows */}
          <div
            className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 68%)",
              animation: "bn-halo-breathe 3.4s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[680px] h-[680px] rounded-full pointer-events-none opacity-25"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.35) 30%, transparent 60%)",
              animation:
                "bn-halo-rotate 9s linear infinite, bn-halo-breathe 5s ease-in-out infinite",
              filter: "blur(40px)",
            }}
          />
          {/* Small orbiting dots */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
              style={{
                left: `${45 + i * 6}%`,
                top: `${44 + i * 4}%`,
                animation: `bn-orbit ${3 + i * 0.6}s ease-in-out ${
                  i * 0.3
                }s infinite`,
              }}
            />
          ))}

          <div
            className="relative"
            style={{
              animation:
                "bn-logo-in 1.6s cubic-bezier(0.22, 1, 0.36, 1) both, bn-logo-out 0.6s cubic-bezier(0.55, 0, 1, 0.45) 1.55s both",
            }}
          >
            <BrandLogo big />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  STAGE 2 · WELCOME — refined typography reveal                */}
      {/* ============================================================ */}
      {stage === "welcome" && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6">
          <div className="text-center max-w-[560px]">
            {/* Small logo mark */}
            <div
              style={{
                animation:
                  "bn-fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
              }}
            >
              <BrandLogo />
            </div>

            {/* Welcome word-by-word */}
            <h1 className="mt-10 text-[42px] sm:text-[54px] font-semibold tracking-[-0.045em] leading-[1.02] text-white">
              {["Welcome", "back"].map((word, i) => (
                <span
                  key={word}
                  className="inline-block"
                  style={{
                    animation: `bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                      0.25 + i * 0.16
                    }s both`,
                  }}
                >
                  {word}
                  {i === 0 && "\u00A0"}
                </span>
              ))}
            </h1>

            {/* Underline accent */}
            <div
              className="mx-auto mt-6 h-[2px] w-16 bg-white/60 rounded-full origin-center"
              style={{
                animation:
                  "bn-underline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both",
              }}
            />

            {/* Subtitle */}
            <p
              className="mt-8 text-[16px] sm:text-[17px] text-white/75 leading-relaxed"
              style={{
                animation:
                  "bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both",
              }}
            >
              Let&apos;s get you into your BINZEO account.
            </p>

            {/* Security note */}
            <p
              className="mt-7 text-[12px] text-white/45 leading-relaxed max-w-[380px] mx-auto"
              style={{
                animation:
                  "bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.15s both",
              }}
            >
              For account security, your browser will ask permission to share
              your precise location during sign-in.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  STAGE 3-7 · METHODS + FORMS                                 */}
      {/* ============================================================ */}
      {(stage === "methods" ||
        stage === "email" ||
        stage === "token" ||
        stage === "passkey" ||
        stage === "qr") && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:py-12">
          <div
            className="w-full max-w-[460px] rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.15)] px-6 py-8 sm:px-8 sm:py-9 text-white"
            style={{
              animation:
                "bn-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            {/* ============================================================ */}
            {/*  METHODS VIEW — ONLY options, no logo/title                    */}
            {/* ============================================================ */}
            {stage === "methods" && (
              <div>
                {/* Method buttons — staggered */}
                <div className="grid gap-2.5">
                  {METHODS.map((m, i) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => selectMethod(m.key)}
                      className="group flex items-center gap-4 w-full rounded-2xl border border-white/12 bg-white/[0.05] backdrop-blur-xl px-4 py-4 text-left transition-all duration-500 hover:bg-white/[0.12] hover:border-white/25 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.5)]"
                      style={{
                        animation: `bn-method-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.08 + i * 0.08
                        }s both`,
                      }}
                    >
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/90 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-500">
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
                        className="w-4 h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all duration-500"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Social separator */}
                <div
                  className="my-6 flex items-center gap-3 text-[10.5px] text-white/40 uppercase tracking-[0.12em]"
                  style={{
                    animation: `bn-fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both`,
                  }}
                >
                  <span className="h-px flex-1 bg-white/12" />
                  <span>or continue with</span>
                  <span className="h-px flex-1 bg-white/12" />
                </div>

                {/* Social buttons */}
                <div
                  className="grid grid-cols-2 gap-3"
                  style={{
                    animation: `bn-method-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setError("Apple sign-in is not available yet.")
                    }
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl py-3 text-sm font-medium text-white transition-all duration-500 hover:bg-white/12 hover:border-white/25 hover:-translate-y-0.5"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Apple
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setError("Phone sign-in is not available yet.")
                    }
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl py-3 text-sm font-medium text-white transition-all duration-500 hover:bg-white/12 hover:border-white/25 hover:-translate-y-0.5"
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
                  <div
                    className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200"
                    style={{
                      animation:
                        "bn-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Signup link */}
                <p
                  className="mt-7 text-center text-[13px] text-white/60"
                  style={{
                    animation: `bn-fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both`,
                  }}
                >
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
            {/*  EMAIL VIEW                                                   */}
            {/* ============================================================ */}
            {stage === "email" && (
              <div
                style={{
                  animation:
                    "bn-slide-in-right 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Back"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-5"
                >
                  <IconArrowLeft />
                  <span className="text-[12px]">Back</span>
                </button>

                <h2 className="text-[24px] font-semibold tracking-[-0.03em]">
                  Sign in with email
                </h2>
                <p className="mt-1.5 text-[13px] text-white/55">
                  Enter your credentials to continue.
                </p>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-white/60 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="pt-1 text-center">
                    <Link
                      href="/forgot-password"
                      className="text-[13px] text-white/60 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              </div>
            )}

            {/* ============================================================ */}
            {/*  TOKEN VIEW                                                   */}
            {/* ============================================================ */}
            {stage === "token" && (
              <div
                style={{
                  animation:
                    "bn-slide-in-right 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Back"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-5"
                >
                  <IconArrowLeft />
                  <span className="text-[12px]">Back</span>
                </button>

                <h2 className="text-[24px] font-semibold tracking-[-0.03em]">
                  Temporary token
                </h2>
                <p className="mt-1.5 text-[13px] text-white/55">
                  Use a one-time token from Account → Security.
                </p>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleTemporaryLogin}
                  className="mt-6 space-y-3"
                >
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
                    className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {tokenLoading ? "Signing in..." : "Sign in with token"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStage("qr");
                    }}
                    className="w-full rounded-full border border-white/15 bg-transparent py-2.5 text-[12px] text-white/70 transition-all duration-300 hover:bg-white/5 hover:border-white/25"
                  >
                    Or scan QR code instead
                  </button>
                </form>
              </div>
            )}

            {/* ============================================================ */}
            {/*  PASSKEY VIEW                                                 */}
            {/* ============================================================ */}
            {stage === "passkey" && (
              <div
                style={{
                  animation:
                    "bn-slide-in-right 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Back"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-5"
                >
                  <IconArrowLeft />
                  <span className="text-[12px]">Back</span>
                </button>

                <div className="text-center">
                  <div
                    className="mx-auto w-20 h-20 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center text-white/90"
                    style={{
                      animation:
                        "bn-halo-breathe 3.5s ease-in-out infinite",
                    }}
                  >
                    <div className="scale-150">
                      <IconFingerprint />
                    </div>
                  </div>

                  <h2 className="mt-6 text-[24px] font-semibold tracking-[-0.03em]">
                    Sign in with Passkey
                  </h2>
                  <p className="mt-2 text-[13px] text-white/55 max-w-xs mx-auto leading-relaxed">
                    Use your fingerprint, face, or security key to sign in
                    securely.
                  </p>

                  {error && (
                    <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200 text-left">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePasskeyLogin}
                    disabled={passkeyLoading}
                    className="mt-7 w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {passkeyLoading ? "Checking passkey..." : "Continue"}
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/*  QR VIEW                                                      */}
            {/* ============================================================ */}
            {stage === "qr" && (
              <div
                style={{
                  animation:
                    "bn-slide-in-right 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Back"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-5"
                >
                  <IconArrowLeft />
                  <span className="text-[12px]">Back</span>
                </button>

                <h2 className="text-[24px] font-semibold tracking-[-0.03em]">
                  Scan QR token
                </h2>
                <p className="mt-1.5 text-[13px] text-white/55">
                  Point your camera at the QR code on your other device.
                </p>

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 backdrop-blur-xl px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="mt-6">
                  {!scanningQr ? (
                    <button
                      type="button"
                      onClick={scanQrToken}
                      disabled={tokenLoading}
                      className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
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
                        className="w-full rounded-full border border-white/15 bg-transparent py-2.5 text-[12px] text-white/60 hover:text-white transition-colors"
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
      {/*  STAGE · SUCCESS                                              */}
      {/* ============================================================ */}
      {stage === "success" && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6">
          <div className="text-center max-w-md">
            {/* Multi-ring pulse */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border border-white/40"
                style={{
                  animation:
                    "bn-ring 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite",
                }}
              />
              <div
                className="absolute inset-0 rounded-full border border-white/30"
                style={{
                  animation:
                    "bn-ring-2 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s infinite",
                }}
              />
              <div
                className="w-20 h-20 rounded-full bg-white/10 border border-white/25 backdrop-blur-xl flex items-center justify-center text-white"
                style={{
                  animation:
                    "bn-pop 0.75s cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                <IconCheck />
              </div>
            </div>

            <h1
              className="mt-8 text-[32px] sm:text-[38px] font-semibold tracking-[-0.035em] text-white"
              style={{
                animation:
                  "bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both",
              }}
            >
              Welcome to BINZEO
            </h1>
            <p
              className="mt-3 text-[14.5px] text-white/70"
              style={{
                animation:
                  "bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both",
              }}
            >
              You&apos;re signed in. Taking you in…
            </p>

            {/* Loading dots */}
            <div
              className="mt-8 flex items-center justify-center gap-1.5"
              style={{
                animation:
                  "bn-fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/70"
                  style={{
                    animation: `bn-dot 1.4s ease-in-out ${
                      i * 0.15
                    }s infinite`,
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
