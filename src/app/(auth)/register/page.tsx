import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Binzeo ID account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
