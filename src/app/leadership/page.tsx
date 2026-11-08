import Image from "next/image";
import { ArrowRight, HeartHandshake } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { calendarProgrammeFacilitators, leadershipDepartments, leadershipProfiles } from "@/data/site";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "Leadership and Service Structure",
  description:
    "Meet key leaders and service coordinators guiding ISKCON Nairobi through a departmental service structure rooted in Srila Prabhupada's vision for Africa.",
}, "/leadership");

export default function LeadershipPage() {
  const featured = leadershipProfiles.find((profile) => profile.emphasis);
  const others = leadershipProfiles.filter((profile) => !profile.emphasis);

  return (
    <>
      <PageHero
        title="Leadership"
        titleAccent="& Service"
        subtitle="Guidance Structure"
        description="ISKCON Nairobi carries Srila Prabhupada's vision through senior spiritual guidance and a practical departmental service model."
        image="/images/leadership/prabhupad-initiation.jpg"
        height="md"
        className="sm:min-h-[500px]"
      />

      <section className="bg-temple-bg py-section bg-temple-texture sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionHeading eyebrow="How Nairobi Is Guided" title="A departmental model," accent="rooted in Vaishnava guidance" eyebrowClassName="eyebrow mb-4 block" accentClassName="not-italic text-gold" />
            </div>
            <div className="space-y-5 font-body text-body-md leading-relaxed text-ink/75">
              <p>
                ISKCON Nairobi is not presented here as a single-person temple-president structure. The temple now functions through a departmental service setup, with responsibilities distributed across education, worship, kirtan, outreach, hospitality, festivals, administration, and community care.
              </p>
              <p>
                This structure allows senior devotees, teachers, coordinators, resident brahmacharis, and volunteers to serve together while keeping Srila Prabhupada's vision at the centre: serious spiritual education, strong kirtan, prasadam distribution, and outreach across East Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="bg-temple-brown py-section text-sand sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
          <div className="content-width section-padding">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className="relative">
                <div className="absolute -inset-4 border border-gold/20 max-sm:hidden" />
                <Image width={1600} height={1200} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={featured.image}
                  alt={featured.name}
                  className="relative aspect-[4/5] w-full object-cover object-[center_30%] shadow-card-hover"
                />
              </div>
              <div>
                <span className="eyebrow mb-4 block text-gold">{featured.category}</span>
                <h2 className="font-display text-display-lg leading-tight text-white">
                  {featured.name}
                </h2>
                <p className="mt-3 font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  {featured.role}
                </p>
                <p className="mt-6 font-editorial text-2xl leading-relaxed text-sand/86 sm:text-3xl">
                  {featured.summary}
                </p>
                <p className="mt-5 max-w-2xl font-body text-sm leading-relaxed text-sand/75">
                  {featured.details}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-sand py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="mb-12 text-center">
            <SectionHeading eyebrow="Key Service Leaders" title="Departments led by" accent="devotee leadership" eyebrowClassName="eyebrow mb-3 block" accentClassName="not-italic text-gold" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {others.map((profile) => (
              <article key={profile.name} className="group card-surface shadow-card transition-shadow hover:shadow-card-hover">
                <div className="relative h-72 overflow-hidden">
                  <Image width={1600} height={1200} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={profile.image}
                    alt={profile.name}
                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${profile.name === "Govinda Prem Prabhu" ? "object-[7%_center]" : "object-[center_28%]"}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                      {profile.category}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-white">{profile.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {profile.role}
                  </p>
                  <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">{profile.details}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-temple-bg py-section-sm sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="mb-9 max-w-3xl">
            <SectionHeading eyebrow="Programme Facilitators" title="Guiding study" accent="and community" eyebrowClassName="eyebrow mb-3 block" accentClassName="not-italic text-gold" />
            <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">
              The temple&apos;s 2027 calendar names these devotees as facilitators for regular learning and community programmes.
            </p>
          </div>
          <div className="grid gap-x-10 md:grid-cols-2">
            {calendarProgrammeFacilitators.map((facilitator) => (
              <article key={facilitator.name} className="border-t border-temple-sand py-6">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {facilitator.programme}
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink">{facilitator.name}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">{facilitator.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-temple-bg py-section-sm sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <HeartHandshake className="mb-5 text-primary" size={28} />
              <SectionHeading eyebrow="Departmental Service" title="Many services" accent="one shared purpose" eyebrowClassName="eyebrow mb-4 block" accentClassName="not-italic text-gold" />
              <p className="mt-5 font-body text-sm leading-relaxed text-ink/75">
                Temple life is sustained through teams serving worship, education, kirtan, hospitality, outreach, festivals, administration, and community care.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
              {leadershipDepartments.map((department) => (
                <li key={department} className="border-t border-gold/25 py-4">
                  <p className="font-body text-sm font-medium text-ink/80">
                    {department}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-primary py-14 text-center text-white">
        <div className="content-width section-padding">
          <span className="eyebrow mb-4 block text-white">Founder-Acarya</span>
          <h2 className="font-display text-display-md">Discover the vision guiding ISKCON Nairobi.</h2>
          <div className="mt-7 flex justify-center">
            <ButtonLink variant="ghost" href="/srila-prabhupada">
              Read About Srila Prabhupada <ArrowRight size={14} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
