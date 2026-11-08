import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { donationPaths, festivals, projects } from "@/data/site";

const siteUrl = "https://iskconnairobi.com";

type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const staticRoutes: RouteEntry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/visit", priority: 0.9, changeFrequency: "weekly" },
  { path: "/learn", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
  { path: "/festivals", priority: 0.9, changeFrequency: "weekly" },
  { path: "/festivals/kartik", priority: 0.8, changeFrequency: "weekly" },
  { path: "/guest-house", priority: 0.7, changeFrequency: "monthly" },
  { path: "/media", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "monthly" },
  { path: "/leadership", priority: 0.7, changeFrequency: "monthly" },
  { path: "/srila-prabhupada", priority: 0.8, changeFrequency: "monthly" },
  { path: "/serve", priority: 0.7, changeFrequency: "monthly" },
  { path: "/donate", priority: 0.8, changeFrequency: "monthly" },
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
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
