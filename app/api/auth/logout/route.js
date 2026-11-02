import { cookies } from "next/headers";
import { revokeSession, SESSION_COOKIE_NAME } from "@/data/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  await revokeSession(token);
  cookieStore.delete(SESSION_COOKIE_NAME);
  return Response.json({ success: true });
}
