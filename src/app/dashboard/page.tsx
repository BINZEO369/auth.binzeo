"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type Profile = {
  binzeo_user_id: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  country_code: string | null;
  account_status: string | null;
  profile_photo_url: string | null;
  created_at: string;
};

type Data = {
  profile: Profile | null;
  user: { id: string; email: string | null };
};

function Card({
  title,
  value,
  hint,
  href,
}: {
  title: string;
  value: string;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <div className="p-5 rounded-2xl border border-[#1f1f2e] bg-[#0d0d13] hover:border-indigo-500/40 transition-colors h-full">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="text-lg font-semibold text-white truncate">{value}</div>
      {hint && <div className="text-xs text-gray-600 mt-1">{hint}</div>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<Data>("/api/user/profile");
      if (res.success) setData(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profile = data?.profile;
  const name = profile?.display_name || profile?.first_name || "User";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-[#0d0d13] to-[#0d0d13]">
        <div className="text-sm text-gray-400 mb-1">Welcome back,</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {name}
        </h1>
        {profile?.binzeo_user_id && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-xs text-gray-400">Your ID</span>
            <span className="font-mono text-sm text-indigo-400 font-medium">
              {profile.binzeo_user_id}
            </span>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card
          title="Account Status"
          value={profile?.account_status ?? "—"}
          hint={profile?.account_status === "active" ? "Verified" : "Action needed"}
        />
        <Card
          title="Country"
          value={profile?.country_code ?? "Not set"}
          hint="Your region"
          href="/dashboard/profile"
        />
        <Card
          title="Member Since"
          value={
            profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"
          }
        />
        <Card
          title="Email"
          value={data?.user.email ? "Set" : "—"}
          hint={data?.user.email ?? ""}
        />
      </div>

      {/* Sections */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Manage
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/dashboard/profile", title: "Profile", desc: "Personal info, photo, preferences" },
            { href: "/dashboard/addresses", title: "Addresses", desc: "Home, work, billing addresses" },
            { href: "/dashboard/contacts", title: "Contacts", desc: "Website, social, messenger" },
            { href: "/dashboard/sectors", title: "Sectors", desc: "Join industry sectors" },
            { href: "/dashboard/devices", title: "Devices", desc: "Logged-in devices" },
            { href: "/dashboard/security", title: "Security", desc: "Login history, activity log" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-5 rounded-2xl border border-[#1f1f2e] bg-[#0d0d13] hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-white font-medium group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
