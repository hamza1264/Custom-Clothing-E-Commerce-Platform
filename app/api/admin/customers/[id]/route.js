import { ObjectId } from "mongodb";
import { getDatabase } from "@/data/mongodb";
import { isAdminEmail, requireAdmin } from "@/data/store";

export const runtime = "nodejs";

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const { id } = await params;
  if (!/^[\da-f]{24}$/i.test(id)) {
    return Response.json({ error: "Registered user not found." }, { status: 404 });
  }

  const database = await getDatabase();
  const users = database.collection("users");
  const user = await users.findOne(
    { _id: new ObjectId(id) },
    { projection: { email: 1 } }
  );
  if (!user) {
    return Response.json({ error: "Registered user not found." }, { status: 404 });
  }
  if (isAdminEmail(user.email)) {
    return Response.json(
      { error: "Admin accounts cannot be deleted from this page." },
      { status: 403 }
    );
  }

  await database
    .collection("login_sessions")
    .deleteMany({ userId: user._id.toString() });
  await users.deleteOne({ _id: user._id });

  return Response.json({ success: true });
}
