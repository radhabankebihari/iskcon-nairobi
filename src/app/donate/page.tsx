import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { templeGiving, templeInfo } from "@/data/site";
import { withSeo } from "@/lib/seo";
import MpesaPayCard from "@/components/donate/MpesaPayCard";
import GiveFollowUp from "@/components/donate/GiveFollowUp";
import CauseCard from "@/components/donate/CauseCard";
import { givingCauses } from "@/components/donate/givingCauses";

export const metadata = withSeo({
  title: "Donate",
  description: "Support ISKCON Nairobi's temple, Food For Life, cow protection, student sponsorship, and festival programmes.",
}, "/donate");

const reassurances = [
  "Pay straight to the temple's M-Pesa Paybill.",
  "Tell us the cause in your message, or give to the General Fund.",
  "Receipts are sent on request.",
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        title="Support the"
        titleAccent="Mission"
        subtitle="Give With Purpose"
        description="Your gift sustains daily worship, prasadam for those who need it, cow care, students, and festivals open to all of Nairobi."
        image="/images/donate/main-altar-offering.jpg"
        facts={[`M-Pesa Paybill ${templeGiving.mpesaPaybill}`, `Account ${templeGiving.mpesaAccount}`, "Receipts on request"]}
      />

      <section className="bg-temple-cream pt-10 pb-6 sm:pt-12 sm:pb-8">
        <div className="content-width section-padding">
          {/* Phones: intro, then the payment card, then the details. Desktop: text left, card right. */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0">
            <div className="max-w-xl lg:self-end">
              <SectionHeading eyebrow="How to Give" title="Give in a few taps" />
              <p className="mt-4 font-body text-base leading-relaxed text-ink/75">
                M-Pesa is the quickest way to give. Pay to the temple&apos;s Paybill, then send a short message so we
                can thank you and direct your gift. To support something specific, choose a cause below.
              </p>
            </div>
            <MpesaPayCard showFollowUp={false} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start" />
            <div className="lg:self-start">
              <ul className="space-y-3 lg:mt-6">
                {reassurances.map((line) => (
                  <li key={line} className="flex gap-3 font-body text-sm leading-relaxed text-ink/80">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-acacia" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
              <GiveFollowUp className="mt-8 border-t border-temple-sand pt-6" />
              <p className="mt-6 font-body text-sm leading-relaxed text-ink/75">
                Prefer to give in person? Visit the temple office at {templeInfo.shortAddress}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="causes" className="scroll-mt-24 bg-temple-bg pt-0 pb-12 sm:pb-16">
        <div className="content-width section-padding">
          <div className="mx-auto mb-8 max-w-2xl border-t border-temple-sand pt-8 text-center sm:mb-10 sm:pt-10">
            <SectionHeading eyebrow="Choose Your Cause" title="Where Your Gift Goes" />
            <p className="mt-3 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
              Each cause has its own page with what your gift supports and how to give to it.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {givingCauses.map((cause) => (
              <CauseCard key={cause.slug} cause={cause} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
