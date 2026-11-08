# Content Guide

## Main Content Locations

- Shared temple identity, hours, navigation, projects, homepage festival
  previews, stats, gallery cards, guest rooms, and testimonials: `src/data/site.ts`
- Noticeboard entries and expiry rules: `src/data/notices.ts`
- Festival calendar entries: `src/data/vaishnavaCalendar2026.ts` and
  `src/data/vaishnavaCalendar2027.ts`, joined by `src/data/vaishnavaCalendar.ts`
- Kirtan Safari guests and programme: `src/data/kirtanSafari.ts`
- Blog index cards: `src/data/blog.ts`
- Page metadata, hero copy, and page-specific layout: `src/app/**/page.tsx`
- API integrations: `src/app/api/**`
- PWA and notification behavior: `public/sw.js`, `src/components/system/**`,
  `src/hooks/useInstallPrompt.ts`

If a piece of content appears in more than one place, keep it in `src/data`.
If it only belongs to a page, keep it in that page.

## Adding A Festival Page

1. Add the card data to `festivals` in `src/data/site.ts`.
2. Create a route under `src/app/festivals/[festival-slug]/page.tsx`.
3. Use existing festival pages as spacing references. Janmashtami and
   Radhashtami intentionally share a format.
4. Add calendar and sitemap coverage if the route should be indexed.
5. Prefer temple images or sacred artwork with clear subject positioning.
6. Check the route at phone, tablet, and desktop widths before promotion.

## Adding A Blog Article

1. Add metadata to `src/data/blog.ts`.
2. Create the article route under `src/app/blog/[slug]/page.tsx`.
3. Keep the article body editorial and readable. Avoid dense card layouts inside
   devotional storytelling.
4. Include source/reference links where they matter, but place them quietly.
5. Use a contextual CTA at the end, with desktop alignment matching mobile.

## Adding Notices

Noticeboard content lives in `src/data/notices.ts`. Notices are public-facing and
may trigger notifications for users who opted in, so keep titles short and
action links accurate. Use an explicit Nairobi-offset `expiresAt` for a
time-limited notice, and check the linked route still exists.

## Forms And Sheets

Public forms post to server routes under `src/app/api`. Do not write to Google
Sheets directly from client components. Server routes must validate inputs,
enforce same-origin JSON requests, and save through the signed Apps Script
bridge (`src/lib/appsScriptBridge.ts`), whose secret stays in server-only
environment variables. The script escapes sheet formulas before writing.

Current sheet-backed features:

- Contact and guest-house enquiry forms (both through `/api/contact`, stored in
  separate tabs by `formType`)
- Kirtan Safari registration and future-interest forms
- Push subscriptions and delivery records
- City-only website analytics (`WebsiteAnalytics`)

The Bhagavad Gita course route returns 410 because that intake is closed.
For the tab names and Apps Script deployment contract, see
`scripts/google-sheets/README.md` and `docs/TEMPLE_SHEET_CUTOVER.md`.

## Image Library

Use domain folders under `public/images`:

- `blog`
- `community`
- `donate`
- `festivals`
- `food-for-life`
- `guest-house`
- `hktc`
- `leadership`
- `learn`
- `prabhupada`
- `serve`
- `thika-farm`

Do not create a generic placeholder folder for new assets. If an image is a
temporary library asset, still place it in the domain where it is used and record
its source in `docs/ASSET_SOURCES.md`.

Name new files by subject and purpose, with a year or event when useful (for
example `thika-farm-2022-cows.webp`). Use `-desktop` and `-mobile` only for
intentional crop variants. Before renaming an existing image, search every
reference, including metadata, the manifest, CSS, and the service worker;
`public/` paths are URLs that may already be cached or shared.
