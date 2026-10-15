import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { centralApiGet } from "@/lib/central-api";
import DashboardShell from "@/components/dashboard/DashboardShell";

type DashboardProfile = {
  binzeo_user_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  account_status?: string | null;
};
type Verification = { verification_type: string; verification_status: string | null };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let email: string | null = null;
  let profile: DashboardProfile | null = null;
  let verificationStatus: string | null = null;

  if (process.env.CENTRAL_API_ENABLED === "true") {
    const [profileResult, verificationResult] = await Promise.all([
      centralApiGet<{ user: { id: string; email?: string | null }; profile: DashboardProfile | null }>("/v1/user/profile"),
      centralApiGet<{ verifications: Verification[] }>("/v1/user/verification-records"),
    ]);
    if (!profileResult.ok || !verificationResult.ok) redirect("/signin?error=service_unavailable");
    email = profileResult.data.user.email ?? null;
    profile = profileResult.data.profile;
    verificationStatus = verificationResult.data.verifications.find((item) => item.verification_type === "email")?.verification_status ?? null;
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/signin?next=/dashboard");
    email = user.email ?? null;
    const [{ data: profileData }, { data: verification }] = await Promise.all([
      supabase.from("profiles").select("binzeo_user_id,first_name,last_name,display_name,account_status").eq("id", user.id).maybeSingle(),
      supabase.from("user_verification_records").select("verification_status").eq("user_id", user.id).eq("verification_type", "email").maybeSingle(),
    ]);
    profile = profileData;
    verificationStatus = verification?.verification_status ?? null;
  }

  const isPendingVerification = profile?.account_status === "pending" && verificationStatus !== "verified";
  const emailVerified = verificationStatus === "verified";
  if (profile?.account_status !== "active" && !isPendingVerification) redirect("/signin?blocked=1");
  if (isPendingVerification) redirect("/signin?verification_required=1");

  return <DashboardShell user={{
    email,
    binzeo_user_id: profile?.binzeo_user_id ?? null,
    first_name: profile?.first_name ?? null,
    display_name: profile?.display_name ?? null,
    account_status: profile?.account_status ?? null,
    email_verified: emailVerified,
  }}>{children}</DashboardShell>;
}
