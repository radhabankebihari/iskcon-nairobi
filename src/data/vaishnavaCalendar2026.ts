// The site's original 2026 highlights plus observances from the temple's
// printed 2026 calendar. Temple-only events (such as Kirtan Safari) remain.
import { vaishnavaCalendar2026 as highlights } from "./site";
import type { CalendarEntry, CalendarMonth } from "./vaishnavaCalendar";

type Extra = Partial<Omit<CalendarEntry, "date" | "day" | "event">>;
type Row = [day: number, event: string, extra?: Extra];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateCorrections: Record<string, number> = {
  "Shri Balarama Rasayatra / Krishna Vasanta Rasa": 1,
  "Padmini Ekadashi": 26,
  "Pandava Nirjala Ekadashi - strictest fast of the year": 25,
  "Pavitropana Ekadashi": 23,
  "Utpanna Ekadashi": 4,
};

const titleCorrections: Record<string, string> = {
  "Appearance of Radha Kunda / Bahulashtami": "Bahulastami",
  "Utthana Ekadashi / end of Chaturmasya observance": "Utthana Ekadashi",
  "Mokshada Ekadashi / Gita Jayanti": "Mokshada Ekadashi",
};

// Parana windows are attached to the Ekadashi, as in the 2027 data and UI.
const parana: Record<string, string> = {
  "Shat Tila Ekadashi": "6:36 to 10:40 A.M.",
  "Bhaimi Ekadashi": "6:40 to 8:41 A.M.",
  "Vijaya Ekadashi": "6:42 to 10:45 A.M.",
  "Amalaki Ekadashi": "6:41 to 10:43 A.M.",
  "Papamochani Ekadashi": "6:37 to 7:13 A.M.",
  "Kamada Ekadashi": "6:34 to 10:36 A.M.",
  "Varuthini Ekadashi": "6:30 to 10:32 A.M.",
  "Mohini Ekadashi": "6:28 to 10:29 A.M.",
  "Apara Ekadashi": "6:27 to 8:53 A.M.",
  "Padmini Ekadashi": "10:18 to 10:29 A.M.",
  "Parama Ekadashi": "6:31 to 10:32 A.M.",
  "Pandava Nirjala Ekadashi - strictest fast of the year": "6:34 to 10:35 A.M.",
  "Yogini Ekadashi": "6:36 to 10:37 A.M.",
  "Sayana Ekadashi": "6:37 to 10:38 A.M.",
  "Kamika Ekadashi": "6:36 to 10:37 A.M.",
  "Pavitropana Ekadashi": "8:20 to 10:34 A.M.",
  "Annada Ekadashi": "6:27 to 10:29 A.M.",
  "Parshva Ekadashi": "6:21 to 10:24 A.M.",
  "Indira Ekadashi": "6:16 to 10:19 A.M.",
  "Pashankusha Ekadashi": "6:12 to 10:15 A.M.",
  "Rama Ekadashi": "6:11 to 8:02 A.M.",
  "Utthana Ekadashi / end of Chaturmasya observance": "6:13 to 10:16 A.M.",
  "Utpanna Ekadashi": "6:17 to 10:21 A.M.",
  "Mokshada Ekadashi / Gita Jayanti": "6:24 to 10:28 A.M.",
};

const fasting: Record<string, string> = {
  "Bhaimi Ekadashi": "Fast till noon for Varahadeva",
  "Bhaktisiddhanta Sarasvati Thakura - Appearance": "Fast till noon",
  "Nityananda Trayodashi - Nityananda Prabhu appearance": "Fast till noon",
  "Gaura Purnima - Appearance of Sri Chaitanya Mahaprabhu": "Fast till moonrise",
  "Rama Navami - Appearance of Lord Ramachandra": "Fast till noon",
  "Narasimha Chaturdashi - Appearance of Lord Narasimhadeva": "Fast till dusk",
  "Pandava Nirjala Ekadashi - strictest fast of the year": "Total fast, even from water, if an earlier Ekadashi was broken",
  "Lord Balarama Appearance / Kirtan Safari": "Fast till noon",
  "Sri Krishna Janmashtami - Appearance of Lord Krishna": "Fast till midnight",
  "Nandotsava / Srila Prabhupada Appearance day": "Fast till noon for Srila Prabhupada's appearance",
  "Radhashtami - Appearance of Srimati Radharani": "Fast till noon",
  "Parshva Ekadashi": "Fast till noon for Vamanadeva",
  "Srila Prabhupada Disappearance day": "Fast till noon",
  "Bhaktisiddhanta Sarasvati Thakura - Disappearance": "Fast till noon",
};

const holiday: Extra = { type: "Holiday" };
const additions: Row[][] = [
  [
    [1, "New Year's Day", holiday],
    [1, "Appearance of Sri Jagadisa Pandita"],
    [1, "Break fast 6:30 to 10:34 A.M. (for the prior day's Ekadashi)"],
    [7, "Disappearance of Sri Ramacandra Kaviraja"], [7, "Appearance of Srila Gopala Bhatta Gosvami"],
    [8, "Disappearance of Sri Jayadeva Gosvami"], [9, "Disappearance of Sri Locana Dasa Thakura"],
    [23, "Appearances of Srimati Visnupriya Devi, Sri Pundarika Vidyanidhi, Sri Raghunandana Thakura and Srila Raghunatha Dasa Gosvami"],
    [23, "Disappearance of Srila Visvanatha Cakravarti Thakura"],
    [25, "Appearance of Sri Advaita Acarya", { fast: "Fast till noon" }],
    [27, "Disappearance of Sri Madhvacarya"], [28, "Disappearance of Sri Ramanujacarya"],
  ],
  [
    [1, "Appearance of Srila Narottama Dasa Thakura"], [6, "Disappearance of Sri Purusottama Dasa Thakura"],
    [14, "Disappearance of Sri Isvara Puri"],
    [18, "Disappearances of Srila Jagannatha Dasa Babaji and Sri Rasikananda"],
    [21, "Appearance of Sri Purusottama Dasa Thakura"], [28, "Disappearance of Sri Madhavendra Puri"],
  ],
  [
    [11, "Appearance of Sri Srivasa Pandita"], [16, "Disappearance of Sri Govinda Ghosh"],
    [21, "Eid al-Fitr (subject to moon sighting)", holiday], [23, "Appearance of Sri Ramanujacarya"],
  ],
  [
    [1, "Appearances of Radha Kunda, Sri Vamsivadana Thakura and Sri Syamananda Prabhu"],
    [3, "Good Friday", holiday], [6, "Easter Monday", holiday],
    [9, "Disappearance of Sri Abhirama Thakura"], [12, "Disappearance of Srila Vrndavana Dasa Thakura"],
    [17, "Appearance of Sri Gadadhara Pandita"],
    [25, "Appearances of Srimati Sita Devi and Srimati Jahnava Devi"],
    [25, "Disappearance of Sri Madhu Pandita", { fast: "Fast till noon" }],
    [29, "Disappearance of Sri Jayananda Prabhu"],
  ],
  [
    [1, "Appearances of Sri Sri Radha Ramana Devaji, Sri Madhavendra Puri and Sri Srinivasa Acarya"],
    [1, "Disappearance of Sri Paramesvari Dasa Thakura"], [1, "Labour Day", holiday],
    [6, "Disappearance of Sri Ramananda Raya"], [14, "Appearance of Srila Vrndavana Dasa Thakura"],
    [16, "Purusottama-adhika Masa begins"],
    [27, "Eid al-Adha (subject to moon sighting)", holiday],
  ],
  [
    [1, "Madaraka Day", holiday],
    [24, "Appearance of Srimati Gangamata Gosvamini"], [24, "Disappearance of Sri Baladeva Vidyabhusana"],
    [29, "Disappearances of Sri Mukunda Datta and Sri Sridhara Pandita"],
    [30, "Disappearance of Sri Syamananda Prabhu"],
  ],
  [
    [5, "Appearance of Sri Vakresvara Pandita"], [10, "Disappearance of Sri Srivasa Pandita"],
    [14, "Disappearances of Srila Bhaktivinoda Thakura and Sri Gadadhara Pandita", { fast: "Fast till noon" }],
    [16, "Disappearances of Sri Svarupa Damodara Gosvami and Sri Sivananda Sena"],
    [19, "Disappearance of Sri Vakresvara Pandita"],
    [29, "Disappearance of Srila Sanatana Gosvami"],
    [29, "First Caturmasya month begins", { fast: "No green leafy vegetables" }],
  ],
  [
    [3, "Disappearance of Srila Gopala Bhatta Gosvami"], [6, "Disappearance of Srila Lokanatha Gosvami"],
    [16, "Disappearances of Sri Raghunandana Thakura and Sri Vamsidasa Babaji"],
    [24, "Disappearances of Srila Rupa Gosvami and Sri Gauridasa Pandita"],
    [28, "Second Caturmasya month begins", { fast: "No yoghurt" }],
  ],
  [
    [15, "Appearance of Srimati Sita Thakurani"],
    [23, "Appearances of Lord Vamanadeva and Srila Jiva Gosvami"],
    [24, "Appearance of Srila Bhaktivinoda Thakura", { fast: "Fast till noon" }],
    [25, "Disappearance of Srila Haridasa Thakura"],
    [26, "Bhadra Purnima; Srila Prabhupada accepts sannyasa"],
    [26, "Third Caturmasya month begins", { fast: "No milk" }],
  ],
  [
    [10, "Mazingira Day", holiday], [21, "Appearance of Sri Madhvacarya"],
    [23, "Disappearances of Srila Raghunatha Dasa Gosvami, Srila Raghunatha Bhatta Gosvami and Srila Krsnadasa Kaviraja Gosvami"],
    [26, "Kartika vrata begins"], [26, "Disappearance of Sri Murari Gupta"],
    [26, "Fourth Caturmasya month begins", { fast: "No urad dal" }],
    [30, "Disappearance of Srila Narottama Dasa Thakura"],
  ],
  [
    [3, "Appearance of Sri Virabhadra"], [10, "Bali Daityaraja Puja; appearance of Sri Rasikananda"],
    [11, "Disappearance of Sri Vasudeva Ghosh"],
    [17, "Disappearances of Sri Gadadhara Dasa Gosvami, Sri Dhananjaya Pandita and Sri Srinivasa Acarya"],
    [20, "Disappearance of Srila Gaura Kisora Dasa Babaji", { fast: "Fast till noon" }],
    [21, "First day of Bhisma Pancaka"],
    [23, "Disappearances of Sri Bhugarbha Gosvami and Sri Kasisvara Pandita"],
    [24, "Kartika vrata ends; last day of Bhisma Pancaka"],
    [24, "Appearance of Sri Nimbarkacarya"],
  ],
  [
    [5, "Disappearance of Sri Kaliya Krsnadasa"], [6, "Disappearance of Sri Saranga Thakura"],
    [12, "Jamhuri Day", holiday],
    [20, "Gita Jayanti: Advent of Srimad Bhagavad-gita", { type: "Major" }],
  ],
];

// The moon markers are image-only in the flattened 2026 PDF.
const lunarPhases: [newMoons: number[], fullMoons: number[]][] = [
  [[18], [3]], [[17], [1]], [[18], [3]], [[17], [1]], [[16], [1]],
  [[], [29]], [[14], [29]], [[12], [28]], [[11], [26]],
  [[10], [26]], [[9], [24]], [[8], []],
];

export const vaishnavaCalendar2026: CalendarMonth[] = highlights.map((source, monthIndex) => {
  const makeEntry = (day: number, event: string, extra: Extra = {}): CalendarEntry => ({
    date: `${months[monthIndex].slice(0, 3)} ${day}`,
    day: weekdays[new Date(Date.UTC(2026, monthIndex, day)).getUTCDay()],
    event,
    ...extra,
  });
  const base = source.events.map((item): CalendarEntry => {
    const day = dateCorrections[item.event] ?? Number(item.date.replace(/^\D+/, ""));
    const next = new Date(Date.UTC(2026, monthIndex, day + 1));
    const breakFast = parana[item.event]
      ? `${weekdays[next.getUTCDay()]} ${next.getUTCDate()} ${months[next.getUTCMonth()].slice(0, 3)}, ${parana[item.event]}`
      : undefined;
    return makeEntry(day, titleCorrections[item.event] ?? item.event, {
      ...(item.type ? { type: item.event === "Mokshada Ekadashi / Gita Jayanti" ? "Ekadashi" : item.type } : {}),
      ...(fasting[item.event] ? { fast: fasting[item.event] } : {}),
      ...(breakFast ? { breakFast } : {}),
    });
  });
  const extra = additions[monthIndex].map(([day, event, options]) => makeEntry(day, event, options));
  const [newMoons, fullMoons] = lunarPhases[monthIndex];
  const phases = [
    ...newMoons.map((day) => makeEntry(day, "Amavasya (new moon)")),
    ...fullMoons.map((day) => makeEntry(day, "Purnima (full moon)")),
  ];
  return {
    month: months[monthIndex],
    year: 2026,
    events: [...base, ...extra, ...phases].sort((a, b) => Number(a.date.replace(/^\D+/, "")) - Number(b.date.replace(/^\D+/, ""))),
  };
});
