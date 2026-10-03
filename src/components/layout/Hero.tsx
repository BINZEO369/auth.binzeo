import Image from "next/image";
import Link from "next/link";

export default function Hero({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden min-h-[100dvh] flex items-center">
      {/* ============================================================ */}
      {/*  FIXED BACKGROUND IMAGE — img5.jpg                            */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/img5.jpg')",
          backgroundColor: "#0a0a0a",
        }}
      />

      {/* Dark gradient overlay for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Radial vignette for focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.40) 100%)",
        }}
      />

      {/* ============================================================ */}
      {/*  AMBIENT FLOATING GLASS BLOBS                                 */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute top-[15%] left-[8%] w-[180px] h-[180px] rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl"
          style={{
            animation: "bn-hero-float-1 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[60%] right-[10%] w-[140px] h-[140px] rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl"
          style={{
            animation: "bn-hero-float-2 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[15%] w-[100px] h-[100px] rounded-full border border-white/8 bg-white/[0.02] backdrop-blur-xl"
          style={{
            animation: "bn-hero-float-3 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style jsx>{`
        @keyframes bn-hero-float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -30px) rotate(8deg); }
        }
        @keyframes bn-hero-float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-25px, 25px) rotate(-6deg); }
        }
        @keyframes bn-hero-float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(15px, -20px) rotate(10deg); }
        }
        @keyframes bn-hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(28px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes bn-hero-fade-scale {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes bn-hero-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes bn-hero-badge-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 24px 4px rgba(255,255,255,0.10); }
        }
        @keyframes bn-hero-shine {
          0% { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(220%) skewX(-20deg); }
        }
        .bn-hero-shine-btn {
          position: relative;
          overflow: hidden;
        }
        .bn-hero-shine-btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: translateX(-120%) skewX(-20deg);
          pointer-events: none;
        }
        .bn-hero-shine-btn:hover::after {
          animation: bn-hero-shine 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {/* ============================================================ */}
      {/*  CONTENT — LIQUID GLASS CARD                                  */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div
          className="relative w-full rounded-[36px] border border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.15)] px-6 py-12 sm:px-12 sm:py-16 text-center overflow-hidden"
          style={{
            animation:
              "bn-hero-fade-scale 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          {/* Inner top sheen */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />

          {/* Top-left inner glow */}
          <div
            aria-hidden="true"
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 60%)",
            }}
          />
          {/* Bottom-right inner glow */}
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)",
            }}
          />

          {/* ============================================================ */}
          {/*  BADGE                                                        */}
          {/* ============================================================ */}
          <div
            className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/85 text-xs sm:text-[13px] font-medium tracking-tight"
            style={{
              animation:
                "bn-hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both, bn-hero-badge-glow 3s ease-in-out 1.2s infinite",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-white/90"
              style={{
                animation: "bn-hero-pulse-dot 2s ease-in-out infinite",
              }}
            />
            Now available for everyone
          </div>

          {/* ============================================================ */}
          {/*  HEADING                                                      */}
          {/* ============================================================ */}
          <h1 className="mt-7 text-[38px] sm:text-[62px] lg:text-[78px] font-semibold tracking-[-0.04em] leading-[1.02] text-white">
            <span
              className="inline-block"
              style={{
                animation:
                  "bn-hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
              }}
            >
              Your Digital Identity,
            </span>
            <br />
            <span
              className="inline-block bg-gradient-to-r from-white via-white/85 to-white/60 bg-clip-text text-transparent"
              style={{
                animation:
                  "bn-hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
              }}
            >
              Reimagined
            </span>
          </h1>

          {/* ============================================================ */}
          {/*  SUBTITLE                                                     */}
          {/* ============================================================ */}
          <p
            className="mt-7 max-w-2xl mx-auto text-[15px] sm:text-[17px] leading-relaxed text-white/70"
            style={{
              animation:
                "bn-hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both",
            }}
          >
            Create, manage, and share your secure digital identity with Binzeo
            ID. One account — endless possibilities with a single{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.08] border border-white/15 font-mono text-[12.5px] text-white/90 tracking-tight">
              BZ-U-XXXXXX
            </span>{" "}
            ID.
          </p>

          {/* ============================================================ */}
          {/*  CTA BUTTONS                                                  */}
          {/* ============================================================ */}
          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{
              animation:
                "bn-hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both",
            }}
          >
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bn-hero-shine-btn group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_rgba(255,255,255,0.5)]"
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
                  className="bn-hero-shine-btn group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_rgba(255,255,255,0.5)]"
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
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.05] backdrop-blur-xl px-7 py-3.5 text-[14.5px] font-medium text-white transition-all duration-500 hover:bg-white/[0.10] hover:border-white/35 hover:-translate-y-0.5"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* ============================================================ */}
          {/*  STATS ROW                                                    */}
          {/* ============================================================ */}
          <div
            className="mt-14 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
            style={{
              animation:
                "bn-hero-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both",
            }}
          >
            {[
              { value: "BZ-U", label: "Unique ID Format" },
              { value: "256-bit", label: "Encryption" },
              { value: "24/7", label: "Availability" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`relative px-2 sm:px-4 py-3 sm:py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.06] hover:border-white/20 ${
                  i === 1 ? "sm:border-x" : ""
                }`}
              >
                <div className="text-[20px] sm:text-[28px] font-semibold text-white tracking-[-0.02em]">
                  {stat.value}
                </div>
                <div className="mt-1 text-[10.5px] sm:text-[12px] uppercase tracking-[0.10em] text-white/55">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
