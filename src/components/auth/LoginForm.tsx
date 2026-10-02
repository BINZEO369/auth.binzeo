"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message ?? "Login failed");
        setLoading(false);
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#d5dfdd] bg-white/90 backdrop-blur p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101820] mb-2">Welcome back</h1>
        <p className="text-sm text-[#5c6b70]">
          Sign in to continue to your Binzeo ID
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-[#efb8b0] bg-[#fbe5e2] text-[#b84f4b] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-[#35454c]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#216f9e] hover:text-[#3f86b2]"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[#d5dfdd] bg-[#eef2f1] text-[#101820] placeholder-gray-600 focus:outline-none focus:border-[#79b9d5] focus:ring-2 focus:ring-[#79b9d5]/30 transition-colors"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-[#101820] hover:bg-[#263746] disabled:opacity-60 disabled:cursor-not-allowed text-[#101820] font-medium transition-colors shadow-lg shadow-[#9bd8c7]/25"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#5c6b70]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#216f9e] hover:text-[#3f86b2] font-medium"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
