import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
