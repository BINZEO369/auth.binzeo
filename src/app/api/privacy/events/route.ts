/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/response";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { collectPrivacyVisitorMetadata } from "@/lib/privacy-visitor-metadata";
import {
  ANALYTICS_SESSION_COOKIE,
  ANALYTICS_SESSION_MAX_AGE_SECONDS,
  COOKIE_CONSENT_COOKIE,
  COOKIE_CONSENT_VERSION,
  allowPrivacyRequest,
  isSameOriginRequest,
  isUuid,
  parseConsentCookie,
} from "@/lib/privacy-consent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStore<T extends Response>(response: T): T {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

function sanitizePagePath(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 2048 || !input.startsWith("/") || input.startsWith("//")) return null;
  let path: string;
  try {
    const parsed = new URL(input, "https://path.invalid");
    if (parsed.origin !== "https://path.invalid") return null;
    path = parsed.pathname;
  } catch {
    return null;
  }
  path = path
    .replace(/\/u\/[^/]+(?=\/|$)/i, "/u/:profile")
    .replace(/\/profile\/by-username\/[^/]+(?=\/|$)/i, "/profile/by-username/:username")
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?=\/|$)/gi, "/:id")
    .replace(/\/[a-f0-9]{32,}(?=\/|$)/gi, "/:token");
  if (path.length > 255 || path.includes("?") || path.includes("#")) return null;
  return path;
}

function sanitizeReferrerOrigin(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 2048) return null;
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin.slice(0, 255);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return noStore(fail("Same-origin request required", 403, "TRACKING_ORIGIN_FORBIDDEN"));
  const consent = parseConsentCookie(request.cookies.get(COOKIE_CONSENT_COOKIE)?.value);
  if (!consent || consent.version !== COOKIE_CONSENT_VERSION || consent.preferences.analytics_enabled !== true) {
    return noStore(fail("Analytics consent is required", 403, "ANALYTICS_CONSENT_REQUIRED"));
  }
  if (!allowPrivacyRequest(request, `analytics:${consent.visitor_id}`, 90, 60 * 1000)) {
    return noStore(fail("Too many analytics events", 429, "ANALYTICS_RATE_LIMITED"));
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 4096) {
    return noStore(fail("Request body is too large", 413, "ANALYTICS_BODY_TOO_LARGE"));
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > 4096) {
    return noStore(fail("Request body is too large", 413, "ANALYTICS_BODY_TOO_LARGE"));
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return noStore(fail("A valid JSON body is required", 400, "ANALYTICS_INVALID_JSON"));
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return noStore(fail("A JSON object is required", 422, "ANALYTICS_INVALID_BODY"));
  }
  const input = body as Record<string, unknown>;
  const pagePath = sanitizePagePath(input.page_path);
  if (!pagePath || !isUuid(input.page_view_id)) {
    return noStore(fail("A safe page path and valid page-view ID are required", 422, "ANALYTICS_PAGE_VIEW_INVALID"));
  }
  const referrerOrigin = sanitizeReferrerOrigin(input.referrer_origin);
  const sessionId = isUuid(request.cookies.get(ANALYTICS_SESSION_COOKIE)?.value)
    ? request.cookies.get(ANALYTICS_SESSION_COOKIE)!.value
    : randomUUID();
  const optional = Object.values(consent.preferences).filter((value) => typeof value === "boolean");
  const consentState = optional.every(Boolean) ? "all" : "partial";

  try {
    const metadata = collectPrivacyVisitorMetadata(request.headers);
    const admin = getSupabaseAdmin();
    const { error } = await (admin as any).rpc("record_first_party_page_view_enriched", {
      p_visitor_id: consent.visitor_id,
      p_session_id: sessionId,
      p_page_view_id: input.page_view_id,
      p_page_path: pagePath,
      p_referrer_origin: referrerOrigin,
      p_country_code: metadata.countryCode,
      p_region_code: metadata.regionCode,
      p_city_name: metadata.cityName,
      p_device_category: metadata.deviceCategory,
      p_browser_name: metadata.browserName,
      p_browser_version: metadata.browserVersion,
      p_operating_system: metadata.operatingSystem,
      p_operating_system_version: metadata.operatingSystemVersion,
      p_language_code: metadata.languageCode,
      p_timezone: metadata.timezone,
      p_consent_state: consentState,
      p_consent_version: consent.version,
    });
    if (error) {
      console.error("[FIRST_PARTY_PAGE_VIEW_FAILED]", { code: error.code, message: error.message });
      return noStore(fail("Analytics event could not be stored", 503, "ANALYTICS_STORE_FAILED"));
    }
  } catch (caught) {
    console.error("[FIRST_PARTY_ANALYTICS_CONFIG_ERROR]", caught);
    return noStore(fail("Analytics storage is temporarily unavailable", 503, "ANALYTICS_STORE_FAILED"));
  }

  const response = noStore(ok({ accepted: true }));
  response.cookies.set(ANALYTICS_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: ANALYTICS_SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
