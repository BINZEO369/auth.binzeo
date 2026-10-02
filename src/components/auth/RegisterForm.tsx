"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fieldClass =
  "w-full rounded-2xl border border-[#4a4d51] bg-transparent px-4 py-3.5 text-sm text-white placeholder-[#8f949b] outline-none transition-colors focus:border-white focus:ring-1 focus:ring-white/30";

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
      <button type="button" onClick={() => onMessage("Apple sign-up is not available yet.")} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#15171a] py-3 text-sm font-medium text-white transition hover:bg-[#202327]">
        <span className="font-semibold">A</span> Continue with Apple
      </button>
      <button type="button" onClick={() => onMessage("Phone sign-up is not available yet.")} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#15171a] py-3 text-sm font-medium text-white transition hover:bg-[#202327]">
        <Image src="/icons/phone.svg" alt="" width={16} height={16} className="invert" />
        Continue with phone
      </button>
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!acceptTerms) {
      setError("You must accept the Terms and Privacy Policy");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Signup failed");
        setLoading(false);
        return;
      }
      if (data.data?.requires_custom_email_verification && data.data.challenge_id) {
        router.push(`/dashboard/verify-email?challenge_id=${encodeURIComponent(data.data.challenge_id)}`);
        router.refresh();
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const panelClass = "mx-auto w-full max-w-[420px] bg-[#050607] px-1 py-4 text-white sm:px-4 sm:py-8";

  if (success) {
    return (
      <div className={panelClass}>
        <BrandLogo />
        <div className="mx-auto mt-16 flex h-14 w-14 items-center justify-center rounded-full bg-[#dff2e9] text-[#2e8064]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-7 w-7"><path d="M5 12.5 9.5 17 19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h1 className="mt-6 text-center text-2xl font-semibold">Check your email</h1>
        <p className="mt-3 text-center text-sm leading-6 text-[#a6abb2]">We&apos;ve sent a 6-digit verification code to <span className="text-white">{email}</span>.</p>
        <Link href="/login" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white py-3 text-sm font-semibold text-[#050607] transition hover:bg-[#e3e6e8]">Go to login</Link>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      <BrandLogo />
      <div className="mt-9 text-center">
        <h1 className="text-[28px] font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-[#a6abb2]">Let&apos;s get you started with BINZEO</p>
      </div>

      {error && <div className="mt-6 rounded-2xl border border-[#9d514f] bg-[#2a1516] px-4 py-3 text-sm text-[#ffb8b4]">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-7 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" placeholder="First name" aria-label="First name" className={fieldClass} />
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" placeholder="Last name" aria-label="Last name" className={fieldClass} />
        </div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="Your Email" aria-label="Email" className={fieldClass} />
        <div className="relative">
          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="Your Password" aria-label="Password" className={`${fieldClass} pr-16`} />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#a6abb2] hover:text-white">{showPassword ? "Hide" : "Show"}</button>
        </div>
        <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" placeholder="Confirm Password" aria-label="Confirm password" className={fieldClass} />
        <label className="flex items-start gap-2 px-1 pt-1 text-xs leading-5 text-[#a6abb2]">
          <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-1 h-3.5 w-3.5 accent-white" />
          <span>I agree to the <Link href="/terms" className="text-white underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="text-white underline underline-offset-2">Privacy Policy</Link></span>
        </label>
        <button type="submit" disabled={loading} className="mt-2 w-full rounded-full bg-white py-3.5 text-sm font-semibold text-[#050607] transition hover:bg-[#e3e6e8] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating your ID..." : "Create account"}</button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-[#8f949b]"><span className="h-px flex-1 bg-[#3d4145]" /><span>or</span><span className="h-px flex-1 bg-[#3d4145]" /></div>
      <SocialActions onMessage={setError} />
      <p className="mt-7 text-center text-sm text-[#a6abb2]">Already have an account? <Link href="/login" className="font-medium text-white hover:text-[#c9e8f1]">Sign in</Link></p>
    </div>
  );
}
