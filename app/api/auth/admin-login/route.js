import { createHash, timingSafeEqual } from "node:crypto";
import { createSession, isAuthConfigured } from "@/data/auth";
import {
  normalizeEmail,
  readAuthRequest,
} from "@/data/authRequest";
import { getDatabase } from "@/data/mongodb";
import { isAdminEmail, isAdminLoginConfigured } from "@/data/store";

export const runtime = "nodejs";

function matchesAdminPassword(password) {
  const submittedHash = createHash("sha256").update(password, "utf8").digest();
  const configuredHash = createHash("sha256")
    .update(process.env.ADMIN_PASSWORD, "utf8")
    .digest();
  return timingSafeEqual(submittedHash, configuredHash);
}

export async function POST(request) {
  if (!isAuthConfigured() || !isAdminLoginConfigured()) {
    return Response.json(
      {
        error:
          "Admin login is not configured. Set ADMIN_EMAILS and ADMIN_PASSWORD (at least 12 characters).",
      },
      { status: 503 }
    );
  }

  const parsed = await readAuthRequest(request);
  if (parsed.response) return parsed.response;

  const email = normalizeEmail(parsed.body?.email);
  const password = parsed.body?.password;
  if (
    !email ||
    email.length > 254 ||
    typeof password !== "string" ||
    Buffer.byteLength(password, "utf8") > 1024
  ) {
    return Response.json(
      { error: "Admin email or password is incorrect." },
      { status: 401 }
    );
  }

  const passwordMatches = matchesAdminPassword(password);
  if (!isAdminEmail(email) || !passwordMatches) {
    return Response.json(
      { error: "Admin email or password is incorrect." },
      { status: 401 }
    );
  }

  const user = await (await getDatabase())
    .collection("users")
    .findOne({ email }, { projection: { name: 1 } });
  const name = user?.name || "Store Admin";

  await createSession(
    {
      id: user ? user._id.toString() : `admin:${email}`,
      name,
      email,
    },
    { isAdmin: true }
  );

  return Response.json({ user: { name, email } });
}
