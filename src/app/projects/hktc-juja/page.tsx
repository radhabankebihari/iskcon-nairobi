import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "HKTC Juja",
  description: "A growing Hare Krishna Training Centre satellite campus serving students around Juja and the Greater Nairobi region.",
}, "/projects/hktc-juja");

export default function HKTCJujaPage() {
  return (
    <>
      <PageHero title="HKTC" titleAccent="Juja" subtitle="Satellite Campus" description="A growing devotional community and theological college outside Nairobi, accessible to students across the Greater Nairobi region." image="/images/hktc/hktc-juja-class.jpg" height="md" className="sm:min-h-[500px]" />
      <section className="py-section bg-temple-bg sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]"><div className="content-width section-padding"><SectionHeading eyebrow="Juja Campus" title="Expanding Access to" accent="Devotional Education" eyebrowClassName="eyebrow block mb-4" titleClassName="section-title mb-6" /><p className="font-body text-ink/75 max-w-2xl leading-relaxed mb-8">HKTC Juja was established to extend ISKCON Nairobi's educational reach beyond the city. Situated in the university town of Juja, it serves students from JKUAT and surrounding areas with the same rigorous Vaishnava curriculum offered at the Nairobi campus, in a quieter, more nature-connected environment.</p><ButtonLink variant="primary" href="/projects/hktc-nairobi">View the full HKTC programme</ButtonLink></div></section>
    </>
  );
}
