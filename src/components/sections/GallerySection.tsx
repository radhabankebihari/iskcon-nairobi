"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const galleryImages = [
  {
    src: "/images/archive/srila-prabhupada-nairobi-devotees.webp",
    caption: "Srila Prabhupada with devotees in Nairobi",
    alt: "Archival group photograph of Srila Prabhupada seated among devotees in Nairobi",
    tone: "Early Days",
    href: "/media#early-days",
    className: "lg:col-span-5 lg:row-span-2",
    imageClass: "h-[320px] sm:h-[420px] lg:h-full",
  },
  {
    src: "/images/food-for-life/prasadam-students.jpg",
    caption: "Food For Life distribution, Kibera",
    tone: "Prasadam",
    className: "lg:col-span-3",
    imageClass: "h-[170px] sm:h-[240px] lg:h-full",
  },
  {
    src: "/images/kirtan-safari-2026-page-hero.png",
    caption: "Kirtan Safari 2026",
    alt: "Kirtan Safari artwork of devotees singing beneath an acacia tree, with giraffes and a setting sun",
    tone: "Kirtan",
    className: "lg:col-span-4",
    imageClass: "h-[170px] sm:h-[240px] lg:h-full",
  },
  {
    src: "/images/thika-farm/thika-farm-visit-gate.jpg",
    caption: "A visit to the Thika Farm and Goshala",
    tone: "Goshala",
    className: "lg:col-span-4",
    imageClass: "h-[170px] sm:h-[240px] lg:h-full",
    href: "https://drive.google.com/drive/folders/10o0rJGeiIebEz0DRN1xsaiHlxrrF8Gtw?usp=drive_link",
    external: true,
  },
  {
    src: "/images/hktc/hktc-nairobi-prabhupada-book-study.jpg",
    caption: "HKTC Nairobi students during morning class",
    tone: "Training",
    className: "lg:col-span-3",
    imageClass: "h-[170px] sm:h-[240px] lg:h-full",
  },
  {
    src: "/images/hero-ratha-yatra-kenya.jpg",
    caption: "Ratha Yatra devotees in Nairobi",
    alt: "Ratha Yatra devotees in Nairobi carrying a Hare Krishna sign",
    tone: "Festival Mood",
    className: "lg:col-span-12",
    imageClass: "h-[240px] sm:h-[300px] lg:h-full",
  },
];

export default function GallerySection() {
  return (
    <section className="relative overflow-hidden bg-temple-cream pt-10 pb-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-temple-bg/70 to-transparent" />
      <div className="content-width section-padding">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionHeading eyebrow="Our World" title="Life at" accent="ISKCON Nairobi" eyebrowClassName="eyebrow mb-3 block" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-[250px_250px_300px]">
          {galleryImages.map((img, i) => {
            const isLead = i === 0;
            const isWide = i === galleryImages.length - 1;

            return (
              <Link
                key={img.caption}
                href={img.href ?? "/media"}
                target={img.external ? "_blank" : undefined}
                rel={img.external ? "noopener noreferrer" : undefined}
                className={`group relative overflow-hidden border border-temple-sand bg-dusk shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover ${
                  isLead || isWide ? "col-span-2" : ""
                } ${i === 3 || i === 4 ? "max-sm:hidden" : ""} ${img.className}`}
              >
                <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                  src={img.src}
                  alt={img.alt ?? img.caption}
                  className={`h-full w-full object-cover image-grade transition-transform duration-700 group-hover:scale-105 ${img.imageClass}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dusk/92 via-dusk/18 to-transparent" />
                <div className="absolute inset-0 bg-gold/0 transition-colors duration-300 group-hover:bg-gold/10" />

                <div className={`absolute left-3 top-3 items-center gap-1.5 border border-white/15 bg-dusk/62 px-2 py-1 backdrop-blur-sm sm:left-4 sm:top-4 ${isLead || isWide ? "flex" : "hidden sm:flex"}`}>
                  <Camera size={isLead ? 13 : 11} className="text-gold" />
                  <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-sand/78 sm:text-xs">
                    {img.tone}
                  </span>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 ${isLead ? "p-5 sm:p-7" : isWide ? "p-4 sm:p-5" : "p-3"}`}>
                  <p
                    className={`font-display font-semibold leading-tight text-white ${
                      isLead
                        ? "max-w-md text-2xl sm:text-4xl"
                        : isWide
                          ? "text-lg sm:text-2xl lg:text-xl"
                          : "line-clamp-3 text-[0.95rem] sm:text-xl"
                    }`}
                  >
                    {img.caption}
                  </p>
                  <div className={`text-link mt-2 items-center gap-2 text-gold opacity-90 transition-opacity group-hover:opacity-100 ${isLead || isWide ? "flex" : "hidden sm:flex"}`}>
                    See the gallery <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 h-8 w-8 border-b border-r border-gold/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-start sm:mt-10">
          <Link
            href="/media"
            className="text-link tap-target flex items-center gap-2 text-gold-ink transition-all hover:gap-3"
          >
            Full gallery <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
