# Launch layout and functional QA: Phase 3 handoff

Reviewed 9 November 2026 on `chore/launch-functional-qa-phase-3`. This is a local production-build audit, not a production form or device-push sign-off. Nothing in this branch was pushed or deployed.

## Automated coverage

| Checklist item | Evidence | Status |
| --- | --- | --- |
| 3.1 Route and device matrix | All 30 `publicRoutes` at 375, 768, 1280 and 1440 px in both mobile and desktop browser contexts. HTTP 200, no document horizontal overflow, no missing `alt` attribute or broken already-loaded image. The 26 tablet/landscape full-page visual comparisons matched `origin/main`. | Pass for automated checks |
| 3.2 Forms | Contact and guest-house validation, success and failure messages use intercepted API writes. No production row or email was generated. | Local UI pass; backend delivery pending |
| 3.3 Installed app and push | A controlled service worker routed an uncached navigation to the offline page in both Playwright contexts. Real Android/iPhone install, subscribe, notification and unsubscribe were not run. | Offline pass; phone push pending |
| 3.4 Links, images and text | All internal destinations found on the 30 listed pages returned HTTP 200. The image check covered DOM `alt` presence and loaded-image failure; existing visual tests scroll through lazy content. Dates and Sanskrit copy still need temple calendar approval. | Links pass; editorial approval pending |
| 3.5 Accessibility | Axe regression scan passed on all listed pages in mobile and desktop; keyboard activation/Escape/focus restoration passed for phone navigation and noticeboard. Existing baseline contains 102 color-contrast nodes across the two projects, plus two link-in-text-block and two scrollable-region-focusable nodes. No real screen-reader pass was done. | No new regression; existing issues and screen reader pending |
| 3.6 Error and offline | Unknown route returns HTTP 404 with branded recovery links. Offline fallback is reachable through the service worker. Contact and guest-house submission failures show a message while retaining entered data. | Pass for tested flows |

The hidden `/guest-house` route was smoke-tested without redesign. `/shop` and Ratha Yatra remain unpublished, as intended.

## Verification run

- `npm run lint`: pass, with the two existing `no-img-element` warnings in `Footer.tsx` and `BrandLogo.tsx`.
- `npx tsc --noEmit`: pass.
- `npx vitest run`: 15 files, 99 tests passed.
- `npm run test:e2e`: 500 passed, 2 intentional skips. The focused keyboard test added afterward also passed.
- `npm run test:visual:compare -- --project=tablet --project=landscape`: all 26 candidate screenshots matched the clean `origin/main` captures. The first run exited nonzero only during Windows temporary-worktree cleanup because of a long path; the comparator now reports that cleanup problem separately. A temporary folder may remain under the Windows temp directory.
- `npm run build`: completed successfully for the baseline and candidate as part of visual comparison.

## Before Phase 3 approval

1. On a Vercel preview with the temple-owned Apps Script connection, submit one controlled test per live form/subject. Confirm the correct restricted Sheet tab and recipient email, then remove the test records.
2. On a real Android phone and iPhone, install the app, enable reminders, receive one test push, turn reminders off and confirm the Sheet subscription state. Test Safari and Samsung Internet layout and Android back behavior.
3. Have the temple compare displayed dates/times and festival spelling to its 2026 and 2027 calendars. Review the recorded contrast and link-focus accessibility debt, then perform a VoiceOver or NVDA pass.
4. Review final desktop, tablet, landscape and phone screenshots with a human eye for face crops, overlap and touch-target comfort. Automated image loading and pixel parity do not prove those qualities.

**Cloudflare:** The site is served by Vercel. The old `iskcon-nairobi` Cloudflare Worker in the developer's personal account was deleted and its absence verified. Cloudflare DNS/proxy, if enabled, and the browser service worker in `public/sw.js` are separate and unaffected.
