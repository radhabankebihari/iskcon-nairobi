import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DonationIcon from "@/components/ui/DonationIcon";
import type { GivingCause } from "@/components/donate/givingCauses";

/**
 * A cause on the donate page. The whole card opens that cause's giving page.
 * Phones get a compact row with a square photo; wider screens get a full card.
 */
export default function CauseCard({ cause }: { cause: GivingCause }) {
  const isGeneral = cause.slug === "general";

  return (
    <Link
      href={cause.href}
      data-giving-cause={cause.slug}
      className="group card-surface flex overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover sm:flex-col sm:hover:-translate-y-0.5"
    >
      <div className="relative w-28 shrink-0 overflow-hidden sm:aspect-[16/10] sm:w-auto">
        <Image
          src={cause.image}
          alt=""
          fill
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-black/35 to-transparent sm:block" />
        <span className="absolute left-4 top-4 hidden h-10 w-10 items-center justify-center border border-primary/30 bg-white/95 text-primary shadow-sm sm:flex">
          <DonationIcon href={cause.href} size={20} />
        </span>
        {isGeneral && (
          <span className="absolute right-4 top-4 hidden bg-gold px-2.5 py-1 font-body text-xs font-bold text-dusk sm:block">
            Where most needed
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
        {isGeneral && (
          <span className="mb-1 self-start bg-gold/20 px-2 py-0.5 font-body text-xs font-bold text-gold-ink sm:hidden">
            Where most needed
          </span>
        )}
        <h3 className="font-display text-lg font-semibold leading-tight text-ink sm:text-xl">{cause.title}</h3>
        <p className="mt-1.5 flex-1 font-body text-sm leading-relaxed text-ink/75 line-clamp-2 sm:mt-2 sm:line-clamp-3">
          {cause.description}
        </p>
        <span className="text-link mt-3 text-primary sm:mt-4">
          <span className="sm:hidden">Give</span>
          <span className="hidden sm:inline">Give to {cause.title}</span>
          <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
