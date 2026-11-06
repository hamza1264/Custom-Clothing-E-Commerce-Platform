import { redirect } from "next/navigation";
import AdminDashboard from "@/component/auth/AdminDashboard";
import AuthForm from "@/component/auth/AuthForm";
import authStyles from "@/component/auth/Auth.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";
import { isAdminEmail, isAdminLoginConfigured } from "@/data/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({ searchParams }) {
  const params = await searchParams;
  const adminPaths = [
    "/admin",
    "/admin/orders",
    "/admin/products",
    "/admin/customers",
    "/admin/users",
  ];
  const returnTo = adminPaths.includes(params?.returnTo)
    ? params.returnTo
    : "/admin";
  const authConfigured = isAuthConfigured();
  const session = authConfigured ? await getSession() : null;
  if (session?.isAdmin && isAdminEmail(session.email)) {
    if (returnTo !== "/admin") redirect(returnTo);
    return <AdminDashboard name={session.name} email={session.email} />;
  }

  return (
    <main className={authStyles.page}>
      <AuthForm
        adminOnly
        authConfigured={authConfigured}
        isConfigured={authConfigured && isAdminLoginConfigured()}
        returnTo={returnTo}
      />
    </main>
  );
}
