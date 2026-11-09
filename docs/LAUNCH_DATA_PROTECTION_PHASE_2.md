# Launch data protection: Phase 2 handoff

Reviewed 9 November 2026 against the website backend in `scripts/google-sheets/website-backend.gs`. This is an implementation and verification record, not proof of changes inside the temple's Google or Vercel accounts.

## Repository work

- The current cutover guide explains how to edit the **existing** Apps Script Web app deployment and publish a **New version** while retaining its `/exec` URL. It warns against replacing version 2 with an older script.
- The guide lists every website-owned tab and the sharing, protected-range, backup, rollback and post-deployment checks. `scripts/google-sheets/README.md` now describes the script lock accurately.
- Website analytics now sends and stores only a pathname. Query strings and fragments can contain names, email addresses or campaign tokens and do not belong in the analytics Sheet. The API applies the same minimization to direct requests.
- The privacy policy identifies Google Sheets and Apps Script as storage for submitted records, push subscriptions and basic analytics. It states which page-view fields are recorded and where to request deletion. With the owner's approval, it now states 24 months for enquiries/event submissions and 12 months for analytics.
- The Apps Script contains a daily retention cleanup function for exactly those five tabs, plus an explicit trigger installer. It does not run until the temple owner publishes the updated script and installs the trigger after reviewing backups and any legal holds.

## Account actions required before sign-off

| Item | Owner action | Evidence to record privately |
| --- | --- | --- |
| 2.1 Sharing | Confirm General access is **Restricted**; remove unnecessary collaborators; give Viewer/Editor only as needed; review Share settings for resharing and download/copy restrictions. | Screenshot of Share dialog with personal addresses redacted. |
| 2.2 Protected data | Protect headers and website-owned columns in all write tabs. Test a website submission and a second account's inability to edit those columns. | Tab protection list and one controlled write result. |
| 2.3 Ownership/backup | Confirm both Sheet and bound script belong to the temple account. Create one restricted backup before cutover and assign a monthly backup owner. | Owner identity and backup date/location in a private register. |
| 2.4 Deployment | Compare the live `/exec` URL to the client Vercel variable, confirm **Execute as Me** and **Anyone** access, check script properties, then archive only retired deployments. Do not expose secret values. | Active deployment/version and controlled form and push tests. |
| 2.5 Privacy | Retention periods are approved in principle: 24 months for enquiries/event submissions and 12 months for analytics. Temple reviews the deletion workflow, any legal holds and the revised public copy; then runs the cleanup once and installs its daily trigger. Obtain Kenyan legal advice on registration and cross-border processing as needed. | Trigger and first-run evidence, privacy approval date and ODPC registration decision. |

The website backend currently writes to **nine** tabs: `Contact Us`, `Guest House Enquiries`, `Kirtan Safari Registrations`, `Kirtan Safari 2027 Interest`, `WebsiteAnalytics`, `PushSubscriptions`, `PushDeliveryLog`, `PushDeliveryReceipts`, and `PushRunClaims`. The launch checklist's `Analytics` name and seven-tab list are incomplete; use the backend's `HEADERS` map as the source of truth. A missing tab is created on first use, but historical rows are not recovered automatically.

The [ODPC registration FAQ](https://www.odpc.go.ke/faqs/) lists faith-based or religious institutions among sectors **not exempt from mandatory registration** based solely on small size or turnover. The temple should verify its legal entity and registration status directly with the ODPC; this repository cannot establish compliance.

## Local verification

| Check | Result |
| --- | --- |
| `npm run lint` | Pass; two pre-existing `no-img-element` warnings |
| `npx tsc --noEmit` | Pass |
| `npx vitest run` | 15 files, 99 tests passed, including analytics minimization and retention tests |
| `npm run build` | Pass; 44 pages/routes built |
| `npm run test:e2e -- --workers=4` | 254 passed, 2 intentional skips on mobile/desktop |

**Release gate:** the public privacy page promises daily deletion after the approved periods. Do not publish that revised copy until the temple-owned Apps Script is updated, the first cleanup has been reviewed, and its daily trigger is active. Do not declare Phase 2 complete until the account-side evidence is recorded and a test from the deployed website lands in the correct restricted Sheet. Do not add test rows to production without an agreed cleanup step.
