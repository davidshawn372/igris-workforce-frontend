# Demo plan limits — 7 October 2026

Business added at $39 USD/workspace/month for up to 150 employees. It inherits Team's 20 published journeys and 5 planned manager seats; no additional unbuilt features are promised. Enterprise is contact-based custom pricing above 150 employees, with individually agreed scope and quotas. Enterprise is not selectable as an unlimited demo entitlement. User-confirmed contact: igristechnologies09@gmail.com. The mailto link prefills a subject and company/capacity questions, and the page explains that the user must send the email. No automatic submission or email delivery is claimed.

Free: $0, 5 employees, 1 published journey. Starter: $7.99 USD per workspace/month, 15 employees, 5 published journeys. Team: $16 USD per workspace/month, 50 employees, 20 published journeys. Team's 20-journey allowance is a concrete initial interpretation of the proposed larger capacity, not an unlimited offer.

Employee invitations and candidate-to-employee hiring both check capacity before creating records. Journey publication checks live journey count; moving a journey back to draft is always allowed. Existing records, seeded examples, assignments and progress are retained on downgrade and when over quota. Draft creation remains available. Demo plan selection resets to Free on reload.

Manager allowances (Free/Starter 1, Team 5) are explicitly planned only: this app has no manager-membership/invitation backend. No claim of manager-seat enforcement is made.

These are client-side demo checks, not subscription security. Production must enforce quotas transactionally for every creation/publication API using authenticated workspace membership and server-side billing entitlements. Count all employee creation routes and manager invitations; do not trust browser plan selection. Preserve existing records after downgrade.

Verification: `node --test tests/plans.test.mjs` tests quota boundaries and source integration; `npm run build` checks TypeScript and production bundling. Browser/physical-device verification and deployment are separate, not implied by these checks.
