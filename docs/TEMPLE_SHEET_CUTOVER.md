# Temple-owned spreadsheet cutover

The website writes through a server-side, signed Apps Script Web app. The browser never receives the Apps Script URL, shared secret, or spreadsheet ID. A Google Cloud service-account key is not required.

Client-owned destination: [ISKCON Nairobi submissions sheet](https://docs.google.com/spreadsheets/d/1bOrdD7pitZ2wlIb1XAJgNz6QtWK8_aNAe4brd9fOvA0/edit). Set the Apps Script `SPREADSHEET_ID` property to `1bOrdD7pitZ2wlIb1XAJgNz6QtWK8_aNAe4brd9fOvA0`. The `gid` in a Sheet URL identifies only the currently selected tab.

## Prepare the client-owned spreadsheet

1. Use the temple-owned spreadsheet as the permanent record. In **Share**, confirm General access is **Restricted**. Remove stale collaborators; use Viewer for staff who only read enquiries and Editor only where needed. In Share settings, prevent editors from changing access and prevent viewers/commenters from downloading, printing or copying if those restrictions fit the temple's workflow.
2. Before switching traffic, copy existing rows (including headers) from all applicable tabs: `Contact Us`, `Guest House Enquiries`, `Kirtan Safari Registrations`, `Kirtan Safari 2027 Interest`, `WebsiteAnalytics`, `PushSubscriptions`, and `PushDeliveryLog`. The website can create missing tabs (including `PushDeliveryReceipts` and `PushRunClaims`), but it cannot reconstruct old subscriptions or delivery history. Keep the column order shown in `HEADERS` in `scripts/google-sheets/website-backend.gs`; `PushSubscriptions` has eight columns, the last being `Device ID`.
3. Protect the website-owned columns and headers in every write tab (`Contact Us`, `Guest House Enquiries`, `Kirtan Safari Registrations`, `Kirtan Safari 2027 Interest`, `WebsiteAnalytics`, `PushSubscriptions`, `PushDeliveryLog`, `PushDeliveryReceipts`, and `PushRunClaims`). The Web app runs as the temple owner, so test that it can still write after protection. If staff need to mark an enquiry handled, give them a separate status column outside the protected range.
4. Keep the previous spreadsheet read-only during the short verification/rollback period. Do not copy user data into a public content hub.
5. Confirm the Sheet and its bound Apps Script are owned by the temple account. Make a restricted backup copy before the cutover, and agree who will make monthly copies thereafter. Version history is in **File > Version history**.

## Deploy Apps Script

1. Open the client-owned spreadsheet, then **Extensions > Apps Script**. Replace the boilerplate with `scripts/google-sheets/website-backend.gs` and save it.
2. Under **Project Settings > Script properties**, add `SPREADSHEET_ID` (the ID between `/d/` and `/edit` in the spreadsheet URL) and `WEBSITE_SHARED_SECRET` (a newly generated random secret of at least 32 characters). Optionally add `NOTIFICATION_EMAIL` for immediate contact/guest-house emails. Do not paste these values into source control or this document.
3. **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Authorize it using the temple account, then copy the `/exec` URL. Anonymous access is necessary for the website server to reach the Web app; the script still rejects requests without a valid signed envelope.
4. For later script changes, open **Deploy > Manage deployments**, select the *existing live Web app*, choose **Edit**, select **New version**, and deploy. This keeps the same `/exec` URL in Vercel. Never paste an older copy of `website-backend.gs`: the current script is backend version 2 and older push handlers can lose device identity or delivery history. Check the deployed version in Apps Script **Executions** and with a controlled form/push test.
5. In **Manage deployments**, archive retired deployments only after confirming the active deployment's `/exec` URL exactly matches `GOOGLE_APPS_SCRIPT_URL` in the client Vercel project. Confirm **Execute as: Me**, **Who has access: Anyone**, and that only the necessary temple administrators can edit the script. In **Project Settings > Script properties**, verify `SPREADSHEET_ID` and `WEBSITE_SHARED_SECRET`; `NOTIFICATION_EMAIL` is optional and must not duplicate a separate email-forwarding workflow.

## Configure the client Vercel project

In the temple's Vercel project, set **server-side** `GOOGLE_APPS_SCRIPT_URL` to the `/exec` URL and `GOOGLE_APPS_SCRIPT_SECRET` to the exact same value as the Script property. Set them for the environment being tested, then redeploy that environment. Never use `NEXT_PUBLIC_` for either. The standalone `send-push` command also needs these two values in the operator's local `.env.local`.

After the new path is verified, remove the retired service-account credentials and spreadsheet IDs from Vercel and local secret stores: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `CONTACT_SHEET_ID`, `ANALYTICS_SHEET_ID`, and `PUSH_SUBSCRIPTIONS_SHEET_ID`. Revoke the old service account's access to the client sheet. Do not remove VAPID or `CRON_SECRET`; push delivery still uses them.

## Verification before production switch

1. Test on a preview deployment first. Submit a controlled contact message, guest-house enquiry, Kirtan interest, and (if registration is open) registration. Check each tab for exactly one row and correct column order. Confirm invalid requests and missing/incorrect secrets fail closed.
2. Subscribe a test device with calendar and noticeboard preferences, reload it, and verify the preferences persist. Unsubscribe and confirm its row is removed. Check the protected subscriber-count endpoint if used.
3. In a controlled test, verify `PushDeliveryLog` prevents a second reminder for the same event. Do not broadcast a test push to all subscribers.
4. Confirm analytics appears only on production, and check Apps Script **Executions** for failures or quota issues. Compare new and old sheets: only the client sheet should receive new rows.
5. If immediate contact and guest-house email is desired, set `NOTIFICATION_EMAIL` to the approved recipient. If a separate forwarding script handles alerts, remove this property instead. Remove any retired hourly notification trigger on the old sheet so messages are not emailed twice.
6. Recheck access and sharing with a second, non-admin Google account: it should not be able to edit protected website columns or open the Sheet through an anonymous link. Keep a private record of owners and recovery access; do not list account credentials in the repository.

## Activate the approved retention schedule

The privacy policy sets a 24-month limit for contact, guest-house and Kirtan Safari submissions and a 12-month limit for `WebsiteAnalytics`. The current `website-backend.gs` contains `purgeExpiredWebsiteRecords` for those five tabs only. It skips blank/text timestamps rather than guessing and does not delete push records or accounting data.

Do not release the revised public privacy policy before this script version and its daily trigger are active; otherwise the site would promise a deletion schedule that is not yet running.

1. Before deleting anything, make a restricted backup and review whether any older rows are subject to a legal hold or active dispute. Resolve such records outside the routine cleanup tabs with the temple's privacy lead.
2. After publishing the current script version, run `purgeExpiredWebsiteRecords` once in the Apps Script editor and inspect **Executions** for the count removed from each tab. Confirm the newest rows and headers remain.
3. In Apps Script **Project Settings**, set the script time zone to **Africa/Nairobi**. Run `installRetentionTrigger` once. It replaces only existing triggers for this retention handler and schedules it daily at about 3 AM. Confirm exactly one retention trigger under **Triggers**.
4. Monthly backup copies and exported files may still contain older personal data. The temple must apply the same retention decision to those copies and keep them restricted; this job cleans only the active Sheet.
5. Recheck the policy and schedule if new forms, tabs, legal holds or record categories are introduced. This routine does not apply a retention period to `PushSubscriptions`, `PushDeliveryLog`, `PushDeliveryReceipts` or `PushRunClaims`.

The previous connection should not be disabled until these checks pass. A copied spreadsheet does not include its old Apps Script deployment or triggers.
