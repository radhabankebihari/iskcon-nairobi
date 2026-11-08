# ISKCON Nairobi Website

Production Next.js website for ISKCON Nairobi / Sri Sri Radha Bankebihari Temple.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Client-owned Google Apps Script bridge for forms, analytics, and notification subscriptions
- Web Push / PWA support
- Vercel deployment

## Local Development

```bash
npm ci
npm run dev
npm run build
npm run verify:pwa
```

The local dev server runs at `http://localhost:3000`.

## Handoff Documentation

- `PROJECT_GUIDELINES.md` is the contributor entry point.
- `docs/REPOSITORY_MAP.md` explains where routes, content, forms, integrations, assets, and tests live.
- `docs/RELEASE_WORKFLOW.md` defines the development, staging, release, and production gates; verify branch tips before using them.
- `docs/DESIGN_SYSTEM.md` records the visual language, spacing rhythm, page hero rules, and mobile-first layout decisions.
- `docs/CONTENT_GUIDE.md` explains where to add pages, festivals, notices, blog posts, images, and sheet-backed forms.
- `docs/ASSET_SOURCES.md` records non-temple library assets that should be reviewed or replaced when final photography is available.
- `docs/PWA_GUIDE.md` records offline caching, update behavior, Android icon rules, notification links, and the mobile verification checklist.
- `docs/TEMPLE_SHEET_CUTOVER.md` records how to move live form storage and email alerts to the temple-owned Google Sheet.

## Environment Variables

Never commit real secrets to the repository. Keep local values in `.env.local` and production values in the Vercel dashboard.

Required server-side variables:

```env
GOOGLE_APPS_SCRIPT_URL=
GOOGLE_APPS_SCRIPT_SECRET=
PUSH_SUBSCRIBER_COUNT_TOKEN=
CRON_SECRET=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=
```

Optional variable:

```env
ANALYTICS_DISABLED=
```

All sheet-backed data lives in tabs of the client-owned spreadsheet. The server signs each request to its Apps Script Web app with `GOOGLE_APPS_SCRIPT_SECRET`; never expose this secret or the deployment URL in browser code. See `docs/TEMPLE_SHEET_CUTOVER.md` for deployment and migration.

Calendar reminders are sent by the protected Vercel Cron route at 07:00 Africa/Nairobi time. Set `CRON_SECRET` in Vercel; Vercel sends it to `/api/cron/calendar-reminders` as a bearer token. The route sends only to subscriptions with calendar reminders enabled and records completed event deliveries in the `PushDeliveryLog` tab to prevent duplicate broadcasts. Browser timers must not be used for scheduled reminders because mobile operating systems suspend closed apps.

Page-open and app-install analytics are stored in the `WebsiteAnalytics` tab. Local development does not write analytics.

Public client variable:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
```

Only values prefixed with `NEXT_PUBLIC_` are exposed to browser code. Do not place private API keys, service account keys, tokens, or passwords in any `NEXT_PUBLIC_` variable.

## Security Notes

- `.env*`, `.vercel`, PEM files, logs, and generated build output are ignored by git.
- Public API routes reject cross-origin JSON requests, enforce request size limits, apply rate limiting, and validate input server-side.
- Apps Script sheet writes escape formula-leading characters.
- Production responses return generic errors to users while detailed errors stay in server logs.
- The Apps Script project and spreadsheet should be owned by the temple account. The shared secret stays in Apps Script properties and server environment variables.

## Push Notifications

Broadcasts are sent from the local script:

```bash
npm run send-push -- --dry-run --title "Preview" --body "Message"
npm run send-push -- --confirm --title "Notice" --body "Message" --url /festivals
```

The script refuses to send a live broadcast unless `--confirm` is supplied.

## Deployment

The site is deployed on Vercel from the GitHub repository. Production canonical URLs use:

```text
https://iskconnairobi.com
```

After changing SEO routes, robots, sitemap, metadata, or API behavior, run:

```bash
npm run build
```

Do not push a feature branch directly to production. Follow the review and
promotion gates in `docs/RELEASE_WORKFLOW.md`; `main` is the production branch.

## Operational Checklist

- Keep Vercel environment variables current.
- Rotate any key that is accidentally pasted into git, chat, logs, screenshots, or public tools.
- Keep the temple Google Sheet private and share it only with trusted administrators. The website writes to it through the signed Apps Script Web app, not a shared account.
- Review `npm audit` before major releases.
- Prefer a durable rate limiter such as Redis or Vercel KV if spam volume increases.
