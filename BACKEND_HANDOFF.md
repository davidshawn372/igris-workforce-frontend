# Backend handoff

## Current boundary

This application is a frontend interaction prototype. The company and employee views intentionally share a browser-local fictional workspace. They are not authenticated roles. Do not put real employee information in the demo. Local storage is not an access-control or secure-storage mechanism.

`WorkforceRepository` in `src/types.ts` describes the demo persistence interface. `demoRepository` in `src/store.tsx` implements synchronous local storage. Production integration should replace whole-workspace persistence with asynchronous, resource-specific service calls and explicit loading/error/retry states. Never expose all company data to an employee client.

## Suggested API mapping

| Frontend behavior | Proposed service operation |
|---|---|
| List/create job drafts | GET/POST /v1/jobs |
| Candidate pipeline and notes | GET/PATCH /v1/applications/:id |
| Confirm hire | POST /v1/applications/:id/hire |
| Journey library and editor | GET/POST/PATCH /v1/onboarding/flows |
| Assign employee journey | POST /v1/onboarding/assignments |
| Complete milestone | POST /v1/onboarding/progress |
| Document upload and processing | POST /v1/knowledge/documents |
| Ask assistant | POST /v1/ai/sessions/:id/messages |
| Manager overview | GET /v1/analytics/overview |

Agree final paths and payloads with the backend developer; these are integration proposals, not working endpoints. Use the shared TypeScript entities as a starting point. Add stable tenant, assignment, revision, and authenticated user identifiers on the server.

## Behavior requiring backend implementation

- Authentication, tenant isolation, role authorization, invitation delivery, sessions and sign-out.
- Immutable journey versions for existing assignments; server-side progress validation and idempotency.
- Real per-module lesson bodies, quiz questions, scenario definitions, checklist items, and grading. Current fixtures reuse sample content by module kind.
- Atomic candidate-to-employee conversion, duplicate protection and audit events. All hiring decisions remain human actions.
- Upload storage, content validation, malware scanning, parsing, document permissions and deletion. The demo records filenames only.
- Retrieval-backed AI with permitted sources, citations, unknown-answer fallback and escalation. The current assistant is explicit keyword matching, not an AI model.
- Email, messaging, calendar, analytics, and integration actions. No messages are sent by this frontend.

## Security integration

Keep AI keys, database credentials and email credentials on the server. Browser environment variables are public. Prefer secure HttpOnly session cookies with appropriate CSRF protection, authorization on every endpoint, upload size/type validation on the server, rate limits, audit logs and output encoding. Never trust client completion flags, role switches, tenant identifiers or file extensions as proof of authorization.

The frontend renders text through React and does not inject document HTML. If rich text is introduced, sanitize it with an approved renderer and restricted URL policy. CSV exports should neutralize spreadsheet formula prefixes before real user-entered data is exported.

## Acceptance checks before production

Verify desktop and phone layouts in real browsers; keyboard navigation and dialog focus; invite validation; hiring transition; journey reassignment; module reordering; checklist and quiz gating; persistence/reset; empty and error states; employee data isolation; and server rejection of unauthorized or forged progress updates.

## Company-name integration example

Store an Organization record with id, displayName, logoUrl and the authenticated user's membership role. Resolve the active organization from the server-side session. GET /v1/organization can return its public display fields; PATCH /v1/organization should accept an authorized administrator's changes. These paths are proposed, not implemented.

The frontend field currently called data.company is the single display-name value used by the workspace switcher and employee shell. Replace its local update in SettingsPage with the organization service's save operation, then update the shared store from the validated response. On app startup, load the current organization's name before displaying its workspace. Validate and trim the name on the server. Do not grant access based on an organization ID supplied by the browser.

IGRIS Workforce remains the product brand. IGRIS Technologies is only this demo organization's display name; a future customer's own name appears in the same place.
