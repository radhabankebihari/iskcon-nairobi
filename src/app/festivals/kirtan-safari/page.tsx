import KirtanSafariRegistrationModal from "@/components/sections/KirtanSafariRegistrationModal";
import KirtanSafariLiveHub from "@/components/festivals/KirtanSafariLiveHub";
import KirtanSafariArchive from "@/components/festivals/KirtanSafariArchive";
import KirtanSafariHero from "@/components/festivals/kirtan-safari/KirtanSafariHero";
import KirtanSafariAbout from "@/components/festivals/kirtan-safari/KirtanSafariAbout";
import KirtanSafariGuests from "@/components/festivals/kirtan-safari/KirtanSafariGuests";
import KirtanSafariSchedule from "@/components/festivals/kirtan-safari/KirtanSafariSchedule";
import KirtanSafariVenueDonations from "@/components/festivals/kirtan-safari/KirtanSafariVenueDonations";
import KirtanSafariSocial from "@/components/festivals/kirtan-safari/KirtanSafariSocial";
import KirtanSafariFinalCtaStrip from "@/components/festivals/kirtan-safari/KirtanSafariFinalCtaStrip";
import "@/components/festivals/kirtan-safari/kirtan-safari.css";
import { getKirtanSafariState } from "@/lib/kirtanSafariState";
import { withSeo } from "@/lib/seo";
import StructuredPageData from "@/components/seo/StructuredPageData";

export const dynamic = "force-dynamic";

export const metadata = withSeo({
  title: "Kirtan Safari 2026",
  description:
    "Relive Kirtan Safari 2026 at ISKCON Nairobi: four days of the holy name, guest kirtaniyas, Harinam, prasadam, service, and devotional community.",
  openGraph: {
    title: "Kirtan Safari 2026 | ISKCON Nairobi",
    description:
      "Four Days, One Holy Name. Revisit the 2026 Kirtan Safari gathering at ISKCON Nairobi and receive news of future editions.",
    images: [
      {
        url: "/images/kirtan-safari-2026-hero-bg.jpg",
        width: 612,
        height: 367,
      },
    ],
  },
}, "/festivals/kirtan-safari");

/* ─── schedule data ─────────────────────────────────────── */
type KirtanSafariPageProps = {
  searchParams: Promise<{ festivalTime?: string }>;
};

export default async function KirtanSafariPage({ searchParams }: KirtanSafariPageProps) {
  const params = await searchParams;
  const simulatedTime =
    process.env.NODE_ENV !== "production" && params.festivalTime
      ? new Date(params.festivalTime)
      : null;
  const initialFestivalState = getKirtanSafariState(
    simulatedTime && !Number.isNaN(simulatedTime.getTime()) ? simulatedTime : new Date()
  );

  if (initialFestivalState.phase === "concluded") {
    return <><StructuredPageData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Festivals", path: "/festivals" }, { name: "Kirtan Safari 2026", path: "/festivals/kirtan-safari" }]} /><KirtanSafariArchive /></>;
  }

  return (
    <div className="kirtan-safari-page">
      <StructuredPageData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Festivals", path: "/festivals" }, { name: "Kirtan Safari 2026", path: "/festivals/kirtan-safari" }]} />
      <KirtanSafariRegistrationModal />
      <KirtanSafariHero />
      <KirtanSafariLiveHub />
      <KirtanSafariAbout />
      <KirtanSafariGuests />
      <KirtanSafariSchedule />
      <KirtanSafariVenueDonations />
      <KirtanSafariSocial />
      <KirtanSafariFinalCtaStrip />
    </div>
  );
}
