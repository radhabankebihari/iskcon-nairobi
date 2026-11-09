import type { MetadataRoute } from "next";

const siteUrl = "https://iskconnairobi.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/offline"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
