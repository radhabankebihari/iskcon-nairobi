import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Clock, Leaf, Music2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { blogPosts } from "@/data/blog";
import { withSeo } from "@/lib/seo";

export const metadata = withSeo({
  title: "Blog",
  description:
    "Devotional essays, festival stories, and scriptural reflections from ISKCON Nairobi.",
}, "/blog");

const categoryIcons: Record<string, LucideIcon> = {
  "Scriptural Reflection": BookOpen,
  "Song & Translation": Music2,
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHero
        title="Devotional"
        titleAccent="stories with roots"
        subtitle="Temple Journal"
        description="A quieter space for the meaning behind festivals, scriptural themes, temple culture, and the living practice of Krishna consciousness in Nairobi."
        image="/images/blog/jharikhanda-mahaprabhu-animals.jpeg"
        height="md"
        className="sm:min-h-[500px]"
      />

      <section className="bg-temple-bg bg-temple-texture py-[clamp(2.7rem,12vw,3.8rem)] sm:py-[clamp(3.5rem,5vw,5.5rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr] lg:items-stretch">
            <Link
              href={featured.href}
              className="group relative min-h-[24rem] overflow-hidden border border-gold/25 bg-dusk shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-card-hover sm:min-h-[30rem]"
            >
              <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                src={featured.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/22 to-transparent" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="bg-gold px-3 py-1 font-body text-xs font-bold uppercase tracking-[0.14em] text-ink">
                  Featured
                </span>
                <span className="bg-dusk/72 px-3 py-1 font-body text-xs font-bold uppercase tracking-[0.14em] text-temple-cream">
                  {featured.category}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {featured.date}
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-white text-shadow sm:text-5xl">
                  {featured.title}
                </h2>
              </div>
            </Link>

            <article className="flex flex-col justify-between card-surface p-6 shadow-card sm:p-8 lg:p-10">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3 font-body text-xs uppercase tracking-[0.14em] text-ink/75">
                  <span>{featured.date}</span>
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} className="text-gold" />
                    {featured.readTime}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                  {featured.subtitle}
                </h2>
                <p className="mt-5 font-body text-base leading-relaxed text-ink/75">
                  {featured.excerpt}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {[
                    { icon: BookOpen, label: "Text", value: "Madhya 17" },
                    { icon: Music2, label: "Theme", value: "Holy name" },
                    { icon: Leaf, label: "Mood", value: "Forest kirtan" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="border border-temple-sand bg-temple-cream/60 p-4">
                        <Icon className="text-gold" size={18} />
                        <p className="mt-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-ink/75">
                          {item.label}
                        </p>
                        <p className="mt-1 font-body text-sm font-semibold text-ink">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href={featured.href}
                className="text-link tap-target mt-8 inline-flex items-center gap-2 self-start text-gold-ink transition-all hover:gap-3"
              >
                Read the full story <ArrowRight size={12} />
              </Link>
            </article>
          </div>

          {rest.length > 0 && (
            <div className="mt-16 sm:mt-20">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-temple-sand pb-4">
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Temple Journal
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    More from the Journal
                  </h3>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((post) => {
                  const Icon = categoryIcons[post.category] ?? Leaf;
                  return (
                    <Link
                      key={post.href}
                      href={post.href}
                      className="group flex flex-col overflow-hidden card-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                          src={post.image}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dusk/45 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 bg-white/92 px-2.5 py-1 font-body text-xs font-semibold uppercase tracking-[0.12em] text-dusk">
                          <Icon size={12} className="text-gold" />
                          {post.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-3 font-body text-xs uppercase tracking-[0.12em] text-ink/75">
                          <span>{post.date}</span>
                          <span className="h-1 w-1 rounded-full bg-gold" />
                          <span>{post.readTime}</span>
                        </div>
                        <h4 className="mt-3 font-display text-xl font-semibold leading-snug text-ink">
                          {post.title}
                        </h4>
                        <p className="mt-2 font-body text-sm leading-relaxed text-ink/75">
                          {post.subtitle}
                        </p>
                        <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-ink/75">
                          {post.excerpt}
                        </p>
                        <span className="text-link mt-5 inline-flex items-center gap-1.5 self-start text-gold-ink transition-all group-hover:gap-2.5">
                          Read the story <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
