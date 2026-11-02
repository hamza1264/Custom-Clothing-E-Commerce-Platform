"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "./Auth.module.css";

export default function AuthForm({ isConfigured }) {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${isSignup ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to sign in. Please try again.");
        return;
      }

      router.replace("/customerDashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>NAYAB CLOTHES ACCOUNT</p>
      <h1 className={styles.title}>
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className={styles.description}>
        {isSignup
          ? "Sign up to keep your orders and outfits in one place."
          : "Log in to continue shopping with Nayab Clothes."}
      </p>

      {!isConfigured && (
        <p className={styles.setupNotice} role="status">
          Account access needs MongoDB configuration. Set MONGODB_URI,
          MONGODB_DB_NAME, and AUTH_SECRET in your deployment environment settings.
        </p>
      )}

      <div className={styles.tabs} role="tablist" aria-label="Account access">
        <button
          type="button"
          role="tab"
          aria-selected={!isSignup}
          className={!isSignup ? styles.activeTab : ""}
          onClick={() => {
            setMode("login");
            setError("");
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
          }}
        >
          Sign up
        </button>
      </div>

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
              maxLength={72}
              minLength={8}
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
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </span>
          <span className={styles.hint}>Use at least 8 characters.</span>
        </label>

        {error && (
          <p className={styles.error} role="alert">
            {error}
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

      <p className={styles.switchMode}>
        {isSignup ? "Already have an account?" : "New to Nayab Fashion?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(isSignup ? "login" : "signup");
            setError("");
          }}
        >
          {isSignup ? "Log in" : "Create an account"}
        </button>
      </p>
    </section>
  );
}
