import type { Seasonal } from "@/lib/seasonalSlides";

/**
 * Gita Jayanti 2026, from the temple's official poster. The Learn page shows
 * this programme until the day ends; the homepage slide and festival card
 * link to it. Sponsorship details stay on the Learn page all year.
 */
export const gitaJayanti2026 = {
  date: "Sunday 20 December 2026",
  shortDate: "Sunday 20 December",
  isoDate: "2026-12-20",
  startTime: "10:30 AM",
  programme: "Complete recitation of the Bhagavad-gita, followed by prasadam",
  poster: "/images/gita-jayanti/gita-jayanti-2026-poster.webp",
  season: { showUntil: "2026-12-20T23:59:59+03:00" } satisfies Seasonal,
};

/** Bhagavad-gita sponsorship, as printed on the official poster. Confirm with the temple before changing. */
export const gitaSponsorship = {
  pricePerCopy: "KSh 500",
  mpesaPaybill: "4081881",
  mpesaAccount: "BBT",
};
