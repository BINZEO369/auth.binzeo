export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#eef2f1]">
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full bg-[#c9e8f1]/60 blur-[120px] pointer-events-none" />
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="relative z-10 p-6 text-center text-xs text-[#6d7c80]">
        © {new Date().getFullYear()} Binzeo Labs · All rights reserved
      </footer>
    </div>
  );
}
