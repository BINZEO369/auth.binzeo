import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Features from "@/components/layout/Features";
import HowItWorks from "@/components/layout/HowItWorks";
import CTA from "@/components/layout/CTA";
import Footer from "@/components/layout/Footer";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6faf9]">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <Hero isLoggedIn={isLoggedIn} />
        <Features />
        <HowItWorks />
        <CTA isLoggedIn={isLoggedIn} />
      </main>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
}
