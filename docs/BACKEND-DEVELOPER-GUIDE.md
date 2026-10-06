# IGRIS Workforce — Backend Developer Guide

## Product and current boundary
IGRIS Workforce turns company onboarding material into interactive learning journeys. It has a company workspace for people teams and an employee portal for new hires. This repository is a functional frontend demonstration, not a production HR system. Data is fictional and stored in the current browser. No real authentication, payments, email delivery, document parsing, or AI model is connected.

## Technology
- TypeScript and TSX for application logic and React 19 components.
- CSS and HTML for layout, dark/light themes and the landing page.
- Vite 7 for development and production builds; React Router 7 for routes.
- Lucide icons; bundled Inter and Manrope fonts.
- React context and localStorage for demo persistence. No database or server language selected yet.

Run `npm ci`, `npm run dev`, and `npm run build` with Node 22+. Configure SPA hosting to return index.html for application routes.

## Feature map
- `/`: public landing page and links into both experiences.
- `/workspace`: progress summary, team filters and recent activity.
- `/people`: search, invitation demo, employee details and assignments.
- `/hiring`: jobs, candidate pipeline, job editor and candidate details.
- `/onboarding`: journey library, create/duplicate journeys, module editing, ordering and publication.
- `/knowledge`: searchable sample documents, metadata-only upload demo and assistant entry.
- `/learn`: assigned learning path; lessons, checklist steps, quizzes, scenarios, resources and profile.
- `/learn/assistant`: scripted document matching, not generative AI.
- `/insights`: Pro department completion and journey-stage analytics; CSV progress export.
- `/billing`: Free/Pro comparison and a no-payment Pro demo switch.
- `/settings`: editable workspace configuration and demo reset.

## Paid plan decision
Pro is proposed at USD $7.99 per workspace per month, not per employee. Paid features are department comparison, journey-stage analytics and downloadable progress reports. Basic employee progress, learning and onboarding remain free. Existing basic people-list export stays free; the Pro export contains learning-completion details.

`src/billing.tsx` uses a session-only React context to demonstrate entitlement. Anyone can bypass frontend-only restrictions: this is intentional demo code, not billing security. Refresh resets Pro to Free. Demo activation never creates a subscription or collects a card.

## Integration points
`src/types.ts` defines the domain contracts. `src/store.tsx` is the demo repository boundary. Replace its persistence with authenticated API calls and explicit loading/error states. Keep the existing UI models separate from database models. `data.company` must be loaded from the organization record, not hardcoded. Preserve tenant isolation on all reads and writes.

Suggested entities: organizations, users, memberships, employees, jobs, candidates, flows, modules, assignments, completions, documents, audit events and subscriptions. Record module revisions so editing a published lesson does not silently invalidate historic completion.

Suggested APIs: GET /me/workspace; CRUD /employees, /flows, /modules, /jobs and /documents; POST /assignments and /completions; GET /reports/progress; POST /billing/checkout and /billing/portal; POST /billing/webhook. These are proposals, not existing endpoints.

## Production billing
Use hosted checkout. Store provider price IDs and secrets on the server. Validate signed webhooks, deduplicate event IDs, map customers to organizations and derive entitlements server-side. Handle cancellation, past-due status, refunds and subscription changes. Enforce the reporting entitlement on report APIs as well as in navigation. Do not unlock based on a redirect query parameter. Show the actual billing interval, taxes, renewal and cancellation terms before purchase.

## Production requirements
Implement sessions, membership roles, authorization, request validation, upload size/type restrictions, malware scanning, secure document storage, tenant-scoped retrieval and audit logs. Never expose API secrets in VITE variables. Use document citations and honest fallback responses if AI is added. Do not automate hiring decisions from demo match scores. Protect exports against spreadsheet formulas. Add meaningful API and end-to-end tests before handling real employee data.

## Handoff
See BACKEND_HANDOFF.md and DESIGN.md. The external blossom-tree media is a reference asset: replace it with licensed brand media before commercial publication. The product is not yet publicly deployed, security-certified or connected to a production backend.
