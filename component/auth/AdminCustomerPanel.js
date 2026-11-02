"use client";

import { useEffect, useState } from "react";
import styles from "./Auth.module.css";

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
        throw new Error(result.error || "Could not load customer information.");
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
    return <p role="status">Loading customer information...</p>;
  }

  return (
    <div className={styles.adminCustomerLists}>
      <section className={styles.orderHistory} aria-labelledby="registered-title">
        <h2 id="registered-title">
          Registered users ({data.registeredUsers.length})
        </h2>
        <p>Accounts saved in the users database collection.</p>
        {data.registeredUsers.length === 0 ? (
          <p>No registered users yet.</p>
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

      <section className={styles.orderHistory} aria-labelledby="logged-in-title">
        <h2 id="logged-in-title">
          Logged-in users ({data.loggedInUsers.length})
        </h2>
        <p>
          Unexpired sessions that have not been logged out. Last refreshed{" "}
          {formatDate(data.asOf)}.
        </p>
        {data.loggedInUsers.length === 0 ? (
          <p>No users are currently logged in.</p>
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
    </div>
  );
}
