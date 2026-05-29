/**
 * Crawlers that must reach pages and `/api/og` for link previews.
 * Include Meta's newer fetchers (Sharing Debugger may use these instead of facebookexternalhit).
 */
export const SOCIAL_PREVIEW_USER_AGENTS = [
  "facebookexternalhit",
  "Facebot",
  "meta-externalfetcher",
  "meta-externalagent",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot",
  "Slackbot-LinkExpanding",
  "WhatsApp",
  "Discordbot",
  "TelegramBot",
] as const;
