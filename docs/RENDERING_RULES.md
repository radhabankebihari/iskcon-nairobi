# Rendering Rules

The website must look right on every screen it is opened on: a 320px phone, a
phone held sideways, a 1366x657 laptop, a 3440px ultra-wide monitor. These rules
say how, and the screen guard (`tests/e2e/screens.spec.ts`) enforces them.

They apply to every contributor: people, Claude, Codex and any other editor.
Read this file before changing a layout, a hero, the header, a floating
element, or any image that is shown large.

Background: the November 2026 screen audit found the site was designed by
screen *width* only. Short, wide laptop screens (the most common laptops) got
layouts meant for tall monitors, so hero text covered Krishna's face, the header
ran off the screen at 1280px, and one headline slid under the logo. These rules
exist so that never happens again. The repair work is listed in
`docs/RENDERING_REPAIRS.md`.

## 1. The screens we support

`tests/e2e/screens.ts` is the single list. Sizes are the visible browser area,
not the device resolution.

| Name | Size | Why | Tier |
| --- | --- | --- | --- |
| reflow-320 | 320 x 568 | Smallest phones; 1280px at 400% zoom | full |
| phone-360 | 360 x 740 | Most common Android width | ci |
| phone-390 | 390 x 844 | iPhone 13 to 16 | full |
| phone-430 | 430 x 932 | Large phones | full |
| phone-landscape | 844 x 390 | Phone held sideways: shortest screen | ci |
| tablet-768 | 768 x 1024 | iPad portrait | full |
| tablet-landscape | 1024 x 768 | iPad landscape, small laptops | ci |
| tablet-pro | 1024 x 1366 | Large tablet portrait: very tall | full |
| tablet-air-landscape | 1180 x 820 | iPad Air landscape | full |
| laptop-150 | 1280 x 650 | 1920x1080 laptop at 150% scaling | ci |
| laptop-1280x800 | 1280 x 800 | Older 13-inch laptops | full |
| laptop-1366 | 1366 x 657 | Most common laptop | ci |
| macbook-air | 1440 x 760 | MacBook Air 13-inch | full |
| laptop-125 | 1536 x 730 | 1920x1080 laptop at 125% scaling | ci |
| desktop-fhd | 1920 x 960 | Full HD monitor | ci |
| desktop-qhd | 2560 x 1300 | Large monitor | full |
| ultrawide | 3440 x 1340 | Ultra-wide monitor | full |

"ci" sizes run with every `npm run test:e2e` and in GitHub CI. "full" sizes run
with `npm run test:screens`. Add a size to the list rather than testing a new
device by hand; never remove one.

## 2. Breakpoint tokens

Use only these thresholds. They are defined once in `src/app/globals.css`. Do
not invent new pixel values for a single fix.

**Width** (Tailwind defaults plus the existing 900px menu switch):
`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536, and `max-[900px]` for
the phone/desktop menu and hero-image switch.

**Height** (visible browser height):

| Band | Range | Typical screens | Variant (min / max) |
| --- | --- | --- | --- |
| xs | under 520 | phones sideways | `max-ht-sm:` |
| sm | 520 to 699 | 1280x650, 1366x657 | `ht-sm:` / `max-ht-md:` |
| md | 700 to 859 | 1440x760, 1536x730, 1280x800 | `ht-md:` / `max-ht-lg:` |
| lg | 860 to 1079 | desktop monitors | `ht-lg:` / `max-ht-xl:` |
| xl | 1080 and up | large monitors, portrait tablets | `ht-xl:` |

**Shape** (width divided by height):
`shape-tall:` 4:5 or taller (phones, portrait tablets), `shape-wide:` 4:3 or
wider, `shape-ultrawide:` 17:9 or wider (most laptop browsers, about 2:1).

**Trouble zone:** `desk-short:` is a desktop width (1024 or more) that is
under 800px tall. Most of the 2026 audit's failures happened here. Every
full-screen layout must state its `desk-short` behaviour.

In plain CSS files (for example `HeroSection.css`), repeat these exact numbers,
such as `@media (min-width: 1024px) and (max-height: 799.98px)`.

## 3. The rules

Each rule has an ID. The screen guard reports problems by these IDs.

### R1. Nothing reaches past the sides of the screen
No visible element may extend past the left or right edge. The page sets
`overflow-x: clip`, which hides overflow instead of preventing it, so a
sideways scroll test alone proves nothing. Off-screen panels such as the
closed menu must be `inert` while closed.

### R2. The header always fits
Every header item (logo, links, bell, Donate, menu button) stays fully on
screen at every width. When the full menu does not fit, show the menu button
instead. Never shrink links below the 44px tap height to make room.

### R3. Headlines start below the header
A page's main headline (`h1`) must start below the fixed header at every size.
Hero content reserves the header's height (`--site-solid-header-height`) plus
a gap at the top. Never centre hero content vertically without that
reservation: tall content then grows upward under the header.

### R4. The main action is on the first screen
When a hero has buttons, the first one is fully visible without scrolling at
every supported size. On short screens, reduce the hero's text and spacing
first. Never let the buttons fall off the screen.

### R5. Text never covers the subject
Photos of Deities, Srila Prabhupada, people or a featured object must declare
where the subject sits:

- Homepage slides: `subject` and `mobileSubject` in `HeroSection.tsx`.
- Page heroes: the `imageSubject` prop on `PageHero`.
- Anything else: a `data-subject` attribute on the `<img>`.

Each is a list of boxes, `"left top right bottom"` as fractions of the image,
for example `"0.27 0.38 0.395 0.61"`. Mark faces, not whole bodies. Then:

- Text, buttons and links may cover at most 5% of any subject box.
- The crop may cut off at most 10% of any subject box.
- Deity images protect the top of the frame first (crown and face).

When text and subject collide, move the crop or the text. Do not add more
darkening on top of the Deities.

### R6. Photos are sharp
An image may not be shown more than 1.15 times larger than its pixels. Images
shown full width need a source at least 2,400px wide, or 2x the largest width
they are shown at. Phone-only crops need at least 1,080px. If only a small
original exists, use the photo in a smaller frame, not as a hero.

### R7. Text is at least 12px
At every size, with no exceptions for captions or labels.

### R8. Touch targets are at least 24px, ideally 44px
On touch screens, every link and button is at least 24 by 24px. Primary
controls and navigation are 44px tall (use `.tap-target` for small text
links). Links inside running paragraphs are exempt.

### R9. Floating elements do not cover content
The WhatsApp button, install banner and any future floating element must not
sit on top of text, buttons or links on the first screen or at the end of the
page. Give the content room (padding) or move the floating element.

### R10. Text is never clipped
No text may be cut off by its box. Shorten the copy, let it wrap, or use a
deliberate line clamp with an ellipsis.

## 4. Height behaviour for every full-screen layout

Every layout that is sized to the screen (`h-screen`, `svh`, `vh`) must
define what happens in each height band and shape. This is the part that
width-only design misses. Changing one of these layouts means checking every
row of its table.

### Header

| Band | Behaviour |
| --- | --- |
| xs | Compact header, 51px; status bar hidden until scroll |
| sm, md (desktop width) | Compact header from the start (target 64 to 72px); full menu only where it fits (R2) |
| lg, xl | Full header (105px) at the top of the page, compact on scroll |

### Homepage hero

| Band / shape | Behaviour |
| --- | --- |
| phones (`shape-tall`) | Portrait crop; subject in the top half; text block below it |
| xs (sideways phones) | Fills the screen; one-line tagline; buttons in a row; small eyebrow |
| sm, md with `shape-ultrawide` | Wide crop with the subject in the right 60%; text in the left 40%, at most 36rem wide; no text over faces |
| `shape-wide` (tablets landscape) | Subject right of centre; text block narrower than the free space |
| lg | Full design; subject clear of text |
| xl | Hero height capped at 1000px; image may show more top and bottom, never a tighter crop |

### Page heroes (`PageHero`)

| Band | Behaviour |
| --- | --- |
| xs | Height follows content; headline size capped by height |
| sm | Headline at most `min(9vw, 11vh)`; description at most 3 lines; facts on one line or hidden |
| md | Current design with top clearance under the header |
| lg, xl | Current design; height may grow up to the `lg` maximum, never a thin strip on tall monitors |

### Festival heroes (Kirtan Safari, Kartik and future festivals)

Same as page heroes, plus: headline size is capped by height as well as width,
and countdowns or dates stay on the first screen (R4).

### Menu, dialogs and full-screen panels

The open phone menu, notice board and any dialog must scroll inside
themselves when the screen is short (xs, sm). Their close button is always
on screen.

### Sticky bars (status bar, page sub-navigation)

The combined height of the header, status bar and any sub-navigation must stay
under 20% of the screen height in every band. Below that, hide the less
important bar until the visitor scrolls up.

## 5. Images

- Every hero image needs a subject declaration (R5) and a source that meets R6.
- Art direction: when a photo will be shown at very different shapes, supply
  separate crops (tall, wide, ultrawide) through `<picture>` sources keyed by
  shape, not just width. The homepage already does this for phones.
- Shade text locally (a gradient behind the text block), not the whole image.
  Text over a photo still needs 4.5:1 contrast; the accessibility test checks
  it.
- Record any new external image in `docs/ASSET_SOURCES.md`.

## 6. Before you merge a layout change

1. `npm run build`
2. `npm run test:e2e`, which includes the screen guard at the ci sizes.
3. `npm run test:screens` for the full list of sizes when you changed a hero,
   the header, a full-screen layout, a floating element or global spacing.
4. Look at the changed page yourself at 360 x 740, 1366 x 657 and
   1920 x 960 at least.
5. If you fixed something, run `npm run test:screens:update` and check that
   the diff of `tests/e2e/screens-baseline.json` only removes entries or
   lowers counts. Never raise a count to make a test pass; fix the page.

To see what a count in the baseline stands for, run the guard with
`SCREENS_VERBOSE=1` and a filter, for example
`SCREENS_VERBOSE=1 npx playwright test screens --project=desktop --grep "laptop-1366 .* / fits"`.
It prints every problem by rule. On Windows PowerShell, set the variable first
with `$env:SCREENS_VERBOSE=1`.

The guard is deliberately stricter than the minimum accessibility standard in
one place: R8 counts every target under 24px, without the standard's spacing
exception, because the design system aims for 44px.

## 7. Changing these rules

Add rules; do not loosen them. If a rule seems wrong for a page, raise it with
the owner first and record the decision here with the date. When you add a
rule, add its check to `tests/e2e/screens.spec.ts` in the same change.
