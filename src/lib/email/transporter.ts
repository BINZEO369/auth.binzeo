import nodemailer from "nodemailer";
import path from "node:path";

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

export function buildOtpEmail(code: string, expiresInSeconds = 30) {
  return {
    subject: "BINZEO Account Security — Your verification code",
    attachments: [
      {
        filename: "binzeo-logo-white.png",
        path: path.join(process.cwd(), "public", "email-logo-white.png"),
        cid: "binzeo-logo",
      },
      {
        filename: "binzeo-test-offer-banner.jpg",
        path: path.join(process.cwd(), "public", "email-offer-banner.jpg"),
        cid: "binzeo-offer-banner",
      },
    ],
    html: `
      <div style="margin:0; padding:28px 12px; background:#050506; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#ffffff;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px; margin:0 auto;">
          <tr>
            <td style="padding:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#111113; border:1px solid #303035; border-radius:22px; overflow:hidden;">
                <tr><td style="height:4px; background:#ffffff; font-size:0; line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="padding:30px 34px 18px; text-align:center;">
                    <div style="margin:0 0 18px; color:#a8a8af; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase;">BINZEO Account Security</div>
                    <img src="cid:binzeo-logo" width="190" alt="BINZEO" style="display:block; width:190px; max-width:76%; height:auto; margin:0 auto; border:0;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 34px 0; text-align:center;">
                    <h1 style="margin:0 0 12px; color:#ffffff; font-size:27px; line-height:1.25; font-weight:700; letter-spacing:-0.4px;">Verify your email address</h1>
                    <p style="margin:0 auto; max-width:430px; color:#c3c3ca; font-size:15px; line-height:1.7;">Use the verification code below to verify your email and continue setting up your BINZEO account.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 34px 10px;">
                    <div style="padding:24px 16px; border:1px solid #ffffff; border-radius:16px; background:#f7f7f5; text-align:center;">
                      <div style="margin-bottom:10px; color:#626269; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;">BINZEO verification code</div>
                      <div style="color:#09090b; font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace; font-size:37px; line-height:1.2; font-weight:800; letter-spacing:9px;">${code}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 34px 24px; text-align:center;">
                    <p style="margin:0 0 10px; color:#d4d4da; font-size:13px; line-height:1.6;">This code expires in <strong style="color:#ffffff;">${expiresInSeconds} seconds</strong>.</p>
                    <p style="margin:0 auto; max-width:440px; color:#a1a1aa; font-size:12px; line-height:1.7;">For your security, never share this code with anyone. BINZEO will never ask for this code by phone or email.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 34px 30px;">
                    <div style="border-top:1px solid #303035; padding-top:24px; text-align:center;">
                      <div style="margin-bottom:12px; color:#ffffff; font-size:15px; font-weight:700;">Exclusive preview</div>
                      <img src="cid:binzeo-offer-banner" width="532" alt="BINZEO exclusive offer preview" style="display:block; width:100%; max-width:532px; height:auto; max-height:190px; object-fit:cover; margin:0 auto; border:1px solid #3a3a40; border-radius:14px;" />
                      <p style="margin:12px 0 0; color:#96969e; font-size:11px; line-height:1.6;">Test offer banner — this image can be replaced later.</p>
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0; color:#77777f; font-size:11px; line-height:1.6; text-align:center;">If you didn't request this code, you can safely ignore this email.<br />© ${new Date().getFullYear()} BINZEO inc. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };
}
