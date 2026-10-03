import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Binzeo ID — Your Digital Identity",
    template: "%s | Binzeo ID",
  },
  description:
    "Create, manage, and share your secure digital identity with Binzeo ID.",
  keywords: ["Binzeo", "Digital ID", "Identity", "BZ-U"],
  authors: [{ name: "Binzeo Labs" }],
  openGraph: {
    title: "Binzeo ID — Your Digital Identity",
    description: "Create, manage, and share your secure digital identity.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header isLoggedIn={Boolean(user)} />
        <div className="flex min-h-0 flex-1 flex-col pt-[72px]">{children}</div>
        <Footer isLoggedIn={Boolean(user)} />
      </body>
    </html>
  );
}
