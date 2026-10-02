import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#d5dfdd] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#78c3e4] to-[#3f86b2] flex items-center justify-center font-bold text-[#101820] text-sm">
                B
              </div>
              <span className="font-semibold text-[#101820]">
                Binzeo <span className="text-[#216f9e]">ID</span>
              </span>
            </Link>
            <p className="text-sm text-[#6d7c80] max-w-xs">
              Your secure digital identity — create, manage and share with one
              click.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#101820] mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-[#6d7c80]">
              <li>
                <Link href="/register" className="hover:text-[#101820] transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#101820] transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[#101820] transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#101820] mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-[#6d7c80]">
              <li>
                <Link href="#" className="hover:text-[#101820] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#101820] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#101820] transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#d5dfdd] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6d7c80]">
            © {year} Binzeo Labs. All rights reserved.
          </p>
          <p className="text-xs text-[#849295]">
            Built with Next.js · Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
