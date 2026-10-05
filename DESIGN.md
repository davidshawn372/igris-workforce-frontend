# Design direction

Based on the supplied IGRIS Workforce screenshots, the actual black IGRIS brand mark, and Anthropic's frontend-design skill (https://github.com/anthropics/skills/tree/main/skills/frontend-design).

Purpose: help HR give people a clear, thoughtful beginning, with a focused employee learning experience. Separate managerial density from learner calm.

Palette: ink #24222a; paper #ffffff; canvas #f8f9fb; action violet #6543cf; success #27816a; attention #9c681b. Purple connects to the user's existing screenshots; it is used for selected state and actions, not arbitrary decoration.

Type: Manrope for compact, friendly headings; Inter for functional UI. Local font assets. Reading content uses a comfortable 65–75-character measure and 1.8 line height. Data tables use fewer, larger labels than the reference screens.

Layouts: the company workspace has persistent left navigation, a practical summary and a people table. The learner portal uses a quiet top navigation and a single prominent next step beside a numbered learning timeline. Cards organize real groups, not every line of content. Learning steps are numbered because they have a meaningful sequence.

Critique applied: removed decorative headline accent, unnecessary all-caps eyebrows, most small pills, unsupported AI confidence scores and compliance claims. Kept white/purple from the references, but moved the employee hero to a black brand-led treatment. Enlarged tiny table labels and replaced technical AI language with task-focused copy.

Interactions: native keyboard-accessible dialogs, explicit labels, real local-state updates, visible focus, minimum comfortable touch controls, reduced-motion support. The employee's checklist and quiz feed the same progress data used by the company view.

Scope: a frontend demo, not production HR software. All company identities and policy examples are fictional. No real email, AI, login, payment or document-indexing service is enabled.

## Research-led refinement, 4 October 2026

References: Linear's March 2026 interface refresh (https://linear.app/now/behind-the-latest-design-refresh), its customer directory (https://linear.app/customers), and Notion's product/customer pages (https://www.notion.com/product and https://www.notion.com/customers).

These provide product and adoption evidence, not proof that appearance caused sales. Applied principles: subordinate navigation to the task, use restrained icon/color treatment, soften separators, give actions predictable locations, and preserve readable content density. Removed the dashboard's large promotional hero in favor of a working onboarding brief. Kept dark brand navigation, white working surfaces, neutral cards, and small semantic status accents. Settings uses a focused company identity form with secondary demo controls.


## Public homepage
The public route `/` now follows the user-selected COMPUTE landing-page reference (https://v0-compute-11.vercel.app/): black canvas, floating navigation, oversized typography, cinematic botanical hero and fine grid lines. The existing company app is at `/workspace` and employee portal at `/learn`. Copy and metrics describe IGRIS demo functionality rather than the reference product. Hero video and fallback tree are externally hosted reference-template assets; their URLs are isolated in Landing.tsx for replacement with licensed brand assets before commercial publication. No template source code was imported.
