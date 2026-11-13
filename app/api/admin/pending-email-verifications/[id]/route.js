import { ObjectId } from "mongodb";
import { getDatabase } from "@/data/mongodb";
import { requireAdmin } from "@/data/store";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const { id } = await params;
  if (!/^[\da-f]{24}$/i.test(id)) {
    return Response.json(
      { error: "Pending email verification not found." },
      { status: 404 }
    );
  }

  const result = await (await getDatabase())
    .collection("pending_email_verifications")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return Response.json(
      { error: "Pending email verification not found." },
      { status: 404 }
    );
  }

  return Response.json({ success: true });
}
