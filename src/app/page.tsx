লimport Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const trustItems = [
  "Encrypted by default",
  "Passkey ready",
  "Location-aware",
  "One memorable ID",
  "Built for everyone",
];

const featureCards = [
  {
    title: "Identity that grows with you",
    body: "Keep your profile, access and connections organised in one secure identity layer.",
    tone: "lavender",
  },
  {
    title: "Always private, always yours",
    body: "Choose what you share, when you share it, and keep control of every verified session.",
    tone: "ink",
  },
  {
    title: "Ready wherever you go",
    body: "A calm, reliable identity for work, community and the digital spaces you use every day.",
    tone: "ink",
  },
];

const useCases = [
  {
    label: "Personal identity",
    title: "Your digital self, beautifully organised.",
    image: "/images/img12.jpg",
  },
  {
    label: "Secure access",
    title: "A softer way to move through the internet.",
    image: "/images/img11.jpg",
  },
  {
    label: "Connected life",
    title: "Share the right details with confidence.",
    image: "/images/img20.jpg",
  },
];

/* ================================================================== */
/*  Partner / Brand logos (circular row under CTA)                     */
/* ================================================================== */
const partnerLogos = [
  { src: "/images/jabiyenlogo.png", alt: "Jabiyen" },
  { src: "/images/isyenlogo.png", alt: "Isyen" },
  { src: "/images/hiryenlogo.png", alt: "Hiryen" },
  { src: "/images/jayenwarelogo.png", alt: "Jayenware" },
  { src: "/images/binzeoorglogo.png", alt: "Binzeo Org" },
  { src: "/images/bcloudlogo.png", alt: "Bcloud" },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  return (
    <main className="reference-home">
      {/* ============================================================ */}
      {/*  HERO ANIMATION KEYFRAMES                                     */}
      {/* ============================================================ */}
      <style>{`
        @keyframes bz-fade-up {
          from { opacity: 0; transform: translateY(28px); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes bz-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bz-title-in {
          from { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(14px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes bz-logo-in {
          from { opacity: 0; transform: scale(0.9) translateY(20px); filter: blur(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes bz-kenburns {
          0%, 100% { transform: scale(1.05) translate(0, 0); }
          50%      { transform: scale(1.15) translate(-1.5%, -1%); }
        }
        @keyframes bz-phone-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes bz-badge-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes bz-ring-pulse {
          0%   { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <div className="reference-shell">
        {/* ============================================================ */}
        {/*  HERO BANNER — Pure img3.jpg + Text + Logos                   */}
        {/* ============================================================ */}
        <section
          className="reference-hero-banner"
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            minHeight: "100dvh",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/images/img3.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              animation: "bz-kenburns 28s ease-in-out infinite",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "clamp(20px, 4vw, 48px)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "clamp(40px, 6vh, 72px)",
                animation:
                  "bz-logo-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
              }}
            >
              <img
                src="/logo.svg"
                alt="BINZEO"
                style={{
                  height: "clamp(40px, 5vw, 64px)",
                  width: "auto",
                  maxWidth: "70vw",
                  display: "block",
                  margin: "0 auto",
                  filter:
                    "brightness(0) drop-shadow(0 4px 20px rgba(255,255,255,0.45))",
                }}
              />
            </div>

            <p
              style={{
                margin: "0 0 clamp(12px, 1.8vh, 22px)",
                fontSize: "clamp(16px, 1.6vw, 22px)",
                fontWeight: 400,
                color: "rgba(0,0,0,0.65)",
                letterSpacing: "-0.01em",
                animation:
                  "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
              }}
            >
              Own your
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(52px, 11vw, 168px)",
                lineHeight: 0.94,
                letterSpacing: "-0.06em",
                fontWeight: 600,
                color: "#0a0a0a",
                animation:
                  "bz-title-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
              }}
            >
              Identity
            </h1>

            <p
              style={{
                margin: "clamp(12px, 1.6vh, 22px) 0 0",
                fontSize: "clamp(18px, 2vw, 28px)",
                fontWeight: 400,
                color: "rgba(0,0,0,0.7)",
                letterSpacing: "-0.015em",
                animation:
                  "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both",
              }}
            >
              that feels like home.
            </p>

            <p
              style={{
                margin: "clamp(24px, 3.5vh, 40px) auto 0",
                maxWidth: "520px",
                fontSize: "clamp(13px, 1.15vw, 15px)",
                lineHeight: 1.6,
                color: "rgba(0,0,0,0.65)",
                animation:
                  "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both",
              }}
            >
              A quieter, safer way to hold your digital self. One secure
              identity for every part of your online life — built to feel
              simple on the surface.
            </p>

            <div
              style={{
                marginTop: "clamp(32px, 4.5vh, 52px)",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                animation:
                  "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.05s both",
              }}
            >
              <Link
                href={isLoggedIn ? "/dashboard" : "/signup"}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "16px 32px",
                  borderRadius: "999px",
                  background:
                    "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                  color: "#ffffff",
                  fontSize: "clamp(13px, 1.15vw, 15px)",
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 1px 2px rgba(0,0,0,0.2), 0 10px 28px -10px rgba(0,0,0,0.45)",
                  transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  overflow: "hidden",
                }}
              >
                {isLoggedIn ? "Open dashboard" : "Create your ID"}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div
              style={{
                marginTop: "clamp(48px, 7vh, 80px)",
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(10px, 1.6vw, 20px)",
                animation:
                  "bz-fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 1.3s both",
              }}
            >
              {partnerLogos.map((logo) => (
                <div
                  key={logo.alt}
                  style={{
                    width: "clamp(30px, 3vw, 42px)",
                    height: "clamp(30px, 3vw, 42px)",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,1), 0 6px 18px -8px rgba(0,0,0,0.15)",
                    padding: "clamp(5px, 0.6vw, 8px)",
                    flexShrink: 0,
                  }}
                  title={logo.alt}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                      filter: "grayscale(0.3) brightness(0.45)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  PHONE SHOWCASE — Authentication in a phone case              */}
        {/* ============================================================ */}
        <section
          className="reference-phone-showcase"
          style={{
            position: "relative",
            width: "100vw",
            minHeight: "100vh",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            padding: "clamp(64px, 10vh, 128px) 0",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          {/* Subtle pastel background glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 50% at 15% 20%, rgba(255,200,140,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 80%, rgba(140,190,255,0.18) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 clamp(20px, 4vw, 64px)",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: "clamp(40px, 6vw, 80px)",
              alignItems: "center",
            }}
            className="phone-showcase-grid"
          >
            {/* ---------- LEFT: Copy ---------- */}
            <div style={{ maxWidth: "560px" }}>
              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: "clamp(11px, 1.1vw, 13px)",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(0,0,0,0.5)",
                }}
              >
                Authentication, reimagined
              </p>

              <h2
                style={{
                  margin: "0 0 24px",
                  fontSize: "clamp(34px, 4.5vw, 64px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.04em",
                  fontWeight: 600,
                  color: "#0a0a0a",
                  maxWidth: "14ch",
                }}
              >
                Sign in from anywhere, safely.
              </h2>

              <p
                style={{
                  margin: "0 0 32px",
                  fontSize: "clamp(14px, 1.2vw, 16px)",
                  lineHeight: 1.65,
                  color: "rgba(0,0,0,0.62)",
                }}
              >
                One secure flow across every device. Passkey, biometric, or
                password — BINZEO adapts to how you want to sign in, with
                precise-location verification and encrypted sessions behind
                the scenes.
              </p>

              {/* Feature ticks */}
              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  marginBottom: "36px",
                }}
              >
                {[
                  "One-tap sign-in with passkey",
                  "Location-aware authentication",
                  "Full session history and control",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "clamp(13px, 1.15vw, 15px)",
                      color: "rgba(0,0,0,0.75)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "20px",
                        height: "20px",
                        borderRadius: "999px",
                        backgroundColor: "#0a0a0a",
                        color: "#ffffff",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: "10px", height: "10px" }}
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href={isLoggedIn ? "/dashboard/security" : "/signup"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  borderRadius: "999px",
                  background:
                    "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                  color: "#ffffff",
                  fontSize: "clamp(13px, 1.1vw, 14.5px)",
                  fontWeight: 500,
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 1px 2px rgba(0,0,0,0.2), 0 10px 28px -10px rgba(0,0,0,0.45)",
                  transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {isLoggedIn ? "Review security" : "Try the flow"}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* ---------- RIGHT: Phone case image ---------- */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "clamp(520px, 70vh, 800px)",
              }}
            >
              {/* Ambient glow behind phone */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: "min(560px, 90%)",
                  aspectRatio: "1 / 1",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(140,190,255,0.28) 0%, transparent 65%)",
                  filter: "blur(60px)",
                  animation: "bz-badge-float 8s ease-in-out infinite",
                }}
              />

              {/* Phone case image — floats gently */}
              <div
                style={{
                  position: "relative",
                  width: "min(420px, 92%)",
                  aspectRatio: "9 / 19.5",
                  animation: "bz-phone-float 7s ease-in-out infinite",
                  filter:
                    "drop-shadow(0 40px 80px rgba(0,0,0,0.35)) drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                }}
              >
                <img
                  src="/images/phonecase1.jpg"
                  alt="BINZEO authentication on phone"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />

                {/* Ring pulse around phone (subtle) */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: "-8%",
                    borderRadius: "50%",
                    border: "1px solid rgba(0,0,0,0.08)",
                    animation: "bz-ring-pulse 4s ease-out infinite",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Floating badge — Passkey ready */}
              <div
                style={{
                  position: "absolute",
                  top: "12%",
                  left: "2%",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,1), 0 10px 28px -12px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "clamp(11px, 1vw, 13px)",
                  fontWeight: 500,
                  color: "#0a0a0a",
                  animation: "bz-badge-float 6s ease-in-out 0.5s infinite",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    backgroundColor: "#22c55e",
                    boxShadow: "0 0 12px rgba(34,197,94,0.8)",
                  }}
                />
                Passkey ready
              </div>

              {/* Floating badge — Verified */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16%",
                  right: "2%",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,1), 0 10px 28px -12px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "clamp(11px, 1vw, 13px)",
                  fontWeight: 500,
                  color: "#0a0a0a",
                  animation: "bz-badge-float 6s ease-in-out 1.5s infinite",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "18px",
                    height: "18px",
                    borderRadius: "999px",
                    backgroundColor: "#0a0a0a",
                    color: "#ffffff",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: "9px", height: "9px" }}
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                Verified location
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  INTRO                                                        */}
        {/* ============================================================ */}
        <section id="what-is-binzeo" className="reference-intro">
          <div>
            <p className="reference-kicker">What is BINZEO?</p>
            <h2>A quieter way to own your digital identity.</h2>
            <Link
              href={isLoggedIn ? "/dashboard/profile" : "/signup"}
              className="reference-button reference-button-dark reference-button-small"
            >
              Explore now <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="reference-intro-text">
            BINZEO brings your profile, access and connections into one
            considered space. It is made to feel simple on the surface, while
            the protection underneath does the hard work.
          </p>
        </section>

        {/* ============================================================ */}
        {/*  FEATURE GRID                                                 */}
        {/* ============================================================ */}
        <section
          className="reference-feature-grid"
          aria-label="BINZEO benefits"
        >
          {featureCards.map((card, index) => (
            <article
              key={card.title}
              className={`reference-feature-card reference-feature-${card.tone}`}
            >
              <div className="reference-card-topline">
                <span>0{index + 1}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </section>

        {/* ============================================================ */}
        {/*  TRUST STRIP                                                  */}
        {/* ============================================================ */}
        <section
          className="reference-trust-strip"
          aria-label="BINZEO trust signals"
        >
          <p>Built with care for the moments that matter.</p>
          <div>
            {trustItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  USE CASES                                                    */}
        {/* ============================================================ */}
        <section className="reference-usecases">
          <div className="reference-usecase-heading">
            <div>
              <p className="reference-kicker">BINZEO in action</p>
              <h2>Use cases</h2>
            </div>
            <p>
              One identity layer for people, teams and communities that value
              clarity, privacy and connection.
            </p>
          </div>
          <div className="reference-usecase-grid">
            {useCases.map((item, index) => (
              <article
                key={item.label}
                className={`reference-usecase-card reference-usecase-${index + 1}`}
              >
                <div className="reference-usecase-copy">
                  <p className="reference-kicker">{item.label}</p>
                  <h3>{item.title}</h3>
                  <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <img src={item.image} alt="" />
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  VIDEO BANNER                                                 */}
        {/* ============================================================ */}
        <section
          className="reference-video-banner"
          aria-label="BINZEO video showcase"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/img19.jpg"
          >
            <source src="/videos/vid3.mp4" type="video/mp4" />
          </video>
          <div className="reference-video-overlay" />
          <div className="reference-video-caption">
            <p className="reference-kicker">BINZEO in motion</p>
            <h2>Identity for the way you move.</h2>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  BOTTOM CTA                                                   */}
        {/* ============================================================ */}
        <section className="reference-bottom-cta">
          <img
            src="/images/img13.jpg"
            alt="A connected cloud data environment"
          />
          <div>
            <p className="reference-kicker">A better beginning</p>
            <h2>One ID. More room to be you.</h2>
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className="reference-button reference-button-dark"
            >
              {isLoggedIn ? "Go to dashboard" : "Start with BINZEO"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
