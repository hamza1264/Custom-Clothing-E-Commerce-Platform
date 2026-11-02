import { getDatabase } from "@/data/mongodb";
import { requireAdmin } from "@/data/store";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const database = await getDatabase();
  const orders = await database
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .project({ _id: 0, phoneNormalized: 0 })
    .toArray();

  return Response.json(
    { orders },
    { headers: { "Cache-Control": "no-store" } }
  );
}
