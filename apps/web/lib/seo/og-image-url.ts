import { getSiteUrl } from "@/lib/site-url";

/**
 * Default OG image URL for metadata.
 * Served by `/api/og` (200 + image/png, no redirects) — Facebook rejects 307 chains.
 */
export function getDefaultOgImageUrl(): URL {
  return new URL("/api/og", getSiteUrl());
}
