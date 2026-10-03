"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    router.push("/signin");
    router.refresh();
  };

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-[#dddddd]">
        <Link href="/" className="mb-5 inline-flex items-center gap-2">
          <Image src="/logo.svg" alt="BINZEO" width={122} height={29} className="h-8 w-auto" />
        </Link>

        <div className="p-3 rounded-xl border border-[#dddddd] bg-[#f3f3f3]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-[#111111] truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-[#666666] truncate">
                {user.email}
              </div>
            </div>
          </div>
          {user.binzeo_user_id && (
            <div className="font-mono text-[10px] text-[#333333] bg-[#eeeeee] rounded px-2 py-1 truncate">
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
                  ? "bg-[#e9e9e9] text-[#333333] border border-[#c9c9c9]"
                  : "text-[#6666666] hover:text-[#111111] hover:bg-[#e7e7e7] border border-transparent"
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#dddddd]">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-[#333333] hover:bg-[#f2f2f2] border border-transparent hover:border-[#d0d0d0] transition-colors disabled:opacity-50"
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
    <div className="flex min-h-screen flex-col bg-[#f3f3f3]">
      <Navbar isLoggedIn onMenu={() => setOpen(true)} />
      <div className="flex flex-1">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#dddddd] bg-white sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-[#000000]/70 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-[#dddddd] z-50 lg:hidden flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      </div>
      <Footer isLoggedIn />
    </div>
  );
}
