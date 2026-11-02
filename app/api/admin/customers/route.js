import { getDatabase } from "@/data/mongodb";
import { requireAdmin } from "@/data/store";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const database = await getDatabase();
  const now = new Date();
  const [registeredUsers, loggedInUsers] = await Promise.all([
    database
      .collection("users")
      .find({})
      .project({ _id: 0, name: 1, email: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .toArray(),
    database
      .collection("login_sessions")
      .find({ expiresAt: { $gt: now } })
      .project({
        _id: 0,
        userId: 0,
        sessionId: 0,
        token: 0,
      })
      .sort({ lastSeenAt: -1 })
      .toArray(),
  ]);

  return Response.json(
    {
      registeredUsers,
      loggedInUsers,
      asOf: now,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
