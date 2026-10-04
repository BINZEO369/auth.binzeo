import { EMAIL_FROM, getPublicSiteUrl, transporter } from "@/lib/email/transporter";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export function buildTwoFactorLoginEmail(code: string, expiresInSeconds: number, siteUrl: string) {
  const logoUrl = `${siteUrl.replace(/\/+$/, "")}/email-logo-white.png`;
  return {
    subject: "BINZEO 2FA — Your login verification code",
    html: `<div style="margin:0;padding:28px 12px;background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#000;border:1px solid #272727;border-radius:18px;overflow:hidden"><tr><td style="height:3px;background:#fff"></td></tr><tr><td style="padding:32px 30px 18px;text-align:center"><img src="${logoUrl}" width="190" alt="BINZEO" style="width:190px;max-width:76%;height:auto" /></td></tr><tr><td style="padding:12px 30px 0;text-align:center"><h1 style="margin:0 0 12px;font-size:25px">Confirm your sign-in</h1><p style="margin:0;color:#c7c7c7;font-size:14px;line-height:1.65">Use this one-time code to finish signing in to your BINZEO account.</p></td></tr><tr><td style="padding:26px 30px 14px"><div style="padding:20px 14px;border:1px solid #fff;border-radius:13px;background:#090909;text-align:center"><div style="margin-bottom:9px;color:#a1a1a1;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">2FA verification code</div><div style="color:#fff;font-family:monospace;font-size:35px;font-weight:800;letter-spacing:9px">${code}</div></div></td></tr><tr><td style="padding:10px 30px 30px;text-align:center"><p style="margin:0 0 9px;color:#d4d4d4;font-size:12px">This code expires in <strong>${expiresInSeconds} seconds</strong>.</p><p style="margin:0;color:#8f8f8f;font-size:11px;line-height:1.6">If you did not try to sign in, change your password and review your security activity.</p></td></tr></table></div>`,
  };
}

export function buildLoginNotificationEmail(loginMethod: string, siteUrl: string) {
  const logoUrl = `${siteUrl.replace(/\/+$/, "")}/email-logo-white.png`;
  const securityUrl = `${siteUrl.replace(/\/+$/, "")}/dashboard/security`;
  return {
    subject: "BINZEO Security Alert — New sign-in detected",
    html: `<div style="margin:0;padding:28px 12px;background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#000;border:1px solid #272727;border-radius:18px;overflow:hidden"><tr><td style="height:3px;background:#fff"></td></tr><tr><td style="padding:32px 30px 18px;text-align:center"><img src="${logoUrl}" width="190" alt="BINZEO" style="width:190px;max-width:76%;height:auto" /></td></tr><tr><td style="padding:12px 30px 0;text-align:center"><h1 style="margin:0 0 12px;font-size:25px">New sign-in detected</h1><p style="margin:0;color:#c7c7c7;font-size:14px;line-height:1.65">Your BINZEO account was accessed using <strong style="color:#fff">${loginMethod}</strong>.</p></td></tr><tr><td style="padding:26px 30px 18px;text-align:center"><a href="${securityUrl}" style="display:inline-block;padding:13px 24px;border-radius:999px;background:#fff;color:#000;font-size:14px;font-weight:700;text-decoration:none">Review security activity</a></td></tr><tr><td style="padding:10px 30px 30px;text-align:center"><p style="margin:0;color:#8f8f8f;font-size:11px;line-height:1.6">If this was not you, secure your account immediately.</p></td></tr></table></div>`,
  };
}

export async function sendLoginNotification({ userId, email, loginMethod, ipAddress, userAgent, siteUrl }: { userId: string; email: string; loginMethod: string; ipAddress: string | null; userAgent: string | null; siteUrl: string }) {
  const admin = getSupabaseAdmin();
  const { data: event, error } = await admin.from("two_factor_authentication_events").insert({
    user_id: userId,
    email,
    event_type: "login_notification",
    login_method: loginMethod,
    status: "pending",
    ip_address: ipAddress,
    user_agent: userAgent,
  }).select("id").single();
  if (error || !event) throw error ?? new Error("Login notification event could not be created");
  try {
    const content = buildLoginNotificationEmail(loginMethod, siteUrl);
    const info = await transporter.sendMail({ from: EMAIL_FROM, to: email, subject: content.subject, html: content.html });
    await admin.from("two_factor_authentication_events").update({ status: "sent", sent_at: new Date().toISOString(), provider_message_id: info.messageId ?? null }).eq("id", event.id);
    return { eventId: event.id, sent: true };
  } catch (error) {
    await admin.from("two_factor_authentication_events").update({ status: "failed", metadata: { error: error instanceof Error ? error.message : "notification_failed" } }).eq("id", event.id);
    throw error;
  }
}

export function publicSiteUrl(headers?: { get(name: string): string | null }) {
  return getPublicSiteUrl(headers);
}
