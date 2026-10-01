import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1f1f2e] bg-[#0a0a0f]/80 backdrop-blur-lg">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-sm">
            B
          </div>
          <span className="font-semibold text-lg">Binzeo ID</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-gray-300 hover:text-white px-3 py-2"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
