import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Binzeo ID — Your Digital Identity",
  description: "Create, manage and share your secure digital identity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
