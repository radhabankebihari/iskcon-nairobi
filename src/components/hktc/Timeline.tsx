type TimelineEntry = {
  year: string;
  title: string;
  detail: string;
};

const entries: TimelineEntry[] = [
  {
    year: "2011",
    title: "HKTC Activities Begin",
    detail:
      "HKTC's work in Kenya began in April 2011, laying the foundation for a dedicated student training programme in Nairobi.",
  },
  {
    year: "2017",
    title: "Official Opening",
    detail:
      "HKTC Nairobi was officially opened on 11 January 2017, blessed by H.H. Gopal Krishna Goswami Maharaja.",
  },
  {
    year: "Ongoing",
    title: "Annual Study Cycles",
    detail:
      "Each year, students move sequentially through Srila Prabhupada's books, culminating in examinations and a graduation ceremony.",
  },
  {
    year: "Today",
    title: "A Growing Community",
    detail:
      "HKTC has reached 10,000+ students from 15+ nations, now supporting two dedicated residences for men and women in Nairobi.",
  },
];

export default function Timeline() {
  return (
    <ol className="relative space-y-10 border-l border-temple-sand pl-8 sm:pl-10">
      {entries.map((entry) => (
        <li key={entry.year} className="relative">
          <span className="absolute -left-[calc(2rem+5px)] top-1 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-gold ring-4 ring-temple-bg sm:-left-[calc(2.5rem+5px)]" />
          <span className="eyebrow mb-1 block text-gold">{entry.year}</span>
          <h3 className="font-display text-xl font-semibold text-ink">{entry.title}</h3>
          <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-ink/75">
            {entry.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
