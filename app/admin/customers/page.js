import { redirect } from "next/navigation";
import AdminRefreshButton from "@/component/auth/AdminRefreshButton";
import AdminSidebar from "@/component/auth/AdminSidebar";
import AdminCustomerPanel from "@/component/auth/AdminCustomerPanel";
import dashboardStyles from "@/component/auth/AdminDashboard.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";
import { isAdminEmail } from "@/data/store";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const loginUrl = "/admin?returnTo=%2Fadmin%2Fcustomers";
  if (!isAuthConfigured()) redirect(loginUrl);
  const session = await getSession();
  if (!session?.isAdmin || !isAdminEmail(session.email)) redirect(loginUrl);

  return (
    <main className={dashboardStyles.page}>
      <AdminSidebar
        name={session.name}
        email={session.email}
        activeItem="customers"
      />
      <div className={dashboardStyles.content}>
        <header className={dashboardStyles.topbar}>
          <div>
            <p className={dashboardStyles.eyebrow}>NAYAB FASHION · ADMIN</p>
            <h1>Registered users</h1>
            <p className={dashboardStyles.welcomeText}>
              All accounts registered with your store.
            </p>
          </div>
          <AdminRefreshButton />
        </header>
        <AdminCustomerPanel />
      </div>
    </main>
  );
}
