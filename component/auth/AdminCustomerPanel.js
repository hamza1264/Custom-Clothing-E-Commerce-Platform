"use client";

import {
  Search,
  Trash2,
  UserCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./Auth.module.css";
import dashboardStyles from "./AdminDashboard.module.css";

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminCustomerPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [search, setSearch] = useState("");

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

  async function deleteUser(user) {
    if (
      !window.confirm(
        `Delete the account for ${user.email}? Their active sessions will end. Existing orders will be kept.`
      )
    ) {
      return;
    }

    setDeletingId(user.id);
    setActionError("");
    try {
      const response = await fetch(
        `/api/admin/customers/${encodeURIComponent(user.id)}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not delete registered user.");
      }
      setData((current) => ({
        ...current,
        registeredUsers: current.registeredUsers.filter(
          (item) => item.id !== user.id
        ),
        loggedInUsers: current.loggedInUsers.filter(
          (session) => session.userId !== user.id
        ),
      }));
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  const activeEmails = useMemo(
    () =>
      new Set(
        (data?.loggedInUsers ?? []).map((session) =>
          String(session.email ?? "").toLowerCase()
        )
      ),
    [data?.loggedInUsers]
  );
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (data?.registeredUsers ?? []).filter(
      (user) =>
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [data?.registeredUsers, search]);

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }
  if (!data) {
    return <p role="status">Loading registered users...</p>;
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const newThisMonth = data.registeredUsers.filter(
    (user) => new Date(user.createdAt) >= monthStart
  ).length;
  const activeUserCount = data.registeredUsers.filter((user) =>
    activeEmails.has(user.email.toLowerCase())
  ).length;
  const summary = [
    {
      label: "Total registered",
      value: data.registeredUsers.length,
      detail: "Store accounts",
      icon: UsersRound,
      tone: "rose",
    },
    {
      label: "New users this month",
      value: newThisMonth,
      detail: "Joined this month",
      icon: UserRoundPlus,
      tone: "amber",
    },
    {
      label: "Active users",
      value: activeUserCount,
      detail: "With an active session",
      icon: UserCheck,
      tone: "green",
    },
    {
      label: "Registered today",
      value: data.registeredUsers.filter(
        (user) =>
          new Date(user.createdAt).toDateString() === new Date().toDateString()
      ).length,
      detail: "Joined today",
      icon: UserRoundPlus,
      tone: "plum",
    },
  ];

  return (
    <>
      <section
        className={dashboardStyles.ordersSummary}
        aria-label="Registered user summary"
      >
        {summary.map(({ label, value, detail, icon: Icon, tone }) => (
          <article className={dashboardStyles.ordersStatCard} key={label}>
            <span
              className={`${dashboardStyles.ordersStatIcon} ${dashboardStyles[`ordersStat_${tone}`]}`}
            >
              <Icon aria-hidden="true" />
            </span>
            <div className={dashboardStyles.ordersStatContent}>
              <p>{label}</p>
              <strong>{value}</strong>
              <small>{detail}</small>
            </div>
            <svg
              className={dashboardStyles.ordersSparkline}
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
        className={`${dashboardStyles.panel} ${dashboardStyles.ordersPanel} ${styles.customerPanel}`}
        aria-labelledby="registered-title"
      >
      <div className={dashboardStyles.panelHeading}>
        <div>
          <div className={styles.customerTitle}>
            <span className={styles.customerTitleIcon}>
              <UsersRound aria-hidden="true" />
            </span>
            <div>
              <h2 id="registered-title">Registered Users List</h2>
              <p>Detailed information about your store members</p>
            </div>
          </div>
        </div>
        <span className={dashboardStyles.ordersCount}>
          {filteredUsers.length} of {data.registeredUsers.length} users
        </span>
      </div>
      {actionError && <p className={styles.error} role="alert">{actionError}</p>}
      {data.registeredUsers.length === 0 ? (
        <div className={styles.adminEmptyState}>No registered users yet.</div>
      ) : (
        <>
          <label className={styles.customerSearch}>
            <Search aria-hidden="true" />
            <span className={styles.visuallyHidden}>Search users</span>
            <input
              type="search"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          {filteredUsers.length === 0 ? (
            <div className={styles.adminEmptyState}>
              No users match your search.
            </div>
          ) : (
            <div className={`${styles.adminTableWrap} ${styles.customerTableWrap}`}>
              <table className={`${styles.adminTable} ${styles.customerTable}`}>
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <span className={styles.customerAvatar} aria-hidden="true">
                          {getInitials(user.name)}
                        </span>
                      </td>
                      <td className={styles.customerName}>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <span
                          className={`${styles.customerStatus} ${
                            activeEmails.has(user.email.toLowerCase())
                              ? styles.customerStatusActive
                              : styles.customerStatusRegistered
                          }`}
                        >
                          {activeEmails.has(user.email.toLowerCase())
                            ? "Active"
                            : "Registered"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={styles.adminDeleteButton}
                          disabled={deletingId === user.id}
                          onClick={() => deleteUser(user)}
                          type="button"
                        >
                          {deletingId === user.id ? (
                            "Deleting..."
                          ) : (
                            <>
                              <Trash2 aria-hidden="true" />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          )}
        </>
      )}
      </section>
    </>
  );
}
