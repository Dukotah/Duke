import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

// AI crawlers we explicitly welcome. Each gets the same allow/disallow rules
// as the catch-all "*" rule above; being explicit signals that we consent to
// our public content being used for AI training and retrieval.
const AI_CRAWLERS = [
  "GPTBot",           // OpenAI / ChatGPT
  "ChatGPT-User",     // ChatGPT browsing plugin
  "OAI-SearchBot",    // OpenAI search
  "ClaudeBot",        // Anthropic / Claude
  "anthropic-ai",     // Anthropic training crawler
  "PerplexityBot",    // Perplexity AI
  "GoogleOther",      // Google Gemini / Bard
  "Meta-ExternalAgent", // Meta AI
  "Meta-ExternalFetcher",
  "Applebot-Extended", // Apple Intelligence
  "DuckAssistant",    // DuckDuckGo AI
  "cohere-ai",        // Cohere
  "CCBot",            // Common Crawl (feeds many LLM datasets)
];

const DISALLOW = ["/api/", "/crm", "/thank-you", "/report"];

export default function robots(): MetadataRoute.Robots {
  const aiRules: MetadataRoute.Robots["rules"] = AI_CRAWLERS.map((bot) => ({
    userAgent: bot,
    allow: "/",
    disallow: DISALLOW,
  }));

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...aiRules,
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
