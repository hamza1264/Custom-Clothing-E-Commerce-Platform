import { redirect } from "next/navigation";
import AuthForm from "@/component/auth/AuthForm";
import styles from "@/component/auth/Auth.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const initialMode = params?.mode === "signup" ? "signup" : "login";
  const isConfigured = isAuthConfigured();
  if (isConfigured && (await getSession())) {
    redirect("/customerDashboard");
  }

  return (
    <main className={styles.page}>
      <AuthForm initialMode={initialMode} isConfigured={isConfigured} />
    </main>
  );
}
