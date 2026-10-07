"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";

type Step = "idle" | "sent" | "verified";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("idle");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const signupChallengeId = searchParams.get("challenge_id");
    if (!signupChallengeId) return;
    setChallengeId(signupChallengeId);
    setStep("sent");
    setResendIn(60);
    setTimeout(() => focusIndex(0), 100);
  }, [searchParams]);

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const focusIndex = (i: number) => {
    const el = inputsRef.current[i];
    if (el) el.focus();
  };

  const handleDigit = (i: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      // paste-like input — spread across
      const arr = clean.slice(0, 6 - i).split("");
      setDigits((d) => {
        const next = [...d];
        for (let k = 0; k < arr.length; k++) next[i + k] = arr[k];
        return next;
      });
      focusIndex(Math.min(i + arr.length, 5));
      return;
    }
    setDigits((d) => {
      const next = [...d];
      next[i] = clean;
      return next;
    });
    if (clean && i < 5) focusIndex(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      focusIndex(i - 1);
    }
    if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
    if (e.key === "ArrowRight" && i < 5) focusIndex(i + 1);
  };

  const sendOtp = async () => {
    setLoading(true);
    setMessage(null);
    const res = await apiFetch<{ challenge_id: string }>(
      "/api/user/email-verification",
      { method: "POST" }
    );
    if (res.success) {
      setChallengeId(res.data.challenge_id);
      setStep("sent");
      setResendIn(60);
      setDigits(["", "", "", "", "", ""]);
      setMessage({
        type: "success",
        text: "Verification code sent to your email.",
      });
      setTimeout(() => focusIndex(0), 100);
    } else {
      if (res.error.retry_after_seconds) {
        setResendIn((current) => Math.max(current, res.error.retry_after_seconds ?? 0));
      }
      setMessage({ type: "error", text: res.error.message });
    }
    setLoading(false);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeId) {
      setMessage({ type: "error", text: "Send a code first." });
      return;
    }
    const code = digits.join("");
    if (code.length !== 6) {
      setMessage({ type: "error", text: "Enter all 6 digits." });
      return;
    }

    setLoading(true);
    setMessage(null);
    const res = await apiFetch<{ verified: boolean; reason: string }>(
      "/api/user/email-verification/verify",
      {
        method: "POST",
        body: JSON.stringify({ challenge_id: challengeId, code }),
      }
    );

    if (res.success && res.data.verified) {
      setStep("verified");
      setMessage({
        type: "success",
        text: "Email verified successfully!",
      });
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } else {
      setMessage({
        type: "error",
        text: res.success
          ? `Verification failed: ${res.data.reason}`
          : res.error.message,
      });
      setDigits(["", "", "", "", "", ""]);
      focusIndex(0);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#333333] bg-[#0d0d0d] text-xs text-[#888888] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6666666] animate-pulse" />
          Email Verification
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {step === "verified" ? "Verified!" : "Verify your email"}
        </h1>
        <p className="text-sm text-[#888888]">
          {step === "idle" &&
            "We'll send a 6-digit code to your registered email."}
          {step === "sent" &&
            "Enter the 6-digit code sent to your email. It expires in 5 minutes. You can request a new code once per minute."}
          {step === "verified" &&
            "Your email has been verified successfully. Redirecting..."}
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg border text-sm mb-4 ${
            message.type === "success"
              ? "bg-[#555555]/10 border-[#555555]/30 text-[#444444]"
              : "bg-[#555555]/10 border-[#555555]/30 text-[#444444]"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Idle Step */}
      {step === "idle" && (
        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#222222] hover:bg-[#333333] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-lg shadow-indigo-600/20"
        >
          {loading ? "Sending..." : "Send verification code"}
        </button>
      )}

      {/* Sent Step — OTP input */}
      {step === "sent" && (
        <form
          onSubmit={verifyOtp}
          className="p-5 rounded-2xl border border-[#333333] bg-[#0d0d0d] space-y-4"
        >
          <div className="flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-lg border border-[#333333] bg-[#0d0d0d] text-white focus:outline-none focus:border-[#444444] focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                style={{ height: "3.25rem" }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || digits.some((d) => !d)}
            className="w-full py-3 rounded-lg bg-[#222222] hover:bg-[#333333] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>

          <div className="flex items-center justify-between text-xs text-[#777777] pt-2">
            <button
              type="button"
              onClick={sendOtp}
              disabled={resendIn > 0 || loading}
              className="text-[#555555] hover:text-[#6666666] disabled:text-[#6666666] disabled:cursor-not-allowed"
            >
              {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("idle");
                setDigits(["", "", "", "", "", ""]);
                setMessage(null);
              }}
              className="hover:text-[#6666666]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Verified Step */}
      {step === "verified" && (
        <div className="p-8 rounded-2xl border border-[#555555]/20 bg-[#555555]/5 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#555555]/10 border border-[#555555]/30 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7 text-[#444444]"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="text-sm text-[#6666666] mb-4">
            Redirecting to dashboard...
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2 rounded-lg bg-[#222222] hover:bg-[#333333] text-white text-sm font-medium transition-colors"
          >
            Go now
          </Link>
        </div>
      )}
    </div>
  );
}
