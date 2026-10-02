import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d5dfdd] bg-[#eef2f1]/80 backdrop-blur-xl">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="BINZEO"
            width={122}
            height={29}
            priority
            className="h-8 w-auto transition-opacity group-hover:opacity-70"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-[#5c6b70] hover:text-[#101820] transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how"
            className="text-sm text-[#5c6b70] hover:text-[#101820] transition-colors"
          >
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-[#35454c] hover:text-[#101820] px-3 py-2 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-[#101820] hover:bg-[#263746] text-[#101820] px-4 py-2 rounded-lg transition-colors shadow-lg shadow-[#9bd8c7]/25"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
