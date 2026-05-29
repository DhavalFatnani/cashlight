/** Canonical site URL for metadata (OG images, absolute links). */
export function getSiteUrl(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL);
    } catch {
      // Fall through if env value is malformed
    }
  }
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) {
    const withProtocol = vercelHost.startsWith("http")
      ? vercelHost
      : `https://${vercelHost}`;
    return new URL(withProtocol);
  }
  return new URL("http://localhost:3000");
}
