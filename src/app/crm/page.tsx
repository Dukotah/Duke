import { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import CRMDashboard from "./CRMDashboard";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Lead CRM | Copper Bay Tech",
  robots: { index: false, follow: false },
};

export default async function CRMPage() {
  const jar = await cookies();
  const token = jar.get("crm_session")?.value;
  const secret = process.env.SESSION_SECRET!;
  const session = token ? await verifyToken(token, secret) : null;
  if (!session) redirect("/crm/login");
  if (session.role === "admin") redirect("/crm/admin");

  return <CRMDashboard userId={session.userId} userName={session.name} />;
}
