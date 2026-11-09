import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import ButtonLink from "@/components/ui/ButtonLink";
import FestivalDateNote from "@/components/festivals/FestivalDateNote";
import SharePageButton from "@/components/ui/SharePageButton";

// Re-render daily so the next festival date stays current.
export const revalidate = 86400;

export const metadata = withSeo({
  title: "Gaura Purnima",
  description: "Celebrate Sri Chaitanya Mahaprabhu's appearance day at ISKCON Nairobi with kirtan, abhishek, class, and prasadam.",
}, "/festivals/gaura-purnima");

export default function GauraPurnimaPage() {
  const description = "Gaura Purnima is the appearance day of Sri Chaitanya Mahaprabhu, celebrated with fasting, kirtan, abhishek, class, and an evening feast.";
  return (
    <>
      <PageHero
        shareTitle="Gaura Purnima"
        shareLabel="Share this festival"
        title="Gaura Purnima"
        subtitle="Appearance of Sri Chaitanya"
        description={description}
        image="/images/festivals/gaura-purnima-child-nimai.webp"
        height="lg"
      />
      <section className="py-section bg-temple-bg">
        <div className="content-width section-padding max-w-3xl">
          <p className="font-body text-ink/75 leading-relaxed mb-8">{description}</p>
          <FestivalDateNote pattern={/^Gaura Purnima/} name="Gaura Purnima" className="mb-2" />
          <div className="mb-6"><SharePageButton title="Gaura Purnima" label="Share this festival" tone="light" /></div>
          <p className="font-body text-ink/75 leading-relaxed mb-8">Contact the temple for this year's abhishek and feast schedule.</p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink variant="primary" href="/donate/festivals">Support this festival</ButtonLink>
            <ButtonLink variant="outline" href="/contact" className="border-gold text-gold hover:bg-gold hover:text-white">Register interest</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
