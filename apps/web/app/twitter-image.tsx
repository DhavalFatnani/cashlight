import { OG_IMAGE_ALT, OG_IMAGE_SIZE, renderOgImage } from "@/lib/seo/og-image";

export const alt = OG_IMAGE_ALT;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return renderOgImage();
}
