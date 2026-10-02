type HeaderReader = { get(name: string): string | null };

export type RequestLocation = {
  ip: string;
  country: string | null;
  city: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function requestIp(headers: HeaderReader): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
    "0.0.0.0"
  );
}

function headerLocation(headers: HeaderReader): Omit<RequestLocation, "ip"> {
  const latitude = Number(headers.get("x-vercel-ip-latitude") ?? headers.get("x-client-latitude"));
  const longitude = Number(headers.get("x-vercel-ip-longitude") ?? headers.get("x-client-longitude"));
  return {
    country: (headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry") ?? null)?.toUpperCase() || null,
    city: headers.get("x-vercel-ip-city") ?? headers.get("x-client-city") ?? null,
    region: headers.get("x-vercel-ip-country-region") ?? headers.get("x-client-region") ?? null,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
  };
}

function isPrivateOrPlaceholderIp(ip: string) {
  return (
    ip === "0.0.0.0" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

export async function resolveRequestLocation(headers: HeaderReader, useExternalLookup = true): Promise<RequestLocation> {
  const ip = requestIp(headers);
  const fromHeaders = headerLocation(headers);
  const result: RequestLocation = { ip, ...fromHeaders };

  if (!useExternalLookup || isPrivateOrPlaceholderIp(ip) || (result.country && result.city)) {
    return result;
  }

  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { Accept: "application/json", "User-Agent": "BINZEO registration security" },
      signal: AbortSignal.timeout(1500),
      cache: "no-store",
    });
    if (!response.ok) return result;
    const data = (await response.json()) as {
      country_code?: string;
      city?: string;
      region?: string;
      latitude?: number;
      longitude?: number;
    };
    result.country = result.country ?? data.country_code?.toUpperCase() ?? null;
    result.city = result.city ?? data.city ?? null;
    result.region = result.region ?? data.region ?? null;
    result.latitude = result.latitude ?? (typeof data.latitude === "number" ? data.latitude : null);
    result.longitude = result.longitude ?? (typeof data.longitude === "number" ? data.longitude : null);
  } catch {
    // Location is best-effort; registration must still work if lookup is unavailable.
  }
  return result;
}
