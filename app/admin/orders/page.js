import { redirect } from "next/navigation";
import AdminRefreshButton from "@/component/auth/AdminRefreshButton";
import AdminOrdersPanel from "@/component/auth/AdminOrdersPanel";
import AdminSidebar from "@/component/auth/AdminSidebar";
import dashboardStyles from "@/component/auth/AdminDashboard.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";
import { isAdminEmail } from "@/data/store";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const loginUrl = "/admin?returnTo=%2Fadmin%2Forders";
  if (!isAuthConfigured()) redirect(loginUrl);
  const session = await getSession();
  if (!session?.isAdmin || !isAdminEmail(session.email)) redirect(loginUrl);

  return (
    <main className={dashboardStyles.page}>
      <AdminSidebar
        name={session.name}
        email={session.email}
        activeItem="orders"
      />
      <div className={dashboardStyles.content}>
        <header className={dashboardStyles.topbar}>
          <div>
            <p className={dashboardStyles.eyebrow}>NAYAB FASHION · ADMIN</p>
            <h1>Orders</h1>
            <p className={dashboardStyles.welcomeText}>
              Search orders, review details, and update their status.
            </p>
          </div>
          <AdminRefreshButton />
        </header>
        <AdminOrdersPanel />
      </div>
    </main>
  );
}
