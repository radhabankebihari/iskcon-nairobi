import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { donationPaths, festivals, projects } from "@/data/site";

const siteUrl = "https://iskconnairobi.com";

type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

// Update only when the corresponding public content changes. Dates come from
// the last content commits, not the time a deployment happens.
const contentDates: Record<string, string> = {
  "/": "2026-11-07", "/about": "2026-11-09", "/visit": "2026-11-08",
  "/learn": "2026-11-09", "/projects": "2026-11-07", "/festivals": "2026-11-09",
  "/festivals/kartik": "2026-11-09", "/media": "2026-11-08", "/blog": "2026-11-07",
  "/leadership": "2026-11-08", "/srila-prabhupada": "2026-11-08",
  "/serve": "2026-11-09", "/donate": "2026-11-09", "/contact": "2026-11-07",
  "/privacy": "2026-11-09", "/terms": "2026-11-07",
  "/projects/food-for-life": "2026-11-07", "/projects/hktc-juja": "2026-11-08",
  "/projects/hktc-nairobi": "2026-11-08", "/projects/thika-farm": "2026-11-09",
  "/festivals/gaura-purnima": "2026-11-09", "/festivals/janmashtami": "2026-11-09",
  "/festivals/radhashtami": "2026-11-09", "/festivals/kirtan-safari": "2026-11-03",
  "/blog/jharikhanda-forest-kirtan-safari": "2026-11-07",
  "/blog/sri-nama-sankirtana-adhivasa": "2026-11-07",
  "/donate/general": "2026-11-09", "/donate/temple": "2026-11-09", "/donate/food": "2026-11-09",
  "/donate/cows": "2026-11-09", "/donate/students": "2026-11-09",
  "/donate/festivals": "2026-11-09",
};

const staticRoutes: RouteEntry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/visit", priority: 0.9, changeFrequency: "weekly" },
  { path: "/learn", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
  { path: "/festivals", priority: 0.9, changeFrequency: "weekly" },
  { path: "/festivals/kartik", priority: 0.8, changeFrequency: "weekly" },
  { path: "/media", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "monthly" },
  { path: "/leadership", priority: 0.7, changeFrequency: "monthly" },
  { path: "/srila-prabhupada", priority: 0.8, changeFrequency: "monthly" },
  { path: "/serve", priority: 0.7, changeFrequency: "monthly" },
  { path: "/donate", priority: 0.8, changeFrequency: "monthly" },
  { path: "/donate/general", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const dynamicRoutes: RouteEntry[] = [
    ...projects.map((project) => ({
      path: project.href,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...festivals.map((festival) => ({
      path: festival.href,
      priority: festival.featured ? 0.9 : 0.7,
      changeFrequency: "weekly" as const,
    })),
    ...donationPaths.map((path) => ({
      path: path.href,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...blogPosts.map((post) => ({
      path: post.href,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];

  const uniqueRoutes = new Map<string, RouteEntry>();
  [...staticRoutes, ...dynamicRoutes].forEach((route) => {
    uniqueRoutes.set(route.path, route);
  });

  return Array.from(uniqueRoutes.values()).map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified: contentDates[route.path] ? new Date(`${contentDates[route.path]}T00:00:00Z`) : undefined,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
