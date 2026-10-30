import { redirect } from "next/navigation";
import LogoutButton from "@/component/auth/LogoutButton";
import styles from "@/component/auth/Auth.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";

export const dynamic = "force-dynamic";

export default async function CustomerDashboardPage() {
  if (!isAuthConfigured()) redirect("/login");

  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className={styles.dashboard}>
      <section className={styles.dashboardCard}>
        <p className={styles.eyebrow}>YOUR UNSTAGE ACCOUNT</p>
        <h1>Welcome, {session.name}</h1>
        <p>You are signed in as {session.email}.</p>
        <LogoutButton />
      </section>
    </main>
  );
}
