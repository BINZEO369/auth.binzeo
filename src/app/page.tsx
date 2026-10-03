import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  return (
    <main className="liquid-page min-h-full overflow-hidden bg-[#07111a] text-white">
      <section className="relative isolate min-h-[calc(100dvh-72px)] overflow-hidden">
        <div className="liquid-background" aria-hidden="true" />
        <div className="liquid-grid" aria-hidden="true" />
        <div className="liquid-orb liquid-orb-one" aria-hidden="true" />
        <div className="liquid-orb liquid-orb-two" aria-hidden="true" />
        <div className="liquid-orb liquid-orb-three" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-160px)] w-full max-w-7xl items-center px-5 pb-14 pt-10 sm:px-8 sm:pb-20 lg:px-10">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div className="max-w-3xl">
              <div className="liquid-kicker mb-7 inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 text-xs font-medium tracking-[0.12em] text-cyan-50/90 uppercase sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]" />
                Your identity, beautifully connected
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.65rem]">
                A calmer way to own your <span className="liquid-gradient-text">digital identity.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                BINZEO brings your profile, access, and connections into one secure space—so you can move through the digital world with less friction.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {isLoggedIn ? (
                  <Link href="/dashboard" className="liquid-button liquid-button-primary px-6 py-3.5 text-sm sm:text-base">
                    Open your dashboard <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className="liquid-button liquid-button-primary px-6 py-3.5 text-sm sm:text-base">
                      Create your BINZEO ID <span aria-hidden="true">→</span>
                    </Link>
                    <Link href="/signin" className="liquid-button liquid-button-ghost px-6 py-3.5 text-sm sm:text-base">
                      I already have an ID
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/45 sm:text-sm">
                <span className="flex items-center gap-2"><span className="text-cyan-300">✦</span> Personal profile</span>
                <span className="flex items-center gap-2"><span className="text-cyan-300">✦</span> Secure access</span>
                <span className="flex items-center gap-2"><span className="text-cyan-300">✦</span> One memorable ID</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <div className="liquid-card liquid-card-main relative overflow-hidden rounded-[2rem] p-5 sm:p-7">
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden="true" />
                <div className="relative flex items-center justify-between border-b border-white/15 pb-5">
                  <div>
                    <p className="text-xs tracking-[0.18em] text-white/45 uppercase">Your identity</p>
                    <p className="mt-2 text-lg font-medium text-white">A profile that feels like you.</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/25 bg-emerald-300/15 text-emerald-200">✓</span>
                </div>

                <div className="relative mt-6 rounded-3xl border border-white/15 bg-[#09202b]/55 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-200 to-blue-500 text-xl font-semibold text-[#08202b] shadow-lg shadow-cyan-400/20">B</div>
                    <div>
                      <p className="font-medium text-white">BINZEO member</p>
                      <p className="mt-1 font-mono text-xs text-cyan-100/65">BZ-U-XXXXXX</p>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3">
                      <p className="text-[10px] tracking-[0.14em] text-white/40 uppercase">Status</p>
                      <p className="mt-2 text-sm text-emerald-200">Protected</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3">
                      <p className="text-[10px] tracking-[0.14em] text-white/40 uppercase">Access</p>
                      <p className="mt-2 text-sm text-white/80">Always yours</p>
                    </div>
                  </div>
                </div>

                <div className="relative mt-5 flex items-center justify-between text-xs text-white/45">
                  <span>Simple on the surface</span>
                  <span className="flex items-center gap-1.5 text-cyan-200/80"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> Built for trust</span>
                </div>
              </div>
              <div className="liquid-float-card absolute -bottom-7 -left-5 hidden rounded-2xl px-4 py-3 sm:block">
                <p className="text-[10px] tracking-[0.14em] text-white/45 uppercase">One account</p>
                <p className="mt-1 text-sm font-medium text-white">Endless possibilities</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-8 text-xs text-white/40 sm:px-8 lg:px-10">
          <span>Scroll to explore</span>
          <span className="hidden items-center gap-2 sm:flex"><span className="h-px w-12 bg-white/25" /> Digital identity, reimagined</span>
        </div>
      </section>

      <section id="why-binzeo" className="relative border-t border-white/10 bg-[#07111a]/90 px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="liquid-section-label">The BINZEO difference</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">Less noise. More control.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/55 sm:text-lg">Everything you need to show up online with a clear, secure, and unmistakably personal identity.</p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit.number} className="liquid-card liquid-card-hover rounded-3xl p-6 sm:p-7">
                <div className="flex items-center justify-between text-sm text-cyan-200/75"><span>{benefit.number}</span><span aria-hidden="true">↗</span></div>
                <h3 className="mt-14 text-2xl font-medium tracking-[-0.03em] text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative overflow-hidden border-t border-white/10 px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_30%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="liquid-section-label">A simple beginning</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">Start with one ID. Go anywhere.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.label} className="liquid-step rounded-3xl p-5">
                <span className="text-xs text-cyan-200/70">0{index + 1}</span>
                <h3 className="mt-10 text-lg font-medium text-white">{step.label}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="border-t border-white/10 px-5 py-20 sm:px-8 lg:px-10">
        <div className="liquid-card mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] p-7 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="liquid-section-label">Built for your next chapter</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Your identity should open doors, not create more work.</h2>
          </div>
          {!isLoggedIn && <Link href="/signup" className="liquid-button liquid-button-light shrink-0 px-6 py-3.5 text-sm">Create your ID <span aria-hidden="true">→</span></Link>}
        </div>
      </section>

    </main>
  );
}
