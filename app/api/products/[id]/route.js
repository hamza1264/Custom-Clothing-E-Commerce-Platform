import {
  cleanProductInput,
  getProductsCollection,
  isDatabaseConfigured,
  isValidProductInput,
  publicProduct,
  readJsonBody,
  requireAdmin,
  storeNotConfiguredResponse,
} from "@/data/store";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();

  const { id } = await params;
  const collection = await getProductsCollection();
  const product = await collection.findOne({ id });

  if (!product || product.active === false) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  return Response.json({ product: publicProduct(product) });
}

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;
  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();

  const { id } = await params;
  const parsed = await readJsonBody(request);
  if (parsed.response) return parsed.response;
  if (!parsed.body || typeof parsed.body !== "object" || Array.isArray(parsed.body)) {
    return Response.json({ error: "Product details are invalid." }, { status: 400 });
  }

  const collection = await getProductsCollection();
  const existing = await collection.findOne({ id });
  if (!existing) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  const productInput = {
    ...publicProduct(existing),
    ...parsed.body,
    id,
  };
  if (!isValidProductInput(productInput)) {
    return Response.json({ error: "Product details are invalid." }, { status: 400 });
  }

  const product = {
    ...cleanProductInput(productInput),
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date(),
  };
  await collection.replaceOne({ id }, product);

  return Response.json({ product: publicProduct(product) });
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();
  if (admin.response) return admin.response;
  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();

  const { id } = await params;
  const collection = await getProductsCollection();
  const result = await collection.deleteOne({ id });
  if (result.deletedCount === 0) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  return Response.json({ success: true });
}
