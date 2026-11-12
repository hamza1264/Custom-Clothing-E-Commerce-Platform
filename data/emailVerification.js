import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

export function createEmailVerificationToken() {
  const token = randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: createHash("sha256").update(token).digest("hex"),
    expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
  };
}

export function hashEmailVerificationToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function isEmailVerificationConfigured() {
  return Boolean(
    process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.APP_URL
  );
}

export async function sendEmailVerification({ email, name, token }) {
  const verificationUrl = new URL("/api/auth/verify", process.env.APP_URL);
  verificationUrl.searchParams.set("token", token);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `ILHAM COLLECTION <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your ILHAM COLLECTION account",
    text: `Hello ${name},\n\nClick this link to verify your email address and finish creating your account:\n${verificationUrl}\n\nThis link expires in 24 hours. If you did not request this, you can ignore this email.`,
  });
}
