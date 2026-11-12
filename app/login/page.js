import { redirect } from "next/navigation";
import AuthForm from "@/component/auth/AuthForm";
import styles from "@/component/auth/Auth.module.css";
import { getSession, isAuthConfigured } from "@/data/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const initialMode = params?.mode === "signup" ? "signup" : "login";
  const adminPaths = [
    "/admin",
    "/admin/orders",
    "/admin/products",
    "/admin/customers",
    "/admin/users",
  ];
  if (adminPaths.includes(params?.returnTo)) {
    redirect(`/admin?returnTo=${encodeURIComponent(params.returnTo)}`);
  }
  const allowedReturnPaths = ["/checkout", "/checkout?buyNow=1"];
  const returnTo = allowedReturnPaths.includes(params?.returnTo)
    ? params.returnTo
    : "/customerDashboard";
  const isConfigured = isAuthConfigured();
  if (isConfigured && (await getSession())) {
    redirect(returnTo);
  }

  return (
    <main className={styles.page}>
      <AuthForm
        initialMode={initialMode}
        isConfigured={isConfigured}
        emailVerified={params?.verified === "1"}
        emailVerificationFailed={params?.verified === "0"}
        returnTo={returnTo}
      />
    </main>
  );
}
