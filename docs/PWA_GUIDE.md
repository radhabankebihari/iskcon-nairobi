# Progressive Web App Guide

This is the maintenance contract for ISKCON Nairobi's installable web app. Preserve these rules when adding pages, assets, forms, notices, or notifications.

## User Experience

- The installed app uses the same responsive site and routes.
- Portrait, landscape, and tablet rotation are supported. Do not restore an `orientation` lock in `src/app/manifest.ts`.
- Essential shell assets are saved on the first successful visit. Public pages are saved selectively as visitors open them.
- A saved page is used offline when available; otherwise `/offline` explains the connection state.
- A compact notice appears for offline, data-saver, 2G, or slow-2G conditions. Keep it small and non-blocking.
- A new worker activates silently. The app reloads once when it is safe, deferring while a visitor is typing so form input is not lost.
- Online navigations remain network-first. Saved pages are fallbacks for failed or timed-out requests, not the default online response.
- Routine releases update silently. Releases marked `prompt` in both `public/app-version.json` and `public/sw.js` show a version panel and wait for the visitor to choose **Update now**. Follow `docs/APP_VERSIONS.md` for every release.

## Cache Policy

`public/sw.js` owns caching. Bump `CACHE_VERSION` whenever its policy or precache list changes.

| Request | Strategy | Reason |
| --- | --- | --- |
| Page navigation | Network first, 5-second timeout, saved page, offline fallback | Prefer current temple information while surviving weak connections |
| Next.js JavaScript, CSS, and fonts | Cache first | These files are content-hashed |
| Same-origin images | Stale while revalidate | Fast repeat visits with background refresh |
| `/api/*`, POST, ranged media, cross-origin requests | Network only | Prevent stale data, duplicate form writes, and personal-data storage |

Never cache forms, analytics, subscriptions, payment flows, or admin responses. Offline form submission is intentionally not queued because silent retries can duplicate registrations or retain personal information on a shared device.

## Android Icons And Splash

- `icon-192.png` and `icon-512.png` are ordinary full-logo icons.
- `maskable-icon-192.png` and `maskable-icon-512.png` keep the full mark inside Android's central safe zone on opaque cream.
- Android generates its splash from the manifest's `background_color`, `theme_color`, name, and 512px icon. Keep these aligned with the brand palette.
- Inspect replacements in circular, squircle, rounded-square, and square crops. The lotus and ISKCON wordmark must remain clear.
- Keep icon URLs versioned in the manifest and root layout so installed devices refresh changed artwork.

## Navigation And Deep Links

- Use Next.js `Link` internally so Android Back preserves route history.
- External links intended to leave the app use `target="_blank"` and `rel="noopener noreferrer"`.
- Push URLs must be same-origin paths such as `/festivals`; the worker rejects external notification URLs.
- Notification clicks focus an exact open route, then reuse an app window, then open a new window. Preserve that order.

## Push Reminders: One Device, One Notification

Calendar reminders are sent by the Vercel cron `/api/cron/calendar-reminders` at 07:00 Nairobi time. The design guarantees each device receives each reminder once.

**Device identity.** Every browser keeps a random v4 device ID in IndexedDB (`iskcon-push` database, `kv` store), shared by the page (`src/lib/pushDeviceStore.ts`) and the worker (`public/sw.js`). It is sent with every subscription and stored in column H of `PushSubscriptions`. The store keeps one row per device: a new endpoint for a known device replaces its row, and stray rows for the same device are merged away (`planPushUpsert` in `src/lib/pushDevices.ts`).

**Renewal.** When the browser renews a subscription, the worker's `pushsubscriptionchange` handler registers the new endpoint with the device ID, the endpoint it replaces, and the saved reminder choices. If the browser renews without telling the worker (common in Chrome), the next page view notices the changed endpoint and does the same. Either way reminders stay on and no second row is created.

**Sync throttling.** The page only calls `/api/subscribe` when the endpoint or choices changed, or once a week (`needsPushSync` in `src/lib/pushSyncPolicy.ts`). Calls from several components on one page run one after another, so a page view costs no request at all once a device is synced.

**Sending.** For each reminder, the cron:
1. Skips the event if `PushDeliveryLog` says it reached every device.
2. Claims the event in `PushRunClaims`. If two runs overlap, the first claim wins and the other stops. A claim older than 10 minutes is ignored, so a crashed run cannot block a retry.
3. Sends one message per device (`selectRecipients`), skipping devices with a receipt in `PushDeliveryReceipts`. Receipts are written in batches of 25 and on exit, so a rerun after a partial failure reaches only the devices that missed it.
4. Sends every copy with the same Web Push `Topic`, so a push service holding an undelivered copy for an offline phone replaces it rather than queueing two.

**On the device.** The worker remembers which reminder IDs it has shown for 30 days. A repeat replaces the existing notification silently (same tag, `silent: true`). It still shows a notification, because Safari can revoke push permission from sites that receive pushes without showing one.

Run the cron by hand with `curl -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/cron/calendar-reminders`; repeating it is safe.

## Release Checklist

1. Run `npm run verify:pwa` and `npm run build`.
2. Install production on Android and inspect circular and rounded launcher modes.
3. Launch from the icon and confirm the cream splash does not crop the logo.
4. Open public pages online, enable airplane mode, and test saved and unsaved routes.
5. Emulate slow 2G and confirm the compact notice does not move page content.
6. Navigate Home -> internal page -> Android Back and confirm history works.
7. Open an external social link and confirm it leaves safely in a new browser context.
8. Test a nested notification link while the app is closed, backgrounded, and foregrounded.
9. Deploy a prompted worker version bump and confirm an older installed app offers **Later** and **Update now**.
10. Rotate phone and tablet; check navigation, modals, carousels, and forms for overlap.

## Future Editor Notes

- Keep `/offline` lightweight and based on local assets.
- Do not precache galleries, videos, hero collections, or every route. Cache limits prevent unbounded storage.
- Preserve `must-revalidate` headers for `/sw.js` and the manifest in `next.config.ts`.
- The worker is hand-maintained so privacy boundaries remain reviewable. Do not add a generated PWA plugin without re-auditing API exclusions, updates, and push handlers.
