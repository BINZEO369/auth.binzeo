# Home page redesign plan

## Direction

- **Design movement:** Liquid glass / neo-futurist identity interface.
- **Core principles:** translucent depth, calm high-contrast typography, tactile motion, and technology shown as a living system rather than a static illustration.
- **Color philosophy:** retain BINZEO's black-and-white foundation, then introduce restrained electric cyan, violet and ice-blue refractions to signal secure digital infrastructure without becoming neon-heavy.
- **Layout paradigm:** image-led full-bleed chapters with a floating glass interface layer; the hero uses an asymmetrical content-and-orb composition rather than a centered marketing grid.
- **Signature elements:** a refractive 3D identity orb, thin orbital rings/nodes, and frosted glass cards with a light-sweep edge.
- **Interaction philosophy:** hover raises the glass surface and reveals light; motion is slow and ambient, never distracting from the CTA.
- **Animation:** low-frequency floating, orbital rotation and shimmer; respect reduced-motion preferences.
- **Typography:** existing Inter system retained for product clarity, with oversized tight hero display hierarchy and compact mono labels for system metadata.
- **Brand essence:** a calm, trusted digital identity layer for people who want control across the internet. Personality: calm, precise, quietly advanced.
- **Brand voice:** direct and reassuring. Examples: “Your identity, with less noise.” and “One ID. More control.”
- **Wordmark/mark:** BINZEO wordmark stays text-led; the orbital BZ node system becomes the new supporting visual mark.
- **Signature brand color:** refractive ice-cyan (#9cf6ff), used sparingly against black glass.

## Implementation

- Keep the existing authentication-aware CTA and long-form content sections.
- Replace the hero's static visual treatment with layered liquid gradients and a CSS-only 3D technology orb, so no external asset or runtime dependency is required.
- Add reusable liquid-glass and 3D animation classes in `src/app/globals.css`.
- Add reduced-motion fallbacks and preserve responsive layout/accessibility semantics.
- Validate with ESLint and the existing production build, then push to GitHub/Vercel.

## Project structure

- `src/app/page.tsx`: Home page composition and hero visual markup.
- `src/app/globals.css`: reusable liquid-glass surfaces, 3D orb geometry, motion and responsive safeguards.
- `public/manus-routes.json`: route manifest remains synchronized with the existing route set.
