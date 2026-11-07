import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import ButtonLink from "@/components/ui/ButtonLink";
import FestivalDateNote from "@/components/festivals/FestivalDateNote";

// Re-render daily so the next festival date stays current.
export const revalidate = 86400;

export const metadata = withSeo({
  title: "Ratha Yatra",
  description: "Join ISKCON Nairobi's Festival of Chariots with Lord Jagannath, kirtan, procession, dance, and prasadam distribution.",
}, "/festivals/rath-yatra");

export default function RathYatraPage() {
  const description = "Ratha Yatra is the Festival of Chariots, a public celebration of Lord Jagannath with kirtan, procession, dance, and prasadam distribution in Nairobi.";
  return (
    <>
      <PageHero
        title="Ratha Yatra"
        subtitle="Festival of Chariots"
        description={description}
        image="/images/festivals/ratha-yatra-procession.jpg"
        height="lg"
      />
      <section className="py-section bg-temple-bg">
        <div className="content-width section-padding max-w-3xl">
          <p className="font-body text-ink/75 leading-relaxed mb-8">{description}</p>
          <FestivalDateNote
            pattern={/^Ratha Yatra/}
            name="Ratha Yatra"
            note="This is the traditional calendar date. The Nairobi procession date and route are announced by the temple once permits and logistics are confirmed."
            className="mb-8"
          />
          <div className="flex flex-wrap gap-4">
            <ButtonLink variant="primary" href="/donate/festivals">Support this festival</ButtonLink>
            <ButtonLink variant="outline" href="/contact" className="border-gold text-gold hover:bg-gold hover:text-white">Register interest</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
