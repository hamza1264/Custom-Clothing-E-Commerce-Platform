import { getDatabase } from "@/data/mongodb";
import { requireAdmin } from "@/data/store";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const { id } = await params;
  const result = await (await getDatabase())
    .collection("login_sessions")
    .deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    return Response.json({ error: "Login session not found." }, { status: 404 });
  }

  return Response.json({ success: true });
}
