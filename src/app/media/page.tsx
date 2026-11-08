import PageHero from "@/components/ui/PageHero";
import MediaGallery from "@/components/sections/MediaGallery";
import { socialLinks } from "@/data/site";
import { withSeo } from "@/lib/seo";

export const metadata = withSeo({
  title: "Media Gallery",
  description: "Photos and videos from ISKCON Nairobi - temple life, festivals, community service, and the beauty of Krishna consciousness in East Africa.",
}, "/media");

export default function MediaPage() {
  const mediaSocials = socialLinks.filter((link) => ["YouTube", "Instagram", "Facebook"].includes(link.name));

  return (
    <>
      <PageHero
        title="Photo"
        titleAccent="& Video Gallery"
        subtitle="Media Library"
        description="Life at ISKCON Nairobi through the lens - festivals, farm, temple worship, and the beauty of devotional community in East Africa."
        image="/images/media-film-hero.webp"
        imageAlt="Black-and-white film camera and photographic negatives"
        height="md"
        className="sm:min-h-[500px]"
      />

      <section className="py-section bg-temple-bg">
        <div className="content-width section-padding">
          <div className="mb-10 card-surface p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <span className="eyebrow block mb-2">HKTC Nairobi</span>
              <h2 className="font-display text-2xl font-semibold text-ink">Graduation Ceremony Album</h2>
              <p className="font-body text-ink/75 text-sm mt-2 max-w-2xl">
                Enjoy the full gallery from the HKTC Graduation Ceremony on Google Photos.
              </p>
            </div>
            <a
              href="https://photos.app.goo.gl/MIZfuQWWgNPvBuG43"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center text-xs"
            >
              View the full album
            </a>
          </div>

          <div className="mb-10 card-surface p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <span className="eyebrow block mb-2">Thika Farm & Goshala</span>
              <h2 className="font-display text-2xl font-semibold text-ink">Farm Visit Album</h2>
              <p className="font-body text-ink/75 text-sm mt-2 max-w-2xl">
                View the complete Farm Visit photo collection on Google Drive.
              </p>
            </div>
            <a
              href="https://drive.google.com/drive/folders/10o0rJGeiIebEz0DRN1xsaiHlxrrF8Gtw?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center text-xs"
            >
              View the farm album
            </a>
          </div>

          <div className="mb-8">
            <span className="eyebrow mb-2 block">Photo archive</span>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Nairobi in photographs</h2>
            <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-ink/75 sm:text-base">
              Archival moments, temple life today, and visits to the Thika Farm and Goshala.
            </p>
          </div>
          <MediaGallery />

          <div className="mt-10 text-center">
            <p className="font-body text-ink/75 text-sm">More photos and videos are shared on ISKCON Nairobi social channels.</p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {mediaSocials.map((platform) => (
                <a key={platform.name} href={platform.href} target="_blank" rel="noopener noreferrer" className="tap-target font-body text-sm font-semibold text-gold-ink border-b border-gold/30 pb-0.5 hover:border-gold transition-colors">
                  {platform.name} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
