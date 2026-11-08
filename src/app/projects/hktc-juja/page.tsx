import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "HKTC Juja",
  description: "Devotional outreach for students and families around Juja, with classes, kirtan, prasadam, and spiritual mentorship.",
}, "/projects/hktc-juja");

export default function HKTCJujaPage() {
  return (
    <>
      <PageHero
        title="HKTC"
        titleAccent="Juja"
        subtitle="Student & Community Outreach"
        description="Devotional outreach for students and families around Juja, with classes, kirtan, prasadam, and spiritual mentorship."
        image="/images/hktc/hktc-juja-class.jpg"
        height="md"
        className="sm:min-h-[500px]"
      />
      <section className="py-section bg-temple-bg sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <SectionHeading
            eyebrow="Juja Outreach"
            title="Expanding Access to"
            accent="Devotional Education"
            eyebrowClassName="eyebrow block mb-4"
            titleClassName="section-title mb-6"
          />
          <p className="font-body text-ink/75 max-w-2xl leading-relaxed mb-8">
            HKTC Juja extends ISKCON Nairobi&apos;s devotional education work to the Juja area.
            Students and families can take part in classes, kirtan, prasadam, and spiritual mentorship close to home.
          </p>
          <ButtonLink variant="primary" href="/projects/hktc-nairobi">Explore HKTC Nairobi</ButtonLink>
        </div>
      </section>
    </>
  );
}
