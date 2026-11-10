import {
  ArrowRight,
  ClipboardList,
  LayoutDashboard,
  Mail,
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
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <p className={styles.sidebarLabel}>STORE MANAGEMENT</p>
      <nav className={styles.navigation} aria-label="Admin navigation">
        <Link
          className={activeItem === "overview" ? styles.activeNav : ""}
          aria-current={activeItem === "overview" ? "page" : undefined}
          href="/admin#overview"
        >
          <LayoutDashboard aria-hidden="true" />
          Overview
        </Link>
        <Link
          className={activeItem === "orders" ? styles.activeNav : ""}
          aria-current={activeItem === "orders" ? "page" : undefined}
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
          className={activeItem === "contact-messages" ? styles.activeNav : ""}
          aria-current={activeItem === "contact-messages" ? "page" : undefined}
          href="/admin/contact-messages"
        >
          <Mail aria-hidden="true" />
          Contact messages
          <ArrowRight className={styles.linkArrow} aria-hidden="true" />
        </Link>
        <Link
          className={activeItem === "products" ? styles.activeNav : ""}
          aria-current={activeItem === "products" ? "page" : undefined}
          href="/admin/products"
        >
          <Package aria-hidden="true" />
          Products
          <ArrowRight className={styles.linkArrow} aria-hidden="true" />
        </Link>
        <Link
          className={activeItem === "customers" ? styles.activeNav : ""}
          aria-current={activeItem === "customers" ? "page" : undefined}
          href="/admin/customers"
        >
          <UsersRound aria-hidden="true" />
          Registered users
          <ArrowRight className={styles.linkArrow} aria-hidden="true" />
        </Link>
        <Link
          className={activeItem === "users" ? styles.activeNav : ""}
          aria-current={activeItem === "users" ? "page" : undefined}
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
          <span className={styles.adminAvatar} aria-hidden="true">
            {initials}
          </span>
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
