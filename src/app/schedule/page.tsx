import type { Metadata } from "next";
import ScheduleClient from "./ScheduleClient";

export const metadata: Metadata = {
  title: "Book a Free Consultation | Copper Bay Tech",
  description: "Schedule a free 30-minute consultation with Copper Bay Tech. Choose your service, pick a time, and get a clear plan — no pressure.",
  alternates: { canonical: "https://copperbaytech.com/schedule" },
  openGraph: {
    title: "Book a Free Consultation | Copper Bay Tech",
    description: "Schedule a free 30-minute consultation. Pick your service and time — no pressure.",
    url: "https://copperbaytech.com/schedule",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function SchedulePage() {
  return <ScheduleClient />;
}
