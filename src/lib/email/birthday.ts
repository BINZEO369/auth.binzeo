import { renderEmailLayout, escapeEmailText } from "@/lib/email/layout";

export function buildBirthdayEmail({ siteUrl, name, buttonUrl, theme = "dark" }: { siteUrl: string; name?: string | null; buttonUrl?: string; theme?: "dark" | "light" }) {
  const safeName = name?.trim() || "there";
  const ink = theme === "light" ? "#000000" : "#ffffff";
  const safeButtonUrl = buttonUrl || `${siteUrl.replace(/\/+$/, "")}/dashboard/profile`;
  const body = `<p style="margin:0 0 22px;color:${ink};font-size:16px;line-height:1.5;font-weight:700;">Hey ${escapeEmailText(safeName)},</p><div style="color:${ink};font-size:14px;line-height:1.7;"><p>Wishing you a wonderful birthday, ${escapeEmailText(safeName)}!</p><p>May your new year be filled with meaningful connections, fresh opportunities, and beautiful moments.</p></div><div style="padding:24px 0 2px;text-align:left;"><a href="${escapeEmailText(safeButtonUrl)}" style="color:${ink};font-size:14px;font-weight:700;text-decoration:underline;text-underline-offset:4px;">Open your BINZEO profile →</a></div>`;
  return {
    subject: "Happy Birthday from BINZEO",
    html: renderEmailLayout({ siteUrl, eyebrow: "BINZEO · BIRTHDAY", title: "Happy Birthday", description: "A special birthday wish from BINZEO.", body, showSecurityDetails: false, theme, footerNote: `You are receiving this birthday wish because you allowed Marketing emails in your BINZEO notification preferences. <a href="${escapeEmailText(`${siteUrl.replace(/\/+$/, "")}/dashboard/profile#notifications`)}" style="color:${ink};text-decoration:underline;">Manage email preferences</a>` }),
  };
}
