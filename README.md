# IGRIS Workforce

Frontend demo with connected company and employee experiences. React, TypeScript, Vite, React Router, and Lucide icons. Fonts are bundled locally. No backend or live AI is connected.

## Run

Use Node.js 22 or newer. Run `npm ci`, then `npm run dev`. Run `npm run build` for a checked production bundle in `dist`. Configure static hosting to rewrite application routes to `index.html`.

## Main journeys

- Company workspace: overview, people, hiring pipeline, job drafts, onboarding library and module editor, knowledge library, insights, settings.
- Employee portal: `/learn`, journey milestones, checklist completion, quiz and scenario feedback, sample document assistant, resources, editable profile.
- Completing Maya's learning milestones updates the company progress tables. Workspace settings can reset all demo data.

## Source map

- `src/App.tsx`: routing and navigation shells.
- `src/company.tsx`: people and manager views.
- `src/onboarding.tsx`: journey builder and knowledge library.
- `src/hiring.tsx`: recruitment and candidate-to-employee transition.
- `src/learner.tsx`: employee learning experience.
- `src/store.tsx`: React state and local demo persistence.
- `src/types.ts` and `src/data.ts`: shared contracts and fictional fixtures.
- `src/ui.tsx`: reusable accessible controls.
- `src/styles.css` and `src/product.css`: foundation and responsive product styling.

## Verification

TypeScript compilation and Vite production build passed. Dependency audit reported zero known vulnerabilities at the time of installation. The local preview and principal workspace screens have been checked in the browser; a complete automated end-to-end suite is not included. A passing build is not a production-security guarantee.

The geometric logo was reconstructed from the supplied screenshot. Replace `public/igris-logo.png` with the original brand asset when available. No private WhatsApp screenshot or account credentials are included.

See BACKEND_HANDOFF.md for integration boundaries and production requirements.

Generated stock-style photography has been removed from the interface. The redesigned journey library includes curriculum previews and responsive compact navigation.

## Appearance and routes

The public landing page is at /, the company dashboard at /workspace, and the employee portal at /learn. Dark mode is the default; the header toggle stores an optional light preference locally. src/workspace-theme.css owns the current application theme; src/landing.css styles the homepage. See DESIGN.md for external hero asset provenance.

