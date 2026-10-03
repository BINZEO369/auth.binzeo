import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-hidden pt-[72px] text-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
