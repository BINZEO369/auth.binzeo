import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1f1f2e] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-500/50 transition-shadow">
            B
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">
            Binzeo <span className="text-indigo-400">ID</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-gray-300 hover:text-white px-3 py-2 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
