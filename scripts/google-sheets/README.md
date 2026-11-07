# Website backend (Apps Script)

`website-backend.gs` is the only script the website needs. It runs as a Web app
inside the temple-owned Google Sheet and receives every form submission,
analytics event, and push subscription from the website's server. No Google
Cloud project, API, or service-account key is involved.

Setup, secrets, and verification steps are in `docs/TEMPLE_SHEET_CUTOVER.md`.

## How a request is checked

The website server signs each request with `GOOGLE_APPS_SCRIPT_SECRET`. The
script accepts it only when the HMAC signature matches its `WEBSITE_SHARED_SECRET`
property, the timestamp is within five minutes, and the one-time nonce has not
been seen before. Every action then runs under a script lock.

## Tabs it writes

`Contact Us`, `Guest House Enquiries`, `Kirtan Safari Registrations`,
`Kirtan Safari 2027 Interest`, `WebsiteAnalytics`, `PushSubscriptions`,
`PushDeliveryLog`, `PushDeliveryReceipts`, and `PushRunClaims`. Missing tabs are
created with their headers on first use.

## Email alerts

Set the optional `NOTIFICATION_EMAIL` script property to email the temple
office as each contact or guest-house enquiry arrives.

## After changing the script

Paste the new version into the Sheet's Apps Script project, then create a new
Web app deployment version. The `/exec` URL in Vercel must point at the active
deployment.
