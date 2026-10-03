import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="liquid-page min-h-screen overflow-hidden bg-[#07111a] text-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
