# Release Workflow

This repository uses four long-lived branches. Each branch represents a distinct
level of confidence. Code moves forward in one direction and is never rebuilt or
edited between final approval and production.

## Branches

| Branch | Purpose | Permitted work | Vercel role |
|---|---|---|---|
| `development` | Active integration | New features, content edits, refactors, and fixes | Development preview |
| `staging` | Complete QA | Testing and fixes found during testing only | Staging preview |
| `release` | Approved production candidate | Release-blocking fixes only, followed by reapproval | Final preview |
| `main` | Live production | No direct development | Production deployment |

When multiple developers are active, create short-lived branches from
`development` using `feature/<short-name>`, `fix/<short-name>`, or
`content/<short-name>`. Merge them back into `development` through a pull
request, then delete them.

## Promotion path

```text
feature/*, fix/*, content/*
              |
              v
        development
              |
              v
           staging
              |
              v
           release
              |
              v
             main
```

Never skip a branch. Never merge `development` directly into `main`. Promote
with pull requests in this order:

1. `development` into `staging`
2. `staging` into `release`
3. `release` into `main`

The `release` commit approved by the reviewer must be the exact commit merged
into `main`. Do not make a final adjustment directly on `release` or `main`. If
a defect is discovered, fix it in the earliest affected branch and promote it
through the gates again.

## Gate 1: Development

Development is where the design or behavior may still change. Every task must:

- Stay within the established design and content conventions in
  `docs/DESIGN_SYSTEM.md` and `docs/CONTENT_GUIDE.md`.
- Preserve unrelated work and avoid generated files or local artifacts.
- Include focused tests when shared logic or user-facing behavior changes.
- Run `npm run check:release` before promotion.
- Receive a Vercel preview URL for early review.

Development is not a promise that the feature is ready. It is a shared,
working integration branch.

## Gate 2: Staging

Staging begins only when the intended feature is complete. Test the whole user
journey, not only the changed component.

Required review:

- Viewports at 360, 390, 768, 1280, and 1440 pixels.
- Chrome or Edge desktop plus a real Android browser when practical.
- Safari or an iPhone/iPad when Apple behavior may be affected.
- Navigation, buttons, links, forms, validation, integrations, downloads,
  notifications, deep links, and back-button behavior.
- Loading, empty, success, failure, offline, reconnection, and slow-network
  states where relevant.
- Keyboard access, visible focus, heading order, labels, alternative text,
  contrast, reduced motion, text zoom, and touch target size.
- Metadata, canonical URL, Open Graph preview, structured data, sitemap impact,
  and 404 behavior for any changed route.
- Browser console, failed requests, layout shift, and image loading.

Log defects against the staging pull request. Fix them in `development`, then
promote the corrected commit back to `staging`. Staging should not become a
second development branch.

## Gate 3: Release

Release is the exact proposed production build. It is a content and code freeze.

Before approval:

1. Confirm all automated checks are green.
2. Review the Vercel preview from top to bottom on mobile and desktop.
3. Verify dates, contacts, payment details, external links, notices, and images.
4. Submit harmless form tests and confirm the correct destination where needed.
5. Confirm environment variables and third-party services exist in production.
6. Record the approved commit SHA and the current production SHA.
7. Confirm who approves the release and who will monitor it.

Any release-branch fix invalidates the previous approval and requires the
relevant checks again.

## Gate 4: Main

`main` is production. It accepts pull requests from `release` only. After merge:

1. Wait for the Vercel production deployment to complete.
2. Smoke-test the homepage, changed routes, navigation, forms, PWA manifest,
   service worker, and key external links on the public domain.
3. Check Vercel runtime logs and browser errors.
4. Tag meaningful releases using the version policy in `docs/APP_VERSIONS.md`.
5. If a serious regression is found, roll back to the recorded production
   deployment first, then repair the code through the normal branch path.

## Hotfixes

For an urgent production failure, branch `hotfix/<short-name>` from `main`.
Test the focused repair, open a pull request to `release`, and then promote it to
`main`. Immediately merge the same repair back into `staging` and `development`
so the branches do not drift.

An inconvenience or content preference is not a hotfix. Use the normal path.

## Repository protection

Configure these rules in GitHub:

- Protect `main`, `release`, and `staging` from direct pushes and deletion.
- Require pull requests and the `Lint, tests, PWA, and production build` check.
- Require at least one approval for `release` and `main`.
- Dismiss stale approvals when new commits are added.
- Require conversations to be resolved before merge.
- Allow only `release` to merge into `main` by team convention.
- Prefer merge commits for gate promotions so branch history remains visible.

Protect `development` from force pushes and deletion. Direct pushes may remain
available to the lead developer, but pull requests are preferred whenever more
than one contributor is active.

## Vercel configuration

Set `main` as the only Production Branch in Vercel. All other branches must
produce Preview Deployments. Use the preview generated from each gate for its
review stage; do not promote an arbitrary feature preview to production.

Recommended aliases, if custom preview domains are later added:

- `development`: `dev.<domain>`
- `staging`: `staging.<domain>`
- `release`: `release.<domain>`
- `main`: the public domain

Production-only secrets should remain limited to Production. Preview-safe test
credentials should be configured separately for Preview environments. Never
allow staging form tests to pollute production records when a test destination
is available.

## Daily commands

Start work:

```bash
git switch development
git pull --ff-only origin development
git switch -c feature/short-description
```

Run the complete automated gate:

```bash
npm run check:release
```

Confirm exactly what is being reviewed:

```bash
git status --short
git log --oneline --decorate -5
git diff origin/main...HEAD
```

No branch name alone proves readiness. Readiness comes from passing the checks,
reviewing the preview, recording evidence, and approving an exact commit.

