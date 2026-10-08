import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

function errorRedirect(req: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/signin?error=${encodeURIComponent(code)}`, req.url));
}

function envValue(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "");
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

async function seedGoogleIdentity(user: {
  id: string;
  user_metadata?: Record<string, unknown>;
}) {
  const metadata = user.user_metadata ?? {};
  const admin = getSupabaseAdmin();
  const { error } = await admin.from("profiles").upsert({
    id: user.id,
    first_name: String(metadata.given_name ?? "").trim() || null,
    last_name: String(metadata.family_name ?? "").trim() || null,
    display_name: String(metadata.name ?? "Google user").trim() || "Google user",
    profile_photo_url: String(metadata.picture ?? "") || null,
  }, { onConflict: "id" });
  if (error) throw error;
}


export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const returnedState = req.nextUrl.searchParams.get("state");
  const oauthError = req.nextUrl.searchParams.get("error");
  const stateCookie = req.cookies.get("binzeo_google_oauth_state")?.value;
  const redirectUri = new URL("/api/auth/google/callback", req.url).toString();

  if (oauthError) return errorRedirect(req, `google_${oauthError}`);
  if (!code || !returnedState || !stateCookie) return errorRedirect(req, "google_invalid_callback");

  const [expectedState, encodedNext = "%2Fdashboard"] = stateCookie.split(".");
  const expected = Buffer.from(expectedState);
  const received = Buffer.from(returnedState);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return errorRedirect(req, "google_invalid_state");
  }
  const next = safeNext(decodeURIComponent(encodedNext));
  const clientId = envValue(process.env.GOOGLE_CLIENT_ID);
  const clientSecret = envValue(process.env.GOOGLE_CLIENT_SECRET);
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
    const tokenData = await tokenResponse.json() as { access_token?: string; error?: string; error_description?: string };
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("[GOOGLE_TOKEN_EXCHANGE_ERROR]", {
        status: tokenResponse.status,
        error: tokenData.error,
        description: tokenData.error_description,
        redirectUri,
        clientIdSuffix: clientId?.slice(-8),
      });
      const detail = tokenData.error === "invalid_client" ? "invalid_client" : tokenData.error === "invalid_grant" ? "invalid_grant" : "provider_error";
      return errorRedirect(req, `google_token_exchange_failed_${detail}`);
    }

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
    await seedGoogleIdentity(user);

    const admin = getSupabaseAdmin();
    const setupRedirect = new URL(`/signup?google_setup=1&next=${encodeURIComponent(next)}`, req.url).toString();
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: googleUser.email,
      options: { redirectTo: setupRedirect },
    });
    const actionLink = linkData?.properties?.action_link;
    const hashedToken = linkData?.properties?.hashed_token;
    if (linkError || (!hashedToken && !actionLink)) return errorRedirect(req, "google_session_failed");

    const supabase = await createClient();
    if (hashedToken) {
      const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({ token_hash: hashedToken, type: "email" });
      if (!sessionError && sessionData.session && sessionData.user?.id === user.id) {
        const { data: profile } = await admin.from("profiles").select("account_status, username, date_of_birth, terms_accepted, location_consent").eq("id", user.id).maybeSingle();
        const isComplete = profile?.account_status === "active" && Boolean(profile.username && profile.date_of_birth && profile.terms_accepted && profile.location_consent);
        const destination = isComplete ? next : `/signup?google_setup=1&next=${encodeURIComponent(next)}`;
        const response = NextResponse.redirect(new URL(destination, req.url));
        response.cookies.delete("binzeo_google_oauth_state");
        return response;
      }
    }

    if (actionLink) {
      const response = NextResponse.redirect(actionLink);
      response.cookies.delete("binzeo_google_oauth_state");
      return response;
    }

    return errorRedirect(req, "google_session_failed");
  } catch (error) {
    console.error("[GOOGLE_OAUTH_ERROR]", error);
    return errorRedirect(req, "google_login_failed");
  }
}
