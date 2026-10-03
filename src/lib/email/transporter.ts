import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const EMAIL_FROM = `"BINZEO" <${process.env.SMTP_USER}>`;

export function getPublicSiteUrl(headers?: { get(name: string): string | null }) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, "");

  const forwardedHost = headers?.get("x-forwarded-host") ?? headers?.get("host");
  if (!forwardedHost) {
    throw new Error("NEXT_PUBLIC_SITE_URL or a public request host is required for email images");
  }
  const forwardedProto = headers?.get("x-forwarded-proto") ?? "https";
  return `${forwardedProto.split(",")[0].trim()}://${forwardedHost.split(",")[0].trim()}`.replace(/\/+$/, "");
}

export function buildOtpEmail(code: string, expiresInSeconds = 30, siteUrl: string) {
  const logoUrl = `${siteUrl.replace(/\/+$/, "")}/email-logo-white.png`;

  return {
    subject: "BINZEO Account Security — Your verification code",
    // Deliberately no attachments: the logo is a public HTTPS image in the
    // email body, so Gmail and other clients do not show it as a downloadable file.
    html: `
      <div style="margin:0; padding:28px 12px; background:#000000; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#ffffff;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; margin:0 auto;">
          <tr>
            <td style="padding:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#000000; border:1px solid #272727; border-radius:18px; overflow:hidden;">
                <tr><td style="height:3px; background:#ffffff; font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="padding:34px 30px 18px; text-align:center;">
                    <img src="${logoUrl}" width="190" alt="BINZEO" style="display:block; width:190px; max-width:76%; height:auto; margin:0 auto; border:0;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 30px 0; text-align:center;">
                    <h1 style="margin:0 0 12px; color:#ffffff; font-size:25px; line-height:1.3; font-weight:700;">Verify your email address</h1>
                    <p style="margin:0 auto; max-width:390px; color:#c7c7c7; font-size:14px; line-height:1.65;">Use the verification code below to continue setting up your BINZEO account.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:26px 30px 14px;">
                    <div style="padding:20px 14px; border:1px solid #ffffff; border-radius:13px; background:#090909; text-align:center;">
                      <div style="margin-bottom:9px; color:#a1a1a1; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;">BINZEO verification code</div>
                      <div style="color:#ffffff; font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace; font-size:35px; line-height:1.2; font-weight:800; letter-spacing:9px;">${code}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 30px 30px; text-align:center;">
                    <p style="margin:0 0 9px; color:#d4d4d4; font-size:12px; line-height:1.6;">This code expires in <strong style="color:#ffffff;">${expiresInSeconds} seconds</strong>.</p>
                    <p style="margin:0 auto; max-width:400px; color:#8f8f8f; font-size:11px; line-height:1.6;">Never share this code. BINZEO will never ask for it by phone or email.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0; color:#6666666; font-size:10px; line-height:1.5; text-align:center;">If you didn't request this code, you can safely ignore this email.<br />© ${new Date().getFullYear()} BINZEO inc. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };
}
