export type FestivalPhaseOverride =
  | "automatic"
  | "countdown"
  | "live"
  | "between-days"
  | "concluded";

export type StreamStatus = "scheduled" | "live" | "offline" | "ended";

export type FestivalProgrammeItem = {
  id: string;
  title: string;
  startsAt?: string;
  endsAt?: string;
  timeLabel?: string;
  detail?: string;
  priority?: number;
};

export type FestivalDay = {
  id: string;
  label: string;
  shortLabel: string;
  dateLabel: string;
  startsAt: string;
  endsAt: string;
  theme: string;
  programme: FestivalProgrammeItem[];
  fallbackNow: string;
  fallbackNext?: string;
};

const youtubeChannelUrl = "https://www.youtube.com/@kirtan_safari";

export const kirtanSafariGuestKirtaniyas = [
  { name: "Sandip Pattni", image: "/images/festivals/guest-kirtaniyas/sandip-pattni.jpg" },
  {
    name: "H.G. Gourangi Gandharvika Devi Dasi",
    image: "/images/festivals/guest-kirtaniyas/hg-gourangi-gandharvika-devi-dasi.jpg",
  },
  { name: "H.G. Madhurika Dasi", image: "/images/festivals/guest-kirtaniyas/hg-madhurika-dasi.jpg" },
  { name: "H.G. Sharad Bihari Das", image: "/images/festivals/guest-kirtaniyas/hg-sharad-bihari-das.jpg" },
  { name: "H.G. Smita Krishna Das", image: "/images/festivals/guest-kirtaniyas/hg-smita-krishna-das.jpg" },
  { name: "H.G. Gaura Kirtan Das", image: "/images/festivals/guest-kirtaniyas/hg-gaura-kirtan-das.jpg" },
  { name: "H.G. Giriraj Das", image: "/images/festivals/guest-kirtaniyas/hg-giriraj-das.jpg" },
  { name: "H.G. Kamika Ekadashi Das", image: "/images/festivals/guest-kirtaniyas/hg-kamika-ekadashi-das.jpg" },
] as const;

export const kirtanSafariConfig = {
  id: "kirtan-safari-2026",
  name: "Kirtan Safari 2026",
  recurringName: "Kirtan Safari at ISKCON Nairobi",
  timezone: "Africa/Nairobi",
  startsAt: "2026-08-27T18:00:00+03:00",
  // The archive begins after the final festival calendar day. This is an
  // application boundary, not a published claim about Sunday's closing time.
  endsAt: "2026-08-31T00:00:00+03:00",
  phaseOverride: "automatic" as FestivalPhaseOverride,
  registrationEnabledDuringEvent: true,
  livestream: {
    enabled: false,
    videoId: null as string | null,
    status: "scheduled" as StreamStatus,
    channelUrl: youtubeChannelUrl,
  },
  links: {
    directions:
      "https://www.google.com/maps/search/?api=1&query=ISKCON%20Nairobi%20Hare%20Krishna%20Close%20Nairobi%20Kenya",
    instagram: "https://www.instagram.com/kirtansafari",
    youtube: youtubeChannelUrl,
    tiktok: "https://www.tiktok.com/@kirtan.safari",
    gallery: null as string | null,
    recordings: null as string | null,
    adhivasStory: "/blog/sri-nama-sankirtana-adhivasa",
    jharikhandaStory: "/blog/jharikhanda-forest-kirtan-safari",
  },
  practicalInformation: [
    { label: "Entry", value: "Free entry throughout the festival" },
    { label: "Prasadam", value: "Served according to the daily programme" },
    {
      label: "Photography",
      value: "Public festival photography and recording may take place",
    },
    {
      label: "Lost property",
      value: "Please report missing belongings to the temple office",
    },
    { label: "Contact", value: "+254 753 419 194", href: "tel:+254753419194" },
  ],
  days: [
    {
      id: "adhivas",
      label: "Thursday 27 August",
      shortLabel: "Thu 27",
      dateLabel: "27 August 2026",
      startsAt: "2026-08-27T18:00:00+03:00",
      endsAt: "2026-08-28T00:00:00+03:00",
      theme: "Adivas",
      fallbackNow: "Adivas begins from 6:00 PM onwards",
      fallbackNext: "Prasadam will be served after Adivas",
      programme: [
        {
          id: "adhivas-kirtan",
          title: "Adivas Kirtan",
          startsAt: "2026-08-27T18:00:00+03:00",
          timeLabel: "From 6:00 PM onwards",
          detail: "Welcoming the festival mood together",
        },
        {
          id: "adhivas-prasadam",
          title: "Prasadam",
          timeLabel: "After Adivas",
          detail: "Served after the Adivas programme",
        },
      ],
    },
    {
      id: "day-two",
      label: "Friday 28 August",
      shortLabel: "Fri 28",
      dateLabel: "28 August 2026",
      startsAt: "2026-08-28T10:00:00+03:00",
      endsAt: "2026-08-29T00:00:00+03:00",
      theme: "Balarama Purnima",
      fallbackNow: "The Friday festival programme is underway",
      programme: [
        {
          id: "friday-kirtan",
          title: "Balarama Purnima Kirtan",
          startsAt: "2026-08-28T10:00:00+03:00",
        },
        {
          id: "friday-prasadam-lunch",
          title: "Prasadam",
          startsAt: "2026-08-28T13:00:00+03:00",
        },
        {
          id: "friday-abhishek",
          title: "Abhishek and Talk",
          startsAt: "2026-08-28T18:00:00+03:00",
        },
        {
          id: "friday-evening-kirtan",
          title: "Evening Kirtan",
          startsAt: "2026-08-28T19:30:00+03:00",
        },
        {
          id: "friday-prasadam-evening",
          title: "Prasadam",
          startsAt: "2026-08-28T21:00:00+03:00",
        },
      ],
    },
    {
      id: "day-three",
      label: "Saturday 29 August",
      shortLabel: "Sat 29",
      dateLabel: "29 August 2026",
      startsAt: "2026-08-29T10:00:00+03:00",
      endsAt: "2026-08-30T00:00:00+03:00",
      theme: "Kirtan and Harinam",
      fallbackNow: "The Saturday festival programme is underway",
      programme: [
        {
          id: "saturday-kirtan",
          title: "Kirtan",
          startsAt: "2026-08-29T10:00:00+03:00",
        },
        {
          id: "saturday-prasadam-lunch",
          title: "Prasadam",
          startsAt: "2026-08-29T13:00:00+03:00",
        },
        {
          id: "saturday-harinam",
          title: "Special Harinam",
          startsAt: "2026-08-29T14:30:00+03:00",
        },
        {
          id: "saturday-evening-kirtan",
          title: "Evening Kirtan",
          startsAt: "2026-08-29T17:00:00+03:00",
        },
        {
          id: "saturday-prasadam-evening",
          title: "Prasadam",
          startsAt: "2026-08-29T21:00:00+03:00",
        },
      ],
    },
    {
      id: "final-day",
      label: "Sunday 30 August",
      shortLabel: "Sun 30",
      dateLabel: "30 August 2026",
      startsAt: "2026-08-30T10:00:00+03:00",
      endsAt: "2026-08-31T00:00:00+03:00",
      theme: "Continuous Kirtan",
      fallbackNow: "Continuous kirtan is underway",
      programme: [
        {
          id: "sunday-continuous-kirtan",
          title: "Continuous Kirtan",
          startsAt: "2026-08-30T10:00:00+03:00",
          endsAt: "2026-08-30T21:00:00+03:00",
          priority: 1,
        },
        {
          id: "sunday-prasadam-lunch",
          title: "Prasadam",
          startsAt: "2026-08-30T13:00:00+03:00",
          priority: 2,
        },
        {
          id: "sunday-prasadam-evening",
          title: "Prasadam",
          startsAt: "2026-08-30T21:00:00+03:00",
          priority: 2,
        },
      ],
    },
  ] satisfies FestivalDay[],
  archive: {
    eyebrow: "Kirtan Safari at ISKCON Nairobi",
    title: "Four Days, One Holy Name",
    status: "Kirtan Safari 2026 has concluded",
    gratitude:
      "With gratitude to every kirtaniya, attendee, volunteer, cook, donor, organizer, temple resident, and online participant who carried the holy name through Nairobi.",
  },
} as const;

export type KirtanSafariConfig = typeof kirtanSafariConfig;
