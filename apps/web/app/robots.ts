import type { MetadataRoute } from "next";
import { getSiteUrl, shouldIndexSite } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (!shouldIndexSite()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
    host: siteUrl.host,
  };
}
