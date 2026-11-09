# Phase 6: Search and Maps Account Setup

Status: owner reports Phase 6 account setup complete on 10 November 2026. Public DNS and website checks passed; private Search Console, Bing, and Business Profile dashboard states are recorded from the owner's confirmation, not independently inspected. Do not publish verification tokens in Git or send account passwords in chat.

## Completion update (10 November 2026)

- A Google site-verification TXT record is now visible in public DNS. Its value is intentionally omitted here.
- The homepage, `robots.txt`, and `sitemap.xml` return HTTP 200; the sitemap lists 32 URLs.
- The owner confirms Search Console verification and sitemap submission, Bing setup, Business Profile claim/details, and administrator access are done.
- No repository or hosting deployment was needed for the account setup. The separate Phase 5 SEO changes remain local and unpromoted.

## Public preflight (9 November 2026)

- `https://iskconnairobi.com/`, `/visit`, `/festivals`, `/festivals/kartik`, `/donate`, and `/learn` returned HTTP 200.
- `https://iskconnairobi.com/sitemap.xml` returned HTTP 200 with 32 URLs.
- `https://iskconnairobi.com/robots.txt` returned HTTP 200 and references that sitemap.
- The domain uses Cloudflare nameservers `irena.ns.cloudflare.com` and `will.ns.cloudflare.com`. The public apex TXT lookup returned an SPF record but no `google-site-verification` value. This does not prove Search Console has never been verified: another verification method or a TXT record at a different name may exist.
- The live `robots.txt` still contains `Host:` and does not yet disallow `/api/` or `/offline`. The Phase 5 change is local and has not been promoted.

## 1. Google Search Console (temple Google account)

1. In [Search Console](https://search.google.com/search-console), check the property selector for an existing `iskconnairobi.com` Domain property before creating another one.
2. If absent, add a **Domain** property for `iskconnairobi.com`. Copy Google's exact TXT verification value.
3. An authorised DNS administrator adds that TXT value to the Cloudflare zone at `@`; do not replace the existing SPF TXT record. Wait for public DNS propagation, then click **Verify** in Search Console.
4. Keep the temple account as an owner and add one additional trusted temple administrator under **Settings > Users and permissions**. Give the developer only the access needed for maintenance.
5. Submit `https://iskconnairobi.com/sitemap.xml` in **Sitemaps** and record Google's status and discovered-URL count.
6. Inspect the homepage, then `/visit`, `/festivals`, `/festivals/kartik`, `/donate`, and `/learn`. Request indexing for pages Google has not indexed. An indexing request is not a guarantee of inclusion.
7. Check Pages, HTTPS, Core Web Vitals, and structured-data reports weekly during the first month. Record actionable errors rather than treating all excluded URLs as defects.

Evidence to record: property type, verified owner(s), DNS record name (not the secret value), sitemap submission status, and inspection status of the six priority URLs.

## 2. Bing Webmaster Tools (temple-owned account)

1. After Search Console verification, sign into [Bing Webmaster Tools](https://www.bing.com/webmasters/) using the temple-owned account.
2. Choose **Import from Google Search Console**, authorise read access, and import `iskconnairobi.com`. Confirm the site and sitemap are accepted.
3. Review IndexNow separately. Do not add a key or automatic ping until the temple approves the service and the release workflow can provide a reliable post-deployment trigger.

Evidence to record: verified site, sitemap status, and whether IndexNow is enabled.

## 3. Google Business Profile (temple owner)

1. Search Google Maps for the existing ISKCON Nairobi listing before creating a new profile. Claim an unverified listing, or request ownership if another account already manages it. Avoid duplicate profiles.
2. The temple must confirm the public name, exact map pin, address, main telephone number, category, website, and normal/special opening hours. The website currently lists `ISKCON Nairobi`, Hare Krishna Close, Parklands / West Ngara, Nairobi, `+254 722 815 039`, and `https://iskconnairobi.com`.
3. Complete whichever verification method Google offers. Add real, approved photos of the temple, altar, and community. Do not publish invented testimonials or solicit incentivised reviews.
4. Grant at least two temple-controlled people appropriate access. The developer should have manager access only if needed.
5. Check Bing Places and Apple Business Connect after the Google profile is correct; avoid creating a second location for the same temple.

Evidence to record: profile URL, ownership and verification status, visible phone/address/hours/site URL, and a confirmed map pin.

## Completion gate

The owner reports that Search Console and Bing ownership, sitemap acceptance, Business Profile details and map pin, and secondary administrator access are complete. Retain screenshots or an internal access register in the temple's private workspace; do not put account credentials or verification values in this repository.
