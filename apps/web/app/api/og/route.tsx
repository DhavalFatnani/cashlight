import { renderOgImage } from "@/lib/seo/og-image";

export const runtime = "edge";

/** Legacy OG URL — prefer /opengraph-image for new metadata. */
export async function GET() {
  return renderOgImage();
}
