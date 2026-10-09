import { Metadata } from "next";
import Link from "next/link";
import PasswordOtpForm from "@/components/auth/PasswordOtpForm";

export const metadata: Metadata = {
  title: "Change Password",
  description:
    "Change your BINZEO account password with email OTP verification.",
};

/* ================================================================== */
/*  SHARED LAYOUT TOKENS                                               */
/* ================================================================== */
const containerCls =
  "relative z-10 mx-auto w-full max-w-2xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8";

/* ================================================================== */
/*  Background layer — full viewport                                   */
/* ================================================================== */
function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute -inset-[6%]"
        style={{
          backgroundImage: "url('/images/img3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "pw-kenburns 32s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <div className="relative isolate min-h-[80vh] w-full">
      {/* ============================================================ */}
      {/*  KEYFRAMES + SCOPED FORM OVERRIDES                            */}
      {/* ============================================================ */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pw-item-in {
              from { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(8px); }
              to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
            }
            @keyframes pw-banner-in {
              from { opacity: 0; transform: translateY(24px); filter: blur(10px); }
              to   { opacity: 1; transform: translateY(0); filter: blur(0); }
            }
            @keyframes pw-float-soft {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-5px); }
            }
            @keyframes pw-kenburns {
              0%, 100% { transform: scale(1.04) translate(0, 0); }
              50%      { transform: scale(1.12) translate(-1%, -0.8%); }
            }

            /* ============================================================ */
            /*  SCOPED FORM OVERRIDES — force the embedded PasswordOtpForm  */
            /*  to fit and match the liquid-glass theme                     */
            /* ============================================================ */

            /* Kill any max-width / fixed width that could overflow */
            [data-pw-form],
            [data-pw-form] * {
              box-sizing: border-box;
              max-width: 100%;
            }

            [data-pw-form] > * {
              width: 100% !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }

            /* Prevent horizontal overflow from OTP rows */
            [data-pw-form] {
              overflow-x: hidden;
            }

            /* Any input / select inside the form → liquid glass */
            [data-pw-form] input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]),
            [data-pw-form] select,
            [data-pw-form] textarea {
              width: 100% !important;
              padding: 14px 16px !important;
              border-radius: 14px !important;
              border: 1px solid rgba(255,255,255,0.4) !important;
              background: rgba(255,255,255,0.4) !important;
              backdrop-filter: blur(14px) saturate(180%);
              -webkit-backdrop-filter: blur(14px) saturate(180%);
              color: rgba(0,0,0,0.9) !important;
              font-size: 15px !important;
              line-height: 1.4 !important;
              outline: none !important;
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,0.9),
                0 1px 2px rgba(0,0,0,0.03) !important;
              transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
            }

            [data-pw-form] input::placeholder,
            [data-pw-form] textarea::placeholder {
              color: rgba(0,0,0,0.35) !important;
            }

            [data-pw-form] input:focus,
            [data-pw-form] select:focus,
            [data-pw-form] textarea:focus {
              border-color: rgba(255,255,255,0.7) !important;
              background: rgba(255,255,255,0.6) !important;
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,1),
                0 0 0 4px rgba(255,255,255,0.3) !important;
            }

            /* OTP digit inputs — keep them compact and centered */
            [data-pw-form] input[inputmode="numeric"],
            [data-pw-form] input[autocomplete="one-time-code"],
            [data-pw-form] input[maxlength="1"] {
              text-align: center !important;
              font-size: 18px !important;
              font-weight: 600 !important;
              padding: 12px 4px !important;
            }

            /* Labels */
            [data-pw-form] label {
              display: block !important;
              font-size: 11px !important;
              font-weight: 600 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.14em !important;
              color: rgba(0,0,0,0.6) !important;
              margin-bottom: 8px !important;
            }

            /* Any button inside the form */
            [data-pw-form] button:not([type="submit"]):not([data-primary]) {
              border-radius: 999px !important;
              border: 1px solid rgba(255,255,255,0.4) !important;
              background: rgba(255,255,255,0.4) !important;
              backdrop-filter: blur(14px) saturate(180%);
              -webkit-backdrop-filter: blur(14px) saturate(180%);
              color: rgba(0,0,0,0.75) !important;
              font-weight: 500 !important;
              padding: 12px 20px !important;
              transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            }

            [data-pw-form] button:not([type="submit"]):hover {
              background: rgba(255,255,255,0.65) !important;
              border-color: rgba(255,255,255,0.65) !important;
              color: rgba(0,0,0,0.95) !important;
              transform: translateY(-2px);
            }

            /* Primary / submit button — BLACK with WHITE text, forced */
            [data-pw-form] button[type="submit"],
            [data-pw-form] button[data-primary] {
              width: 100% !important;
              border-radius: 999px !important;
              border: 1px solid #0a0a0a !important;
              background: #0a0a0a !important;
              color: #ffffff !important;
              font-weight: 500 !important;
              font-size: 13.5px !important;
              padding: 14px 22px !important;
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,0.14),
                0 2px 4px rgba(0,0,0,0.08),
                0 12px 28px -12px rgba(0,0,0,0.5) !important;
              transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
              cursor: pointer;
            }

            [data-pw-form] button[type="submit"] *,
            [data-pw-form] button[data-primary] * {
              color: #ffffff !important;
            }

            [data-pw-form] button[type="submit"]:hover,
            [data-pw-form] button[data-primary]:hover {
              transform: translateY(-2px);
              box-shadow:
                inset 0 1px 0 0 rgba(255,255,255,0.2),
                0 4px 8px rgba(0,0,0,0.1),
                0 18px 36px -12px rgba(0,0,0,0.55) !important;
            }

            [data-pw-form] button[type="submit"]:disabled {
              opacity: 0.6 !important;
              cursor: not-allowed !important;
              transform: none !important;
            }

            /* Any section/card inside the form → flatten */
            [data-pw-form] > div,
            [data-pw-form] section,
            [data-pw-form] form {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              border-radius: 0 !important;
            }

            /* Text inside form */
            [data-pw-form] h1,
            [data-pw-form] h2,
            [data-pw-form] h3 {
              color: rgba(0,0,0,0.9) !important;
              font-weight: 600 !important;
              letter-spacing: -0.01em !important;
            }

            [data-pw-form] p,
            [data-pw-form] small,
            [data-pw-form] span {
              color: rgba(0,0,0,0.6);
            }

            [data-pw-form] a {
              color: rgba(0,0,0,0.75) !important;
              text-decoration: underline;
              text-underline-offset: 2px;
              transition: color 0.3s;
            }

            [data-pw-form] a:hover {
              color: #000 !important;
            }

            /* Grids inside form → responsive */
            [data-pw-form] .grid,
            [data-pw-form] [class*="grid-cols"] {
              gap: 10px !important;
            }

            /* Prevent any fixed-width flex rows from overflowing */
            [data-pw-form] [class*="flex"],
            [data-pw-form] [class*="grid"] {
              min-width: 0 !important;
            }

            /* Any error/success box inside form */
            [data-pw-form] [class*="error"],
            [data-pw-form] [class*="Error"] {
              background: rgba(254, 226, 226, 0.6) !important;
              border: 1px solid rgba(252, 165, 165, 0.7) !important;
              color: #991b1b !important;
              border-radius: 14px !important;
              padding: 12px 14px !important;
              backdrop-filter: blur(14px);
            }

            [data-pw-form] [class*="success"],
            [data-pw-form] [class*="Success"] {
              background: rgba(209, 250, 229, 0.6) !important;
              border: 1px solid rgba(110, 231, 183, 0.7) !important;
              color: #065f46 !important;
              border-radius: 14px !important;
              padding: 12px 14px !important;
              backdrop-filter: blur(14px);
            }

            @media (prefers-reduced-motion: reduce) {
              [data-pw-anim],
              [data-pw-form] * {
                animation: none !important;
                transition: none !important;
              }
            }
          `,
        }}
      />

      {/* Background */}
      <PageBackground />

      {/* ============================================================ */}
      {/*  CONTENT                                                      */}
      {/* ============================================================ */}
      <div className={containerCls}>
        {/* ============================================================ */}
        {/*  HERO BANNER                                                  */}
        {/* ============================================================ */}
        <div
          data-pw-anim
          className="relative w-full overflow-hidden rounded-3xl border border-white/[0.4] p-6 sm:p-8"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.30) 100%)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 30px 64px -28px rgba(0,0,0,0.34)",
            animation:
              "pw-banner-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both",
          }}
        >
          {/* Top sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
            }}
          />

          {/* Floating light blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(180,200,255,0.5) 0%, rgba(180,200,255,0) 70%)",
              filter: "blur(36px)",
              animation: "pw-float-soft 7s ease-in-out infinite",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,180,0.45) 0%, rgba(255,200,180,0) 70%)",
              filter: "blur(36px)",
              animation: "pw-float-soft 7s ease-in-out 1.4s infinite",
            }}
          />

          <div className="relative">
            {/* Kicker */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 backdrop-blur-md">
              <span
                className="h-1.5 w-1.5 rounded-full bg-black/80"
                style={{
                  animation: "pw-float-soft 2.4s ease-in-out infinite",
                }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/70">
                Security
              </span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1
                  className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-black sm:text-3xl"
                  style={{
                    textShadow:
                      "0 1px 12px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.6)",
                  }}
                >
                  Change password
                </h1>
                <p className="max-w-md text-[13.5px] leading-6 text-black/70">
                  Verify your identity with a one-time code sent to your
                  email, then choose a new password.
                </p>
              </div>

              <Link
                href="/dashboard/security"
                className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full border border-white/40 bg-white/40 px-3.5 py-2 text-[12px] font-medium text-black/75 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
              >
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center transition-transform duration-500 group-hover:-translate-x-0.5"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </span>
                Back to Security
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  FORM CARD — liquid glass wrapper                             */}
        {/* ============================================================ */}
        <section
          className="relative w-full overflow-hidden rounded-3xl border border-white/[0.35] p-5 sm:p-7"
          style={{
            background:
              "radial-gradient(120% 120% at 30% 12%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.40) 45%, rgba(255,255,255,0.28) 100%)",
            backdropFilter: "blur(26px) saturate(180%)",
            WebkitBackdropFilter: "blur(26px) saturate(180%)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.85), inset 0 0 0 1px rgba(255,255,255,0.35), 0 2px 4px rgba(0,0,0,0.04), 0 18px 42px -22px rgba(0,0,0,0.28)",
            animation:
              "pw-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
          }}
        >
          {/* Top sheen */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)",
            }}
          />

          <div className="relative w-full">
            {/* Section heading */}
            <div className="mb-5 flex items-center gap-3">
              <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
                Verification
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0))",
                }}
              />
            </div>

            {/* The OTP form — wrapped so we can scope styles */}
            <div data-pw-form className="w-full">
              <PasswordOtpForm mode="change" />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  HELP TEXT                                                    */}
        {/* ============================================================ */}
        <p
          className="pb-2 text-center text-[12px] text-black/55"
          style={{
            animation:
              "pw-item-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both",
          }}
        >
          Having trouble? Contact support at{" "}
          <a
            href="mailto:support@binzeo.com"
            className="text-black/75 underline decoration-black/30 underline-offset-2 transition-colors hover:text-black"
          >
            support@binzeo.com
          </a>
        </p>
      </div>
    </div>
  );
}
