import { Suspense } from "react";
import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Binzeo ID account",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center text-[#6d7c80]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
