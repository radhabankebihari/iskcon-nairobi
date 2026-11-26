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

- [ ] Mobile: 360px and 390px widths
- [ ] Tablet: 768px width
- [ ] Desktop: 1280px and 1440px widths
- [ ] Text does not overlap, clip, overflow, or sit beneath fixed navigation
- [ ] Images preserve important subjects and load without layout shift
- [ ] Keyboard navigation, focus states, headings, labels, contrast, and alternative text were checked

## Release review

- [ ] Copy, dates, contact details, images, metadata, canonical URL, and social preview are correct
- [ ] The Vercel preview matches the intended release
- [ ] The exact commit approved here is the commit being promoted
- [ ] A rollback target is known before merging to `main`

## Evidence

Add preview links, screenshots, test notes, and any known limitations.

