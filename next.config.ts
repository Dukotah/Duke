import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /assessment and /it-health-check render the identical <ITQuiz /> flow.
      // /it-health-check is the canonical URL (linked in the Footer + sitemap and
      // carries the canonical tag), so fold the duplicate /assessment into it.
      {
        source: "/assessment",
        destination: "/it-health-check",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
