import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Copper Bay Tech — IT & Web for Sonoma County",
    short_name: "Copper Bay Tech",
    description:
      "Custom websites, IT support, and cybersecurity for Sonoma County businesses. Enterprise-grade thinking without the enterprise price tag.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF9",
    theme_color: "#18181B",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logos/logo-icon.png",
        sizes: "250x250",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logos/logo-square.png",
        sizes: "500x500",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
