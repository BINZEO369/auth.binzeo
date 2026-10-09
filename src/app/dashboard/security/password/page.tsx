"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Step = "start" | "verify" | "password" | "done";

/* ================================================================== */
/*  Small components                                                   */
/* ================================================================== */

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      style={{ width: size, height: size, animation: "spin 0.8s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function PrimaryButton({
  children,
  onClick,
  loading,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-black px-5 py-3.5 text-[13.5px] font-medium transition-all duration-500 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        background: "#0a0a0a",
        color: "#ffffff",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 2px 4px rgba(0,0,0,0.08), 0 12px 28px -12px rgba(0,0,0,0.5)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)",
        }}
      />
      {loading && (
        <span className="relative flex items-center" style={{ color: "#ffffff" }}>
          <Spinner />
        </span>
      )}
      <span className="relative" style={{ color: "#ffffff" }}>
        {children}
      </span>
    </button>
  );
}

function GlassLink({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-white/40 bg-white/40 px-3.5 py-2 text-[12px] font-medium text-black/75 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black";
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

function StepDots({ step }: { step: Step }) {
  const idx = step === "start" ? 0 : step === "verify" ? 1 : step === "password" ? 2 : 3;
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => {
        const active = idx > i || (idx === 3 && i === 2);
        return (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: active ? 22 : 8,
              background: active ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.18)",
            }}
          />
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */

export default function ChangePasswordPage() {
  const [step, setStep] = useState<Step>("start");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const resetError = () => setError(null);

  const startCooldown = () => {
    setCooldown(60);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  /* ---------------- Actions ---------------- */

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ challenge_id?: string; message: string }>(
        "/api/user/password-change/request",
        { method: "POST" }
      );
      if (res.success && res.data.challenge_id) {
        setChallengeId(res.data.challenge_id);
        setMaskedEmail(null);
        setOtp("");
        setStep("verify");
        startCooldown();
      } else if (res.success) {
        setError("The verification challenge was not created. Please try again.");
      } else {
        setError(res.error.message || "Couldn't send the code");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    const code = otp.replace(/\D/g, "");
    if (code.length !== 6) {
      setError("Enter the 6-digit code we sent to your email");
      return;
    }
    setLoading(true);
    setError(null);
    if (!challengeId) {
      setError("Your verification session has expired. Request a new code.");
      setLoading(false);
      return;
    }
    setOtp(code);
    setStep("password");
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!challengeId || otp.length !== 6) {
        setError("Enter the 6-digit verification code first.");
        setLoading(false);
        return;
      }
      const res = await apiFetch<{ verified: boolean; reason: string }>("/api/auth/password-reset/verify", {
        method: "POST",
        body: JSON.stringify({
          challenge_id: challengeId,
          code: otp,
          new_password: newPassword,
          confirm_password: confirmPassword,
          purpose: "change",
        }),
      });
      if (res.success && res.data.verified) {
        setStep("done");
      } else if (res.success) {
        setError(`Verification failed: ${res.data.reason}`);
      } else {
        setError(res.error.message || "Couldn't update your password");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    await handleSendOtp();
  };

  /* ---------------- Password strength ---------------- */
  const strength = (() => {
    if (!newPassword) return { score: 0, label: "", color: "rgba(0,0,0,0)" };
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    const map = [
      { label: "", color: "rgba(0,0,0,0)" },
      { label: "Weak", color: "rgba(239,68,68,0.85)" },
      { label: "Fair", color: "rgba(245,158,11,0.85)" },
      { label: "Good", color: "rgba(59,130,246,0.85)" },
      { label: "Strong", color: "rgba(16,185,129,0.85)" },
    ];
    return { score: s, ...map[s] };
  })();

  return (
    <>
      <title>Change Password — BINZEO</title>
      <meta
        name="description"
        content="Change your BINZEO account password with email OTP verification."
      />

      <div className="relative isolate min-h-[80vh] w-full">
        {/* ============================================================ */}
        {/*  STYLES                                                       */}
        {/* ============================================================ */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes pw-item-in {
                from { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(8px); }
                to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
              }
              @keyframes pw-banner-in {
                from { opacity: 0; transform: translateY(24px); filter: blur(10px); }
                to   { opacity: 1; transform: translateY(0); filter: blur(0); }
              }
              @keyframes pw-step-in {
                from { opacity: 0; transform: translateY(14px); filter: blur(6px); }
                to   { opacity: 1; transform: translateY(0); filter: blur(0); }
              }
              @keyframes pw-float-soft {
                0%, 100% { transform: translateY(0); }
                50%      { transform: translateY(-5px); }
              }
              @keyframes pw-kenburns {
                0%, 100% { transform: scale(1.04) translate(0, 0); }
                50%      { transform: scale(1.12) translate(-1%, -0.8%); }
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }

              /* ============================================================ */
              /*  LIQUID GLASS INPUT — no solid white                          */
              /* ============================================================ */
              .bz-input {
                width: 100%;
                padding: 14px 16px;
                border-radius: 14px;
                border: 1px solid rgba(255,255,255,0.4);
                background: radial-gradient(
                  120% 120% at 30% 12%,
                  rgba(255,255,255,0.28) 0%,
                  rgba(255,255,255,0.15) 55%,
                  rgba(255,255,255,0.08) 100%
                );
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                box-shadow:
                  inset 0 1px 0 0 rgba(255,255,255,0.9),
                  inset 0 0 0 1px rgba(255,255,255,0.15),
                  0 2px 6px -2px rgba(0,0,0,0.06);
                color: rgba(0,0,0,0.92);
                font-size: 15px;
                line-height: 1.4;
                outline: none;
                transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
                box-sizing: border-box;
                max-width: 100%;
              }
              .bz-input::placeholder {
                color: rgba(0,0,0,0.35);
              }
              .bz-input:hover:not(:disabled) {
                border-color: rgba(255,255,255,0.55);
              }
              .bz-input:focus {
                border-color: rgba(255,255,255,0.75);
                background: radial-gradient(
                  120% 120% at 30% 12%,
                  rgba(255,255,255,0.45) 0%,
                  rgba(255,255,255,0.28) 55%,
                  rgba(255,255,255,0.16) 100%
                );
                box-shadow:
                  inset 0 1px 0 0 rgba(255,255,255,1),
                  inset 0 0 0 1px rgba(255,255,255,0.3),
                  0 0 0 4px rgba(255,255,255,0.28),
                  0 4px 12px -4px rgba(0,0,0,0.1);
              }
              .bz-input:disabled {
                opacity: 0.6;
                cursor: not-allowed;
              }

              /* OTP input — big, centered, mono */
              .bz-otp {
                font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
                font-size: 26px;
                font-weight: 600;
                letter-spacing: 0.5em;
                text-align: center;
                padding: 18px 12px 18px calc(0.5em + 12px);
                color: rgba(0,0,0,0.92);
              }
              .bz-otp::placeholder {
                color: rgba(0,0,0,0.18);
                letter-spacing: 0.5em;
              }

              .bz-step {
                animation: pw-step-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
              }

              @media (prefers-reduced-motion: reduce) {
                [data-pw-anim], .bz-step, .bz-input, * {
                  animation: none !important;
                  transition: none !important;
                }
              }
            `,
          }}
        />

        {/* ============================================================ */}
        {/*  BACKGROUND                                                   */}
        {/* ============================================================ */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div
            className="absolute -inset-[6%]"
            style={{
              backgroundImage: "url('/images/img3.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              animation: "pw-kenburns 32s ease-in-out infinite",
            }}
          />
        </div>

        {/* ============================================================ */}
        {/*  CONTENT                                                      */}
        {/* ============================================================ */}
        <div className="relative z-10 mx-auto w-full max-w-2xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8">
          {/* ---------- BANNER ---------- */}
          <div
            data-pw-anim
            className="relative w-full overflow-hidden rounded-3xl border border-white/[0.4] p-6 sm:p-8"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.28) 100%)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
              animation:
                "pw-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(circle, rgba(180,200,255,0.5) 0%, rgba(180,200,255,0) 70%)",
                filter: "blur(36px)",
                animation: "pw-float-soft 7s ease-in-out infinite",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,200,180,0.45) 0%, rgba(255,200,180,0) 70%)",
                filter: "blur(36px)",
                animation: "pw-float-soft 7s ease-in-out 1.4s infinite",
              }}
            />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 backdrop-blur-md">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-black/80"
                  style={{ animation: "pw-float-soft 2.4s ease-in-out infinite" }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/70">
                  Security
                </span>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h1
                    className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-black sm:text-3xl"
                    style={{
                      textShadow:
                        "0 1px 12px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.6)",
                    }}
                  >
                    Change password
                  </h1>
                  <p className="max-w-md text-[13.5px] leading-6 text-black/70">
                    Verify your identity with a one-time code, then choose a
                    new password.
                  </p>
                </div>

                <Link
                  href="/dashboard/security"
                  className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full border border-white/40 bg-white/40 px-3.5 py-2 text-[12px] font-medium text-black/75 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
                >
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center transition-transform duration-500 group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: "100%", height: "100%" }}
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </span>
                  Back to Security
                </Link>
              </div>
            </div>
          </div>

          {/* ---------- FORM CARD ---------- */}
          <section
            className="relative w-full overflow-hidden rounded-3xl border border-white/[0.35] p-5 sm:p-7"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.34) 45%, rgba(255,255,255,0.22) 100%)",
              backdropFilter: "blur(26px) saturate(180%)",
              WebkitBackdropFilter: "blur(26px) saturate(180%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.85), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 18px 42px -22px rgba(0,0,0,0.28)",
              animation:
                "pw-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
              }}
            />

            <div className="relative w-full">
              {/* Section heading + step dots */}
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
                    {step === "done" ? "Complete" : "Verification"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px w-8"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0))",
                    }}
                  />
                </div>
                <StepDots step={step} />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[12.5px] backdrop-blur-md"
                  style={{
                    borderColor: "rgba(252,165,165,0.7)",
                    background: "rgba(254,226,226,0.55)",
                    color: "#991b1b",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
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

              {/* Step content */}
              <div key={step} className="bz-step">
                {/* ============ STEP 1 — START ============ */}
                {step === "start" && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/40"
                        style={{
                          background:
                            "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.45) 100%)",
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                          boxShadow:
                            "inset 0 1px 0 0 rgba(255,255,255,1), 0 6px 16px -8px rgba(0,0,0,0.1)",
                          animation: "pw-float-soft 4s ease-in-out infinite",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-7 w-7 text-black/70"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <h2 className="mb-2 text-[17px] font-semibold tracking-[-0.01em] text-black/90">
                        Send a verification code
                      </h2>
                      <p className="mx-auto max-w-sm text-[13px] leading-6 text-black/60">
                        We&apos;ll send a one-time code to your registered email
                        to verify it&apos;s really you.
                      </p>
                    </div>

                    <PrimaryButton onClick={handleSendOtp} loading={loading}>
                      Send verification code
                    </PrimaryButton>

                    <p className="text-center text-[11.5px] text-black/50">
                      You&apos;ll enter the code on the next screen.
                    </p>
                  </div>
                )}

                {/* ============ STEP 2 — VERIFY ============ */}
                {step === "verify" && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/40"
                        style={{
                          background:
                            "radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.45) 100%)",
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                          boxShadow:
                            "inset 0 1px 0 0 rgba(255,255,255,1), 0 6px 16px -8px rgba(0,0,0,0.1)",
                          animation: "pw-float-soft 4s ease-in-out infinite",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-7 w-7 text-black/70"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </div>
                      <h2 className="mb-2 text-[17px] font-semibold tracking-[-0.01em] text-black/90">
                        Enter your code
                      </h2>
                      <p className="mx-auto max-w-sm text-[13px] leading-6 text-black/60">
                        We sent a 6-digit code to{" "}
                        <span className="font-medium text-black/80">
                          {maskedEmail ?? "your email"}
                        </span>
                        .
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
                        Verification code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          resetError();
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                        }}
                        placeholder="000000"
                        className="bz-input bz-otp"
                        autoFocus
                      />
                    </div>

                    <PrimaryButton onClick={handleVerifyOtp} loading={loading}>
                      Verify code
                    </PrimaryButton>

                    <div className="flex items-center justify-center gap-2 text-[12px] text-black/60">
                      <span>Didn&apos;t get it?</span>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={loading || cooldown > 0}
                        className="font-medium text-black/80 underline decoration-black/30 underline-offset-2 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                      </button>
                    </div>

                    <div className="flex justify-center pt-1">
                      <GlassLink
                        onClick={() => {
                          setStep("start");
                          resetError();
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        Start over
                      </GlassLink>
                    </div>
                  </div>
                )}

                {/* ============ STEP 3 — PASSWORD ============ */}
                {step === "password" && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-300/60"
                        style={{
                          background:
                            "radial-gradient(120% 120% at 30% 15%, rgba(209,250,229,0.85) 0%, rgba(209,250,229,0.5) 100%)",
                          backdropFilter: "blur(14px)",
                          WebkitBackdropFilter: "blur(14px)",
                          boxShadow:
                            "inset 0 1px 0 0 rgba(255,255,255,1), 0 6px 20px -8px rgba(16,185,129,0.3)",
                          animation: "pw-float-soft 4s ease-in-out infinite",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-7 w-7 text-emerald-700"
                        >
                          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                      </div>
                      <h2 className="mb-2 text-[17px] font-semibold tracking-[-0.01em] text-black/90">
                        Choose a new password
                      </h2>
                      <p className="mx-auto max-w-sm text-[13px] leading-6 text-black/60">
                        Code verified. Make your new password strong and unique.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
                          New password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => {
                              resetError();
                              setNewPassword(e.target.value);
                            }}
                            placeholder="Enter a new password"
                            className="bz-input pr-12"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-black/55 transition-colors hover:bg-white/40 hover:text-black"
                          >
                            {showPassword ? (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </svg>
                            ) : (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            )}
                          </button>
                        </div>

                        {newPassword && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="flex flex-1 gap-1">
                              {[1, 2, 3, 4].map((i) => (
                                <span
                                  key={i}
                                  className="h-1 flex-1 rounded-full transition-all duration-500"
                                  style={{
                                    background:
                                      i <= strength.score
                                        ? strength.color
                                        : "rgba(0,0,0,0.1)",
                                  }}
                                />
                              ))}
                            </div>
                            <span
                              className="min-w-[42px] text-right text-[10.5px] font-semibold uppercase tracking-[0.1em] transition-colors"
                              style={{ color: strength.color }}
                            >
                              {strength.label}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
                          Confirm password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => {
                            resetError();
                            setConfirmPassword(e.target.value);
                          }}
                          placeholder="Repeat your new password"
                          className="bz-input"
                        />
                        {confirmPassword &&
                          newPassword &&
                          confirmPassword !== newPassword && (
                            <p className="mt-2 text-[11.5px] text-red-600/90">
                              Passwords don&apos;t match
                            </p>
                          )}
                      </div>
                    </div>

                    <PrimaryButton onClick={handleUpdatePassword} loading={loading}>
                      Update password
                    </PrimaryButton>

                    <div className="flex justify-center pt-1">
                      <GlassLink
                        onClick={() => {
                          setStep("verify");
                          resetError();
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to code
                      </GlassLink>
                    </div>
                  </div>
                )}

                {/* ============ STEP 4 — DONE ============ */}
                {step === "done" && (
                  <div className="space-y-5 text-center">
                    <div
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-300/60"
                      style={{
                        background:
                          "radial-gradient(120% 120% at 30% 15%, rgba(209,250,229,0.85) 0%, rgba(209,250,229,0.5) 100%)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        boxShadow:
                          "inset 0 1px 0 0 rgba(255,255,255,1), 0 6px 20px -8px rgba(16,185,129,0.35)",
                        animation: "pw-float-soft 4s ease-in-out infinite",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-9 w-9 text-emerald-700"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="mb-2 text-[17px] font-semibold tracking-[-0.01em] text-black/90">
                        Password updated
                      </h2>
                      <p className="mx-auto max-w-sm text-[13px] leading-6 text-black/60">
                        Your password has been changed successfully. Use your
                        new password next time you sign in.
                      </p>
                    </div>

                    <Link
                      href="/dashboard/security"
                      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-black px-5 py-3.5 text-[13.5px] font-medium transition-all duration-500 hover:-translate-y-0.5"
                      style={{
                        background: "#0a0a0a",
                        color: "#ffffff",
                        boxShadow:
                          "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 2px 4px rgba(0,0,0,0.08), 0 12px 28px -12px rgba(0,0,0,0.5)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%)",
                        }}
                      />
                      <span className="relative" style={{ color: "#ffffff" }}>
                        Back to Security
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="relative h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5"
                        style={{ color: "#ffffff" }}
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ---------- HELP TEXT ---------- */}
          <p
            className="pb-2 text-center text-[12px] text-black/55"
            style={{
              animation:
                "pw-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both",
            }}
          >
            Having trouble? Contact support at{" "}
            <a
              href="mailto:support@binzeo.com"
              className="text-black/75 underline decoration-black/30 underline-offset-2 transition-colors hover:text-black"
            >
              support@binzeo.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
