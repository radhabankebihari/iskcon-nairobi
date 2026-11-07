// ISKCON Nairobi Vaishnava calendar for 2027, taken from the temple's printed
// "Hare Krishna Calendar 2027". Every observance on the printed calendar is
// listed here. Spellings follow the printed calendar, except that Ekadasi is
// written Ekadashi and the big festivals use the spellings used across the site
// (Janmashtami, Radhashtami, Gaura Purnima) so links and reminders match.
//
// Break-fast (parana) times from the printed calendar are attached to the
// Ekadashi they end, rather than listed as a separate date.

import type { CalendarEntry, CalendarMonth } from "./vaishnavaCalendar";

const YEAR = 2027;
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const SHORT_MONTHS = MONTH_NAMES.map((name) => name.slice(0, 3));
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// These symbols are separate image layers in the printed month grids, so they
// do not appear in extracted PDF text. Empty arrays mean no icon was printed.
const lunarPhases: [newMoons: number[], fullMoons: number[]][] = [
  [[7], [22]], [[6], [20]], [[8], [22]], [[6], [20]],
  [[6], [20]], [[4], [18]], [[], [18]], [[2, 31], [17]],
  [[], [15]], [[29], [15]], [[28], [14]], [[27], [13]],
];

const EKADASHI = "A day of fasting from grains and beans, given to extra chanting, reading, and hearing about Krishna.";
const HOLIDAY = "Public holiday in Kenya.";

// People who appear more than once in the year share one description.
const people = {
  devananda: "A Bhagavatam reciter of Navadvipa whom Sri Caitanya Mahaprabhu forgave and blessed.",
  mahesaUddharana: "Two of the twelve cowherd associates (gopalas) of Lord Nityananda.",
  locana: "Poet-devotee who wrote Caitanya-mangala and many songs still sung in kirtan.",
  jivaJagadisa: "Srila Jiva Gosvami, the great philosopher among the Six Gosvamis of Vrindavan, and Sri Jagadisa Pandita, a close associate of Sri Caitanya.",
  jagadisa: "A close associate of Sri Caitanya Mahaprabhu.",
  gopalaBhatta: "One of the Six Gosvamis of Vrindavan, who served the Radha-Ramana deity.",
  advaita: "Incarnation of Maha-Visnu whose prayers called Sri Caitanya Mahaprabhu to appear.",
  madhva: "Founding acarya of the Brahma-Madhva line in which ISKCON stands.",
  ramanuja: "Great acarya of the Sri Vaishnava tradition, teacher of devotion to Lord Narayana.",
  narottama: "Acarya whose Bengali songs of devotion are sung in temples around the world.",
  purusottama: "One of the twelve cowherd associates (gopalas) of Lord Nityananda.",
  bhaktisiddhanta: "Srila Prabhupada's spiritual master, who founded the Gaudiya Math and spread Krishna consciousness across India.",
  rasikananda: "Disciple of Syamananda Prabhu who spread devotion through Orissa.",
  madhavendra: "The root of the tree of devotion in Sri Caitanya's line, who served the Gopala deity.",
  srivasa: "Associate of Sri Caitanya in whose courtyard the nightly kirtans of Navadvipa began.",
  syamananda: "Student of Srila Jiva Gosvami who preached widely in Orissa.",
  vrndavanaDasa: "Author of Caitanya-bhagavata, a celebrated biography of Sri Caitanya Mahaprabhu.",
  vakresvara: "Associate of Sri Caitanya famous for dancing for hours in kirtan.",
  gadadhara: "Sri Caitanya's lifelong companion, an expansion of Srimati Radharani.",
  srinivasa: "Acarya who carried the books of the Six Gosvamis from Vrindavan to Bengal.",
  bhaktivinoda: "Acarya who pioneered spreading Krishna consciousness beyond India and wrote many books and songs.",
  nimbarka: "Acarya of the Kumara line of Vaishnavas.",
};

type Extra = Partial<Omit<CalendarEntry, "date" | "day" | "event">>;
type Row = [day: number, event: string, extra?: Extra];

function month(index: number, rows: Row[]): CalendarMonth {
  const phaseRows: Row[] = [
    ...lunarPhases[index][0].map((day): Row => [day, "Amavasya (new moon)"]),
    ...lunarPhases[index][1].map((day): Row => [day, "Purnima (full moon)"]),
  ];
  return {
    month: MONTH_NAMES[index],
    year: YEAR,
    events: [...rows, ...phaseRows].sort((a, b) => a[0] - b[0]).map(([day, event, extra]) => {
      const entry: CalendarEntry = {
        date: `${SHORT_MONTHS[index]} ${day}`,
        day: WEEKDAYS[new Date(Date.UTC(YEAR, index, day)).getUTCDay()],
        event,
        ...extra,
      };
      // Every break-fast on the printed calendar falls the day after its Ekadashi.
      if (entry.breakFast) {
        const next = new Date(Date.UTC(YEAR, index, day + 1));
        entry.breakFast = `${WEEKDAYS[next.getUTCDay()]} ${next.getUTCDate()} ${SHORT_MONTHS[next.getUTCMonth()]}, ${entry.breakFast}`;
      }
      return entry;
    }),
  };
}

// breakFast is the time window only; the date is added from the next day.
function ekadashi(breakFast: string, extra: Extra = {}): Extra {
  return { type: "Ekadashi", description: EKADASHI, breakFast, ...extra };
}

const holiday: Extra = { type: "Holiday", description: HOLIDAY };

export const vaishnavaCalendar2027: CalendarMonth[] = [
  month(0, [
    [1, "New Year's Day", holiday],
    [3, "Saphala Ekadashi", ekadashi("6:31 to 10:35 A.M.")],
    [3, "Disappearance of Sri Devananda Pandita", { description: people.devananda }],
    [5, "Disappearance of Sri Mahesa Pandita & Sri Uddharana Datta Thakura", { description: people.mahesaUddharana }],
    [8, "Appearance of Sri Locana Dasa Thakura", { description: people.locana }],
    [10, "Disappearance of Srila Jiva Gosvami & Sri Jagadisa Pandita", { description: people.jivaJagadisa }],
    [19, "Putrada Ekadashi", ekadashi("6:38 to 10:41 A.M.")],
    [19, "Appearance of Sri Jagadisa Pandita", { description: people.jagadisa }],
    [26, "Disappearance of Sri Ramacandra Kaviraja", { description: "Disciple of Srinivasa Acarya and dear friend of Narottama Dasa Thakura." }],
    [26, "Appearance of Srila Gopala Bhatta Gosvami", { description: people.gopalaBhatta }],
    [27, "Disappearance of Sri Jayadeva Gosvami", { description: "Poet of the Gita-govinda, whose songs Sri Caitanya Mahaprabhu relished." }],
    [28, "Disappearance of Sri Locana Dasa Thakura", { description: people.locana }],
  ]),
  month(1, [
    [2, "Sat-tila Ekadashi", ekadashi("6:41 to 10:45 A.M.")],
    [11, "Vasanta Pancami & Sarasvati Puja", { description: "Welcomes spring: the deities are dressed in yellow and Sarasvati, goddess of learning, is honoured." }],
    [11, "Appearance of Srimati Visnupriya-devi, Sri Pundarika Vidyanidhi, Srila Raghunatha Dasa Gosvami & Sri Raghunandana Thakura", { description: "Visnupriya-devi was Sri Caitanya's wife; Raghunatha Dasa Gosvami is one of the Six Gosvamis of Vrindavan." }],
    [11, "Disappearance of Srila Visvanatha Cakravarti Thakura", { description: "Great acarya and commentator on Srimad-Bhagavatam and Bhagavad-gita." }],
    [13, "Appearance of Sri Advaita Acarya", { fast: "Fast till noon", description: people.advaita }],
    [14, "Bhismastami", { description: "Remembers the departure of Grandfather Bhisma, one of the great devotees of Krishna." }],
    [15, "Disappearance of Sri Madhvacarya", { description: people.madhva }],
    [16, "Disappearance of Sri Ramanujacarya", { description: people.ramanuja }],
    [17, "Bhaimi Ekadashi", ekadashi("6:42 to 10:45 A.M.", { fast: "Fast till noon for Varahadeva" })],
    [18, "Appearance of Lord Varahadeva", { description: "The boar incarnation who lifted the earth from the depths of the universe." }],
    [19, "Nityananda Trayodasi: Appearance of Sri Nityananda Prabhu", { type: "Major", fast: "Fast till noon", description: "Lord Balarama appears as Sri Caitanya's chief associate, freely giving the holy name to everyone." }],
    [20, "Appearance of Srila Narottama Dasa Thakura", { description: people.narottama }],
    [25, "Disappearance of Sri Purusottama Dasa Thakura", { description: people.purusottama }],
    [25, "Appearance of Srila Bhaktisiddhanta Sarasvati Thakura", { fast: "Fast till noon", description: people.bhaktisiddhanta }],
  ]),
  month(2, [
    [4, "Vijaya Ekadashi", ekadashi("6:40 to 7:26 A.M.")],
    [4, "Disappearance of Sri Isvara Puri", { description: "The spiritual master who initiated Sri Caitanya Mahaprabhu." }],
    [7, "Siva Ratri", { description: "A night honouring Lord Siva, the foremost Vaishnava." }],
    [9, "Eid al-Fitr", { type: "Holiday", description: "Public holiday in Kenya. The date depends on the sighting of the moon." }],
    [9, "Disappearance of Srila Jagannatha Dasa Babaji & Sri Rasikananda", { description: "Jagannatha Dasa Babaji, guide of Srila Bhaktivinoda Thakura, and Sri Rasikananda, who spread devotion through Orissa." }],
    [12, "Appearance of Sri Purusottama Dasa Thakura", { description: people.purusottama }],
    [18, "Amalaki Vrata Ekadashi", ekadashi("6:37 to 10:39 A.M.")],
    [19, "Disappearance of Sri Madhavendra Puri", { description: people.madhavendra }],
    [22, "Gaura Purnima: Appearance of Sri Caitanya Mahaprabhu", { type: "Major", fast: "Fast till moonrise", description: "Sri Caitanya appeared in Mayapur in 1486 and began the congregational chanting of Hare Krishna. Kirtan, abhishek, class, and an evening feast." }],
    [23, "Festival of Jagannatha Misra", { description: "Sri Caitanya's father celebrated his son's birth with gifts and a feast; the temple keeps a festive day after Gaura Purnima." }],
    [26, "Good Friday", holiday],
    [29, "Easter Monday", holiday],
    [30, "Appearance of Sri Srivasa Pandita", { description: people.srivasa }],
  ]),
  month(3, [
    [2, "Papamocani Ekadashi", ekadashi("6:48 to 10:35 A.M.")],
    [3, "Disappearance of Sri Govinda Ghosh", { description: "Kirtan singer and associate of Sri Caitanya, one of the three Ghosh brothers." }],
    [11, "Appearance of Sri Ramanujacarya", { description: people.ramanuja }],
    [15, "Rama Navami: Appearance of Lord Sri Ramacandra", { type: "Major", fast: "Fast till sunset", description: "The appearance of Lord Rama, the ideal king, celebrated with kirtan and readings from the Ramayana." }],
    [15, "Tulasi Jala Dan begins", { description: "Through the hot season a pot drips water onto Tulasi Devi. Continues until 14 May." }],
    [17, "Kamada Ekadashi", ekadashi("6:30 to 10:31 A.M.")],
    [20, "Sri Krsna Vasanta Rasa & Sri Balarama Rasayatra", { description: "The springtime rasa dance pastimes of Krishna and of Lord Balarama." }],
    [20, "Appearance of Radha Kunda, Sri Vamsivadana Thakura & Sri Syamananda Prabhu", { description: people.syamananda }],
    [28, "Disappearance of Sri Abhirama Thakura", { description: "One of the twelve cowherd associates (gopalas) of Lord Nityananda." }],
  ]),
  month(4, [
    [1, "Labour Day", holiday],
    [1, "Disappearance of Srila Vrndavana Dasa Thakura", { description: people.vrndavanaDasa }],
    [2, "Varuthini Ekadashi", ekadashi("6:27 to 10:28 A.M.")],
    [6, "Appearance of Sri Gadadhara Pandita", { description: people.gadadhara }],
    [9, "Aksaya Trtiya: Candana Yatra begins", { type: "Major", description: "Begins 21 days of Candana Yatra, when the deities are covered with cooling sandalwood paste." }],
    [14, "Appearance of Srimati Sita Devi & Srimati Jahnava Devi", { description: "Sita Devi, the consort of Lord Rama, and Jahnava Devi, wife of Lord Nityananda and a leader of His followers." }],
    [14, "Disappearance of Sri Madhu Pandita", { description: "Devotee who served the Gopinatha deity of Vrindavan." }],
    [14, "Tulasi Jala Dan ends", { description: "The last day of offering dripping water to Tulasi Devi for the hot season." }],
    [16, "Mohini Ekadashi", ekadashi("6:27 to 10:28 A.M.")],
    [18, "Disappearance of Sri Jayananda Prabhu", { description: "Disciple of Srila Prabhupada, remembered for his humble service and his Ratha Yatra carts in San Francisco." }],
    [19, "Nrsimha Caturdasi: Appearance of Lord Nrsimhadeva", { type: "Major", fast: "Fast till dusk", description: "The half-man, half-lion incarnation who appeared to protect His devotee Prahlada." }],
    [20, "Salila Vihara", { description: "Summer water pastimes, remembering Krishna's play in the waters of Vrindavan." }],
    [20, "Appearance of Sri Sri Radha-Ramana Devaji, Sri Madhavendra Puri & Sri Srinivasa Acarya", { description: "Radha-Ramana appeared from Gopala Bhatta Gosvami's salagrama stone; Srinivasa Acarya carried the Gosvamis' books to Bengal." }],
    [20, "Disappearance of Sri Paramesvari Dasa Thakura", { description: "One of the twelve cowherd associates (gopalas) of Lord Nityananda." }],
    [25, "Disappearance of Sri Ramananda Raya", { description: "Associate of Sri Caitanya whose conversations with Him are recorded in Caitanya-caritamrta." }],
  ]),
  month(5, [
    [1, "Madaraka Day", holiday],
    [1, "Apara Ekadashi", ekadashi("6:29 to 10:30 A.M.")],
    [2, "Appearance of Srila Vrndavana Dasa Thakura", { description: people.vrndavanaDasa }],
    [13, "Disappearance of Sri Baladeva Vidyabhusana", { description: "Author of Govinda-bhasya, the Gaudiya commentary on Vedanta-sutra." }],
    [13, "Appearance of Srimati Gangamata Gosvamini", { description: "A princess who gave up royal life to serve in Jagannatha Puri." }],
    [14, "Pandava Nirjala Ekadashi", ekadashi("6:31 to 10:32 A.M.", {
      fast: "Total fast, even from water, if you have broken an Ekadashi",
      description: "The strictest Ekadashi of the year, kept by Bhima of the Pandavas.",
    })],
    [16, "Panihati Cida Dahi Utsava", { description: "Remembers the feast of chipped rice and yoghurt Raghunatha Dasa Gosvami gave at Lord Nityananda's request." }],
    [18, "Snana Yatra", { description: "Lord Jagannatha's public bathing festival, two weeks before Ratha Yatra." }],
    [18, "Disappearance of Sri Mukunda Datta & Sri Sridhara Pandita", { description: "Mukunda Datta, Sri Caitanya's sweet-voiced kirtan singer, and Sridhara Pandita, the humble banana-leaf seller." }],
    [19, "Disappearance of Sri Syamananda Prabhu", { description: people.syamananda }],
    [24, "Appearance of Sri Vakresvara Pandita", { description: people.vakresvara }],
    [29, "Disappearance of Sri Srivasa Pandita", { description: people.srivasa }],
    [30, "Yogini Ekadashi", ekadashi("6:35 to 10:36 A.M.")],
  ]),
  month(6, [
    [4, "Gundica Marjana", { description: "Cleaning of the Gundica temple to prepare for Lord Jagannatha's arrival." }],
    [4, "Disappearance of Srila Bhaktivinoda Thakura & Sri Gadadhara Pandita", { fast: "Fast till noon", description: people.bhaktivinoda }],
    [5, "Ratha Yatra", { type: "Major", description: "Lord Jagannatha, Baladeva, and Subhadra ride their chariots. This is the traditional date; the Nairobi procession date is announced separately." }],
    [5, "Disappearance of Sri Svarupa Damodara Gosvami & Sri Sivananda Sena", { description: "Svarupa Damodara was Sri Caitanya's secretary; Sivananda Sena led the Bengal devotees to Puri each year." }],
    [9, "Hera Pancami", { description: "Laksmi Devi visits Gundica to bring Lord Jagannatha home, four days after Ratha Yatra." }],
    [9, "Disappearance of Sri Vakresvara Pandita", { description: people.vakresvara }],
    [13, "Return Ratha", { description: "Lord Jagannatha returns to His temple, eight days after Ratha Yatra." }],
    [14, "Sayana Ekadashi", ekadashi("6:37 to 10:38 A.M.")],
    [18, "Guru (Vyasa) Purnima", { type: "Major", description: "Honours Srila Vyasadeva, compiler of the Vedas, and the spiritual master." }],
    [18, "Disappearance of Srila Sanatana Gosvami", { description: "Eldest of the Six Gosvamis of Vrindavan, who served the Madana-mohana deity." }],
    [18, "First month of Caturmasya begins", { fast: "No green leafy vegetables", description: "Four months of extra austerity in the rainy season. This month devotees avoid green leafy vegetables." }],
    [23, "Disappearance of Srila Gopala Bhatta Gosvami", { description: people.gopalaBhatta }],
    [27, "Disappearance of Srila Lokanatha Gosvami", { description: "Associate of Sri Caitanya and the spiritual master of Narottama Dasa Thakura." }],
    [28, "Incorporation of ISKCON in New York", { description: "Srila Prabhupada registered the International Society for Krishna Consciousness in New York in 1966." }],
    [30, "Kamika Ekadashi", ekadashi("6:37 to 10:38 A.M.")],
  ]),
  month(7, [
    [5, "Disappearance of Sri Vamsidasa Babaji & Sri Raghunandana Thakura", { description: "Vamsidasa Babaji, a renounced saint of Navadvipa, and Raghunandana Thakura of Srikhanda, an associate of Sri Caitanya." }],
    [12, "Pavitraropana Ekadashi", ekadashi("7:06 to 10:36 A.M.")],
    [12, "Radha Govinda Jhulana Yatra begins", { type: "Major", description: "Radha and Krishna are swung on a decorated swing each evening. Continues until 17 August." }],
    [13, "Disappearance of Srila Rupa Gosvami & Sri Gauridasa Pandita", { description: "Rupa Gosvami, leader of the Six Gosvamis and author of Bhakti-rasamrta-sindhu, and Gauridasa Pandita, an associate of Sri Caitanya." }],
    [17, "Jhulana Yatra ends", { description: "The last evening of the swing festival." }],
    [17, "Appearance of Lord Balarama", { type: "Major", fast: "Fast till noon", description: "Krishna's elder brother and first expansion, the source of spiritual strength." }],
    [17, "Second month of Caturmasya begins", { fast: "No yoghurt", description: "The second month of Caturmasya. Devotees avoid yoghurt." }],
    [18, "Srila Prabhupada's departure for the USA", { description: "In 1965 Srila Prabhupada left India on the cargo ship Jaladuta to bring Krishna consciousness to the West." }],
    [25, "Janmashtami: Appearance of Lord Sri Krishna", { type: "Major", fast: "Fast till midnight", description: "The night of Lord Krishna's appearance, with kirtan, abhishek, and the midnight arati." }],
    [26, "Nandotsava", { description: "Nanda Maharaja's joyful celebration of Krishna's birth." }],
    [26, "Appearance of Srila Prabhupada (Vyasa Puja)", { type: "Major", fast: "Fast till noon", description: "The founder-acarya of ISKCON is honoured with offerings, glorification, and a feast." }],
    [28, "Annada Ekadashi", ekadashi("6:31 to 7:07 A.M.")],
  ]),
  month(8, [
    [5, "Appearance of Srimati Sita Thakurani", { description: "The wife of Sri Advaita Acarya." }],
    [8, "Radhashtami: Appearance of Srimati Radharani", { type: "Major", fast: "Fast till noon", description: "Srimati Radharani, Krishna's eternal consort and the embodiment of devotion." }],
    [11, "Parsva Ekadashi", ekadashi("6:26 to 10:28 A.M.", { fast: "Fast till noon for Vamanadeva" })],
    [12, "Appearance of Lord Vamanadeva & Srila Jiva Gosvami", { description: "Vamanadeva, the dwarf incarnation who blessed Bali Maharaja, and Jiva Gosvami, the great philosopher of Vrindavan." }],
    [13, "Appearance of Srila Bhaktivinoda Thakura", { fast: "Fast till noon", description: people.bhaktivinoda }],
    [14, "Ananta Caturdasi Vrata", { description: "A vow honouring Lord Ananta Sesa." }],
    [14, "Disappearance of Srila Haridasa Thakura", { description: "The namacarya, teacher of the holy name, who chanted constantly." }],
    [15, "Sri Visvarupa Mahotsava & Bhadra Purnima", { description: "Remembers Visvarupa, Sri Caitanya's elder brother, who accepted sannyasa, on the full moon of Bhadra." }],
    [15, "Acceptance of sannyasa by Srila Prabhupada", { description: "Srila Prabhupada accepted sannyasa, the renounced order, in Mathura in 1959." }],
    [15, "Third month of Caturmasya begins", { fast: "No milk", description: "The third month of Caturmasya. Devotees avoid milk." }],
    [22, "Srila Prabhupada's arrival in the USA", { description: "Srila Prabhupada landed in Boston in 1965, aged 69, to begin his mission in the West." }],
    [26, "Indira Ekadashi", ekadashi("6:20 to 10:22 A.M.")],
  ]),
  month(9, [
    [10, "Mazingira Day", holiday],
    [10, "Ramacandra Vijayotsava", { description: "Celebrates Lord Rama's victory over Ravana." }],
    [10, "Appearance of Sri Madhvacarya", { description: people.madhva }],
    [11, "Pasankusa Ekadashi", ekadashi("6:15 to 10:17 A.M.")],
    [12, "Disappearance of Srila Raghunatha Dasa Gosvami, Srila Raghunatha Bhatta Gosvami & Srila Krsnadasa Kaviraja Gosvami", { description: "Two of the Six Gosvamis of Vrindavan, and Krsnadasa Kaviraja, author of Caitanya-caritamrta." }],
    [15, "Kartika vrata begins", { type: "Major", description: "The month of Damodara begins: devotees offer a lamp to Krishna each evening." }],
    [15, "Disappearance of Sri Murari Gupta", { description: "Physician and associate of Sri Caitanya who wrote an early Sanskrit account of His life." }],
    [15, "Fourth month of Caturmasya begins", { fast: "No urad dal", description: "The last month of Caturmasya. Devotees avoid urad dal." }],
    [20, "Mashujaa Day", holiday],
    [20, "Disappearance of Srila Narottama Dasa Thakura", { description: people.narottama }],
    [23, "Bahulastami", { description: "The appearance of Radha Kunda, the most sacred lake in Vraja." }],
    [24, "Appearance of Sri Virabhadra", { description: "Son of Lord Nityananda and Jahnava Devi, and a powerful preacher." }],
    [25, "Rama Ekadashi", ekadashi("6:19 to 10:15 A.M.")],
    [29, "Dipa Dana, Dipavali", { description: "The festival of lights, remembering Lord Rama's return to Ayodhya." }],
    [30, "Govardhana Puja, Go Puja, Go Krda & Bali Daityaraja Puja", { type: "Major", description: "Honours Govardhana Hill, which Krishna lifted to shelter Vraja, and the cows. A hill of food is offered and shared." }],
    [30, "Appearance of Sri Rasikananda", { description: people.rasikananda }],
    [31, "Disappearance of Sri Vasudeva Ghosh", { description: "Kirtan singer and poet, one of the three Ghosh brothers who sang for Sri Caitanya." }],
  ]),
  month(10, [
    [2, "Disappearance of Srila Prabhupada", { type: "Major", fast: "Fast till noon", description: "Srila Prabhupada left this world in Vrindavan in 1977. A day of remembrance and glorification." }],
    [6, "Gopastami, Gosthastami", { description: "The day Krishna began herding the cows." }],
    [6, "Disappearance of Sri Gadadhara Dasa Gosvami, Sri Dhananjaya Pandita & Sri Srinivasa Acarya", { description: people.srinivasa }],
    [9, "Disappearance of Srila Gaura Kisora Dasa Babaji", { fast: "Fast till noon", description: "Renounced saint and spiritual master of Srila Bhaktisiddhanta Sarasvati Thakura." }],
    [10, "Utthana Ekadashi", ekadashi("6:11 to 7:38 A.M.")],
    [10, "First day of Bhisma Pancaka", { description: "The last five days of Kartika, kept with extra austerity." }],
    [13, "Disappearance of Sri Bhugarbha Gosvami & Sri Kasisvara Pandita", { description: "Associates of Sri Caitanya who served in Vrindavan." }],
    [14, "Kartika vrata ends & last day of Bhisma Pancaka", { description: "The last day of the month of Damodara and of the five days of Bhisma Pancaka." }],
    [14, "Sri Krsna Rasayatra & Tulasi-Saligrama Vivaha", { description: "Krishna's autumn rasa dance, and the wedding of Tulasi Devi with the Saligrama." }],
    [14, "Appearance of Sri Nimbarkacarya", { description: people.nimbarka }],
    [15, "Katyayani vrata begins", { description: "The month-long vow the gopis kept to attain Krishna." }],
    [24, "Utpanna Ekadashi", ekadashi("6:14 to 8:22 A.M.")],
    [24, "Disappearance of Sri Narahari Sarakara Thakura", { description: "Associate of Sri Caitanya from Srikhanda and a poet of His glories." }],
    [25, "Disappearance of Sri Kaliya Krsnadasa", { description: "One of the twelve cowherd associates (gopalas) of Lord Nityananda." }],
    [26, "Disappearance of Sri Saranga Thakura", { description: "An associate of Sri Caitanya Mahaprabhu." }],
  ]),
  month(11, [
    [4, "Odana Sasthi", { description: "Lord Jagannatha receives His winter clothing." }],
    [9, "Moksada Ekadashi", ekadashi("6:44 to 10:23 A.M.")],
    [9, "Gita Jayanti: Advent of Srimad Bhagavad-gita", { type: "Major", description: "The day Krishna spoke the Bhagavad-gita to Arjuna at Kurukshetra." }],
    [12, "Jamhuri Day", holiday],
    [13, "Katyayani vrata ends", { description: "The last day of the gopis' month-long vow." }],
    [17, "Disappearance of Srila Bhaktisiddhanta Sarasvati Thakura", { fast: "Fast till noon", description: people.bhaktisiddhanta }],
    [23, "Saphala Ekadashi", ekadashi("6:26 to 10:30 A.M.")],
    [23, "Disappearance of Sri Devananda Pandita", { description: people.devananda }],
    [25, "Christmas Day", holiday],
    [25, "Disappearance of Sri Mahesa Pandita & Sri Uddharana Datta Thakura", { description: people.mahesaUddharana }],
    [26, "Boxing Day", holiday],
    [28, "Appearance of Sri Locana Dasa Thakura", { description: people.locana }],
    [30, "Disappearance of Srila Jiva Gosvami & Sri Jagadisa Pandita", { description: people.jivaJagadisa }],
  ]),
];
