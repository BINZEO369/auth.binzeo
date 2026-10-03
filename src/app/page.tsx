import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const highlights = [
  ["01", "One place", "Keep your profile, access, and connections inside one calm, portable space."],
  ["02", "Protected", "Passkeys, verified sessions, and thoughtful controls make secure access effortless."],
  ["03", "Portable", "Share what is useful, keep what is private, and stay in control wherever you go."],
] as const;

const journey = [
  ["01", "Create", "Set up your BINZEO ID."],
  ["02", "Protect", "Choose modern authentication."],
  ["03", "Connect", "Go further with confidence."],
] as const;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  return (
    <main className="liquid-page relative isolate overflow-hidden bg-[#041018] text-white">
      <div aria-hidden="true" className="liquid-background" />
      <div aria-hidden="true" className="liquid-grid" />
      <div aria-hidden="true" className="liquid-orb liquid-orb-one" />
      <div aria-hidden="true" className="liquid-orb liquid-orb-two" />
      <div aria-hidden="true" className="liquid-orb liquid-orb-three" />

      <section className="relative mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:gap-20">
          <div className="max-w-2xl">
            <div className="liquid-kicker inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-50/80 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_16px_4px_rgba(103,232,249,0.7)]" />
              A calmer digital identity
            </div>
            <h1 className="mt-7 text-[clamp(3.4rem,8vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.075em]">
              One ID.<br /><span className="liquid-gradient-text">More possibility.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-cyan-50/70 sm:text-lg sm:leading-8">
              BINZEO gives your digital identity a secure home — beautifully simple, ready for every place your life takes you.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="liquid-button liquid-button-primary px-6 py-3.5 text-sm">
                {isLoggedIn ? "Open your dashboard" : "Create your BINZEO ID"} <span aria-hidden="true">↗</span>
              </Link>
              {!isLoggedIn && <Link href="/signin" className="liquid-button liquid-button-ghost px-6 py-3.5 text-sm">Sign in</Link>}
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-cyan-50/50">
              <span>Passkey ready</span><span>Private by design</span><span>Made for people</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[430px] lg:ml-auto">
            <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="liquid-card liquid-card-main relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
              <div className="relative aspect-[0.82] overflow-hidden rounded-[1.45rem]">
                <Image src="/images/img11.jpg" alt="Abstract blue digital security network" fill priority sizes="(max-width: 1024px) 90vw, 430px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#031019] via-[#031019]/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-50/65"><span>BINZEO ID</span><span>01 / 01</span></div>
                  <div className="mt-3 flex items-end justify-between gap-4"><div><p className="text-2xl font-medium tracking-[-0.05em] sm:text-3xl">Your identity.</p><p className="mt-1 text-xs text-cyan-50/60">Secure, portable, unmistakably yours.</p></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-lg text-cyan-100 backdrop-blur-xl">⌁</span></div>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 pt-4 text-xs text-cyan-50/55"><span>Trusted identity layer</span><span className="flex items-center gap-1.5 text-cyan-100/80"><i className="h-1.5 w-1.5 rounded-full bg-cyan-200" /> Active</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-white/10 pb-5"><div><p className="liquid-section-label">The BINZEO difference</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] sm:text-4xl">Less noise. More control.</h2></div><span className="hidden text-right text-xs leading-5 text-cyan-50/45 sm:block">A better foundation<br />for your digital life.</span></div>
        <div className="grid gap-3 md:grid-cols-3">
          {highlights.map(([number, title, text]) => <article key={number} className="liquid-card liquid-card-hover group rounded-3xl p-6 sm:p-7"><div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-cyan-100/55"><span>{title}</span><span>{number}</span></div><p className="mt-16 max-w-sm text-sm leading-6 text-cyan-50/60">{text}</p><span aria-hidden="true" className="mt-8 block text-cyan-200/70 transition-transform duration-500 group-hover:translate-x-1">↗</span></article>)}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8 sm:pb-36 lg:px-10">
        <div className="liquid-card overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-12"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20"><div><p className="liquid-section-label">A simple beginning</p><h2 className="mt-4 max-w-md text-3xl font-medium leading-tight tracking-[-0.055em] sm:text-4xl">Start with one ID. Go anywhere.</h2></div><div className="grid gap-6 sm:grid-cols-3">{journey.map(([number, title, detail]) => <div key={number} className="border-t border-white/15 pt-4"><span className="text-xs font-mono text-cyan-100/45">{number}</span><h3 className="mt-7 text-base font-medium">{title}</h3><p className="mt-2 text-sm leading-6 text-cyan-50/55">{detail}</p></div>)}</div></div></div>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-5 pb-28 text-center sm:px-8 sm:pb-40"><div className="mx-auto max-w-3xl"><p className="liquid-section-label">Your next chapter</p><h2 className="mt-4 text-[clamp(2.8rem,7vw,6.4rem)] font-semibold leading-[0.94] tracking-[-0.075em]">Make your identity<br /><span className="liquid-gradient-text">feel like yours.</span></h2><p className="mx-auto mt-6 max-w-lg text-base leading-7 text-cyan-50/60">A secure, memorable starting point for everything you do online.</p><div className="mt-8 flex justify-center"><Link href={isLoggedIn ? "/dashboard" : "/signup"} className="liquid-button liquid-button-light px-7 py-3.5 text-sm">{isLoggedIn ? "Go to dashboard" : "Create your BINZEO ID"} <span aria-hidden="true">↗</span></Link></div></div></section>
    </main>
  );
}
