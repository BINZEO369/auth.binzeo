import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
