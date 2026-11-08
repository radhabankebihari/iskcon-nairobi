import Image from "next/image";
import { testimonials } from "@/data/site";
import SectionHeading from "@/components/ui/SectionHeading";

// Every voice is visible at once, in colour, with its context. Phones swipe
// sideways through the quotes so the section stays short.
export default function TestimonialsSection() {
  return (
    <section className="bg-temple-bg py-12 sm:py-[clamp(2.5rem,5vw,4.5rem)]">
      <div className="content-width section-padding">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <SectionHeading eyebrow="Stories From the Field" title="Voices of Our Community" />
        </div>

        <div
          tabIndex={0}
          role="group"
          aria-label="Community stories and profiles"
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="card-surface flex w-[82vw] max-w-sm shrink-0 snap-start flex-col p-6 sm:w-auto sm:max-w-none sm:p-7"
            >
              <blockquote className="font-editorial text-lg italic leading-relaxed text-ink sm:text-xl">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-6">
                <Image
                  src={item.image}
                  alt=""
                  width={96}
                  height={96}
                  sizes="48px"
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
                <span>
                  <span className="block font-body text-sm font-semibold text-ink">{item.name}</span>
                  <span className="block font-body text-xs text-ink/75">
                    {item.role} · {item.origin}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
