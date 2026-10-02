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

export const EMAIL_FROM = `"Binzeo ID" <${process.env.SMTP_USER}>`;

export function buildOtpEmail(code: string, expiresInSeconds = 30) {
  return {
    subject: "Your Binzeo ID verification code",
    html: `
      <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #ffffff; color: #0f172a;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #4338ca); color: #ffffff; font-weight: 700; font-size: 22px; line-height: 48px; text-align: center;">B</div>
        </div>

        <h2 style="margin: 0 0 8px; font-size: 20px; text-align: center; color: #0f172a;">Verify your email</h2>
        <p style="margin: 0 0 24px; text-align: center; color: #64748b; font-size: 14px;">
          Use the code below to verify your Binzeo ID email address.
        </p>

        <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 12px; margin: 0 0 24px;">
          <div style="font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #0f172a; font-family: Menlo, Consolas, monospace;">
            ${code}
          </div>
        </div>

        <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; text-align: center;">
          This code expires in <strong>${expiresInSeconds} seconds</strong>.
        </p>
        <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
          If you didn't request this, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 16px;" />
        <p style="margin: 0; color: #94a3b8; font-size: 11px; text-align: center;">
          © ${new Date().getFullYear()} Binzeo Labs
        </p>
      </div>
    `,
  };
}
