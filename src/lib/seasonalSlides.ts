/** A slide that may be seasonal: shown from `showFrom` until the end of `showUntil` (ISO, Nairobi offset). */
export type Seasonal = { showFrom?: string; showUntil?: string };

/** The slides in season at `now`. Undated slides always show. */
export function slidesInSeason<T extends Seasonal>(slides: T[], now: number): T[] {
  return slides.filter(
    (slide) =>
      (!slide.showFrom || Date.parse(slide.showFrom) <= now) &&
      (!slide.showUntil || now <= Date.parse(slide.showUntil))
  );
}
