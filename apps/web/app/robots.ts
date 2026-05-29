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

/** Facebook, Twitter, etc. — explicit allow before the catch-all rule. */
function socialPreviewRules(): RobotsRule[] {
  return SOCIAL_PREVIEW_USER_AGENTS.map((userAgent) => ({
    userAgent,
    allow: "/",
  }));
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (shouldIndexSite()) {
    return {
      rules: [
        ...socialPreviewRules(),
        {
          userAgent: "*",
          allow: "/",
        },
      ],
      sitemap: new URL("/sitemap.xml", siteUrl).href,
    };
  }

  return {
    rules: [
      ...socialPreviewRules(),
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
