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

  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("binzeo_user_id, first_name, last_name, display_name, account_status")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <DashboardShell
      user={{
        email: user.email ?? null,
        binzeo_user_id: profile?.binzeo_user_id ?? null,
        first_name: profile?.first_name ?? null,
        display_name: profile?.display_name ?? null,
        account_status: profile?.account_status ?? null,
      }}
    >
      {children}
    </DashboardShell>
  );
}
