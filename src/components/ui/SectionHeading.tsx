interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Second line of the heading, shown in the accent colour. */
  accent?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  accentClassName?: string;
  /** Gold accent lines are reserved for a few moments; by default the accent matches the title. */
  accentTone?: "inherit" | "gold";
}

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  eyebrowClassName = "eyebrow block mb-3",
  titleClassName = "section-title",
  accentClassName = "text-gold not-italic font-normal",
  accentTone = "inherit",
}: SectionHeadingProps) {
  const accentClasses =
    accentTone === "gold" ? accentClassName : accentClassName.replace(/\btext-gold(?:-ink|-light)?\b/g, "").trim();
  return (
    <>
      <span className={eyebrowClassName}>{eyebrow}</span>
      <h2 className={titleClassName}>
        {title}
        {accent && (
          <>
            <br />
            <em className={accentClasses}>{accent}</em>
          </>
        )}
      </h2>
    </>
  );
}
