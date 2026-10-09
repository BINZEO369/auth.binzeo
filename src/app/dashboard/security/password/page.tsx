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
  "relative z-10 mx-auto max-w-3xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-5 sm:py-8";

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
    <div className="relative isolate min-h-[80vh]">
      {/* ============================================================ */}
      {/*  KEYFRAMES                                                    */}
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
            @media (prefers-reduced-motion: reduce) {
              [data-pw-anim] {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
                filter: none !important;
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
          className="relative overflow-hidden rounded-3xl border border-white/[0.4] p-6 sm:p-9"
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

            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0">
                <h1
                  className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-black sm:text-3xl"
                  style={{
                    textShadow:
                      "0 1px 12px rgba(255,255,255,0.85), 0 1px 2px rgba(255,255,255,0.6)",
                  }}
                >
                  Change password
                </h1>
                <p className="max-w-lg text-[13.5px] leading-6 text-black/70">
                  Verify your identity with a one-time code sent to your
                  email, then choose a new password.
                </p>
              </div>

              <Link
                href="/dashboard/security"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/40 bg-white/40 px-3.5 py-2 text-[12px] font-medium text-black/75 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/60 hover:text-black"
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
          className="relative overflow-hidden rounded-3xl border border-white/[0.35] p-6 sm:p-7"
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

          <div className="relative">
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

            {/* The OTP form itself */}
            <PasswordOtpForm mode="change" />
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
