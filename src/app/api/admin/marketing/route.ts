/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ok, fail } from "@/lib/api/response";
import { EMAIL_FROM, transporter } from "@/lib/email/transporter";
import { emailButton, renderEmailLayout } from "@/lib/email/layout";
function escape(value: string) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] ?? char)); }
async function prepareInlineImage(imageUrl: string, cid = "marketing-image@binzeo", filename = "marketing-image") {
  const response = await fetch(imageUrl, { cache: "no-store", redirect: "follow" });
  const contentType = response.headers.get("content-type")?.split(";")[0] ?? "";
  if (!response.ok || !contentType.startsWith("image/")) throw new Error("The image URL could not be fetched as an image.");
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) throw new Error("The email image must be between 1 byte and 5 MB.");
  return { html: (html: string) => html.replaceAll(escape(imageUrl), `cid:${cid}`), attachment: { filename, content: buffer, cid, contentType } };
}
function buildEmail(input: { preheader: string; headline: string; message: string; recipient_name?: string; button_label?: string; button_url?: string; image_url?: string; image_position?: string; unsubscribe_url: string }) {
  const button = input.button_label && input.button_url ? emailButton(escape(input.button_label), escape(input.button_url)) : "";
  const image = input.image_url ? `<p style="margin:24px 0;text-align:center"><img src="${escape(input.image_url)}" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0;margin:0 auto" /></p>` : "";
  const beforeHeadline = input.image_position === "top" ? image : "";
  const afterHeadline = input.image_position === "after_headline" ? image : "";
  const afterMessage = input.image_position === "after_message" ? image : "";
  const beforeButton = input.image_position === "before_button" ? image : "";
  const leadImage = beforeHeadline || afterHeadline;
  const body = `<p style="margin:0 0 22px;color:#ffffff;font-size:16px;line-height:1.5;font-weight:700;">Hey ${escape(input.recipient_name?.trim() || "there")},</p>${leadImage}<div style="font-size:14px;line-height:1.7;white-space:pre-wrap">${escape(input.message).replace(/\n/g, "<br>")}</div>${afterMessage}${beforeButton}${button}`;
  return renderEmailLayout({
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://binzeo.com").replace(/\/+$/, ""),
    eyebrow: "BINZEO · NEWS",
    title: escape(input.headline),
    description: escape(input.preheader),
    body,
    showSecurityDetails: false,
    footerNote: `You are receiving this marketing email because you allowed Marketing emails in your BINZEO notification preferences. <a href="${escape(input.unsubscribe_url)}" style="color:#ffffff;text-decoration:underline;">Unsubscribe from marketing emails</a>`,
  });
}
async function getContext(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const admin = getSupabaseAdmin();
  const { data: auth } = await admin.auth.getUser(token);
  if (!auth.user) return null;
  const { data: access } = await admin.from("admin_access").select("roles,permissions,is_active").eq("user_id", auth.user.id).maybeSingle();
  if (!access?.is_active) return null;
  const roles = Array.isArray(access.roles) ? access.roles : [];
  const permissions = Array.isArray(access.permissions) ? access.permissions : [];
  const allowed = roles.includes("super_admin") || permissions.includes("marketing.send");
  return allowed ? { admin, user: auth.user, roles, permissions } : null;
}
async function getRecipients(admin: ReturnType<typeof getSupabaseAdmin>) {
  const { data: profiles, error } = await (admin.from("profiles") as any).select("id,display_name").eq("marketing_email", true).eq("account_status", "active").limit(500);
  if (error) throw error;
  const recipients: { user_id: string; email: string; display_name: string | null }[] = [];
  for (const profile of profiles ?? []) {
    const result = await admin.auth.admin.getUserById(profile.id);
    if (result.data.user?.email) recipients.push({ user_id: profile.id, email: result.data.user.email, display_name: profile.display_name });
  }
  return recipients;
}
export async function GET(request: NextRequest) {
  const context = await getContext(request);
  if (!context) return fail("Marketing email permission required", 403, "MARKETING_SEND_REQUIRED");
  try { return ok({ recipient_count: (await getRecipients(context.admin)).length, smtp_source: "auth.binzeo" }); } catch (error) { return fail(error instanceof Error ? error.message : "Could not load recipients", 500, "RECIPIENTS_FAILED"); }
}
export async function POST(request: NextRequest) {
  const context = await getContext(request);
  if (!context) return fail("Marketing email permission required", 403, "MARKETING_SEND_REQUIRED");
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 180) : "";
  const preheader = typeof body.preheader === "string" ? body.preheader.trim().slice(0, 240) : "";
  const headline = typeof body.headline === "string" ? body.headline.trim().slice(0, 180) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 10000) : "";
  const button_label = typeof body.button_label === "string" ? body.button_label.trim().slice(0, 80) : "";
  const button_url = typeof body.button_url === "string" ? body.button_url.trim().slice(0, 500) : "";
  const image_url = typeof body.image_url === "string" && /^https:\/\//i.test(body.image_url) ? body.image_url.trim().slice(0, 1000) : "";
  const image_position = ["top", "after_headline", "after_message", "before_button"].includes(String(body.image_position)) ? String(body.image_position) : "after_headline";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://binzeo.com").replace(/\/+$/, "");
  const unsubscribe_url = `${siteUrl}/dashboard/profile#notifications`;
  if (!subject || !headline || !message) return fail("Subject, headline and message are required", 422, "VALIDATION_ERROR");
  const previewHtml = buildEmail({ preheader, headline, message, recipient_name: "there", button_label, button_url, image_url, image_position, unsubscribe_url });
  const recipients = await getRecipients(context.admin);
  if (body.action === "preview") return ok({ subject, html: previewHtml, recipient_count: recipients.length, smtp_source: "auth.binzeo" });
  if (body.action !== "send") return fail("Choose preview or send", 422, "VALIDATION_ERROR");
  let inlineImage: Awaited<ReturnType<typeof prepareInlineImage>> | null = null;
  let inlineLogo: Awaited<ReturnType<typeof prepareInlineImage>> | null = null;
  try { if (image_url) inlineImage = await prepareInlineImage(image_url); } catch (error) { return fail(error instanceof Error ? error.message : "The email image could not be embedded", 422, "IMAGE_EMBED_FAILED"); }
  try { inlineLogo = await prepareInlineImage(`${siteUrl}/email-logo-white.png`, "binzeo-logo@binzeo", "binzeo-logo.png"); } catch (error) { return fail(error instanceof Error ? error.message : "The BINZEO logo could not be embedded", 422, "LOGO_EMBED_FAILED"); }
  const { data: campaign, error: campaignError } = await (context.admin.from("marketing_email_campaigns") as any).insert({ subject, preview_text: preheader, html_body: previewHtml, created_by: context.user.id, status: "sending", recipient_count: recipients.length, started_at: new Date().toISOString() }).select("id").single();
  if (campaignError || !campaign) return fail(campaignError?.message ?? "Campaign could not be created", 500, "CAMPAIGN_CREATE_FAILED");
  const { error: deliveryError } = await (context.admin.from("marketing_email_deliveries") as any).insert(recipients.map((recipient) => ({ campaign_id: campaign.id, user_id: recipient.user_id, email: recipient.email, consent_snapshot: true, status: "pending" })));
  if (deliveryError) return fail(deliveryError.message, 500, "DELIVERY_CREATE_FAILED");
  let sent = 0; let failed = 0;
  for (const recipient of recipients) {
    try {
      const recipientHtml = buildEmail({ preheader, headline, message, recipient_name: recipient.display_name ?? "there", button_label, button_url, image_url, image_position, unsubscribe_url });
      const sendHtml = inlineLogo ? inlineLogo.html(inlineImage ? inlineImage.html(recipientHtml) : recipientHtml) : (inlineImage ? inlineImage.html(recipientHtml) : recipientHtml);
      const info = await transporter.sendMail({ from: EMAIL_FROM, to: recipient.email, subject, html: sendHtml, attachments: [inlineLogo.attachment, ...(inlineImage ? [inlineImage.attachment] : [])] });
      sent += 1;
      await (context.admin.from("marketing_email_deliveries") as any).update({ status: "sent", sent_at: new Date().toISOString(), provider_message_id: info.messageId ?? null }).eq("campaign_id", campaign.id).eq("email", recipient.email);
    } catch (error) {
      failed += 1;
      await (context.admin.from("marketing_email_deliveries") as any).update({ status: "failed", error_message: error instanceof Error ? error.message : "Send failed" }).eq("campaign_id", campaign.id).eq("email", recipient.email);
    }
  }
  await (context.admin.from("marketing_email_campaigns") as any).update({ status: failed ? (sent ? "partial" : "failed") : "sent", sent_count: sent, failed_count: failed, completed_at: new Date().toISOString() }).eq("id", campaign.id);
  await context.admin.from("admin_activity_logs").insert([{ admin_user_id: context.user.id, action_type: "marketing_campaign_sent", target_type: "marketing_email_campaign", target_id: campaign.id, description: `Marketing campaign sent through auth.binzeo SMTP. Sent ${sent}, failed ${failed}.`, metadata: { sent, failed, recipient_count: recipients.length, smtp_source: "auth.binzeo", consent_filter: "profiles.marketing_email = true and account_status = active" } }] as never);
  return ok({ campaign_id: campaign.id, recipient_count: recipients.length, sent, failed, smtp_source: "auth.binzeo" });
}
