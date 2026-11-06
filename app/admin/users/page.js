import { redirect } from "next/navigation";
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
    <main className={dashboardStyles.page}>
      <AdminSidebar
        name={session.name}
        email={session.email}
        activeItem="users"
      />
      <div className={dashboardStyles.content}>
        <header className={dashboardStyles.topbar}>
          <div>
            <p className={dashboardStyles.eyebrow}>NAYAB FASHION · ADMIN</p>
            <h1>Logged-in users</h1>
            <p className={dashboardStyles.welcomeText}>
              Accounts with an active session right now.
            </p>
          </div>
          <AdminRefreshButton />
        </header>
        <AdminLoggedInUsersPanel />
      </div>
    </main>
  );
}