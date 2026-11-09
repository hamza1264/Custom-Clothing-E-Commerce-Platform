import { redirect } from "next/navigation";
import { ChevronRight, House } from "lucide-react";
import Link from "next/link";
import AdminRefreshButton from "@/component/auth/AdminRefreshButton";
import AdminSidebar from "@/component/auth/AdminSidebar";
import AdminContactMessagesPanel from "@/component/auth/AdminContactMessagesPanel";
import dashboardStyles from "@/component/auth/AdminDashboard.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";
import { isAdminEmail } from "@/data/store";

export const dynamic = "force-dynamic";

export default async function AdminContactMessagesPage() {
  const loginUrl = "/admin?returnTo=%2Fadmin%2Fcontact-messages";
  if (!isAuthConfigured()) redirect(loginUrl);
  const session = await getSession();
  if (!session?.isAdmin || !isAdminEmail(session.email)) redirect(loginUrl);

  return (
    <main className={`${dashboardStyles.page} ${dashboardStyles.customersPage}`}>
      <AdminSidebar
        name={session.name}
        email={session.email}
        activeItem="contact-messages"
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
              <span aria-current="page">Contact Messages</span>
            </nav>
            <h1>Contact Messages</h1>
            <p className={dashboardStyles.welcomeText}>
              Read and respond to messages sent from your contact page.
            </p>
          </div>
          <AdminRefreshButton />
        </header>
        <AdminContactMessagesPanel />
      </div>
    </main>
  );
}
