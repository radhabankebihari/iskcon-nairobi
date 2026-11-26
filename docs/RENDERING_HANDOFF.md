# Rendering Repairs: Handoff to Codex

Written by Claude on 26 November 2026, when the owner passed the rendering
repair programme to Codex. It records the state of the work, what Claude
attempted, the mistakes Claude made, and the way forward, step by step.

## Read these first, in this order

1. `AGENTS.md`: the rules for every editor.
2. `docs/RENDERING_RULES.md`: rules R1 to R10 and, most important, the release
   gates RG-1 to RG-8 in section 7.
3. `docs/RENDERING_INCIDENT_2026-11-26.md`: why the first release was rolled
   back.
4. This file.
5. `docs/RENDERING_REPAIRS.md`: every task, its status and its "done when".

## Where things stand

| Item | State |
| --- | --- |
| Live site (`main`) | `67b63b5`, identical in content to `9385a64`. None of the rendering work is live. |
| Rendering work | Branch `rendering/release-a`, pushed to GitHub. Not live; Vercel only builds a preview of it. |
| Projects page redesign | Separate branch `design/projects-page`. Not live, not part of this programme. It ships only when the owner asks, and needs its own screen baseline entries for `/projects` updated at that time. |
| Owner's decision | Nothing ships until all four stages are complete and pass every gate. Then one release, through the pull request path. |
| Owner's screen | About 1920 x 1030. It is the `owner-desktop` visual project. |

### Commits on `rendering/release-a`

| Commit | What it does | Verdict |
| --- | --- | --- |
| `95b6e15` | Guardrails: rules, height and shape variants, screen guard, baseline, subject boxes, agent rules, tracked `CLAUDE.md` | Keep. Makes no visible change. |
| `e06dfe3` | RR-02: full menu only from 1360px (`nav-full`) | Keep, but it is a visible change at 1280-1359px (menu button instead of the full menu). Show the owner before release (RG-6). |
| `8f33063` | RR-03: Kirtan Safari heroes reserve the header's height; headline sized by height | Keep. Confirm with the visual comparison (RG-1). |
| `062e7c2` | Guard: counts `.tap-target`, waits for floating buttons, checks the end of each page | Keep. A measurement change that was mixed into the fix batch (see mistakes). |
| `beaf272` | RR-07: WhatsApp button | **Revert.** Changed every width; this is what the owner rejected. |
| `435f176` | RR-09: five small links get `.tap-target`; Kirtan Safari checkbox 24px | Keep. The checkbox is visibly larger: include it in the owner review. |
| `2f24e7e` | RR-14: `laptop` (1366x657) visual project | Keep. |
| `b426c77` | RR-15: seasonal slide checklist and `scripts/fake-time.mjs` | Keep. |
| `7372a87` | Baseline after the fixes; guard skips closed `<details>` and re-scrolls when a page grows | Keep the guard part. The baseline must be re-recorded after reverting RR-07. |
| `f5c8600` | Release gates RG-1 to RG-8, incident write-up, `owner-desktop` visual project, RR-07 reopened, RR-17 and RR-18 added | Keep. |

## What Claude attempted

1. **Audit.** Rendered 26 pages at 11 sizes and benchmarked nine sites. Found
   that layouts were chosen by width only. On short laptop screens:
   - the homepage text covered up to 49% of Krishna's face
   - the header ran off the screen at 1280px
   - the Kirtan Safari headline slid under the logo
2. **Guardrails.** Wrote the rules and repair list. Built a screen guard that
   checks every page at 17 sizes against R1 to R10, as a ratchet against a
   recorded baseline.
3. **Release A.** Fixed RR-02, RR-03, RR-07 and RR-09, added RR-14 and RR-15,
   and pushed straight to `main` after local tests passed.
4. **Rollback.** On the owner's 1920 desktop, the footer had an empty band and
   the homepage Scroll cue had moved inward. The owner asked for the previous
   version; `main` was reverted the same day.
5. **Investigation and gates.** Found the causes (below). The owner adopted
   eight release gates.

## The mistakes Claude made

Each is specific so it is not repeated.

1. **Fixed a narrow problem at every width.** The guard showed the WhatsApp
   button overlapping only below 1440px. Claude still:
   - added 88px of footer bottom padding at every width (`Footer.tsx`), and
   - moved the Scroll cue with `mr-12 lg:mr-16` at every width
     (`HeroSection.tsx`).

   The owner's 1920 screen changed for no benefit.
2. **Changed code without measuring.** The footer padding went in before the
   guard measured the end of the page. There was no "before" measurement.
3. **Mixed guard changes with fixes.** Touch-target problems fell from 6,313
   to 0 in the same batch. Almost all of that drop came from correcting how
   the guard measures `.tap-target`; only five links were actually fixed. The
   release looked better than it was.
4. **Treated "no rule broken" as "nothing changed."** The guard finds
   breakage, not change. Claude never compared the release with the live site.
5. **Skipped the repository's release path.** It pushed straight to `main`, so
   the pull request visual comparison and the Vercel preview review never
   ran. (Every editor had been doing this since 14 November.)
6. **Reviewed the wrong screens.** The final screenshots were taken at the
   broken sizes (1280x650, Kirtan Safari), not at the owner's 1920 screen.
7. **Made a design decision without asking.** Below 1440px the WhatsApp button
   now waits for the visitor to scroll. Nobody approved that.
8. **Did not wait for GitHub's test run.** The baseline was recorded on
   Windows. On Linux, CI run `45744807039` failed two checks:
   `/srila-prabhupada` at `laptop-150` (1280x650) and `laptop-1366`
   (1366x657). The "His Nairobi Legacy" button sits just below the first
   screen (R4), because fonts measure slightly differently. Claude called the
   release ready before that run finished.
9. **Tested only finished states.** The guard checks slides after they settle,
   so it never saw the Gita words appearing over the Deities' photo during
   slide changes (now RR-17).

## Technical lessons about the screen guard

These cost time to discover; they are now handled in
`tests/e2e/screens.spec.ts`, but keep them in mind when changing it.

- The site uses `scroll-behavior: smooth`. Scroll with
  `{ behavior: "instant" }` in tests, or measurements happen mid-scroll.
- Some pages grow after the first scroll, as bars appear. Re-scroll until the
  bottom holds before measuring the end of a page.
- Content inside a closed `<details>` still has a position on the page. It
  must be treated as hidden.
- `.tap-target` enlarges the touch area with an invisible `::after` layer.
  Measure that layer, not the visible text box.
- The WhatsApp button fades in after 1.2 seconds. Measure after that, or
  results vary between runs.
- Homepage slides are chosen when the site is built (`renderedAt()`), not when
  the test runs. Kirtan Safari shows its archive page after the festival. A
  build on a different date can give different results; use
  `scripts/fake-time.mjs` to build for a chosen date.
- The baseline differs between Windows and Linux in borderline cases. CI is
  the source of truth.
- Playwright starts its own server on port 3031. If a preview server already
  uses that port, run tests with a copy of the config on another port, for
  example
  `sed 's/const port = 3031;/const port = 3049;/' playwright.config.ts > playwright.tmp.config.ts`
  and `-c playwright.tmp.config.ts`, then delete the copy.
- On this machine, the full `npm run test:screens` takes 17 to 32 minutes and
  `npm run test:e2e` takes 21 to 28 minutes. Run them in the background.
- `SCREENS_VERBOSE=1` prints every problem behind a baseline count.

## The way forward

Follow the working method in `docs/RENDERING_REPAIRS.md` for every task. In
short: measure first, scope the fix, keep guard changes separate, ask the owner
about anything visible, compare with live, and never push to `main`.

### Step 0: make the branch trustworthy (do this first)

1. **Revert RR-07.** On a new branch from `origin/rendering/release-a`, run
   `git revert beaf272`. Rebuild, then run `npm run test:screens:update`. The
   R9 entries return; that is expected and correct.
2. **Make CI the baseline's source of truth (guard change, RG-5).** Add a
   manually triggered GitHub Actions workflow that builds the site, runs
   `npm run test:screens:update` on Linux and uploads
   `tests/e2e/screens-baseline.json` as an artifact. Commit the downloaded
   file. Then the two Srila Prabhupada R4 entries above become proper
   baseline entries and part of RR-05.
3. **Run the visual comparison (RG-1).** `npm run test:visual:compare` against
   `origin/main`. Write down every difference. Expected ones:
   - the 1280-1359px header (RR-02)
   - the Kirtan Safari hero on short screens (RR-03)
   - the larger checkbox (RR-09)

   Anything else must be explained or removed. There must be no difference at
   `desktop` (1440x900) or `owner-desktop` (1920x1030) apart from the
   Kirtan Safari page on short screens.
4. **Owner review (RG-6).** Send the owner screenshots of each expected
   difference, before and after, including the menu button at 1280 and 1366px.
   Record the decisions in `docs/RENDERING_REPAIRS.md`.

### Step 1: finish the first stage

5. **RR-07 again, scoped.** Change only below 1440px, for example with a
   `max-[1439.98px]:` variant:
   - move the Scroll cue left of the button
   - add footer bottom padding there only

   Ask the owner whether the button should wait for a scroll on smaller
   screens, or stay visible with content given room. Done when R9 is at 0 and
   the visual comparison shows no change at 1440x900 or 1920x1030.
6. **RR-17, the slideshow words.**
   - In its own commit, add the transition check described in the task.
   - Then fix the timing so the words change at the midpoint of the
     cross-fade.
   - Show the owner a recording before merging.
7. **RR-18.** Confirm the photo reload on a throttled connection before
   changing anything.
8. **RR-13 (Safari).** CI can install WebKit itself
   (`npx playwright install --with-deps webkit`). Only the owner's computer
   needs approval for the download.

### Steps 2 to 4

9. **Stage 2:** RR-04, then RR-05 (include the Srila Prabhupada R4 entries),
   then RR-06.
10. **Stage 3:** RR-01, RR-08 and RR-10.
    - RR-01 needs a wide crop of the Deities photo with the Deities in the
      right 60%; the owner approves the image.
    - RR-08: fix the wrong `sizes` attributes now; the owner is asking the
      temple for full-resolution originals.
11. **Stage 4:** RR-11, then RR-12 (the owner approves from screenshots
    first), then RR-16.

### The release

12. When every task is done:
    1. Open a pull request from the work branch into `development`, so the
       visual comparison and a Vercel preview run.
    2. Promote through `staging` and `release` as `docs/RELEASE_WORKFLOW.md`
       describes.
    3. The owner reviews the preview at 1920x1030 and on a phone.
    4. Only then does `release` merge into `main`.
    5. Wait for the CI run on `main` to pass before reporting the release as
       done.

## Definition of done for the whole programme

- Every task in `docs/RENDERING_REPAIRS.md` is Done or explicitly deferred by
  the owner.
- The screen guard passes on CI with no R2, R3, R4, R5 or R9 entries, and R6
  entries only for photos the temple has not yet supplied.
- The visual comparison against the previous `main` contains only differences
  the owner approved.
- The owner has seen the release on their own screen and said to go live.
