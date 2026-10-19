# নতুন Website-কে BINZEO Central Auth-এর সঙ্গে যুক্ত করা

এই নির্দেশিকাটি নতুন website, admin app বা frontend-কে `auth.binzeo`-এর Central Auth-এর মাধ্যমে sign-in করানোর জন্য। লক্ষ্য হলো: **password, OTP/2FA code, passkey, one-time token এবং QR verification কেবল Central Auth-এ হবে**। সংযুক্ত website credentials যাচাই করবে না; সেটি sign-in শুরু করবে, অনুমোদিত callback-এ authorization code নেবে এবং code বিনিময় করে নিজের application session তৈরি করবে।

## 1. Architecture ও trust boundary

```text
নতুন Website                  Central Auth UI                 Central API
     |                              |                               |
     |-- client_id + callback ---->|                               |
     |   + state + PKCE challenge  |-- client/callback check ---->|
     |                              |                               |
     |                              |  passkey / password / OTP /   |
     |                              |  token / QR যাচাই             |
     |                              |                               |
     |<-- code + state -------------|<-- one-time auth code --------|
     |                                                              |
     |-- code + verifier ------------------------------------------>|
     |<-- application session --------------------------------------|
```

- **Central Auth UI:** `https://auth-binzeo.vercel.app/oauth/authorize`
- **Central API:** deployment-এ নির্ধারিত API origin ব্যবহার করুন। বর্তমান Vercel production origin: `https://api-binzeo.vercel.app`। নতুন app-এর server config-এ API origin environment variable হিসেবে রাখুন; source code-এ environment-specific URL ছড়িয়ে দেবেন না।
- **Jabiyen production callback:** `https://jabiyen-website.vercel.app/auth/callback`

`/oauth/authorize` হলো browser-facing Central Auth UI route। এটি Central Auth-এর `/v1/auth/authorize` API endpoint থেকে আলাদা; API endpoint-টি login সফল হওয়ার পরে one-time code তৈরির জন্য Central Auth UI নিজেই ব্যবহার করে।

Central Auth email/password, passkey assertion, one-time token, QR scan এবং প্রয়োজন হলে 2FA OTP নিজেই পরিচালনা করে। Authentication success-এর পরে website-এ **session token নয়, স্বল্পমেয়াদি authorization code** ফেরত যায়। Website-টি PKCE verifier দিয়ে code redeem করে।

## 2. নতুন client নিবন্ধন

### Client ID convention

নতুন website-এর জন্য আলাদা, lowercase client ID নিন:

```text
<project_key>:<client_key>
উদাহরণ: storefront:website
```

দুটি অংশই `a-z`, `0-9` ও hyphen দিয়ে শুরু হওয়া slug হতে হবে; uppercase, underscore বা spaces ব্যবহার করবেন না। `jabiyen` হলো বর্তমান API-তে বিশেষভাবে allowlisted legacy client ID—নতুন website-এর জন্য এটি পুনর্ব্যবহার করবেন না।

### Registry কোথায় থাকে

Central API `platform_projects` ও `platform_clients` registry থেকে generic client resolve করে। দুই টেবিলই Central API-র Supabase service-role access-এর পেছনে; browser বা public website-কে সরাসরি registry-তে write করার permission দেবেন না. Project ও client দুটিরই `status` `active` হতে হবে।

Production registration-টি **api.binzeo Central API যে auth database-এ configured, সেই database**-এর migration হিসেবে করতে হবে—নতুন website-এর database-এ নয়। Repository-তে schema migration `api.binzeo/supabase/migrations/20261016100000_add_platform_project_registry.sql`-এ registry tables/grants, আর `20261018063300_register_jabiyen_central_sso.sql`-এ namespaced authorization-code ID support-এর উদাহরণ আছে। Generic client চালুর আগে production Central API database-এ সংশ্লিষ্ট migrations প্রয়োগ হয়েছে কি না নিশ্চিত করুন।

একটি registration migration-এর কাঠামো:

```sql
DO $$
DECLARE
  v_project_id uuid;
BEGIN
  INSERT INTO public.platform_projects (
    project_key, project_name, brand_name, project_type, status,
    database_ref, allowed_origins, features
  ) VALUES (
    'storefront',
    'Storefront',
    'Storefront',
    'product',
    'active',
    'auth',
    ARRAY['https://shop.example.com'],
    ARRAY['central-auth']
  )
  ON CONFLICT (project_key) DO UPDATE SET
    project_name = EXCLUDED.project_name,
    brand_name = EXCLUDED.brand_name,
    project_type = EXCLUDED.project_type,
    status = EXCLUDED.status,
    database_ref = EXCLUDED.database_ref,
    allowed_origins = EXCLUDED.allowed_origins,
    features = EXCLUDED.features
  RETURNING id INTO v_project_id;

  INSERT INTO public.platform_clients (
    project_id, client_key, client_name, client_type, status,
    allowed_origins, redirect_uris, scopes, public_config
  ) VALUES (
    v_project_id,
    'website',
    'Storefront Website',
    'frontend',
    'active',
    ARRAY['https://shop.example.com'],
    ARRAY['https://shop.example.com/auth/callback'],
    ARRAY['profile'],
    '{"branding":{"logo_url":"https://shop.example.com/logo.svg"}}'::jsonb
  )
  ON CONFLICT (project_id, client_key) DO UPDATE SET
    client_name = EXCLUDED.client_name,
    client_type = EXCLUDED.client_type,
    status = EXCLUDED.status,
    allowed_origins = EXCLUDED.allowed_origins,
    redirect_uris = EXCLUDED.redirect_uris,
    scopes = EXCLUDED.scopes,
    public_config = EXCLUDED.public_config;
END $$;
```

এটি একটি **template**, সরাসরি production SQL editor-এ চালানোর নির্দেশ নয়। Project key, origin, callback এবং client type review করে version-controlled migration বানান। স্বাভাবিক public website-এর জন্য `client_type='frontend'`; admin client হলে `client_type='admin'` দিন—Central API admin authorization enforce করে। Password, client secret বা service-role key registry-তে কখনো রাখবেন না; PKCE public client-এ client secret লাগে না।

### Central Auth card-এ website logo

Central Auth-এর OAuth card-এ BINZEO logo, secure-connection graphic এবং সংযুক্ত website-এর logo/name দেখানো হয়। Generic client-এর logo server-controlled registry-তে রাখুন—উপরের উদাহরণে `platform_clients.public_config.branding.logo_url` ব্যবহার করা হয়েছে। Client-specific logo না থাকলে `platform_projects.metadata.branding.logo_url` fallback হিসেবে ব্যবহার করা যায়। Logo URL অবশ্যই absolute HTTPS URL হতে হবে; query string/fragment গ্রহণ করা হয় না এবং host-টি project/client-এর `allowed_origins` অথবা registered callback origin-এর একটি হতে হবে। Central API শুধু যাচাইকৃত `logo_url` metadata response-এ প্রকাশ করে; browser/query parameter থেকে আসা logo URL বিশ্বাস করবেন না। বর্তমান legacy `jabiyen` client-এর জন্য canonical `https://jabiyen-website.vercel.app/logo.png` asset ব্যবহৃত হয়।

> Redirect URI byte-for-byte exact match হয়। Scheme, hostname, path, port ও trailing slash-সহ সম্পূর্ণ URI নিবন্ধন করুন। Wildcard/prefix redirect নেই। Production-এ সব callback-এর জন্য HTTPS বাধ্যতামূলক; শুধু non-production local development-এ `localhost`, `127.0.0.1` বা `[::1]`-এর HTTP callback অনুমোদিত। Preview-এর জন্য wildcard domain না দিয়ে নির্দিষ্ট, স্থিতিশীল HTTPS callback register করুন; প্রয়োজনে আলাদা staging client ব্যবহার করুন।

### Registration যাচাই

Browser/API smoke check হিসেবে callback-সহ metadata endpoint পড়ুন:

```text
GET https://api-binzeo.vercel.app/v1/auth/oauth-client
    ?client_id=storefront:website
    &redirect_uri=https%3A%2F%2Fshop.example.com%2Fauth%2Fcallback
```

Expected: HTTP 200 এবং `success: true`; response-এর `data.client_id` request-এর ID-এর সঙ্গে একই হতে হবে। `OAUTH_CLIENT_NOT_FOUND` হলে project/client row অনুপস্থিত বা inactive, অথবা migration ভুল database-এ হয়েছে। `REDIRECT_URI_MISMATCH` হলে registry-র callback-এর সঙ্গে request হুবহু মেলান।

## 3. Website থেকে Central Auth শুরু করা

প্রতিটি sign-in প্রচেষ্টার জন্য cryptographically secure random `state` এবং PKCE `code_verifier` তৈরি করুন। `code_challenge = BASE64URL(SHA256(code_verifier))`। Verifier-টি browser flow হলে `sessionStorage`-এ একই tab-এর জন্য রাখুন; server-side flow হলে স্বল্পমেয়াদি, signed/HttpOnly session-এ রাখুন। `state`-ও একই sign-in transaction-এর সঙ্গে bind করুন।

```js
const AUTH_URL = 'https://auth-binzeo.vercel.app/oauth/authorize';
const CLIENT_ID = 'storefront:website';
const REDIRECT_URI = 'https://shop.example.com/auth/callback';

// randomBase64Url(n) অবশ্যই crypto.getRandomValues() ব্যবহার করবে।
const state = randomBase64Url(32);
const codeVerifier = randomBase64Url(32);
const codeChallenge = await sha256Base64Url(codeVerifier);

sessionStorage.setItem('central-auth-pending', JSON.stringify({
  state,
  codeVerifier,
  redirectUri: REDIRECT_URI,
  createdAt: Date.now(),
}));

const url = new URL(AUTH_URL);
url.searchParams.set('client_id', CLIENT_ID);
url.searchParams.set('redirect_uri', REDIRECT_URI);
url.searchParams.set('state', state);
url.searchParams.set('code_challenge', codeChallenge);
url.searchParams.set('code_challenge_method', 'S256');
// Jabiyen-style app session handoff চাইলে one-time, PKCE-bound ticket ব্যবহার করুন।
url.searchParams.set('handoff', 'one-time');
// method না দিলে Central Auth নিজেই method chooser দেখায়।
window.location.assign(url.toString());
```

`state` 32–128 URL-safe character এবং challenge 43 URL-safe character হতে হবে। Central Auth request-এর client ও callback যাচাই না হলে sign-in এগোতে দেয় না।

### Central Auth-এ দেখানো method

সাধারণত `method` parameter **না পাঠিয়ে** user-কে Central Auth-এর একই interface-এ method বেছে নিতে দিন। Deep-link দরকার হলে Central Auth-এর supported মান:

```text
method=passkey | email | token | qr
```

এই parameter কেবল Auth UI-তে কোন screen আগে দেখাবে তা নির্দেশ করে; method-এর verification সব ক্ষেত্রেই Central Auth-এর server/API-তে হয়।

- **Passkey:** browser WebAuthn ceremony Central Auth origin-এ চলে; biometric data website-এ যায় না।
- **Email/password:** password কেবল Central Auth-এ জমা হয়। Account-এ 2FA থাকলে OTP-ও Central Auth-এ দিতে হয়।
- **One-time token:** token Central Auth UI-তে প্রবেশ ও Central API-তে verify হয়; প্রয়োজনে OTP challenge সেখানেই সম্পন্ন হয়।
- **QR:** scanner ও token redemption Central Auth UI-তে হয়; website QR data যাচাই করে না।
- **OTP/2FA:** এটি passkey, email, temporary-token বা অন্য supported login-এর পর Central Auth-এ সম্পন্ন হয়; OTP app site-এ পাঠাবেন না।

## 4. Callback-এ authorization code অথবা one-time handoff যাচাই

Default OAuth/PKCE flow-তে Central Auth registered callback-এ `code` ও `state` query parameter দিয়ে ফেরে। App-session handoff mode চাইলে `handoff=one-time` যোগ করুন; তখন Central Auth registered callback-এর **URL fragment**-এ opaque `handoff_token` ও `state` দিয়ে ফেরে। Fragment server log/referrer-এ যায় না এবং callback script-কে তাৎক্ষণিকভাবে address bar থেকে সরাতে হবে। দুই mode-এর callback handler:

1. Query-তে code অথবা fragment-এ handoff ticket/state পড়ে; code/ticket-সহ URL অবিলম্বে scrub করে। একই response-এ দুটো credential এলে প্রত্যাখ্যান করে।
2. Stored state মিলিয়ে দেখে; verifier একই transaction/tab-এর হতে হবে এবং transaction 120 সেকেন্ডের বেশি পুরোনো হলে বাতিল করে।
3. **Code mode:** code ও verifier Central API-তে পাঠায়:

```http
POST https://api-binzeo.vercel.app/v1/auth/token
Content-Type: application/json
```

```json
{
  "client_id": "storefront:website",
  "redirect_uri": "https://shop.example.com/auth/callback",
  "code": "<callback-এ পাওয়া code>",
  "code_verifier": "<শুধু এই transaction-এর verifier>"
}
```

Success response-এ `data.session` থাকে; invalid/expired/reused code, ভুল callback বা ভুল verifier হলে exchange প্রত্যাখ্যাত হয়। Authorization code প্রায় দুই মিনিটে expire হয় এবং একবারই redeem করা যায়।

**One-time handoff mode:** callback fragment থেকে `handoff_token` ও `state` parse করে verifier-সহ নিচের body একই Central API-র `/v1/auth/handoff/redeem`-এ পাঠান:

```json
{
  "client_id": "storefront:website",
  "redirect_uri": "https://shop.example.com/auth/callback",
  "state": "<Central Auth-এ পাঠা একই state>",
  "token": "<fragment-এ পাওয়া handoff_token>",
  "code_verifier": "<শুধু এই transaction-এর verifier>"
}
```

Central Auth-এর final verification ও প্রয়োজনীয় OTP সম্পূর্ণ হওয়ার পরই `/v1/auth/handoff/issue` ticket দেয়। Ticket 60 সেকেন্ডে expire হয়; database-এ raw ticket নয়—শুধু SHA-256 hash এবং বর্তমান temporary-token schema-র masked preview/lifecycle metadata থাকে। Ticket-এর HMAC binding-এ user, registered client ID, byte-for-byte callback URI, state ও `BASE64URL(SHA256(code_verifier))` থাকে। Redeem route allowlist পুনরায় যাচাই করে, binding যাচাই শেষে বিদ্যমান atomic one-time consume RPC চালায় এবং app callback-এ session ফেরায়। Ticket re-use/expiry, mismatch বা wrong verifier প্রত্যাখ্যাত হয়। এই mode-এ দ্বিতীয় OTP prompt নেই—কারণ Central Auth-এ login/2FA ইতিমধ্যে সম্পন্ন। Manual temporary-token sign-in-এর নিজস্ব 2FA behavior অপরিবর্তিত থাকে।

**Session storage recommendation:** নতুন website-এ token exchange server-side/BFF route দিয়ে করুন; refresh token-কে JavaScript-accessible `localStorage`-এ রাখবেন না। Server-side session-এ Secure, HttpOnly, SameSite cookie ব্যবহার করুন। Browser-only SPA হলে refresh token persist করার আগে Central API integration/security owner-এর সঙ্গে session refresh strategy ঠিক করুন। Jabiyen reference callback refresh token browser storage-এ রাখে না।

## 5. Central Auth/API-এর অভ্যন্তরীণ protocol (reference)

Consuming website সাধারণত issue endpoint সরাসরি call করে না—Central Auth UI final sign-in (এবং প্রযোজ্য OTP) শেষে করে। Default OAuth authorize request-এ `client_id`, exact `redirect_uri`, `state`, `code_challenge`, `refresh_token`, এবং authenticated user-এর bearer access token থাকে। API active registry ও callback যাচাই করে, session encrypted server-side রেখে short-lived code দেয়; `/token` exchange PKCE যাচাই করে session ফেরায়। `handoff=one-time` mode-এ Central Auth শুধু verified bearer access token এবং `client_id`, exact callback, `state`, `code_challenge` দিয়ে `/handoff/issue` call করে; refresh token browser JavaScript দিয়ে পাঠায় না এবং `CENTRAL_OAUTH_ENCRYPTION_KEY` দিয়ে session encryption লাগে না। Handoff issue/redeem উভয় endpoint active generic client registry/callback (অথবা পুরোনো fixed Jabiyen callback) যাচাই করে। Authorization-code table-এর namespaced `project:client` constraint/migration শুধু code-mode-এর জন্য প্রয়োজন; handoff mode বিদ্যমান temporary-login-token storage ও atomic consume RPC ব্যবহার করে।

## 6. App site-এ কী থাকবে না

- Password, OTP/2FA code, passkey prompt বা one-time-token input field নয়।
- QR scanner বা passkey credential verification নয়।
- URL query/fragment-এ `access_token` বা `refresh_token` নয়; callback-এ শুধু code/state।
- Arbitrary callback, `next` URL বা user-provided return URL নয়।
- Supabase service-role key, Central Auth secret বা API private key নয়।

App-এর sign-in page একটি launcher হতে পারে; method নির্বাচনও Central Auth-এ করতে চাইলে সেটি কেবল একটি “Continue with BINZEO Central Auth” action রাখবে এবং `method` parameter বাদ দেবে।

## 7. নতুন integration-এর release checklist

- [ ] Project/client-এর lowercase unique `project_key:client_key` বরাদ্দ করা হয়েছে।
- [ ] Registry migration Central API-র **সঠিক production auth database**-এ apply ও review হয়েছে।
- [ ] Project/client active; `allowed_origins` এবং exact HTTPS `redirect_uris` ঠিক।
- [ ] `/v1/auth/oauth-client` endpoint exact client/callback-এর জন্য HTTP 200 দেয়।
- [ ] Website per sign-in transaction random state ও PKCE S256 challenge তৈরি/সংরক্ষণ করে।
- [ ] `method` বাদ দিয়ে Central Auth method chooser পরীক্ষা করা হয়েছে; দরকারে passkey/email/token/QR deep-link পরীক্ষা হয়েছে।
- [ ] Passkey, 2FA OTP, one-time token ও QR-এর positive/negative flow Central Auth-এ পরীক্ষা হয়েছে।
- [ ] Callback state mismatch, expired code, replayed code, wrong verifier ও wrong redirect test করা হয়েছে।
- [ ] Handoff mode চালু করলে expired/replayed ticket, callback/client/state/verifier mismatch প্রত্যাখ্যাত হয়; successful ticket 60-second expiry-তে একবারই consume হয়।
- [ ] Session secure cookie/BFF-এ রাখা হয়েছে; refresh token logs, URL বা localStorage-এ নেই।
- [ ] Production callback alias, Vercel environment variables ও API/CORS/rewrites যাচাই করা হয়েছে।

## 8. বর্তমান Jabiyen integration

Jabiyen integration `client_id=jabiyen` এবং callback `https://jabiyen-website.vercel.app/auth/callback` ব্যবহার করে। Updated UI-তে Jabiyen-এ একটি মাত্র “Continue with BINZEO Central Auth” action থাকবে; এটি method parameter ছাড়া এবং `handoff=one-time` সহ `/oauth/authorize`-এ পাঠায়, ফলে method নির্বাচন ও সব verification Central Auth UI-তেই হয়। Jabiyen callback একই-tab PKCE state/verifier যাচাই করে 60-second handoff ticket redeem করে, refresh token browser storage-এ রাখে না। নতুন integration-এ এই legacy client ID পুনর্ব্যবহার না করে registry-ভিত্তিক namespaced client ID নিন।
