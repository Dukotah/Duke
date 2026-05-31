import { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin | Copper Bay Tech CRM",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const jar = await cookies();
  const token = jar.get("crm_session")?.value;
  const secret = process.env.SESSION_SECRET!;
  const session = token ? await verifyToken(token, secret) : null;
  if (!session || session.role !== "admin") redirect("/crm/login");
  return <AdminDashboard adminName={session.name} />;
}
