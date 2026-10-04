import { Metadata } from "next";
import PasswordOtpForm from "@/components/auth/PasswordOtpForm";

export const metadata: Metadata = {
  title: "Password Reset",
  description: "Reset your BINZEO account password securely with email OTP verification.",
};

export default function ForgotPasswordPage() {
  return <PasswordOtpForm mode="reset" />;
}
