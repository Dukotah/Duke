import type { NextConfig } from "next";

// Baseline security headers applied to every route. Intentionally NOT setting a
// strict Content-Security-Policy yet: the site uses inline styles (style={{…}}),
// inline JSON-LD (dangerouslySetInnerHTML), framer-motion injected styles, and
// Vercel Analytics — a strict CSP would break those without 'unsafe-inline'. Add
// CSP as Content-Security-Policy-Report-Only first (roadmap #91), then enforce.
const securityHeaders = [
  // Force HTTPS for 2 years incl. subdomains (Vercel already serves HTTPS).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Block MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow being framed by other origins (clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send only the origin on cross-origin requests.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Turn off powerful features the site never uses.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
