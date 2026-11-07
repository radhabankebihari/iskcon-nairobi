import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Music,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";
import FestivalDateNote from "@/components/festivals/FestivalDateNote";

// Re-render daily so the next festival date stays current.
export const revalidate = 86400;

export const metadata = withSeo({
  title: "Krishna Janmashtami",
  description:
    "Celebrate Sri Krishna Janmashtami, the biggest festival of the year at ISKCON Nairobi, with kirtan, midnight arati, abhishek, classes, offerings, drama, seva, and prasadam.",
}, "/festivals/janmashtami");

const story = [
  {
    title: "A prophecy in Mathura",
    text: "King Kamsa heard that the eighth child of his sister Devaki and Vasudeva would end his tyranny. Out of fear, he imprisoned them and tried to stop the Lord's plan.",
  },
  {
    title: "Krishna appears at midnight",
    text: "On the dark eighth night of the month of Bhadra, Lord Krishna appeared in the prison cell, first revealing His divine form before becoming a beautiful child.",
  },
  {
    title: "The journey to Gokula",
    text: "By Krishna's arrangement, the prison doors opened. Vasudeva carried the Lord across the Yamuna to Gokula and placed Him under the care of Nanda Maharaja and Mother Yashoda.",
  },
  {
    title: "Vrindavan awakens",
    text: "The child Krishna grew in Vraja, enchanting everyone with His flute, protecting the devotees, and revealing that divine love is the highest treasure.",
  },
];

const engagements = [
  { icon: Music, title: "Kirtan throughout the day", text: "Devotees gather for holy name chanting, bhajans, and festival kirtan leading into the midnight celebration." },
  { icon: Sparkles, title: "Midnight arati and darshan", text: "The temple mood rises toward the sacred moment of Krishna's appearance with worship, lamps, and special darshan." },
  { icon: BookOpen, title: "Classes and drama", text: "Talks, readings, children's presentations, and drama help the whole family enter the story of Krishna's birth." },
  { icon: Utensils, title: "Offerings and prasadam", text: "Devotees prepare offerings for the Lord and share sanctified vegetarian prasadam after the festival programme." },
  { icon: HeartHandshake, title: "Festival seva", text: "Service teams help with garlands, cooking, cleaning, guest care, crowd flow, media, and many practical festival needs." },
  { icon: Users, title: "Community celebration", text: "Families, students, guests, and friends fill the temple in one of the most joyful devotional gatherings of the year." },
];

const quickNotes = [
  "Biggest temple celebration of the year",
  "Fasting and special worship",
  "Midnight appearance programme",
  "Family friendly engagement",
];

export default function JanmashtamiPage() {
  return (
    <>
      <PageHero
        title="Krishna Janmashtami"
        subtitle="Appearance of Lord Krishna"
        description="The biggest celebration of the year at ISKCON Nairobi, honouring the divine appearance of Lord Krishna with worship, kirtan, drama, service, and prasadam."
        image="/images/calendar-janmashtami-krishna.jpeg"
        height="lg"
        className="festival-page-hero"
      />

      <section className="festival-intro bg-temple-bg bg-temple-texture py-[clamp(2.4rem,12vw,3.25rem)] sm:py-[clamp(3rem,5vw,5rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <SectionHeading eyebrow="Festival of Krishna's appearance" title="The night when hope entered the prison of Mathura" titleClassName="section-title max-w-3xl" />
              <p className="mt-5 max-w-3xl font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                Janmashtami remembers the moment Lord Krishna appeared to protect the devotees and draw the world back to love of God. In the Srimad-Bhagavatam, His birth is not an ordinary event. It is a divine appearance, filled with purpose, compassion, and the promise that dharma can be restored even in the darkest hour.
              </p>
            </div>
            <div className="border border-gold/25 bg-white/75 p-5 shadow-sm sm:p-6">
              <p className="font-display text-2xl leading-tight text-ink sm:text-3xl">
                Biggest celebration of the year
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {quickNotes.map((note) => (
                  <div key={note} className="border border-temple-sand bg-temple-cream/70 px-3 py-3">
                    <p className="font-body text-xs font-semibold uppercase leading-snug tracking-[0.08em] text-primary">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="festival-story bg-white py-[clamp(2.4rem,12vw,3.25rem)] sm:py-[clamp(3rem,5vw,5rem)]">
        <div className="content-width section-padding">
          <div className="mb-8 max-w-3xl sm:mb-10">
            <SectionHeading eyebrow="Backstory" title="From Kamsa's fear to Vrindavan's joy" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {story.map((item, index) => (
              <article key={item.title} className="border border-temple-sand bg-temple-bg p-5 sm:p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center bg-primary font-body text-sm font-bold text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="festival-engagement bg-dusk py-[clamp(2.4rem,12vw,3.25rem)] text-temple-cream sm:py-[clamp(3rem,5vw,5rem)]">
        <div className="content-width section-padding">
          <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionHeading eyebrow="Devotional engagement" title="A festival that involves the whole community" eyebrowClassName="eyebrow block mb-3 text-gold" titleClassName="section-title-light max-w-3xl" />
            </div>
            <p className="max-w-xl font-body text-sm leading-relaxed text-temple-cream/64">
              Janmashtami is designed for participation. Devotees do not simply watch the festival; they sing, serve, decorate, cook, welcome guests, sponsor offerings, and bring family and friends into Krishna's celebration.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engagements.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="border border-gold/18 bg-white/[0.04] p-5 sm:p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center border border-gold/35 text-gold">
                    <Icon size={19} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-temple-cream/62">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="festival-visit bg-temple-bg py-[clamp(2.4rem,12vw,3.25rem)] sm:py-[clamp(3rem,5vw,5rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-6 border border-gold/25 bg-white p-5 sm:p-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="eyebrow block mb-3">Plan around the festival</span>
              <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                Come early, serve deeply, stay for the midnight celebration
              </h2>
            </div>
            <div>
              <FestivalDateNote pattern={/^Janmashtami|Janmashtami - /} name="Janmashtami" className="mb-3" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex gap-3 border border-temple-sand bg-temple-cream/60 p-4">
                  <CalendarDays className="mt-0.5 shrink-0 text-gold" size={18} />
                  <p className="font-body text-sm leading-relaxed text-ink/75">
                    The detailed programme is announced closer to the date through the temple noticeboard and official channels.
                  </p>
                </div>
                <div className="flex gap-3 border border-temple-sand bg-temple-cream/60 p-4">
                  <HeartHandshake className="mt-0.5 shrink-0 text-gold" size={18} />
                  <p className="font-body text-sm leading-relaxed text-ink/75">
                    Festival sponsorship and volunteer service help welcome every guest with care and prasadam.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink variant="primary" href="/donate/festivals">
                  Support this festival <ArrowRight size={14} />
                </ButtonLink>
                <ButtonLink variant="outline" href="/festivals" className="border-gold text-gold hover:bg-gold hover:text-white">
                  Explore All Festivals
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
