"use client";

import { MailCheck, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./Auth.module.css";
import dashboardStyles from "./AdminDashboard.module.css";

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminPendingEmailVerificationsPanel() {
  const [registrations, setRegistrations] = useState(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadVerifications() {
      const response = await fetch("/api/admin/pending-email-verifications", {
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || "Could not load pending email verifications."
        );
      }
      if (active) setRegistrations(result.pendingEmailVerifications);
    }

    loadVerifications().catch((requestError) => {
      if (active) setError(requestError.message);
    });

    return () => {
      active = false;
    };
  }, []);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (registrations ?? []).filter(
      (registration) =>
        !query ||
        registration.name.toLowerCase().includes(query) ||
        registration.email.toLowerCase().includes(query)
    );
  }, [registrations, search]);

  async function deleteVerification(registration) {
    if (
      !window.confirm(
        `Delete the pending verification for ${registration.email}? They will need to register again to receive a new verification link.`
      )
    ) {
      return;
    }

    setDeletingId(registration.id);
    setActionError("");
    try {
      const response = await fetch(
        `/api/admin/pending-email-verifications/${encodeURIComponent(registration.id)}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || "Could not delete the pending email verification."
        );
      }
      setRegistrations((current) =>
        current.filter((item) => item.id !== registration.id)
      );
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }
  if (!registrations) {
    return <p role="status">Loading pending email verifications...</p>;
  }

  return (
    <section
      className={`${dashboardStyles.panel} ${dashboardStyles.ordersPanel} ${styles.customerPanel}`}
      aria-labelledby="pending-verifications-title"
    >
      <div className={dashboardStyles.panelHeading}>
        <div className={styles.customerTitle}>
          <span className={styles.customerTitleIcon}>
            <MailCheck aria-hidden="true" />
          </span>
          <div>
            <h2 id="pending-verifications-title">Sign-ups Awaiting Confirmation</h2>
            <p>Only active, unexpired verification requests are shown.</p>
          </div>
        </div>
        <span className={dashboardStyles.ordersCount}>
          {filteredRegistrations.length} of {registrations.length} pending
        </span>
      </div>
      {actionError && (
        <p className={styles.error} role="alert">{actionError}</p>
      )}

      {registrations.length === 0 ? (
        <div className={styles.adminEmptyState}>
          No pending email verifications.
        </div>
      ) : (
        <>
          <label className={styles.customerSearch}>
            <Search aria-hidden="true" />
            <span className={styles.visuallyHidden}>
              Search pending verifications
            </span>
            <input
              type="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          {filteredRegistrations.length === 0 ? (
            <div className={styles.adminEmptyState}>
              No pending verifications match your search.
            </div>
          ) : (
            <div className={`${styles.adminTableWrap} ${styles.customerTableWrap}`}>
              <table className={`${styles.adminTable} ${styles.customerTable}`}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Sign-up date</th>
                    <th>Link expires</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id}>
                      <td className={styles.customerName}>{registration.name}</td>
                      <td>{registration.email}</td>
                      <td>{formatDate(registration.createdAt)}</td>
                      <td>{formatDate(registration.expiresAt)}</td>
                      <td>
                        <span
                          className={`${styles.customerStatus} ${styles.customerStatusRegistered}`}
                        >
                          Pending
                        </span>
                      </td>
                      <td>
                        <button
                          className={styles.adminDeleteButton}
                          disabled={deletingId === registration.id}
                          onClick={() => deleteVerification(registration)}
                          type="button"
                        >
                          {deletingId === registration.id ? (
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
  );
}
