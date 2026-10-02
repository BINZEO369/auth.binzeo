"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

      if (data.data?.requires_email_confirmation) {
        setSuccess(true);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-[#d5dfdd] bg-white/90 backdrop-blur p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#dff2e9] border border-[#a8d9c4] flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 text-[#2e8064]"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#101820] mb-2">
          Check your email
        </h2>
        <p className="text-sm text-[#5c6b70] mb-6">
          We&apos;ve sent a confirmation link to{" "}
          <span className="text-[#101820] font-medium">{email}</span>. Click it to
          activate your Binzeo ID.
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-lg bg-[#101820] hover:bg-[#263746] text-[#101820] text-sm font-medium transition-colors"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#d5dfdd] bg-white/90 backdrop-blur p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101820] mb-2">
          Create your Binzeo ID
        </h1>
        <p className="text-sm text-[#5c6b70]">
          Get your unique BZ-U ID in seconds
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-[#efb8b0] bg-[#fbe5e2] text-[#b84f4b] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#35454c] mb-1.5">
              First name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
              placeholder="John"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#d5dfdd] bg-[#eef2f1] text-[#101820] placeholder-gray-600 focus:outline-none focus:border-[#79b9d5] focus:ring-2 focus:ring-[#79b9d5]/30 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#35454c] mb-1.5">
              Last name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
              placeholder="Doe"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#d5dfdd] bg-[#eef2f1] text-[#101820] placeholder-gray-600 focus:outline-none focus:border-[#79b9d5] focus:ring-2 focus:ring-[#79b9d5]/30 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#35454c] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#d5dfdd] bg-[#eef2f1] text-[#101820] placeholder-gray-600 focus:outline-none focus:border-[#79b9d5] focus:ring-2 focus:ring-[#79b9d5]/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#35454c] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full px-3.5 py-2.5 pr-14 rounded-lg border border-[#d5dfdd] bg-[#eef2f1] text-[#101820] placeholder-gray-600 focus:outline-none focus:border-[#79b9d5] focus:ring-2 focus:ring-[#79b9d5]/30 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7c80] hover:text-[#35454c] text-xs"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#35454c] mb-1.5">
            Confirm password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#d5dfdd] bg-[#eef2f1] text-[#101820] placeholder-gray-600 focus:outline-none focus:border-[#79b9d5] focus:ring-2 focus:ring-[#79b9d5]/30 transition-colors"
          />
        </div>

        <label className="flex items-start gap-2.5 text-sm text-[#5c6b70] cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-[#d5dfdd] bg-[#eef2f1] accent-[#101820]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-[#216f9e] hover:text-[#3f86b2]">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#216f9e] hover:text-[#3f86b2]">
              Privacy Policy
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-[#101820] hover:bg-[#263746] disabled:opacity-60 disabled:cursor-not-allowed text-[#101820] font-medium transition-colors shadow-lg shadow-[#9bd8c7]/25"
        >
          {loading ? "Creating your ID..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#5c6b70]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#216f9e] hover:text-[#3f86b2] font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
