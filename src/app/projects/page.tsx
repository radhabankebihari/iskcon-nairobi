import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { projects } from "@/data/site";
import { ArrowRight } from "lucide-react";
import { withSeo } from "@/lib/seo";

export const metadata = withSeo({
  title: "Projects",
  description: "Explore ISKCON Nairobi projects in education, Food For Life, cow protection, farm service, festivals, and youth outreach.",
}, "/projects");

const tagClasses: Record<string, string> = {
  Education: "bg-gold/15 text-dusk border-gold/40",
  Agriculture: "bg-acacia/10 text-acacia border-acacia/30",
  "Community Service": "bg-sunset/10 text-sunset border-sunset/30",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title="Our"
        titleAccent="Projects"
        subtitle="Service in Action"
        description="Education, prasadam distribution, festivals, cow protection, and community care rooted in Krishna consciousness."
        image="/images/iskcon-nairobi-aerial.jpg"
        height="md"
        className="sm:min-h-[500px]"
      />

      <section className="py-section bg-temple-bg">
        <div className="content-width section-padding">
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project) => (
              <Link
                href={project.href}
                key={project.id}
                className="group card-surface hover:border-primary/40 hover:shadow-card-hover transition-all overflow-hidden"
              >
                <div className="relative aspect-card overflow-hidden image-grade">
                  <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw" src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dusk/70 to-transparent" />
                  <span className={`absolute left-5 top-5 border px-3 py-1 font-body text-xs font-semibold uppercase tracking-[0.15em] ${tagClasses[project.tag] ?? "bg-primary/10 text-primary border-primary/30"}`}>
                    {project.tag}
                  </span>
                </div>
                <div className="p-7">
                  <p className="font-body text-ink/75 text-xs uppercase tracking-widest mb-2">{project.subtitle}</p>
                  <h2 className="font-display text-2xl font-semibold text-ink group-hover:text-primary transition-colors">{project.title}</h2>
                  <p className="font-body text-ink/75 text-sm leading-relaxed mt-3">{project.description}</p>
                  <div className="text-link mt-6 flex items-center gap-2 text-primary">
                    Learn more <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
