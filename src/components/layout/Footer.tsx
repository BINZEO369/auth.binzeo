"use client";

import Link from "next/link";

export default function Footer({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#dddddd] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b8b8b8] to-[#5e5e5e] flex items-center justify-center font-bold text-[#111111] text-sm">
                B
              </div>
              <span className="font-semibold text-[#111111]">
                Binzeo <span className="text-[#333333]">ID</span>
              </span>
            </Link>
            <p className="text-sm text-[#666666] max-w-xs">
              Your secure digital identity — create, manage and share with one
              click.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111111] mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-[#666666]">
              {isLoggedIn ? (
                <li><Link href="/dashboard" className="hover:text-[#111111] transition-colors">Dashboard</Link></li>
              ) : (
                <>
                  <li><Link href="/signup" className="hover:text-[#111111] transition-colors">Get Started</Link></li>
                  <li><Link href="/signin" className="hover:text-[#111111] transition-colors">Sign in</Link></li>
                </>
              )}
              <li>
                <Link href="#eeeeeetures" className="hover:text-[#111111] transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#111111] mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-[#666666]">
              <li>
                <Link href="#" className="hover:text-[#111111] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#111111] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#111111] transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#dddddd] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#666666]">
            © {year} Binzeo Labs. All rights reserved.
          </p>
          <p className="text-xs text-[#888888]">
            Built with Next.js · Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
