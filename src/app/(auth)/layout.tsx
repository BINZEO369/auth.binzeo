import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#101820]/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <header className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#78c3e4] to-[#3f86b2] flex items-center justify-center font-bold text-[#101820] text-sm shadow-lg shadow-[#9bd8c7]/35">
            B
          </div>
          <span className="font-semibold text-lg tracking-tight text-[#101820]">
            Binzeo <span className="text-[#216f9e]">ID</span>
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="p-6 text-center text-xs text-[#6d7c80]">
        © {new Date().getFullYear()} Binzeo Labs · All rights reserved
      </footer>
    </div>
  );
}
