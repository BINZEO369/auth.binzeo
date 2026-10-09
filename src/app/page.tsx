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

        /* ============================================================ */
        /*  PHONE CASE GRIDS — responsive side-by-side on ALL screens    */
        /* ============================================================ */

        /* Case 1: Image (left) + Text (right) — always side-by-side */
        .phone-case-1-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100vh;
          min-height: 100dvh;
        }

        /* Case 2: Text (left) + Image (right) — always side-by-side */
        .phone-case-2-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100vh;
          min-height: 100dvh;
        }

        /* Tablet / small desktop */
        @media (max-width: 900px) {
          .phone-case-1-grid,
          .phone-case-2-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Mobile — keep 40/60 split for better text readability */
        @media (max-width: 640px) {
          .phone-case-1-grid {
            grid-template-columns: 42% 58%;
            height: auto;
            min-height: 100dvh;
          }
          .phone-case-2-grid {
            grid-template-columns: 58% 42%;
            height: auto;
            min-height: 100dvh;
          }
          .phone-case-1-image,
          .phone-case-2-image {
            min-height: 100dvh !important;
          }
          .phone-case-text-content {
            padding: 32px 18px !important;
          }
          .phone-case-kicker {
            padding: 6px 12px !important;
            font-size: 9.5px !important;
            letter-spacing: 0.14em !important;
            margin-bottom: 16px !important;
          }
          .phone-case-title {
            font-size: 26px !important;
            line-height: 1.05 !important;
            margin-bottom: 12px !important;
          }
          .phone-case-desc {
            font-size: 12px !important;
            line-height: 1.6 !important;
            margin-bottom: 18px !important;
          }
          .phone-case-list {
            margin-bottom: 18px !important;
            gap: 8px !important;
          }
          .phone-case-list li {
            font-size: 11.5px !important;
            gap: 8px !important;
          }
          .phone-case-list .phone-case-check {
            width: 16px !important;
            height: 16px !important;
            font-size: 8px !important;
          }
          .phone-case-cta {
            padding: 10px 18px !important;
            font-size: 12px !important;
          }
          .phone-case-seam {
            height: 40px !important;
          }
          .phone-case-seam-line {
            width: 40px !important;
          }
        }

        /* Very small mobile (iPhone SE etc) */
        @media (max-width: 380px) {
          .phone-case-1-grid {
            grid-template-columns: 40% 60%;
          }
          .phone-case-2-grid {
            grid-template-columns: 60% 40%;
          }
          .phone-case-text-content {
            padding: 24px 14px !important;
          }
          .phone-case-title {
            font-size: 22px !important;
          }
          .phone-case-desc {
            font-size: 11px !important;
          }
        }
      `}</style>

      <div className="reference-shell">
        {/* ============================================================ */}
        {/*  HERO BANNER                                                  */}
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
        {/*  WRAPPER — Two Phone Cases as one connected composition       */}
        {/* ============================================================ */}
        <div
          style={{
            position: "relative",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            backgroundColor: "#f7f7f5",
            overflow: "hidden",
          }}
        >
          {/* ============================================================ */}
          {/*  PHONE CASE 1 — IMAGE LEFT + TEXT RIGHT (all screens)         */}
          {/* ============================================================ */}
          <section className="phone-case-1-grid">
            {/* LEFT — IMAGE */}
            <div
              className="phone-case-1-image"
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#0a0a0a",
                animation:
                  "bz-fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both",
              }}
            >
              <img
                src="/images/phonecase1.jpg"
                alt="BINZEO phone case on a modern smartphone"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />

              {/* Right edge fade → blends with text side */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: "60px",
                  background:
                    "linear-gradient(270deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Bottom fade → smooths connection to Case 2 */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "35%",
                  background:
                    "linear-gradient(0deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.6) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* RIGHT — TEXT */}
            <div
              className="phone-case-1-text phone-case-text-content"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(32px, 6vw, 96px) clamp(20px, 4vw, 72px)",
                backgroundColor: "#f7f7f5",
                zIndex: 2,
              }}
            >
              <div style={{ maxWidth: "560px", width: "100%" }}>
                {/* Kicker */}
                <div
                  className="phone-case-kicker"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.9), 0 4px 16px -8px rgba(0,0,0,0.08)",
                    color: "rgba(0,0,0,0.7)",
                    fontSize: "clamp(10px, 1vw, 12.5px)",
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    marginBottom: "clamp(16px, 3vh, 32px)",
                    animation:
                      "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      backgroundColor: "#111",
                    }}
                  />
                  Carry it with you
                </div>

                {/* Title */}
                <h2
                  className="phone-case-title"
                  style={{
                    margin: "0 0 clamp(12px, 2.2vh, 26px)",
                    fontSize: "clamp(24px, 4.5vw, 62px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.045em",
                    fontWeight: 600,
                    color: "#0a0a0a",
                    animation:
                      "bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
                  }}
                >
                  Your identity,
                  <br />
                  in your pocket.
                </h2>

                {/* Subtitle */}
                <p
                  className="phone-case-desc"
                  style={{
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    fontSize: "clamp(12px, 1.25vw, 17px)",
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.65)",
                    maxWidth: "480px",
                    animation:
                      "bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
                  }}
                >
                  BINZEO is designed to live where you do — a calm, secure
                  identity layer that feels natural on every device you carry,
                  every day.
                </p>

                {/* Feature list */}
                <ul
                  className="phone-case-list"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(8px, 1.4vh, 14px)",
                    animation:
                      "bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both",
                  }}
                >
                  {[
                    "One-tap access, always available",
                    "Designed for how you actually live",
                    "Smooth on every device you own",
                  ].map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "clamp(11.5px, 1.1vw, 15px)",
                        color: "rgba(0,0,0,0.7)",
                      }}
                    >
                      <span
                        className="phone-case-check"
                        style={{
                          display: "inline-flex",
                          width: "18px",
                          height: "18px",
                          borderRadius: "999px",
                          backgroundColor: "#0a0a0a",
                          color: "#ffffff",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "9px",
                        }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div
                  style={{
                    animation:
                      "bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both",
                  }}
                >
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/signup"}
                    className="phone-case-cta"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "12px 24px",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                      color: "#ffffff",
                      fontSize: "clamp(12px, 1.1vw, 14.5px)",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                      boxShadow:
                        "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 1px 2px rgba(0,0,0,0.2), 0 10px 28px -10px rgba(0,0,0,0.45)",
                      transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    {isLoggedIn ? "Open dashboard" : "Create your ID"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/*  SEAM — soft bridge between the two cases                     */}
          {/* ============================================================ */}
          <div
            aria-hidden="true"
            className="phone-case-seam"
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(60px, 12vh, 160px)",
              background: "#f7f7f5",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <div
              className="phone-case-seam-line"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "clamp(60px, 8vw, 120px)",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent)",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                backgroundColor: "rgba(0,0,0,0.15)",
              }}
            />
          </div>

          {/* ============================================================ */}
          {/*  PHONE CASE 2 — TEXT LEFT + IMAGE RIGHT (all screens)         */}
          {/* ============================================================ */}
          <section className="phone-case-2-grid">
            {/* LEFT — TEXT */}
            <div
              className="phone-case-text-content"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(32px, 6vw, 96px) clamp(20px, 4vw, 72px)",
                backgroundColor: "#f7f7f5",
                zIndex: 2,
              }}
            >
              <div style={{ maxWidth: "560px", width: "100%" }}>
                {/* Kicker */}
                <div
                  className="phone-case-kicker"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow:
                      "inset 0 1px 0 0 rgba(255,255,255,0.9), 0 4px 16px -8px rgba(0,0,0,0.08)",
                    color: "rgba(0,0,0,0.7)",
                    fontSize: "clamp(10px, 1vw, 12.5px)",
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    marginBottom: "clamp(16px, 3vh, 32px)",
                    animation:
                      "bz-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      backgroundColor: "#111",
                    }}
                  />
                  Built for every device
                </div>

                {/* Title */}
                <h2
                  className="phone-case-title"
                  style={{
                    margin: "0 0 clamp(12px, 2.2vh, 26px)",
                    fontSize: "clamp(24px, 4.5vw, 62px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.045em",
                    fontWeight: 600,
                    color: "#0a0a0a",
                    animation:
                      "bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
                  }}
                >
                  One identity.
                  <br />
                  Every screen you own.
                </h2>

                {/* Subtitle */}
                <p
                  className="phone-case-desc"
                  style={{
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    fontSize: "clamp(12px, 1.25vw, 17px)",
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.65)",
                    maxWidth: "480px",
                    animation:
                      "bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
                  }}
                >
                  Whether you&apos;re on your phone, tablet, laptop, or the web
                  — BINZEO stays with you. Sign in once, move seamlessly, and
                  keep your identity calm and secure across every device you
                  use.
                </p>

                {/* Feature list */}
                <ul
                  className="phone-case-list"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(8px, 1.4vh, 14px)",
                    animation:
                      "bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both",
                  }}
                >
                  {[
                    "Instant sign-in with passkeys",
                    "Consistent across iOS, Android & web",
                    "Your data, always in sync",
                  ].map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "clamp(11.5px, 1.1vw, 15px)",
                        color: "rgba(0,0,0,0.7)",
                      }}
                    >
                      <span
                        className="phone-case-check"
                        style={{
                          display: "inline-flex",
                          width: "18px",
                          height: "18px",
                          borderRadius: "999px",
                          backgroundColor: "#0a0a0a",
                          color: "#ffffff",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "9px",
                        }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div
                  style={{
                    animation:
                      "bz-fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.75s both",
                  }}
                >
                  <Link
                    href={isLoggedIn ? "/dashboard" : "/signup"}
                    className="phone-case-cta"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "12px 24px",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                      color: "#ffffff",
                      fontSize: "clamp(12px, 1.1vw, 14.5px)",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                      boxShadow:
                        "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 1px 2px rgba(0,0,0,0.2), 0 10px 28px -10px rgba(0,0,0,0.45)",
                      transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    {isLoggedIn ? "Open dashboard" : "Get started free"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — IMAGE */}
            <div
              className="phone-case-2-image"
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#0a0a0a",
                animation:
                  "bz-fade-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both",
              }}
            >
              <img
                src="/images/phonecase2.jpg"
                alt="BINZEO phone case on a modern smartphone"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />

              {/* Left edge fade → blends with text side */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "60px",
                  background:
                    "linear-gradient(90deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Top fade → smooths connection from Case 1 */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "35%",
                  background:
                    "linear-gradient(180deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.6) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </section>
        </div>

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
