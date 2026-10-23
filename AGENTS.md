<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Frontend stack allowlist

- Frontend implementation is limited to TypeScript, React, Next.js, Tailwind CSS, semantic HTML5, CSS3, and Motion for React (`motion`) only.
- Do not add new plain JavaScript/JSX frontend source, an alternate framework, another CSS/styling system, or another animation library.
- Installing Motion does not authorize a redesign or require implementing animations; preserve existing app behavior.
- This repository is frontend-only. API, database, and other backend responsibilities remain in `api.binzeo`.
- Existing Python logo-generation tooling is tooling, not part of the frontend runtime, and does not expand the frontend stack allowlist.
