import { Metadata } from "next";
import CRMDashboard from "./CRMDashboard";

export const metadata: Metadata = {
  title: "Lead CRM | Copper Bay Tech",
  robots: { index: false, follow: false },
};

export default function CRMPage() {
  return <CRMDashboard />;
}
