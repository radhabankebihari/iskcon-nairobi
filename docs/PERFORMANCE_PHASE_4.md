# Launch Phase 4: Performance

Measured on 2026-11-09 from a local production build with Lighthouse 12.8.2. Each value is the median of three runs. This baseline preceded the footer-logo and 404 image changes; repeat it before approval. These are synthetic results, not field Core Web Vitals. The public PageSpeed API returned HTTP 429, so live PSI and field INP could not be verified. The full baseline is in `docs/baselines/lighthouse-2026-11-09.json`.

| Route | Mobile score | Mobile LCP | Mobile TBT | Desktop score | Desktop LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 50 | 7.8 s | 1146 ms | 91 | 1.6 s | 0 |
| `/festivals` | 49 | 8.2 s | 1476 ms | 94 | 1.6 s | 0 |
| `/festivals/kartik` | 60 | 8.6 s | 442 ms | 95 | 1.6 s | 0 |
| `/donate` | 53 | 6.7 s | 1150 ms | 91 | 1.9 s | 0 |
| `/visit` | 57 | 7.3 s | 732 ms | 93 | 1.6 s | 0 |

The homepage LCP element is the first hero image. It is eager, `fetchpriority=high`, and discoverable in the initial document. The mobile problem is not a missing priority hint. Lighthouse's mobile CPU and network simulation exposes substantial script evaluation and layout work. One trace identified the 891 x 336 partner logo rendered at approximately 85 x 32; that is now served through `next/image` at the intended dimensions. The old 404 background was reduced from 936 KB to 269 KB as WebP.

## Follow-up image and mobile pass

All 18 public images above 400 KiB were converted to bounded WebP assets, with originals retained under `assets/original-images` outside the public tree. Public image references were updated, and `npm run images:optimize` can be repeated for future uploads. The PWA image cache is v12 so installed browsers replace changed image files. The festivals hero and the two About altar images no longer bypass Next's responsive image optimizer. Three-run mobile medians for the final build are in `docs/baselines/lighthouse-2026-11-09-mobile-final.json`:

| Route | Mobile score | Mobile LCP | Mobile TBT |
| --- | ---: | ---: | ---: |
| `/` | 63 | 9.1 s | 169 ms |
| `/festivals` | 58 | 5.1 s | 923 ms |
| `/festivals/kartik` | 65 | 7.3 s | 0 ms |
| `/donate` | 63 | 5.1 s | 672 ms |
| `/visit` | 66 | 4.7 s | 463 ms |

The 90-point mobile target is not met. Scores fluctuate between synthetic runs, so treat small score changes with caution. The critical hero resource reaches the browser quickly; script evaluation and style/layout work remain costly under Lighthouse's emulated phone. The responsive-image audit now passes on all five routes. The festivals page weight dropped from 1,012 to 789 KiB after removing its hero bypass. Do not mark Phase 4 approved based on smaller source files alone.

## Cache verification

- Local production build: `/sw.js` responds `Cache-Control: no-store`; `/api/contact` responds `Cache-Control: private, no-store`; HTML remains framework-managed.
- The obsolete `iskcon-nairobi` Cloudflare account Worker was deleted from the developer's personal account and a follow-up account listing confirmed its removal. The site remains hosted by Vercel. Cloudflare DNS/proxy, if still enabled by the client, is separate from that Worker.
- Keep any Cloudflare proxy rules bypassing cache for `/api/*` and `/sw.js`. Do not add a blanket cache-everything rule for HTML. Confirm live response headers after a release.
- The browser PWA service worker in `public/sw.js` is required for offline and push. It is not a Cloudflare Worker and must remain. Its image cache version is now v12.

## Open before Phase 4 approval

1. Profile shared mobile JavaScript and layout work, reduce the main-thread cost, and repeat the five-page mobile run until LCP < 2.5 s and performance >= 90 or agree on an explicit exception. TBT is a lab proxy, not INP; obtain field INP through PageSpeed or another real-user source.
2. The source-image pass is complete for current public assets. Re-run `npm run images:optimize` and check public image sizes when adding new photos.
3. The `/festivals` image-sizing audit now passes. Recheck crops at mobile, tablet, and desktop widths before any future image-source change.
4. Recheck live Vercel and any Cloudflare proxy headers after deployment. The local header test does not prove the edge honors them.

No production promotion is part of this phase branch.

Verification: `npm run build`, `npx tsc --noEmit`, `npm test` (99 passed), and 400 mobile/desktop launch-layout and smoke browser tests passed. `npm run lint` passed with one remaining SVG brand-logo `<img>` warning.
