import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import QuickNavSection from "@/components/sections/QuickNavSection";
import FestivalHighlightSection from "@/components/sections/FestivalHighlightSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FestivalCalendarSection from "@/components/sections/FestivalCalendarSection";
import LeadershipSection from "@/components/sections/LeadershipSection";
import DonationSection from "@/components/sections/DonationSection";
import GallerySection from "@/components/sections/GallerySection";
import GuestHouseSection from "@/components/sections/GuestHouseSection";
import SavannaDivider from "@/components/ui/SavannaDivider";

// Hourly, so seasonal homepage slides start and end close to their dates.
export const revalidate = 3600;

/** When this page was rendered; regenerated hourly (see revalidate). */
function renderedAt() {
  return Date.now();
}

export const metadata: Metadata = {
  title: {
    absolute: "ISKCON Nairobi | Sri Sri Radha Bankebihari Temple",
  },
  alternates: { canonical: "/" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const preview = process.env.NODE_ENV === "development" && (await searchParams).preview === "gita-jayanti";
  return (
    <>
      {/* Homepage narrative order:
          welcome -> routes into temple life -> featured festival -> service
          work -> impact -> founder/leadership vision -> community voices ->
          calendar -> donation -> visual world -> guest hospitality.
          Keep this sequence unless the whole landing-page story is being
          redesigned; section spacing is tuned around this rhythm. */}
      <HeroSection now={preview ? Date.parse("2026-11-25T00:05:00+03:00") : renderedAt()} />
      <SavannaDivider className="h-[7vw] min-h-6 sm:h-24" />
      <QuickNavSection />
      <FestivalHighlightSection />
      <ProjectsSection />
      <StatsSection />
      <LeadershipSection />
      <TestimonialsSection />
      <FestivalCalendarSection />
      <DonationSection />
      <GallerySection />
      <GuestHouseSection />
    </>
  );
}
