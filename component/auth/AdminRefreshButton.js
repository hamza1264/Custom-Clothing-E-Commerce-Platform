"use client";

import { RefreshCw } from "lucide-react";
import styles from "./AdminDashboard.module.css";

export default function AdminRefreshButton({ onRefresh, disabled = false }) {
  return (
    <button
      type="button"
      className={styles.refreshButton}
      onClick={onRefresh ?? (() => window.location.reload())}
      disabled={disabled}
    >
      <RefreshCw aria-hidden="true" />
      Refresh data
    </button>
  );
}
