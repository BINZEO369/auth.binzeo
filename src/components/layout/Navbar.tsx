"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-black/50 border-b border-white/10"
          : "backdrop-blur-xl bg-black/20 border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center font-bold text-white text-sm shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4)] group-hover:bg-white/20 transition-all duration-500">
            B
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-white">
            Binzeo <span className="text-white/70">ID</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-[13.5px] text-white/70 hover:text-white transition-colors duration-300"
          >
            Features
          </Link>
          <Link
            href="#how"
            className="text-[13.5px] text-white/70 hover:text-white transition-colors duration-300"
          >
            How it works
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/signin"
            className="hidden sm:inline-flex text-[13.5px] text-white/80 hover:text-white px-3 py-2 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium bg-white text-black px-4 py-2 rounded-full transition-all duration-500 hover:bg-white/90 hover:shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)] hover:-translate-y-px"
          >
            Get Started
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-5 h-5"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur-2xl"
          style={{
            animation: "nav-fade-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <div className="px-4 py-4 space-y-1">
            <Link
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-[14px] text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes nav-fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
