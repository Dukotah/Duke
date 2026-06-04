import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/assessment",
        destination: "/it-health-check",
        permanent: true,
      },
      // Consolidate duplicate service pages onto one canonical URL each to stop
      // keyword cannibalization. The bare /cybersecurity, /it-support,
      // /web-development pages and the /services/* variants all targeted the
      // same queries as the location-qualified pages below, with no canonical.
      { source: "/cybersecurity", destination: "/cybersecurity-small-business", permanent: true },
      { source: "/services/cybersecurity", destination: "/cybersecurity-small-business", permanent: true },
      { source: "/it-support", destination: "/it-support-sonoma-county", permanent: true },
      { source: "/services/it-support", destination: "/it-support-sonoma-county", permanent: true },
      { source: "/web-development", destination: "/web-design-sonoma-county", permanent: true },
      { source: "/services/web-development", destination: "/web-design-sonoma-county", permanent: true },
    ];
  },
};

export default nextConfig;
