import { getSiteUrl } from "@/lib/site-url";

/**
 * Default OG image URL for metadata.
 * Uses Next.js file-based `opengraph-image` (build-time asset, crawler-friendly).
 */
export function getDefaultOgImageUrl(): URL {
  return new URL("/opengraph-image", getSiteUrl());
}
