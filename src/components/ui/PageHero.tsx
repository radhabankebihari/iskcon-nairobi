import Image from "next/image";
import SharePageButton from "@/components/ui/SharePageButton";

interface PageHeroProps {
  title: string;
  /** Continues the title on the same line, in the same colour. */
  titleAccent?: string;
  subtitle?: string;
  description?: string;
  /** Required for the photo hero. The compact hero has no image. */
  image?: string;
  /** Describe the photo only when it adds meaning beyond the heading over it. */
  imageAlt?: string;
  /** Optional crop position for photo heroes at different viewport sizes. */
  imageClassName?: string;
  /** Preserve the source photo without an extra image-optimizer encode. */
  imageUnoptimized?: boolean;
  /** Override the standard image shade when a particular photo needs more light. */
  imageOverlayClassName?: string;
  /**
   * "photo" is the full image hero. "compact" is a short band without an image,
   * for practical pages such as Contact and individual donation funds.
   */
  variant?: "photo" | "compact";
  /** Short, factual highlights shown under the description, such as hours or location. */
  facts?: string[];
  height?: "sm" | "md" | "lg";
  align?: "left" | "center";
  className?: string;
  contentClassName?: string;
  shareTitle?: string;
  shareLabel?: string;
}

export default function PageHero({
  title,
  titleAccent,
  subtitle,
  description,
  image,
  imageAlt = "",
  imageClassName = "",
  imageUnoptimized = false,
  imageOverlayClassName = "bg-gradient-to-b from-black/50 via-black/40 to-black/70",
  variant = "photo",
  facts,
  height = "md",
  align = "left",
  className = "",
  contentClassName = "",
  shareTitle,
  shareLabel,
}: PageHeroProps) {
  const heights = {
    sm: "h-[48vh] min-h-[340px] max-h-[460px] sm:h-[42vh] sm:min-h-[360px] sm:max-h-[500px]",
    md: "h-[52vh] min-h-[380px] max-h-[540px] sm:h-[50vh] sm:min-h-[420px] sm:max-h-[580px]",
    lg: "h-[58vh] min-h-[440px] max-h-[660px] sm:h-[65vh] sm:min-h-[500px] sm:max-h-[720px]",
  };
  const compact = variant === "compact" || !image;
  const heading = titleAccent ? `${title} ${titleAccent}` : title;

  return (
    <section
      className={`relative overflow-hidden ${compact ? "bg-dusk" : heights[height]} ${compact ? "" : className}`}
    >
      {!compact && image && (
        <>
          <Image src={image} alt={imageAlt} fill sizes="100vw" loading="eager" fetchPriority="high" unoptimized={imageUnoptimized} className={`object-cover ${imageClassName}`} />
          <div className={`absolute inset-0 ${imageOverlayClassName}`} />
          {align === "left" && <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />}
        </>
      )}

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div
        className={`relative z-10 flex flex-col ${compact ? "pt-32 pb-10 sm:pt-36 sm:pb-12" : "h-full justify-end pt-32 pb-10 sm:pt-36 sm:pb-14"} section-padding content-width ${contentClassName} ${align === "center" ? "items-center text-center" : ""}`}
      >
        {!shareTitle && subtitle && <span className="eyebrow text-gold block mb-3">{subtitle}</span>}
        {shareTitle && (
          <div className="mb-3 flex w-full max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-1">
            {subtitle && <span className="eyebrow text-gold">{subtitle}</span>}
            <SharePageButton title={shareTitle} label={shareLabel} />
          </div>
        )}

        <h1
          className="font-display text-white text-shadow leading-tight max-w-4xl"
          style={{ fontSize: compact ? "clamp(2rem, 8vw, 3.5rem)" : "clamp(2.25rem, 9vw, 4.25rem)" }}
        >
          {heading}
        </h1>

        {description && (
          <p className="font-body text-white/80 text-sm sm:text-base mt-4 max-w-xl leading-relaxed">{description}</p>
        )}

        {facts && facts.length > 0 && (
          <ul className={`mt-5 flex flex-wrap gap-x-6 gap-y-2 ${align === "center" ? "justify-center" : ""}`}>
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2 font-body text-sm font-medium text-white/90">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                {fact}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
