import { redirect } from "next/navigation";
import { ChevronRight, House } from "lucide-react";
import Link from "next/link";
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
    <main className={`${dashboardStyles.page} ${dashboardStyles.customersPage}`}>
      <AdminSidebar
        name={session.name}
        email={session.email}
        activeItem="customers"
      />
      <div className={dashboardStyles.content}>
        <header className={dashboardStyles.topbar}>
          <div className={dashboardStyles.ordersPageHeading}>
            <nav className={dashboardStyles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/admin" aria-label="Admin dashboard">
                <House aria-hidden="true" />
              </Link>
              <ChevronRight aria-hidden="true" />
              <span>Admin Dashboard</span>
              <ChevronRight aria-hidden="true" />
              <span aria-current="page">Registered users</span>
            </nav>
            <h1>Registered Users List</h1>
            <p className={dashboardStyles.welcomeText}>
              Manage the people who have joined your store.
            </p>
          </div>
          <AdminRefreshButton />
        </header>
        <AdminCustomerPanel />
      </div>
    </main>
  );
}
