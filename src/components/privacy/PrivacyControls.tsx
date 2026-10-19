"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

type CookiePreferences = {
  necessary_enabled: true;
  functional_enabled: boolean;
  analytics_enabled: boolean;
  experience_enabled: boolean;
  marketing_enabled: boolean;
  cross_site_enabled: boolean;
  precise_location_enabled: boolean;
  raw_ip_enabled: boolean;
  device_diagnostics_enabled: boolean;
  fingerprint_enabled: boolean;
};

type OptionalKey = Exclude<keyof CookiePreferences, "necessary_enabled">;
type Action = "accept_all" | "reject_optional" | "save_settings";

const CONSENT_VERSION = "2026-10-14.1";
const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary_enabled: true,
  functional_enabled: false,
  analytics_enabled: false,
  experience_enabled: false,
  marketing_enabled: false,
  cross_site_enabled: false,
  precise_location_enabled: false,
  raw_ip_enabled: false,
  device_diagnostics_enabled: false,
  fingerprint_enabled: false,
};
const ACCEPT_ALL: CookiePreferences = {
  necessary_enabled: true,
  functional_enabled: true,
  analytics_enabled: true,
  experience_enabled: true,
  marketing_enabled: true,
  cross_site_enabled: true,
  precise_location_enabled: true,
  raw_ip_enabled: true,
  device_diagnostics_enabled: true,
  fingerprint_enabled: true,
};

const CATEGORIES: { key: keyof CookiePreferences; title: string; description: string; required?: boolean }[] = [
  {
    key: "necessary_enabled",
    title: "Essential",
    description: "Sign-in, account security, and remembering this choice with a random consent reference. Always on.",
    required: true,
  },
  {
    key: "functional_enabled",
    title: "Functional",
    description: "Optional saved interface preferences. No separate functional tracker is active yet.",
  },
  {
    key: "analytics_enabled",
    title: "Analytics",
    description: "With your selected permissions, BINZEO stores the server-observed IP, browser/device diagnostics, GPS coordinates and accuracy, sanitized page paths, referrer origin and session measurements for up to 180 days.",
  },
  {
    key: "experience_enabled",
    title: "Experience",
    description: "Reserved for product-experience measurements; no integration is active yet.",
  },
  {
    key: "marketing_enabled",
    title: "Marketing",
    description: "No advertising pixels or marketing tags are currently configured.",
  },
  {
    key: "cross_site_enabled",
    title: "Cross-site",
    description: "No cross-site trackers are currently configured.",
  },
  { key: "precise_location_enabled", title: "Precise location", description: "With browser location permission, store GPS coordinates and accuracy for each page view." },
  { key: "raw_ip_enabled", title: "Raw IP and network diagnostics", description: "Store the server-observed IP address and network metadata for up to 180 days." },
  { key: "device_diagnostics_enabled", title: "Device diagnostics", description: "Store screen, viewport, network, hardware and rendering capability details." },
  { key: "fingerprint_enabled", title: "Device fingerprint", description: "Store a hashed device signal fingerprint for up to 180 days." },
];

type PageTrackingState = { path: string; pageViewId: string; startedAt: number; maxScroll: number };

function readScrollDepth() {
  const root = document.documentElement;
  if (root.scrollHeight <= window.innerHeight) return 100;
  return Math.min(100, Math.round(((window.scrollY + window.innerHeight) / root.scrollHeight) * 100));
}

function sendPageEngagement(state: PageTrackingState, title: string) {
  return fetch("/api/privacy/events", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_type: "engagement", page_path: state.path, page_view_id: state.pageViewId, page_title: title, scroll_depth_percent: state.maxScroll, time_on_page_seconds: Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000)) }),
    keepalive: true,
  }).catch(() => undefined);
}

async function collectClientSignals(preferences: CookiePreferences) {
  const nav = navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number }; deviceMemory?: number; hardwareConcurrency?: number };
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;
  const debug = gl?.getExtension("WEBGL_debug_renderer_info") as { UNMASKED_VENDOR_WEBGL: number; UNMASKED_RENDERER_WEBGL: number } | null;
  const webglVendor = debug && gl ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : null;
  const webglRenderer = debug && gl ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null;
  const diagnostics = preferences.device_diagnostics_enabled ? {
    screen_width: window.screen.width, screen_height: window.screen.height,
    viewport_width: window.innerWidth, viewport_height: window.innerHeight,
    device_pixel_ratio: window.devicePixelRatio, touch_points: navigator.maxTouchPoints,
    hardware_concurrency: nav.hardwareConcurrency ?? null, device_memory_gb: nav.deviceMemory ?? null,
    network_type: nav.connection?.effectiveType ?? null, network_downlink_mbps: nav.connection?.downlink ?? null,
    webgl_vendor: typeof webglVendor === "string" ? webglVendor.slice(0, 255) : null,
    webgl_renderer: typeof webglRenderer === "string" ? webglRenderer.slice(0, 255) : null,
  } : {};
  const fingerprintInput = JSON.stringify({ ua: navigator.userAgent, language: navigator.language, platform: navigator.platform, screen: [window.screen.width, window.screen.height, window.devicePixelRatio], cores: nav.hardwareConcurrency ?? null, memory: nav.deviceMemory ?? null, webglVendor, webglRenderer });
  const fingerprint = preferences.fingerprint_enabled && crypto.subtle ? Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(fingerprintInput)))).map((byte) => byte.toString(16).padStart(2, "0")).join("") : null;
  const location = await new Promise<Record<string, unknown>>((resolve) => {
    if (!preferences.precise_location_enabled || !navigator.geolocation) { resolve({ location_permission_status: "unavailable" }); return; }
    navigator.geolocation.getCurrentPosition((position) => resolve({ gps_latitude: position.coords.latitude, gps_longitude: position.coords.longitude, gps_accuracy_meters: position.coords.accuracy, gps_altitude_meters: position.coords.altitude, gps_heading: position.coords.heading, gps_speed_mps: position.coords.speed, gps_captured_at: new Date(position.timestamp).toISOString(), location_permission_status: "granted", location_source: "browser_geolocation" }), () => resolve({ location_permission_status: "denied" }), { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
  });
  return { ...diagnostics, device_fingerprint_hash: fingerprint, ...location };
}

export default function PrivacyControls() {
  const pathname = usePathname() || "/";
  const showControls = pathname === "/account" || pathname.startsWith("/account/");
  const portalTarget = typeof document === "undefined" ? null : document.getElementById("cookie-controls-slot");
  const trackingState = useRef<PageTrackingState | null>(null);
  const [ready, setReady] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"notice" | "preferences">("notice");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/privacy/consent", { method: "GET", cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload?.success) throw new Error("Could not load cookie choices");
        return payload.data?.consent as { version?: string; preferences?: CookiePreferences } | null;
      })
      .then((consent) => {
        if (!active) return;
        if (consent?.version === CONSENT_VERSION && consent.preferences) {
          setPreferences(consent.preferences);
          setHasDecision(true);
          setOpen(false);
        } else {
          setPreferences(DEFAULT_PREFERENCES);
          setHasDecision(false);
          setOpen(false);
          setView("notice");
        }
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setPreferences(DEFAULT_PREFERENCES);
        setHasDecision(false);
        setOpen(false);
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const openCookieControls = () => {
      setView(hasDecision ? "preferences" : "notice");
      setError("");
      setOpen(true);
    };
    window.addEventListener("binzeo:open-cookie-controls", openCookieControls);
    return () => window.removeEventListener("binzeo:open-cookie-controls", openCookieControls);
  }, [hasDecision]);

  useEffect(() => {
    if (!ready || !hasDecision || !preferences.analytics_enabled) {
      trackingState.current = null;
      return;
    }

    const previous = trackingState.current;
    if (previous) void sendPageEngagement(previous, document.title);
    const pageViewId = crypto.randomUUID();
    const state: PageTrackingState = { path: pathname, pageViewId, startedAt: Date.now(), maxScroll: readScrollDepth() };
    trackingState.current = state;
    const updateScroll = () => { state.maxScroll = Math.max(state.maxScroll, readScrollDepth()); };
    let referrerOrigin: string | null = null;
    try {
      if (document.referrer) referrerOrigin = new URL(document.referrer).origin;
    } catch {
      referrerOrigin = null;
    }
    const query = new URLSearchParams(window.location.search);
    void (async () => {
      const signals = await collectClientSignals(preferences);
      if (trackingState.current?.pageViewId !== pageViewId) return;
      await fetch("/api/privacy/events", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_path: pathname, page_view_id: pageViewId, page_title: document.title, referrer_origin: referrerOrigin, ...signals, utm_source: query.get("utm_source"), utm_medium: query.get("utm_medium"), utm_campaign: query.get("utm_campaign"), utm_term: query.get("utm_term"), utm_content: query.get("utm_content") }),
        keepalive: true,
      });
    })().catch(() => undefined);

    const persist = () => {
      if (trackingState.current?.pageViewId === pageViewId) void sendPageEngagement(state, document.title);
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pagehide", persist);
    return () => {
      persist();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pagehide", persist);
    };
  }, [hasDecision, pathname, preferences.analytics_enabled, ready]);

  async function savePreferences(method: Action, next: CookiePreferences) {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/privacy/consent", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, preferences: next }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success || payload.data?.saved !== true) {
        throw new Error(payload?.error?.message || "Your choices could not be saved. Please try again.");
      }
      setPreferences(payload.data.preferences as CookiePreferences);
      setHasDecision(true);
      setOpen(false);
      setView("notice");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your choices could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function updatePreference(key: OptionalKey, value: boolean) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  if (!ready || !showControls || !open || !portalTarget) return null;

  return createPortal(
    <div className="w-full">
      <section
            role="region"
            aria-label="Cookie and privacy choices"
            className="rounded-[18px] border border-gray-100 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">Privacy choices</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-black sm:text-2xl">
                  {view === "notice" ? "Your privacy, your choice" : "Choose your cookie settings"}
                </h2>
              </div>
              {hasDecision && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-2 py-1 text-sm text-black/55 hover:bg-black/5 hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
                  aria-label="Close cookie settings"
                >
                  Close
                </button>
              )}
            </div>

            {view === "notice" ? (
              <>
                <p className="mt-3 text-sm leading-6 text-black/65">
                  Essential cookies keep sign-in and security working and remember your choice with a random consent reference. Optional analytics are off unless you enable them. If enabled, BINZEO records the server-observed IP address, browser/device diagnostics, GPS coordinates and accuracy when your browser grants location access, sanitized page paths, referrer origin, campaign data and session measurements for up to 180 days. GPS may be inaccurate. Passwords, OTPs, raw user-agent strings, full URLs, query strings and form contents are not stored. The analytics session cookie expires after 30 minutes of inactivity.
                </p>
                <p className="mt-2 text-xs leading-5 text-black/50">
                  No advertising or cross-site tracking scripts are currently configured. Optional categories without an active integration will not load a script.
                </p>
              </>
            ) : (
              <div className="mt-3 divide-y divide-black/[0.07]">
                {CATEGORIES.map((category) => {
                  const enabled = preferences[category.key];
                  return (
                    <div key={category.key} className="flex items-start justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-black">{category.title}</h3>
                          {category.required && <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium text-black/55">Required</span>}
                        </div>
                        <p className="mt-1 max-w-[27rem] text-xs leading-5 text-black/55">{category.description}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={`${category.title}${category.required ? " (always on)" : ""}`}
                        disabled={category.required || saving}
                        onClick={() => !category.required && updatePreference(category.key as OptionalKey, !enabled)}
                        className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed ${enabled ? "border-black bg-black" : "border-black/15 bg-black/10"}`}
                      >
                        <span className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-[22px]" : "translate-x-[3px]"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-800">{error}</p>}

            {view === "notice" ? (
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button type="button" disabled={saving} onClick={() => savePreferences("reject_optional", DEFAULT_PREFERENCES)} className="rounded-full border border-black/15 px-4 py-3 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:opacity-50">
                  Only essential
                </button>
                <button type="button" disabled={saving} onClick={() => { setPreferences(DEFAULT_PREFERENCES); setView("preferences"); }} className="rounded-full border border-black/15 px-4 py-3 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:opacity-50">
                  Customize
                </button>
                <button type="button" disabled={saving} onClick={() => savePreferences("accept_all", ACCEPT_ALL)} className="rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-50">
                  Accept all
                </button>
              </div>
            ) : (
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <button type="button" disabled={saving} onClick={() => { setView("notice"); setError(""); }} className="rounded-full border border-black/15 px-4 py-3 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:opacity-50">
                  Back
                </button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button type="button" disabled={saving} onClick={() => savePreferences("reject_optional", DEFAULT_PREFERENCES)} className="rounded-full border border-black/15 px-4 py-3 text-sm font-medium text-black transition hover:bg-black/[0.04] disabled:opacity-50">
                    Only essential
                  </button>
                  <button type="button" disabled={saving} onClick={() => savePreferences("save_settings", preferences)} className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-50">
                    {saving ? "Saving…" : "Save choices"}
                  </button>
                </div>
              </div>
            )}

            <p className="mt-4 text-[10px] leading-4 text-black/40">
              You can reopen Cookie settings at any time. Your browser will ask again after 180 days; the database consent record carries the same expiry marker.
            </p>
      </section>
    </div>,
    portalTarget,
  );
}
