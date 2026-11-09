import { safeJsonLd } from "@/lib/security";

const siteUrl = "https://iskconnairobi.com";

type Crumb = { name: string; path: string };

export default function StructuredPageData({
  breadcrumbs,
  article,
  event,
}: {
  breadcrumbs: Crumb[];
  article?: { headline: string; description: string; image: string; path: string };
  event?: { name: string; description: string; startDate: string; path: string };
}) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
  const articleData = article && {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: `${siteUrl}${article.image}`,
    url: `${siteUrl}${article.path}`,
    author: { "@type": "Organization", name: "ISKCON Nairobi" },
    publisher: { "@type": "Organization", name: "ISKCON Nairobi", logo: { "@type": "ImageObject", url: `${siteUrl}/brand/icon-512.png` } },
  };
  const eventData = event && {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${siteUrl}${event.path}`,
    location: { "@type": "Place", name: "Sri Sri Radha Bankebihari Temple", address: { "@type": "PostalAddress", streetAddress: "Hare Krishna Close, Parklands / West Ngara", addressLocality: "Nairobi", addressCountry: "KE" } },
    organizer: { "@type": "Organization", name: "ISKCON Nairobi", url: siteUrl },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbData) }} />
      {articleData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleData) }} />}
      {eventData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventData) }} />}
    </>
  );
}
