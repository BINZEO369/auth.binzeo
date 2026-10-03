"use client";

import Link from "next/link";

export default function Hero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16">
      {/* ============================================================ */}
      {/*  FIXED BACKGROUND IMAGE — img7                               */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/img7.jpg')",
          backgroundColor: "#0a0a0a",
        }}
      />

      {/* Layer 1 — vertical gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.42) 35%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Layer 2 — radial vignette (focus center) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 45%, transparent 0%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Layer 3 — top fade for navbar blend */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-32 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }}
      />

      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style jsx global>{`
        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(26px);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes hero-word-in {
          from {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes hero-underline {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
        @keyframes hero-pulse {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes hero-glow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.06);
          }
        }
      `}</style>

      {/* ============================================================ */}
      {/*  AMBIENT GLOW (subtle, behind content)                        */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] -z-10 pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 60%)",
          animation: "hero-glow 6s ease-in-out infinite",
        }}
      />

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center text-white">
        {/* ---------- Status badge ---------- */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/85 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.14em] mb-8"
          style={{
            animation:
              "hero-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-white"
            style={{ animation: "hero-pulse 2.2s ease-in-out infinite" }}
          />
          Now available for everyone
        </div>

        {/* ---------- Headline ---------- */}
        <h1 className="text-[40px] leading-[1.05] sm:text-[62px] sm:leading-[1.03] lg:text-[78px] lg:leading-[1.01] font-semibold tracking-[-0.045em] mb-6">
          {["Your", "Digital", "Identity,"].map((word, i) => (
            <span
              key={word}
              className="inline-block"
              style={{
                animation: `hero-word-in 0.95s cubic-bezier(0.22, 1, 0.36, 1) ${
                  0.18 + i * 0.11
                }s both`,
              }}
            >
              {word}
              {i < 2 && "\u00A0"}
            </span>
          ))}
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          <span
            className="inline-block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
            style={{
              animation:
                "hero-word-in 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both",
            }}
          >
            Reimagined
          </span>
        </h1>

        {/* ---------- Underline accent ---------- */}
        <div
          className="mx-auto h-[2px] w-14 rounded-full bg-gradient-to-r from-transparent via-white to-transparent origin-center mb-8"
          style={{
            animation:
              "hero-underline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.72s both",
          }}
        />

        {/* ---------- Subtitle ---------- */}
        <p
          className="max-w-2xl mx-auto text-[15px] sm:text-[16.5px] leading-relaxed text-white/70 mb-10 sm:mb-12"
          style={{
            animation:
              "hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both",
          }}
        >
          Create, manage, and share your secure digital identity with Binzeo
          ID. One account — endless possibilities with a single{" "}
          <span className="inline-block font-mono text-[12px] sm:text-[13px] text-white/95 bg-white/[0.08] px-2.5 py-1 rounded-lg border border-white/12 backdrop-blur-md">
            BZ-U-XXXXXX
          </span>{" "}
          ID.
        </p>

        {/* ---------- CTA Buttons ---------- */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 sm:mb-16"
          style={{
            animation:
              "hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.05s both",
          }}
        >
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black text-[14.5px] transition-all duration-500 hover:bg-white/95 hover:shadow-[0_22px_60px_-14px_rgba(255,255,255,0.55)] hover:-translate-y-0.5"
            >
              Open Dashboard
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black text-[14.5px] transition-all duration-500 hover:bg-white/95 hover:shadow-[0_22px_60px_-14px_rgba(255,255,255,0.55)] hover:-translate-y-0.5"
              >
                Create your ID
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                href="/signin"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-xl px-8 py-4 font-medium text-white text-[14.5px] transition-all duration-500 hover:bg-white/[0.14] hover:border-white/45 hover:-translate-y-0.5"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* ---------- Stats ---------- */}
        <div
          className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto"
          style={{
            animation:
              "hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.25s both",
          }}
        >
          {[
            { value: "BZ-U", label: "Unique ID Format" },
            { value: "256-bit", label: "Encryption" },
            { value: "24/7", label: "Availability" },
          ].map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-white/12 bg-white/[0.05] backdrop-blur-xl px-3 py-5 sm:px-5 sm:py-6 transition-all duration-500 hover:bg-white/[0.09] hover:border-white/20"
            >
              <div className="text-[20px] sm:text-[26px] font-semibold tracking-tight text-white leading-none">
                {stat.value}
              </div>
              <div className="text-[9.5px] sm:text-[10.5px] text-white/50 mt-2 uppercase tracking-[0.14em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  BOTTOM FADE (blend into next section)                        */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24 -z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </section>
  );
}
