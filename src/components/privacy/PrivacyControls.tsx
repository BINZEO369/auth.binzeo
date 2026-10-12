"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type CookiePreferences = {
  necessary_enabled: true;
  functional_enabled: boolean;
  analytics_enabled: boolean;
  experience_enabled: boolean;
  marketing_enabled: boolean;
  cross_site_enabled: boolean;
};

type OptionalKey = Exclude<keyof CookiePreferences, "necessary_enabled">;
type Action = "accept_all" | "reject_optional" | "save_settings";

const CONSENT_VERSION = "2026-10-12.1";
const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary_enabled: true,
  functional_enabled: false,
  analytics_enabled: false,
  experience_enabled: false,
  marketing_enabled: false,
  cross_site_enabled: false,
};
const ACCEPT_ALL: CookiePreferences = {
  necessary_enabled: true,
  functional_enabled: true,
  analytics_enabled: true,
  experience_enabled: true,
  marketing_enabled: true,
  cross_site_enabled: true,
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
    description: "First-party pseudonymous page paths, session counts, and referring-site origin only. No query strings, form contents, raw IPs, or raw user-agent strings are stored.",
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
];

export default function PrivacyControls() {
  const pathname = usePathname() || "/";
  const lastTrackedPath = useRef<string | null>(null);
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
          setOpen(true);
          setView("notice");
        }
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setPreferences(DEFAULT_PREFERENCES);
        setHasDecision(false);
        setOpen(true);
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !hasDecision || !preferences.analytics_enabled) {
      lastTrackedPath.current = null;
      return;
    }
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    let referrerOrigin: string | null = null;
    try {
      if (document.referrer) referrerOrigin = new URL(document.referrer).origin;
    } catch {
      referrerOrigin = null;
    }
    void fetch("/api/privacy/events", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_path: pathname, page_view_id: crypto.randomUUID(), referrer_origin: referrerOrigin }),
      keepalive: true,
    }).catch(() => undefined);
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

  if (!ready) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => {
            setView("preferences");
            setError("");
            setOpen(true);
          }}
          className="fixed bottom-3 left-3 z-[9998] rounded-full border border-black/10 bg-white/95 px-3.5 py-2 text-xs font-medium text-black shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          aria-label="Open cookie settings"
        >
          Cookie settings
        </button>
      )}

      {open && (
        <div className="fixed inset-x-3 bottom-3 z-[9999] mx-auto w-auto sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(36rem,calc(100vw-3rem))]">
          <section
            role="region"
            aria-label="Cookie and privacy choices"
            className="max-h-[84dvh] overflow-y-auto rounded-[24px] border border-black/10 bg-white/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl sm:p-6"
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
                  Essential cookies keep sign-in and security working and remember your choice with a random consent reference. Optional analytics are off unless you enable them. If enabled, BINZEO records pseudonymous page paths, session counts, and the referring site&apos;s origin only; this tracker does not store URL query strings, form contents, raw IP addresses, or raw user-agent strings. The analytics session cookie expires after 30 minutes of inactivity.
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
        </div>
      )}
    </>
  );
}
