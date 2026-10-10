import { Suspense } from "react";
import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Binzeo ID account",
};

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
