"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "home" },
  { href: "/dashboard/profile", label: "Profile", icon: "user" },
  { href: "/dashboard/addresses", label: "Addresses", icon: "map" },
  { href: "/dashboard/contacts", label: "Contacts", icon: "phone" },
  { href: "/dashboard/sectors", label: "Sectors", icon: "grid" },
  { href: "/dashboard/devices", label: "Devices", icon: "device" },
  { href: "/dashboard/verify-email", label: "Verify Email", icon: "check" },
  { href: "/dashboard/security", label: "Security", icon: "shield" },
];

function NavIcon({ name }: { name: string }) {
  const c = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-4 h-4",
  };
  switch (name) {
    case "home":
      return <svg {...c}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>;
    case "user":
      return <svg {...c}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "map":
      return <svg {...c}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "phone":
      return <svg {...c}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
    case "grid":
      return <svg {...c}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    case "device":
      return <svg {...c}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>;
    case "shield":
      return <svg {...c}><path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" /></svg>;
    case "check":
      return <svg {...c}><path d="M20 6 9 17l-5-5" /></svg>;
    default:
      return null;
  }
}

type Props = {
  children: React.ReactNode;
  user: {
    email: string | null;
    binzeo_user_id: string | null;
    display_name: string | null;
    first_name: string | null;
    account_status: string | null;
    email_verified: boolean;
  };
};

export default function DashboardShell({ children, user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName =
    user.display_name || user.first_name || user.email || "User";
  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-[#d5dfdd]">
        <Link href="/" className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#78c3e4] to-[#3f86b2] flex items-center justify-center font-bold text-[#101820] text-xs">
            B
          </div>
          <span className="font-semibold text-[#101820]">
            Binzeo <span className="text-[#216f9e]">ID</span>
          </span>
        </Link>

        <div className="p-3 rounded-xl border border-[#d5dfdd] bg-[#eef2f1]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#101820] flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-[#101820] truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-[#6d7c80] truncate">
                {user.email}
              </div>
            </div>
          </div>
          {user.binzeo_user_id && (
            <div className="font-mono text-[10px] text-[#216f9e] bg-[#dff2eb] rounded px-2 py-1 truncate">
              {user.binzeo_user_id}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.filter((item) => !(item.href === "/dashboard/verify-email" && user.email_verified)).map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#e3f0f3] text-[#216f9e] border border-[#b4ded3]"
                  : "text-[#5c6b70] hover:text-[#101820] hover:bg-[#e5eceb] border border-transparent"
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#d5dfdd]">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-[#b84f4b] hover:bg-[#fbe5e2] border border-transparent hover:border-[#efc7c0] transition-colors disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#eef2f1]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#d5dfdd] bg-white sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-[#d5dfdd] z-50 lg:hidden flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 border-b border-[#d5dfdd] bg-[#eef2f1]/80 backdrop-blur flex items-center gap-3 px-4">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#5c6b70] hover:text-[#101820]"
            aria-label="Open menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-5 h-5"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex-1" />

          {user.account_status && (
            <span
              className={`text-[10px] px-2 py-1 rounded-full border font-medium ${
                user.account_status === "active"
                  ? "bg-[#dff2e9] text-[#2e8064] border-[#b6e1cf]"
                  : user.account_status === "pending"
                  ? "bg-[#fff3d8] text-[#a47618] border-[#ead39a]"
                  : "bg-[#fbe5e2] text-[#b84f4b] border-[#efc7c0]"
              }`}
            >
              {user.account_status.toUpperCase()}
            </span>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
