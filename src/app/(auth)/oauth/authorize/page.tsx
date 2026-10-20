import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import ConnectAuthorization from "@/components/auth/ConnectAuthorization";
import { getCentralSession } from "@/lib/central-session";

export const metadata: Metadata = {
  title: "Connect application",
  description: "Connect JABIYEN securely with your BINZEO account",
  robots: { index: false, follow: false },
};

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function InvalidRequest() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">
      <section className="mx-auto max-w-md rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/40">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">BINZEO Central Auth</p>
        <h1 className="text-2xl font-semibold">Connection unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">The application connection request is invalid or incomplete. Please start again from JABIYEN.</p>
      </section>
    </main>
  );
}

export default async function OAuthAuthorizePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const clientId = one(params.client_id);
  const redirectUri = one(params.redirect_uri);
  const state = one(params.state);
  const codeChallenge = one(params.code_challenge);
  const method = one(params.code_challenge_method);

  if (
    clientId !== "jabiyen" ||
    !/^https:\/\//.test(redirectUri) ||
    redirectUri.includes("#") ||
    !/^[A-Za-z0-9_-]{32,128}$/.test(state) ||
    !/^[A-Za-z0-9_-]{43}$/.test(codeChallenge) ||
    method !== "S256"
  ) {
    return <InvalidRequest />;
  }

  const user = await getCentralSession();
  if (!user) {
    return (
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    );
  }

  return <ConnectAuthorization clientId={clientId} redirectUri={redirectUri} state={state} codeChallenge={codeChallenge} />;
}
