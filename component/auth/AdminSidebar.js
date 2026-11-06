import {
  ArrowRight,
  ClipboardList,
  LayoutDashboard,
  Package,
  Store,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/component/auth/LogoutButton";
import styles from "./AdminDashboard.module.css";

export default function AdminSidebar({
  name,
  email,
  activeItem,
  orderCount,
  isLoading,
}) {
  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        Nayab Fashion<span>✦</span>
      </Link>

      <p className={styles.sidebarLabel}>STORE MANAGEMENT</p>
      <nav className={styles.navigation} aria-label="Admin navigation">
        <Link
          className={activeItem === "overview" ? styles.activeNav : ""}
          href="/admin#overview"
        >
          <LayoutDashboard aria-hidden="true" />
          Overview
        </Link>
        <Link
          className={activeItem === "orders" ? styles.activeNav : ""}
          href="/admin/orders"
        >
          <ClipboardList aria-hidden="true" />
          Orders
          {orderCount !== undefined && (
            <span className={styles.navCount}>
              {isLoading ? "—" : orderCount}
            </span>
          )}
        </Link>
        <Link
          className={activeItem === "products" ? styles.activeNav : ""}
          href="/admin/products"
        >
          <Package aria-hidden="true" />
          Products
          <ArrowRight className={styles.linkArrow} aria-hidden="true" />
        </Link>
        <Link
          className={activeItem === "customers" ? styles.activeNav : ""}
          href="/admin/customers"
        >
          <UsersRound aria-hidden="true" />
          Registered users
          <ArrowRight className={styles.linkArrow} aria-hidden="true" />
        </Link>
        <Link
          className={activeItem === "users" ? styles.activeNav : ""}
          href="/admin/users"
        >
          <UserRound aria-hidden="true" />
          Logged-in users
          <ArrowRight className={styles.linkArrow} aria-hidden="true" />
        </Link>
        <Link href="/shop">
          <Store aria-hidden="true" />
          Storefront
          <ArrowRight className={styles.linkArrow} aria-hidden="true" />
        </Link>
      </nav>

      <div className={styles.sidebarBottom}>
        <Link href="/customerDashboard" className={styles.adminIdentity}>
          <UserRound aria-hidden="true" />
          <span>
            <small>MY ACCOUNT</small>
            <strong>{name}</strong>
            <span className={styles.adminEmail}>{email}</span>
          </span>
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
