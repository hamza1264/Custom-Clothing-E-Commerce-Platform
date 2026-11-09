"use client";

import { Mail, MessageSquareText, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./AdminContactMessagesPanel.module.css";
import dashboardStyles from "./AdminDashboard.module.css";
import authStyles from "./Auth.module.css";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("3")) return `92${digits}`;
  return digits;
}

export default function AdminContactMessagesPanel() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      try {
        const response = await fetch("/api/admin/contact-messages", {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Could not load contact messages.");
        }
        if (active) setMessages(result.messages);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadMessages();
    return () => {
      active = false;
    };
  }, []);

  async function deleteMessage(message) {
    if (
      !window.confirm(
        `Delete the contact message from ${message.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(message.id);
    setActionError("");
    try {
      const response = await fetch(
        `/api/admin/contact-messages/${encodeURIComponent(message.id)}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not delete contact message.");
      }

      setMessages((current) =>
        current.filter((item) => item.id !== message.id)
      );
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setDeletingId("");
    }
  }

  const visibleMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter((message) =>
      [
        message.name,
        message.email,
        message.phone,
        message.subject,
        message.message,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [messages, search]);

  return (
    <>
      <section className={dashboardStyles.ordersSummary} aria-label="Message summary">
        <article className={dashboardStyles.ordersStatCard}>
          <span
            className={`${dashboardStyles.ordersStatIcon} ${dashboardStyles.ordersStat_rose}`}
          >
            <MessageSquareText aria-hidden="true" />
          </span>
          <div className={dashboardStyles.ordersStatContent}>
            <p>Total messages</p>
            <strong>{isLoading ? "—" : messages.length}</strong>
            <small>Latest 250 submissions</small>
          </div>
        </article>
        <article className={dashboardStyles.ordersStatCard}>
          <span
            className={`${dashboardStyles.ordersStatIcon} ${dashboardStyles.ordersStat_amber}`}
          >
            <Mail aria-hidden="true" />
          </span>
          <div className={dashboardStyles.ordersStatContent}>
            <p>Search results</p>
            <strong>{isLoading ? "—" : visibleMessages.length}</strong>
            <small>Matching messages</small>
          </div>
        </article>
      </section>

      <section className={`${dashboardStyles.panel} ${styles.panel}`}>
        <div className={dashboardStyles.panelHeading}>
          <div>
            <p className={dashboardStyles.eyebrow}>CUSTOMER CARE</p>
            <h2>Inbox</h2>
          </div>
          <span className={dashboardStyles.ordersCount}>
            {isLoading
              ? "Loading..."
              : `${visibleMessages.length} ${visibleMessages.length === 1 ? "message" : "messages"}`}
          </span>
        </div>

        <label className={`${dashboardStyles.searchBox} ${styles.searchBox}`}>
          <Search aria-hidden="true" />
          <span className={dashboardStyles.visuallyHidden}>
            Search contact messages
          </span>
          <input
            type="search"
            placeholder="Search name, email, subject or message"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        {actionError && (
          <p className={authStyles.error} role="alert">{actionError}</p>
        )}
        {error && <p className={authStyles.error} role="alert">{error}</p>}
        {isLoading && <p role="status">Loading contact messages...</p>}
        {!isLoading && !error && visibleMessages.length === 0 && (
          <div className={styles.emptyState}>
            <MessageSquareText aria-hidden="true" />
            <p>
              {messages.length
                ? "No messages match your search."
                : "No contact messages yet. New submissions will appear here."}
            </p>
          </div>
        )}

        {!isLoading && !error && visibleMessages.length > 0 && (
          <div className={styles.messageList}>
            {visibleMessages.map((message) => (
              <article className={styles.messageCard} key={message.id}>
                <div className={styles.messageHeader}>
                  <div className={styles.sender}>
                    <span className={styles.avatar} aria-hidden="true">
                      {message.name?.trim().charAt(0).toUpperCase() || "?"}
                    </span>
                    <div className={styles.senderDetails}>
                      <h3>{message.name}</h3>
                      <a href={`mailto:${message.email}`}>{message.email}</a>
                    </div>
                  </div>
                  <time className={styles.date} dateTime={message.createdAt}>
                    {formatDate(message.createdAt)}
                  </time>
                </div>

                <div className={styles.messageMeta}>
                  <span className={styles.subject}>{message.subject}</span>
                  {message.phone && (
                    <a
                      href={`https://wa.me/${getWhatsAppNumber(message.phone)}`}
                      className={styles.phone}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Chat with ${message.name} on WhatsApp`}
                    >
                      <FaWhatsapp aria-hidden="true" />
                      {message.phone}
                    </a>
                  )}
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => deleteMessage(message)}
                    disabled={deletingId === message.id}
                    aria-label={`Delete message from ${message.name}`}
                  >
                    <Trash2 aria-hidden="true" />
                    {deletingId === message.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
                <p className={styles.messageBody}>{message.message}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
