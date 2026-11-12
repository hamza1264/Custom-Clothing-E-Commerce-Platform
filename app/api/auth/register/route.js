import bcrypt from "bcryptjs";
import {
  createEmailVerificationToken,
  isEmailVerificationConfigured,
  sendEmailVerification,
} from "@/data/emailVerification";
import { isAuthConfigured } from "@/data/auth";
import {
  authNotConfiguredResponse,
  isValidEmail,
  normalizeEmail,
  readAuthRequest,
} from "@/data/authRequest";
import { getDatabase } from "@/data/mongodb";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isAuthConfigured()) return authNotConfiguredResponse();
  if (!isEmailVerificationConfigured()) {
    return Response.json(
      {
        error:
          "Email verification is not configured. Set SMTP_USER, SMTP_PASSWORD, and APP_URL.",
      },
      { status: 503 }
    );
  }

  const parsed = await readAuthRequest(request);
  if (parsed.response) return parsed.response;

  const { name, email: rawEmail, password } = parsed.body ?? {};
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const email = normalizeEmail(rawEmail);

  if (normalizedName.length < 2 || normalizedName.length > 80) {
    return Response.json(
      { error: "Name must be between 2 and 80 characters." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return Response.json(
      { error: "Password must be 8–72 bytes long." },
      { status: 400 }
    );
  }

  const database = await getDatabase();
  const users = database.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });

  if (await users.findOne({ email }, { projection: { _id: 1 } })) {
    return Response.json(
      { error: "An account with this email already exists. Please log in." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const verification = createEmailVerificationToken();
  const pendingRegistrations = database.collection("pending_email_verifications");
  await pendingRegistrations.createIndex({ email: 1 }, { unique: true });
  await pendingRegistrations.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
  );

  const pendingRegistration = {
    name: normalizedName,
    email,
    passwordHash,
    createdAt: new Date(),
    tokenHash: verification.tokenHash,
    expiresAt: verification.expiresAt,
  };

  try {
    await pendingRegistrations.updateOne(
      { email },
      { $set: pendingRegistration },
      { upsert: true }
    );
  } catch (error) {
    if (error?.code === 11000) {
      return Response.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }
    throw error;
  }

  try {
    await sendEmailVerification({
      email,
      name: normalizedName,
      token: verification.token,
    });
  } catch (error) {
    await pendingRegistrations.deleteOne({
      email,
      tokenHash: verification.tokenHash,
    });
    console.error("Could not send signup verification email.", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? `Could not send a verification email: ${error.message}`
            : "Could not send a verification email. Please check the email service configuration.",
      },
      { status: 502 }
    );
  }

  return Response.json(
    {
      message: `A verification link has been sent to ${email}. Open it to finish creating your account.`,
    },
    { status: 202 }
  );
}
