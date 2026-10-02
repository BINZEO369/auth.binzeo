export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <main className="min-h-[calc(100vh-52px)] w-full px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-md items-center justify-center">
          {children}
        </div>
      </main>
      <footer className="bg-[#050607] px-6 pb-5 text-center text-xs text-[#777d85]">
        © {new Date().getFullYear()} Binzeo Labs · All rights reserved
      </footer>
    </div>
  );
}
