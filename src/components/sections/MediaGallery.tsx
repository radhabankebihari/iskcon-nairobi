"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryImage = {
  src: string;
  caption: string;
  alt: string;
  category: "Early Days" | "Temple Life" | "Farm & Goshala";
  width: number;
  height: number;
};

// These are archival photographs. Captions avoid dates and identities that the
// supplied images alone cannot establish; keep that standard for new additions.
const images: GalleryImage[] = [
  {
    src: "/images/archive/srila-prabhupada-nairobi-devotees.webp",
    caption: "Srila Prabhupada with devotees in Nairobi",
    alt: "Archival group photograph of Srila Prabhupada seated among devotees outside a Nairobi building",
    category: "Early Days",
    width: 1600,
    height: 1200,
  },
  {
    src: "/images/archive/harinam-crowd-and-van.webp",
    caption: "A crowd gathers for harinam",
    alt: "Archival black-and-white photograph of devotees and a crowd beside a Hare Krishna van",
    category: "Early Days",
    width: 1538,
    height: 820,
  },
  {
    src: "/images/archive/devotees-in-street-procession.webp",
    caption: "Devotees take kirtan to the streets",
    alt: "Archival black-and-white photograph of devotees walking in a street procession with a devotional painting",
    category: "Early Days",
    width: 389,
    height: 580,
  },
  {
    src: "/images/archive/nairobi-street-procession.webp",
    caption: "A procession through central Nairobi",
    alt: "Archival black-and-white photograph of devotees chanting on a Nairobi street",
    category: "Early Days",
    width: 341,
    height: 580,
  },
  {
    src: "/images/archive/devotees-sharing-prasadam.webp",
    caption: "Devotees share prasadam",
    alt: "Archival black-and-white photograph of two devotees seated together for prasadam",
    category: "Early Days",
    width: 580,
    height: 438,
  },
  {
    src: "/images/archive/rural-kirtan-gathering.webp",
    caption: "Kirtan with a rural community",
    alt: "Archival colour photograph of devotees chanting with a crowd near thatched buildings",
    category: "Early Days",
    width: 726,
    height: 821,
  },
  {
    src: "/images/archive/devotees-chanting-by-van.webp",
    caption: "Chanting beside the travelling van",
    alt: "Archival colour photograph of devotees singing beside a Hare Krishna van",
    category: "Early Days",
    width: 590,
    height: 977,
  },
  {
    src: "/images/archive/street-kirtan-with-cymbals.webp",
    caption: "Street kirtan with kartals and mridanga",
    alt: "Archival colour photograph of devotees playing cymbals and a drum during street kirtan",
    category: "Early Days",
    width: 500,
    height: 324,
  },
  {
    src: "/images/archive/travelling-sankirtan-van.webp",
    caption: "The travelling sankirtan van",
    alt: "Archival colour photograph of a Hare Krishna van and devotees in an open landscape",
    category: "Early Days",
    width: 548,
    height: 343,
  },
  {
    src: "/images/archive/outdoor-hare-krishna-gathering.webp",
    caption: "An outdoor Hare Krishna gathering",
    alt: "Archival colour photograph of a crowd gathered at an outdoor Hare Krishna event",
    category: "Early Days",
    width: 609,
    height: 395,
  },
  {
    src: "/images/iskcon-nairobi-full-altar.webp",
    caption: "Main altar at ISKCON Nairobi",
    alt: "Full view of the main altar and deities at ISKCON Nairobi",
    category: "Temple Life",
    width: 1600,
    height: 897,
  },
  {
    src: "/images/thika-farm/thika-farm-2022-017.webp",
    caption: "Devotees gather for kirtan at Thika Farm",
    alt: "Devotees raising their hands in kirtan before the farm altar",
    category: "Farm & Goshala",
    width: 2000,
    height: 1132,
  },
  {
    src: "/images/thika-farm/thika-farm-2022-192.webp",
    caption: "Kirtan on the farm veranda",
    alt: "Devotees seated together and clapping during kirtan",
    category: "Farm & Goshala",
    width: 2000,
    height: 1132,
  },
  {
    src: "/images/thika-farm/thika-farm-2022-142.webp",
    caption: "Cows at the feeding stalls",
    alt: "Brown and black-and-white cows gathered at the goshala feeding stalls",
    category: "Farm & Goshala",
    width: 2000,
    height: 1132,
  },
  {
    src: "/images/thika-farm/thika-farm-2022-199.webp",
    caption: "The goshala herd at Thika Farm",
    alt: "Cows gathered in the outdoor goshala enclosure",
    category: "Farm & Goshala",
    width: 2000,
    height: 1132,
  },
  {
    src: "/images/thika-farm/thika-farm-2022-143.webp",
    caption: "Flowers in the farm garden",
    alt: "Red hibiscus flower growing in the farm garden",
    category: "Farm & Goshala",
    width: 2000,
    height: 1132,
  },
  {
    src: "/images/thika-farm/thika-farm-2022-139.webp",
    caption: "Inside the goshala",
    alt: "Cows sheltered inside the Thika Farm goshala",
    category: "Farm & Goshala",
    width: 2000,
    height: 1132,
  },
];

const categories = ["All", "Early Days", "Temple Life", "Farm & Goshala"] as const;

export default function MediaGallery() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visibleImages = category === "All" ? images : images.filter((image) => image.category === category);

  useEffect(() => {
    const selectLinkedCategory = () => {
      if (window.location.hash === "#farm-goshala") setCategory("Farm & Goshala");
      if (window.location.hash === "#early-days") setCategory("Early Days");
    };
    selectLinkedCategory();
    window.addEventListener("hashchange", selectLinkedCategory);
    return () => window.removeEventListener("hashchange", selectLinkedCategory);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected !== null && !dialog.open) dialog.showModal();
    if (selected === null && dialog.open) dialog.close();
  }, [selected]);

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setSelected((current) => current === null ? null : (current + 1) % visibleImages.length);
      if (event.key === "ArrowLeft") setSelected((current) => current === null ? null : (current - 1 + visibleImages.length) % visibleImages.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, visibleImages.length]);

  const activeImage = selected === null ? null : visibleImages[selected];
  const activeIndex = selected ?? 0;

  return (
    <div id="early-days" className="scroll-mt-32">
      <div id="farm-goshala" className="scroll-mt-32" />
      <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter photographs">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => { setCategory(item); setSelected(null); }}
            className={`min-h-11 border px-4 py-2 font-body text-sm font-semibold transition-colors ${category === item ? "border-gold bg-gold text-ink" : "border-temple-sand text-ink/75 hover:border-gold hover:text-gold-ink"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {visibleImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setSelected(index)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden border border-temple-sand bg-white text-left transition-colors hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              style={image.src === "/images/iskcon-nairobi-full-altar.webp" ? { filter: "brightness(1.1) contrast(1.04)" } : undefined}
            />
            <span className="block px-3 pb-3 pt-2">
              <span className="block font-body text-xs font-semibold uppercase text-gold-ink">{image.category}</span>
              <span className="mt-1 block font-display text-base font-semibold leading-snug text-ink">{image.caption}</span>
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        onClick={(event) => { if (event.target === dialogRef.current) setSelected(null); }}
        aria-label={activeImage?.caption ?? "Photograph viewer"}
        className="m-auto max-h-[96vh] w-[min(96vw,1100px)] max-w-none overflow-hidden border border-white/20 bg-dusk p-0 text-white backdrop:bg-black/85"
      >
        {activeImage && (
          <div className="flex max-h-[96vh] flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-2">
              <p className="min-w-0 truncate font-display text-base font-semibold">{activeImage.caption}</p>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close photograph" className="flex h-11 w-11 shrink-0 items-center justify-center hover:text-gold"><X size={22} /></button>
            </div>
            <div className="relative min-h-0 flex-1 bg-black">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                width={activeImage.width}
                height={activeImage.height}
                sizes="96vw"
                className="mx-auto max-h-[calc(96vh-116px)] w-auto max-w-full object-contain"
                style={activeImage.src === "/images/iskcon-nairobi-full-altar.webp" ? { filter: "brightness(1.1) contrast(1.04)" } : undefined}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-1 font-body text-xs text-white/75">
              {visibleImages.length > 1 ? <button type="button" onClick={() => setSelected((activeIndex - 1 + visibleImages.length) % visibleImages.length)} aria-label="Previous photograph" className="flex h-11 w-11 items-center justify-center hover:text-gold"><ChevronLeft size={22} /></button> : <span className="h-11 w-11" />}
              <span>{activeIndex + 1} of {visibleImages.length}</span>
              {visibleImages.length > 1 ? <button type="button" onClick={() => setSelected((activeIndex + 1) % visibleImages.length)} aria-label="Next photograph" className="flex h-11 w-11 items-center justify-center hover:text-gold"><ChevronRight size={22} /></button> : <span className="h-11 w-11" />}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
