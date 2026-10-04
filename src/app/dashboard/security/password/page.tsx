import { Metadata } from "next";
import PasswordOtpForm from "@/components/auth/PasswordOtpForm";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Change your BINZEO account password with email OTP verification.",
};

export default function ChangePasswordPage() {
  return <PasswordOtpForm mode="change" />;
}
