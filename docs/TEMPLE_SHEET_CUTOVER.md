# Temple-owned spreadsheet cutover

The website writes through a server-side, signed Apps Script Web app. The browser never receives the Apps Script URL, shared secret, or spreadsheet ID. A Google Cloud service-account key is not required.

Client-owned destination: [ISKCON Nairobi submissions sheet](https://docs.google.com/spreadsheets/d/1bOrdD7pitZ2wlIb1XAJgNz6QtWK8_aNAe4brd9fOvA0/edit). Set the Apps Script `SPREADSHEET_ID` property to `1bOrdD7pitZ2wlIb1XAJgNz6QtWK8_aNAe4brd9fOvA0`. The `gid` in a Sheet URL identifies only the currently selected tab.

## Prepare the client-owned spreadsheet

1. Use the temple-owned spreadsheet as the permanent record. Confirm that it is not shared publicly.
2. Before switching traffic, copy existing rows (including headers) from all applicable tabs: `Contact Us`, `Guest House Enquiries`, `Kirtan Safari Registrations`, `Kirtan Safari 2027 Interest`, `WebsiteAnalytics`, `PushSubscriptions`, and `PushDeliveryLog`. The website can create missing tabs, but it cannot reconstruct old subscriptions or delivery history. Preserve the seven-column order of `PushSubscriptions` and six-column order of `PushDeliveryLog` shown in `scripts/google-sheets/website-backend.gs`.
3. Keep the previous spreadsheet read-only during the short verification/rollback period. Do not copy user data into a public content hub.

## Deploy Apps Script

1. Open the client-owned spreadsheet, then **Extensions > Apps Script**. Replace the boilerplate with `scripts/google-sheets/website-backend.gs` and save it.
2. Under **Project Settings > Script properties**, add `SPREADSHEET_ID` (the ID between `/d/` and `/edit` in the spreadsheet URL) and `WEBSITE_SHARED_SECRET` (a newly generated random secret of at least 32 characters). Optionally add `NOTIFICATION_EMAIL` for immediate contact/guest-house emails. Do not paste these values into source control or this document.
3. **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Authorize it using the temple account, then copy the `/exec` URL. Anonymous access is necessary for the website server to reach the Web app; the script still rejects requests without a valid signed envelope.
4. On every code change, create a new Apps Script deployment version and ensure the website points to its active `/exec` URL.

## Configure the client Vercel project

In the temple's Vercel project, set **server-side** `GOOGLE_APPS_SCRIPT_URL` to the `/exec` URL and `GOOGLE_APPS_SCRIPT_SECRET` to the exact same value as the Script property. Set them for the environment being tested, then redeploy that environment. Never use `NEXT_PUBLIC_` for either. The standalone `send-push` command also needs these two values in the operator's local `.env.local`.

After the new path is verified, remove the retired service-account credentials and spreadsheet IDs from Vercel and local secret stores: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `CONTACT_SHEET_ID`, `ANALYTICS_SHEET_ID`, and `PUSH_SUBSCRIPTIONS_SHEET_ID`. Revoke the old service account's access to the client sheet. Do not remove VAPID or `CRON_SECRET`; push delivery still uses them.

## Verification before production switch

1. Test on a preview deployment first. Submit a controlled contact message, guest-house enquiry, Kirtan interest, and (if registration is open) registration. Check each tab for exactly one row and correct column order. Confirm invalid requests and missing/incorrect secrets fail closed.
2. Subscribe a test device with calendar and noticeboard preferences, reload it, and verify the preferences persist. Unsubscribe and confirm its row is removed. Check the protected subscriber-count endpoint if used.
3. In a controlled test, verify `PushDeliveryLog` prevents a second reminder for the same event. Do not broadcast a test push to all subscribers.
4. Confirm analytics appears only on production, and check Apps Script **Executions** for failures or quota issues. Compare new and old sheets: only the client sheet should receive new rows.
5. If using immediate `NOTIFICATION_EMAIL`, do not also install the older hourly `submission-notifications.gs` trigger, or messages may be emailed twice. If the hourly digest is preferred, omit `NOTIFICATION_EMAIL` and install only that trigger in the client Apps Script project.

The previous connection should not be disabled until these checks pass. A copied spreadsheet does not include its old Apps Script deployment or triggers.
