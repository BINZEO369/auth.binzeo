import { Suspense } from "react";
import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Binzeo ID account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-[#6d7c80]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
