import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-glow" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-36 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm mb-6 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse-slow" />
          Now available for everyone
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up delay-100">
          Your Digital Identity,
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Reimagined
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-10 animate-fade-up delay-200">
          Create, manage, and share your secure digital identity with Binzeo
          ID. One account — endless possibilities with a single{" "}
          <span className="text-indigo-400 font-mono text-sm">
            BZ-U-XXXXXX
          </span>{" "}
          ID.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up delay-300">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-600/30"
          >
            Create your ID
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#1f1f2e] hover:border-indigo-500/50 text-gray-300 hover:text-white font-medium transition-all"
          >
            Sign in
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-up delay-300">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              BZ-U
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">
              Unique ID Format
            </div>
          </div>
          <div className="border-x border-[#1f1f2e]">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              256-bit
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">
              Encryption
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              24/7
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">
              Availability
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
