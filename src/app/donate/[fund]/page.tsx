import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import StructuredPageData from "@/components/seo/StructuredPageData";
import MpesaPayCard from "@/components/donate/MpesaPayCard";
import DonationIcon from "@/components/ui/DonationIcon";
import { givingCauses } from "@/components/donate/givingCauses";

type Props = {
  params: Promise<{ fund: string }>;
};

function getCause(slug: string) {
  const cause = givingCauses.find((item) => item.slug === slug);
  if (!cause) notFound();
  return cause;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).fund;
  const cause = getCause(slug);
  return withSeo({ title: `Donate - ${cause.title}`, description: cause.description }, `/donate/${slug}`);
}

/** One cause: its photo and purpose beside the M-Pesa steps, with the cause named in the receipt message. */
export default async function DonateFundPage({ params }: Props) {
  const cause = getCause((await params).fund);
  const others = givingCauses.filter((item) => item.slug !== cause.slug);

  return (
    <>
      <StructuredPageData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Donate", path: "/donate" }, { name: cause.title, path: cause.href }]} />
      <PageHero
        title="Donate to"
        titleAccent={cause.title}
        subtitle="Support ISKCON Nairobi"
        variant="compact"
      />

      <section className="bg-temple-cream py-10 sm:py-14">
        <div className="content-width section-padding">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-12">
            <div>
              <div className="relative aspect-[16/9] overflow-hidden shadow-card">
                <Image
                  src={cause.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-6 flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <DonationIcon href={cause.href} />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink">What your gift supports</h2>
                  <p className="mt-2 font-body text-base leading-relaxed text-ink/75">{cause.description}</p>
                </div>
              </div>
            </div>
            <MpesaPayCard cause={cause} className="lg:sticky lg:top-32" />
          </div>

          <nav aria-label="Other causes" className="mt-12 border-t border-temple-sand pt-8">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">Other causes</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center gap-2 border border-temple-sand bg-white px-4 font-body text-sm font-semibold text-ink transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <DonationIcon href={item.href} size={16} className="text-primary" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/donate" className="text-link tap-target mt-6 text-primary">
              <ArrowLeft size={14} aria-hidden="true" /> All giving options
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
