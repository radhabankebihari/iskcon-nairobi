# Project Guidelines

This repository is the production website for ISKCON Nairobi / Sri Sri Radha
Bankebihari Temple. Treat it as a client handoff codebase: keep copy respectful,
assets traceable, spacing intentional, and public integrations secure.

## Start Here

- `README.md` explains local setup, environment variables, deployment, and
  operational checks.
- `docs/REPOSITORY_MAP.md` maps the route, data, component, integration, asset,
  and test boundaries for new contributors.
- `docs/DESIGN_SYSTEM.md` records the visual language, spacing presets,
  navigation behavior, page hero rules, and mobile priorities.
- `docs/CONTENT_GUIDE.md` explains where shared content lives and how to add
  new pages, festivals, blog posts, notices, and images.
- `docs/ASSET_SOURCES.md` records externally sourced library assets that still
  need periodic review or replacement with final temple photography.
- `docs/PWA_GUIDE.md` is required reading before changing the manifest,
  service worker, install icons, offline behavior, or notification deep links.
- `docs/APP_VERSIONS.md` is the authority for release names, version numbers,
  update modes, and the visitor-controlled major-update experience.
- `docs/RELEASE_WORKFLOW.md` defines promotion gates. Verify their branch tips
  against `origin/main` before relying on a branch name as a readiness signal.

## Development Principles

- Keep shared content in `src/data/site.ts` when it appears in multiple places.
- Keep page-specific story, layout, and metadata inside the relevant route under
  `src/app`.
- Use existing section components and spacing presets before creating new layout
  primitives.
- Preserve mobile quality first. Most audience traffic is expected to come from
  phones, so mobile spacing, tap targets, image crops, and navigation density are
  not secondary polish.
- Never commit secrets. Local values belong in `.env.local`; production values
  belong in Vercel environment variables.
- After changing routes, metadata, API handlers, PWA files, or shared layout,
  run `npm run build` before deploying.

## Release Decisions For Editors

These instructions apply to every contributor, including AI-assisted and
automated code editors.

- Version `1.x.x` is the active release family while the app uses its present
  domain. Do not create version `2.0.0` until the owner explicitly confirms
  that the official-domain migration is ready.
- The editor may choose the next version 1 number using the impact rules in
  `docs/APP_VERSIONS.md`. Explain the choice in the release ledger.
- Default to a patch increment for corrections, content and image updates,
  routine security work, and small visual refinements.
- Use a minor increment for a meaningful visitor-facing capability, a new page
  family, an important integration, or a substantial PWA/navigation change.
- Do not increment the public version for documentation-only changes, build
  housekeeping, comments, or an unsuccessful deployment.
- Silent updates are the default. Use a prompted update only when a release is
  substantial enough that visitors will notice and enjoy discovering it, or
  when the owner explicitly asks to announce it.
- Never mark a release as prompted merely to advertise a copy correction. The
  update panel must remain special rather than becoming routine noise.
- Before publishing a prompted release, update every version source and test
  both **Later** and **Update now** on an installation running the previous
  release. Never claim this test passed unless it was actually performed.
- Keep release summaries visitor-facing. Describe what became better without
  exposing implementation details, security internals, or repository jargon.
