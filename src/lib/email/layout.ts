export function escapeEmailText(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export function renderEmailLayout({
  siteUrl,
  eyebrow,
  title,
  description,
  body,
  footerNote = "This is an automated security message from BINZEO.",
}: {
  siteUrl: string;
  eyebrow?: string;
  title: string;
  description?: string;
  body: string;
  footerNote?: string;
}) {
  const logoUrl = `${siteUrl.replace(/\/+$/, "")}/email-logo-white.png`;
  const year = new Date().getFullYear();
  return `
    <div style="margin:0;padding:32px 12px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;">
        <tr><td style="padding:0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:22px;overflow:hidden;">
            <tr><td style="height:4px;background:#111827;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:30px 32px 24px;text-align:center;border-bottom:1px solid #f0f1f3;">
              <img src="${logoUrl}" width="168" alt="BINZEO" style="display:block;width:168px;max-width:70%;height:auto;margin:0 auto;filter:invert(1);" />
              ${eyebrow ? `<div style="margin-top:18px;color:#6b7280;font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">${eyebrow}</div>` : ""}
            </td></tr>
            <tr><td style="padding:32px 32px 12px;text-align:center;">
              <h1 style="margin:0;color:#111827;font-size:26px;line-height:1.25;font-weight:750;letter-spacing:-0.02em;">${title}</h1>
              ${description ? `<p style="margin:12px auto 0;max-width:440px;color:#6b7280;font-size:14px;line-height:1.7;">${description}</p>` : ""}
            </td></tr>
            <tr><td style="padding:20px 32px 32px;">${body}</td></tr>
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="padding:18px 20px 0;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:11px;line-height:1.6;">${footerNote}</p>
              <p style="margin:8px 0 0;color:#9ca3af;font-size:10px;line-height:1.5;">© ${year} BINZEO Inc. All rights reserved.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </div>
  `;
}

export function emailCodeBlock(label: string, code: string, expiresInSeconds: number) {
  return `<div style="padding:22px 16px;border:1px solid #d1d5db;border-radius:16px;background:#f9fafb;text-align:center;"><div style="margin-bottom:10px;color:#6b7280;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${label}</div><div style="color:#111827;font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace;font-size:36px;line-height:1.2;font-weight:800;letter-spacing:9px;">${code}</div><div style="margin-top:12px;color:#6b7280;font-size:12px;">Expires in <strong style="color:#111827;">${expiresInSeconds} seconds</strong></div></div>`;
}

export function emailButton(label: string, href: string) {
  return `<div style="padding:4px 0 2px;text-align:center;"><a href="${href}" style="display:inline-block;padding:13px 24px;border-radius:999px;background:#111827;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">${label}</a></div>`;
}
