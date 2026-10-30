import bcrypt from "bcryptjs";
import { createSession, isAuthConfigured } from "@/data/auth";
import {
  authNotConfiguredResponse,
  normalizeEmail,
  readAuthRequest,
} from "@/data/authRequest";
import { getDatabase } from "@/data/mongodb";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isAuthConfigured()) return authNotConfiguredResponse();

  const parsed = await readAuthRequest(request);
  if (parsed.response) return parsed.response;

  const email = normalizeEmail(parsed.body?.email);
  const { password } = parsed.body ?? {};
  if (
    !email ||
    email.length > 254 ||
    typeof password !== "string" ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return Response.json(
      { error: "Email or password is incorrect." },
      { status: 401 }
    );
  }

  const database = await getDatabase();
  const user = await database.collection("users").findOne({ email });
  const passwordMatches =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!user || !passwordMatches) {
    return Response.json(
      { error: "Email or password is incorrect." },
      { status: 401 }
    );
  }

  await createSession({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  });

  return Response.json({ user: { name: user.name, email: user.email } });
}
