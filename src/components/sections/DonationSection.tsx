import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { donationPaths, templeGiving } from "@/data/site";
import DonationIcon from "@/components/ui/DonationIcon";

// Short names for the cause links under the main invitation.
const causeLabels: Record<string, string> = {
  "/donate/temple": "Worship",
  "/donate/food": "Prasadam",
  "/donate/cows": "Cow care",
  "/donate/students": "Students",
  "/donate/festivals": "Festivals",
};

// A single invitation to give. The causes, payment steps, and cause pages live
// on /donate, so the homepage makes the case, offers M-Pesa for those ready to
// give now, and links each cause to its own page.
export default function DonationSection() {
  return (
    <section aria-labelledby="support-heading" className="bg-dusk pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="content-width section-padding">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div>
            <span className="eyebrow mb-3 block text-gold">Make a Difference</span>
            <h2 id="support-heading" className="max-w-lg font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Support the Mission
            </h2>
          </div>
          <div className="lg:border-l-2 lg:border-gold/70 lg:pl-7">
            <p className="max-w-2xl font-body text-base leading-relaxed text-sand/90 sm:text-lg">
              Your gift keeps the temple&apos;s daily worship going and helps share prasadam, care for the cows at Thika,
              mentor students, and open our festivals to all of Nairobi.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link href="/donate" className="btn-primary w-full justify-center sm:w-auto" data-donation-cta>
                Give to the temple <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <p className="font-body text-sm text-sand/80">
                Or by M-Pesa: <span className="whitespace-nowrap font-semibold text-white">Paybill {templeGiving.mpesaPaybill}</span>
                , <span className="whitespace-nowrap font-semibold text-white">account {templeGiving.mpesaAccount}</span>
              </p>
            </div>
          </div>
        </div>

        <nav aria-label="Give to a cause" className="mt-8 border-t border-white/20 pt-2 sm:mt-10">
          <ul className="flex flex-wrap gap-x-4 sm:gap-x-2">
            {donationPaths.map((path) => (
              <li key={path.href}>
                <Link
                  href={path.href}
                  className="group inline-flex min-h-11 items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.02em] text-sand/75 transition-colors hover:text-gold sm:gap-2 sm:px-2 sm:tracking-[0.08em] sm:first:pl-0"
                >
                  <DonationIcon href={path.href} size={14} className="text-gold/80" />
                  {causeLabels[path.href] ?? path.title}
                  <ArrowRight
                    size={12}
                    aria-hidden="true"
                    className="hidden opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
