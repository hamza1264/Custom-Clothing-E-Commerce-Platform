import { hashEmailVerificationToken } from "@/data/emailVerification";
import { getDatabase } from "@/data/mongodb";

export const runtime = "nodejs";

export async function GET(request) {
  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    return Response.json(
      { error: "Email verification is not configured." },
      { status: 503 }
    );
  }

  const loginUrl = new URL("/login", appUrl);
  const token = new URL(request.url).searchParams.get("token");
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    loginUrl.searchParams.set("verified", "0");
    return Response.redirect(loginUrl);
  }

  const database = await getDatabase();
  const pendingRegistrations = database.collection("pending_email_verifications");
  const tokenHash = hashEmailVerificationToken(token);
  const pendingRegistration = await pendingRegistrations.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  if (!pendingRegistration) {
    loginUrl.searchParams.set("verified", "0");
    return Response.redirect(loginUrl);
  }

  const users = database.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });
  try {
    await users.insertOne({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash,
      createdAt: pendingRegistration.createdAt,
      emailVerifiedAt: new Date(),
    });
  } catch (error) {
    if (error?.code !== 11000) throw error;
  }

  await pendingRegistrations.deleteOne({
    _id: pendingRegistration._id,
    tokenHash,
  });

  loginUrl.searchParams.set("verified", "1");
  return Response.redirect(loginUrl);
}
