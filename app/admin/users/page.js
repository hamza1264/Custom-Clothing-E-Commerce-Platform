import { redirect } from "next/navigation";
import { ChevronRight, House } from "lucide-react";
import Link from "next/link";
import AdminRefreshButton from "@/component/auth/AdminRefreshButton";
import AdminSidebar from "@/component/auth/AdminSidebar";
import AdminLoggedInUsersPanel from "@/component/auth/AdminLoggedInUsersPanel";
import dashboardStyles from "@/component/auth/AdminDashboard.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";
import { isAdminEmail } from "@/data/store";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const loginUrl = "/admin?returnTo=%2Fadmin%2Fusers";
  if (!isAuthConfigured()) redirect(loginUrl);
  const session = await getSession();
  if (!session?.isAdmin || !isAdminEmail(session.email)) redirect(loginUrl);

  return (
    <main className={`${dashboardStyles.page} ${dashboardStyles.usersPage}`}>
      <AdminSidebar
        name={session.name}
        email={session.email}
        activeItem="users"
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
              <span aria-current="page">Logged-in Users</span>
            </nav>
            <h1>Logged-in Users Activity</h1>
            <p className={dashboardStyles.welcomeText}>
              Review active store sessions and recent sign-ins.
            </p>
          </div>
          <AdminRefreshButton />
        </header>
        <AdminLoggedInUsersPanel />
      </div>
    </main>
  );
}