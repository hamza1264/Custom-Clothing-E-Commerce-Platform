"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Auth.module.css";

export default function AuthForm({
  initialMode = "login",
  isConfigured,
  authConfigured = true,
  adminOnly = false,
  emailVerified = false,
  emailVerificationFailed = false,
  returnTo = "/customerDashboard",
}) {
  const router = useRouter();
  const [mode, setMode] = useState(
    adminOnly || initialMode !== "signup" ? "login" : initialMode
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    emailVerified
      ? "Your email is verified. You can now log in."
      : emailVerificationFailed
        ? "This verification link is invalid or expired. Please sign up again."
        : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const endpoint = adminOnly
        ? "admin-login"
        : isSignup
          ? "register"
          : "login";
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to sign in. Please try again.");
        return;
      }

      if (isSignup) {
        setNotice(result.message);
        return;
      }

      router.replace(returnTo);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardIcon} aria-hidden="true">
        <LockKeyhole size={21} strokeWidth={1.8} />
      </div>
      <p className={styles.eyebrow}>
        {adminOnly ? "ILHAM COLLECTION · ADMIN" : "ILHAM COLLECTION ACCOUNT"}
      </p>
      <h1 className={styles.title}>
        {adminOnly
          ? "Admin sign in"
          : isSignup
            ? "Create your account"
            : "Welcome back"}
      </h1>
      <p className={styles.description}>
        {adminOnly
          ? "Sign in with the admin credentials configured for this store."
          : isSignup
            ? "Sign up to keep your orders and outfits in one place."
            : "Log in to continue shopping with ILHAM COLLECTION."}
      </p>

      {!isConfigured && (
        <p className={styles.setupNotice} role="status">
          {adminOnly
            ? authConfigured
              ? "Admin login needs ADMIN_EMAILS and an ADMIN_PASSWORD of at least 12 characters in your .env file."
              : "Account access needs MongoDB configuration. Set MONGODB_URI, MONGODB_DB_NAME, and AUTH_SECRET in your environment settings."
            : "Account access needs MongoDB configuration. Set MONGODB_URI, MONGODB_DB_NAME, and AUTH_SECRET in your deployment environment settings."}
        </p>
      )}

      {!adminOnly && (
        <div className={styles.tabs} role="tablist" aria-label="Account access">
          <button
            type="button"
            role="tab"
            aria-selected={!isSignup}
            className={!isSignup ? styles.activeTab : ""}
            onClick={() => {
              setMode("login");
              setError("");
              setNotice("");
            }}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isSignup}
            className={isSignup ? styles.activeTab : ""}
            onClick={() => {
              setMode("signup");
              setError("");
              setNotice("");
            }}
          >
            Sign up
          </button>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        {isSignup && (
          <label>
            Full name
            <input
              autoComplete="name"
              maxLength={80}
              minLength={2}
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </label>
        )}
        <label>
          Email address
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <span className={styles.passwordInput}>
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              maxLength={adminOnly ? 1024 : 72}
              minLength={adminOnly ? 12 : 8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((isVisible) => !isVisible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </span>
          <span className={styles.hint}>
            Use at least {adminOnly ? 12 : 8} characters.
          </span>
        </label>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className={styles.success} role="status">
            {notice}
          </p>
        )}

        <button
          className={styles.submit}
          disabled={isSubmitting || !isConfigured}
          type="submit"
        >
          {isSubmitting
            ? "Please wait..."
            : isSignup
              ? "Create account"
              : "Log in"}
        </button>
      </form>

      {!adminOnly && (
        <p className={styles.switchMode}>
          {isSignup ? "Already have an account?" : "New to ILHAM COLLECTION?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? "login" : "signup");
              setError("");
              setNotice("");
            }}
          >
            {isSignup ? "Log in" : "Create an account"}
          </button>
        </p>
      )}
    </section>
  );
}
