import Loader from "@/components/ui/Loader";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa]" aria-live="polite" aria-busy="true">
      <Loader size="lg" label="Loading…" />
    </main>
  );
}
