import Link from "next/link";

export default function Hero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden">
      {/* ============================================================ */}
      {/*  FIXED BACKGROUND IMAGE                                       */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/img7.jpg')",
          backgroundColor: "#000",
        }}
      />

      {/* Dark gradient overlay for legibility */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.68) 100%)",
        }}
      />

      {/* Radial vignette for focus */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Ambient floating glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 left-1/4 w-[480px] h-[480px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
            animation: "bn-hero-glow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[420px] h-[420px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
            animation: "bn-hero-glow 10s ease-in-out 2s infinite reverse",
          }}
        />
      </div>

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-20 sm:py-24">
        <div
          className="w-full max-w-5xl rounded-[40px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.14)] px-6 py-14 sm:px-14 sm:py-20 text-white text-center"
          style={{
            animation: "bn-hero-in 1s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <style jsx>{`
            @keyframes bn-hero-in {
              from {
                opacity: 0;
                transform: translateY(36px) scale(0.96);
                filter: blur(12px);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
              }
            }
            @keyframes bn-hero-glow {
              0%, 100% { opacity: 0.35; transform: scale(1) translate(0, 0); }
              50%      { opacity: 0.7;  transform: scale(1.15) translate(20px, -15px); }
            }
            @keyframes bn-fade-up {
              from { opacity: 0; transform: translateY(24px); filter: blur(6px); }
              to   { opacity: 1; transform: translateY(0); filter: blur(0); }
            }
            @keyframes bn-pulse-dot {
              0%, 100% { opacity: 0.6; transform: scale(1); }
              50%      { opacity: 1; transform: scale(1.3); }
            }
          `}</style>

          {/* ---------- Badge ---------- */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-[12px] sm:text-[13px] text-white/85 tracking-wide"
            style={{
              animation: "bn-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-white"
              style={{ animation: "bn-pulse-dot 2s ease-in-out infinite" }}
            />
            Now available for everyone
          </div>

          {/* ---------- Title ---------- */}
          <h1
            className="mt-8 text-[42px] sm:text-[68px] lg:text-[84px] font-semibold tracking-[-0.045em] leading-[0.98]"
            style={{
              animation: "bn-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both",
            }}
          >
            Your Digital Identity,
            <br />
            <span className="bg-gradient-to-r from-white via-white/85 to-white/55 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          {/* ---------- Subtitle ---------- */}
          <p
            className="max-w-2xl mx-auto mt-7 text-[15px] sm:text-[17px] text-white/70 leading-relaxed"
            style={{
              animation: "bn-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both",
            }}
          >
            Create, manage, and share your secure digital identity with Binzeo
            ID. One account — endless possibilities with a single{" "}
            <span className="inline-block px-2 py-0.5 rounded-md font-mono text-[12.5px] text-white bg-white/10 border border-white/15 align-middle">
              BZ-U-XXXXXX
            </span>{" "}
            ID.
          </p>

          {/* ---------- CTA Buttons ---------- */}
          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{
              animation: "bn-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both",
            }}
          >
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/90 hover:shadow-[0_20px_48px_-12px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 sm:w-auto"
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
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/90 hover:shadow-[0_20px_48px_-12px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 sm:w-auto"
                >
                  Create your ID
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-xl px-7 py-4 text-[14.5px] font-medium text-white transition-all duration-500 hover:bg-white/[0.14] hover:border-white/40 hover:-translate-y-0.5 sm:w-auto"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* ---------- Stats ---------- */}
          <div
            className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
            style={{
              animation: "bn-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both",
            }}
          >
            <div className="py-4">
              <div className="text-[26px] sm:text-[34px] font-semibold text-white tracking-tight">
                BZ-U
              </div>
              <div className="text-[11px] sm:text-[12px] text-white/55 mt-1.5 uppercase tracking-[0.1em]">
                Unique ID Format
              </div>
            </div>
            <div className="border-x border-white/12 py-4">
              <div className="text-[26px] sm:text-[34px] font-semibold text-white tracking-tight">
                256-bit
              </div>
              <div className="text-[11px] sm:text-[12px] text-white/55 mt-1.5 uppercase tracking-[0.1em]">
                Encryption
              </div>
            </div>
            <div className="py-4">
              <div className="text-[26px] sm:text-[34px] font-semibold text-white tracking-tight">
                24/7
              </div>
              <div className="text-[11px] sm:text-[12px] text-white/55 mt-1.5 uppercase tracking-[0.1em]">
                Availability
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
