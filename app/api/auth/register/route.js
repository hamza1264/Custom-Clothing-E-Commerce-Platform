import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { createSession, isAuthConfigured } from "@/data/auth";
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

  const user = {
    name: normalizedName,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    createdAt: new Date(),
  };

  let result;
  try {
    result = await users.insertOne(user);
  } catch (error) {
    if (error?.code === 11000) {
      return Response.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }
    throw error;
  }

  await createSession({
    id: result.insertedId.toString(),
    name: user.name,
    email: user.email,
  });

  return Response.json(
    { user: { name: user.name, email: user.email } },
    { status: 201 }
  );
}
