import { redirect } from "next/navigation";
import CustomerDashboard from "@/component/customerDashboardSection/CustomerDashboard";
import { getSession, isAuthConfigured } from "@/data/auth";
import { isAdminEmail } from "@/data/store";

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  if (!isAuthConfigured()) redirect("/login");

  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <CustomerDashboard
      name={session.name}
      email={session.email}
      isAdmin={session.isAdmin && isAdminEmail(session.email)}
    />
  );
}
