import { randomBytes } from "node:crypto";
import { getSession, isAuthConfigured } from "@/data/auth";
import { authNotConfiguredResponse } from "@/data/authRequest";
import { getDatabase } from "@/data/mongodb";
import { getShippingCost } from "@/data/cartStore";
import {
  getProductsCollection,
  isDatabaseConfigured,
  readJsonBody,
  storeNotConfiguredResponse,
} from "@/data/store";

export const runtime = "nodejs";

function normalizePhone(phone) {
  return phone.replace(/\D/g, "");
}

function validCustomer(customer) {
  return (
    customer &&
    typeof customer.name === "string" &&
    customer.name.trim().length >= 2 &&
    customer.name.trim().length <= 100 &&
    typeof customer.phone === "string" &&
    customer.phone.length <= 30 &&
    normalizePhone(customer.phone).length >= 7 &&
    normalizePhone(customer.phone).length <= 20 &&
    typeof customer.address === "string" &&
    customer.address.trim().length >= 5 &&
    customer.address.trim().length <= 500
  );
}

export async function GET() {
  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();
  if (!isAuthConfigured()) {
    return Response.json(
      { error: "Account access is not configured." },
      { status: 503 }
    );
  }

  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Sign in to view your orders." }, { status: 401 });
  }

  const database = await getDatabase();
  const orders = await database
    .collection("orders")
    .find({ userId: session.id })
    .sort({ createdAt: -1 })
    .project({ _id: 0, customer: 0, phoneNormalized: 0 })
    .toArray();

  return Response.json(
    { orders },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request) {
  if (!isAuthConfigured()) return authNotConfiguredResponse();

  const session = await getSession();
  if (!session) {
    return Response.json(
      { error: "Please log in before placing your order.", loginRequired: true },
      { status: 401 }
    );
  }

  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();

  const parsed = await readJsonBody(request);
  if (parsed.response) return parsed.response;

  const { customer, items } = parsed.body ?? {};
  if (!validCustomer(customer) || !Array.isArray(items) || items.length === 0 || items.length > 30) {
    return Response.json(
      { error: "Enter valid delivery details and at least one product." },
      { status: 400 }
    );
  }

  const productIds = [
    ...new Set(
      items
        .filter((item) => item && (typeof item.productId === "string" || typeof item.productId === "number"))
        .map((item) => String(item.productId))
    ),
  ];
  if (productIds.length === 0 || productIds.length !== new Set(items.map((item) => String(item?.productId))).size) {
    return Response.json({ error: "One or more cart items are invalid." }, { status: 400 });
  }

  const productsCollection = await getProductsCollection();
  const products = await productsCollection
    .find({ id: { $in: productIds }, active: { $ne: false } })
    .toArray();
  const productsById = new Map(products.map((product) => [product.id, product]));
  const orderItems = [];

  for (const item of items) {
    const productId = String(item?.productId ?? "");
    const product = productsById.get(productId);
    if (
      !product ||
      typeof item.size !== "string" ||
      item.size.length > 30 ||
      !product.sizes.includes(item.size) ||
      typeof item.color !== "string" ||
      item.color.length > 40 ||
      !product.colors.some((color) => color.name === item.color) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    ) {
      return Response.json(
        { error: "A cart item is no longer available or has invalid options." },
        { status: 400 }
      );
    }

    orderItems.push({
      productId,
      title: product.title,
      image: product.images[0],
      price: product.price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    });
  }

  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = getShippingCost(subtotal);
  const now = new Date();
  const orderNumber = `NF-${randomBytes(10).toString("hex").toUpperCase()}`;
  const order = {
    orderNumber,
    userId: session.id,
    customer: {
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      address: customer.address.trim(),
    },
    phoneNormalized: normalizePhone(customer.phone),
    items: orderItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
    paymentMethod: "Cash on Delivery",
    status: "confirmed",
    history: [{ status: "confirmed", at: now }],
    createdAt: now,
    updatedAt: now,
  };

  const database = await getDatabase();
  const orders = database.collection("orders");
  await orders.createIndex({ orderNumber: 1 }, { unique: true });
  await orders.createIndex({ userId: 1, createdAt: -1 });
  await orders.insertOne(order);

  return Response.json(
    {
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
      },
    },
    { status: 201 }
  );
}
