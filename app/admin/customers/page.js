import Link from "next/link";
import { redirect } from "next/navigation";
import AdminCustomerPanel from "@/component/auth/AdminCustomerPanel";
import styles from "@/component/auth/Auth.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";
import { isAdminEmail } from "@/data/store";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  if (!isAuthConfigured()) redirect("/login");

  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdminEmail(session.email)) redirect("/customerDashboard");

  return (
    <main className={styles.dashboard}>
      <section className={styles.dashboardCard}>
        <p className={styles.eyebrow}>NAYAB FASHION ADMIN</p>
        <h1>Customer accounts</h1>
        <p>Registered accounts and currently signed-in sessions are listed separately.</p>
        <AdminCustomerPanel />
        <Link className={styles.adminBackLink} href="/customerDashboard">
          Back to my account
        </Link>
      </section>
    </main>
  );
}
