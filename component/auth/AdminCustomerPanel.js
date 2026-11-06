"use client";

import { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import dashboardStyles from "./AdminDashboard.module.css";

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function AdminCustomerPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      const response = await fetch("/api/admin/customers", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not load registered users.");
      }
      if (active) setData(result);
    }

    loadUsers().catch((requestError) => {
      if (active) setError(requestError.message);
    });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }
  if (!data) {
    return <p role="status">Loading registered users...</p>;
  }

  return (
    <section className={dashboardStyles.panel} aria-labelledby="registered-title">
      <div className={dashboardStyles.panelHeading}>
        <div>
          <p className={dashboardStyles.eyebrow}>CUSTOMER ACCOUNTS</p>
          <h2 id="registered-title">Registered users</h2>
        </div>
        <span className={dashboardStyles.ordersCount}>
          {data.registeredUsers.length} users
        </span>
      </div>
      {data.registeredUsers.length === 0 ? (
        <div className={styles.adminEmptyState}>No registered users yet.</div>
      ) : (
        <div className={styles.adminTableWrap}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {data.registeredUsers.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
