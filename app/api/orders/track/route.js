import { getDatabase } from "@/data/mongodb";
import { isDatabaseConfigured, storeNotConfiguredResponse } from "@/data/store";

export const runtime = "nodejs";

export async function GET(request) {
  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();

  const url = new URL(request.url);
  const orderNumber = url.searchParams.get("orderNumber")?.trim().toUpperCase() ?? "";
  const phone = url.searchParams.get("phone")?.replace(/\D/g, "") ?? "";

  if (!/^NF-[A-F0-9]{20}$/.test(orderNumber) || phone.length < 7 || phone.length > 20) {
    return Response.json(
      { error: "Enter a valid order number and phone number." },
      { status: 400 }
    );
  }

  const database = await getDatabase();
  const order = await database.collection("orders").findOne(
    { orderNumber, phoneNormalized: phone },
    {
      projection: {
        _id: 0,
        orderNumber: 1,
        status: 1,
        history: 1,
        createdAt: 1,
        total: 1,
        items: 1,
      },
    }
  );

  if (!order) {
    return Response.json(
      { error: "No order matched that order number and phone number." },
      { status: 404 }
    );
  }

  return Response.json({
    order: {
      ...order,
      items: order.items.map(({ title, quantity }) => ({ title, quantity })),
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
