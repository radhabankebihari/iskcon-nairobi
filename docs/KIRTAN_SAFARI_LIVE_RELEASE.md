# Kirtan Safari 2026 Live Release Standard

This document is the implementation contract for the Kirtan Safari live-event
release. Festival work belongs on `codex/kirtan-safari` until it has passed the
checks in this document and is deliberately merged into `main`.

## Non-negotiable rules

1. Use `Africa/Nairobi` event boundaries expressed as ISO timestamps with the
   `+03:00` offset. Never infer festival state from a visitor's calendar date.
2. Keep one authoritative festival configuration. Components may render state;
   they may not invent separate dates, labels, stream links, or programme data.
3. Automatic switching is the default. A typed manual override must remain
   available for delays, extensions, testing, and operational emergencies.
4. Never claim that a stream or programme item is live without confirmed data.
5. Registration remains enabled throughout the event and becomes a future-interest
   action only after conclusion.
6. Preserve the current visual language before and during the event. The archive
   state becomes neutral and documentary without rewriting historical content.
7. Every timed client view must recover after sleep, focus, visibility changes,
   reconnection, and direct navigation after a boundary has passed.
8. Avoid layout shifts. Countdown, live, between-days, and concluded panels must
   occupy stable responsive containers.
9. Mobile is the primary test surface. Also verify mobile landscape, tablet,
   desktop, keyboard navigation, reduced motion, weak network, and offline fallback.
10. No test control, simulated clock, unpublished URL, or test notification may
    affect production visitors.
11. Do not broadcast push notifications while developing. Only the four approved
    daily messages may be sent, after explicit operational confirmation.
12. Do not modify unrelated dirty files or silently deploy this branch to production.

## Release checklist

Each item is complete only when its implementation and checks are both recorded.

- [x] 01. Central typed festival configuration
- [x] 02. Automatic phase selection
- [x] 03. Manual phase override
- [x] 04. Pre-event homepage hero
- [x] 05. Pre-event homepage festival section
- [x] 06. Pre-event Kirtan Safari page
- [x] 07. Registration before and during the festival
- [x] 08. Exact Nairobi-time start trigger
- [x] 09. Recovery from sleeping or backgrounded tabs
- [x] 10. Stable countdown-to-live replacement
- [x] 11. Live CTA changes
- [x] 12. Secondary status-bar changes
- [x] 13. Live Festival Status panel
- [x] 14. Timestamped programme data
- [x] 15. Honest provisional-programme fallback
- [x] 16. Current-day navigation
- [x] 17. Lazy YouTube livestream embed
- [x] 18. Stream lifecycle states
- [x] 19. Social links beside the live panel
- [x] 20. Google Maps directions action
- [x] 21. Practical visitor information
- [x] 22. Guest-kirtaniya placement after live content
- [x] 23. Homepage live-event presentation
- [x] 24. Daily concluded state
- [x] 25. Between-days state
- [x] 26. Exactly four approved festival notifications
- [x] 27. Final event transition
- [x] 28. Remove current-event promotion from the homepage after conclusion
- [x] 29. Retain Kirtan Safari as a recurring festival elsewhere
- [x] 30. Neutral archive design
- [x] 31. Archive hero and gratitude
- [x] 32. Archive actions
- [x] 33. 2027 update-interest form and dedicated sheet destination
- [x] 34. Complete archive content structure
- [x] 35. Annual-edition structure
- [x] 36. Shared state-calculation function
- [x] 37. Resilient client switching
- [x] 38. Consistent server-rendered initial state
- [x] 39. Offline and weak-network behavior
- [x] 40. Development-only clock simulation
- [x] 41. Boundary and state test matrix
- [x] 42. Documented operational inputs
- [x] 43. Homepage hero-slide lifecycle across all four days and archive state

## Required verification evidence

- Unit tests for phase, day, programme, overnight, and final-transition logic.
- Production build and lint results.
- Screenshots at 390x844, 844x390, 768x1024, 1024x768, and 1440x900.
- Browser checks immediately before and after every major time boundary.
- Keyboard, focus, accessible-name, contrast, and reduced-motion checks.
- Livestream checks for unconfigured, scheduled, live, unavailable, and ended states.
- Registration checks before, during, and after the event.
- Online, offline, reconnection, and stale-tab recovery checks.
- A final diff confirming unrelated files were not included in festival commits.

## Operational inputs

The release must remain safe when these are absent:

- Scheduled YouTube video ID
- Refined guest-performer timetable
- Confirmed daily closing times
- Final gallery URL
- Recording or playlist URL
- 2027 campaign dates

Missing inputs must produce truthful fallback content, never empty panels or
fabricated programme claims.

## Event controls

All live-event controls are in `src/data/kirtanSafari.ts`.

- `phaseOverride`: keep `automatic` in normal operation. Use `countdown`, `live`,
  `between-days`, or `concluded` only for a documented operational exception.
- `livestream.enabled`: keep `false` unless organizers confirm a stable official
  broadcast. The complete player remains available in the codebase.
- `livestream.videoId`: paste only the YouTube video ID, not the full URL.
- `livestream.status`: use `scheduled`, `live`, `offline`, or `ended`. The page
  never presents the player as live unless this value is `live`.
- `links.gallery` and `links.recordings`: remain `null` until the URLs are public.
- `days[].programme`: edit confirmed times here; retain explicit `+03:00` offsets.
  A start-only listing must not receive an estimated `endsAt`. Use `timeLabel`
  for wording such as `From 6:00 PM onwards` or `Follows the programme`.

The day-level midnight boundaries are technical calendar transitions in Nairobi
time. They are not public claims that the programme closes at midnight.

After changing an operational input, run:

```powershell
npm run test:festival
npm run build
```

## Safe clock simulation

Clock simulation works in development only and is intentionally ignored by
production. Start the local server, then test these representative states:

```text
/festivals/kirtan-safari?festivalTime=2026-08-27T17:59:59%2B03:00
/festivals/kirtan-safari?festivalTime=2026-08-27T18:00:01%2B03:00
/festivals/kirtan-safari?festivalTime=2026-08-28T19:45:00%2B03:00
/festivals/kirtan-safari?festivalTime=2026-08-28T23:00:00%2B03:00
/festivals/kirtan-safari?festivalTime=2026-08-31T00:00:01%2B03:00
```

The homepage accepts the same development-only query. Verify that its festival
section disappears after conclusion while the hero becomes a quieter archive
slide titled `Four Days, One Holy Name` until a future major festival replaces it.

## Notification safety

The four approved messages live in `src/data/kirtanSafariNotifications.ts`.
Nothing schedules or sends them automatically. For each day, copy its title,
body, URL, and tag into the existing push command, run `--dry-run`, review the
subscriber count, then replace `--dry-run` with `--confirm` only after explicit
approval. Never create a fifth festival broadcast without a new content approval.

## Merge and release gate

1. Complete `docs/KIRTAN_SAFARI_EVALUATION.md` locally or on a preview deployment.
2. Confirm the programme, contact number, and directions. Confirm a stream ID,
   status, and `livestream.enabled: true` only while an official broadcast exists.
3. Confirm the Apps Script backend can create and write the future-interest tab.
4. Review the branch diff and exclude unrelated workspace changes.
5. Merge `codex/kirtan-safari` into `main` only after visual approval.
6. Deploy the merged `main`; do not promote this development branch directly.
