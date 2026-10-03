"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getClientDeviceId, requestPreciseLocation } from "@/lib/client-device";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */
type Stage =
  | "logo"
  | "welcome"
  | "methods"
  | "email"
  | "first_name"
  | "last_name"
  | "password"
  | "terms"
  | "location"
  | "success";

const STEP_ORDER: Stage[] = [
  "email",
  "first_name",
  "last_name",
  "password",
  "terms",
  "location",
];

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

function IconGoogle() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function IconApple() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
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

function IconLocation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
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
/*  Progress bar                                                       */
/* ================================================================== */
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10.5px] uppercase tracking-[0.12em] text-white/50">
          Step {current} of {total}
        </span>
        <span className="text-[10.5px] uppercase tracking-[0.12em] text-white/50">
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-white/80 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Methods                                                            */
/* ================================================================== */
const METHODS = [
  {
    key: "email" as Stage,
    icon: <IconMail />,
    label: "Continue with Email",
    sub: "Create your ID with email",
    available: true,
  },
  {
    key: "methods" as Stage,
    icon: <IconGoogle />,
    label: "Continue with Google",
    sub: "Coming soon",
    available: false,
  },
  {
    key: "methods" as Stage,
    icon: <IconApple />,
    label: "Continue with Apple",
    sub: "Coming soon",
    available: false,
  },
  {
    key: "methods" as Stage,
    icon: <IconPhone />,
    label: "Continue with Phone",
    sub: "Coming soon",
    available: false,
  },
];

/* ================================================================== */
/*  Card wrapper — handles fade in/out crossfade                       */
/* ================================================================== */
function StepCard({
  children,
  fadeState,
  cardKey,
}: {
  children: React.ReactNode;
  fadeState: "idle" | "in" | "out";
  cardKey: string;
}) {
  return (
    <div
      key={cardKey}
      style={{
        animation:
          fadeState === "in"
            ? "bn-card-fade-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) both"
            : fadeState === "out"
            ? "bn-card-fade-out 0.4s cubic-bezier(0.55, 0, 1, 0.45) both"
            : undefined,
      }}
    >
      {children}
    </div>
  );
}

/* ================================================================== */
/*  Main                                                               */
/* ================================================================== */
export default function RegisterForm() {
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("logo");
  const [logoExiting, setLogoExiting] = useState(false);
  const [welcomeExiting, setWelcomeExiting] = useState(false);
  const [cardFade, setCardFade] = useState<"idle" | "in" | "out">("idle");

  /* Form state */
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [allowLocation, setAllowLocation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ------------------------------------------------------------- */
  /*  Auto transitions                                              */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    if (stage === "logo") {
      const t1 = setTimeout(() => setLogoExiting(true), 1400);
      const t2 = setTimeout(() => {
        setStage("welcome");
        setLogoExiting(false);
      }, 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    if (stage === "welcome") {
      const t1 = setTimeout(() => setWelcomeExiting(true), 1800);
      const t2 = setTimeout(() => {
        setStage("methods");
        setWelcomeExiting(false);
      }, 2400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [stage]);

  /* ------------------------------------------------------------- */
  /*  Crossfade helper — fade out then fade in                      */
  /* ------------------------------------------------------------- */
  const transitionTo = useCallback((nextStage: Stage) => {
    setCardFade("out");
    setTimeout(() => {
      setStage(nextStage);
      setError("");
      setCardFade("in");
      // Return to idle after animation completes
      setTimeout(() => setCardFade("idle"), 800);
    }, 380);
  }, []);

  /* ------------------------------------------------------------- */
  /*  Navigation                                                    */
  /* ------------------------------------------------------------- */
  const goBack = () => {
    const idx = STEP_ORDER.indexOf(stage);
    if (idx > 0) {
      transitionTo(STEP_ORDER[idx - 1]);
    } else if (stage === "methods") {
      setCardFade("out");
      setTimeout(() => {
        setStage("welcome");
        setCardFade("idle");
      }, 380);
    } else if (stage === "email") {
      setCardFade("out");
      setTimeout(() => {
        setStage("methods");
        setCardFade("in");
        setTimeout(() => setCardFade("idle"), 800);
      }, 380);
    }
  };

  const currentStep = STEP_ORDER.indexOf(stage) + 1;
  const totalSteps = STEP_ORDER.length;

  /* ------------------------------------------------------------- */
  /*  Submit                                                        */
  /* ------------------------------------------------------------- */
  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const preciseLocation = await requestPreciseLocation();
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-binzeo-device-id": getClientDeviceId(),
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
          terms_accepted: acceptTerms,
          privacy_accepted: acceptTerms,
          location_consent: allowLocation,
          location: preciseLocation,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Signup failed");
        setLoading(false);
        return;
      }
      setStage("success");
      setTimeout(() => {
        if (
          data.data?.requires_custom_email_verification &&
          data.data.challenge_id
        ) {
          router.push(
            `/dashboard/verify-email?challenge_id=${encodeURIComponent(
              data.data.challenge_id
            )}`
          );
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Precise location permission is required"
      );
      setLoading(false);
    }
  };

  /* ================================================================== */
  /*  RENDER                                                             */
  /* ================================================================== */
  return (
    <div className="relative w-full min-h-[100dvh] overflow-x-hidden">
      {/* ============ Keyframes ============ */}
      <style jsx global>{`
        /* ---------- Logo cinematic ---------- */
        @keyframes bn-logo-fade-in {
          0% {
            opacity: 0;
            transform: scale(0.82) translateY(8px);
            filter: blur(16px);
          }
          35% {
            opacity: 0.5;
            transform: scale(0.94) translateY(4px);
            filter: blur(6px);
          }
          65% {
            opacity: 0.95;
            transform: scale(1.03) translateY(0);
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        @keyframes bn-logo-fade-out {
          0% { opacity: 1; transform: scale(1); filter: blur(0); }
          100% { opacity: 0; transform: scale(1.16); filter: blur(14px); }
        }
        @keyframes bn-logo-halo-in {
          0% { opacity: 0; transform: scale(0.6); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        @keyframes bn-logo-halo-out {
          0% { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes bn-conic-in {
          0% { opacity: 0; transform: rotate(-90deg) scale(0.7); }
          100% { opacity: 0.28; transform: rotate(0deg) scale(1); }
        }
        @keyframes bn-conic-out {
          0% { opacity: 0.28; }
          100% { opacity: 0; transform: rotate(60deg) scale(1.2); }
        }
        @keyframes bn-halo-breathe {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(1.15); }
        }
        @keyframes bn-halo-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bn-orbit {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50%      { transform: translate(18px, -14px); opacity: 1; }
        }
        @keyframes bn-dot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.4); opacity: 1; }
        }

        /* ---------- Welcome ---------- */
        @keyframes bn-welcome-in {
          0% { opacity: 0; transform: translateY(30px); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes bn-welcome-out {
          0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateY(-24px) scale(0.98); filter: blur(10px); }
        }
        @keyframes bn-word-in {
          from { opacity: 0; transform: translateY(28px); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
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

        /* ---------- Card fade crossfade ---------- */
        @keyframes bn-card-fade-in {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
            filter: blur(8px);
          }
          60% {
            opacity: 0.9;
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes bn-card-fade-out {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-14px) scale(0.985);
            filter: blur(8px);
          }
        }
        @keyframes bn-card-shell-in {
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
        @keyframes bn-method-in {
          0% { opacity: 0; transform: translateY(24px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ---------- Success ---------- */
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
      {/*  STAGE 1 · LOGO                                                */}
      {/* ============================================================ */}
      {stage === "logo" && (
        <div className="absolute inset-0 z-20 flex min-h-[100dvh] items-center justify-center overflow-hidden">
          <div
            className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.28) 0%, transparent 68%)",
              animation: logoExiting
                ? "bn-logo-halo-out 0.6s cubic-bezier(0.55, 0, 1, 0.45) both"
                : "bn-logo-halo-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) both, bn-halo-breathe 3.4s ease-in-out 1.2s infinite",
            }}
          />
          <div
            className="absolute w-[720px] h-[720px] rounded-full pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 25%, transparent 55%)",
              filter: "blur(48px)",
              animation: logoExiting
                ? "bn-conic-out 0.6s cubic-bezier(0.55, 0, 1, 0.45) both"
                : "bn-conic-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both, bn-halo-rotate 9s linear 1.4s infinite",
            }}
          />
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/80"
              style={{
                left: `${48 + Math.cos((i * Math.PI) / 2) * 8}%`,
                top: `${48 + Math.sin((i * Math.PI) / 2) * 8}%`,
                animation: logoExiting
                  ? "bn-fade-in 0.3s reverse both"
                  : `bn-orbit ${3.2 + i * 0.5}s ease-in-out ${
                      i * 0.4
                    }s infinite, bn-dot-pulse 2s ease-in-out ${
                      i * 0.3
                    }s infinite`,
              }}
            />
          ))}
          <div
            className="relative"
            style={{
              animation: logoExiting
                ? "bn-logo-fade-out 0.6s cubic-bezier(0.55, 0, 1, 0.45) both"
                : "bn-logo-fade-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            <BrandLogo big />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  STAGE 2 · WELCOME (Create your BINZEO ID)                    */}
      {/* ============================================================ */}
      {stage === "welcome" && (
        <div
          className="absolute inset-0 z-20 flex min-h-[100dvh] items-center justify-center px-6"
          style={{
            animation: welcomeExiting
              ? "bn-welcome-out 0.6s cubic-bezier(0.55, 0, 1, 0.45) both"
              : undefined,
          }}
        >
          <div className="text-center max-w-[560px]">
            <div
              style={{
                animation: welcomeExiting
                  ? "bn-welcome-out 0.6s cubic-bezier(0.55, 0, 1, 0.45) both"
                  : "bn-welcome-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
              }}
            >
              <BrandLogo />
            </div>

            <h1 className="mt-10 text-[40px] sm:text-[50px] font-semibold tracking-[-0.045em] leading-[1.05] text-white">
              {["Create", "your", "BINZEO ID"].map((word, i) => (
                <span
                  key={word}
                  className="inline-block"
                  style={{
                    animation: welcomeExiting
                      ? "bn-welcome-out 0.5s cubic-bezier(0.55, 0, 1, 0.45) both"
                      : `bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.15 + i * 0.13
                        }s both`,
                  }}
                >
                  {word}
                  {i < 2 && "\u00A0"}
                </span>
              ))}
            </h1>

            <div
              className="mx-auto mt-6 h-[2px] w-16 bg-white/60 rounded-full origin-center"
              style={{
                animation: welcomeExiting
                  ? "bn-fade-in 0.3s reverse both"
                  : "bn-underline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both",
              }}
            />

            <p
              className="mt-8 text-[16px] sm:text-[17px] text-white/75 leading-relaxed"
              style={{
                animation: welcomeExiting
                  ? "bn-welcome-out 0.5s cubic-bezier(0.55, 0, 1, 0.45) both"
                  : "bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both",
              }}
            >
              Let&apos;s get you set up in just a few steps.
            </p>

            <p
              className="mt-7 text-[12px] text-white/45 leading-relaxed max-w-[380px] mx-auto"
              style={{
                animation: welcomeExiting
                  ? "bn-welcome-out 0.5s cubic-bezier(0.55, 0, 1, 0.45) both"
                  : "bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.05s both",
              }}
            >
              Your data stays secure. Precise location is required to create
              your account.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  STAGE 3-9 · METHODS + SIGNUP STEPS                            */}
      {/* ============================================================ */}
      {(stage === "methods" ||
        stage === "email" ||
        stage === "first_name" ||
        stage === "last_name" ||
        stage === "password" ||
        stage === "terms" ||
        stage === "location") && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:py-12">
          <div
            className="w-full max-w-[460px] rounded-[32px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.15)] px-6 py-8 sm:px-8 sm:py-9 text-white overflow-hidden"
            style={{
              animation:
                "bn-card-shell-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            <StepCard fadeState={cardFade} cardKey={stage}>
              {/* ============================================================ */}
              {/*  METHODS VIEW                                                 */}
              {/* ============================================================ */}
              {stage === "methods" && (
                <div>
                  <div className="grid gap-2.5">
                    {METHODS.map((m, i) => (
                      <button
                        key={m.label}
                        type="button"
                        disabled={!m.available}
                        onClick={() => {
                          if (m.available) {
                            transitionTo(m.key);
                          } else {
                            setError(`${m.label} is not available yet.`);
                          }
                        }}
                        className={`group flex items-center gap-4 w-full rounded-2xl border border-white/12 bg-white/[0.05] backdrop-blur-xl px-4 py-4 text-left transition-all duration-500 ${
                          m.available
                            ? "hover:bg-white/[0.12] hover:border-white/25 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.5)]"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                        style={{
                          animation: `bn-method-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${
                            0.08 + i * 0.08
                          }s both`,
                        }}
                      >
                        <div
                          className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-500 ${
                            m.available
                              ? "bg-white/10 border-white/15 text-white/90 group-hover:bg-white/20 group-hover:scale-105"
                              : "bg-white/5 border-white/10 text-white/50"
                          }`}
                        >
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
                        {m.available ? (
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
                        ) : (
                          <span className="text-[10px] uppercase tracking-[0.1em] text-white/40 border border-white/15 rounded-full px-2 py-0.5">
                            Soon
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

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

                  <p
                    className="mt-7 text-center text-[13px] text-white/60"
                    style={{
                      animation: `bn-fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both`,
                    }}
                  >
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="font-medium text-white hover:text-white/80 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              )}

              {/* ============================================================ */}
              {/*  STEP 1 · EMAIL (now first!)                                  */}
              {/* ============================================================ */}
              {stage === "email" && (
                <div>
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-4"
                  >
                    <IconArrowLeft />
                    <span className="text-[12px]">Back</span>
                  </button>

                  <ProgressBar current={1} total={6} />

                  <h2 className="text-[24px] font-semibold tracking-[-0.03em]">
                    Your email address
                  </h2>
                  <p className="mt-1.5 text-[13px] text-white/55">
                    We&apos;ll send your verification code here.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(email.trim())) {
                        setError("Please enter a valid email address");
                        return;
                      }
                      transitionTo("first_name");
                    }}
                    className="mt-7 space-y-3"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoFocus
                      placeholder="you@example.com"
                      className={fieldClass}
                    />
                    {error && (
                      <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px"
                    >
                      Continue
                    </button>
                  </form>
                </div>
              )}

              {/* ============================================================ */}
              {/*  STEP 2 · FIRST NAME                                          */}
              {/* ============================================================ */}
              {stage === "first_name" && (
                <div>
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-4"
                  >
                    <IconArrowLeft />
                    <span className="text-[12px]">Back</span>
                  </button>

                  <ProgressBar current={2} total={6} />

                  <h2 className="text-[24px] font-semibold tracking-[-0.03em]">
                    What&apos;s your first name?
                  </h2>
                  <p className="mt-1.5 text-[13px] text-white/55">
                    This will appear on your BINZEO ID.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (firstName.trim().length < 2) {
                        setError("First name must be at least 2 characters");
                        return;
                      }
                      transitionTo("last_name");
                    }}
                    className="mt-7 space-y-3"
                  >
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      autoFocus
                      placeholder="Your first name"
                      className={fieldClass}
                    />
                    {error && (
                      <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px"
                    >
                      Continue
                    </button>
                  </form>
                </div>
              )}

              {/* ============================================================ */}
              {/*  STEP 3 · LAST NAME                                           */}
              {/* ============================================================ */}
              {stage === "last_name" && (
                <div>
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-4"
                  >
                    <IconArrowLeft />
                    <span className="text-[12px]">Back</span>
                  </button>

                  <ProgressBar current={3} total={6} />

                  <h2 className="text-[24px] font-semibold tracking-[-0.03em]">
                    And your last name?
                  </h2>
                  <p className="mt-1.5 text-[13px] text-white/55">
                    Nice to meet you, {firstName || "friend"}.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (lastName.trim().length < 1) {
                        setError("Last name is required");
                        return;
                      }
                      transitionTo("password");
                    }}
                    className="mt-7 space-y-3"
                  >
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      autoFocus
                      placeholder="Your last name"
                      className={fieldClass}
                    />
                    {error && (
                      <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px"
                    >
                      Continue
                    </button>
                  </form>
                </div>
              )}

              {/* ============================================================ */}
              {/*  STEP 4 · PASSWORD                                            */}
              {/* ============================================================ */}
              {stage === "password" && (
                <div>
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-4"
                  >
                    <IconArrowLeft />
                    <span className="text-[12px]">Back</span>
                  </button>

                  <ProgressBar current={4} total={6} />

                  <h2 className="text-[24px] font-semibold tracking-[-0.03em]">
                    Create a password
                  </h2>
                  <p className="mt-1.5 text-[13px] text-white/55">
                    Use at least 8 characters. Keep it strong.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (password.length < 8) {
                        setError("Password must be at least 8 characters");
                        return;
                      }
                      if (password !== confirmPassword) {
                        setError("Passwords do not match");
                        return;
                      }
                      transitionTo("terms");
                    }}
                    className="mt-7 space-y-3"
                  >
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        autoFocus
                        minLength={8}
                        placeholder="Your password"
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

                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      className={fieldClass}
                    />

                    {password.length > 0 && (
                      <div className="flex items-center gap-2 px-1">
                        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              password.length >= 12
                                ? "bg-green-400 w-full"
                                : password.length >= 8
                                ? "bg-yellow-400 w-2/3"
                                : "bg-red-400 w-1/3"
                            }`}
                          />
                        </div>
                        <span className="text-[10.5px] uppercase tracking-wider text-white/50">
                          {password.length >= 12
                            ? "Strong"
                            : password.length >= 8
                            ? "Good"
                            : "Weak"}
                        </span>
                      </div>
                    )}

                    {error && (
                      <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px"
                    >
                      Continue
                    </button>
                  </form>
                </div>
              )}

              {/* ============================================================ */}
              {/*  STEP 5 · TERMS                                               */}
              {/* ============================================================ */}
              {stage === "terms" && (
                <div>
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-4"
                  >
                    <IconArrowLeft />
                    <span className="text-[12px]">Back</span>
                  </button>

                  <ProgressBar current={5} total={6} />

                  <h2 className="text-[24px] font-semibold tracking-[-0.03em]">
                    Almost there
                  </h2>
                  <p className="mt-1.5 text-[13px] text-white/55">
                    Please review and accept our terms to continue.
                  </p>

                  <div className="mt-7 space-y-3">
                    <button
                      type="button"
                      onClick={() => setAcceptTerms((v) => !v)}
                      className={`w-full flex items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                        acceptTerms
                          ? "border-white/30 bg-white/[0.10]"
                          : "border-white/12 bg-white/[0.04] hover:bg-white/[0.07]"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          acceptTerms
                            ? "bg-white border-white"
                            : "bg-transparent border-white/30"
                        }`}
                      >
                        {acceptTerms && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] text-white/80 leading-relaxed">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          onClick={(e) => e.stopPropagation()}
                          className="text-white underline underline-offset-2 hover:no-underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          onClick={(e) => e.stopPropagation()}
                          className="text-white underline underline-offset-2 hover:no-underline"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </button>

                    {error && (
                      <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={!acceptTerms}
                      onClick={() => transitionTo("location")}
                      className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/*  STEP 6 · LOCATION                                            */}
              {/* ============================================================ */}
              {stage === "location" && (
                <div>
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 -ml-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 mb-4"
                  >
                    <IconArrowLeft />
                    <span className="text-[12px]">Back</span>
                  </button>

                  <ProgressBar current={6} total={6} />

                  <div className="text-center">
                    <div
                      className="mx-auto w-20 h-20 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center text-white/90"
                      style={{
                        animation: "bn-halo-breathe 3.5s ease-in-out infinite",
                      }}
                    >
                      <IconLocation />
                    </div>

                    <h2 className="mt-6 text-[24px] font-semibold tracking-[-0.03em]">
                      Verify your location
                    </h2>
                    <p className="mt-3 text-[13.5px] text-white/60 max-w-sm mx-auto leading-relaxed">
                      For security verification, please allow BINZEO to access
                      your precise location. Your browser will show a
                      permission prompt.
                    </p>
                    <p className="mt-3 text-[11.5px] text-white/40 max-w-sm mx-auto leading-relaxed">
                      This is used once to protect your account and set a
                      default address. You can edit or remove it later.
                    </p>
                  </div>

                  <div className="mt-7 space-y-3">
                    <button
                      type="button"
                      onClick={() => setAllowLocation((v) => !v)}
                      className={`w-full flex items-start gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                        allowLocation
                          ? "border-white/30 bg-white/[0.10]"
                          : "border-white/12 bg-white/[0.04] hover:bg-white/[0.07]"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          allowLocation
                            ? "bg-white border-white"
                            : "bg-transparent border-white/30"
                        }`}
                      >
                        {allowLocation && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] text-white/80 leading-relaxed">
                        I allow BINZEO to use my precise device location for
                        account security and default address creation.
                      </span>
                    </button>

                    {error && (
                      <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={!allowLocation || loading}
                      onClick={handleSubmit}
                      className="w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.4)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40 inline-flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            className="w-4 h-4"
                            style={{
                              animation:
                                "bn-halo-rotate 0.8s linear infinite",
                            }}
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Creating your BINZEO ID...
                        </>
                      ) : (
                        "Create my BINZEO ID"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </StepCard>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  SUCCESS                                                       */}
      {/* ============================================================ */}
      {stage === "success" && (
        <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-6">
          <div className="text-center max-w-md">
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
              Your ID has been created. Redirecting to verification…
            </p>

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
