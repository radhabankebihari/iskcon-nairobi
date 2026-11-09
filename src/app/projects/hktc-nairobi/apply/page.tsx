import PageHero from "@/components/ui/PageHero";
import { templeInfo } from "@/data/site";
import { withSeo } from "@/lib/seo";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "Apply - HKTC Nairobi",
  description: "Express interest in Hare Krishna Training Centre programmes connected with ISKCON Nairobi.",
  robots: { index: false, follow: false },
}, "/projects/hktc-nairobi/apply");

export default function HktcApplyPage() {
  return (
    <>
      <PageHero
        title="HKTC"
        titleAccent="Application"
        subtitle="Study Interest"
        description="Tell the education team which course or study pathway you are interested in."
        image="/images/hktc/hktc-nairobi-student-class.jpg"
        imageAlt="HKTC Nairobi students studying together"
        height="sm"
      />
      <section className="py-section bg-temple-bg">
        <div className="content-width section-padding max-w-3xl">
          <div className="card-surface p-8 lg:p-10">
            <h2 className="section-title mb-4">Request Admissions Guidance</h2>
            <p className="font-body text-ink/75 leading-relaxed mb-8">
              Email the temple office with your name, contact number, location, and the study area you are interested in. The education team can confirm the next available intake and requirements.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`mailto:${templeInfo.email}?subject=HKTC%20Nairobi%20Application%20Interest`} className="btn-primary">
                Email your interest
              </a>
              <ButtonLink variant="outline" href="/projects/hktc-nairobi">
                Back to HKTC
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
