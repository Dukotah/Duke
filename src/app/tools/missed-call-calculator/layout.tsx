import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Missed Call Revenue Calculator — How Much Are Unanswered Calls Costing You? | Copper Bay Tech",
  description:
    "Free missed call revenue calculator for small businesses. Dial in your weekly call volume, miss rate, and average job value to see exactly how much revenue is slipping through to voicemail — and what an AI receptionist could win back.",
  keywords:
    "missed call calculator, missed call revenue, unanswered calls cost, AI receptionist ROI, small business phone leads, missed call loss Sonoma County",
  alternates: { canonical: "/tools/missed-call-calculator" },
  openGraph: {
    title: "How Much Are Missed Calls Costing You? — Free Calculator | Copper Bay Tech",
    description:
      "Move the sliders to your numbers and see the annual revenue walking out the door — then what an AI receptionist could recapture.",
    url: "https://copperbaytech.com/tools/missed-call-calculator",
    siteName: "Copper Bay Tech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copper Bay Tech — Missed Call Revenue Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Much Are Missed Calls Costing You? — Free Calculator",
    description: "See the annual revenue lost to voicemail — and what an AI receptionist could win back.",
    images: ["/og-image.png"],
  },
};

export default function MissedCallCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
