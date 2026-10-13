import { redirect } from "next/navigation";

export default function AddressesPage() {
  redirect("/dashboard/profile?section=addresses");
}
