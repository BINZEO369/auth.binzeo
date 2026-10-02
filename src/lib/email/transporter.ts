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

export const EMAIL_FROM = `"Binzeo" <${process.env.SMTP_USER}>`;

export function buildOtpEmail(code: string, expiresInSeconds = 30) {
  return {
    subject: "Your Binzeo ID verification code",
    attachments: [
      {
        filename: "binzeo-logo.svg",
        path: path.join(process.cwd(), "public", "logo.svg"),
        cid: "binzeo-logo",
      },
    ],
    html: `
      <div style="margin:0; padding:32px 12px; background:#eef3f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#102027;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px; margin:0 auto;">
          <tr>
            <td style="padding:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff; border:1px solid #dce7e9; border-radius:24px; overflow:hidden;">
                <tr>
                  <td style="height:6px; background:#9bd5e6; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:34px 34px 18px; text-align:center;">
                    <img src="cid:binzeo-logo" width="168" alt="Binzeo" style="display:block; width:168px; max-width:70%; height:auto; margin:0 auto; border:0;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 34px 0; text-align:center;">
                    <div style="display:inline-block; padding:7px 12px; border-radius:999px; background:#edf8fb; color:#397d91; font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase;">Account security</div>
                    <h1 style="margin:18px 0 10px; color:#102027; font-size:28px; line-height:1.2; font-weight:700; letter-spacing:-0.5px;">Binzeo verification code</h1>
                    <p style="margin:0 auto; max-width:410px; color:#60747b; font-size:15px; line-height:1.7;">Use this code to verify your email and continue setting up your Binzeo account.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 34px 8px;">
                    <div style="padding:22px 16px; border:1px solid #c9e9f1; border-radius:18px; background:#f4fbfd; text-align:center;">
                      <div style="margin-bottom:9px; color:#6a858d; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;">Your one-time code</div>
                      <div style="color:#17333d; font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace; font-size:36px; line-height:1.2; font-weight:700; letter-spacing:9px;">${code}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 34px 32px; text-align:center;">
                    <p style="margin:0 0 8px; color:#506971; font-size:13px; line-height:1.6;">This Binzeo verification code expires in <strong style="color:#17333d;">${expiresInSeconds} seconds</strong>.</p>
                    <p style="margin:0; color:#91a5aa; font-size:12px; line-height:1.6;">If you didn’t request this code, you can safely ignore this email.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0; color:#8aa0a6; font-size:11px; line-height:1.6; text-align:center;">© ${new Date().getFullYear()} Binzeo Labs · This is an automated message.</p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };
}
