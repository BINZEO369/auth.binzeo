import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Authorize application",
  description: "Sign in securely with BINZEO Central Auth",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OAuthAuthorizePage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
