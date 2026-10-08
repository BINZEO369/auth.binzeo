import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim().replace(/^['"]|['"]$/g, "");
  // Keep the authorization and token exchange on the exact same production URI.
  // A stale GOOGLE_REDIRECT_URI is a common cause of Google's invalid_grant error.
  const redirectUri = new URL("/api/auth/google/callback", req.url).toString();
  if (!clientId) {
    return NextResponse.redirect(new URL("/signin?error=google_not_configured", req.url));
  }

  const state = randomBytes(32).toString("base64url");
  const next = safeNext(req.nextUrl.searchParams.get("next"));
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("access_type", "online");
  authorizationUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("binzeo_google_oauth_state", `${state}.${encodeURIComponent(next)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
