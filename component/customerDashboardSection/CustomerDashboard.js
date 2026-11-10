"use client";

import {
  ArrowRight,
  CircleCheck,
  CircleUserRound,
  Clock3,
  Heart,
  PackageOpen,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/component/auth/LogoutButton";

import styles from "./CustomerDashboard.module.css";

const STATUS_ICONS = {
  confirmed: CircleCheck,
  processing: Clock3,
  shipped: Truck,
  delivered: CircleCheck,
  cancelled: PackageOpen,
};

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomerDashboard({ name, email, isAdmin }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      const response = await fetch("/api/orders", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not load your orders.");
      }
      if (active) setOrders(result.orders);
    }

    loadOrders()
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeOrders = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status)
  );
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  );
  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.total, 0);

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/ilham-collection-logo.jpeg"
            alt="ILHAM COLLECTION"
            width={226}
            height={146}
          />
        </Link>

        <p className={styles.sidebarLabel}>MY ACCOUNT</p>
        <nav className={styles.navigation} aria-label="Account navigation">
          <a className={styles.activeNav} href="#overview">
            <CircleUserRound aria-hidden="true" />
            Overview
          </a>
          <a href="#orders">
            <PackageOpen aria-hidden="true" />
            My orders
            <span className={styles.navCount}>{orders.length}</span>
          </a>
          <Link href="/wishlist">
            <Heart aria-hidden="true" />
            Wishlist
            <ArrowRight className={styles.linkArrow} aria-hidden="true" />
          </Link>
          <Link href="/shop">
            <Store aria-hidden="true" />
            Shop collection
            <ArrowRight className={styles.linkArrow} aria-hidden="true" />
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          {isAdmin && (
            <>
              <Link href="/admin" className={styles.adminLink}>
                Admin dashboard
              </Link>
              <Link href="/admin/customers" className={styles.adminLink}>
                Customer accounts
              </Link>
            </>
          )}
          <LogoutButton />
        </div>
      </aside>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>ILHAM COLLECTION ACCOUNT</p>
            <h1 id="overview">Welcome back, {name}</h1>
            <p className={styles.welcomeText}>
              Here&apos;s what&apos;s happening with your account.
            </p>
          </div>
          <Link href="/shop" className={styles.shopButton}>
            Continue shopping <ArrowRight aria-hidden="true" />
          </Link>
        </header>

        <section className={styles.summaryGrid} aria-label="Order summary">
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><PackageOpen /></span>
            <p>Total orders</p>
            <strong>{isLoading ? "—" : orders.length}</strong>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><Truck /></span>
            <p>In progress</p>
            <strong>{isLoading ? "—" : activeOrders.length}</strong>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><CircleCheck /></span>
            <p>Delivered</p>
            <strong>{isLoading ? "—" : deliveredOrders.length}</strong>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><ShoppingBag /></span>
            <p>Total spent</p>
            <strong>
              {isLoading ? "—" : `Rs. ${totalSpent.toLocaleString()}`}
            </strong>
          </article>
        </section>

        <section className={styles.panel} id="orders">
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>YOUR PURCHASES</p>
              <h2>Order history</h2>
            </div>
            <Link href="/orderTracking" className={styles.textLink}>
              Track an order <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          {isLoading && <p className={styles.notice}>Loading your orders...</p>}
          {error && <p className={styles.error} role="alert">{error}</p>}
          {!isLoading && !error && orders.length === 0 && (
            <div className={styles.emptyState}>
              <span><ShoppingBag aria-hidden="true" /></span>
              <h3>Your next favorite outfit is waiting</h3>
              <p>Your orders will appear here after you place your first order.</p>
              <Link href="/shop" className={styles.shopButton}>
                Explore the collection <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          )}
          {!isLoading && !error && orders.length > 0 && (
            <div className={styles.orderList}>
              {orders.map((order) => {
                const StatusIcon = STATUS_ICONS[order.status] ?? PackageOpen;
                const itemCount = order.items.reduce(
                  (count, item) => count + item.quantity,
                  0
                );

                return (
                  <article className={styles.orderCard} key={order.orderNumber}>
                    <span className={styles.orderIcon}>
                      <StatusIcon aria-hidden="true" />
                    </span>
                    <div className={styles.orderDetails}>
                      <strong>{order.orderNumber}</strong>
                      <p>
                        {formatDate(order.createdAt)} · {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <span
                      className={`${styles.status} ${styles[`status_${order.status}`] ?? ""}`}
                    >
                      {order.status}
                    </span>
                    <strong className={styles.orderTotal}>
                      Rs. {order.total.toLocaleString()}
                    </strong>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.accountPanel} aria-labelledby="account-title">
          <div className={styles.profileAvatar} aria-hidden="true">
            {name.trim().charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles.eyebrow}>ACCOUNT DETAILS</p>
            <h2 id="account-title">{name}</h2>
            <p>{email}</p>
          </div>
          <span className={styles.accountBadge}>Active account</span>
        </section>
      </div>
    </main>
  );
}
