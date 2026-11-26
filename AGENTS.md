<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules for every editor

These apply to people, Claude, Codex and any other AI or automated editor.

- Start with `PROJECT_GUIDELINES.md`.
- **Rendering is a hard requirement.** Before changing any layout, hero, header,
  floating element, global spacing or a large image, read
  `docs/RENDERING_RULES.md`. The site must render correctly on every screen in
  `tests/e2e/screens.ts`, including short laptop screens such as 1366x657.
- Use only the breakpoint tokens in the rules (`ht-*`, `max-ht-*`, `shape-*`,
  `desk-short` and the width breakpoints). Do not add one-off pixel thresholds.
- Every hero photo of Deities, Srila Prabhupada, people or a featured object
  declares its subject boxes (`subject`, `imageSubject` or `data-subject`).
- Run `npm run test:e2e` (includes the screen guard) before finishing, and
  `npm run test:screens` when a hero, the header or a full-screen layout
  changed. Never raise a count in `tests/e2e/screens-baseline.json` or
  `tests/e2e/a11y-baseline.json` to make a test pass; fix the page.
- **The checks find breakage, not change.** Follow the release gates RG-1 to
  RG-8 in section 7 of `docs/RENDERING_RULES.md`:
  - Run `npm run test:visual:compare` before any release, and explain every
    difference.
  - Change only the screen sizes where a problem was measured, and measure
    before fixing.
  - Commit guard changes separately from fixes.
  - Bring design decisions to the owner with screenshots first.
  - Test transitions as well as finished states.
  - Send rendering work through the pull request path in
    `docs/RELEASE_WORKFLOW.md`, never straight to `main`.

  These gates exist because a release that passed every check still changed
  the owner's desktop and had to be rolled back
  (`docs/RENDERING_INCIDENT_2026-11-26.md`).
- Open rendering repairs are listed in `docs/RENDERING_REPAIRS.md`. Update its
  status table when you start or finish one.
- The working folder may be shared with another editor. Check the branch and
  `git status` before committing, commit only your own changes, and never push
  to `main` or deploy unless the owner explicitly asks.
