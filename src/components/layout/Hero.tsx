import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Now available
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
          Your Digital Identity,{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
            Reimagined
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-10">
          Create, manage, and share your secure digital identity with Binzeo
          ID. One account — endless possibilities.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/20"
          >
            Create your ID
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#1f1f2e] hover:border-indigo-500/50 text-gray-300 hover:text-white font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
