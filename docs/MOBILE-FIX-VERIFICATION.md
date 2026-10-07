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
- The previous mobile Menu open/close interaction was verified at 375px. Final keyboard additions require verification after the local server restart; do not treat the earlier loaded page as the latest code.
- Deployment verification is pending until the new production commit is Ready and the public routes are checked.
