// Central content registry for shared temple information, navigation,
// homepage cards, and cross-page summaries. Prefer editing copy and image
// choices here when a change is reused in more than one page or section.
export const templeInfo = {
  name: "ISKCON Nairobi",
  legalName: "Sri Sri Radha Bankebihari Temple",
  tagline: "Faith. Community. Service.",
  addressLines: [
    "Hare Krishna Close",
    "Parklands / West Ngara",
    "Nairobi, Kenya",
  ],
  shortAddress: "Hare Krishna Close, Parklands / West Ngara, Nairobi",
  phoneDisplay: "+254 722 815 039",
  phoneHref: "+254722815039",
  email: "iskconnairobi@gmail.com",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=ISKCON%20Nairobi%20Hare%20Krishna%20Close%20Nairobi%20Kenya",
  hours: "Morning: 4:30 A.M. - 12:45 P.M. | Evening: 4:30 P.M. - 8:45 P.M.",
  note: "Programme timings can vary on festival days. Contact the temple before travelling for major celebrations.",
};

export const socialLinks = [
  { label: "FB", name: "Facebook", href: "https://www.facebook.com/profile.php?id=100064683579429" },
  { label: "IG", name: "Instagram", href: "https://www.instagram.com/iskcon_nairobi/" },
  { label: "YT", name: "YouTube", href: "https://www.youtube.com/results?search_query=ISKCON+Nairobi" },
  { label: "WA", name: "WhatsApp", href: "https://wa.me/254721667181" },
];

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Founder", href: "/srila-prabhupada" },
  { label: "Leadership", href: "/leadership" },
  { label: "Visit", href: "/visit" },
  { label: "Learn", href: "/learn" },
  { label: "Projects", href: "/projects" },
  { label: "Festivals", href: "/festivals" },
  { label: "Blog", href: "/blog" },
  { label: "Guest House", href: "/guest-house" },
  { label: "Media", href: "/media" },
  { label: "Donate", href: "/donate" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: 1000, suffix: "+", label: "Students & Youth", description: "Learning through temple classes, retreats, and outreach" },
  { value: 10000, suffix: "+", label: "Meals Monthly", description: "Prasadam served through Food For Life and temple programmes" },
  { value: 200, suffix: "+", label: "Protected Cows", description: "Cow protection and natural farming at Thika" },
  { value: 1000, suffix: "+", label: "Festival Guests", description: "Gathering for Ratha Yatra, Janmashtami, and Kirtan Safari" },
];

export const projects = [
  {
    id: "hktc-nairobi",
    title: "HKTC Nairobi",
    subtitle: "Hare Krishna Training Centre",
    description: "A Vaishnava education initiative connected to ISKCON Nairobi, offering serious study of Bhagavad-gita, Srimad-Bhagavatam, kirtan, and devotional practice.",
    image: "/images/hktc/hktc-nairobi-student-class.jpg",
    href: "/projects/hktc-nairobi",
    tag: "Education",
  },
  {
    id: "hktc-juja",
    title: "HKTC Juja",
    subtitle: "Student & Youth Outreach",
    description: "A growing devotional outreach serving students and families around Juja with classes, kirtan, prasadam, and spiritual mentorship.",
    image: "/images/hktc/hktc-juja-class.jpg",
    href: "/projects/hktc-juja",
    tag: "Education",
  },
  {
    id: "thika-farm",
    title: "Thika Farm & Goshala",
    subtitle: "Organic Farming & Cow Protection",
    description: "Sacred land where cow protection, natural farming, and devotional community life come together outside Nairobi.",
    image: "/images/thika-farm/thika-farm-visit-gate.jpg",
    href: "/projects/thika-farm",
    tag: "Agriculture",
  },
  {
    id: "food-for-life",
    title: "Food For Life",
    subtitle: "Prasadam Distribution",
    description: "Freshly prepared sanctified vegetarian meals served through temple programmes, student outreach, and community care across Nairobi.",
    image: "/images/food-for-life/prasadam-students.jpg",
    href: "/projects/food-for-life",
    tag: "Community Service",
  },
];

export const festivals = [
  {
    title: "Kirtan Safari Festival",
    date: "27-30 August 2026",
    location: "Hare Krishna Temple",
    description: "Adivas on 27 August followed by a kirtan journey through Jarikhand Forest with kirtan, Harinam, Abhishek, prasadam, and devotional community.",
    image: "/images/kirtan-safari-2026-poster-thumb.jpg",
    href: "/festivals/kirtan-safari",
    featured: true,
  },
  {
    title: "Ratha Yatra",
    date: "Annual procession",
    location: "Nairobi",
    description: "The Festival of Chariots, a public celebration of Lord Jagannath with kirtan, procession, dance, and prasadam distribution.",
    image: "/images/festivals/ratha-yatra-procession.jpg",
    href: "/festivals/rath-yatra",
    featured: false,
  },
  {
    title: "Janmashtami",
    date: "Annual appearance day",
    location: templeInfo.legalName,
    description: "The biggest temple celebration of the year, marking the divine appearance of Lord Krishna with kirtan, abhishek, drama, offerings, service, and prasadam.",
    image: "/images/calendar-janmashtami-krishna.jpeg",
    href: "/festivals/janmashtami",
    featured: false,
  },
  {
    title: "Radhashtami",
    date: "Annual appearance day",
    location: templeInfo.legalName,
    description: "The appearance day of Srimati Radharani, celebrated with kirtan, class, special worship, offerings, service, and prasadam.",
    image: "/images/calendar-radhashtami-sakhis.jpeg",
    href: "/festivals/radhashtami",
    featured: false,
  },
  {
    title: "Gaura Purnima",
    date: "Annual appearance day",
    location: templeInfo.legalName,
    description: "The appearance day of Sri Chaitanya Mahaprabhu, celebrated with kirtan, fasting, abhishek, class, and evening feast.",
    image: "/images/community/iskcon-temple-architecture.jpg",
    href: "/festivals/gaura-purnima",
    featured: false,
  },
];

export const homepageFestivalPreview = [
  {
    title: "Kirtan Safari Festival",
    date: "27-30 August 2026",
    month: "Aug",
    day: "27",
    location: "ISKCON Nairobi, Hare Krishna Temple",
    description: "Adivas opens the festival on 27 August, followed by three days of kirtan, Harinam, prasadam, and devotional community.",
    image: "/images/calendar-kirtan-safari-bg.png",
    href: "/festivals/kirtan-safari",
    tag: "Featured",
    endsAt: "2026-08-30T23:59:59+03:00",
  },
  {
    title: "Sri Krishna Janmashtami",
    date: "4 September 2026",
    month: "Sep",
    day: "04",
    location: "ISKCON Nairobi, Hare Krishna Temple",
    description: "The appearance day of Lord Krishna, observed with fasting until midnight, kirtan, abhishek, offerings, and prasadam.",
    image: "/images/calendar-janmashtami-krishna.jpeg",
    href: "/festivals/janmashtami",
    tag: "",
    endsAt: "2026-09-04T23:59:59+03:00",
  },
  {
    title: "Radhashtami",
    date: "19 September 2026",
    month: "Sep",
    day: "19",
    location: "ISKCON Nairobi, Hare Krishna Temple",
    description: "Appearance of Srimati Radharani, celebrated with kirtan, class, worship, and special temple programmes.",
    image: "/images/calendar-radhashtami-sakhis.jpeg",
    href: "/festivals/radhashtami",
    tag: "",
    endsAt: "2026-09-20T00:00:00+03:00",
  },
];

export const vaishnavaCalendar2026 = [
  {
    month: "January",
    events: [
      { date: "Jan 3", day: "Sat", event: "Shri Krishna Pushya Abhisheka" },
      { date: "Jan 14", day: "Wed", event: "Shat Tila Ekadashi", type: "Ekadashi" },
      { date: "Jan 15", day: "Thu", event: "Ganga Sagara Mela / Makara Sankranti" },
      { date: "Jan 23", day: "Fri", event: "Vasanta Panchami / Saraswati Puja" },
      { date: "Jan 26", day: "Mon", event: "Bhishmashtami" },
      { date: "Jan 29", day: "Thu", event: "Bhaimi Ekadashi", type: "Ekadashi" },
      { date: "Jan 30", day: "Fri", event: "Varaha Dwadashi - Lord Varahadeva appearance" },
      { date: "Jan 31", day: "Sat", event: "Nityananda Trayodashi - Nityananda Prabhu appearance", type: "Major" },
    ],
  },
  {
    month: "February",
    events: [
      { date: "Feb 1", day: "Sun", event: "Shri Krishna Madhura Utsava" },
      { date: "Feb 6", day: "Fri", event: "Bhaktisiddhanta Sarasvati Thakura - Appearance" },
      { date: "Feb 13", day: "Fri", event: "Vijaya Ekadashi", type: "Ekadashi" },
      { date: "Feb 16", day: "Mon", event: "Shiva Ratri" },
      { date: "Feb 27", day: "Fri", event: "Amalaki Ekadashi", type: "Ekadashi" },
    ],
  },
  {
    month: "March",
    events: [
      { date: "Mar 3", day: "Tue", event: "Gaura Purnima - Appearance of Sri Chaitanya Mahaprabhu", type: "Major" },
      { date: "Mar 4", day: "Wed", event: "Festival of Jagannatha Mishra" },
      { date: "Mar 15", day: "Sun", event: "Papamochani Ekadashi", type: "Ekadashi" },
      { date: "Mar 27", day: "Fri", event: "Rama Navami - Appearance of Lord Ramachandra", type: "Major" },
      { date: "Mar 29", day: "Sun", event: "Kamada Ekadashi", type: "Ekadashi" },
      { date: "Mar 30", day: "Mon", event: "Damanakaropana Dwadashi" },
    ],
  },
  {
    month: "April",
    events: [
      { date: "Apr 2", day: "Thu", event: "Shri Balarama Rasayatra / Krishna Vasanta Rasa" },
      { date: "Apr 13", day: "Mon", event: "Varuthini Ekadashi", type: "Ekadashi" },
      { date: "Apr 14", day: "Tue", event: "Beginning of Tulasi Jala Dan" },
      { date: "Apr 20", day: "Mon", event: "Akshaya Tritiya / Chandana Yatra begins", type: "Major" },
      { date: "Apr 27", day: "Mon", event: "Mohini Ekadashi", type: "Ekadashi" },
      { date: "Apr 28", day: "Tue", event: "Rukmini Dwadashi" },
      { date: "Apr 30", day: "Thu", event: "Narasimha Chaturdashi - Appearance of Lord Narasimhadeva", type: "Major" },
    ],
  },
  {
    month: "May",
    events: [
      { date: "May 1", day: "Fri", event: "Krishna Phula Dola, Salila Vihara" },
      { date: "May 13", day: "Wed", event: "Apara Ekadashi", type: "Ekadashi" },
      { date: "May 14", day: "Thu", event: "End of Tulasi Jala Dan" },
      { date: "May 27", day: "Wed", event: "Padmini Ekadashi", type: "Ekadashi" },
    ],
  },
  {
    month: "June",
    events: [
      { date: "Jun 11", day: "Thu", event: "Parama Ekadashi", type: "Ekadashi" },
      { date: "Jun 24", day: "Wed", event: "Ganga Puja" },
      { date: "Jun 26", day: "Fri", event: "Pandava Nirjala Ekadashi - strictest fast of the year", type: "Ekadashi" },
      { date: "Jun 27", day: "Sat", event: "Panihati Chida Dahi Utsava" },
      { date: "Jun 29", day: "Mon", event: "Snana Yatra" },
    ],
  },
  {
    month: "July",
    events: [
      { date: "Jul 11", day: "Sat", event: "Yogini Ekadashi", type: "Ekadashi" },
      { date: "Jul 15", day: "Wed", event: "Gundica Marjana" },
      { date: "Jul 16", day: "Thu", event: "Ratha Yatra - Chariot festival of Jagannath, Baladeva, Subhadra", type: "Major" },
      { date: "Jul 20", day: "Mon", event: "Hera Panchami" },
      { date: "Jul 24", day: "Fri", event: "Return Ratha Yatra" },
      { date: "Jul 25", day: "Sat", event: "Sayana Ekadashi", type: "Ekadashi" },
      { date: "Jul 29", day: "Wed", event: "Guru Purnima / 1st Chaturmasya begins", type: "Major" },
    ],
  },
  {
    month: "August",
    events: [
      { date: "Aug 7", day: "Fri", event: "Incorporation of ISKCON in New York (1966)" },
      { date: "Aug 9", day: "Sun", event: "Kamika Ekadashi", type: "Ekadashi" },
      { date: "Aug 23", day: "Sun", event: "Radha Govinda Jhulan Yatra begins - 23-28 August, ending Friday", type: "Major" },
      { date: "Aug 24", day: "Mon", event: "Pavitropana Ekadashi", type: "Ekadashi" },
      { date: "Aug 27", day: "Thu", event: "Last day of 1st Chaturmasya / Kirtan Safari Adivas", type: "Major" },
      { date: "Aug 28", day: "Fri", event: "Lord Balarama Appearance / Kirtan Safari", type: "Major" },
      { date: "Aug 29", day: "Sat", event: "Srila Prabhupada's Departure for the USA / Kirtan Safari" },
      { date: "Aug 30", day: "Sun", event: "Kirtan Safari closing day", type: "Major" },
    ],
  },
  {
    month: "September",
    events: [
      { date: "Sep 4", day: "Fri", event: "Sri Krishna Janmashtami - Appearance of Lord Krishna", type: "Major" },
      { date: "Sep 5", day: "Sat", event: "Nandotsava / Srila Prabhupada Appearance day", type: "Major" },
      { date: "Sep 7", day: "Mon", event: "Annada Ekadashi", type: "Ekadashi" },
      { date: "Sep 19", day: "Sat", event: "Radhashtami - Appearance of Srimati Radharani", type: "Major" },
      { date: "Sep 22", day: "Tue", event: "Parshva Ekadashi", type: "Ekadashi" },
      { date: "Sep 25", day: "Fri", event: "Ananta Chaturdashi / Last day of 2nd Chaturmasya" },
      { date: "Sep 26", day: "Sat", event: "Shri Vishwarupa Mahotsava / 3rd Chaturmasya begins" },
    ],
  },
  {
    month: "October",
    events: [
      { date: "Oct 3", day: "Sat", event: "Srila Prabhupada's Arrival in the USA" },
      { date: "Oct 6", day: "Tue", event: "Indira Ekadashi", type: "Ekadashi" },
      { date: "Oct 18", day: "Sun", event: "Durga Puja" },
      { date: "Oct 21", day: "Wed", event: "Ramachandra Vijayotsava" },
      { date: "Oct 22", day: "Thu", event: "Pashankusha Ekadashi", type: "Ekadashi" },
      { date: "Oct 25", day: "Sun", event: "Last day of 3rd Chaturmasya" },
      { date: "Oct 26", day: "Mon", event: "Shri Krishna Sharadiya Rasayatra / Lakshmi Puja" },
    ],
  },
  {
    month: "November",
    events: [
      { date: "Nov 2", day: "Mon", event: "Appearance of Radha Kunda / Bahulashtami" },
      { date: "Nov 5", day: "Thu", event: "Rama Ekadashi", type: "Ekadashi" },
      { date: "Nov 9", day: "Mon", event: "Dipa Dana, Dipavali, Kali Puja" },
      { date: "Nov 10", day: "Tue", event: "Go Puja, Govardhana Puja", type: "Major" },
      { date: "Nov 13", day: "Fri", event: "Srila Prabhupada Disappearance day", type: "Major" },
      { date: "Nov 17", day: "Tue", event: "Gopashtami, Gosthashtami" },
      { date: "Nov 21", day: "Sat", event: "Utthana Ekadashi / end of Chaturmasya observance", type: "Ekadashi" },
      { date: "Nov 24", day: "Tue", event: "Shri Krishna Rasayatra / Tulasi-Saligrama Vivaha" },
      { date: "Nov 25", day: "Wed", event: "Katyayani Vrata begins" },
    ],
  },
  {
    month: "December",
    events: [
      { date: "Dec 5", day: "Sat", event: "Utpanna Ekadashi", type: "Ekadashi" },
      { date: "Dec 15", day: "Tue", event: "Odana Shashthi" },
      { date: "Dec 20", day: "Sun", event: "Mokshada Ekadashi / Gita Jayanti", type: "Major" },
      { date: "Dec 24", day: "Thu", event: "Katyayani Vrata ends" },
      { date: "Dec 27", day: "Sun", event: "Bhaktisiddhanta Sarasvati Thakura - Disappearance" },
    ],
  },
];

export const testimonials = [
  {
    quote: "The first thing I felt at the temple was welcome. The kirtan, prasadam, and classes gave me a spiritual home in Nairobi.",
    name: "Mama Mary",
    role: "Sunday Feast guest",
    origin: "Nairobi, Kenya",
    image: "/images/community/mama-nairobi.jpg",
  },
  {
    quote: "Serving prasadam changes the whole mood of the day. People come for food, but they leave with dignity and joy.",
    name: "Josh",
    role: "Community outreach",
    origin: "Nairobi, Kenya",
    image: "/images/community/joshua.jpg",
  },
  {
    quote: "The farm helped me understand simple living in a practical way: caring for cows, working with the land, and chanting together.",
    name: "Mike",
    role: "Thika Farm service",
    origin: "Kenya",
    image: "/images/community/eng-m.jpg",
  },
  {
    quote: "Ratha Yatra brought the whole city into celebration. I had never seen devotion expressed so publicly and joyfully.",
    name: "Visva Daksina",
    role: "Ratha Yatra service",
    origin: "Kiambu, Kenya",
    image: "/images/community/visva-daksina.jpg",
  },
];

export const leadership = [
  {
    name: "Spiritual Guidance",
    title: "Senior Vaishnava Direction",
    description: "Senior devotees guide the temple's spiritual priorities, preaching standards, education, and East Africa service vision.",
    image: "/images/leadership/umapati-prabhu-web.jpg",
  },
  {
    name: "Departmental Service",
    title: "Distributed Temple Coordination",
    description: "ISKCON Nairobi now runs through a departmental service model, with responsibilities shared across education, worship, kirtan, outreach, hospitality, festivals, and administration.",
    image: "/images/leadership/govinda-prem-prabhu-outdoors.jpg",
  },
  {
    name: "Resident Teaching",
    title: "Training, Kirtan & Daily Culture",
    description: "Resident teachers, kirtan leaders, and service coordinators carry the daily culture of study, worship, music, mentorship, and community care.",
    image: "/images/leadership/sri-gauranga-prabhu-web.jpg",
  },
];

export const leadershipProfiles = [
  {
    name: "Umapati Prabhu",
    role: "GBC Member, Initiating Guru, Senior Preacher",
    category: "Spiritual Guidance",
    image: "/images/leadership/umapati-prabhu-web.jpg",
    summary: "The senior-most guide connected with ISKCON Nairobi's East Africa mission, now an initiating guru who travels widely across the region.",
    details: "Umapati Prabhu provides senior Vaishnava guidance, preaches throughout East Africa, and helps establish and strengthen new centres in the region.",
    emphasis: true,
  },
  {
    name: "Govinda Prem Prabhu",
    role: "Regional Secretary, Hare Krishna Training Centre",
    category: "Regional & Educational Leadership",
    image: "/images/leadership/govinda-prem-prabhu-portrait.jpg",
    summary: "Regional Secretary and key leader of the Hare Krishna Training Centre.",
    details: "Govinda Prem Prabhu serves as Regional Secretary and leads HKTC, guiding student education, devotional training, and regional coordination.",
  },
  {
    name: "Mukund Morari Prabhu",
    role: "Vice President, Kirtan Coordination",
    category: "Temple Coordination",
    image: "/images/leadership/mukund-morari-prabhu-web.jpg",
    summary: "One of the vice presidents and a world-class mrdanga player.",
    details: "Mukund Morari Prabhu serves as Vice President and coordinates temple kirtans, musician training, festivals, and Nairobi's devotional music culture.",
  },
  {
    name: "Rukma Prabhu",
    role: "Vice President, Community Devotee Care",
    category: "Community Guidance",
    image: "/images/leadership/rukma-prabhu.jpg",
    summary: "One of the vice presidents, a respected community elder, teacher, and trusted source of pastoral guidance.",
    details: "Rukma Prabhu serves as Vice President, guiding devotee care and Namahatta while teaching sastra, conducting yajnas, and advising the community.",
  },
  {
    name: "Sri Gauranga Prabhu",
    role: "Senior Resident Brahmachari, Teacher",
    category: "Resident Teaching",
    image: "/images/leadership/sri-gauranga-prabhu-web.jpg",
    summary: "The senior-most resident brahmachari and a respected teacher.",
    details: "Sri Gauranga Prabhu is the senior resident brahmachari, supporting temple life through teaching, mentorship, resident training, and daily service.",
  },
];

export const leadershipDepartments = [
  "Spiritual guidance",
  "Regional coordination",
  "Hare Krishna Training Centre",
  "Temple worship",
  "Kirtan and festivals",
  "Food For Life",
  "Guest care",
  "Youth and student outreach",
  "Farm and goshala",
  "Administration",
  "Communications",
  "Volunteer service",
];

export const donationPaths = [
  {
    title: "Temple Worship",
    description: "Support daily worship at Sri Sri Radha Bankebihari Temple: flowers, lamps, offerings, maintenance, and festival worship.",
    image: "/images/donate/main-altar-offering.jpg",
    icon: "🪔",
    href: "/donate/temple",
  },
  {
    title: "Food For Life",
    description: "Help prepare and distribute sanctified vegetarian meals for temple guests, students, and communities in need.",
    image: "/images/food-for-life/prasadam-students.jpg",
    icon: "🍛",
    href: "/donate/food",
  },
  {
    title: "Cow Protection",
    description: "Support feed, veterinary care, shelter, and daily service for protected cows at the Thika farm and goshala.",
    image: "/images/thika-farm/thika-farm-visit-gate.jpg",
    icon: "🐄",
    href: "/donate/cows",
  },
  {
    title: "Student Sponsorship",
    description: "Sponsor study materials, prasadam, retreats, and mentorship for youth and students learning Krishna consciousness.",
    image: "/images/hktc/hktc-nairobi-prabhupada-book-study.jpg",
    icon: "📚",
    href: "/donate/students",
  },
  {
    title: "Festival Support",
    description: "Help make Ratha Yatra, Janmashtami, Gaura Purnima, and Kirtan Safari accessible with kirtan, prasadam, and public outreach.",
    image: "/images/hero-ratha-yatra-kenya.jpg",
    icon: "🎺",
    href: "/donate/festivals",
  },
];

export const guestRooms = [
  {
    name: "Temple View Room",
    description: "A simple, peaceful room for visitors joining temple programmes and retreats.",
    price: "Enquire",
    priceUSD: "",
    capacity: "1-2 guests",
    image: "/images/guest-house/temple-view-room.jpg",
    amenities: ["Temple access", "Desk", "Quiet stay", "Vegetarian meals nearby"],
  },
  {
    name: "Sadhana Suite",
    description: "A longer-stay option for retreat guests, visiting devotees, and spiritual study visits.",
    price: "Enquire",
    priceUSD: "",
    capacity: "1-2 guests",
    image: "/images/guest-house/sadhana-suite.jpg",
    amenities: ["Private space", "Study area", "Temple schedule", "Laundry access"],
  },
  {
    name: "Family Quarters",
    description: "A practical family accommodation option for festival weekends and extended visits.",
    price: "Enquire",
    priceUSD: "",
    capacity: "Up to 4 guests",
    image: "/images/guest-house/family-quarters.jpg",
    amenities: ["Family room", "Shared living", "Retreat friendly", "Advance booking"],
  },
];

export const templeScheduleGroups = [
  {
    title: "Morning Aarti & Darshan Timings",
    timeRange: "4:30 A.M. - 12:45 P.M.",
    items: [
      { time: "4:30 A.M.", event: "Mangala Arati in the Main Temple" },
      { time: "5:00 A.M.", event: "Sri Tulasi Arati" },
      { time: "7:00 A.M.", event: "Shringar Bhoga" },
      { time: "7:15 A.M.", event: "Shringar Darshan" },
      { time: "7:20 A.M.", event: "Sri Guru Puja" },
      { time: "8:00 A.M.", event: "Srimad-Bhagavatam Class" },
      { time: "8:10 A.M.", event: "Baal Bhoga" },
      { time: "8:30 A.M.", event: "Dhoop Arati" },
      { time: "11:10 A.M.", event: "Raj Bhoga" },
      { time: "12:00 P.M.", event: "Raj Bhoga Arati" },
      { time: "12:45 P.M.", event: "Temple Closes" },
    ],
  },
  {
    title: "Evening Aarti & Darshan Timings",
    timeRange: "4:30 P.M. - 8:45 P.M.",
    items: [
      { time: "4:10 P.M.", event: "Utthapan Bhoga" },
      { time: "4:30 P.M.", event: "Uthapan Arati" },
      { time: "6:35 P.M.", event: "Sandhya Bhoga" },
      { time: "6:45 P.M.", event: "Sri Tulasi Arati" },
      { time: "7:00 P.M.", event: "Sandhya - Gaur Arati" },
      { time: "8:10 P.M.", event: "Sayana Bhoga" },
      { time: "8:30 P.M.", event: "Sayana Arati" },
      { time: "8:45 P.M.", event: "Temple Closes" },
    ],
  },
];

export const templeSchedule = templeScheduleGroups.flatMap((group) => group.items);
