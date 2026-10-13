import { redirect } from "next/navigation";

export default function LegacyDashboardSectionPage() {
  redirect("/dashboard/profile");
}
