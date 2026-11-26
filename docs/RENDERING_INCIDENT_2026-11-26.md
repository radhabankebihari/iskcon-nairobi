# Incident: Release A changed the desktop layout (26 November 2026)

## What happened

Release A of the rendering repairs (`rendering/release-a`) went live on
26 November 2026 and was rolled back the same day. On the owner's desktop
(about 1920 x 1030) two things changed that nobody had asked for:

- The footer gained an empty band about 70px tall below its last line.
- The homepage hero's "Scroll" cue moved about 64px in from the right edge.

The owner also saw the Gita Jayanti words over the Deities' photo. That turned
out to be older behaviour, made more noticeable by the same review.

`main` was restored to `9385a64` with a revert commit (`67b63b5`). The work is
kept on `rendering/release-a`.

## Why the changes happened

Both came from RR-07, the WhatsApp button fix.

| Change | Code | What the evidence said |
| --- | --- | --- |
| Footer band | `Footer.tsx`: bottom padding raised from 1.25rem to 5.5rem at every width | The screen guard had never measured the footer. The end-of-page check was added in the same batch, so there was no "before" measurement. Below 1440px the button does reach the last footer line; from 1440px up it never does. |
| Scroll cue moved | `HeroSection.tsx`: `mr-12 lg:mr-16` at every width | Before the change, the guard found the button over the Scroll cue only at 1024 to 1366px. At 1440px and wider it found no overlap at all. |

In both cases a problem that exists below 1440px was fixed at every width, so
screens that were never broken changed.

RR-07 also changed behaviour without the owner's approval: below 1440px the
WhatsApp button now waits for the visitor to scroll. That may be the right call,
but it is a design decision, not a repair.

## Why the Gita words sat on the Deities' photo

Measured on the live site at 1903 x 1032:

| Time | Words shown | Photo shown |
| --- | --- | --- |
| 9.0s | Gita Jayanti | 100% Deities |
| 9.5s | Gita Jayanti | 76% Deities, 23% Gita |
| 10.0s | Gita Jayanti | 22% Deities, 77% Gita |
| 11.0s | Gita Jayanti | 100% Gita |

In `HeroSection.tsx` the words come straight from the current slide and change
at once, while the photos cross-fade over 2 seconds (`duration-2000`). For
about a second and a half the words belong to the next slide and the photo to
the previous one. The screen guard waits 2.2 seconds after each slide change,
so it only ever sees finished slides and cannot see this.

A smaller finding in the same log: at about 7.5s the current Deities photo
briefly reported no image and reloaded, when the next slide was prepared.
On a slow connection that could show as a flicker. It needs its own check.

## Why the process did not catch it

The process was meant to make the site safer, and its checks all passed. The
gaps were in what the checks looked for and in how the release went out.

1. **The guard checks for breakage, not for change.** It counts broken rules
   (overlaps, clipping, small targets). It is silent when a screen that was
   fine changes. "The baseline only went down" was treated as proof the
   release was good.
2. **The repository's own safety net was skipped.** `docs/RELEASE_WORKFLOW.md`
   sends work through pull requests to `development`, `staging`, `release` and
   `main`. Pull requests run `npm run test:visual:compare`, which compares
   full-page screenshots of the old and new versions, and each stage gets a
   Vercel preview. That path was last used on 14 November. Since then 28
   commits, from all editors, went straight to `main`, so the comparison never
   ran. It would have flagged the footer change on every page.
3. **Fixes were applied everywhere instead of where the problem was.** The
   guard knew the overlap only happened below 1440px, but the fix did not use
   that.
4. **One fix had no evidence at all.** The footer padding was added before the
   end-of-page check existed, on the assumption that it would be needed.
5. **The guard and the fixes changed in the same batch.** Touch-target problems
   fell from 6,313 to 0, but almost all of that came from correcting how the
   guard measured `.tap-target`; only five links were actually fixed.
   Mixing the two made the release look better than the fixes alone.
6. **Screenshots were taken where things were broken, not where the owner
   looks.** The pre-release check covered 1280 x 650 and the Kirtan Safari
   page. Nobody looked at an unchanged-looking 1920 screen, where the
   unrequested changes were.
7. **A design decision went out as a repair.** Hiding the WhatsApp button until
   scrolling, on most laptops and phones, was never put to the owner.
8. **Only finished states are tested.** Transitions such as slide changes are
   never measured, so the words-over-the-wrong-photo problem was invisible.

## Changes to the process

Adopted by the owner on 26 November 2026 as release gates RG-1 to RG-8 in
section 7 of `docs/RENDERING_RULES.md`, and reflected in `AGENTS.md`, the
working method in `docs/RENDERING_REPAIRS.md` and the pull request template.
The owner's 1920 x 1030 desktop was added to the visual comparison as
`owner-desktop`. RR-07 was reopened, and RR-17 and RR-18 were added for the
slideshow findings.

1. **No unexplained visual change.** Before any release, run
   `npm run test:visual:compare` against the live `main` at every visual size,
   including a 1920 x 1030 desktop. Every difference must belong to a task in
   `docs/RENDERING_REPAIRS.md`. An unexplained difference blocks the release.
2. **Use the release path.** Rendering work goes through pull requests so the
   visual comparison and Vercel previews run, and the owner reviews the
   preview before anything reaches `main`.
3. **Scope every fix to the measured problem.** A fix may only change the
   screen sizes where the guard reported the problem. Each fix commit names
   the baseline entries it removes.
4. **Measure first.** A fix needs a guard entry, or a new check showing the
   problem, before the change.
5. **Guard changes land separately**, with their own baseline update, before
   any fix that relies on them.
6. **Design decisions go to the owner first**, with screenshots, even when they
   solve a rule.
7. **Test transitions.** Add a check that samples the hero during a slide
   change and fails when the words and the mostly-visible photo belong to
   different slides.
8. **Ship once.** The remaining stages ship together, after all four are
   complete and pass every check above.
