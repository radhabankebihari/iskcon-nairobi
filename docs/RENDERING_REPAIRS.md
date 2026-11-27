# Rendering Repairs

The work list from the November 2026 screen audit. Each task has an ID, the
files involved, an approach, and a "done when" that the screen guard can prove.
The rules these tasks satisfy are in `docs/RENDERING_RULES.md`.

Any contributor can take a task: the owner, Claude, Codex or another editor.
Follow the working method at the end of this file, and update the status table
when you start and when you finish.

## Status

| ID | Task | Priority | Size | Status | Branch / notes |
| --- | --- | --- | --- | --- | --- |
| G1-G6 | Guardrails: rules, variants, screen guard, baseline, agent pointers | Done first | M | Done | `rendering/release-a`, 26 Nov 2026; baseline to be re-recorded on CI (see `docs/RENDERING_HANDOFF.md`, step 0) |
| RR-01 | Homepage hero: text off the Deities on laptops | Critical | L | To do | Needs a wide crop, see step 1 |
| RR-02 | Header fits at 1280 to 1359px | Critical | S | In review | `rendering/release-a` (`e06dfe3`): full menu from 1360px (`nav-full`); R2 at 0. Owner approved the menu button at 1280-1359px on 27 Nov 2026. Step 0 visual comparison confirms 1366px keeps the full menu and owner-desktop is unchanged; screenshots sent for final review. |
| RR-03 | Kirtan Safari headline below the header | Critical | S | In review | Both heroes now reserve the header only on short landscape screens; the archive also keeps padding at measured 320x568. The Kirtan Safari guard passes 34/34. Fresh `origin/main` comparison: tablet hero is unchanged; landscape and laptop hero differences remain. The tablet full-page screenshot still differs solely from RR-09's larger checkbox (75/78 pass). |
| RR-04 | Compact header on short desktop screens | High | M | To do | After RR-02 |
| RR-05 | Page heroes sized by height too | High | M | To do | After RR-04 |
| RR-06 | Festival heroes: buttons on the first screen | High | S | To do | After RR-05 |
| RR-07 | WhatsApp button clear of content | Medium | S | Reopened | First version (`beaf272`) changed every width and was rolled back on 26 Nov 2026. Reverted on `rendering/step0-baseline` (`068603d`); Linux screen baseline recorded at `6c69fb3` from exact source `70f949d46430f4c9b0ea76c391f55124c8ab24b2`. Redo below 1440px only; showing the button on scroll needs owner approval. |
| RR-08 | Replace or reframe low-resolution photos | High | M | Waiting on photos | Owner to request originals |
| RR-09 | Tap targets of at least 24px | Medium | S | In review | `rendering/release-a` (`435f176`): 5 links fixed and the checkbox made 24px; most of the R8 drop came from the guard change `062e7c2`. The original guard recorded 22 R8 tap-target findings on Kirtan Safari at 768x1024. The larger checkbox changes the tablet form height by 7px and accounts for the remaining tablet visual comparison failure; close-up screenshots sent for owner approval. |
| RR-10 | Subject boxes for every hero photo | High | M | To do | After RR-01 |
| RR-11 | Shared art-directed image component | Medium | L | To do | After RR-01 and RR-10 |
| RR-12 | Large and ultra-wide monitors | Low | M | To do | Owner reviews visually |
| RR-13 | Safari (WebKit) in the screen guard | Medium | M | To do | CI can install WebKit itself; a local run needs the owner to approve the download |
| RR-14 | Screenshot comparisons at laptop sizes | Medium | S | Done | `rendering/release-a`, 26 Nov 2026: `laptop` visual project at 1366x657 |
| RR-15 | Seasonal slide checklist | High | S | Done | `rendering/release-a`, 26 Nov 2026: CONTENT_GUIDE checklist and `scripts/fake-time.mjs` |
| RR-16 | Cards that size to their column | Low | L | Later | |
| RR-17 | Hero words match the photo during slide changes | High | M | To do | Transition check first (RG-7), then fix |
| RR-18 | Hero photo reloads before a slide change | Medium | S | To do | Seen at about 7.5s on the live homepage; confirm first |

Status values: To do, In progress, In review, Done, Reopened, Waiting, Waiting on photos, Later.

## Guardrails (done in the first change)

- **G1** `docs/RENDERING_RULES.md`: rules R1 to R10, the supported screens,
  breakpoint tokens and the height behaviour tables.
- **G2** Height and shape variants in `src/app/globals.css`: `ht-sm` to `ht-xl`,
  `max-ht-*`, `shape-tall`, `shape-wide`, `shape-ultrawide`, `desk-short`.
- **G3** `tests/e2e/screens.ts` and `tests/e2e/screens.spec.ts`: every public
  page at 17 sizes, checked against R1 to R10. Seven sizes run in
  `npm run test:e2e` and CI; all 17 run in `npm run test:screens`.
- **G4** `tests/e2e/screens-baseline.json`: today's known problems. The guard
  fails only when a page gets worse, so repairs can land one at a time.
- **G5** Subject boxes for the three homepage slides (`subject`,
  `mobileSubject`) and an `imageSubject` prop on `PageHero`.
- **G6** `AGENTS.md`, `CLAUDE.md` and the pull request template point every
  editor to the rules.

## Critical

### RR-01 Homepage hero: text off the Deities on laptops

**Problem.** Between 1024 and 1920px wide, the hero text covers up to 49% of
Krishna's face (R5). The photo is cropped from the centre, and on a 2:1
laptop browser it is scaled up so the faces land in the text area. Three
full-image gradients also dull the Deities. The screen guard found three more
cases of the same cause:

- **Phones held sideways (844x390):** the tall phone photo is chosen by width
  (900px or less), so a sideways phone shows its middle band. Krishna's face is
  cropped off completely and Radharani's by 77%. The Gita slide loses 85% of
  the book.
- **Gita slide on phones and portrait tablets:** the text covers the bottom of
  the book (6% at 390x844, 13% at 768x1024).
- **Ultra-wide monitors (3440x1340):** the Gita book is 35% cropped.

**Files.** `src/components/sections/HeroSection.tsx`,
`src/components/sections/HeroSection.css`, new images in `public/images/`.

**Approach.**
1. Make a wide crop of the Deities photo, about 2.4:1 and at least 2,880px
   wide, with the Deities in the right 60% and calm background on the left.
   Use a wider original from the temple if one exists; otherwise extend the
   backdrop. Mark its subject boxes. Check the Gita slide's composed image the
   same way.
2. Add `wideSrc` and `wideSubject` to `HeroImage` and serve them through a
   `<source media="(min-aspect-ratio: 17/9)">`. Choose the phone photo by
   shape too: `(max-aspect-ratio: 4/5)` instead of `(max-width: 900px)`, so a
   sideways phone gets the wide crop. Copy the matching boxes into the
   `data-subject` attributes. The guard reads `data-subject-alt-media`; extend
   it to a third media query if needed.
3. Under `desk-short`, cap the text block at 36rem and size the tagline by
   height too, for example `clamp(1.4rem, min(3.5vw, 5vh), 2.25rem)`.
4. Replace the three full-image gradients with one shade behind the text: dark
   on the left, clear by about 45% of the width, plus a short bottom fade for
   the slide dots. Keep 4.5:1 text contrast; the accessibility test checks it.
5. Remove the 901-1100px `top: 45px` adjustment in `HeroSection.css` once the
   above passes.

**Stopgap if the wide crop is not ready.** Under `desk-short` with
`shape-ultrawide`, use a split layout like The Met: text on a solid dusk panel
in the left 38%, photo in the right 62%.

**Done when.** No R5 entries for `/` at any size in the baseline; R4 still
passes; the accessibility baseline is not worse; the owner has looked at
1024x768, 1280x650, 1366x657 and 1536x730.

### RR-02 Header fits at 1280 to 1359px

**Problem.** The full menu appears from 1280px (`xl`) but needs about 1,312px.
At 1280 the Donate button is cut off on every page (R2). This is what a
1920x1080 laptop at 150% scaling shows.

**Files.** `src/components/layout/Navigation.tsx` (`hidden xl:flex` links,
`xl:hidden` menu button and drawer), `src/components/layout/Navigation.css`,
`src/app/globals.css`, and `src/components/layout/TempleStatusBar.tsx` if it
uses `xl`.

**Approach.** Add one variant,
`@custom-variant nav-full (@media (min-width: 1360px));`, document it in the
rules' token list, and switch every `xl:` in the header and drawer to
`nav-full:`. Below 1360 the menu button shows. Do not squeeze link spacing:
the menu will grow, and the switch point must leave room.

**Done when.** No R2 entries at any size, the menu button shows at 1280 and
1366, and the full menu shows at 1440 and up.

### RR-03 Kirtan Safari headline below the header

**Problem.** At 1280x650 and 1366x657 the 112px headline starts 33px from the
top, under the 105px header (R3).

**Files.** `src/components/festivals/kirtan-safari/KirtanSafariHero.tsx`.

**Approach.** Reserve the header at the top of the hero:
`padding-top: calc(var(--site-solid-header-height) + 1.5rem)` as a minimum.
Size the headline by height as well as width, for example
`clamp(2.5rem, min(9vw, 13vh), 7rem)`. Under `max-ht-md`, clamp the
description to two lines so the buttons stay on screen.

**Done when.** No R3 or R4 entries for `/festivals/kirtan-safari` at any size.

## High

### RR-04 Compact header on short desktop screens

**Problem.** The resting header is 105px, 16% of a 657px laptop screen.

**Files.** `Navigation.tsx`, `Navigation.css`, the header height variables in
`globals.css` (`--site-header-height`, `--site-solid-header-height`,
`--site-chrome-height`).

**Approach.** Under `desk-short`, start in the compact style the header uses
after scrolling (logo 50x46, smaller padding). Update the height variables
in the same media query so the status bar and sub-navigation pin correctly.
Check there is no jump when scrolling starts.

**Done when.** The header is at most 72px at 1280x650, 1366x657 and 1536x730;
header plus status bar stays under 20% of the screen height; R3 passes.

**Depends on.** RR-02 (same files).

### RR-05 Page heroes sized by height too

**Problem.** `PageHero` sizes its headline and spacing by width only. Short
screens get the same 68px headline and 8 to 9rem top padding as tall ones,
and tall monitors get thin strips (max 580px on a 1300px screen).

**Files.** `src/components/ui/PageHero.tsx` and pages that pass their own
height classes (for example `/about` and `/projects`).

**Approach.**
1. Top padding: `calc(var(--site-solid-header-height) + 2rem)` instead of
   `pt-32 sm:pt-36`.
2. Headline: `clamp(2.25rem, min(9vw, 11vh), 4.25rem)`.
3. Under `max-ht-md`: description clamped to three lines; facts on one line.
4. Under `ht-xl`: raise the `md` and `lg` maximum heights so heroes keep their
   proportion on tall monitors.

**Done when.** R3 and R4 pass on every page that uses `PageHero` at every
size, and no page hero is shorter than 40% of the screen at desktop-qhd.

**Depends on.** RR-04 (uses the same height variables).

### RR-06 Festival heroes: buttons on the first screen

**Problem.** On 360 and 390px phones the Kartik hero's buttons start below the
first screen (R4). Janmashtami, Radhashtami and Gaura Purnima use similar
heroes and should be checked the same way.

**Files.** The hero components under `src/components/festivals/` and the
festival routes in `src/app/festivals/`.

**Approach.** Apply the RR-05 sizing rules. On phones, shorten the countdown
block or move it below the buttons.

**Done when.** No R3 or R4 entries for any festival page at any size.

### RR-08 Replace or reframe low-resolution photos

**Problem.** Photos shown full width from small files (R6):

| Photo | File width | Used on |
| --- | --- | --- |
| `blog/jharikhanda-mahaprabhu-animals.jpeg` | 735px | Blog hero, Jharikhanda story, Adhivasa story |
| `leadership/prabhupad-initiation.jpg` | 736px | Leadership hero |
| `impact-africa-desktop.jpeg` | 735px | Homepage "Our Impact" background |
| `calendar-kirtan-safari-bg.png` | 830px | Kirtan Safari hero, Festivals calendar |
| `prabhupada/prabhupada-nairobi-bus.jpeg` | 383px | Srila Prabhupada page |
| `thika-farm/farm-overview.webp`, `new-cow-and-calf.webp` | 1,280px | Thika Farm hero and cards |
| `prabhupada/prabhupada-golden-gate-kirtan.jpg` | 1,350px | Srila Prabhupada hero, homepage Guidance |

Some blur is not the photo's fault: a wrong `sizes` attribute makes the
browser download a version far smaller than it shows.

- The homepage "Guidance and Vision" photo of Srila Prabhupada
  (`LeadershipSection.tsx`) shows at 7.2 times its downloaded size on phones.
- The Ratha Yatra homepage slide has no phone crop, and `sizes="100vw"`
  ignores that a cover image on a tall phone is cropped from a much wider
  render. It shows at 3.4 times its downloaded size at 390x844.

Fix `sizes` to match the real rendered width, and give tall-screen images a
phone crop.

**Owner action.** Ask the temple for full-resolution originals, at least
2,400px wide for heroes. Record each source in `docs/ASSET_SOURCES.md`.

**Editor action until then.** Do not use any of these as a full-width hero.
Show them in framed images no wider than their file. Pick another existing
high-resolution photo for the Leadership and Blog heroes if the owner agrees.

**Done when.** No R6 entries remain in the baseline.

### RR-10 Subject boxes for every hero photo

**Problem.** Only the homepage slides declare their subjects, so R5 cannot
protect faces on other pages yet.

**Files.** Every page that passes a photo of people, Deities or Srila
Prabhupada to `PageHero`: Leadership, Srila Prabhupada, About, Donate,
Learn, Serve, Media, the festival pages, HKTC Nairobi, HKTC Juja, Food For
Life, Thika Farm and Visit.

**Approach.** For each photo, mark the faces as fractions of the image (draw
a 10% grid over it to read them), pass them as `imageSubject`, and run
`npm run test:screens`. Fix any new R5 failures in the same change by moving
the crop (`imageClassName` with `object-position`) or the text. One page per
commit keeps reviews simple.

**Done when.** Every hero photo with a subject declares it, and R5 is clean.

**Depends on.** RR-01 (to settle the approach on the hardest image first).

### RR-15 Seasonal slide checklist

**Problem.** Seasonal homepage slides (Kartik, Gita Jayanti, future festivals)
appear on a date, often when nobody is watching. A new slide without subject
boxes or a phone crop can break the hero on launch day.

**Approach.** Add a "New seasonal slide" checklist to `docs/CONTENT_GUIDE.md`:
desktop and mobile crops at the R6 sizes, `subject` and `mobileSubject`,
`npm run test:screens` with a clock-shifted build that shows the slide, and a
visual check at 390x844 and 1366x657.

**Done when.** The checklist exists and is linked from the rules.

## Medium

### RR-07 WhatsApp button clear of content

**Problem.** The floating button covers the hero's Scroll cue on tablets and
laptops, and the last line of body text on 360px phones (R9).

**Files.** `src/components/ui/WhatsAppWidget.tsx`, the Scroll cue in
`HeroSection.tsx`, `src/components/layout/Footer.tsx`.

**Reopened on 26 November 2026.** The first version moved the Scroll cue and
added footer padding at every width, so 1920px desktops changed although the
button never overlapped there. It was rolled back. See
`docs/RENDERING_INCIDENT_2026-11-26.md`.

**Measured.** The guard found the button over the Scroll cue from 1024 to
1366px wide and over first-screen text on phones and the About page. From
1440px up it sits in the empty margin and covers nothing. At the end of the
page it reaches the last footer line only below 1440px.

**Approach.** Change only below 1440px (RG-3), for example with a
`max-[1439.98px]:` variant: move the Scroll cue left of the button and add
footer bottom padding there only. At 1440px and wider the page must look
exactly as it does today. Showing the button only after the visitor scrolls is
a design change: ask the owner before building it (RG-6).

**Done when.** No R9 entries at any size, and `npm run test:visual:compare`
shows no difference at `desktop` (1440x900) or `owner-desktop` (1920x1030).

### RR-09 Tap targets of at least 24px

**Problem.** Footer phone, email, Privacy and Terms links are 16 to 21px tall
on every page, and several small text links ("Visit this work", "View the full
calendar", "Explore all projects", "Full daily schedule") are under 24px (R8).

**Files.** `Footer.tsx`, `ProjectsSection.tsx`, `FestivalCalendarSection.tsx`,
the Privacy page's table of contents, and any other link the guard lists.

**Approach.** Use the existing `.tap-target` class, or vertical padding, so
each target is at least 24px tall and ideally 44px. Keep the visual size of
the text unchanged.

**Done when.** No R8 entries at touch sizes.

### RR-11 Shared art-directed image component

**Problem.** The homepage and page heroes each handle crops their own way.
New pages copy whichever they find.

**Approach.** One `ArtDirectedImage` component in `src/components/ui/`
taking `tall`, `wide` and `ultrawide` sources, each with its subject boxes,
rendering `<picture>` sources keyed by shape. Move `HeroSection` and
`PageHero` onto it.

**Done when.** Both heroes use it, the guard is unchanged or better, and the
rules' Images section names it as the way to add a hero photo.

**Depends on.** RR-01, RR-10.

### RR-13 Safari (WebKit) in the screen guard

**Problem.** Every check runs in Chromium. iPhones and Macs use Safari, which
handles `svh`, backdrop blur and some image features differently.

**Approach.** Add a `webkit` Playwright project that runs `screens.spec.ts` at
the ci sizes, and keep a separate baseline key per browser.

**Done when.** The guard runs in WebKit in CI, and any Safari-only problems
are either fixed or recorded with a repair task.

### RR-14 Screenshot comparisons at laptop sizes

**Problem.** The screenshot comparisons (`npm run test:visual`) cover 375,
768, 812x375 and 1440x900, which misses the laptop range.

**Approach.** Add a 1366x657 project to the visual tests for the homepage,
one page hero, one festival page and the Donate page.

**Done when.** Visual comparisons include 1366x657.

## Low

### RR-12 Large and ultra-wide monitors

**Problem.** At 2560 and 3440px the content column stays 1,280px wide and page
heroes stop at 580px tall, so pages read as a narrow strip.

**Approach.** Consider a 1,440px content width from `2xl` and taller page
heroes under `ht-xl`. This touches every page, so the owner approves it from
screenshots first.

**Done when.** The owner has approved the look at desktop-qhd and ultrawide,
and the guard shows no new problems.

### RR-16 Cards that size to their column

**Problem.** Cards adapt only to the screen width, so the same card can be
cramped in a three-column grid and loose in a sidebar.

**Approach.** Container queries (`@container`) on the main card families:
projects, festivals, Serve options and blog cards.

**Done when.** The card families use container queries and the guard is
unchanged or better.

### RR-17 Hero words match the photo during slide changes

**Problem.** When the homepage slideshow changes, the words switch at once but
the photos cross-fade for 2 seconds. Measured on the live site at 1903x1032:
the Gita Jayanti words appeared while the photo was still 100% the Deities,
and stayed over a mostly-Deities photo for about a second and a half. The
screen guard waits for each slide to finish, so it cannot see this.

**Files.** `src/components/sections/HeroSection.tsx`,
`tests/e2e/screens.spec.ts`.

**Approach.**
1. First, in its own commit (RG-5, RG-7): a check that samples the hero every
   200ms during a slide change and fails when the words on screen belong to a
   different slide from the photo that is more than 50% visible.
2. Then the fix: fade the words out with the old photo and in with the new
   one, so they switch at the midpoint of the cross-fade. Keep the reduced
   motion behaviour. This changes how the hero animates, so show the owner a
   recording or screenshots first (RG-6).

**Done when.** The transition check passes on every slide change at every ci
size.

### RR-18 Hero photo reloads before a slide change

**Problem.** In the same measurement, about 7.5 seconds after loading, the
Deities photo that was on screen briefly reported no image and loaded again,
at the moment the next slide was being prepared. On a slow connection this
could show as a flicker.

**Files.** `src/components/sections/HeroSection.tsx` (`HeroPicture`,
`readySlides`).

**Approach.** Confirm it first (RG-4): record network requests and the
visible photo across the first two slide changes, on a throttled connection.
If the photo really reloads, keep each slide's `<picture>` element stable
when the next slide is prepared.

**Done when.** The current photo never reloads while it is on screen.

## Working method for every task

1. Start from the latest `origin/main` on a branch named
   `rendering/rr-XX-short-name`, in your own worktree. The main folder is
   shared with other editors: check the branch and `git status` before every
   commit.
2. Read `docs/RENDERING_RULES.md`, including the release gates RG-1 to RG-8 in
   section 7, and the task above. Set the task's status to In progress in the
   table. The gates were adopted after Release A changed screens that were
   never broken (`docs/RENDERING_INCIDENT_2026-11-26.md`).
3. Measure first (RG-4): list the baseline entries the task will remove, using
   `SCREENS_VERBOSE=1`. If the guard cannot see the problem, add a check in a
   commit of its own first (RG-5).
4. If the task would change how the site looks or behaves beyond removing the
   measured problem, show the owner screenshots and wait for approval (RG-6).
5. Make the change, scoped to the screen sizes where the problem was measured
   (RG-3). Use the shared variants (`desk-short`, `max-ht-md` and so on)
   rather than new pixel values.
6. Run `npm run build`, `npm run test:e2e` and `npm run test:screens`.
7. Run `npm run test:screens:update` and read the diff of
   `tests/e2e/screens-baseline.json`. It may only remove entries or lower
   counts. If anything went up, fix the page instead.
8. Run `npm run test:visual:compare` and account for every difference (RG-1).
   Remove anything this task did not set out to change.
9. Look at the changed pages at 360x740, 1366x657 and 1920x1030 at least.
10. Update the status table: status, branch, date, the baseline entries
    removed and a one-line note.
11. Commit your own changes on your branch, naming the baseline entries removed
    in the commit message. Rendering work reaches `main` only through the pull
    request path in `docs/RELEASE_WORKFLOW.md` (RG-2), and all stages ship
    together (RG-8). Never push to `main` or deploy unless the owner explicitly
    says to push, deploy or go live.
