import { NextRequest } from "next/server";
import { getPublicSiteUrl } from "@/lib/email/transporter";
import { sendBirthdayEmails } from "@/lib/birthday";

export async function POST(req: NextRequest) {
  const configuredSecret = process.env.BIRTHDAY_JOB_SECRET;
  const suppliedSecret = req.headers.get("x-birthday-job-secret");
  const cronSecret = process.env.CRON_SECRET;
  const authorization = req.headers.get("authorization");
  const bearerSecret = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  const authorized = (configuredSecret && suppliedSecret === configuredSecret) || (cronSecret && bearerSecret === cronSecret);
  if (!authorized) {
    return Response.json({ success: false, error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }
  try {
    const result = await sendBirthdayEmails({ siteUrl: getPublicSiteUrl(req.headers) });
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("[BIRTHDAY_JOB_ERROR]", error);
    return Response.json({ success: false, error: { code: "BIRTHDAY_JOB_FAILED" } }, { status: 500 });
  }
}
