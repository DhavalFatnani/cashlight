/** Production canonical origin — used for metadata, sitemap, and JSON-LD. */
export const CANONICAL_SITE_ORIGIN = "https://cashlight.in";

/** Canonical site URL for metadata (OG images, absolute links). */
export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      const parsed = new URL(raw);
      // Never emit vercel.app in OG/canonical metadata when env still points at preview.
      if (parsed.hostname.endsWith(".vercel.app")) {
        return new URL(CANONICAL_SITE_ORIGIN);
      }
      return parsed;
    } catch {
      // Fall through if env value is malformed
    }
  }
  return new URL(CANONICAL_SITE_ORIGIN);
}

/** Index only the real production domain; keep previews and local dev out of Google. */
export function shouldIndexSite(): boolean {
  if (process.env.NODE_ENV === "development") {
    return false;
  }
  if (process.env.VERCEL_ENV !== "production") {
    return false;
  }
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return true;
  }
  try {
    const host = new URL(raw).hostname;
    return host === "cashlight.in" || host === "www.cashlight.in";
  } catch {
    return true;
  }
}
