import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { errors, jwtVerify, SignJWT } from "jose";
import { getDatabase } from "@/data/mongodb";

export const SESSION_COOKIE_NAME = "unstage_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const globalForSessions = globalThis;

export function isAuthConfigured() {
  return Boolean(
    process.env.MONGODB_URI &&
      process.env.MONGODB_DB_NAME &&
      process.env.AUTH_SECRET &&
      process.env.AUTH_SECRET.length >= 32
  );
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters.");
  }

  return new TextEncoder().encode(secret);
}

async function getLoginSessionsCollection() {
  const collection = (await getDatabase()).collection("login_sessions");
  if (!globalForSessions.loginSessionIndexesPromise) {
    globalForSessions.loginSessionIndexesPromise = Promise.all([
      collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      collection.createIndex({ userId: 1, expiresAt: 1 }),
    ]);
  }

  try {
    await globalForSessions.loginSessionIndexesPromise;
  } catch (error) {
    globalForSessions.loginSessionIndexesPromise = null;
    throw error;
  }

  return collection;
}

export async function createSession(user) {
  const sessionId = randomUUID();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_MAX_AGE * 1000);
  const sessions = await getLoginSessionsCollection();
  await sessions.insertOne({
    _id: sessionId,
    userId: user.id,
    name: user.name,
    email: user.email,
    createdAt,
    lastSeenAt: createdAt,
    expiresAt,
  });

  const token = await new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(sessionId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return sessionId;
}

async function verifySessionToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.jti !== "string"
    ) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      sessionId: payload.jti,
    };
  } catch (error) {
    if (error instanceof errors.JOSEError) return null;
    throw error;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );
  if (!session) return null;

  const sessions = await getLoginSessionsCollection();
  const activeSession = await sessions.findOne({
    _id: session.sessionId,
    userId: session.id,
    expiresAt: { $gt: new Date() },
  });
  if (!activeSession) return null;

  const now = new Date();
  if (now.getTime() - activeSession.lastSeenAt.getTime() >= 5 * 60 * 1000) {
    await sessions.updateOne(
      { _id: session.sessionId },
      { $set: { lastSeenAt: now } }
    );
  }

  return session;
}

export async function revokeSession(token) {
  const session = await verifySessionToken(token);
  if (!session) return;

  const sessions = await getLoginSessionsCollection();
  await sessions.deleteOne({ _id: session.sessionId, userId: session.id });
}
