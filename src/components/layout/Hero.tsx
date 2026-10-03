import Link from "next/link";

export default function Hero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden w-full min-h-[100dvh] flex items-center justify-center">
      {/* ============================================================ */}
      {/*  FIXED BACKGROUND IMAGE — img7                                */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/img7.jpg')",
          backgroundColor: "#000",
        }}
      />

      {/* Dark overlay for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.70) 100%)",
        }}
      />

      {/* Radial vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Ambient glow accents */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[720px] -z-10 pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 65%)",
          animation: "bn-hero-breathe 5s ease-in-out infinite",
        }}
      />

      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style jsx>{`
        @keyframes bn-hero-breathe {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.08); }
        }
        @keyframes bn-fade-up {
          from { opacity: 0; transform: translateY(24px); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes bn-word-in {
          from { opacity: 0; transform: translateY(28px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes bn-underline {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes bn-pulse-soft {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.15); }
        }
      `}</style>

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <div
          className="mx-auto max-w-4xl rounded-[36px] border border-white/12 bg-white/[0.05] backdrop-blur-2xl shadow-[0_40px_100px_-32px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.15)] px-6 py-14 sm:px-12 sm:py-20 text-center text-white"
          style={{
            animation: "bn-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/80 text-[11px] sm:text-[12px] uppercase tracking-[0.12em] mb-8"
            style={{
              animation: "bn-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-white"
              style={{ animation: "bn-pulse-soft 2s ease-in-out infinite" }}
            />
            Now available for everyone
          </div>

          {/* Headline — word-by-word reveal */}
          <h1 className="text-[42px] sm:text-[64px] lg:text-[76px] font-semibold tracking-[-0.045em] leading-[1.02] mb-7">
            {["Your", "Digital", "Identity,"].map((word, i) => (
              <span
                key={word}
                className="inline-block"
                style={{
                  animation: `bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                    0.15 + i * 0.12
                  }s both`,
                }}
              >
                {word}
                {i < 2 && "\u00A0"}
              </span>
            ))}
            <br />
            <span
              className="inline-block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
              style={{
                animation:
                  "bn-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.51s both",
              }}
            >
              Reimagined
            </span>
          </h1>

          {/* Underline accent */}
          <div
            className="mx-auto h-[2px] w-16 bg-white/60 rounded-full origin-center mb-8"
            style={{
              animation:
                "bn-underline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both",
            }}
          />

          {/* Subtitle */}
          <p
            className="max-w-2xl mx-auto text-[15px] sm:text-[17px] text-white/70 leading-relaxed mb-10"
            style={{
              animation:
                "bn-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both",
            }}
          >
            Create, manage, and share your secure digital identity with Binzeo
            ID. One account — endless possibilities with a single{" "}
            <span className="font-mono text-[13px] text-white/90 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
              BZ-U-XXXXXX
            </span>{" "}
            ID.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
            style={{
              animation:
                "bn-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.05s both",
            }}
          >
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(255,255,255,0.5)] hover:-translate-y-0.5"
              >
                Open Dashboard
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-white px-7 py-3.5 font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(255,255,255,0.5)] hover:-translate-y-0.5"
                >
                  Create your ID
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-xl px-7 py-3.5 font-medium text-white transition-all duration-500 hover:bg-white/12 hover:border-white/40 hover:-translate-y-0.5"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-3 max-w-2xl mx-auto"
            style={{
              animation:
                "bn-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.25s both",
            }}
          >
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-3 py-4">
              <div className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-white">
                BZ-U
              </div>
              <div className="text-[10.5px] sm:text-[11px] text-white/55 mt-1 uppercase tracking-[0.12em]">
                Unique ID
              </div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-3 py-4">
              <div className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-white">
                256-bit
              </div>
              <div className="text-[10.5px] sm:text-[11px] text-white/55 mt-1 uppercase tracking-[0.12em]">
                Encryption
              </div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl px-3 py-4">
              <div className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-white">
                24/7
              </div>
              <div className="text-[10.5px] sm:text-[11px] text-white/55 mt-1 uppercase tracking-[0.12em]">
                Availability
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
