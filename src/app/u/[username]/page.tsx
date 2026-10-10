"use client";

import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Profile = {
  binzeo_user_id: string;
  display_name: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_photo_url: string | null;
  country_code: string | null;
  created_at: string | null;
};

type Contact = {
  contact_type: string;
  contact_value: string;
  label: string | null;
  is_primary: boolean;
};

type ProfileResponse = {
  data?: {
    profile: Profile;
    contacts: Contact[];
    sectors: Array<{ status: string; sectors: { sector_code: string; sector_name: string } | null }>;
  };
  error?: string;
};

function cleanUsername(value: string) {
  return decodeURIComponent(value).replace(/^@+/, "").trim().toLowerCase();
}

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const [rawUsername, setRawUsername] = useState("");
  const [result, setResult] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    params.then(({ username }) => {
      const clean = cleanUsername(username);
      setRawUsername(clean);
      if (!clean) {
        setLoading(false);
        return;
      }
      fetch(`/api/profile/by-username/${encodeURIComponent(clean)}`)
        .then((response) => response.json())
        .then((data: ProfileResponse) => {
          if (!cancelled) setResult(data);
        })
        .catch(() => {
          if (!cancelled) setResult({ error: "Unable to load this profile" });
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [params]);

  const profile = result?.data?.profile;
  const name = useMemo(
    () => profile?.display_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || `@${rawUsername}`,
    [profile, rawUsername]
  );

  if (loading) {
    return <Loader variant="public-profile" />;
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
        <section className="w-full max-w-md rounded-3xl border border-[#dedede] bg-white p-10 text-center shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#888]">Binzeo profile</p>
          <h1 className="text-2xl font-semibold text-[#202020]">Profile not found</h1>
          <p className="mt-3 text-[#666]">The public profile <strong>@{rawUsername}</strong> does not exist or is not active.</p>
          <Link className="mt-7 inline-block rounded-full bg-[#202020] px-6 py-3 text-sm font-medium text-white" href="/">Go to Binzeo</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-6 py-12 sm:py-20">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#dedede] bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-br from-[#dceff0] via-[#f5f5f5] to-[#e3e8ed]" />
        <div className="px-6 pb-10 sm:px-10">
          <div className="-mt-14 flex flex-col items-center text-center">
            {profile.profile_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profile_photo_url} alt={name} className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md" />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#202020] text-3xl font-semibold text-white shadow-md">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="mt-5 text-3xl font-semibold text-[#202020]">{name}</h1>
            <p className="mt-1 text-[#777]">@{profile.username || rawUsername}</p>
            {profile.country_code && <p className="mt-2 text-sm text-[#999]">{profile.country_code}</p>}
          </div>

          {result.data?.contacts?.length ? (
            <div className="mt-9 border-t border-[#eeeeee] pt-7">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#777]">Contact</h2>
              <div className="mt-4 space-y-3">
                {result.data.contacts.map((contact) => (
                  <a key={`${contact.contact_type}-${contact.contact_value}`} href={contact.contact_value.startsWith("http") ? contact.contact_value : undefined} className="block rounded-2xl bg-[#f7f7f7] px-4 py-3 text-[#333]">
                    <span className="text-xs uppercase tracking-wide text-[#999]">{contact.label || contact.contact_type}</span>
                    <span className="mt-1 block break-all text-sm">{contact.contact_value}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
