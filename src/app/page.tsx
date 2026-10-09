import Link from "next/link";
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
        @keyframes glass-rise {
          from {
            opacity: 0;
            transform: translateY(48px) scale(0.96);
            filter: blur(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes glass-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes word-rise {
          from {
            opacity: 0;
            transform: translateY(36px);
            filter: blur(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes sheen-sweep {
          0%   { transform: translateX(-120%) skewX(-25deg); opacity: 0; }
          40%  { opacity: 1; }
          100% { transform: translateX(220%) skewX(-25deg); opacity: 0; }
        }
        @keyframes soft-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.3); }
        }
        @keyframes kenburns-slow {
          0%, 100% { transform: scale(1.05) translate(0, 0); }
          50%      { transform: scale(1.15) translate(-2%, -1%); }
        }
      `}</style>

      <div className="reference-shell">
        {/* ============================================================ */}
        {/*  HERO BANNER — Full-screen with Apple Liquid Glass Panel      */}
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
            alignItems: "flex-end",
            justifyContent: "flex-start",
            backgroundColor: "#0a0a0a",
          }}
        >
          {/* Background image with Ken Burns effect */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/images/img20.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              animation: "kenburns-slow 26s ease-in-out infinite",
            }}
          />

          {/* Multi-layer gradient overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.10) 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.85) 100%)",
            }}
          />
          {/* Radial vignette for depth */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 100% 80% at 50% 40%, transparent 0%, rgba(0,0,0,0.45) 100%)",
            }}
          />
          {/* Ambient color glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 60% 50% at 30% 80%, rgba(160,150,255,0.18) 0%, transparent 65%)",
            }}
          />

          {/* ==================================================== */}
          {/*  LIQUID GLASS PANEL WITH TEXT                        */}
          {/* ==================================================== */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: "1600px",
              margin: "0 auto",
              padding:
                "0 clamp(16px, 4vw, 64px) clamp(48px, 8vh, 96px)",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "inline-block",
                maxWidth: "min(920px, 100%)",
                borderRadius: "clamp(28px, 3vw, 40px)",
                padding:
                  "clamp(28px, 4vw, 56px) clamp(24px, 4vw, 56px) clamp(32px, 4.5vw, 60px)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                backdropFilter: "blur(48px) saturate(180%)",
                WebkitBackdropFilter: "blur(48px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.28), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 40px 120px -32px rgba(0,0,0,0.85), 0 12px 40px -12px rgba(0,0,0,0.55)",
                animation:
                  "glass-rise 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both",
                overflow: "hidden",
              }}
            >
              {/* Sheen sweep animation */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "40%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
                  animation:
                    "sheen-sweep 3.2s cubic-bezier(0.22, 1, 0.36, 1) 1.4s infinite",
                  pointerEvents: "none",
                }}
              />

              {/* Top sheen line */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                  pointerEvents: "none",
                }}
              />

              {/* Small pill badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color: "rgba(255,255,255,0.92)",
                  fontSize: "clamp(10.5px, 1.1vw, 12.5px)",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "clamp(20px, 2.5vh, 32px)",
                  animation:
                    "glass-fade 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    backgroundColor: "#fff",
                    boxShadow: "0 0 12px rgba(255,255,255,0.9)",
                    animation: "pulse-dot 2.4s ease-in-out infinite",
                  }}
                />
                BINZEO Digital Identity
              </div>

              {/* Main title — word by word reveal */}
              <h1
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "clamp(34px, 6.4vw, 88px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.048em",
                  fontWeight: 600,
                  maxWidth: "18ch",
                  textShadow:
                    "0 2px 24px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.4)",
                }}
              >
                {["Where", "your", "identity"].map((word, i) => (
                  <span
                    key={word}
                    style={{
                      display: "inline-block",
                      animation: `word-rise 1s cubic-bezier(0.22, 1, 0.36, 1) ${
                        0.7 + i * 0.12
                      }s both`,
                    }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
                <br />
                <span
                  style={{
                    display: "inline-block",
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #ffffff 55%, rgba(255,255,255,0.65) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    animation:
                      "word-rise 1s cubic-bezier(0.22, 1, 0.36, 1) 1.06s both",
                  }}
                >
                  feels at home.
                </span>
              </h1>

              {/* Bottom accent row */}
              <div
                style={{
                  marginTop: "clamp(24px, 3vh, 40px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  animation:
                    "glass-fade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.4s both",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: "56px",
                    height: "2px",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.9), transparent)",
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: "clamp(12px, 1.2vw, 14px)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  Calm · Secure · Yours
                </span>
              </div>
            </div>
          </div>

          {/* Scroll indicator (bottom right) */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              right: "clamp(16px, 4vw, 64px)",
              bottom: "clamp(48px, 8vh, 96px)",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              color: "rgba(255,255,255,0.55)",
              fontSize: "10.5px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              animation:
                "glass-fade 1s cubic-bezier(0.22, 1, 0.36, 1) 1.6s both",
            }}
          >
            <span>Scroll</span>
            <span
              style={{
                display: "inline-block",
                width: "1.5px",
                height: "40px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
              }}
            />
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
