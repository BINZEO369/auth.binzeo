# BINZEO Auth

BINZEO authentication and user-account frontend. This is a UI-only Next.js client for the BINZEO Central API.

## Architecture

All authentication, identity, profile, security, database, email, upload and scheduled-job operations are owned by `api.binzeo`. This frontend has no local API backend and must not contain Supabase clients, Supabase keys, service-role keys or provider secrets.

Requests under `/api/*` are rewritten to `${CENTRAL_API_BASE_URL}/v1/*`. If the Central API is unavailable, the frontend fails closed with HTTP 503.

## Frontend stack allowlist

Frontend implementation is limited to TypeScript, React, Next.js, Tailwind CSS, semantic HTML5, CSS3, and Motion for React (`motion`) only. Do not add new plain JavaScript/JSX frontend source, another framework, another CSS/styling system, or another animation library. Motion is an allowed dependency; its presence alone is not a reason to redesign the interface or add animations.

This repository is frontend-only. API, database, and other backend responsibilities remain in `api.binzeo`. Existing Python logo-generation tooling is tooling, not part of the frontend runtime, and does not expand the frontend stack allowlist.

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Required variables are `CENTRAL_API_BASE_URL`, `NEXT_PUBLIC_ADMIN_APP_URL`, and `NEXT_PUBLIC_SITE_URL`.

Do not add Supabase, OAuth, SMTP, ImageKit, cron or service-role secrets to this project. Those belong only in the Central API environment.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Database migrations and server-side database scripts are owned by `api.binzeo`; this frontend repository contains only UI code and the Central API client.
