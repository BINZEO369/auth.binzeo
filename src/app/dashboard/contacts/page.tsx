import { redirect } from "next/navigation";

export default function ContactsPage() {
  redirect("/dashboard/profile?section=contacts");
}
