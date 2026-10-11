import { renderEmailLayout, escapeEmailText } from "@/lib/email/layout";

type BirthdayImage = { url: string; position: string };
type BirthdayTemplateContent = { subject?: string; preview_text?: string | null; headline?: string; message?: string; button_label?: string | null; theme?: "dark" | "light"; images?: BirthdayImage[] };

export function buildBirthdayEmail({ siteUrl, name, buttonUrl, template, theme = "dark" }: { siteUrl: string; name?: string | null; buttonUrl?: string; template?: BirthdayTemplateContent; theme?: "dark" | "light" }) {
  const safeName = name?.trim() || "there";
  const selectedTheme = template?.theme ?? theme;
  const ink = selectedTheme === "light" ? "#000000" : "#ffffff";
  const safeButtonUrl = buttonUrl || `${siteUrl.replace(/\/+$/, "")}/dashboard/profile`;
  const subject = template?.subject?.trim() || "Happy Birthday from BINZEO";
  const headline = template?.headline?.trim() || "Happy Birthday";
  const description = template?.preview_text?.trim() || "A special birthday wish from BINZEO.";
  const message = (template?.message?.trim() || "Wishing you a wonderful birthday!\nMay your new year be filled with meaningful connections, fresh opportunities, and beautiful moments.").replaceAll("{{name}}", safeName).replaceAll("[Name]", safeName);
  const renderImages = (position: string) => (template?.images ?? []).filter((image) => image.url && image.position === position).map((image) => `<p style="margin:24px 0;text-align:center"><img src="${escapeEmailText(image.url)}" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0;margin:0 auto" /></p>`).join("");
  const body = `<p style="margin:0 0 22px;color:${ink};font-size:16px;line-height:1.5;font-weight:700;">Hey ${escapeEmailText(safeName)},</p>${renderImages("top")}${renderImages("after_headline")}<div style="color:${ink};font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeEmailText(message).replace(/\n/g, "<br>")}</div>${renderImages("after_message")}${renderImages("before_button")}${template?.button_label && safeButtonUrl ? `<div style="padding:24px 0 2px;text-align:left;"><a href="${escapeEmailText(safeButtonUrl)}" style="color:${ink};font-size:14px;font-weight:700;text-decoration:underline;text-underline-offset:4px;">${escapeEmailText(template.button_label)} →</a></div>` : ""}`;
  return { subject, html: renderEmailLayout({ siteUrl, eyebrow: "BINZEO · BIRTHDAY", title: escapeEmailText(headline), description: escapeEmailText(description), body, showSecurityDetails: false, theme: selectedTheme, footerNote: `You are receiving this birthday wish because you allowed Marketing emails in your BINZEO notification preferences. <a href="${escapeEmailText(`${siteUrl.replace(/\/+$/, "")}/dashboard/profile#notifications`)}" style="color:${ink};text-decoration:underline;">Manage email preferences</a>` }) };
}
