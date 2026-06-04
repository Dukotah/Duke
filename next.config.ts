import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/assessment",
        destination: "/it-health-check",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
