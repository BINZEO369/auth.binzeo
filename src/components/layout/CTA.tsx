import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 sm:py-28 border-t border-[#1f1f2e]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-[#12121a] to-[#12121a] p-8 sm:p-16 text-center overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Ready to claim your ID?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of users already using Binzeo ID to own their
              digital identity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-600/30"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#1f1f2e] hover:border-indigo-500/50 text-gray-300 hover:text-white font-medium transition-all"
              >
                I already have an ID
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
