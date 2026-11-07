"use client";

import {
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock3,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./AdminDashboard.module.css";

const ORDER_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_LABELS = {
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

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

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/orders", {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Could not load admin orders.");
        }
        if (active) setOrders(result.orders);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  const visibleOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        order.orderNumber.toLowerCase().includes(normalizedSearch) ||
        order.customer.name.toLowerCase().includes(normalizedSearch) ||
        order.customer.phone.toLowerCase().includes(normalizedSearch) ||
        order.items.some(
          (item) =>
            String(item.title ?? "").toLowerCase().includes(normalizedSearch) ||
            String(item.productId ?? "")
              .toLowerCase()
              .includes(normalizedSearch)
        );
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const orderSummary = useMemo(
    () => [
      {
        label: "Total orders",
        value: orders.length,
        detail: "Orders received",
        icon: ShoppingBag,
        tone: "rose",
      },
      {
        label: "Pending fulfillment",
        value: orders.filter(
          (order) => !["delivered", "cancelled"].includes(order.status)
        ).length,
        detail: "Still in progress",
        icon: Clock3,
        tone: "amber",
      },
      {
        label: "Completed orders",
        value: orders.filter((order) => order.status === "delivered").length,
        detail: "Successfully delivered",
        icon: CircleCheck,
        tone: "green",
      },
      {
        label: "Cancelled orders",
        value: orders.filter((order) => order.status === "cancelled").length,
        detail: "Cancelled by customer",
        icon: CircleX,
        tone: "plum",
      },
    ],
    [orders]
  );

  async function updateOrderStatus(orderNumber, status) {
    setUpdatingOrder(orderNumber);
    setActionError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderNumber)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not update order status.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.orderNumber === orderNumber
            ? { ...order, status: result.status }
            : order
        )
      );
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setUpdatingOrder("");
    }
  }

  return (
    <>
      <section className={styles.ordersSummary} aria-label="Order summary">
        {orderSummary.map(({ label, value, detail, icon: Icon, tone }) => (
          <article className={styles.ordersStatCard} key={label}>
            <span className={`${styles.ordersStatIcon} ${styles[`ordersStat_${tone}`]}`}>
              <Icon aria-hidden="true" />
            </span>
            <div className={styles.ordersStatContent}>
              <p>{label}</p>
              <strong>{isLoading ? "—" : value}</strong>
              <small>{detail}</small>
            </div>
            <svg
              className={styles.ordersSparkline}
              viewBox="0 0 110 44"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2 39 22 31 39 34 57 17 73 24 92 5 108 12" />
            </svg>
          </article>
        ))}
      </section>

      <section
        className={`${styles.panel} ${styles.ordersPanel}`}
        aria-labelledby="orders-title"
      >
      <div className={styles.panelHeading}>
        <div>
          <p className={styles.eyebrow}>ORDER MANAGEMENT</p>
          <h2 id="orders-title">All orders</h2>
        </div>
        <span className={styles.ordersCount}>
          {isLoading
            ? "Loading..."
            : `${visibleOrders.length} ${visibleOrders.length === 1 ? "order" : "orders"}`}
        </span>
      </div>

      <div className={`${styles.toolbar} ${styles.ordersToolbar}`}>
        <label className={styles.searchBox}>
          <Search aria-hidden="true" />
          <span className={styles.visuallyHidden}>Search orders</span>
          <input
            type="search"
            placeholder="Search by order, customer, phone or product"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className={styles.filterLabel}>
          <span className={styles.visuallyHidden}>Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option value={status} key={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {actionError && (
        <p className={styles.error} role="alert">{actionError}</p>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {isLoading && <p className={styles.notice}>Loading orders...</p>}
      {!isLoading && !error && visibleOrders.length === 0 && (
        <div className={styles.emptyState}>
          <ClipboardList aria-hidden="true" />
          <p>
            {orders.length
              ? "No orders match your search."
              : "No orders yet. New customer orders will show up here."}
          </p>
        </div>
      )}
      {!isLoading && !error && visibleOrders.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfillment status</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => {
                const itemCount = order.items.reduce(
                  (count, item) => count + item.quantity,
                  0
                );
                return (
                  <tr key={order.orderNumber}>
                    <td className={styles.orderNumber}>{order.orderNumber}</td>
                    <td>
                      <strong className={styles.customerName}>
                        {order.customer?.name || "Customer"}
                      </strong>
                      <small className={styles.customerPhone}>
                        {order.customer?.phone || "—"}
                      </small>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <div className={styles.orderItems}>
                        <strong>
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </strong>
                        {order.items.map((item, index) => (
                          <div
                            className={styles.orderItem}
                            key={`${item.productId ?? "product"}-${index}`}
                          >
                            <span className={styles.orderItemTitle}>
                              {item.title || "Product title unavailable"}
                            </span>
                            <small className={styles.orderItemMeta}>
                              ID: {item.productId || "Unavailable"} · Qty:{" "}
                              {item.quantity}
                            </small>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className={styles.orderTotal}>
                      {formatCurrency(order.total)}
                    </td>
                    <td>{order.paymentMethod || "—"}</td>
                    <td>
                      <label className={styles.statusControl}>
                        <span className={styles.visuallyHidden}>
                          Update status for {order.orderNumber}
                        </span>
                        <select
                          className={`${styles.statusSelect} ${styles[`status_${order.status}`] ?? ""}`}
                          value={order.status}
                          disabled={updatingOrder === order.orderNumber}
                          onChange={(event) =>
                            updateOrderStatus(
                              order.orderNumber,
                              event.target.value
                            )
                          }
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option value={status} key={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </section>
    </>
  );
}
