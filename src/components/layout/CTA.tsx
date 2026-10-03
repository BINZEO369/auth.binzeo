import Link from "next/link";

export default function CTA({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section className="py-20 sm:py-28 border-t border-[#dddddd]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl border border-[#c9c9c9] bg-[#ececec] p-8 sm:p-16 text-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 grayscale"
            style={{ backgroundImage: "url('/images/binzeo-cloud-card.jpg')" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/55 to-[#eeeeee]/75"
            aria-hidden="true"
          />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#111111]/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Ready to claim your ID?
            </h2>
            <p className="text-[#6666666] mb-8 max-w-lg mx-auto">
              Join thousands of users already using Binzeo ID to own their
              digital identity.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-full rounded-xl bg-[#111111] px-6 py-3 text-center font-semibold text-white shadow-lg shadow-[#cfcfcf]/35 transition hover:-translate-y-0.5 hover:bg-[#2b2b2b] sm:w-auto">Go to Dashboard →</Link>
              ) : (
                <>
                  <Link href="/signup" className="w-full rounded-xl bg-[#111111] px-6 py-3 text-center font-medium text-white shadow-lg shadow-[#cfcfcf]/35 transition-all hover:scale-105 hover:bg-[#2b2b2b] sm:w-auto">Get started — it&apos;s free</Link>
                  <Link href="/signin" className="w-full rounded-xl border border-[#dddddd] px-6 py-3 text-center font-medium text-[#444444] transition-all hover:border-[#aaaaaa] hover:text-[#111111] sm:w-auto">I already have an ID</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
