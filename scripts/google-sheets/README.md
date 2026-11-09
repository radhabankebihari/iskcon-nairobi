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
been seen before. Push actions take a script lock because they read and rewrite
rows; form and analytics submissions append without that lock.

## Tabs it writes

`Contact Us`, `Guest House Enquiries`, `Kirtan Safari Registrations`,
`Kirtan Safari 2027 Interest`, `WebsiteAnalytics`, `PushSubscriptions`,
`PushDeliveryLog`, `PushDeliveryReceipts`, and `PushRunClaims`. Missing tabs are
created with their headers on first use.

## Email alerts

Set the optional `NOTIFICATION_EMAIL` script property to email the temple
office as each contact or guest-house enquiry arrives.

## Retention

The approved cleanup deletes dated contact, guest-house and Kirtan Safari rows
after 24 months and `WebsiteAnalytics` rows after 12 months. It is not automatic
until the temple owner reviews the data, runs `purgeExpiredWebsiteRecords` once,
and installs the daily trigger with `installRetentionTrigger`. Follow the
cutover guide, including its backup and legal-hold steps.

## After changing the script

Paste the new version into the Sheet's Apps Script project. In **Deploy > Manage
deployments**, edit the existing live Web app and select **New version**. This
retains the `/exec` URL configured in Vercel. Do not create a second live Web
app deployment or paste an older script version. See the cutover guide for the
verification steps before archiving retired deployments.
