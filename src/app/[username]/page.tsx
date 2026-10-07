import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeUsername } from "@/lib/username";

export default async function PublicUsernamePage({ params }: { params: Promise<{ username: string }> }) {
  const raw = (await params).username;
  if (!raw.startsWith("@")) notFound();
  const username = normalizeUsername(raw);
  const { data: profile } = await getSupabaseAdmin()
    .from("profiles")
    .select("id, username, display_name, first_name, last_name, country_code")
    .eq("username", username)
    .eq("account_status", "active")
    .maybeSingle();
  if (!profile) notFound();

  const { data: authUser } = await getSupabaseAdmin().auth.admin.getUserById(profile.id);
  if (!authUser.user?.email) notFound();
  const name = profile.display_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "BINZEO user";

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-16 text-[#111]">
      <div className="mx-auto max-w-md rounded-3xl border border-[#d8d8d8] bg-white p-8 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.35)]">
        <Link href="/" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777]">BINZEO</Link>
        <div className="mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#111] text-2xl font-semibold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">{name}</h1>
        <p className="mt-1 text-sm text-[#666]">@{profile.username}</p>
        <div className="mt-8 space-y-3 border-t border-[#e5e5e5] pt-6 text-sm">
          <div><span className="text-[#888]">Email</span><p className="mt-1 font-medium">{authUser.user.email}</p></div>
          <div><span className="text-[#888]">Country</span><p className="mt-1 font-medium">{profile.country_code?.trim().toUpperCase() || "Not set"}</p></div>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-[#888]">This public profile intentionally shows only basic identity information.</p>
      </div>
    </main>
  );
}
