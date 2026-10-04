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
  return `<div style="border:1px solid #ffffff;border-radius:14px;background:#000000;padding:20px 20px 18px;"><p style="margin:0 0 18px;color:#ffffff;font-size:16px;line-height:1.45;font-weight:700;">Hi ${name},</p><p style="margin:0 0 15px;color:#ffffff;font-size:11px;line-height:1.6;letter-spacing:.04em;text-transform:uppercase;font-weight:700;">Security details</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="color:#ffffff;font-size:12px;line-height:1.55;"><tr><td width="92" style="padding:5px 12px 5px 0;font-weight:700;vertical-align:top;">Time</td><td style="padding:5px 0;word-break:break-word;">${time}</td></tr><tr><td width="92" style="padding:5px 12px 5px 0;font-weight:700;vertical-align:top;">IP address</td><td style="padding:5px 0;word-break:break-word;">${ipAddress}</td></tr><tr><td width="92" style="padding:5px 12px 5px 0;font-weight:700;vertical-align:top;">Location</td><td style="padding:5px 0;word-break:break-word;">${location}</td></tr><tr><td width="92" style="padding:5px 12px 5px 0;font-weight:700;vertical-align:top;">Browser</td><td style="padding:5px 0;word-break:break-word;">${browser}</td></tr></table></div>`;
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
    <div style="margin:0;padding:36px 12px;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;margin:0 auto;">
        <tr><td style="padding:0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#000000;border:1px solid #ffffff;border-radius:20px;overflow:hidden;">
            <tr><td style="height:4px;background:#ffffff;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:38px 34px 30px;text-align:center;border-bottom:1px solid #ffffff;">
              <img src="${logoUrl}" width="190" alt="BINZEO" style="display:block;width:190px;max-width:76%;height:auto;margin:0 auto;" />
              ${eyebrow ? `<div style="display:inline-block;margin-top:22px;padding:7px 12px;border:1px solid #ffffff;border-radius:999px;color:#ffffff;font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">${eyebrow}</div>` : ""}
            </td></tr>
            <tr><td style="padding:36px 34px 10px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;font-weight:750;letter-spacing:-0.035em;">${title}</h1>
              ${description ? `<p style="margin:15px auto 0;max-width:450px;color:#ffffff;font-size:14px;line-height:1.7;">${description}</p>` : ""}
            </td></tr>
            <tr><td style="padding:22px 34px 0;">${emailSecurityDetails(context)}</td></tr>
            <tr><td style="padding:22px 34px 38px;">${body}</td></tr>
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="padding:22px 24px 0;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:11px;line-height:1.65;">${footerNote}</p>
              <p style="margin:9px 0 0;color:#ffffff;font-size:10px;line-height:1.5;">© ${year} BINZEO Inc. All rights reserved.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </div>
  `;
}

export function emailCodeBlock(label: string, code: string, expiresInSeconds: number) {
  return `<div style="padding:24px 16px 22px;border:1px solid #ffffff;border-radius:14px;background:#000000;text-align:center;"><div style="margin-bottom:12px;color:#ffffff;font-size:10px;font-weight:700;letter-spacing:1.7px;text-transform:uppercase;">${label}</div><div style="color:#ffffff;font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace;font-size:36px;line-height:1.2;font-weight:800;letter-spacing:9px;">${code}</div><div style="margin-top:13px;color:#ffffff;font-size:12px;">Expires in <strong style="color:#ffffff;">${expiresInSeconds} seconds</strong></div></div>`;
}

export function emailButton(label: string, href: string) {
  return `<div style="padding:4px 0 2px;text-align:center;"><a href="${href}" style="display:inline-block;padding:14px 26px;border:1px solid #ffffff;border-radius:999px;background:#ffffff;color:#000000;font-size:14px;font-weight:700;text-decoration:none;">${label}</a></div>`;
}
