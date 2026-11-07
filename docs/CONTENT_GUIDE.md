# Content Guide

## Main Content Locations

- Shared temple data, navigation, projects, festivals, stats, gallery cards,
  guest rooms, notices, and testimonials: `src/data/site.ts`
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

## Adding A Blog Article

1. Add metadata to `src/data/blog.ts`.
2. Create the article route under `src/app/blog/[slug]/page.tsx`.
3. Keep the article body editorial and readable. Avoid dense card layouts inside
   devotional storytelling.
4. Include source/reference links where they matter, but place them quietly.
5. Use a contextual CTA at the end, with desktop alignment matching mobile.

## Adding Notices

Noticeboard content lives in `src/data/site.ts`. Notices are public-facing and
may trigger notifications for users who opted in, so keep titles short and
action links accurate. The Kirtan Safari notice should link to
`/festivals/kirtan-safari`.

## Forms And Sheets

Public forms post to server routes under `src/app/api`. Do not write to Google
Sheets directly from client components. Server routes must validate inputs,
enforce same-origin JSON requests, and save through the signed Apps Script
bridge (`src/lib/appsScriptBridge.ts`), whose secret stays in server-only
environment variables. The script escapes sheet formulas before writing.

Current sheet-backed features:

- Contact form
- Kirtan Safari registration
- Push subscriptions
- City-only website analytics

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
