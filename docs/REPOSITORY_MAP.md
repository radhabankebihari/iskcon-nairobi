# Repository map

Start with `README.md` for setup, `PROJECT_GUIDELINES.md` for editing rules,
`docs/CONTENT_GUIDE.md` for content changes, and `docs/RELEASE_WORKFLOW.md`
before merging. These are the main ownership boundaries:

| Location | Responsibility |
| --- | --- |
| `src/app/` | Public routes, page metadata, shared layout, error pages, sitemap, robots, and manifest. A folder with `page.tsx` is a URL. |
| `src/app/api/` | Server-only HTTP routes. Client forms and notification preferences call these routes, never Google directly. |
| `src/components/layout/` | Main navigation, footer, noticeboard control, and temple status bar. |
| `src/components/sections/` | Homepage and other reusable page sections, including visible forms. |
| `src/components/festivals/`, `src/components/blog/`, `src/components/hktc/`, `src/components/donate/` | Page-family components. |
| `src/components/system/`, `src/hooks/` | Analytics, PWA registration, notification managers, install prompt, and client state. |
| `src/components/ui/` | Small shared presentation and interaction controls. |
| `src/data/` | Editorial content: temple facts, notices, blog cards, festival details, and the 2026/2027 calendar. |
| `src/lib/` | Validation, API security, Apps Script signing, date/status calculations, SEO helpers, and push delivery logic. Unit tests sit beside these modules. |
| `public/images/` | Public photography and artwork, grouped by subject. Paths here are visitor-facing URLs. |
| `public/brand/`, `src/app/icon.png`, `src/app/apple-icon.png` | Logos, PWA icons, and social previews. Check the manifest and metadata before changing them. |
| `public/sw.js`, `public/app-version.json` | Offline cache and installed-app update behavior. Coordinate changes with `docs/APP_VERSIONS.md` and `docs/PWA_GUIDE.md`. |
| `scripts/google-sheets/website-backend.gs` | Temple-owned Apps Script Web app, deployed separately from the Next.js site. |
| `scripts/`, `vercel.json` | Local maintenance commands and the protected daily calendar-reminder schedule. |
| `tests/e2e/` | Browser, accessibility, and visual tests. See `playwright.config.ts` for viewport projects. |
| `docs/` | Design, content, operations, source records, and release history. |

## How a submission reaches the Sheet

1. A browser form calls a same-origin route under `src/app/api/`.
2. The route validates the request and calls `src/lib/appsScriptBridge.ts`.
3. The bridge signs the request with server-only environment variables.
4. `scripts/google-sheets/website-backend.gs` verifies the signature and writes
   to the appropriate tab in the temple-owned spreadsheet.

`ContactForm` and `GuestHouseEnquiryForm` both use `/api/contact`, but the
`formType` selects the `Contact Us` or `Guest House Enquiries` tab. Kirtan Safari
registration and future-interest forms use separate routes and tabs. The Gita
course endpoint is closed and returns 410. `AnalyticsTracker` writes to
`WebsiteAnalytics`; push subscribe/unsubscribe routes manage `PushSubscriptions`.
The protected Vercel cron in `vercel.json` calls
`/api/cron/calendar-reminders` daily, and delivery records prevent duplicates.
Never submit a live form merely to test a local page change.

## Finding the source of a visible item

- Temple identity, contacts, hours, giving details, navigation, shared cards:
  `src/data/site.ts`.
- Noticeboard entries and expiry: `src/data/notices.ts`.
- Calendar entries: `src/data/vaishnavaCalendar2026.ts` and
  `src/data/vaishnavaCalendar2027.ts`; shared descriptions and aggregation are
  in neighboring data files. Confirm dates against the printed temple calendar.
- Kirtan Safari schedule and guest data: `src/data/kirtanSafari.ts`; lifecycle
  decisions: `src/lib/kirtanSafariState.ts`.
- One page's copy or arrangement: its `src/app/**/page.tsx` and associated
  section components. Preserve the layout rules in `docs/DESIGN_SYSTEM.md`.

## Working safely

Run `git fetch origin`, `git worktree list`, and `git status --short --branch`
before choosing a worktree. A branch name alone does not prove that it contains
the current production commit or that its changes are approved. Keep unrelated
uncommitted work in other worktrees untouched. Use `.env.example` for variable
names; keep real values in `.env.local` or the hosting dashboard.

For code changes, run `npm run lint`, `npx tsc --noEmit`, `npx vitest run`,
`npm run verify:pwa`, `npm run build`, and the relevant Playwright tests. The
full visual suite requires local reference screenshots; its generated images
are intentionally ignored by git. Follow `docs/RELEASE_WORKFLOW.md` and obtain
approval before any production promotion.
