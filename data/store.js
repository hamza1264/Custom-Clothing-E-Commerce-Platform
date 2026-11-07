import { getSession, isAuthConfigured } from "@/data/auth";
import { getDatabase } from "@/data/mongodb";
import { initialProducts, normalizeProduct } from "@/data/products";

const globalForStore = globalThis;

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB_NAME);
}

export function storeNotConfiguredResponse() {
  return Response.json(
    { error: "The store database is not configured." },
    { status: 503 }
  );
}

export async function readJsonBody(request) {
  try {
    return { body: await request.json() };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        response: Response.json({ error: "Invalid request body." }, { status: 400 }),
      };
    }
    throw error;
  }
}

export async function requireAdmin() {
  if (!isAuthConfigured()) {
    return {
      response: Response.json(
        {
          error:
            "Configure MongoDB, AUTH_SECRET, ADMIN_EMAILS, and ADMIN_PASSWORD first.",
        },
        { status: 503 }
      ),
    };
  }

  if (!isAdminLoginConfigured()) {
    return {
      response: Response.json(
        {
          error:
            "Set ADMIN_EMAILS and ADMIN_PASSWORD (at least 12 characters) to enable admin access.",
        },
        { status: 503 }
      ),
    };
  }

  const session = await getSession();
  if (!session) {
    return {
      response: Response.json({ error: "Sign in to continue." }, { status: 401 }),
    };
  }

  if (!session.isAdmin || !isAdminEmail(session.email)) {
    return {
      response: Response.json({ error: "Admin access is required." }, { status: 403 }),
    };
  }

  return { session };
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  return (
    typeof email === "string" &&
    getAdminEmails().includes(email.trim().toLowerCase())
  );
}

export function isAdminLoginConfigured() {
  const password = process.env.ADMIN_PASSWORD;
  return (
    getAdminEmails().length > 0 &&
    typeof password === "string" &&
    password.length >= 12 &&
    Buffer.byteLength(password, "utf8") <= 1024
  );
}

export function publicProduct(product) {
  const { _id, createdAt, updatedAt, ...fields } = product;
  return normalizeProduct(fields);
}

export async function getProductsCollection() {
  const collection = (await getDatabase()).collection("products");
  await collection.createIndex({ id: 1 }, { unique: true });

  if (!globalForStore.productSeedPromise) {
    globalForStore.productSeedPromise = (async () => {
      for (const product of initialProducts) {
        await collection.updateOne(
          { id: product.id },
          {
            $setOnInsert: {
              ...product,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
      }
    })();
  }

  try {
    await globalForStore.productSeedPromise;
  } catch (error) {
    globalForStore.productSeedPromise = null;
    throw error;
  }

  return collection;
}

export function isValidProductId(id) {
  return (
    typeof id === "string" &&
    id.length > 0 &&
    id.length <= 80 &&
    /^[a-zA-Z0-9_-]+$/.test(id)
  );
}

export function isValidProductInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const title = input.title ?? input.name;
  return (
    isValidProductId(input.id) &&
    typeof title === "string" &&
    title.trim().length >= 2 &&
    title.trim().length <= 120 &&
    typeof input.price === "number" &&
    Number.isFinite(input.price) &&
    input.price >= 0 &&
    input.price <= 10000000 &&
    (input.originalPrice === undefined ||
      (typeof input.originalPrice === "number" &&
        Number.isFinite(input.originalPrice) &&
        input.originalPrice >= 0 &&
        input.originalPrice <= 10000000)) &&
    typeof input.description === "string" &&
    input.description.trim().length <= 4000 &&
    typeof input.category === "string" &&
    input.category.trim().length <= 80 &&
    Array.isArray(input.images) &&
    input.images.length > 0 &&
    input.images.length <= 10 &&
    input.images.every(
      (image) =>
        typeof image === "string" &&
        image.length <= 500 &&
        ((image.startsWith("/") && !image.startsWith("//")) ||
          image.startsWith("https://"))
    ) &&
    Array.isArray(input.sizes) &&
    input.sizes.length > 0 &&
    input.sizes.length <= 20 &&
    input.sizes.every(
      (size) => typeof size === "string" && size.length > 0 && size.length <= 20
    ) &&
    Array.isArray(input.colors) &&
    input.colors.length > 0 &&
    input.colors.length <= 20 &&
    input.colors.every(
      (color) =>
        (typeof color === "string" && color.length > 0 && color.length <= 40) ||
        (color &&
          typeof color === "object" &&
          typeof color.name === "string" &&
          color.name.length <= 40 &&
          (color.hex === undefined ||
            (typeof color.hex === "string" && /^#[\da-f]{6}$/i.test(color.hex))))
    ) &&
    (input.features === undefined ||
      (Array.isArray(input.features) &&
        input.features.length <= 30 &&
        input.features.every(
          (feature) => typeof feature === "string" && feature.length <= 200
        ))) &&
    (input.fabric === undefined ||
      (typeof input.fabric === "string" && input.fabric.length <= 100)) &&
    (input.fabricCare === undefined ||
      (typeof input.fabricCare === "string" && input.fabricCare.length <= 1000)) &&
    (input.discount === undefined ||
      (typeof input.discount === "string" && input.discount.length <= 40)) &&
    (input.rating === undefined ||
      (typeof input.rating === "number" &&
        Number.isFinite(input.rating) &&
        input.rating >= 0 &&
        input.rating <= 5)) &&
    (input.reviewsCount === undefined ||
      (Number.isInteger(input.reviewsCount) &&
        input.reviewsCount >= 0 &&
        input.reviewsCount <= 1000000)) &&
    (input.active === undefined || typeof input.active === "boolean")
  );
}

export function cleanProductInput(input) {
  const title = (input.title ?? input.name).trim();
  const images = input.images;
  return normalizeProduct({
    id: input.id,
    title,
    name: title,
    description: input.description.trim(),
    category: input.category.trim(),
    price: Math.round(input.price),
    originalPrice:
      typeof input.originalPrice === "number" &&
      Number.isFinite(input.originalPrice) &&
      input.originalPrice >= 0
        ? Math.round(input.originalPrice)
        : Math.round(input.price),
    discount:
      typeof input.discount === "string"
        ? input.discount.trim()
        : "",
    rating: input.rating ?? 0,
    reviewsCount: input.reviewsCount ?? 0,
    images,
    image: images[0],
    fabric: typeof input.fabric === "string" ? input.fabric.trim() : "",
    features: Array.isArray(input.features) ? input.features : [],
    active: input.active !== false,
    sizes: input.sizes,
    colors: input.colors,
    fabricCare:
      typeof input.fabricCare === "string" ? input.fabricCare.trim() : "",
    reviews: Array.isArray(input.reviews) ? input.reviews : [],
  });
}

export const ORDER_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
