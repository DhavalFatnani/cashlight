import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const MARKETING_PATHS = [
  "/",
  "/how-it-works",
  "/pricing",
  "/why",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return MARKETING_PATHS.map((path) => ({
    url: new URL(path, base).href,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
