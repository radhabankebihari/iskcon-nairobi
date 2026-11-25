## Purpose

Describe what changed and why.

## Promotion

- [ ] Feature branch to `development`
- [ ] `development` to `staging`
- [ ] `staging` to `release`
- [ ] `release` to `main`

## Automated checks

- [ ] `npm run check:release` passes
- [ ] No unexpected console errors or failed network requests
- [ ] No secrets, local files, generated artifacts, or temporary screenshots are included

## Functional review

- [ ] Every changed link, button, menu, modal, form, and external destination works
- [ ] Loading, empty, success, validation, error, offline, and slow-network states were checked where relevant
- [ ] Forms were verified through the receiving service without leaving unwanted test records
- [ ] PWA install, cached navigation, update behavior, and notification deep links remain intact where affected

## Visual review

See `docs/RENDERING_RULES.md`. Sizes are the visible browser area.

- [ ] `npm run test:e2e` passes (includes the screen guard at the ci sizes)
- [ ] `npm run test:screens` passes if a hero, the header, a full-screen layout, a floating element, or global spacing changed
- [ ] `tests/e2e/screens-baseline.json` only lost entries or lowered counts
- [ ] Phones: 360x740 and 390x844, plus 844x390 held sideways
- [ ] Tablet: 768x1024 and 1024x768
- [ ] Short laptops: 1280x650 and 1366x657
- [ ] Desktop: 1920x960
- [ ] Text does not overlap, clip, overflow, or sit beneath fixed navigation
- [ ] New hero photos declare their subject boxes, and text stays off faces
- [ ] Images preserve important subjects and load without layout shift
- [ ] Keyboard navigation, focus states, headings, labels, contrast, and alternative text were checked

## Release review

- [ ] Copy, dates, contact details, images, metadata, canonical URL, and social preview are correct
- [ ] The Vercel preview matches the intended release
- [ ] The exact commit approved here is the commit being promoted
- [ ] A rollback target is known before merging to `main`

## Evidence

Add preview links, screenshots, test notes, and any known limitations.

