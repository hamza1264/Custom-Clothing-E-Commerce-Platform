import { getDatabase } from "@/data/mongodb";
import {
  ORDER_STATUSES,
  readJsonBody,
  requireAdmin,
} from "@/data/store";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;

  const { orderNumber } = await params;
  const parsed = await readJsonBody(request);
  if (parsed.response) return parsed.response;

  const status = parsed.body?.status;
  if (!ORDER_STATUSES.includes(status)) {
    return Response.json({ error: "Order status is invalid." }, { status: 400 });
  }

  const database = await getDatabase();
  const orders = database.collection("orders");
  const existing = await orders.findOne({ orderNumber });
  if (!existing) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  const now = new Date();
  const history =
    existing.status === status
      ? existing.history
      : [...existing.history, { status, at: now }];
  await orders.updateOne(
    { orderNumber },
    { $set: { status, history, updatedAt: now } }
  );

  return Response.json({ orderNumber, status, history });
}
