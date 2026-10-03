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
/*  Full-screen image sections                                         */
/* ================================================================== */
const imageSections = [
  {
    tag: "Mobile",
    title: "Your identity, always in pocket.",
    text: "Access your BINZEO ID from any device with a single tap — passkey, biometric, or password.",
    image: "/images/img8.jpg",
    align: "left" as const,
  },
  {
    tag: "Security",
    title: "Built with serious protection.",
    text: "Enterprise-grade encryption, verified sessions, and precise-location checks keep your account safe — always.",
    image: "/images/img9.jpg",
    align: "right" as const,
  },
  {
    tag: "Global",
    title: "One ID. Everywhere you go.",
    text: "Share your profile with anyone, anywhere. Your identity travels with you, secure and portable.",
    image: "/images/img10.jpg",
    align: "left" as const,
  },
  {
    tag: "Designed",
    title: "Beautiful by default.",
    text: "Every screen, every interaction — carefully crafted for how you actually live and work.",
    image: "/images/img11.jpg",
    align: "right" as const,
  },
];

/* ================================================================== */
/*  Full-screen video sections                                         */
/* ================================================================== */
const videoSections = [
  {
    tag: "Real Life",
    title: "Designed for the moments that matter.",
    text: "From opening a bank account to meeting someone new — your BINZEO ID is the calm, trusted layer beneath everything.",
    video: "/videos/vid2.mp4",
    poster: "/images/img12.jpg",
    align: "left" as const,
  },
  {
    tag: "Security",
    title: "Your data, wrapped in care.",
    text: "Every session is verified. Every connection encrypted. Every action logged — but only for you.",
    video: "/videos/vid3.mp4",
    poster: "/images/img13.jpg",
    align: "right" as const,
  },
  {
    tag: "Global",
    title: "One ID. Every corner of the world.",
    text: "Verified access that travels with you. Share what matters. Keep what doesn't.",
    video: "/videos/vid4.mp4",
    poster: "/images/img14.jpg",
    align: "left" as const,
  },
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
    <main className="relative w-full overflow-x-hidden bg-black text-white">
      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
      {/* ============================================================ */}
      <style>{`
        @keyframes hp-fade-up {
          from { opacity: 0; transform: translateY(30px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes hp-word-in {
          from { opacity: 0; transform: translateY(36px); filter: blur(12px); }
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
          50%      { opacity: 0.7; transform: scale(1.06); }
        }
        @keyframes hp-scroll {
          0%   { transform: translateY(0); opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        @keyframes hp-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes hp-kenburns {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50%      { transform: scale(1.08) translate(-1%, -1%); }
        }
        @keyframes hp-video-ambient {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 0.35; }
        }
      `}</style>

      {/* ============================================================ */}
      {/*  SECTION 1 · HERO — full-screen video                          */}
      {/* ============================================================ */}
      <section className="relative min-h-[100dvh] w-full flex items-center overflow-hidden pt-24 pb-16">
        {/* ---------- Video background layer ---------- */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {/* Poster (shows while video loads) */}
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: "url('/images/img7.jpg')",
              backgroundColor: "#000",
            }}
          />
          {/* Video on top of poster */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/img7.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/vid1.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ---------- Overlay layers ---------- */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 40%, rgba(0,0,0,0.88) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Ambient breathing glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
            animation: "hp-video-ambient 6s ease-in-out infinite",
          }}
        />

        {/* ---------- Content (top layer) ---------- */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div className="max-w-3xl">
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
                Now available for everyone
              </div>

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

              <div
                className="h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-white to-transparent origin-left mb-7"
                style={{
                  animation:
                    "hp-underline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both",
                }}
              />

              <p
                className="max-w-xl text-[15px] sm:text-[17px] leading-relaxed text-white/75 mb-9"
                style={{
                  animation:
                    "hp-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.05s both",
                }}
              >
                BINZEO brings your profile, access, and connections into one
                secure space — so you can move through the digital world with
                less friction.
              </p>

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

              <div
                className="flex flex-wrap gap-x-7 gap-y-3 text-[12.5px] text-white/55"
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

            {/* RIGHT — Identity Card */}
            <div
              className="relative mx-auto w-full max-w-md lg:ml-auto"
              style={{
                animation:
                  "hp-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute -inset-8 -z-10 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)",
                  animation: "hp-glow 6s ease-in-out infinite",
                }}
              />

              <div
                className="relative overflow-hidden rounded-[32px] border border-white/15 p-6 sm:p-7"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.18), 0 40px 100px -32px rgba(0,0,0,0.85), 0 8px 24px -12px rgba(0,0,0,0.5)",
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
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center gap-3 text-[11.5px] text-white/40">
            <span className="flex items-center gap-2.5">
              <span className="h-px w-12 bg-white/25" />
              Scroll to explore
              <span className="h-px w-12 bg-white/25" />
            </span>
            <span
              className="flex h-8 w-5 items-start justify-center rounded-full border border-white/25 p-1"
              aria-hidden="true"
            >
              <span
                className="h-1.5 w-1 rounded-full bg-white/70"
                style={{ animation: "hp-scroll 2s ease-in-out infinite" }}
              />
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MARQUEE                                                      */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden border-y border-white/8 py-6 bg-black">
        <div
          className="flex gap-16 whitespace-nowrap"
          style={{ animation: "hp-marquee 30s linear infinite" }}
        >
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex gap-16">
              {[
                "✦ Personal profile",
                "✦ Secure access",
                "✦ One memorable ID",
                "✦ Precise location verification",
                "✦ Passkey support",
                "✦ Enterprise-grade encryption",
                "✦ Built for everyone",
                "✦ Free forever",
              ].map((item, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="text-[14px] font-medium tracking-[-0.01em] text-white/45"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FULL-SCREEN IMAGE SECTIONS                                    */}
      {/* ============================================================ */}
      {imageSections.map((item, idx) => (
        <section
          key={item.tag}
          className="relative w-full min-h-[100dvh] flex items-center overflow-hidden"
        >
          {/* Image layer */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('${item.image}')`,
              backgroundColor: "#000",
              animation: "hp-kenburns 22s ease-in-out infinite",
            }}
          />

          {/* Overlays */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                item.align === "left"
                  ? "linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.20) 75%, rgba(0,0,0,0.10) 100%)"
                  : "linear-gradient(270deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.20) 75%, rgba(0,0,0,0.10) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.70) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
            <div
              className={`flex ${
                item.align === "left" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className="max-w-xl"
                style={{
                  animation: `hp-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) ${
                    idx * 0.05
                  }s both`,
                }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-[10.5px] font-medium uppercase tracking-[0.16em] mb-6">
                  {item.tag}
                </div>

                <h2 className="text-[38px] sm:text-[58px] lg:text-[68px] leading-[1.03] font-semibold tracking-[-0.045em] text-white mb-6">
                  {item.title}
                </h2>

                <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/75 max-w-lg">
                  {item.text}
                </p>

                <div className="mt-8 h-[2px] w-14 rounded-full bg-gradient-to-r from-white to-transparent" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ============================================================ */}
      {/*  FULL-SCREEN VIDEO SECTIONS                                    */}
      {/*  Structure: image poster (z-0) → video (z-0) → overlays (z-[1]) → content (z-10) */}
      {/* ============================================================ */}
      {videoSections.map((v, idx) => (
        <section
          key={v.tag}
          className="relative w-full min-h-[100dvh] flex items-center overflow-hidden"
        >
          {/* ---------- Background layer: poster + video stacked ---------- */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 overflow-hidden"
          >
            {/* Poster image (visible while video loads / if video fails) */}
            <div
              className="absolute inset-0 bg-center bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url('${v.poster}')`,
                backgroundColor: "#000",
              }}
            />

            {/* Video on top of poster */}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={v.poster}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={v.video} type="video/mp4" />
            </video>
          </div>

          {/* ---------- Overlay layers ---------- */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                idx % 2 === 0
                  ? "linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.60) 45%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0.05) 100%)"
                  : "linear-gradient(270deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.60) 45%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0.05) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          {/* Ambient breathing glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)",
              animation: "hp-video-ambient 7s ease-in-out infinite",
            }}
          />

          {/* ---------- Content ---------- */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
            <div
              className={`flex ${
                idx % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-[10.5px] font-medium uppercase tracking-[0.16em] mb-6">
                  {v.tag}
                </div>

                <h2 className="text-[38px] sm:text-[58px] lg:text-[68px] leading-[1.03] font-semibold tracking-[-0.045em] text-white mb-6">
                  {v.title}
                </h2>

                <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/75 max-w-lg">
                  {v.text}
                </p>

                <div className="mt-8 h-[2px] w-14 rounded-full bg-gradient-to-r from-white to-transparent" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ============================================================ */}
      {/*  WHY BINZEO — full-screen bg                                  */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/img15.jpg')",
            backgroundColor: "#000",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        <div
          id="why-binzeo"
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24"
        >
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/70 text-[10.5px] font-medium uppercase tracking-[0.16em] mb-5">
              The BINZEO difference
            </div>
            <h2 className="text-[38px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-0.045em] text-white">
              Less noise. More control.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((b, i) => (
              <article
                key={b.number}
                className="group relative overflow-hidden rounded-3xl border border-white/15 p-6 sm:p-7 transition-all duration-500 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                  backdropFilter: "blur(28px) saturate(180%)",
                  WebkitBackdropFilter: "blur(28px) saturate(180%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 24px 60px -24px rgba(0,0,0,0.75)",
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
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 60%)",
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
                <p className="relative mt-3 text-[13.5px] leading-relaxed text-white/65">
                  {b.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS — full-screen bg                                */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/img16.jpg')",
            backgroundColor: "#000",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        <div
          id="how-it-works"
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24"
        >
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
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
                  className="rounded-3xl border border-white/15 p-5 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 20px 48px -24px rgba(0,0,0,0.75)",
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
                  <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA — full-screen bg                                   */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[90dvh] flex items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/img17.jpg')",
            backgroundColor: "#000",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.88) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        <div
          id="security"
          className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-24 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-[10.5px] font-medium uppercase tracking-[0.16em] mb-7">
            Built for your next chapter
          </div>

          <h2 className="text-[36px] sm:text-[56px] lg:text-[68px] leading-[1.05] font-semibold tracking-[-0.045em] text-white mb-7">
            Your identity should open doors,{" "}
            <span className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
              not create more work.
            </span>
          </h2>

          <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/70 max-w-2xl mx-auto mb-10">
            Join thousands of members already using BINZEO to own their digital
            identity with calm, security, and control.
          </p>

          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_24px_60px_-14px_rgba(255,255,255,0.55)] hover:-translate-y-0.5"
              >
                Create your BINZEO ID
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/[0.06] backdrop-blur-xl px-8 py-4 text-[14.5px] font-medium text-white transition-all duration-500 hover:bg-white/[0.14] hover:border-white/50 hover:-translate-y-0.5"
              >
                I already have an ID
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_24px_60px_-14px_rgba(255,255,255,0.55)] hover:-translate-y-0.5"
            >
              Open your dashboard
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
        </div>
      </section>

      <div className="h-16 bg-black" />
    </main>
  );
}
