import { Suspense } from "react";
import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import Loader from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Binzeo ID account",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<Loader size="sm" label="Loading…" className="text-[#666666]" />}>
      <LoginForm />
    </Suspense>
  );
}
