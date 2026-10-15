"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function randomBase64Url(bytes = 32) {
  const value = crypto.getRandomValues(new Uint8Array(bytes));
  let binary = "";
  value.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function challengeFor(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  let binary = "";
  new Uint8Array(digest).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export default function AuthorizePage() {
  const [message, setMessage] = useState("Preparing secure sign-in…");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const clientId = params.get("client_id");
        const redirectUri = params.get("redirect_uri");
        const state = params.get("state");
        const codeChallenge = params.get("code_challenge");
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL || "https://admin-binzeo.vercel.app";
        const allowedCallback = `${new URL(adminUrl).origin}/auth/callback`;
        if (clientId !== "admin" || redirectUri !== allowedCallback || !state || !codeChallenge) {
          throw new Error("This sign-in request is not allowed.");
        }
        if (!/^[A-Za-z0-9_-]{32,128}$/.test(state) || !/^[A-Za-z0-9_-]{43,128}$/.test(codeChallenge)) {
          throw new Error("The sign-in request is invalid or expired.");
        }

        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw new Error("Unable to read the current BINZEO session.");
        if (!session?.access_token || !session.refresh_token) {
          const next = `/sso/authorize${window.location.search}`;
          window.location.replace(`/signin?next=${encodeURIComponent(next)}`);
          return;
        }

        setMessage("Verifying your BINZEO admin access…");
        const response = await fetch("/api/auth/authorize", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: clientId,
            redirect_uri: redirectUri,
            state,
            code_challenge: codeChallenge,
            refresh_token: session.refresh_token,
          }),
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok || !result.success || typeof result.data?.redirect_url !== "string") {
          throw new Error(result.error?.message || "Unable to complete secure sign-in.");
        }
        const destination = new URL(result.data.redirect_url);
        if (destination.origin !== new URL(adminUrl).origin || destination.pathname !== "/auth/callback") {
          throw new Error("The sign-in service returned an invalid destination.");
        }
        window.location.replace(destination.toString());
      } catch (error) {
        if (active) setMessage(error instanceof Error ? error.message : "Unable to complete secure sign-in.");
      }
    })();
    return () => { active = false; };
  }, []);

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><section role="status" aria-live="polite" style={{ maxWidth: 480, textAlign: "center" }}><h1>BINZEO secure sign-in</h1><p>{message}</p></section></main>;
}
