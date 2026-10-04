export type EmailSecurityContext = {
  name?: string | null;
  time?: string | null;
  ipAddress?: string | null;
  location?: string | null;
  browser?: string | null;
};

export function escapeEmailText(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function contextValue(value: string | null | undefined) {
  return escapeEmailText(value?.trim() || "Not available");
}

export function emailSecurityDetails(context?: EmailSecurityContext) {
  const name = contextValue(context?.name || "there");
  const time = contextValue(context?.time || new Date().toUTCString());
  const ipAddress = contextValue(context?.ipAddress);
  const location = contextValue(context?.location);
  const browser = contextValue(context?.browser);
  return `<div style="border:1px solid #ffffff;border-radius:8px;background:#000000;padding:18px 18px 16px;"><p style="margin:0 0 16px;color:#ffffff;font-size:15px;line-height:1.5;">Hi ${name},</p><p style="margin:0 0 14px;color:#ffffff;font-size:12px;line-height:1.6;">Security details for this BINZEO account event:</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="color:#ffffff;font-size:12px;line-height:1.55;"><tr><td width="92" style="padding:4px 10px 4px 0;font-weight:700;vertical-align:top;">Time</td><td style="padding:4px 0;word-break:break-word;">${time}</td></tr><tr><td width="92" style="padding:4px 10px 4px 0;font-weight:700;vertical-align:top;">IP address</td><td style="padding:4px 0;word-break:break-word;">${ipAddress}</td></tr><tr><td width="92" style="padding:4px 10px 4px 0;font-weight:700;vertical-align:top;">Location</td><td style="padding:4px 0;word-break:break-word;">${location}</td></tr><tr><td width="92" style="padding:4px 10px 4px 0;font-weight:700;vertical-align:top;">Browser</td><td style="padding:4px 0;word-break:break-word;">${browser}</td></tr></table></div>`;
}

export function renderEmailLayout({
  siteUrl,
  eyebrow,
  title,
  description,
  body,
  context,
  footerNote = "This is an automated security message from BINZEO.",
}: {
  siteUrl: string;
  eyebrow?: string;
  title: string;
  description?: string;
  body: string;
  context?: EmailSecurityContext;
  footerNote?: string;
}) {
  const logoUrl = `${siteUrl.replace(/\/+$/, "")}/email-logo-white.png`;
  const year = new Date().getFullYear();
  return `
    <div style="margin:0;padding:32px 12px;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;">
        <tr><td style="padding:0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#000000;border:1px solid #ffffff;border-radius:8px;overflow:hidden;">
            <tr><td style="height:3px;background:#ffffff;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:34px 32px 26px;text-align:center;border-bottom:1px solid #ffffff;">
              <img src="${logoUrl}" width="190" alt="BINZEO" style="display:block;width:190px;max-width:76%;height:auto;margin:0 auto;" />
              ${eyebrow ? `<div style="margin-top:20px;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${eyebrow}</div>` : ""}
            </td></tr>
            <tr><td style="padding:34px 32px 12px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;">${title}</h1>
              ${description ? `<p style="margin:14px auto 0;max-width:440px;color:#ffffff;font-size:14px;line-height:1.7;">${description}</p>` : ""}
            </td></tr>
            <tr><td style="padding:18px 32px 0;">${emailSecurityDetails(context)}</td></tr>
            <tr><td style="padding:20px 32px 34px;">${body}</td></tr>
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="padding:20px 20px 0;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:11px;line-height:1.6;">${footerNote}</p>
              <p style="margin:8px 0 0;color:#ffffff;font-size:10px;line-height:1.5;">© ${year} BINZEO Inc. All rights reserved.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </div>
  `;
}

export function emailCodeBlock(label: string, code: string, expiresInSeconds: number) {
  return `<div style="padding:22px 16px;border:1px solid #ffffff;border-radius:8px;background:#000000;text-align:center;"><div style="margin-bottom:10px;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${label}</div><div style="color:#ffffff;font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace;font-size:36px;line-height:1.2;font-weight:800;letter-spacing:9px;">${code}</div><div style="margin-top:12px;color:#ffffff;font-size:12px;">Expires in <strong style="color:#ffffff;">${expiresInSeconds} seconds</strong></div></div>`;
}

export function emailButton(label: string, href: string) {
  return `<div style="padding:4px 0 2px;text-align:center;"><a href="${href}" style="display:inline-block;padding:13px 24px;border:1px solid #ffffff;border-radius:8px;background:#ffffff;color:#000000;font-size:14px;font-weight:700;text-decoration:none;">${label}</a></div>`;
}
