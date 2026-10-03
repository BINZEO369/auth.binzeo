import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

/* ================================================================== */
/*  Data                                                               */
/* ================================================================== */
const trustItems = [
  "One memorable ID",
  "Passkey ready",
  "Encrypted by default",
  "Location-verified",
  "Built for everyone",
  "Free forever",
];

const features = [
  {
    tag: "Mobile",
    title: "Your identity, always in pocket.",
    text: "Sign in from any device — one tap, one ID, zero friction. Passkey, biometric, or password — your choice.",
    image: "/images/img2.jpg",
    align: "left" as const,
  },
  {
    tag: "Security",
    title: "Protected like a vault.",
    text: "Enterprise-grade encryption, precise-location checks, and verified sessions keep your account safe — always.",
    image: "/images/img3.jpg",
    align: "right" as const,
  },
  {
    tag: "Global",
    title: "One ID. Everywhere you go.",
    text: "Your identity travels with you. Share only what you choose, with anyone, anywhere.",
    image: "/images/img4.jpg",
    align: "left" as const,
  },
  {
    tag: "Designed",
    title: "Beautiful by default.",
    text: "Every screen, every interaction — carefully crafted for how you actually live and work.",
    image: "/images/img5.jpg",
    align: "right" as const,
  },
];

const cinematicVideos = [
  {
    tag: "Real Life",
    title: "Designed for the moments that matter.",
    text: "From opening a bank account to meeting someone new — BINZEO is the calm, trusted layer beneath everything.",
    video: "/videos/vid2.mp4",
    poster: "/images/img6.jpg",
    align: "left" as const,
  },
  {
    tag: "Security",
    title: "Your data, wrapped in care.",
    text: "Every session verified. Every connection encrypted. Every action logged — but only for you.",
    video: "/videos/vid3.mp4",
    poster: "/images/img7.jpg",
    align: "right" as const,
  },
  {
    tag: "Global",
    title: "One ID. Every corner of the world.",
    text: "Verified access that travels with you. Share what matters. Keep what doesn't.",
    video: "/videos/vid4.mp4",
    poster: "/images/img8.jpg",
    align: "left" as const,
  },
];

const gallery = [
  { src: "/images/img9.jpg", label: "Your card" },
  { src: "/images/img10.jpg", label: "Verified" },
  { src: "/images/img11.jpg", label: "In motion" },
  { src: "/images/img12.jpg", label: "Connected" },
  { src: "/images/img13.jpg", label: "Protected" },
  { src: "/images/img14.jpg", label: "Timeless" },
];

const benefits = [
  {
    number: "01",
    title: "One identity",
    text: "A single BINZEO ID that holds your profile, contacts, and access details together.",
  },
  {
    number: "02",
    title: "Private by design",
    text: "Secure sessions, verified access, and controls that stay in your hands.",
  },
  {
    number: "03",
    title: "Ready to share",
    text: "Share the right information when you need it — without rebuilding your identity.",
  },
];

const steps = [
  { label: "Create", detail: "Set up your personal BINZEO ID in seconds." },
  { label: "Secure", detail: "Protect access with passkeys and biometrics." },
  { label: "Connect", detail: "Share and manage your identity with confidence." },
];

const stats = [
  { value: "BZ-U", label: "Unique ID" },
  { value: "256-bit", label: "Encryption" },
  { value: "24/7", label: "Availability" },
  { value: "0ms", label: "Setup wait" },
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
    <main className="relative w-full overflow-x-hidden bg-black text-white antialiased">
      {/* ============================================================ */}
      {/*  GLOBAL KEYFRAMES + FONT                                     */}
      {/* ============================================================ */}
      <style>{`
        @keyframes bz-fade-up {
          from { opacity: 0; transform: translateY(32px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes bz-word-in {
          from { opacity: 0; transform: translateY(40px); filter: blur(14px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes bz-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bz-scale-in {
          from { opacity: 0; transform: scale(1.15); filter: blur(20px); }
          to   { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes bz-underline {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        @keyframes bz-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.25); }
        }
        @keyframes bz-glow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.65; transform: scale(1.08); }
        }
        @keyframes bz-scroll {
          0%   { transform: translateY(0); opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: translateY(14px); opacity: 0; }
        }
        @keyframes bz-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes bz-kenburns {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50%      { transform: scale(1.10) translate(-1.5%, -1.5%); }
        }
        @keyframes bz-ambient {
          0%, 100% { opacity: 0.12; }
          50%      { opacity: 0.30; }
        }
        .bz-ease { transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>

      {/* ============================================================ */}
      {/*  HERO — Full-screen video + Identity card                    */}
      {/* ============================================================ */}
      <section className="relative min-h-[100dvh] w-full flex items-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: "url('/images/img1.jpg')",
              backgroundColor: "#000",
            }}
          />
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/img1.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/vid1.mp4" type="video/mp4" />
          </video>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.90) 100%)",
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
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
            animation: "bz-ambient 7s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div className="max-w-3xl">
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/85 text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.16em] mb-7"
                style={{
                  animation:
                    "bz-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-white"
                  style={{ animation: "bz-pulse 2.2s ease-in-out infinite" }}
                />
                Now available for everyone
              </div>

              <h1 className="text-[42px] leading-[1.02] sm:text-[68px] sm:leading-[1.0] lg:text-[88px] lg:leading-[0.96] font-semibold tracking-[-0.055em] mb-6">
                {["A", "calmer", "way", "to", "own"].map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className="inline-block"
                    style={{
                      animation: `bz-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                        0.15 + i * 0.08
                      }s both`,
                    }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
                <br />
                <span
                  className="inline-block bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent"
                  style={{
                    animation:
                      "bz-word-in 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both",
                  }}
                >
                  your digital identity.
                </span>
              </h1>

              <div
                className="h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-white to-transparent origin-left mb-7"
                style={{
                  animation:
                    "bz-underline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both",
                }}
              />

              <p
                className="max-w-xl text-[15px] sm:text-[17px] leading-relaxed text-white/75 mb-10"
                style={{
                  animation:
                    "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1s both",
                }}
              >
                BINZEO brings your profile, access, and connections into one
                secure space — so you can move through the digital world with
                less friction and more control.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-3 mb-12"
                style={{
                  animation:
                    "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.15s both",
                }}
              >
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_24px_60px_-14px_rgba(255,255,255,0.55)] hover:-translate-y-0.5"
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
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_24px_60px_-14px_rgba(255,255,255,0.55)] hover:-translate-y-0.5"
                    >
                      Create your BINZEO ID
                      <span className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                    <Link
                      href="/signin"
                      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-xl px-7 py-4 text-[14.5px] font-medium text-white transition-all duration-500 hover:bg-white/[0.14] hover:border-white/45 hover:-translate-y-0.5"
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
                    "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.3s both",
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

            {/* Identity Card */}
            <div
              className="relative mx-auto w-full max-w-md lg:ml-auto"
              style={{
                animation:
                  "bz-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute -inset-8 -z-10 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 70%)",
                  animation: "bz-glow 6s ease-in-out infinite",
                }}
              />

              <div
                className="relative overflow-hidden rounded-[36px] border border-white/15 p-7 sm:p-8"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
                  backdropFilter: "blur(40px) saturate(180%)",
                  WebkitBackdropFilter: "blur(40px) saturate(180%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.20), 0 50px 120px -40px rgba(0,0,0,0.9), 0 10px 30px -14px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  }}
                />

                <div className="relative flex items-center justify-between border-b border-white/12 pb-5">
                  <div>
                    <p className="text-[10.5px] tracking-[0.18em] text-white/45 uppercase">
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
                      "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 12px 32px -14px rgba(0,0,0,0.6)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-black shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)]">
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
                        animation: "bz-pulse 2.4s ease-in-out infinite",
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
                style={{ animation: "bz-scroll 2s ease-in-out infinite" }}
              />
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TRUST MARQUEE                                                */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden border-y border-white/8 bg-black py-7">
        <div
          className="flex gap-20 whitespace-nowrap"
          style={{ animation: "bz-marquee 32s linear infinite" }}
        >
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex gap-20">
              {trustItems.map((item, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="flex items-center gap-3 text-[14px] font-medium tracking-[-0.01em] text-white/45"
                >
                  <span className="text-white/80">✦</span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURE SECTIONS — image + glass content                     */}
      {/* ============================================================ */}
      {features.map((f, idx) => (
        <section
          key={f.tag}
          className="relative w-full min-h-[100dvh] flex items-center overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('${f.image}')`,
              backgroundColor: "#000",
              animation: "bz-kenburns 24s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                f.align === "left"
                  ? "linear-gradient(90deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0.05) 100%)"
                  : "linear-gradient(270deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0.05) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.50) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.70) 100%)",
            }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
            <div
              className={`flex ${
                f.align === "left" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className="max-w-xl"
                style={{
                  animation: `bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) ${
                    idx * 0.05
                  }s both`,
                }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-[10.5px] font-medium uppercase tracking-[0.18em] mb-6">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/80"
                    style={{
                      animation: `bz-pulse ${2 + idx * 0.2}s ease-in-out infinite`,
                    }}
                  />
                  {f.tag}
                </div>

                <h2 className="text-[38px] sm:text-[58px] lg:text-[70px] leading-[1.02] font-semibold tracking-[-0.05em] text-white mb-6">
                  {f.title}
                </h2>

                <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/75 max-w-lg">
                  {f.text}
                </p>

                <div className="mt-9 h-[2px] w-16 rounded-full bg-gradient-to-r from-white to-transparent" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ============================================================ */}
      {/*  CINEMATIC VIDEO SECTIONS                                     */}
      {/* ============================================================ */}
      {cinematicVideos.map((v, idx) => (
        <section
          key={v.tag}
          className="relative w-full min-h-[100dvh] flex items-center overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-center bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url('${v.poster}')`,
                backgroundColor: "#000",
              }}
            />
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

          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                idx % 2 === 0
                  ? "linear-gradient(90deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.60) 45%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0.05) 100%)"
                  : "linear-gradient(270deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.60) 45%, rgba(0,0,0,0.15) 80%, rgba(0,0,0,0.05) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.50) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)",
              animation: "bz-ambient 8s ease-in-out infinite",
            }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
            <div
              className={`flex ${
                idx % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-[10.5px] font-medium uppercase tracking-[0.18em] mb-6">
                  {v.tag}
                </div>

                <h2 className="text-[38px] sm:text-[58px] lg:text-[70px] leading-[1.02] font-semibold tracking-[-0.05em] text-white mb-6">
                  {v.title}
                </h2>

                <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/75 max-w-lg">
                  {v.text}
                </p>

                <div className="mt-9 h-[2px] w-16 rounded-full bg-gradient-to-r from-white to-transparent" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ============================================================ */}
      {/*  GALLERY — 3-column image grid                                */}
      {/* ============================================================ */}
      <section className="relative w-full px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/70 text-[10.5px] font-medium uppercase tracking-[0.18em] mb-5">
              A closer look
            </div>
            <h2 className="text-[38px] sm:text-[58px] leading-[1.04] font-semibold tracking-[-0.05em] text-white">
              Every detail, considered.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g, i) => (
              <div
                key={g.label}
                className="group relative aspect-square overflow-hidden rounded-[28px] border border-white/12"
                style={{
                  animation: `bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                    i * 0.08
                  }s both`,
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 30px 70px -30px rgba(0,0,0,0.75)",
                }}
              >
                <img
                  src={g.src}
                  alt={g.label}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-60"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 flex items-center justify-between">
                  <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/85">
                    {g.label}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-xl text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY BINZEO — glass cards on img15                            */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/img15.jpg')",
            backgroundColor: "#000",
            animation: "bz-kenburns 26s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        <div
          id="why-binzeo"
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24"
        >
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/70 text-[10.5px] font-medium uppercase tracking-[0.18em] mb-5">
              The BINZEO difference
            </div>
            <h2 className="text-[38px] sm:text-[58px] leading-[1.04] font-semibold tracking-[-0.05em] text-white">
              Less noise. More control.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((b, i) => (
              <article
                key={b.number}
                className="group relative overflow-hidden rounded-3xl border border-white/15 p-7 transition-all duration-500 hover:-translate-y-1.5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.16), 0 30px 70px -30px rgba(0,0,0,0.85)",
                  animation: `bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                    0.1 + i * 0.1
                  }s both`,
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.14), transparent 60%)",
                  }}
                />

                <div className="relative flex items-center justify-between text-[13px] text-white/60">
                  <span className="font-mono">{b.number}</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </div>

                <h3 className="relative mt-16 text-[24px] font-medium tracking-[-0.02em] text-white">
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
      {/*  HOW IT WORKS — glass tiles on img16                          */}
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
              "linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        <div
          id="how-it-works"
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24"
        >
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-white/70 text-[10.5px] font-medium uppercase tracking-[0.18em] mb-5">
                A simple beginning
              </div>
              <h2 className="text-[38px] sm:text-[58px] leading-[1.04] font-semibold tracking-[-0.05em] text-white">
                Start with one ID.
                <br />
                Go anywhere.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-3xl border border-white/15 p-6 transition-all duration-500 hover:-translate-y-1.5"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
                    backdropFilter: "blur(28px) saturate(180%)",
                    WebkitBackdropFilter: "blur(28px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 24px 60px -24px rgba(0,0,0,0.8)",
                    animation: `bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                      0.15 + i * 0.1
                    }s both`,
                  }}
                >
                  <span className="text-[12px] font-mono text-white/55">
                    0{i + 1}
                  </span>
                  <h3 className="mt-12 text-[18px] font-medium text-white">
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
      {/*  STATS — glass strip on img17                                 */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden">
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
              "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.90) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="rounded-3xl border border-white/15 p-7 text-center transition-all duration-500 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
                  backdropFilter: "blur(32px) saturate(180%)",
                  WebkitBackdropFilter: "blur(32px) saturate(180%)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 30px 70px -30px rgba(0,0,0,0.85)",
                  animation: `bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${
                    i * 0.08
                  }s both`,
                }}
              >
                <div className="text-[38px] sm:text-[46px] font-semibold tracking-[-0.03em] text-white leading-none">
                  {s.value}
                </div>
                <div className="mt-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CLOSING VIDEO — vid5                                          */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: "url('/images/img18.jpg')",
              backgroundColor: "#000",
            }}
          />
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/img18.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/vid5.mp4" type="video/mp4" />
          </video>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.90) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-[10.5px] font-medium uppercase tracking-[0.18em] mb-7">
            A quiet kind of confidence
          </div>

          <h2 className="text-[40px] sm:text-[64px] lg:text-[76px] leading-[1.02] font-semibold tracking-[-0.055em] text-white mb-7">
            Your identity,
            <br />
            <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
              beautifully yours.
            </span>
          </h2>

          <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/70 max-w-2xl mx-auto">
            Simple, secure, and always in your control.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA — img19                                            */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[90dvh] flex items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/img19.jpg')",
            backgroundColor: "#000",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.90) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        <div
          id="security"
          className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-24 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-xl text-white/85 text-[10.5px] font-medium uppercase tracking-[0.18em] mb-7">
            Built for your next chapter
          </div>

          <h2 className="text-[36px] sm:text-[58px] lg:text-[72px] leading-[1.04] font-semibold tracking-[-0.055em] text-white mb-7">
            Your identity should open doors,{" "}
            <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
              not create more work.
            </span>
          </h2>

          <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/70 max-w-2xl mx-auto mb-11">
            Join thousands of members already using BINZEO to own their
            digital identity with calm, security, and control.
          </p>

          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_26px_70px_-14px_rgba(255,255,255,0.6)] hover:-translate-y-0.5"
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
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[14.5px] font-semibold text-black transition-all duration-500 hover:bg-white/95 hover:shadow-[0_26px_70px_-14px_rgba(255,255,255,0.6)] hover:-translate-y-0.5"
            >
              Open your dashboard
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
        </div>
      </section>

      <div className="h-24 bg-black" />
    </main>
  );
}
