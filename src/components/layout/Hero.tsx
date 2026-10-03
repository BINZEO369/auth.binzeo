import Link from "next/link";

export default function Hero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* ============================================================ */}
      {/*  FULL-SCREEN BACKGROUND IMAGE                                 */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/img7.jpg')",
          backgroundColor: "#0a0a0a",
        }}
      />

      {/* ============================================================ */}
      {/*  OVERLAYS — for legibility                                    */}
      {/* ============================================================ */}
      {/* Dark gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Radial vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 45%, transparent 0%, rgba(0,0,0,0.42) 100%)",
        }}
      />

      {/* ============================================================ */}
      {/*  AMBIENT GLOWS                                                */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 65%)",
          animation: "hero-halo 6s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
          animation: "hero-halo 8s ease-in-out 1s infinite reverse",
        }}
      />

      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style jsx>{`
        @keyframes hero-halo {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.9;  transform: scale(1.08); }
        }
        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(32px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes hero-badge-in {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes hero-word-in {
          from {
            opacity: 0;
            transform: translateY(36px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes hero-underline {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes hero-pulse {
          0%, 100% { opacity: 0.75; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.5); }
        }
        @keyframes hero-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        {/* ---------------- Status badge ---------------- */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-xs sm:text-sm mb-7"
          style={{
            animation:
              "hero-badge-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.15), 0 8px 24px -8px rgba(0,0,0,0.4)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-white"
            style={{ animation: "hero-pulse 2.4s ease-in-out infinite" }}
          />
          Now available for everyone
        </div>

        {/* ---------------- Headline ---------------- */}
        <h1 className="text-[44px] sm:text-[64px] lg:text-[76px] font-semibold tracking-[-0.045em] leading-[1.02] text-white mb-6">
          {["Your", "Digital"].map((word, i) => (
            <span
              key={word}
              className="inline-block"
              style={{
                animation: `hero-word-in 1s cubic-bezier(0.22, 1, 0.36, 1) ${
                  0.15 + i * 0.12
                }s both`,
              }}
            >
              {word}
              {"\u00A0"}
            </span>
          ))}
          <br />
          {["Identity,"].map((word) => (
            <span
              key={word}
              className="inline-block"
              style={{
                animation:
                  "hero-word-in 1s cubic-bezier(0.22, 1, 0.36, 1) 0.39s both",
              }}
            >
              {word}
              {"\u00A0"}
            </span>
          ))}
          <span
            className="inline-block bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
            style={{
              animation:
                "hero-word-in 1s cubic-bezier(0.22, 1, 0.36, 1) 0.51s both",
            }}
          >
            Reimagined
          </span>
        </h1>

        {/* ---------------- Underline accent ---------------- */}
        <div
          className="mx-auto my-7 h-[2px] w-20 bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full origin-center"
          style={{
            animation:
              "hero-underline 1s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both",
          }}
        />

        {/* ---------------- Subtitle ---------------- */}
        <p
          className="max-w-2xl mx-auto text-[15px] sm:text-[17px] text-white/75 leading-relaxed mb-10"
          style={{
            animation:
              "hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both",
          }}
        >
          Create, manage, and share your secure digital identity with Binzeo
          ID. One account — endless possibilities with a single{" "}
          <span className="font-mono text-white bg-white/10 border border-white/15 rounded-md px-1.5 py-0.5 text-[13px]">
            BZ-U-XXXXXX
          </span>{" "}
          ID.
        </p>

        {/* ---------------- CTA buttons (glass) ---------------- */}
        <div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{
            animation:
              "hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 1.05s both",
          }}
        >
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white text-black px-7 py-3.5 text-sm font-semibold transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(255,255,255,0.5)]"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,1), 0 10px 28px -10px rgba(0,0,0,0.5)",
              }}
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
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white text-black px-7 py-3.5 text-sm font-semibold transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(255,255,255,0.5)]"
                style={{
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,1), 0 10px 28px -10px rgba(0,0,0,0.5)",
                }}
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
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white px-7 py-3.5 text-sm font-medium transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/[0.14] hover:border-white/35"
                style={{
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.15), 0 8px 24px -8px rgba(0,0,0,0.4)",
                }}
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* ---------------- Stats (glass cards) ---------------- */}
        <div
          className="mt-16 sm:mt-20 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto"
          style={{
            animation:
              "hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 1.2s both",
          }}
        >
          {[
            { value: "BZ-U", label: "Unique ID Format" },
            { value: "256-bit", label: "Encryption" },
            { value: "24/7", label: "Availability" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/12 bg-white/[0.06] backdrop-blur-xl px-3 sm:px-4 py-5 transition-all duration-500 hover:bg-white/[0.10] hover:border-white/25 hover:-translate-y-0.5"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 8px 24px -10px rgba(0,0,0,0.4)",
                animation: `hero-float ${4 + i * 0.4}s ease-in-out ${
                  i * 0.3
                }s infinite`,
              }}
            >
              <div className="text-[20px] sm:text-[26px] font-semibold text-white tracking-[-0.02em]">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-[11.5px] text-white/55 mt-1.5 uppercase tracking-[0.08em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
