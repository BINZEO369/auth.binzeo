import { NextRequest } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { byteaFromBase64Url, webauthnConfig } from "@/lib/webauthn";
import { upsertUserDevice } from "@/lib/device-tracking";
import { ok, fail } from "@/lib/api/response";
import { isTwoFactorEnabled } from "@/lib/two-factor/service";
import { sendLoginNotification } from "@/lib/email/two-factor";
import { getPublicSiteUrl } from "@/lib/email/transporter";
import { logUserActivity } from "@/lib/activity-log";

const schema = z.object({ challenge_id: z.string().uuid(), challenge: z.string().min(16).max(512), response: z.unknown() });

function requestIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "0.0.0.0";
}

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return fail("Invalid passkey login", 422, "VALIDATION_ERROR");
    const response = parsed.data.response as AuthenticationResponseJSON;
    const admin = getSupabaseAdmin();
    const credentialBytea = byteaFromBase64Url(response.id);
    const { data: passkey, error: passkeyError } = await admin
      .from("user_passkeys")
      .select("id, user_id, credential_id, public_key, sign_count, transports, revoked_at")
      .eq("credential_id", credentialBytea)
      .is("revoked_at", null)
      .maybeSingle();
    if (passkeyError || !passkey) return fail("Passkey not found or revoked", 401, "PASSKEY_NOT_FOUND");
    const { rpID, origin } = webauthnConfig(req);
    const publicKeyHex = typeof passkey.public_key === "string" && passkey.public_key.startsWith("\\x") ? passkey.public_key.slice(2) : String(passkey.public_key);
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: parsed.data.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
      credential: {
        id: response.id,
        publicKey: new Uint8Array(Buffer.from(publicKeyHex, "hex")),
        counter: Number(passkey.sign_count),
        transports: passkey.transports ?? [],
      },
    });
    if (!verification.verified) return fail("Passkey authentication failed", 401, "PASSKEY_AUTH_FAILED");
    const { data: consumed, error: consumeError } = await admin.rpc("consume_passkey_challenge", {
      challenge_id: parsed.data.challenge_id,
      submitted_challenge: parsed.data.challenge,
    });
    const challenge = Array.isArray(consumed) ? consumed[0] : consumed;
    if (consumeError || !challenge?.valid || challenge.purpose !== "authentication") return fail("Passkey challenge is invalid or expired", 401, "PASSKEY_CHALLENGE_INVALID");
    await admin.from("user_passkeys").update({ sign_count: verification.authenticationInfo.newCounter, last_used_at: new Date().toISOString() }).eq("id", passkey.id);
    const { data: authUser } = await admin.auth.admin.getUserById(passkey.user_id);
    if (!authUser.user?.email) return fail("Passkey account is unavailable", 401, "PASSKEY_ACCOUNT_UNAVAILABLE");
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email: authUser.user.email });
    const hashedToken = linkData?.properties?.hashed_token;
    if (linkError || !hashedToken) return fail("Passkey session could not be created", 502, "PASSKEY_SESSION_FAILED");
    const supabase = await createClient();
    const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({ token_hash: hashedToken, type: "email" });
    if (sessionError || !sessionData.session || sessionData.user?.id !== passkey.user_id) return fail("Passkey session could not be created", 502, "PASSKEY_SESSION_FAILED");
    const ip = requestIp(req);
    const device = await upsertUserDevice(supabase, passkey.user_id, req.headers, ip);
    await supabase.from("user_login_history").insert({ user_id: passkey.user_id, login_method: "passkey", login_status: "success", ip_address: ip, device_id: device.id, user_agent: req.headers.get("user-agent") });
    await logUserActivity(supabase, req, { userId: passkey.user_id, activityType: "passkey_login_success", description: "Signed in successfully with a passkey.", deviceId: device.id, metadata: { login_method: "passkey" } });
    if (await isTwoFactorEnabled(passkey.user_id)) {
      try { await sendLoginNotification({ userId: passkey.user_id, email: authUser.user.email, loginMethod: "passkey", ipAddress: ip, userAgent: req.headers.get("user-agent"), siteUrl: getPublicSiteUrl(req.headers) }); }
      catch (notificationError) { console.error("[PASSKEY_2FA_NOTIFICATION_ERROR]", notificationError); }
    }
    return ok({ user: { id: passkey.user_id, email: authUser.user.email }, login_method: "passkey" });
  } catch (err) {
    console.error("[PASSKEY_VERIFY_ERROR]", err);
    return fail("Passkey authentication failed", 401, "PASSKEY_AUTH_FAILED");
  }
}
