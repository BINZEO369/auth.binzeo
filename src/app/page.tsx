import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

/* ================================================================== */
/*  Content                                                            */
/* ================================================================== */
const benefits = [
  {
    number: "01",
    title: "One identity",
    text: "Create a single BINZEO ID that keeps your profile, contacts, and access details together.",
  },
  {
    number: "02",
    title: "Private by design",
    text: "Your account is built around secure sessions, verified access, and controls that stay in your hands.",
  },
  {
    number: "03",
    title: "Ready to share",
    text: "Share the right profile information when you need it, without rebuilding your identity every time.",
  },
];

const steps = [
  { label: "Create", detail: "Set up your personal BINZEO ID." },
  { label: "Secure", detail: "Protect access with modern authentication." },
  { label: "Connect", detail: "Manage and share your identity with confidence." },
];

/* ================================================================== */
/*  Page                                                               */
/* ================================================================== */
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  return (
    <>
      {/* ============================================================ */}
      {/*  FIXED BACKGROUND — img6                                      */}
      {/*  Rendered OUTSIDE main so main's transparent bg doesn't       */}
      {/*  cover it. z-index: -20 keeps it behind everything.          */}
      {/* ============================================================ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/img6.jpg')",
          backgroundColor: "#000",
          zIndex: -20,
        }}
      />

      {/* Overlay 1 — vertical gradient */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.85) 100%)",
          zIndex: -15,
        }}
      />

      {/* Overlay 2 — radial vignette */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 40%, transparent 0%, rgba(0,0,0,0.45) 100%)",
          zIndex: -14,
        }}
      />

      {/* ============================================================ */}
      {/*  MAIN — no bg-black, transparent                              */}
      {/* ============================================================ */}
      <main className="relative w-full min-h-screen overflow-x-hidden text-white">
        {/* ============================================================ */}
        {/*  KEYFRAMES                                                    */}
        {/* ============================================================ */}
        <style>{`
          @keyframes hp-fade-up {
            from { opacity: 0; transform: translateY(28px); filter: blur(8px); }
            to   { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes hp-word-in {
            from { opacity: 0; transform: translateY(34px); filter: blur(10px); }
            to   { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes hp-underline {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }
          @keyframes hp-pulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50%      { opacity: 1; transform: scale(1.2); }
          }
          @keyframes hp-glow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50%      { opacity: 0.7; transform: scale(1.05); }
          }
        `}</style>

        {/* ============================================================ */}
        {/*  HERO                                                         */}
        {/* ============================================================ */}
        <section className="relative min-h-[100dvh] w-full flex items-center pt-24 pb-16">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
              {/* ---------- LEFT — Copy ---------- */}
              <div className="max-w-3xl">
                {/* Kicker badge */}
                <div
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/85 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.14em] mb-7"
                  style={{
                    animation:
                      "hp-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    style={{ animation: "hp-pulse 2.2s ease-in-out infinite" }}
                  />
                  Your identity, beautifully connected
                </div>

                {/* Headline */}
                <h1 className="text-[42px] leading-[1.02] sm:text-[64px] sm:leading-[1.0] lg:text-[80px] lg:leading-[0.98] font-semibold tracking-[-0.05em] mb-6">
                  {["A", "calmer", "way", "to", "own"].map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      className="inline-block"
                      style={{
                        animation: `hp-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                          0.15 + i * 0.09
                        }s both`,
                      }}
                    >
                      {word}&nbsp;
                    </span>
                  ))}
                  <br />
                  <span
                    className="inline-block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
                    style={{
                      animation:
                        "hp-word-in 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both",
                    }}
                  >
                    your digital identity.
                  </span>
                </h1>

                {/* Underline accent */}
                <div
                  className="h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-white to-transparent origin-left mb-7"
                  style={{
                    animation:
                      "hp-underline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both",
                  }}
                />

                {/* Paragraph */}
                <p
                  className="max-w-xl text-[15px] sm:text-[17px] leading-relaxed text-white/70 mb-9"
                  style={{
                    animation:
                      "hp-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.05s both",
                  }}
                >
                  BINZEO brings your profile, access, and connections into one
                  secure space — so you can move through the digital world with
                  less friction.
                </p>

                {/* CTA buttons */}
                <div
                  className="flex flex-col sm:flex-row gap-3 mb-12"
                  style={{
                    animation:
                      "hp-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.2s both",
                  }}
                >
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_20px_50px_-14px_rgba(255,255,255,0.5)] hover:-translate-y-0.5"
                    >
                      Open your dashboard
                      <span className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_20px_50px_-14px_rgba(255,255,255,0.5)] hover:-translate-y-0.5"
                      >
                        Create your BINZEO ID
                        <span className="transition-transform duration-500 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                      <Link
                        href="/signin"
                        className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-xl px-7 py-3.5 text-[14.5px] font-medium text-white transition-all duration-500 hover:bg-white/[0.14] hover:border-white/45 hover:-translate-y-0.5"
                      >
                        I already have an ID
                      </Link>
                    </>
                  )}
                </div>

                {/* Feature ticks */}
                <div
                  className="flex flex-wrap gap-x-7 gap-y-3 text-[12.5px] text-white/50"
                  style={{
                    animation:
                      "hp-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.35s both",
                  }}
                >
                  {["Personal profile", "Secure access", "One memorable ID"].map(
                    (item) => (
                      <span key={item} className="flex items-center gap-2">
                        <span className="text-white/80">✦</span>
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* ---------- RIGHT — Identity Card ---------- */}
              <div
                className="relative mx-auto w-full max-w-md lg:ml-auto"
                style={{
                  animation:
                    "hp-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both",
                }}
              >
                {/* Ambient glow behind card */}
                <div
                  aria-hidden="true"
                  className="absolute -inset-8 -z-10 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)",
                    animation: "hp-glow 6s ease-in-out infinite",
                  }}
                />

                {/* Main card */}
                <div
                  className="relative overflow-hidden rounded-[32px] border border-white/15 p-6 sm:p-7"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
                    backdropFilter: "blur(32px) saturate(180%)",
                    WebkitBackdropFilter: "blur(32px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.18), 0 40px 100px -32px rgba(0,0,0,0.85), 0 8px 24px -12px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Top sheen */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                    }}
                  />

                  {/* Header */}
                  <div className="relative flex items-center justify-between border-b border-white/12 pb-5">
                    <div>
                      <p className="text-[10.5px] tracking-[0.16em] text-white/45 uppercase">
                        Your identity
                      </p>
                      <p className="mt-1.5 text-[15px] font-medium text-white">
                        A profile that feels like you.
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                  </div>

                  {/* Inner identity mini-card */}
                  <div
                    className="relative mt-6 rounded-2xl border border-white/12 p-5"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      boxShadow:
                        "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 12px 32px -14px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-black shadow-[0_8px_24px_-8px_rgba(255,255,255,0.4)]">
                        B
                      </div>
                      <div>
                        <p className="text-[15px] font-medium text-white">
                          BINZEO member
                        </p>
                        <p className="mt-1 font-mono text-[11.5px] text-white/60">
                          BZ-U-XXXXXX
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                        <p className="text-[9.5px] tracking-[0.14em] text-white/45 uppercase">
                          Status
                        </p>
                        <p className="mt-1.5 text-[13px] text-white">
                          Protected
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
                        <p className="text-[9.5px] tracking-[0.14em] text-white/45 uppercase">
                          Access
                        </p>
                        <p className="mt-1.5 text-[13px] text-white">
                          Always yours
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative mt-5 flex items-center justify-between text-[11.5px] text-white/45">
                    <span>Simple on the surface</span>
                    <span className="flex items-center gap-1.5 text-white/70">
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-white/80"
                        style={{
                          animation: "hp-pulse 2.4s ease-in-out infinite",
                        }}
                      />
                      Built for trust
                    </span>
                  </div>
                </div>

                {/* Floating badge */}
                <div
                  className="absolute -bottom-6 -left-5 hidden sm:block rounded-2xl border border-white/15 px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.15), 0 16px 40px -16px rgba(0,0,0,0.7)",
                    animation:
                      "hp-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both",
                  }}
                >
                  <p className="text-[9.5px] tracking-[0.16em] text-white/45 uppercase">
                    One account
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-white">
                    Endless possibilities
                  </p>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div
              className="mt-16 flex items-center justify-between text-[11.5px] text-white/40"
              style={{
                animation:
                  "hp-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.5s both",
              }}
            >
              <span>Scroll to explore</span>
              <span className="hidden items-center gap-2.5 sm:flex">
                <span className="h-px w-12 bg-white/25" />
                Digital identity, reimagined
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  SECTION · WHY BINZEO                                        */}
        {/* ============================================================ */}
        <section
          id="why-binzeo"
          className="relative w-full px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/70 text-[10.5px] font-medium uppercase tracking-[0.16em] mb-5">
                The BINZEO difference
              </div>
              <h2 className="text-[38px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-0.045em] text-white">
                Less noise. More control.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] sm:text-[16.5px] leading-relaxed text-white/60">
                Everything you need to show up online with a clear, secure, and
                unmistakably personal identity.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {benefits.map((b, i) => (
                <article
                  key={b.number}
                  className="group relative overflow-hidden rounded-3xl border border-white/12 p-6 sm:p-7 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
                    backdropFilter: "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 20px 48px -24px rgba(0,0,0,0.7)",
                    animation: `hp-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                      0.1 + i * 0.1
                    }s both`,
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.10), transparent 60%)",
                    }}
                  />

                  <div className="relative flex items-center justify-between text-[13px] text-white/60">
                    <span className="font-mono">{b.number}</span>
                    <span className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </div>

                  <h3 className="relative mt-14 text-[22px] font-medium tracking-[-0.02em] text-white">
                    {b.title}
                  </h3>
                  <p className="relative mt-3 text-[13.5px] leading-relaxed text-white/55">
                    {b.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  SECTION · HOW IT WORKS                                       */}
        {/* ============================================================ */}
        <section
          id="how-it-works"
          className="relative w-full overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
        >
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/70 text-[10.5px] font-medium uppercase tracking-[0.16em] mb-5">
                A simple beginning
              </div>
              <h2 className="text-[38px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-0.045em] text-white">
                Start with one ID. Go anywhere.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-3xl border border-white/12 p-5 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 16px 40px -20px rgba(0,0,0,0.7)",
                    animation: `hp-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                      0.15 + i * 0.1
                    }s both`,
                  }}
                >
                  <span className="text-[12px] font-mono text-white/55">
                    0{i + 1}
                  </span>
                  <h3 className="mt-10 text-[17px] font-medium text-white">
                    {s.label}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  SECTION · CTA / SECURITY                                    */}
        {/* ============================================================ */}
        <section
          id="security"
          className="relative w-full px-5 py-20 sm:px-8 lg:px-10"
        >
          <div
            className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 overflow-hidden rounded-[32px] border border-white/15 p-7 sm:p-10 lg:flex-row lg:items-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.16), 0 40px 100px -32px rgba(0,0,0,0.85)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              }}
            />

            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/70 text-[10.5px] font-medium uppercase tracking-[0.16em] mb-5">
                Built for your next chapter
              </div>
              <h2 className="text-[30px] sm:text-[44px] leading-[1.08] font-semibold tracking-[-0.04em] text-white">
                Your identity should open doors, not create more work.
              </h2>
            </div>

            {!isLoggedIn && (
              <Link
                href="/signup"
                className="group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_20px_50px_-14px_rgba(255,255,255,0.5)] hover:-translate-y-0.5"
              >
                Create your ID
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
          </div>
        </section>

        {/* Bottom spacer */}
        <div className="h-16" />
      </main>
    </>
  );
}
