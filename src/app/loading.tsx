import Image from "next/image";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6faf9]" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-6">
        <Image src="/logo.svg" alt="BINZEO" width={156} height={37} priority className="h-9 w-auto" />
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#b4ded3] border-t-[#216f9e]" role="status" aria-label="Loading" />
      </div>
    </main>
  );
}
