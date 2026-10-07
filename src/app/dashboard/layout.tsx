import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("binzeo_user_id, first_name, last_name, display_name, account_status")
    .eq("id", user.id)
    .maybeSingle();

  const { data: verification } = await supabase
    .from("user_verification_records")
    .select("verification_status")
    .eq("user_id", user.id)
    .eq("verification_type", "email")
    .maybeSingle();
  const isPendingVerification =
    profile?.account_status === "pending" &&
    verification?.verification_status !== "verified";
  const emailVerified = verification?.verification_status === "verified";
  if (profile?.account_status !== "active" && !isPendingVerification) {
    redirect("/signin?blocked=1");
  }
  if (isPendingVerification) {
    redirect("/signin?verification_required=1");
  }

  return (
    <DashboardShell
      user={{
        email: user.email ?? null,
        binzeo_user_id: profile?.binzeo_user_id ?? null,
        first_name: profile?.first_name ?? null,
        display_name: profile?.display_name ?? null,
        account_status: profile?.account_status ?? null,
        email_verified: emailVerified,
      }}
    >
      {children}
    </DashboardShell>
  );
}
