import type { MetadataRoute } from "next";
import { SOCIAL_PREVIEW_USER_AGENTS } from "@/lib/seo/crawlers";
import { getSiteUrl, shouldIndexSite } from "@/lib/site-url";

/** Re-evaluate on each request so production env / domain changes apply without a stale static file. */
export const dynamic = "force-dynamic";

type RobotsRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
};

function socialPreviewRules(): RobotsRule[] {
  return SOCIAL_PREVIEW_USER_AGENTS.map((userAgent) => ({
    userAgent,
    allow: ["/api/og", "/"],
  }));
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (shouldIndexSite()) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: new URL("/sitemap.xml", siteUrl).href,
      host: siteUrl.host,
    };
  }

  // Preview / misconfigured env: no broad indexing, but social crawlers must fetch OG images
  const rules: RobotsRule[] = [
    ...socialPreviewRules(),
    {
      userAgent: "*",
      disallow: "/",
    },
  ];

  return { rules };
}
