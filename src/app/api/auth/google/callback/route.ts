import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isValidUsername, normalizeUsername } from "@/lib/username";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function errorRedirect(req: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/signin?error=${encodeURIComponent(code)}`, req.url));
}

async function findOrCreateUser(email: string, metadata: Record<string, unknown>) {
  const admin = getSupabaseAdmin();
  let page = 1;
  type ExistingUser = { id: string; user_metadata?: Record<string, unknown> };
  let existing: ExistingUser | null = null;

  while (!existing) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    existing = match ? { id: match.id, user_metadata: match.user_metadata } : null;
    if (data.users.length < 1000) break;
    page += 1;
  }

  if (existing) {
    const mergedMetadata = { ...(existing.user_metadata ?? {}), ...metadata, auth_provider: "google" };
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      user_metadata: mergedMetadata,
    });
    if (error || !data.user) throw error ?? new Error("Google account update failed");
    return data.user;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { ...metadata, auth_provider: "google" },
  });
  if (error || !data.user) throw error ?? new Error("Google account creation failed");
  return data.user;
}

async function prepareProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const admin = getSupabaseAdmin();
  const metadata = user.user_metadata ?? {};
  const givenName = String(metadata.given_name ?? metadata.first_name ?? "").trim();
  const familyName = String(metadata.family_name ?? metadata.last_name ?? "").trim();
  const emailName = (user.email ?? "").split("@")[0] ?? "";
  const displayName = String(metadata.name ?? metadata.full_name ?? `${givenName} ${familyName}`).trim() || emailName || "Google user";

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw profileError;

  let username = profile?.username ?? "";
  if (!username || !isValidUsername(username)) {
    const base = (normalizeUsername(String(metadata.email_name ?? emailName))
      .replace(/[^a-z0-9_]/g, "")
      .replace(/^[^a-z]+/, "")
      .slice(0, 24) || `user${user.id.slice(0, 8)}`);
    const candidates = [base, ...Array.from({ length: 30 }, (_, index) => `${base.slice(0, 27)}${index + 1}`)];
    const { data: usedRows, error: usedError } = await admin.from("profiles").select("username").in("username", candidates);
    if (usedError) throw usedError;
    const used = new Set((usedRows ?? []).map((row) => String(row.username).toLowerCase()));
    username = candidates.find((candidate) => isValidUsername(candidate) && !used.has(candidate)) ?? `user${user.id.slice(0, 8)}`;
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update({
      first_name: givenName || null,
      last_name: familyName || null,
      display_name: displayName,
      username,
      profile_photo_url: String(metadata.picture ?? metadata.avatar_url ?? "") || null,
      account_status: "active",
    })
    .eq("id", user.id);
  if (updateError) throw updateError;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const returnedState = req.nextUrl.searchParams.get("state");
  const oauthError = req.nextUrl.searchParams.get("error");
  const stateCookie = req.cookies.get("binzeo_google_oauth_state")?.value;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || new URL("/api/auth/google/callback", req.url).toString();

  if (oauthError) return errorRedirect(req, `google_${oauthError}`);
  if (!code || !returnedState || !stateCookie) return errorRedirect(req, "google_invalid_callback");

  const [expectedState, encodedNext = "%2Fdashboard"] = stateCookie.split(".");
  const expected = Buffer.from(expectedState);
  const received = Buffer.from(returnedState);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return errorRedirect(req, "google_invalid_state");
  }
  const next = safeNext(decodeURIComponent(encodedNext));
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return errorRedirect(req, "google_not_configured");

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    const tokenData = await tokenResponse.json() as { access_token?: string; error?: string };
    if (!tokenResponse.ok || !tokenData.access_token) return errorRedirect(req, "google_token_exchange_failed");

    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    });
    const googleUser = await userResponse.json() as {
      sub?: string;
      email?: string;
      email_verified?: boolean;
      name?: string;
      given_name?: string;
      family_name?: string;
      picture?: string;
    };
    if (!userResponse.ok || !googleUser.email || googleUser.email_verified !== true) {
      return errorRedirect(req, "google_email_not_verified");
    }

    const user = await findOrCreateUser(googleUser.email, {
      google_sub: googleUser.sub ?? null,
      name: googleUser.name ?? null,
      given_name: googleUser.given_name ?? null,
      family_name: googleUser.family_name ?? null,
      picture: googleUser.picture ?? null,
    });
    await prepareProfile(user);

    const admin = getSupabaseAdmin();
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email: googleUser.email });
    const hashedToken = linkData?.properties?.hashed_token;
    if (linkError || !hashedToken) return errorRedirect(req, "google_session_failed");

    const supabase = await createClient();
    const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({ token_hash: hashedToken, type: "email" });
    if (sessionError || !sessionData.session || sessionData.user?.id !== user.id) return errorRedirect(req, "google_session_failed");

    const response = NextResponse.redirect(new URL(next, req.url));
    response.cookies.delete("binzeo_google_oauth_state");
    return response;
  } catch (error) {
    console.error("[GOOGLE_OAUTH_ERROR]", error);
    return errorRedirect(req, "google_login_failed");
  }
}
