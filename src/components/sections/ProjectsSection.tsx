"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/site";
import SectionHeading from "@/components/ui/SectionHeading";

const tagChip: Record<string, string> = {
  Education: "bg-gold/95 text-dusk",
  Agriculture: "bg-acacia/95 text-white",
  "Community Service": "bg-sunset/95 text-white",
};

const pinTone: Record<string, string> = {
  Education: "text-gold border-gold/60",
  Agriculture: "text-acacia border-acacia/60",
  "Community Service": "text-sunset border-sunset/60",
};

export default function ProjectsSection() {
  return (
    <section id="our-work" className="projects-scene relative overflow-hidden bg-temple-bg bg-temple-texture scroll-mt-24">
      <div className="content-width section-padding pb-section pt-8 sm:pt-10">
        {/* Header */}
        <div className="grid items-end gap-7 border-t-2 border-gold/35 pt-7 sm:pt-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Our Work" title="Where Devotion" accent="Meets Action" />
          </div>
          <div className="lg:pb-1">
            <p className="max-w-md font-editorial text-lg italic leading-relaxed text-ink/75 sm:text-xl">
              Four ways the temple&rsquo;s mission takes shape on the ground &mdash;
              classrooms, farms, kitchens, and communities you can step into and serve.
            </p>
            <Link
              href="/projects"
              className="text-link tap-target projects-explain mt-5 inline-flex items-center gap-2 text-sunset transition-colors hover:text-primary"
            >
              Explore all projects <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Route / field-notes strip */}
        <div className="projects-route relative mt-12 lg:mt-16">
          <ol className="relative grid list-none grid-cols-1 gap-y-12 p-0 sm:p-0 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
            {projects.map((project, index) => {
              const chip = tagChip[project.tag] ?? "bg-primary/95 text-white";
              const tone = pinTone[project.tag] ?? "text-primary border-primary/60";
              const stagger =
                index % 2 === 1
                  ? "lg:col-start-7 lg:translate-y-10"
                  : "lg:col-start-1 lg:translate-y-0";
              const number = String(index + 1).padStart(2, "0");

              return (
                <li
                  key={project.id}
                  className={`projects-stop relative pl-12 lg:col-span-6 lg:pl-0 ${stagger}`}
                >
                  {/* Route marker */}
                  <span
                    aria-hidden="true"
                    className={`projects-pin absolute left-0 top-1 grid h-9 w-9 place-items-center rounded-full border bg-temple-cream font-display text-sm font-bold lg:static lg:mb-4 lg:inline-grid ${tone}`}
                  >
                    {number}
                  </span>

                  <article className="group">
                    {/* Photo */}
                    <Link href={project.href} className="block" aria-label={`Visit ${project.title}`}>
                      <div className="projects-photo relative aspect-[16/8] sm:aspect-[16/11] overflow-hidden card-surface">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 520px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-dusk/35 via-transparent to-transparent" />
                        <span className="progress-chase absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center bg-temple-bg text-primary transition-colors duration-300 group-hover:bg-gold group-hover:text-dusk">
                          <ArrowUpRight size={18} aria-hidden="true" />
                        </span>
                      </div>
                    </Link>

                    {/* Caption / field note */}
                    <div className="relative mt-4 border-l-2 border-gold/60 pl-4 sm:pl-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-body text-xs font-bold uppercase tracking-[0.16em] px-2.5 py-1 ${chip}`}>
                          {project.tag}
                        </span>
                        <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-ink/75 max-sm:hidden">
                          {project.subtitle}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink sm:text-[1.7rem]">
                        <Link href={project.href} className="transition-colors hover:text-primary">
                          {project.title}
                        </Link>
                      </h3>
                      <p className="mt-2 max-w-md font-body text-sm leading-6 text-ink/75 line-clamp-2 max-sm:hidden">
                        {project.description}
                      </p>
                      <Link
                        href={project.href}
                        className="text-link tap-target mt-3 inline-flex items-center gap-1.5 text-sunset transition-colors hover:text-primary"
                      >
                        Visit this work <ArrowRight size={12} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 border-t border-temple-sand pt-5 lg:hidden">
          <Link
            href="/projects"
            className="text-link tap-target inline-flex items-center gap-2 text-sunset transition-colors hover:text-primary"
          >
            Explore all projects <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* Soft east-african route backdrop (desktop only) */
        .projects-scene::before {
          content: "";
          position: absolute;
          left: 6%;
          right: 6%;
          top: 58%;
          height: 1px;
          background: linear-gradient(to right, rgba(217, 164, 65, 0), rgba(217, 164, 65, 0.35), rgba(217, 164, 65, 0));
          display: none;
          pointer-events: none;
        }

        .progress-chase {
          background: linear-gradient(115deg, rgba(217, 164, 65, 0.12), rgba(224, 138, 60, 0.06));
          mix-blend-mode: multiply;
        }

        /* Mobile + tablet: continuous dashed trail joining the numbered stops */
        @media (max-width: 1023px) {
          .projects-route::before {
            content: "";
            position: absolute;
            left: 1.0625rem;
            top: 1.25rem;
            bottom: 1.25rem;
            width: 1px;
            background: repeating-linear-gradient(
              to bottom,
              rgba(183, 66, 51, 0.45) 0px,
              rgba(183, 66, 51, 0.45) 5px,
              transparent 5px,
              transparent 10px
            );
          }

          .projects-stop:not(:first-child) {
            margin-top: 0.5rem;
          }

          .projects-pin {
            z-index: 1;
            box-shadow: 0 0 0 6px var(--color-temple-bg);
          }
        }

        @media (min-width: 1024px) {
          .projects-scene::before {
            display: block;
          }
          .projects-pin {
            margin-left: 0;
          }
        }
      `}</style>
    </section>
  );
}
