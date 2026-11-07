"use client";

import {
  Activity,
  Hourglass,
  Search,
  Timer,
  Trash2,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./Auth.module.css";
import dashboardStyles from "./AdminDashboard.module.css";

function formatDate(value) {
  return new Date(value).toLocaleString();
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

function formatDuration(milliseconds) {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function AdminLoggedInUsersPanel() {
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

  async function deleteSession(session) {
    if (
      !window.confirm(
        `End the active login session for ${session.email}? The account will remain registered.`
      )
    ) {
      return;
    }

    setDeletingId(session.id);
    setActionError("");
    try {
      const response = await fetch(
        `/api/admin/sessions/${encodeURIComponent(session.id)}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not end login session.");
      }
      setData((current) => ({
        ...current,
        loggedInUsers: current.loggedInUsers.filter(
          (item) => item.id !== session.id
        ),
      }));
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (data?.loggedInUsers ?? []).filter(
      (session) =>
        !query ||
        session.name.toLowerCase().includes(query) ||
        session.email.toLowerCase().includes(query)
    );
  }, [data?.loggedInUsers, search]);

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }
  if (!data) {
    return <p role="status">Loading logged-in users...</p>;
  }

  const now = new Date();
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
  const sessionsStartedLastHour = data.loggedInUsers.filter(
    (session) => new Date(session.createdAt) >= lastHour
  ).length;
  const averageSessionAge =
    data.loggedInUsers.length === 0
      ? 0
      : data.loggedInUsers.reduce(
          (total, session) =>
            total + Math.max(0, now.getTime() - new Date(session.createdAt).getTime()),
          0
        ) / data.loggedInUsers.length;
  const expiringToday = data.loggedInUsers.filter((session) => {
    const expiresAt = new Date(session.expiresAt);
    return (
      expiresAt >= new Date(now.getFullYear(), now.getMonth(), now.getDate()) &&
      expiresAt < new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    );
  }).length;
  const summary = [
    {
      label: "Total active sessions",
      value: data.loggedInUsers.length,
      detail: "Not expired or signed out",
      icon: UserRoundCheck,
      tone: "rose",
    },
    {
      label: "New sessions · last hour",
      value: sessionsStartedLastHour,
      detail: "Recently signed in",
      icon: Activity,
      tone: "green",
    },
    {
      label: "Average session age",
      value: formatDuration(averageSessionAge),
      detail: "Since the current sign-in",
      icon: Timer,
      tone: "amber",
    },
    {
      label: "Sessions expiring today",
      value: expiringToday,
      detail: "Based on session expiry",
      icon: Hourglass,
      tone: "plum",
    },
  ];

  return (
    <>
      <section
        className={dashboardStyles.ordersSummary}
        aria-label="Active session summary"
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
          </article>
        ))}
      </section>

      <section
        className={`${dashboardStyles.panel} ${dashboardStyles.ordersPanel} ${styles.sessionPanel}`}
        aria-labelledby="logged-in-title"
      >
        <div className={dashboardStyles.panelHeading}>
          <div className={styles.sessionTitle}>
            <span className={styles.customerTitleIcon}>
              <Activity aria-hidden="true" />
            </span>
            <div>
              <h2 id="logged-in-title">Active Users</h2>
              <p>Sessions that have not expired or been logged out</p>
            </div>
            <span className={styles.liveBadge}>
              <span aria-hidden="true" />
              Active
            </span>
          </div>
          <span className={dashboardStyles.ordersCount}>
            {filteredSessions.length} of {data.loggedInUsers.length} sessions
          </span>
        </div>
        <div className={styles.sessionToolbar}>
          <p className={styles.adminPanelDescription}>
            Active sessions · Last refreshed {formatDate(data.asOf)}.
          </p>
          <label className={styles.sessionSearch}>
            <span className={styles.visuallyHidden}>Search active sessions</span>
            <input
              type="search"
              placeholder="Search active users..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Search aria-hidden="true" />
          </label>
        </div>
        {actionError && <p className={styles.error} role="alert">{actionError}</p>}
        {data.loggedInUsers.length === 0 ? (
          <div className={styles.adminEmptyState}>No users are currently logged in.</div>
        ) : filteredSessions.length === 0 ? (
          <div className={styles.adminEmptyState}>No active sessions match your search.</div>
        ) : (
          <div className={`${styles.adminTableWrap} ${styles.customerTableWrap}`}>
            <table className={`${styles.adminTable} ${styles.sessionTable}`}>
              <thead>
                <tr>
                  <th>User profile</th>
                  <th>Session started</th>
                  <th>Last active</th>
                  <th>Session age</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => (
                  <tr key={session.id}>
                    <td>
                      <div className={styles.sessionUser}>
                        <span className={styles.customerAvatar} aria-hidden="true">
                          {getInitials(session.name)}
                        </span>
                      <span>
                        <strong>{session.name}</strong>
                        <small>{session.email}</small>
                      </span>
                      </div>
                    </td>
                    <td>{formatDate(session.createdAt)}</td>
                    <td>{formatDate(session.lastSeenAt)}</td>
                    <td>
                      {formatDuration(now.getTime() - new Date(session.createdAt).getTime())}
                    </td>
                    <td>{formatDate(session.expiresAt)}</td>
                    <td>
                      <span className={`${styles.customerStatus} ${styles.customerStatusActive}`}>
                        <span aria-hidden="true" />
                        Active
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.adminDeleteButton}
                        disabled={deletingId === session.id}
                        onClick={() => deleteSession(session)}
                        type="button"
                      >
                        {deletingId === session.id ? (
                          "Ending..."
                        ) : (
                          <>
                            <Trash2 aria-hidden="true" />
                            End session
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
      </section>
    </>
  );
}
