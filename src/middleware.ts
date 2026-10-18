import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard"];
const AUTH_ONLY = ["/signin", "/signup", "/oauth/authorize"];
const API_TIMEOUT_MS = 5_000;

type ApiEnvelope = {
  success?: boolean;
  data?: { service?: string; status?: string; user?: { id?: string } | null };
};

function centralBase(): string | null {
  const value = process.env.CENTRAL_API_BASE_URL?.trim().replace(/\/+$/, "");
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function unavailable() {
  return new NextResponse(
    "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>BINZEO temporarily unavailable</title><body style=\"font:16px system-ui;max-width:640px;margin:15vh auto;padding:24px;color:#111\"><h1>BINZEO is temporarily unavailable</h1><p>The central service is not reachable. Please try again shortly.</p></body></html>",
    {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Retry-After": "15",
      },
    },
  );
}

async function centralGet(base: string, path: string, cookie?: string): Promise<Response> {
  const headers = new Headers({ Accept: "application/json" });
  if (cookie) headers.set("cookie", cookie);
  return fetch(new URL(path, `${base}/`), {
    method: "GET",
    headers,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });
}

function forwardCookies(upstream: Response, downstream: NextResponse) {
  const headers = upstream.headers as Headers & { getSetCookie?: () => string[] };
  const cookies = headers.getSetCookie?.() ?? (upstream.headers.get("set-cookie") ? [upstream.headers.get("set-cookie")!] : []);
  for (const cookie of cookies) downstream.headers.append("set-cookie", cookie);
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isApiRequest = pathname.startsWith("/api/");

  if (isApiRequest) {
    const origin = req.headers.get("origin");
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    if (
      ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
      origin &&
      origin !== req.nextUrl.origin &&
      origin !== configuredOrigin
    ) {
      return NextResponse.json(
        { success: false, error: { message: "Cross-origin request rejected.", code: "CSRF_ORIGIN_REJECTED" } },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
    // API execution and rate limiting are owned exclusively by the Central API rewrite.
    return NextResponse.next();
  }

  if (pathname === "/oauth/authorize" && !req.nextUrl.searchParams.has("client_id")) {
    return new NextResponse("Invalid Central Auth request: client_id is required.", {
      status: 400,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const base = centralBase();
  if (!base) return unavailable();

  let health: Response;
  try {
    health = await centralGet(base, "/v1/health");
    const healthPayload = await health.json() as ApiEnvelope;
    if (
      !health.ok ||
      healthPayload.success !== true ||
      healthPayload.data?.service !== "api.binzeo" ||
      healthPayload.data.status !== "ok"
    ) return unavailable();
  } catch {
    return unavailable();
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const protectedPath = PROTECTED.some((path) => pathname.startsWith(path));
  const authOnlyPath = AUTH_ONLY.some((path) => pathname.startsWith(path));

  if (protectedPath || authOnlyPath) {
    let session: Response;
    try {
      session = await centralGet(base, "/v1/auth/session", req.headers.get("cookie") ?? undefined);
      forwardCookies(session, response);
    } catch {
      return unavailable();
    }

    let authenticated = false;
    if (session.ok) {
      try {
        const payload = await session.json() as ApiEnvelope;
        authenticated = payload.success === true && Boolean(payload.data?.user?.id);
      } catch {
        return unavailable();
      }
    } else if (session.status !== 401 && session.status !== 403) {
      return unavailable();
    }

    if (!authenticated && protectedPath) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const googleSetup = pathname === "/signup" && req.nextUrl.searchParams.get("google_setup") === "1";
    const oauthClientHandoff = (pathname === "/signin" || pathname === "/oauth/authorize") && req.nextUrl.searchParams.has("client_id");
    if (authenticated && authOnlyPath && !googleSetup && !oauthClientHandoff) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
