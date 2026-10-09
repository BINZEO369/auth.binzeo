import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const partnerLogos = [
  { src: "/images/jabiyenlogo.png", alt: "Jabiyen" },
  { src: "/images/isyenlogo.png", alt: "Isyen" },
  { src: "/images/hiryenlogo.png", alt: "Hiryen" },
  { src: "/images/jayenwarelogo.png", alt: "Jayenware" },
  { src: "/images/binzeoorglogo.png", alt: "Binzeo Org" },
  { src: "/images/bcloudlogo.png", alt: "Bcloud" },
];

/* ================================================================== */
/*  Cinematic letter reveal                                            */
/* ================================================================== */
function Letters({
  text,
  delayBase = 0,
  stagger = 0.04,
  className = "",
}: {
  text: string;
  delayBase?: number;
  stagger?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="bz-letter"
          style={{ ["--rd" as any]: `${delayBase + i * stagger}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

/* ================================================================== */
/*  Cinematic word reveal                                              */
/* ================================================================== */
function Words({
  words,
  delayBase = 0,
  stagger = 0.08,
  className = "",
}: {
  words: string[];
  delayBase?: number;
  stagger?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="bz-word"
          style={{ ["--rd" as any]: `${delayBase + i * stagger}s` }}
        >
          {w}&nbsp;
        </span>
      ))}
    </span>
  );
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  return (
    <main className="reference-home" style={{ backgroundColor: "#f7f7f5" }}>
      <style>{`
        /* ============================================================ */
        /*  CINEMATIC REVEAL SYSTEM                                      */
        /* ============================================================ */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px) scale(0.99);
          filter: blur(10px);
          transition:
            opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.85s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--rd, 0s);
          will-change: opacity, transform, filter;
        }
        [data-reveal].is-visible {
          opacity: 1;
          transform: none;
          filter: none;
        }

        .bz-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(60%) rotateX(-50deg) scale(1.05);
          filter: blur(12px);
          transform-origin: 50% 100%;
          transition:
            opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--rd, 0s);
          will-change: opacity, transform, filter;
        }

        .bz-word {
          display: inline-block;
          opacity: 0;
          transform: translateY(48%) scale(0.97);
          filter: blur(13px);
          transition:
            opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.85s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--rd, 0s);
          will-change: opacity, transform, filter;
        }

        [data-reveal-group].is-visible .bz-letter,
        [data-reveal-group].is-visible .bz-word {
          opacity: 1;
          transform: none;
          filter: none;
        }

        @keyframes bz-kenburns {
          0%, 100% { transform: scale(1.05) translate(0, 0); }
          50%      { transform: scale(1.15) translate(-1.5%, -1%); }
        }
        @keyframes bz-float-soft {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        /* ============================================================ */
        /*  LIQUID MERGE — সাদা শ্যাডো                                   */
        /* ============================================================ */
        .liquid-section { position: relative; isolation: isolate; }
        .liquid-shadow-top {
          box-shadow: inset 0 60px 80px -50px rgba(255,255,255,0.95);
        }
        .liquid-shadow-bottom {
          box-shadow: inset 0 -60px 80px -50px rgba(255,255,255,0.95);
        }
        .liquid-shadow-both {
          box-shadow:
            inset 0 60px 80px -50px rgba(255,255,255,0.9),
            inset 0 -60px 80px -50px rgba(255,255,255,0.9);
        }

        /* ============================================================ */
        /*  LIQUID GLASS SOUND BUTTON                                    */
        /* ============================================================ */
        .bz-sound-btn {
          position: absolute;
          bottom: clamp(20px, 4vh, 40px);
          right: clamp(20px, 4vw, 40px);
          z-index: 6;
          width: clamp(34px, 3.4vw, 42px);
          height: clamp(34px, 3.4vw, 42px);
          padding: 0;
          border: none;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          isolation: isolate;
          overflow: hidden;
          color: #0a0a0a;
          background:
            radial-gradient(
              120% 120% at 30% 15%,
              rgba(255,255,255,0.98) 0%,
              rgba(255,255,255,0.78) 35%,
              rgba(255,255,255,0.55) 65%,
              rgba(255,255,255,0.42) 100%
            );
          backdrop-filter: blur(22px) saturate(190%);
          -webkit-backdrop-filter: blur(22px) saturate(190%);
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,1),
            inset 0 -1px 0 0 rgba(255,255,255,0.5),
            inset 0 0 0 1px rgba(255,255,255,0.35),
            0 1px 2px rgba(0,0,0,0.06),
            0 8px 22px -8px rgba(0,0,0,0.22),
            0 2px 6px -2px rgba(0,0,0,0.08);
          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, box-shadow;
        }

        /* Shimmering specular highlight on top */
        .bz-sound-btn::before {
          content: "";
          position: absolute;
          top: 3px;
          left: 12%;
          right: 12%;
          height: 42%;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.95) 0%,
            rgba(255,255,255,0.15) 70%,
            rgba(255,255,255,0) 100%
          );
          pointer-events: none;
          filter: blur(0.5px);
        }

        /* Soft inner liquid blob */
        .bz-sound-btn::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 82%;
          height: 55%;
          border-radius: 999px;
          background: radial-gradient(
            60% 100% at 50% 100%,
            rgba(0,0,0,0.08) 0%,
            rgba(0,0,0,0) 70%
          );
          pointer-events: none;
        }

        .bz-sound-btn:hover {
          transform: translateY(-1.5px) scale(1.05);
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,1),
            inset 0 -1px 0 0 rgba(255,255,255,0.55),
            inset 0 0 0 1px rgba(255,255,255,0.45),
            0 2px 4px rgba(0,0,0,0.08),
            0 14px 30px -10px rgba(0,0,0,0.28),
            0 4px 10px -3px rgba(0,0,0,0.12);
        }

        .bz-sound-btn:active {
          transform: translateY(0) scale(0.96);
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,0.08),
            inset 0 1px 0 0 rgba(255,255,255,0.85),
            inset 0 0 0 1px rgba(255,255,255,0.3),
            0 2px 4px rgba(0,0,0,0.05);
        }

        .bz-sound-btn:focus-visible {
          outline: none;
          box-shadow:
            inset 0 1px 0 0 rgba(255,255,255,1),
            inset 0 0 0 1px rgba(255,255,255,0.5),
            0 0 0 3px rgba(10,10,10,0.18),
            0 10px 26px -10px rgba(0,0,0,0.25);
        }

        .bz-sound-btn svg {
          position: relative;
          z-index: 2;
          width: 42%;
          height: 42%;
          display: block;
          transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .bz-sound-btn .bz-icon-hidden {
          opacity: 0;
          transform: scale(0.7);
          position: absolute;
          inset: 0;
          margin: auto;
        }
        .bz-sound-btn .bz-icon-shown {
          opacity: 1;
          transform: scale(1);
          position: relative;
        }

        /* ============================================================ */
        /*  PHONE CASE GRIDS                                             */
        /* ============================================================ */
        .phone-case-1-grid,
        .phone-case-2-grid,
        .phone-case-4-grid,
        .phone-case-5-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100vh;
          min-height: 100vh;
        }

        @media (max-width: 900px) {
          .phone-case-1-grid,
          .phone-case-2-grid,
          .phone-case-4-grid,
          .phone-case-5-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .phone-case-1-grid,
          .phone-case-4-grid {
            grid-template-columns: 42% 58%;
            height: auto;
            min-height: 100vh;
          }
          .phone-case-2-grid,
          .phone-case-5-grid {
            grid-template-columns: 58% 42%;
            height: auto;
            min-height: 100vh;
          }
          .phone-case-1-image,
          .phone-case-2-image,
          .phone-case-4-image,
          .phone-case-5-image { min-height: 100vh !important; }
          .phone-case-text-content { padding: 32px 18px !important; }
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
          .phone-case-list { margin-bottom: 18px !important; gap: 8px !important; }
          .phone-case-list li { font-size: 11.5px !important; gap: 8px !important; }
          .phone-case-list .phone-case-check {
            width: 16px !important; height: 16px !important; font-size: 8px !important;
          }
          .phone-case-cta { padding: 10px 18px !important; font-size: 12px !important; }
          .phone-case-seam { height: 40px !important; }
          .liquid-shadow-top,
          .liquid-shadow-bottom,
          .liquid-shadow-both { box-shadow: none !important; }
        }

        @media (max-width: 380px) {
          .phone-case-1-grid, .phone-case-4-grid { grid-template-columns: 40% 60%; }
          .phone-case-2-grid, .phone-case-5-grid { grid-template-columns: 60% 40%; }
          .phone-case-text-content { padding: 24px 14px !important; }
          .phone-case-title { font-size: 22px !important; }
          .phone-case-desc { font-size: 11px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal], .bz-letter, .bz-word {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
          .bz-sound-btn { transition: none !important; }
        }
      `}</style>

      <div className="reference-shell">
        {/* ============================================================ */}
        {/*  1. HERO BANNER                                                */}
        {/* ============================================================ */}
        <section
          className="liquid-section"
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            minHeight: "100vh",
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
              perspective: "1200px",
            }}
          >
            <div
              data-reveal
              style={{
                ["--rd" as any]: "0.02s",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "clamp(40px, 6vh, 72px)",
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
              data-reveal-group
              style={{
                margin: "0 0 clamp(12px, 1.8vh, 22px)",
                fontSize: "clamp(16px, 1.6vw, 22px)",
                fontWeight: 400,
                color: "rgba(0,0,0,0.65)",
                letterSpacing: "-0.01em",
              }}
            >
              <Words words={["Own", "your"]} delayBase={0.18} stagger={0.1} />
            </p>

            <h1
              data-reveal-group
              style={{
                margin: 0,
                fontSize: "clamp(52px, 11vw, 168px)",
                lineHeight: 0.94,
                letterSpacing: "-0.06em",
                fontWeight: 600,
                color: "#0a0a0a",
                transformStyle: "preserve-3d",
              }}
            >
              <Letters text="Identity" delayBase={0.3} stagger={0.04} />
            </h1>

            <p
              data-reveal-group
              style={{
                margin: "clamp(12px, 1.6vh, 22px) 0 0",
                fontSize: "clamp(18px, 2vw, 28px)",
                fontWeight: 400,
                color: "rgba(0,0,0,0.7)",
                letterSpacing: "-0.015em",
              }}
            >
              <Words
                words={["that", "feels", "like", "home."]}
                delayBase={0.7}
                stagger={0.08}
              />
            </p>

            <p
              data-reveal
              style={{
                ["--rd" as any]: "1s",
                margin: "clamp(24px, 3.5vh, 40px) auto 0",
                maxWidth: "520px",
                fontSize: "clamp(13px, 1.15vw, 15px)",
                lineHeight: 1.6,
                color: "rgba(0,0,0,0.65)",
              }}
            >
              A quieter, safer way to hold your digital self. One secure
              identity for every part of your online life — built to feel
              simple on the surface.
            </p>

            <div
              data-reveal
              style={{
                ["--rd" as any]: "1.15s",
                marginTop: "clamp(32px, 4.5vh, 52px)",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
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
              }}
            >
              {partnerLogos.map((logo, i) => (
                <div
                  key={logo.alt}
                  data-reveal
                  style={{
                    ["--rd" as any]: `${1.3 + i * 0.06}s`,
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

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "200px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.7) 65%, rgba(255,255,255,0.97) 90%, rgba(255,255,255,1) 100%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        </section>

        {/* ============================================================ */}
        {/*  2. WRAPPER 1 — Case 1 + Seam + Case 2                        */}
        {/* ============================================================ */}
        <div
          className="liquid-section liquid-shadow-both"
          style={{
            position: "relative",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            backgroundColor: "#f7f7f5",
            overflow: "hidden",
          }}
        >
          {/* ---------- PHONE CASE 1 ---------- */}
          <section className="phone-case-1-grid">
            <div
              className="phone-case-1-image"
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#0a0a0a",
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
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, right: 0, bottom: 0, width: "120px",
                  background:
                    "linear-gradient(270deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.7) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0, height: "45%",
                  background:
                    "linear-gradient(0deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.7) 35%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "25%",
                  background:
                    "linear-gradient(180deg, rgba(247,247,245,0.9) 0%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

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
                perspective: "1200px",
              }}
            >
              <div style={{ maxWidth: "560px", width: "100%" }}>
                <div
                  data-reveal
                  className="phone-case-kicker"
                  style={{
                    ["--rd" as any]: "0.05s",
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
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      backgroundColor: "#111",
                      animation: "bz-float-soft 2.4s ease-in-out infinite",
                    }}
                  />
                  Carry it with you
                </div>

                <h2
                  data-reveal-group
                  className="phone-case-title"
                  style={{
                    margin: "0 0 clamp(12px, 2.2vh, 26px)",
                    fontSize: "clamp(24px, 4.5vw, 62px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.045em",
                    fontWeight: 600,
                    color: "#0a0a0a",
                  }}
                >
                  <Words words={["Your", "identity,"]} delayBase={0.15} stagger={0.1} />
                  <br />
                  <Words words={["in", "your", "pocket."]} delayBase={0.35} stagger={0.09} />
                </h2>

                <p
                  data-reveal
                  className="phone-case-desc"
                  style={{
                    ["--rd" as any]: "0.55s",
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    fontSize: "clamp(12px, 1.25vw, 17px)",
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.65)",
                    maxWidth: "480px",
                  }}
                >
                  BINZEO is designed to live where you do — a calm, secure
                  identity layer that feels natural on every device you carry,
                  every day.
                </p>

                <ul
                  className="phone-case-list"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(8px, 1.4vh, 14px)",
                  }}
                >
                  {[
                    "One-tap access, always available",
                    "Designed for how you actually live",
                    "Smooth on every device you own",
                  ].map((item, i) => (
                    <li
                      key={item}
                      data-reveal
                      style={{
                        ["--rd" as any]: `${0.65 + i * 0.08}s`,
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

                <div data-reveal style={{ ["--rd" as any]: "0.95s" }}>
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

          {/* SEAM */}
          <div
            aria-hidden="true"
            className="phone-case-seam"
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(80px, 14vh, 180px)",
              background: "#f7f7f5",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "rgba(0,0,0,0.08)",
                boxShadow:
                  "0 0 0 6px rgba(0,0,0,0.02), 0 0 0 12px rgba(0,0,0,0.01)",
              }}
            />
          </div>

          {/* ---------- PHONE CASE 2 ---------- */}
          <section className="phone-case-2-grid">
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
                perspective: "1200px",
              }}
            >
              <div style={{ maxWidth: "560px", width: "100%" }}>
                <div
                  data-reveal
                  className="phone-case-kicker"
                  style={{
                    ["--rd" as any]: "0.05s",
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
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      backgroundColor: "#111",
                      animation: "bz-float-soft 2.4s ease-in-out infinite",
                    }}
                  />
                  Built for every device
                </div>

                <h2
                  data-reveal-group
                  className="phone-case-title"
                  style={{
                    margin: "0 0 clamp(12px, 2.2vh, 26px)",
                    fontSize: "clamp(24px, 4.5vw, 62px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.045em",
                    fontWeight: 600,
                    color: "#0a0a0a",
                  }}
                >
                  <Words words={["One", "identity."]} delayBase={0.15} stagger={0.1} />
                  <br />
                  <Words words={["Every", "screen", "you", "own."]} delayBase={0.35} stagger={0.08} />
                </h2>

                <p
                  data-reveal
                  className="phone-case-desc"
                  style={{
                    ["--rd" as any]: "0.55s",
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    fontSize: "clamp(12px, 1.25vw, 17px)",
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.65)",
                    maxWidth: "480px",
                  }}
                >
                  Whether you&apos;re on your phone, tablet, laptop, or the web
                  — BINZEO stays with you. Sign in once, move seamlessly, and
                  keep your identity calm and secure across every device you
                  use.
                </p>

                <ul
                  className="phone-case-list"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(8px, 1.4vh, 14px)",
                  }}
                >
                  {[
                    "Instant sign-in with passkeys",
                    "Consistent across iOS, Android & web",
                    "Your data, always in sync",
                  ].map((item, i) => (
                    <li
                      key={item}
                      data-reveal
                      style={{
                        ["--rd" as any]: `${0.7 + i * 0.08}s`,
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

                <div data-reveal style={{ ["--rd" as any]: "1s" }}>
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

            <div
              className="phone-case-2-image"
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#0a0a0a",
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
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, bottom: 0, width: "120px",
                  background:
                    "linear-gradient(90deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.7) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "35%",
                  background:
                    "linear-gradient(180deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.6) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0, height: "35%",
                  background:
                    "linear-gradient(0deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.6) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </section>

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "200px",
              background:
                "linear-gradient(0deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        </div>

        {/* ============================================================ */}
        {/*  3. PHONE CASE 3 — full-screen image                           */}
        {/* ============================================================ */}
        <section
          className="liquid-section liquid-shadow-top"
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            minHeight: "100vh",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            display: "block",
            padding: 0,
            margin: 0,
          }}
        >
          <img
            src="/images/phonecase3.jpg"
            alt=""
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
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, height: "180px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.2) 70%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0, height: "200px",
              background:
                "linear-gradient(0deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </section>

        {/* ============================================================ */}
        {/*  4. SETUP GUIDE VIDEO                                          */}
        {/* ============================================================ */}
        <section
          id="binzeo-video-section"
          className="liquid-section liquid-shadow-top"
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            minHeight: "100vh",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            margin: 0,
          }}
        >
          <video
            id="binzeo-setup-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/img3.jpg"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          >
            <source src="/videos/vid1.mp4" type="video/mp4" />
          </video>

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, height: "180px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.2) 70%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0, height: "200px",
              background:
                "linear-gradient(0deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          {/* Liquid Glass Sound Toggle */}
          <button
            id="binzeo-video-sound-toggle"
            className="bz-sound-btn"
            type="button"
            aria-label="Turn sound on"
            title="Toggle sound"
          >
            {/* Sound OFF icon (muted) */}
            <svg
              id="binzeo-sound-off-icon"
              className="bz-icon-shown"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>

            {/* Sound ON icon */}
            <svg
              id="binzeo-sound-on-icon"
              className="bz-icon-hidden"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </button>
        </section>

        {/* ============================================================ */}
        {/*  5. WRAPPER 2 — Case 4 + Seam + Case 5                        */}
        {/* ============================================================ */}
        <div
          className="liquid-section"
          style={{
            position: "relative",
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)",
            backgroundColor: "#f7f7f5",
            overflow: "hidden",
            paddingBottom: 0,
          }}
        >
          {/* ---------- PHONE CASE 4 ---------- */}
          <section className="phone-case-4-grid">
            <div
              className="phone-case-4-image"
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#0a0a0a",
              }}
            >
              <img
                src="/images/phonecase4.jpg"
                alt="BINZEO phone case variant 4"
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
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, right: 0, bottom: 0, width: "120px",
                  background:
                    "linear-gradient(270deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.7) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0, height: "45%",
                  background:
                    "linear-gradient(0deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.7) 35%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "25%",
                  background:
                    "linear-gradient(180deg, rgba(247,247,245,0.9) 0%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

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
                perspective: "1200px",
              }}
            >
              <div style={{ maxWidth: "560px", width: "100%" }}>
                <div
                  data-reveal
                  className="phone-case-kicker"
                  style={{
                    ["--rd" as any]: "0.05s",
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
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      backgroundColor: "#111",
                      animation: "bz-float-soft 2.4s ease-in-out infinite",
                    }}
                  />
                  Crafted for you
                </div>

                <h2
                  data-reveal-group
                  className="phone-case-title"
                  style={{
                    margin: "0 0 clamp(12px, 2.2vh, 26px)",
                    fontSize: "clamp(24px, 4.5vw, 62px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.045em",
                    fontWeight: 600,
                    color: "#0a0a0a",
                  }}
                >
                  <Words words={["Protection", "that"]} delayBase={0.15} stagger={0.1} />
                  <br />
                  <Words words={["feels", "personal."]} delayBase={0.35} stagger={0.1} />
                </h2>

                <p
                  data-reveal
                  className="phone-case-desc"
                  style={{
                    ["--rd" as any]: "0.55s",
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    fontSize: "clamp(12px, 1.25vw, 17px)",
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.65)",
                    maxWidth: "480px",
                  }}
                >
                  Every BINZEO case is designed with the same care we bring to
                  your identity — premium materials, considered details, and a
                  finish that lasts.
                </p>

                <ul
                  className="phone-case-list"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(8px, 1.4vh, 14px)",
                  }}
                >
                  {[
                    "Premium materials, everyday durability",
                    "Precision-engineered for a perfect fit",
                    "Designed to feel as good as it looks",
                  ].map((item, i) => (
                    <li
                      key={item}
                      data-reveal
                      style={{
                        ["--rd" as any]: `${0.65 + i * 0.08}s`,
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

                <div data-reveal style={{ ["--rd" as any]: "0.95s" }}>
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
                    {isLoggedIn ? "Open dashboard" : "Discover more"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SEAM */}
          <div
            aria-hidden="true"
            className="phone-case-seam"
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(80px, 14vh, 180px)",
              background: "#f7f7f5",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "rgba(0,0,0,0.08)",
                boxShadow:
                  "0 0 0 6px rgba(0,0,0,0.02), 0 0 0 12px rgba(0,0,0,0.01)",
              }}
            />
          </div>

          {/* ---------- PHONE CASE 5 ---------- */}
          <section className="phone-case-5-grid">
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
                perspective: "1200px",
              }}
            >
              <div style={{ maxWidth: "560px", width: "100%" }}>
                <div
                  data-reveal
                  className="phone-case-kicker"
                  style={{
                    ["--rd" as any]: "0.05s",
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
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      backgroundColor: "#111",
                      animation: "bz-float-soft 2.4s ease-in-out infinite",
                    }}
                  />
                  Made to last
                </div>

                <h2
                  data-reveal-group
                  className="phone-case-title"
                  style={{
                    margin: "0 0 clamp(12px, 2.2vh, 26px)",
                    fontSize: "clamp(24px, 4.5vw, 62px)",
                    lineHeight: 1.02,
                    letterSpacing: "-0.045em",
                    fontWeight: 600,
                    color: "#0a0a0a",
                  }}
                >
                  <Words words={["A", "companion", "for"]} delayBase={0.15} stagger={0.09} />
                  <br />
                  <Words words={["every", "day."]} delayBase={0.38} stagger={0.1} />
                </h2>

                <p
                  data-reveal
                  className="phone-case-desc"
                  style={{
                    ["--rd" as any]: "0.55s",
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    fontSize: "clamp(12px, 1.25vw, 17px)",
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.65)",
                    maxWidth: "480px",
                  }}
                >
                  Carry your identity with quiet confidence. BINZEO cases
                  protect what matters — and look beautiful doing it.
                </p>

                <ul
                  className="phone-case-list"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 clamp(18px, 4vh, 40px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(8px, 1.4vh, 14px)",
                  }}
                >
                  {[
                    "Slim profile, serious protection",
                    "Considered details you'll feel daily",
                    "Made for the way you actually live",
                  ].map((item, i) => (
                    <li
                      key={item}
                      data-reveal
                      style={{
                        ["--rd" as any]: `${0.7 + i * 0.08}s`,
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

                <div data-reveal style={{ ["--rd" as any]: "1s" }}>
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

            <div
              className="phone-case-5-image"
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#0a0a0a",
              }}
            >
              <img
                src="/images/phonecase5.jpg"
                alt="BINZEO phone case variant 5"
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
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, bottom: 0, width: "120px",
                  background:
                    "linear-gradient(90deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.7) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: "35%",
                  background:
                    "linear-gradient(180deg, rgba(247,247,245,1) 0%, rgba(247,247,245,0.6) 40%, rgba(247,247,245,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </section>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Scripts                                                      */}
      {/* ============================================================ */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {

              /* ---------- VIDEO SOUND TOGGLE + AUTO-MUTE ON SCROLL ---------- */
              var v = document.getElementById('binzeo-setup-video');
              var b = document.getElementById('binzeo-video-sound-toggle');
              var on = document.getElementById('binzeo-sound-on-icon');
              var off = document.getElementById('binzeo-sound-off-icon');
              var videoSection = document.getElementById('binzeo-video-section');

              function setMutedUI(muted) {
                if (!on || !off) return;
                if (muted) {
                  on.classList.add('bz-icon-hidden');
                  on.classList.remove('bz-icon-shown');
                  off.classList.add('bz-icon-shown');
                  off.classList.remove('bz-icon-hidden');
                  b.setAttribute('aria-label', 'Turn sound on');
                  b.setAttribute('title', 'Turn sound on');
                } else {
                  off.classList.add('bz-icon-hidden');
                  off.classList.remove('bz-icon-shown');
                  on.classList.add('bz-icon-shown');
                  on.classList.remove('bz-icon-hidden');
                  b.setAttribute('aria-label', 'Turn sound off');
                  b.setAttribute('title', 'Turn sound off');
                }
              }

              if (v && b && on && off) {
                v.muted = true;
                setMutedUI(true);

                b.addEventListener('click', function() {
                  v.muted = !v.muted;
                  setMutedUI(v.muted);
                });

                /* Auto-mute when video section leaves viewport */
                if ('IntersectionObserver' in window && videoSection) {
                  var vIO = new IntersectionObserver(
                    function(entries) {
                      entries.forEach(function(entry) {
                        if (!entry.isIntersecting && !v.muted) {
                          v.muted = true;
                          setMutedUI(true);
                        }
                      });
                    },
                    { threshold: 0.35 }
                  );
                  vIO.observe(videoSection);
                }

                /* Fallback: also handle tab visibility */
                document.addEventListener('visibilitychange', function() {
                  if (document.hidden && !v.muted) {
                    v.muted = true;
                    setMutedUI(true);
                  }
                });
              }

              /* ---------- SCROLL-TRIGGERED CINEMATIC REVEALS ---------- */
              function revealAll() {
                document
                  .querySelectorAll('[data-reveal], [data-reveal-group]')
                  .forEach(function(el) { el.classList.add('is-visible'); });
              }

              function setupReveals() {
                var els = document.querySelectorAll(
                  '[data-reveal], [data-reveal-group]'
                );
                if (!els.length) return;

                var reduce = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (reduce || !('IntersectionObserver' in window)) {
                  revealAll();
                  return;
                }

                var io = new IntersectionObserver(
                  function(entries) {
                    entries.forEach(function(entry) {
                      if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                      }
                    });
                  },
                  {
                    threshold: 0.12,
                    rootMargin: '0px 0px -5% 0px',
                  }
                );

                els.forEach(function(el) { io.observe(el); });

                window.requestAnimationFrame(function() {
                  document
                    .querySelectorAll(
                      'main > .reference-shell > section:first-child [data-reveal], ' +
                      'main > .reference-shell > section:first-child [data-reveal-group]'
                    )
                    .forEach(function(el) { io.observe(el); });
                });
              }

              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', setupReveals);
              } else {
                setupReveals();
              }
            })();
          `,
        }}
      />
    </main>
  );
}
