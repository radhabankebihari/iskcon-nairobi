"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import "./HeroSection.css";

type HeroCta = {
  label: string;
  variant: "primary" | "ghost";
  href: string;
};

type HeroImage = {
  src: string;
  mobileSrc?: string;
  alt: string;
  position: string;
  mobilePosition?: string;
  eyebrow: string;
  tagline: string;
  description: string;
  ctas: HeroCta[];
  durationMs?: number;
};

const baseHeroImages: HeroImage[] = [
  {
    src: "/images/hero-kartik-desktop.webp",
    mobileSrc: "/images/hero-kartik-mobile.webp",
    alt: "Radha and Krishna surrounded by flowers and glowing lamps for Kartik",
    position: "center center",
    mobilePosition: "center center",
    eyebrow: "Kartik at ISKCON Nairobi",
    tagline: "Come offer a lamp to Lord Krishna.",
    description: "26 October - 24 November 2026. Lamp offerings daily at 7:30 AM and 7:30 PM.",
    ctas: [
      { href: "/festivals/kartik", label: "Discover Kartik", variant: "primary" },
      { href: "/visit", label: "Plan your visit", variant: "ghost" },
    ],
    durationMs: 10000,
  },
  {
    src: "/images/hero-ratha-yatra-nairobi-gathering-optimized.webp",
    alt: "Devotees gather for Ratha Yatra in central Nairobi, with the city skyline behind them",
    position: "center 48%",
    mobilePosition: "52% center",
    eyebrow: "Sri Sri Radha Bankebihari Temple",
    tagline: "Faith.\u2002Community.\u2002Service.",
    description:
      "Discover Krishna Consciousness in Nairobi through worship, kirtan, prasadam, education, and service.",
    ctas: [
      { href: "/visit", label: "Visit the temple", variant: "ghost" },
      { href: "/donate", label: "Support our mission", variant: "primary" },
    ],
  },
  {
    src: "/images/hero-radha-bankebihari-darshan.webp",
    alt: "Daily darshan of Sri Sri Radha Bankebihari in red festival attire",
    position: "center 22%",
    mobilePosition: "center top",
    eyebrow: "Sri Sri Radha Bankebihari Temple",
    tagline: "Faith.\u2002Community.\u2002Service.",
    description:
      "Discover Krishna Consciousness in Nairobi through worship, kirtan, prasadam, education, and service.",
    ctas: [
      { href: "/visit", label: "Visit the temple", variant: "ghost" },
      { href: "/donate", label: "Support our mission", variant: "primary" },
    ],
  },
];

function HeroPicture({ image, isFirst }: { image: HeroImage; isFirst: boolean }) {
  const style = {
    objectPosition: image.position,
    "--hero-mobile-position": image.mobilePosition ?? image.position,
  } as CSSProperties;
  const className = "hero-bg-image object-cover";

  if (!image.mobileSrc) {
    return <Image src={image.src} alt={image.alt} fill sizes="100vw" loading={isFirst ? "eager" : "lazy"} fetchPriority={isFirst ? "high" : "auto"} className={className} style={style} />;
  }

  // Art direction: phones get a separately composed hero image.
  const common = { alt: image.alt, fill: true, sizes: "100vw", loading: isFirst ? "eager" : "lazy", fetchPriority: isFirst ? "high" : "auto" } as const;
  const { props: desktop } = getImageProps({ ...common, src: image.src });
  const { props: mobile } = getImageProps({ ...common, src: image.mobileSrc });

  return (
    <picture className="contents">
      <source media="(max-width: 900px)" srcSet={mobile.srcSet} sizes="100vw" />
      <img {...desktop} alt={image.alt} className={className} style={{ ...desktop.style, ...style }} />
    </picture>
  );
}

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [paused, setPaused] = useState(false);
  // Only the first slide downloads with the page. Each later slide is fetched
  // shortly before it appears, so a visitor who leaves early never pays for it.
  const [readySlides, setReadySlides] = useState(() => new Set([0]));
  const rotationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroImages = baseHeroImages;

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && !connection?.saveData) return;
    const timer = setTimeout(() => setPaused(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (rotationRef.current) clearTimeout(rotationRef.current);
    if (paused) return;

    rotationRef.current = setTimeout(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, heroImages[currentImage].durationMs ?? 6000);

    return () => {
      if (rotationRef.current) clearTimeout(rotationRef.current);
    };
  }, [currentImage, heroImages, paused]);

  useEffect(() => {
    if (paused) return;
    const nextSlide = (currentImage + 1) % heroImages.length;
    const timer = setTimeout(() => {
      setReadySlides((ready) => (ready.has(nextSlide) ? ready : new Set(ready).add(nextSlide)));
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentImage, heroImages.length, paused]);

  const showSlide = (index: number) => {
    setReadySlides((ready) => (ready.has(index) ? ready : new Set(ready).add(index)));
    setCurrentImage(index);
  };

  const currentHero = heroImages[currentImage];

  return (
    <section className="home-hero relative w-full h-[88svh] min-h-[620px] max-h-[1000px] overflow-hidden sm:h-screen sm:min-h-[600px]">
      {/* The visible tagline rotates with each slide, so the page heading stays
          fixed for search engines and screen readers. */}
      <h1 className="sr-only">ISKCON Nairobi: Sri Sri Radha Bankebihari Temple</h1>
      {/* Background Images */}
      {heroImages.map((image, i) => (
        <div
          key={image.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-2000 ease-in-out",
            i === currentImage ? "opacity-100" : "opacity-0"
          )}
        >
          {readySlides.has(i) ? <HeroPicture image={image} isFirst={i === 0} /> : null}
        </div>
      ))}

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-sunset/20 via-primary/10 to-dusk/55 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-dusk/30 via-dusk/20 to-dusk/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-dusk/70 via-dusk/20 to-transparent" />

      {/* Subtle gold accent at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Main Content */}
        <div className="hero-main flex-1 flex items-end pb-4 section-padding content-width sm:pb-10 lg:pb-14">
          <div className="hero-copy max-w-3xl">
            {/* Entrances use CSS only, so this copy shows without waiting for JavaScript. */}
            {/* Eyebrow */}
            <div className="hero-eyebrow flex items-center gap-3 mb-4 motion-safe:animate-fade-up [animation-fill-mode:both]">
              <span className="eyebrow text-gold">{currentHero.eyebrow}</span>
            </div>

            {/* Gold rule */}
            <div
              className="hero-rule my-6 h-px w-64 bg-gradient-to-r from-gold via-gold/60 to-transparent motion-safe:animate-fade-in [animation-fill-mode:both]"
            />

            {/* Tagline - the signature element */}
            <div className="hero-tagline motion-safe:animate-fade-up [animation-delay:150ms] [animation-fill-mode:both]">
              <p className="font-editorial text-temple-cream/90 text-shadow" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.25rem)", lineHeight: 1.3, fontStyle: "italic" }}>
                {currentHero.tagline}
              </p>
              <p className="font-body text-white/70 mt-4 text-sm sm:text-base tracking-wide max-w-md leading-relaxed">
                {currentHero.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="hero-ctas flex flex-col gap-3 mt-8 motion-safe:animate-fade-up [animation-delay:300ms] [animation-fill-mode:both] sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              {currentHero.ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={cta.variant === "primary" ? "btn-primary" : "btn-ghost"}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="hero-bottom section-padding content-width pb-5 sm:pb-8">
          <div className="flex items-end justify-between">
            {/* Image Dots */}
            <div className="-ml-2.5 flex items-center">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => showSlide(i)}
                  className="group flex h-11 w-11 items-center justify-center"
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === currentImage ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "h-1 transition-all duration-300",
                      i === currentImage ? "w-8 bg-gold" : "w-2 bg-white/60 group-hover:bg-white/80"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="flex flex-col items-center gap-2 text-white/70">
              <span className="font-body text-xs tracking-[0.15em] uppercase">Scroll</span>
              <ArrowDown size={14} className="animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
