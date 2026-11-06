"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  Package,
  PackageCheck,
  Store,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminRefreshButton from "@/component/auth/AdminRefreshButton";
import AdminSidebar from "@/component/auth/AdminSidebar";
import styles from "./AdminDashboard.module.css";

const EMPTY_ARRAY = [];

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

async function getJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Could not load admin dashboard data.");
  }
  return result;
}

export default function AdminDashboard({ name, email }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [orderData, customerData, productData] = await Promise.all([
          getJson("/api/admin/orders"),
          getJson("/api/admin/customers"),
          getJson("/api/products?includeInactive=true"),
        ]);
        if (active) {
          setDashboardData({
            orders: orderData.orders,
            customers: customerData.registeredUsers,
            products: productData.products,
          });
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const orders = dashboardData ? dashboardData.orders : EMPTY_ARRAY;
  const products = dashboardData ? dashboardData.products : EMPTY_ARRAY;
  const customers = dashboardData ? dashboardData.customers : EMPTY_ARRAY;
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.total, 0);
  const openOrders = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status)
  ).length;

  const weekActivity = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return {
        date,
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        count: 0,
      };
    });

    orders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      const day = days.find(
        ({ date }) => date.toDateString() === createdAt.toDateString()
      );
      if (day) day.count += 1;
    });

    const maximum = Math.max(...days.map((day) => day.count), 1);
    return days.map((day) => ({
      ...day,
      height: Math.max((day.count / maximum) * 100, day.count ? 8 : 3),
    }));
  }, [orders]);

  return (
    <main className={styles.page}>
      <AdminSidebar
        name={name}
        email={email}
        activeItem="overview"
        orderCount={orders.length}
        isLoading={isLoading}
      />

      <div className={styles.content}>
        <header className={styles.topbar} id="overview">
          <div>
            <p className={styles.eyebrow}>NAYAB FASHION · ADMIN</p>
            <h1>Good to see you, {name}</h1>
            <p className={styles.welcomeText}>
              Here&apos;s how your store is performing.
            </p>
          </div>
          <AdminRefreshButton
            onRefresh={() => setReloadKey((key) => key + 1)}
            disabled={isLoading}
          />
        </header>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <section className={styles.summaryGrid} aria-label="Store summary">
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><CircleDollarSign /></span>
            <p>Net sales</p>
            <strong>{isLoading ? "—" : formatCurrency(revenue)}</strong>
            <small>Excludes cancelled orders</small>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><ClipboardList /></span>
            <p>Total orders</p>
            <strong>{isLoading ? "—" : orders.length}</strong>
            <small>All-time orders</small>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><PackageCheck /></span>
            <p>Needs attention</p>
            <strong>{isLoading ? "—" : openOrders}</strong>
            <small>Orders not yet delivered</small>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><UsersRound /></span>
            <p>Customers</p>
            <strong>{isLoading ? "—" : customers.length}</strong>
            <small>Registered accounts</small>
          </article>
          <article className={styles.summaryCard}>
            <span className={styles.summaryIcon}><Package /></span>
            <p>Active products</p>
            <strong>{isLoading ? "—" : products.filter((product) => product.active).length}</strong>
            <small>{isLoading ? "Loading" : `${products.length} products in catalog`}</small>
          </article>
        </section>

        <section className={styles.middleGrid} aria-label="Store activity">
          <article className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <p className={styles.eyebrow}>LAST 7 DAYS</p>
                <h2>Order activity</h2>
              </div>
              <span className={styles.activityTotal}>
                {weekActivity.reduce((sum, day) => sum + day.count, 0)} orders
              </span>
            </div>
            {error ? (
              <p className={styles.notice}>Activity is unavailable right now.</p>
            ) : (
              <div className={styles.chart} aria-label="Orders per day">
                {weekActivity.map((day) => (
                  <div className={styles.chartDay} key={day.date.toISOString()}>
                    <span className={styles.chartCount}>{day.count || ""}</span>
                    <div className={styles.chartTrack}>
                      <span
                        className={styles.chartBar}
                        style={{ height: `${day.height}%` }}
                        title={`${day.count} orders`}
                      />
                    </div>
                    <span className={styles.chartLabel}>{day.label}</span>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className={`${styles.panel} ${styles.quickActions}`}>
            <div className={styles.panelHeading}>
              <div>
                <p className={styles.eyebrow}>SHORTCUTS</p>
                <h2>Manage your store</h2>
              </div>
              <Boxes aria-hidden="true" className={styles.headingIcon} />
            </div>
            <Link href="/admin/customers" className={styles.actionLink}>
              <span className={styles.actionIcon}><UsersRound /></span>
              <span><strong>Customer accounts</strong><small>View registered and active users</small></span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/admin/products" className={styles.actionLink}>
              <span className={styles.actionIcon}><Package /></span>
              <span><strong>Product catalog</strong><small>Add, update, and archive products</small></span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/shop" className={styles.actionLink}>
              <span className={styles.actionIcon}><Store /></span>
              <span><strong>View storefront</strong><small>Check the live product collection</small></span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </article>
        </section>

        <footer className={styles.footerNote}>
          <span>Store dashboard</span>
          <Link href="/customerDashboard">
            My account <ArrowDownRight aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
