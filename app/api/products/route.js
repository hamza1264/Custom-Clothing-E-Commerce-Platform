import {
  cleanProductInput,
  getProductsCollection,
  isDatabaseConfigured,
  isValidProductId,
  isValidProductInput,
  publicProduct,
  readJsonBody,
  requireAdmin,
  storeNotConfiguredResponse,
} from "@/data/store";

export const runtime = "nodejs";

export async function GET(request) {
  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();

  const includeInactive =
    new URL(request.url).searchParams.get("includeInactive") === "true";

  if (includeInactive) {
    const admin = await requireAdmin();
    if (admin.response) return admin.response;
  }

  const collection = await getProductsCollection();
  const products = await collection
    .find(includeInactive ? {} : { active: { $ne: false } })
    .sort({ createdAt: 1, id: 1 })
    .toArray();

  return Response.json(
    { products: products.map(publicProduct) },
    includeInactive ? { headers: { "Cache-Control": "no-store" } } : undefined
  );
}

export async function POST(request) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;
  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();

  const parsed = await readJsonBody(request);
  if (parsed.response) return parsed.response;
  if (!isValidProductId(parsed.body?.id)) {
    return Response.json(
      {
        error:
          "Enter a product ID using only letters, numbers, hyphens, or underscores (max 80 characters).",
      },
      { status: 400 }
    );
  }
  if (!isValidProductInput(parsed.body)) {
    return Response.json({ error: "Product details are invalid." }, { status: 400 });
  }

  const collection = await getProductsCollection();
  const now = new Date();
  const product = {
    ...cleanProductInput(parsed.body),
    id: parsed.body.id.trim(),
    createdAt: now,
    updatedAt: now,
  };
  try {
    await collection.insertOne(product);
  } catch (error) {
    if (error?.code === 11000) {
      return Response.json(
        { error: "That product ID is already in use. Choose another ID." },
        { status: 409 }
      );
    }
    throw error;
  }

  return Response.json({ product: publicProduct(product) }, { status: 201 });
}
