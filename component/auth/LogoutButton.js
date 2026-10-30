"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Auth.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logout = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setError("Could not log out. Please try again.");
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <button
        className={styles.logout}
        disabled={isSubmitting}
        onClick={logout}
        type="button"
      >
        {isSubmitting ? "Logging out..." : "Log out"}
      </button>
    </>
  );
}
