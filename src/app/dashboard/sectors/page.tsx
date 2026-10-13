import { redirect } from "next/navigation";

export default function SectorsPage() {
  redirect("/dashboard/profile?section=sectors");
}
