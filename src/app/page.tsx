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

export const metadata: Metadata = {
  title: {
    absolute: "ISKCON Nairobi | Sri Sri Radha Bankebihari Temple",
  },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Homepage narrative order:
          welcome -> routes into temple life -> featured festival -> service
          work -> impact -> founder/leadership vision -> community voices ->
          calendar -> donation -> visual world -> guest hospitality.
          Keep this sequence unless the whole landing-page story is being
          redesigned; section spacing is tuned around this rhythm. */}
      <HeroSection />
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
