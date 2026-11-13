import { getDatabase } from "@/data/mongodb";
import { requireAdmin } from "@/data/store";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const now = new Date();
  const registrations = await (await getDatabase())
    .collection("pending_email_verifications")
    .find({ expiresAt: { $gt: now } })
    .project({ name: 1, email: 1, createdAt: 1, expiresAt: 1 })
    .sort({ createdAt: -1 })
    .toArray();

  return Response.json(
    {
      pendingEmailVerifications: registrations.map(
        ({ _id, name, email, createdAt, expiresAt }) => ({
          id: _id.toString(),
          name,
          email,
          createdAt,
          expiresAt,
        })
      ),
      asOf: now,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
