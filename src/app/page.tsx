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

/* ================================================================== */
/*  Partner / Brand logos (small row under CTA)                        */
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
        @keyframes bz-pulse-dot {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.25); }
        }
        @keyframes bz-logo-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
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
          {/* ==================================================== */}
          {/*  BACKGROUND IMAGE — img3.jpg only (Ken Burns slow)    */}
          {/* ==================================================== */}
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

          {/* ==================================================== */}
          {/*  CONTENT — Centered                                    */}
          {/* ==================================================== */}
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
            {/* ============================================ */}
            {/*  BIG BINZEO LOGO (replaces "Introducing")     */}
            {/* ============================================ */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "clamp(28px, 4vh, 48px)",
                animation:
                  "bz-logo-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
              }}
            >
              <img
                src="/logo.svg"
                alt="BINZEO"
                style={{
                  height: "clamp(48px, 7vw, 92px)",
                  width: "auto",
                  maxWidth: "90vw",
                  filter:
                    "brightness(0) drop-shadow(0 4px 24px rgba(255,255,255,0.5))",
                }}
              />
            </div>

            {/* Small intro line */}
            <p
              style={{
                margin: "0 0 clamp(8px, 1.2vh, 16px)",
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

            {/* Main title — huge, minimal */}
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

            {/* Subtitle below title */}
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

            {/* Description text */}
            <p
              style={{
                margin: "clamp(20px, 3vh, 32px) auto 0",
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

            {/* CTA Button — Black pill */}
            <div
              style={{
                marginTop: "clamp(28px, 4vh, 44px)",
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
                  padding: "14px 28px",
                  borderRadius: "999px",
                  background:
                    "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                  color: "#ffffff",
                  fontSize: "clamp(13px, 1.1vw, 14.5px)",
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

            {/* ==================================================== */}
            {/*  SMALL PARTNER LOGO ROW — below CTA button           */}
            {/* ==================================================== */}
            <div
              style={{
                marginTop: "clamp(40px, 6vh, 64px)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(20px, 3.5vw, 44px)",
                animation:
                  "bz-fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 1.3s both",
              }}
            >
              {partnerLogos.map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  style={{
                    height: "clamp(16px, 2vw, 26px)",
                    width: "auto",
                    maxWidth: "80px",
                    objectFit: "contain",
                    opacity: 0.7,
                    filter: "grayscale(1) brightness(0.35)",
                    transition:
                      "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              ))}
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
