# Mobile layout repair — 6 October 2026

User evidence: phone screenshot of overflowing homepage navigation and 23-second recording of the workspace shifting sideways. Source matches the IGRIS Workforce landing page and workspace in this checkout.

## Changes

- Responsive, labelled Menu disclosure replaces the overflowing single-row navigation at widths up to 1100px. Links close it; Escape from the menu closes it and restores focus. Workspace remains reachable on mobile.
- Keep the existing dark IGRIS visual identity. Full-width onboarding action, wrapped headlines and readable body copy on phones.
- Allow grid children to shrink, contain wide tables within their own horizontal scroll area, wrap header actions, and enlarge touch controls.
- Input text is at least 16px on small screens; modal height uses the dynamic viewport.
- Changes: src/Landing.tsx, src/main.tsx, src/responsive.css. Existing unrelated working-copy changes were preserved.

## Browser verification

Local preview on port 5186. Measured CSS viewport widths rather than assuming browser override pixels were CSS pixels (Windows scaling applies).

- At 320px: homepage, workspace, people, hiring, onboarding, knowledge, billing, settings, employee home, journey and assistant had document scrollWidth equal to clientWidth.
- At 375px, 768px and 1440px: homepage, workspace and employee journey checked. Fixed an additional 4px tablet header overflow; final 768px workspace has scrollWidth equal to clientWidth.
- Mobile menu opens, Workspace link navigates, How it works reaches #process and closes the menu.
- Assistant sample-question button returns its scripted answer and source link.
- No captured browser console errors during the sweep.
- Screenshot outside the deliverable: ../../mobile-menu-fixed.jpg.

This is responsive browser verification, not a physical iOS/Android device test or an exhaustive interaction/security audit. Wide data tables intentionally scroll within their panels. No private recordings are bundled.

## Publishing

The user identified https://igris-workforce-frontend.vercel.app/. Its Vercel project is connected to davidshawn372/igris-workforce-frontend, production branch main (confirmed in the dashboard). Publish only to this existing destination, not the unused Sites registration.

## 7 October follow-up

- Replaced the ambiguous workspace icon with a 48px-high purple Menu button and a labelled Close menu control. Removed the decorative desktop arrow that looked interactive.
- Added Escape dismissal and focus restoration, hid closed mobile navigation from keyboard access, and restored header breathing room where the theme overrode mobile padding.
- Added vercel.json SPA rewrites for direct route opening and refresh.
- Verified the latest code after restarting the server: at 375px, Menu opens and moves focus to Close menu; Escape closes and restores focus to the trigger. The closed sidebar is removed from the accessibility tree. Header padding is 12px. Document clientWidth and scrollWidth both measured 356px (scrollbar consumes remaining viewport width).
- Invite dialog opens at phone width; no employee was added. Physical-device testing remains pending.
- Build and git diff --check passed. Commit cca8bc5 was pushed normally to origin/main.
- Vercel deployment 2S2yD8QFJh6Ta7a9JXFNxLvZhetj was blocked because the configured Git author email could not be matched to GitHub. Manual redeploy is also blocked. GitHub is signed out; awaiting user sign-in to verify the correct email. No identity was guessed, no permissions changed, and no plan upgrade purchased.
- Public /workspace still returned NOT_FOUND on the old deployment. Do not report the responsive fix as live until deployment succeeds.

## Deployment resolved

- Verified the signed-in GitHub account's provided noreply identity; configured it for this repository only. No account security settings changed.
- Pushed deployment-trigger commit 7004c71 to both personal and IGRIS-Technologies main branches; both remote hashes verified equal.
- Vercel production deployment GD8UtRZUjEYMoaMLVPP65oi7tSkP is Ready at commit 7004c71.
- https://igris-workforce-frontend.vercel.app/workspace returns HTTP 200 and renders the updated application. The public Menu opens and closes at a 300px CSS viewport; clientWidth and scrollWidth both equal 285px. Physical phone verification remains pending.
- Vercel remains connected to the personal repository. The organisation copy is synchronized but is not the deployment source.
