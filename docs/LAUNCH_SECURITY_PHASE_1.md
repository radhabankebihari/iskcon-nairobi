# Launch security: Phase 1 evidence and owner actions

Reviewed 9 November 2026 against `origin/main` at `91111f4` and the public domain. This is a verification record, not a claim that account settings have been changed.

## Verified in code or from the public site

- The live homepage sends CSP, HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, Referrer-Policy, Permissions-Policy, COOP and CORP. The response is served through Cloudflare. Recheck after each proxy or hosting change.
- `http://iskconnairobi.com/` returns a 301 to the canonical HTTPS URL; `https://www.iskconnairobi.com/` returns a 308 to it.
- A request to `/api/cron/calendar-reminders` without a bearer token returned 401 on the live domain.
- `npm audit --omit=dev` reported 0 vulnerabilities. The install audit still reported development-dependency findings; those are not included in this production-only result.
- Secretlint's recommended rules reported no findings across the tracked working tree or `git log --all -p`. This scan cannot prove that a secret was never shared outside Git; rotate any credential known to have been exposed.
- `.env*` is ignored except `.env.example`. That example lists variable names with empty values.
- Contact, guest-house, Kirtan Safari registration and future-interest forms have a hidden `website` field; their write routes return `{ ok: true }` without calling Apps Script when it is filled. The inputs now have a `name` attribute, and route tests cover the three distinct write endpoints.
- The Apps Script bridge signs requests with HMAC and validates its URL; the script verifies signatures, timestamps and nonces. This does not replace rate limiting on public endpoints.
- The production-build Playwright security checks passed on mobile and desktop: required response headers, no CSP console violations on home, festivals, blog, donate, contact and Kirtan Safari, and an unauthenticated cron request was rejected. These local checks do not substitute for a post-deployment check through Cloudflare.

## Local verification

| Check | Result |
| --- | --- |
| `npm run lint` | Pass; two existing `no-img-element` warnings in Footer and BrandLogo |
| `npx tsc --noEmit` | Pass |
| `npx vitest run` | 15 files, 96 tests passed, including three honeypot route tests |
| `npm run build` | Pass; 44 pages/routes generated |
| `npm run test:e2e -- --workers=4` | 254 passed, 2 intentional skips |
| `npx playwright test tests/e2e/security.spec.ts --workers=4` | 16 passed |
| `npm audit --omit=dev` | 0 vulnerabilities |

The external securityheaders.com scan was blocked by that site's browser challenge, so its grade is **not verified**. The Mozilla Observatory result and a live browser-console CSP check through Cloudflare still need a manual pass. In particular, test the YouTube embed when it is enabled.

## Public API inventory

All active public JSON POST routes use `validatePublicJsonRequest`: content type, declared and streamed body size, same-origin check when an `Origin` header is supplied, and an in-memory IP rate limit. Limits are per instance, not global.

| Route | Method and access | Limit | Effect |
| --- | --- | --- | --- |
| `/api/contact` | Public JSON POST; honeypot | 8 / 10 min; 16 KiB | Signed Apps Script write to Contact Us or Guest House Enquiries, according to form type |
| `/api/kirtan-safari-registration` | Public JSON POST; honeypot | 6 / 10 min; 12 KiB | Signed Apps Script registration write |
| `/api/kirtan-safari-future-interest` | Public JSON POST; honeypot | 5 / 10 min; 10 KiB | Signed Apps Script future-interest write |
| `/api/analytics` | Public JSON POST; honeypot; writes only in production unless disabled | 120 / 10 min; 8 KiB | Signed Apps Script analytics write |
| `/api/subscribe` | Public JSON POST | 10 / 10 min; 8 KiB | Signed Apps Script push-subscription upsert |
| `/api/subscribe` | GET; bearer token required | 20 / 10 min | Reads push-subscriber count |
| `/api/unsubscribe` | Public JSON POST | 10 / 10 min; 4 KiB | Signed Apps Script push-subscription removal |
| `/api/cron/calendar-reminders` | GET; `CRON_SECRET` bearer required | Not public | Sends due reminders; records claims and receipts through Apps Script |
| `/api/bhagavad-gita-course-registration` | POST; closed | Not applicable | Returns 410; no write |

Push subscribe/unsubscribe are device API calls rather than user-completed forms, so adding a visual form honeypot to them would not slow a scripted caller. Analytics already accepts the same `website` trap. The in-memory limits offer only light abuse control on Vercel's multiple instances.

**Recommended rate-limit decision:** use a Cloudflare rate-limiting rule for public `/api/*` POST paths because Cloudflare fronts the production domain. Exclude the authenticated cron GET and test legitimate form submissions and push toggles after enabling it. If the client's Cloudflare plan cannot apply the needed rules, use Vercel Firewall rules instead. Turnstile is a later option if spam persists; it adds client friction and CSP/third-party dependencies. The owner must choose and configure a rule in the account dashboard.

## CSP decision

Keep the present CSP for this launch. `script-src 'unsafe-inline'` weakens its XSS protection, but replacing it with a per-request nonce in Next.js would make currently static pages dynamic and may increase latency and cost. Prototype a nonce policy on a separate branch after launch, measure cache/rendering changes, and check every page and embed before adopting it. Do not remove the directive without a tested replacement.

## Owner-only checks before sign-off

1. **Cloudflare TLS:** confirm Full (strict), Always Use HTTPS, minimum TLS 1.2, and test the certificate with SSL Labs. Do not submit HSTS preload until every subdomain is permanently HTTPS; the header already advertises preload.
2. **DNS:** no DNSSEC DS or CAA record was visible in public DNS on 9 November. Enable DNSSEC in Cloudflare and publish the DS record at the registrar; restrict CAA to the certificate authorities actually used by Cloudflare and Vercel after checking their current guidance. Remove obsolete hosting records.
3. **Email authentication:** public DNS has SPF `v=spf1 include:_spf.google.com ~all` and DMARC `p=none`. Confirm whether Google Workspace is the only sender, verify DKIM, then move DMARC through monitored quarantine to reject. Do not apply the checklist's no-mail `-all` policy while the domain sends email.
4. **Access:** verify 2FA, two trusted recovery admins, and least privilege for Vercel, Cloudflare, GitHub, registrar and Google. Protect `main` and enable preview deployment protection.
5. **Secrets:** compare Production variables with `.env.example`, mark sensitive values accordingly, and rotate `GOOGLE_APPS_SCRIPT_SECRET` or `CRON_SECRET` if they were shared beyond the core team. Never put values in this document.
6. **Dependabot:** turn on alerts and security updates in GitHub repository settings.
7. **Rate limiting:** select and enable the rule above, then test each form and push preference flow.
8. **Browser security:** manually run securityheaders.com and Mozilla Observatory; inspect browser consoles on home, festival, blog, donate, contact and Kirtan Safari pages for CSP violations. Record the grade and any accepted exception.

Phase 1 is fully signed off only after these owner-side checks are recorded; a clean code build alone is not sufficient.
