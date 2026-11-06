import { redirect } from "next/navigation";
import AdminProducts from "@/component/auth/AdminProducts";
import { getSession, isAuthConfigured } from "@/data/auth";
import { isAdminEmail } from "@/data/store";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const loginUrl = "/admin?returnTo=%2Fadmin%2Fproducts";
  if (!isAuthConfigured()) redirect(loginUrl);
  const session = await getSession();
  if (!session?.isAdmin || !isAdminEmail(session.email)) redirect(loginUrl);

  return <AdminProducts name={session.name} email={session.email} />;
}
