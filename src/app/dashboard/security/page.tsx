"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type LoginEntry = {
  id: string;
  login_method: string | null;
  login_status: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  login_at: string;
  logout_at: string | null;
  user_devices: {
    device_name: string | null;
    device_type: string | null;
    operating_system: string | null;
    os_version: string | null;
    browser: string | null;
    browser_version: string | null;
  } | null;
};

type ActivityEntry = {
  id: string;
  activity_type: string;
  activity_description: string | null;
  ip_address: string | null;
  created_at: string;
};

type AuthMethod = {
  id: string;
  provider: string;
  auth_method: string;
  provider_email: string | null;
  first_seen_at: string;
  last_sign_in_at: string | null;
  login_count: number;
  last_event: string | null;
};

type Verification = {
  id: string;
  verification_type: string;
  verification_status: string;
  verified_at: string | null;
  last_requested_at: string | null;
  expires_at: string | null;
  attempt_count: number;
};

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const TABS = [
  { id: "logins", label: "Login History" },
  { id: "activity", label: "Activity" },
  { id: "methods", label: "Auth Methods" },
  { id: "verifications", label: "Verifications" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SecurityPage() {
  const [tab, setTab] = useState<TabId>("logins");
  const [logins, setLogins] = useState<LoginEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [methods, setMethods] = useState<AuthMethod[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, b, c, d] = await Promise.all([
        apiFetch<{ history: LoginEntry[] }>("/api/user/login-history?limit=50"),
        apiFetch<{ activities: ActivityEntry[] }>(
          "/api/user/activity-logs?limit=50"
        ),
        apiFetch<{ auth_methods: AuthMethod[] }>("/api/user/auth-methods"),
        apiFetch<{ verifications: Verification[] }>(
          "/api/user/verification-records"
        ),
      ]);
      if (a.success) setLogins(a.data.history);
      if (b.success) setActivities(b.data.activities);
      if (c.success) setMethods(c.data.auth_methods);
      if (d.success) setVerifications(d.data.verifications);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#79b9d5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101820] mb-1">Security</h1>
        <p className="text-sm text-[#5c6b70]">
          Monitor your account activity and security settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#d5dfdd] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id
                ? "text-[#216f9e] border-[#79b9d5]"
                : "text-[#5c6b70] border-transparent hover:text-[#101820]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Login History */}
      {tab === "logins" && (
        <div className="space-y-2">
          {logins.length === 0 ? (
            <EmptyState icon="/icons/lock.svg" text="No login history yet." />
          ) : (
            logins.map((l) => (
              <div
                key={l.id}
                className="p-4 rounded-xl border border-[#d5dfdd] bg-white flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        l.login_status === "success"
                          ? "bg-[#dff2e9] text-[#2e8064] border-[#b6e1cf]"
                          : l.login_status === "failed"
                          ? "bg-[#fbe5e2] text-[#b84f4b] border-[#efc7c0]"
                          : l.login_status === "blocked"
                          ? "bg-[#fff3d8] text-[#a47618] border-[#ead39a]"
                          : "bg-[#eef2f1] text-[#5c6b70] border-[#d5dfdd]"
                      }`}
                    >
                      {l.login_status}
                    </span>
                    <span className="text-xs text-[#5c6b70] capitalize">
                      {l.login_method ?? "password"}
                    </span>
                  </div>
                  <div className="text-xs text-[#6d7c80] truncate">
                    {l.ip_address ?? "No IP"} ·{" "}
                    {[l.city, l.country].filter(Boolean).join(", ") ||
                      "Unknown location"}
                  </div>
                  {l.user_devices && (
                    <div className="text-xs text-[#5c6b70] mt-1">
                      {l.user_devices.device_name ?? l.user_devices.device_type ?? "Unknown device"}
                      {l.user_devices.operating_system &&
                        ` · ${l.user_devices.operating_system}${l.user_devices.os_version ? ` ${l.user_devices.os_version}` : ""}`}
                      {l.user_devices.browser &&
                        ` · ${l.user_devices.browser}${l.user_devices.browser_version ? ` ${l.user_devices.browser_version}` : ""}`}
                    </div>
                  )}
                  {l.user_agent && (
                    <div className="text-[11px] text-[#849295] mt-0.5 truncate" title={l.user_agent}>
                      {l.user_agent}
                    </div>
                  )}
                </div>
                <div className="text-xs text-[#6d7c80] shrink-0">
                  {timeAgo(l.login_at)}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Activity */}
      {tab === "activity" && (
        <div className="space-y-2">
          {activities.length === 0 ? (
            <EmptyState icon="/icons/history.svg" text="No activity recorded yet." />
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border border-[#d5dfdd] bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-[#101820] font-medium capitalize mb-0.5">
                      {a.activity_type.replace(/_/g, " ")}
                    </div>
                    {a.activity_description && (
                      <div className="text-xs text-[#5c6b70]">
                        {a.activity_description}
                      </div>
                    )}
                    {a.ip_address && (
                      <div className="text-xs text-[#849295] mt-1">
                        IP: {a.ip_address}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-[#6d7c80] shrink-0">
                    {timeAgo(a.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Auth Methods */}
      {tab === "methods" && (
        <div className="space-y-2">
          {methods.length === 0 ? (
            <EmptyState icon="/icons/lock.svg" text="No auth methods linked yet." />
          ) : (
            methods.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-[#d5dfdd] bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[#101820] capitalize">
                        {m.auth_method.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-[#6d7c80]">
                        via {m.provider}
                      </span>
                    </div>
                    {m.provider_email && (
                      <div className="text-xs text-[#5c6b70]">
                        {m.provider_email}
                      </div>
                    )}
                    <div className="text-xs text-[#6d7c80] mt-1">
                      Signed in {m.login_count} time
                      {m.login_count !== 1 ? "s" : ""}
                      {m.last_sign_in_at &&
                        ` · Last: ${timeAgo(m.last_sign_in_at)}`}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#dff2eb] text-[#216f9e] border border-[#b4ded3] capitalize shrink-0">
                    {m.last_event ?? "linked"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Verifications */}
      {tab === "verifications" && (
        <div className="space-y-2">
          {verifications.length === 0 ? (
            <EmptyState icon="/icons/check.svg" text="No verification records yet." />
          ) : (
            verifications.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl border border-[#d5dfdd] bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[#101820] capitalize">
                        {v.verification_type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          v.verification_status === "verified"
                            ? "bg-[#dff2e9] text-[#2e8064] border-[#b6e1cf]"
                            : v.verification_status === "pending"
                            ? "bg-[#fff3d8] text-[#a47618] border-[#ead39a]"
                            : "bg-[#fbe5e2] text-[#b84f4b] border-[#efc7c0]"
                        }`}
                      >
                        {v.verification_status}
                      </span>
                    </div>
                    <div className="text-xs text-[#6d7c80]">
                      {v.verified_at
                        ? `Verified ${timeAgo(v.verified_at)}`
                        : v.last_requested_at
                        ? `Requested ${timeAgo(v.last_requested_at)}`
                        : "No activity"}
                    </div>
                    <div className="text-xs text-[#849295] mt-0.5">
                      Attempts: {v.attempt_count}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="p-12 rounded-2xl border border-dashed border-[#d5dfdd] text-center">
      <Image
        src={icon}
        alt=""
        width={40}
        height={40}
        className="invert mx-auto mb-3"
      />
      <p className="text-[#5c6b70] text-sm">{text}</p>
    </div>
  );
}
