"use client";

import { useEffect, useState } from "react";
import styles from "./Auth.module.css";
import dashboardStyles from "./AdminDashboard.module.css";

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function AdminLoggedInUsersPanel() {
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
        throw new Error(result.error || "Could not load logged-in users.");
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
    return <p role="status">Loading logged-in users...</p>;
  }

  return (
    <section className={dashboardStyles.panel} aria-labelledby="logged-in-title">
      <div className={dashboardStyles.panelHeading}>
        <div>
          <p className={dashboardStyles.eyebrow}>ACTIVE SESSIONS</p>
          <h2 id="logged-in-title">Currently logged-in users</h2>
        </div>
        <span className={dashboardStyles.ordersCount}>
          {data.loggedInUsers.length} users
        </span>
      </div>
      <p className={styles.adminPanelDescription}>
        Active sessions that have not expired or been logged out. Last refreshed{" "}
        {formatDate(data.asOf)}.
      </p>
      {data.loggedInUsers.length === 0 ? (
        <div className={styles.adminEmptyState}>No users are currently logged in.</div>
      ) : (
        <div className={styles.adminTableWrap}>
          <table className={styles.adminTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Last seen</th>
                <th>Session expires</th>
              </tr>
            </thead>
            <tbody>
              {data.loggedInUsers.map((session) => (
                <tr key={`${session.email}-${session.createdAt}`}>
                  <td>{session.name}</td>
                  <td>{session.email}</td>
                  <td>{formatDate(session.lastSeenAt)}</td>
                  <td>{formatDate(session.expiresAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
