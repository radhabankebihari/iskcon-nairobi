# Launch Phase 4: Performance

Measured on 2026-11-09 from a local production build with Lighthouse 12.8.2. Each value is the median of three runs. This baseline preceded the footer-logo and 404 image changes; repeat it before approval. These are synthetic results, not field Core Web Vitals. The public PageSpeed API returned HTTP 429, so live PSI and field INP could not be verified. The full baseline is in `docs/baselines/lighthouse-2026-11-09.json`.

| Route | Mobile score | Mobile LCP | Mobile TBT | Desktop score | Desktop LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 50 | 7.8 s | 1146 ms | 91 | 1.6 s | 0 |
| `/festivals` | 49 | 8.2 s | 1476 ms | 94 | 1.6 s | 0 |
| `/festivals/kartik` | 60 | 8.6 s | 442 ms | 95 | 1.6 s | 0 |
| `/donate` | 53 | 6.7 s | 1150 ms | 91 | 1.9 s | 0 |
| `/visit` | 57 | 7.3 s | 732 ms | 93 | 1.6 s | 0 |

The homepage LCP element is the first hero image. It is eager, `fetchpriority=high`, and discoverable in the initial document. The mobile problem is not a missing priority hint. Lighthouse's mobile CPU and network simulation exposes substantial script evaluation and layout work; it needs a separate bundle and rendering pass. Lighthouse reported properly sized images on four of five mobile routes, but not `/festivals`; desktop still reports some image waste. One trace identified the 891 x 336 partner logo rendered at approximately 85 x 32; that is now served through `next/image` at the intended dimensions. The old 404 background was reduced from 936 KB to 269 KB as WebP.

## Cache verification

- Local production build: `/sw.js` responds `Cache-Control: no-store`; `/api/contact` responds `Cache-Control: private, no-store`; HTML remains framework-managed.
- Live Cloudflare check before promotion: HTML was `cf-cache-status: DYNAMIC`, but `/sw.js` was cached/revalidated with a four-hour maximum age. The new header cannot be verified at the edge until a future deployment.
- Keep Cloudflare rules bypassing cache for `/api/*` and `/sw.js`. Do not add a blanket cache-everything rule for HTML. Confirm with `curl -sI` after any release.
- The service worker cache version is now v11, matching the changed cached image asset policy. The launch checklist still mentions v9 and should be updated when its owner reviews it.

## Open before Phase 4 approval

1. Profile shared mobile JavaScript and layout work, reduce the main-thread cost, and repeat the five-page mobile run until LCP < 2.5 s and performance >= 90 or agree on an explicit exception. TBT is a lab proxy, not INP; obtain field INP through PageSpeed or another real-user source.
2. Complete the source-image pass. At baseline 18 files in `public/images` were above 400 KiB. The first four JPEGs were recompressed only marginally; Windows then refused safe replacement of the next tracked file in this worktree, so the batch was stopped. Originals remain in Git history. Do not assume this target is met.
3. Inspect the `/festivals` image-sizing audit and desktop tile sizing, then compare crops at mobile, tablet, and desktop widths before changing `sizes` or sources.
4. Recheck live Cloudflare and Vercel headers after deployment. The local header test does not prove the edge honors them.

No production promotion is part of this phase branch.

Verification: `npm run build`, `npx tsc --noEmit`, `npm test` (99 passed), and 400 mobile/desktop launch-layout and smoke browser tests passed. `npm run lint` passed with one remaining SVG brand-logo `<img>` warning.
