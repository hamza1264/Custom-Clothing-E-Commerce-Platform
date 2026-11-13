"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Boxes,
  ChevronRight,
  Clock3,
  CircleDollarSign,
  ClipboardList,
  House,
  MessageSquareText,
  MailCheck,
  Package,
  PackageCheck,
  ShoppingBag,
  Store,
  Tag,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AdminRefreshButton from "@/component/auth/AdminRefreshButton";
import AdminSidebar from "@/component/auth/AdminSidebar";
import styles from "./AdminDashboard.module.css";

const EMPTY_ARRAY = [];

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
  const [activityPeriod, setActivityPeriod] = useState("7");

  useEffect(() => {
    let active = true;
    let isFetching = false;

    async function loadDashboard(showLoading = false) {
      if (isFetching) return;
      isFetching = true;
      if (showLoading) setIsLoading(true);
      setError("");

      try {
        const [
          orderData,
          customerData,
          productData,
          contactMessageData,
          pendingVerificationData,
        ] = await Promise.all([
          getJson("/api/admin/orders"),
          getJson("/api/admin/customers"),
          getJson("/api/products?includeInactive=true"),
          getJson("/api/admin/contact-messages"),
          getJson("/api/admin/pending-email-verifications"),
        ]);
        if (active) {
          setDashboardData({
            orders: orderData.orders,
            customers: customerData.registeredUsers,
            activeUsers: customerData.loggedInUsers,
            products: productData.products,
            contactMessagesCount: contactMessageData.totalCount,
            pendingEmailVerificationsCount:
              pendingVerificationData.pendingEmailVerifications.length,
          });
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        isFetching = false;
        if (active && showLoading) setIsLoading(false);
      }
    }

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") loadDashboard();
    }

    loadDashboard(true);
    const refreshInterval = window.setInterval(refreshWhenVisible, 30_000);
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [reloadKey]);

  const orders = dashboardData ? dashboardData.orders : EMPTY_ARRAY;
  const products = dashboardData ? dashboardData.products : EMPTY_ARRAY;
  const customers = dashboardData ? dashboardData.customers : EMPTY_ARRAY;
  const activeUsers = dashboardData ? dashboardData.activeUsers : EMPTY_ARRAY;
  const contactMessagesCount = dashboardData?.contactMessagesCount ?? 0;
  const pendingEmailVerificationsCount =
    dashboardData?.pendingEmailVerificationsCount ?? 0;
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.total, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const newOrdersThisMonth = orders.filter(
    (order) => new Date(order.createdAt) >= monthStart
  ).length;
  const activeProducts = products.filter((product) => product.active);

  const weekActivity = useMemo(() => {
    const bucketCount = activityPeriod === "90" ? 13 : Number(activityPeriod);
    const daysPerBucket = activityPeriod === "90" ? 7 : 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDate = new Date(today);
    firstDate.setDate(today.getDate() - (bucketCount * daysPerBucket - 1));

    const buckets = Array.from({ length: bucketCount }, (_, index) => {
      const date = new Date(firstDate);
      date.setDate(firstDate.getDate() + index * daysPerBucket);
      return {
        date,
        label:
          activityPeriod === "7"
            ? date.toLocaleDateString(undefined, { weekday: "short" })
            : activityPeriod === "30"
              ? index % 5 === 0 || index === bucketCount - 1
                ? date.toLocaleDateString(undefined, { day: "numeric", month: "short" })
                : ""
              : `W${index + 1}`,
        count: 0,
      };
    });

    orders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      createdAt.setHours(0, 0, 0, 0);
      const offset = Math.floor(
        (createdAt.getTime() - firstDate.getTime()) / 86_400_000
      );
      const bucketIndex = Math.floor(offset / daysPerBucket);
      if (bucketIndex >= 0 && bucketIndex < buckets.length) {
        buckets[bucketIndex].count += 1;
      }
    });

    const maximum = Math.max(...buckets.map((day) => day.count), 1);
    return buckets.map((day) => ({
      ...day,
      height: Math.max((day.count / maximum) * 100, day.count ? 8 : 3),
    }));
  }, [orders, activityPeriod]);

  const topProducts = useMemo(() => {
    const quantities = new Map();
    orders
      .filter((order) => order.status !== "cancelled")
      .forEach((order) => {
        (order.items ?? []).forEach((item) => {
          const productId = String(item.productId ?? item.title ?? "");
          const current = quantities.get(productId) ?? {
            productId,
            title: item.title || "Product",
            image: item.image || "",
            quantity: 0,
            revenue: 0,
          };
          current.quantity += Number(item.quantity) || 0;
          current.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
          quantities.set(productId, current);
        });
      });

    return [...quantities.values()]
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 3)
      .map((item) => {
        const catalogProduct = products.find(
          (product) => String(product.id) === item.productId
        );
        return {
          ...item,
          title: catalogProduct?.title ?? catalogProduct?.name ?? item.title,
          image:
            catalogProduct?.image ??
            catalogProduct?.images?.[0] ??
            item.image,
        };
      });
  }, [orders, products]);

  const recentOrders = orders.slice(0, 5);
  const periodLabel =
    activityPeriod === "7"
      ? "Last 7 days"
      : activityPeriod === "30"
        ? "Last 30 days"
        : "Last 3 months";

  return (
    <main className={`${styles.page} ${styles.overviewPage}`}>
      <AdminSidebar
        name={name}
        email={email}
        activeItem="overview"
        orderCount={orders.length}
        isLoading={isLoading}
      />

      <div className={styles.content}>
        <header className={styles.topbar} id="overview">
          <div className={styles.overviewPageHeading}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/admin" aria-label="Admin dashboard">
                <House aria-hidden="true" />
              </Link>
              <ChevronRight aria-hidden="true" />
              <span aria-current="page">Admin Dashboard</span>
            </nav>
            <h1>Dashboard Overview</h1>
            <p className={styles.welcomeText}>
              Welcome back, {name}
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

        <section className={styles.ordersSummary} aria-label="Store summary">
          <article className={styles.ordersStatCard}>
            <span className={`${styles.ordersStatIcon} ${styles.ordersStat_rose}`}><CircleDollarSign /></span>
            <div className={styles.ordersStatContent}>
              <p>Total sales</p>
              <strong>{isLoading ? "—" : formatCurrency(revenue)}</strong>
              <small>Excludes cancelled orders</small>
            </div>
          </article>
          <article className={styles.ordersStatCard}>
            <span className={`${styles.ordersStatIcon} ${styles.ordersStat_amber}`}><ClipboardList /></span>
            <div className={styles.ordersStatContent}>
              <p>Total orders</p>
              <strong>{isLoading ? "—" : orders.length}</strong>
              <small>All-time customer orders</small>
            </div>
          </article>
          <article className={styles.ordersStatCard}>
            <span className={`${styles.ordersStatIcon} ${styles.ordersStat_green}`}><ShoppingBag /></span>
            <div className={styles.ordersStatContent}>
              <p>New orders</p>
              <strong>{isLoading ? "—" : newOrdersThisMonth}</strong>
              <small>This month</small>
            </div>
          </article>
          <article className={styles.ordersStatCard}>
            <span className={`${styles.ordersStatIcon} ${styles.ordersStat_plum}`}><Tag /></span>
            <div className={styles.ordersStatContent}>
              <p>Active products</p>
              <strong>{isLoading ? "—" : activeProducts.length}</strong>
              <small>Available in storefront</small>
            </div>
          </article>
        </section>

        <section className={styles.overviewPeople} aria-label="Community summary">
          <article className={styles.overviewPeopleCard}>
            <span className={`${styles.overviewPeopleIcon} ${styles.ordersStat_rose}`}><UsersRound /></span>
            <div>
              <p>Registered users</p>
              <strong>{isLoading ? "—" : customers.length}</strong>
            </div>
            <Link href="/admin/customers" aria-label="View registered users">
              <ArrowRight aria-hidden="true" />
            </Link>
          </article>
          <article className={styles.overviewPeopleCard}>
            <span className={`${styles.overviewPeopleIcon} ${styles.ordersStat_green}`}><Activity /></span>
            <div>
              <p>Active users</p>
              <strong>{isLoading ? "—" : activeUsers.length}</strong>
            </div>
            <Link href="/admin/users" aria-label="View active users">
              <ArrowRight aria-hidden="true" />
            </Link>
          </article>
          <article className={styles.overviewPeopleCard}>
            <span className={`${styles.overviewPeopleIcon} ${styles.ordersStat_plum}`}><MessageSquareText /></span>
            <div>
              <p>Contact messages</p>
              <strong>{isLoading ? "—" : contactMessagesCount}</strong>
            </div>
            <Link href="/admin/contact-messages" aria-label="View contact messages">
              <ArrowRight aria-hidden="true" />
            </Link>
          </article>
          <article className={styles.overviewPeopleCard}>
            <span className={`${styles.overviewPeopleIcon} ${styles.ordersStat_amber}`}><MailCheck /></span>
            <div>
              <p>Pending verifications</p>
              <strong>{isLoading ? "—" : pendingEmailVerificationsCount}</strong>
            </div>
            <Link
              href="/admin/pending-verifications"
              aria-label="View pending email verifications"
            >
              <ArrowRight aria-hidden="true" />
            </Link>
          </article>
        </section>

        <section className={styles.middleGrid} aria-label="Store activity">
          <article className={styles.panel}>
            <div className={styles.panelHeading}>
              <div>
                <p className={styles.eyebrow}>STORE PERFORMANCE</p>
                <h2>Order activity</h2>
                <p className={styles.chartSubtitle}>{periodLabel}</p>
              </div>
              <div className={styles.chartControls} aria-label="Chart date range">
                {[
                  ["7", "7 Days"],
                  ["30", "30 Days"],
                  ["90", "3 Months"],
                ].map(([period, label]) => (
                  <button
                    className={activityPeriod === period ? styles.chartPeriodActive : ""}
                    key={period}
                    onClick={() => setActivityPeriod(period)}
                    type="button"
                    aria-pressed={activityPeriod === period}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {error ? (
              <p className={styles.notice}>Activity is unavailable right now.</p>
            ) : (
              <div
                className={styles.chart}
                style={{ gridTemplateColumns: `repeat(${weekActivity.length}, minmax(0, 1fr))` }}
                aria-label={`${periodLabel} orders per ${activityPeriod === "90" ? "week" : "day"}`}
              >
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
            <p className={styles.activityTotal}>
              {weekActivity.reduce((sum, day) => sum + day.count, 0)} orders in this period
            </p>
          </article>

          <article className={`${styles.panel} ${styles.quickActions} ${styles.overviewQuickActions}`}>
            <div className={styles.panelHeading}>
              <div>
                <p className={styles.eyebrow}>QUICK ACCESS</p>
                <h2>Manage your store</h2>
              </div>
              <Boxes aria-hidden="true" className={styles.headingIcon} />
            </div>
            <Link href="/admin/customers" className={styles.actionLink}>
              <span className={styles.actionIcon}><UsersRound /></span>
              <span><strong>Customer accounts</strong><small>View registered and active users</small></span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/admin/orders" className={styles.actionLink}>
              <span className={styles.actionIcon}><ClipboardList /></span>
              <span><strong>Orders</strong><small>Review and update fulfillment</small></span>
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

        <section className={styles.overviewBottomGrid} aria-label="Recent store activity">
          <article className={`${styles.panel} ${styles.overviewRecentPanel}`}>
            <div className={styles.panelHeading}>
              <div className={styles.overviewSectionTitle}>
                <span className={styles.overviewSectionIcon}><Clock3 aria-hidden="true" /></span>
                <div>
                  <h2>Recent orders</h2>
                  <p>Latest customer orders</p>
                </div>
              </div>
              <Link className={styles.overviewViewAll} href="/admin/orders">
                View all <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className={styles.overviewEmptyState}>
                <ClipboardList aria-hidden="true" />
                <p>No customer orders yet.</p>
              </div>
            ) : (
              <div className={styles.overviewTableWrap}>
                <table className={styles.overviewTable}>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.orderNumber}>
                        <td className={styles.overviewOrderNumber}>{order.orderNumber}</td>
                        <td>{order.customer?.name || "Customer"}</td>
                        <td>{order.items?.[0]?.title || "Product"}</td>
                        <td className={styles.overviewAmount}>{formatCurrency(order.total)}</td>
                        <td>
                          <span className={`${styles.overviewStatus} ${styles[`overviewStatus_${order.status}`] ?? ""}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className={`${styles.panel} ${styles.overviewTopProducts}`}>
            <div className={styles.panelHeading}>
              <div className={styles.overviewSectionTitle}>
                <span className={styles.overviewSectionIcon}><PackageCheck aria-hidden="true" /></span>
                <div>
                  <h2>Top products</h2>
                  <p>Best selling by units ordered</p>
                </div>
              </div>
              <Link className={styles.overviewViewAll} href="/admin/products" aria-label="View all products">
                View all <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            {topProducts.length === 0 ? (
              <div className={styles.overviewEmptyState}>
                <Package aria-hidden="true" />
                <p>Products will appear here after they are ordered.</p>
              </div>
            ) : (
              <div className={styles.topProductList}>
                {topProducts.map((product, index) => (
                  <div className={styles.topProduct} key={product.productId}>
                    <span className={styles.topProductRank}>0{index + 1}</span>
                    <div className={styles.topProductImage}>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          width={54}
                          height={62}
                          unoptimized
                        />
                      ) : (
                        <Package aria-hidden="true" />
                      )}
                    </div>
                    <div className={styles.topProductInfo}>
                      <strong>{product.title}</strong>
                      <small>{product.quantity} {product.quantity === 1 ? "unit" : "units"} ordered</small>
                    </div>
                    <strong className={styles.topProductRevenue}>
                      {formatCurrency(product.revenue)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
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
