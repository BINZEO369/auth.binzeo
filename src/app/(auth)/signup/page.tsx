import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your secure Binzeo ID account",
};

export default function SignUpPage() {
  return <RegisterForm />;
}
