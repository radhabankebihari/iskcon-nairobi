# ISKCON Nairobi App Versions

This ledger records public app releases. Update it whenever a release version changes. The machine-readable companion is `public/app-version.json`.

## Versioning Rules

- Version `1.x.x` remains the active family until the owner explicitly approves
  migration to the official domain. Version `2.0.0` is reserved for that launch,
  regardless of how many substantial version 1 features are delivered first.
- Patch (`1.0.1`): copy corrections, small visual fixes, and routine security patches. Use `updateMode: "silent"`.
- Minor (`1.1.0`): meaningful features that do not fundamentally change the app. Usually silent, but may be prompted when the owner wants to announce the release.
- Major (`2.0.0`): the official-domain release. Use `updateMode: "prompt"` so installed users choose when to activate it.
- Every release must update `package.json`, `package-lock.json`, `public/app-version.json`, this ledger, and the service-worker `CACHE_VERSION` when its cached shell changes.
- A prompted PWA update is downloaded by the browser in the background but is not activated until the visitor selects **Update now**. This is the closest standards-based equivalent to an app-store update choice.

## Editor Discretion

The implementing editor chooses patch or minor numbering according to visitor
impact and records the reason here. Documentation, comments, internal cleanup,
and failed deployments do not create releases. Silent updates are the default.
Reserve the prompted experience for a grouped, noticeable improvement that is
worth presenting to visitors, or for a release the owner explicitly requests to
announce. Full decision rules are maintained in `PROJECT_GUIDELINES.md`.

## Publishing A Prompted Release

1. Set the new semantic version in `package.json` and `package-lock.json`.
2. Add the release below with its date and user-facing highlights.
3. Update `public/app-version.json`, set `updateMode` to `"prompt"`, and keep the summary concise.
4. In `public/sw.js`, increment `CACHE_VERSION` and set `UPDATE_MODE` to `"prompt"`.
5. Run `npm run verify:pwa` and `npm run build`.
6. Deploy and verify that an installation on the previous version shows the release panel.
7. Test **Later** and **Update now**. Later must leave the waiting worker inactive; Update now must activate and reload once.

## 1.3.2 - Mobile Footer Spacing

**Released:** 10 November 2026

**Update mode:** Silent. A small mobile layout correction; `CACHE_VERSION` moves to v14 for installed visitors.

- Reduced unnecessary space below the footer from 80px to a 20px minimum, including device safe-area support.
- Kept the floating WhatsApp button's behavior unchanged.

## 1.3.1 - Launch Quality Update

**Released:** 10 November 2026

**Update mode:** Silent. A patch release focused on launch quality; cached imagery changed, so `CACHE_VERSION` moves to v13.

- Security, accessibility, SEO and functional checks completed across the launch phases.
- Key images optimized and refreshed without changing the page designs.
- The privacy page states approved retention targets but does not claim automatic deletion until the temple installs the Apps Script cleanup trigger.

## 1.3.0 - Kartik Guide and 2027 Temple Schedule

**Released:** 8 November 2026

**Update mode:** Silent. A minor release: a new page and schedule changes visitors will notice. `CACHE_VERSION` moved to v10 so installed devices drop cached pages with the old hours.

- New `/festivals/kartik` guide: the Damodara story, daily lamp offerings, how to offer a lamp, the Damodarastakam reader, and the month's holy days. `/festivals/damodarastakam` redirects to it.
- Temple hours and daily schedule follow the printed 2027 calendar (4:30 AM to 1:00 PM, 4:20 PM to 8:30 PM).
- Two approved community testimonials, the calendar's programme facilitators, and new Thika Farm and HKTC photos. The Ratha Yatra and Shop pages stay unpublished.

## 1.2.0 - Calendar, Giving, and Design Refresh

**Released:** 7 November 2026

**Update mode:** Silent. A minor release. `CACHE_VERSION` moved to v8 so installed devices replace cached interface files.

### Highlights

- The 2027 Vaishnava calendar, with short descriptions for every 2026 and 2027 observance, fasting notes, and Ekadashi break-fast times.
- A simpler giving flow: M-Pesa Paybill details, contact buttons, and image cards for each cause page.
- A site-wide design pass: sentence-case buttons, clearer festival headers, refreshed imagery, and a header that stays compact when a page is refreshed mid-scroll.
- Forms, analytics, and push reminders save through the client-owned Apps Script backend.
- Calendar reminders reach each device once, and renewed subscriptions keep their reminder choices.

## 1.1.4 - Responsive Layout Correction

**Released:** 4 November 2026

**Update mode:** Silent. A patch correcting shared navigation and donation-card rendering. `CACHE_VERSION` moved to v7 so installed devices replace the affected cached interface files automatically.

### Highlights

- The ISKCON Nairobi name remains on one line on phones, tablets, and desktop screens.
- The full society name once again fits on one line in the desktop navigation.
- Donation-card actions use a consistent label and height at every breakpoint.

## 1.1.3 - Navigation Refresh Correction

**Released:** 4 November 2026

**Update mode:** Silent. A patch, because it corrects a visual fault in the navigation. The cached shell is unchanged, so `CACHE_VERSION` stays at v6.

### Highlights

- Navigation no longer overlaps page content when a page is refreshed partway down.
- The temple status bar returns straight away after a refresh.

## 1.1.2 - Status Bar Correction

**Released:** 4 November 2026

**Update mode:** Silent. A patch, because it corrects a visual fault introduced in 1.1.0. The cached shell is unchanged, so `CACHE_VERSION` stays at v6.

### Highlights

- The temple status bar sits directly under the navigation again while scrolling.
- HKTC page section links stay attached to the navigation.

## 1.1.1 - Clearer Forms and Wording

**Released:** 3 November 2026

**Update mode:** Silent. A patch, because these are small corrections to existing pages. The cached shell is unchanged, so `CACHE_VERSION` stays at v6.

### Highlights

- Forms explain mistakes clearly, mark optional fields, and show visible keyboard focus.
- Festival links and labels use one name.
- Small visual fixes on phones and a shorter homepage.

## 1.1.0 - Faster, Clearer, Easier to Use

**Released:** 3 November 2026

**Update mode:** Silent. A minor release, because it adds visitor-facing improvements across the whole site without fundamentally changing the app. `CACHE_VERSION` moved to v6 because large images left the precache list.

### Highlights

- Pages download far less data on mobile connections.
- Temple status now matches the published opening hours.
- Upcoming festival dates always show the next dates on the calendar.
- Donation pages explain how giving works today.
- Text, colours, and controls are easier to read and use by touch, keyboard, and screen reader.
- Visit and Festivals pages lead with what visitors need first, and Serve joins the main menu.

## 1.0.0 - First Complete Release

**Released:** 25 August 2026

**Update mode:** Silent baseline activation

The first complete production version of the ISKCON Nairobi website app.

### Highlights

- Installable Progressive Web App for Android, Apple devices, and desktop browsers.
- Live-first navigation with selective offline access and a dedicated offline fallback.
- Responsive temple website covering visits, festivals, calendar, projects, learning, leadership, donations, hospitality, media, and devotional articles.
- Noticeboard, push-notification foundations, forms, Google Sheets integrations, and security controls.
- Versioned service worker, maskable icons, splash configuration, network-status handling, and controlled updates.
