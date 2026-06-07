import type { Metadata } from "next";

// The /report route renders a visitor's dynamic audit results — it should never
// be independently indexed (it has no standalone content and no canonical URL).
// noindex here mirrors the protection on /crm and /thank-you.
export const metadata: Metadata = {
  title: "Website Audit Report | Copper Bay Tech",
  robots: { index: false, follow: false },
};

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
