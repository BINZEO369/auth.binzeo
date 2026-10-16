import "server-only";
import { cache } from "react";
import { headers } from "next/headers";

export type CentralSessionUser = {
  id: string;
  email?: string | null;
  email_confirmed?: boolean;
};

type SessionEnvelope = {
  success?: boolean;
  data?: { user?: CentralSessionUser | null };
};

export const getCentralSession = cache(async (): Promise<CentralSessionUser | null> => {
  const base = process.env.CENTRAL_API_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) throw new Error("Central API is not configured; local identity access is disabled.");

  const incoming = await headers();
  const requestHeaders = new Headers({ Accept: "application/json" });
  const cookie = incoming.get("cookie");
  if (cookie) requestHeaders.set("cookie", cookie);

  const response = await fetch(new URL("/v1/auth/session", `${base}/`), {
    method: "GET",
    headers: requestHeaders,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5_000),
  });

  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error("Central identity service is temporarily unavailable.");

  const payload = await response.json() as SessionEnvelope;
  if (payload.success !== true || !payload.data?.user?.id) {
    throw new Error("Central identity service returned an invalid session response.");
  }
  return payload.data.user;
});
