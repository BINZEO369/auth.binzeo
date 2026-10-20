import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  client_id: z.literal("jabiyen"),
  redirect_uri: z.string().url().max(2048),
  state: z.string().regex(/^[A-Za-z0-9_-]{32,128}$/),
  code_challenge: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
}).strict();

const centralApi = (process.env.CENTRAL_API_BASE_URL || "https://api-binzeo.vercel.app").replace(/\/+$/, "");

export async function POST(request: NextRequest) {
  try {
    const parsed = requestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: { message: "Invalid connection request." } }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    const incoming = await headers();
    const cookie = incoming.get("cookie");
    if (!cookie) {
      return NextResponse.json({ success: false, error: { message: "Please sign in to BINZEO before connecting JABIYEN." } }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    const response = await fetch(`${centralApi}/v1/auth/authorize/session`, {
      method: "POST",
      cache: "no-store",
      redirect: "error",
      headers: {
        Cookie: cookie,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(parsed.data),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result?.success !== true || typeof result?.data?.redirect_url !== "string") {
      return NextResponse.json(
        { success: false, error: { message: result?.error?.message || "Central Auth could not complete the connection." } },
        { status: response.status || 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json({ success: true, redirect_url: result.data.redirect_url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[OAUTH_CONNECT_BRIDGE_ERROR]", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ success: false, error: { message: "Central Auth is temporarily unavailable." } }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
