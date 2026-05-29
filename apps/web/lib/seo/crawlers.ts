/** Crawlers that must reach `/api/og` (and pages) for link previews. */
export const SOCIAL_PREVIEW_USER_AGENTS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot",
  "WhatsApp",
  "Discordbot",
  "TelegramBot",
] as const;
