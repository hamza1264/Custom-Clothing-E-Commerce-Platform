import { getDatabase } from "@/data/mongodb";
import { requireAdmin } from "@/data/store";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const collection = (await getDatabase()).collection("contact_messages");
  const [messages, totalCount] = await Promise.all([
    collection.find({}).sort({ createdAt: -1 }).limit(250).toArray(),
    collection.countDocuments(),
  ]);

  return Response.json(
    {
      totalCount,
      messages: messages.map(({ _id, ...message }) => ({
        ...message,
        id: _id.toString(),
      })),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
