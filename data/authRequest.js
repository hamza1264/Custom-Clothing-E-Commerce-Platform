export async function readAuthRequest(request) {
  try {
    return { body: await request.json() };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { response: Response.json({ error: "Invalid request body." }, { status: 400 }) };
    }
    throw error;
  }
}

export function authNotConfiguredResponse() {
  return Response.json(
    {
      error:
        "Account login is not configured. Set MONGODB_URI, MONGODB_DB_NAME, and AUTH_SECRET in .env.local.",
    },
    { status: 503 }
  );
}

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function isValidEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
